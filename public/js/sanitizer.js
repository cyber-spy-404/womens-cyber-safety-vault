// Client-Side Metadata & EXIF Sanitizer
// Parses binary files, extracts forensic/environmental metadata to a structured log,
// and strips hidden EXIF/GPS/hardware markers from the raw binary.

const EvidenceSanitizer = {
  // Main entrypoint: Takes a File or ArrayBuffer and returns { sanitizedBuffer, metadata, wasSanitized }
  async processFile(file) {
    const arrayBuffer = await file.arrayBuffer();
    const mime = file.type || 'application/octet-stream';
    const originalMetadata = {
      original_filename: file.name,
      file_size_bytes: file.size,
      mime_type: mime,
      client_last_modified: new Date(file.lastModified).toISOString(),
      sanitization_timestamp: new Date().toISOString(),
      extracted_exif: null,
      trackers_removed: false
    };

    if (mime === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')) {
      return this.sanitizeJPEG(arrayBuffer, originalMetadata);
    } else if (mime === 'image/png' || file.name.toLowerCase().endsWith('.png')) {
      return this.sanitizePNG(arrayBuffer, originalMetadata);
    }

    // For non-image files, retain binary and document file envelope metadata
    return {
      sanitizedBuffer: arrayBuffer,
      metadata: originalMetadata,
      wasSanitized: false
    };
  },

  // JPEG Binary Sanitization & EXIF Extractor
  sanitizeJPEG(buffer, metadata) {
    const dataView = new DataView(buffer);
    const bytes = new Uint8Array(buffer);

    // Verify SOI (Start of Image) marker: 0xFFD8
    if (dataView.getUint16(0) !== 0xFFD8) {
      return { sanitizedBuffer: buffer, metadata, wasSanitized: false };
    }

    const extracted = {};
    const keptChunks = [bytes.slice(0, 2)]; // Start with 0xFFD8
    let offset = 2;
    let strippedAny = false;

    while (offset < bytes.length) {
      if (bytes[offset] !== 0xFF) {
        // Corrupt or non-standard JPEG segment; append remaining bytes and exit
        keptChunks.push(bytes.slice(offset));
        break;
      }

      const marker = bytes[offset + 1];

      // SOS (Start of Scan 0xDA) or EOI (End of Image 0xD9) marks beginning of compressed data
      if (marker === 0xDA || marker === 0xD9) {
        keptChunks.push(bytes.slice(offset));
        break;
      }

      const length = dataView.getUint16(offset + 2);
      const segmentEnd = offset + 2 + length;

      // APP1 Marker (0xFFE1) typically contains EXIF or XMP metadata
      if (marker === 0xE1) {
        strippedAny = true;
        this.parseExifAPP1(bytes.slice(offset + 4, segmentEnd), extracted);
        // Omit this chunk from keptChunks to strip it!
      } else if (marker >= 0xE2 && marker <= 0xEF) {
        // Other APP markers (ICC profiles, previews, proprietary camera tags)
        strippedAny = true;
        // Omit to ensure maximum privacy
      } else {
        // Keep valid structural chunks (SOF, DQT, DHT, etc.)
        keptChunks.push(bytes.slice(offset, segmentEnd));
      }

      offset = segmentEnd;
    }

    // Merge kept chunks into a clean ArrayBuffer
    const totalLength = keptChunks.reduce((acc, c) => acc + c.length, 0);
    const sanitizedBytes = new Uint8Array(totalLength);
    let writeOffset = 0;
    for (const chunk of keptChunks) {
      sanitizedBytes.set(chunk, writeOffset);
      writeOffset += chunk.length;
    }

    metadata.extracted_exif = Object.keys(extracted).length > 0 ? extracted : null;
    metadata.trackers_removed = strippedAny;
    metadata.sanitized_size_bytes = totalLength;

    return {
      sanitizedBuffer: sanitizedBytes.buffer,
      metadata,
      wasSanitized: strippedAny
    };
  },

  // Parse basic EXIF tags from APP1 segment without leaking to raw file
  parseExifAPP1(app1Bytes, output) {
    try {
      const header = String.fromCharCode(...app1Bytes.slice(0, 4));
      if (header !== 'Exif') return;

      // Check TIFF header offset (usually after 'Exif\0\0')
      const tiffOffset = 6;
      const view = new DataView(app1Bytes.buffer, app1Bytes.byteOffset + tiffOffset);
      const isLittleEndian = view.getUint16(0) === 0x4949; // 'II' vs 'MM'

      const firstIFDOffset = view.getUint32(4, isLittleEndian);
      if (firstIFDOffset >= view.byteLength) return;

      const numEntries = view.getUint16(firstIFDOffset, isLittleEndian);
      let entryOffset = firstIFDOffset + 2;

      for (let i = 0; i < numEntries && entryOffset + 12 <= view.byteLength; i++) {
        const tag = view.getUint16(entryOffset, isLittleEndian);

        if (tag === 0x010F) output.camera_make = 'Detected & Stripped';
        if (tag === 0x0110) output.camera_model = 'Detected & Stripped';
        if (tag === 0x0132) output.capture_time = 'Detected & Stripped';
        if (tag === 0x8825) output.gps_coordinates = 'Stripped (Geolocation sanitized)';

        entryOffset += 12;
      }

      output.privacy_status = 'All hardware identifiers, serials, and geolocation coordinates purged.';
    } catch {
      output.parse_note = 'EXIF segment present and successfully stripped.';
    }
  },

  // PNG Metadata Chunk Stripper
  sanitizePNG(buffer, metadata) {
    const bytes = new Uint8Array(buffer);
    const signature = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];

    // Check PNG signature
    for (let i = 0; i < 8; i++) {
      if (bytes[i] !== signature[i]) {
        return { sanitizedBuffer: buffer, metadata, wasSanitized: false };
      }
    }

    const dataView = new DataView(buffer);
    const keptChunks = [bytes.slice(0, 8)];
    let offset = 8;
    let strippedAny = false;
    const extracted = {};

    while (offset < bytes.length) {
      if (offset + 8 > bytes.length) break;

      const length = dataView.getUint32(offset);
      const typeChars = [
        String.fromCharCode(bytes[offset + 4]),
        String.fromCharCode(bytes[offset + 5]),
        String.fromCharCode(bytes[offset + 6]),
        String.fromCharCode(bytes[offset + 7])
      ].join('');

      const chunkTotalSize = 12 + length; // length (4) + type (4) + data (length) + crc (4)
      const chunkData = bytes.slice(offset, offset + chunkTotalSize);

      // Metadata chunks in PNG: tEXt, zTXt, iTXt, eXIf
      if (['tEXt', 'zTXt', 'iTXt', 'eXIf'].includes(typeChars)) {
        strippedAny = true;
        extracted[typeChars] = 'Ancillary tracker chunk removed';
      } else {
        // Keep essential rendering chunks: IHDR, PLTE, IDAT, IEND, etc.
        keptChunks.push(chunkData);
      }

      offset += chunkTotalSize;
    }

    const totalLength = keptChunks.reduce((acc, c) => acc + c.length, 0);
    const sanitizedBytes = new Uint8Array(totalLength);
    let writeOffset = 0;
    for (const chunk of keptChunks) {
      sanitizedBytes.set(chunk, writeOffset);
      writeOffset += chunk.length;
    }

    metadata.extracted_exif = Object.keys(extracted).length > 0 ? extracted : null;
    metadata.trackers_removed = strippedAny;
    metadata.sanitized_size_bytes = totalLength;

    return {
      sanitizedBuffer: sanitizedBytes.buffer,
      metadata,
      wasSanitized: strippedAny
    };
  }
};

window.EvidenceSanitizer = EvidenceSanitizer;
