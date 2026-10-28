// Client-Side Zero-Knowledge Web Crypto Engine
// Enforces PBKDF2-HMAC-SHA256 (600,000 iterations), AES-256-GCM, and SHA-256 digital fingerprinting

const LockerCrypto = {
  // Utility: Buffer <-> Hex
  bufToHex(buffer) {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  },

  hexToBuf(hexString) {
    const bytes = new Uint8Array(Math.ceil(hexString.length / 2));
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
    }
    return bytes.buffer;
  },

  // Utility: Buffer <-> Base64
  bufToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  },

  base64ToBuf(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  },

  // Generate 16-byte cryptographically secure random salt
  generateSalt() {
    const salt = new Uint8Array(16);
    window.crypto.getRandomValues(salt);
    return this.bufToHex(salt);
  },

  // SHA-256 digital fingerprint of any ArrayBuffer
  async computeSHA256(arrayBuffer) {
    const hashBuf = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
    return this.bufToHex(hashBuf);
  },

  // Derive client authentication verifier (never transmits plaintext password)
  async deriveAuthVerifier(password, saltHex) {
    const enc = new TextEncoder();
    const pwBuffer = enc.encode(password + '|evidence_locker_auth|' + saltHex);
    const hash = await window.crypto.subtle.digest('SHA-256', pwBuffer);
    return this.bufToHex(hash);
  },

  // Derive Master Encryption Key (MEK) via PBKDF2 with 600,000 iterations
  async deriveMasterKey(password, saltHex) {
    const enc = new TextEncoder();
    const pwKey = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const saltBuffer = this.hexToBuf(saltHex);
    const masterKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations: 600000,
        hash: 'SHA-256'
      },
      pwKey,
      { name: 'AES-GCM', length: 256 },
      true, // extractable for wrapping
      ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey']
    );

    return masterKey;
  },

  // Generate 24-word BIP-39 recovery phrase
  generateBip39Phrase() {
    if (!window.BIP39_WORDLIST || window.BIP39_WORDLIST.length < 2048) {
      throw new Error('BIP-39 wordlist not loaded');
    }

    const words = [];
    const randomVals = new Uint16Array(24);
    window.crypto.getRandomValues(randomVals);

    for (let i = 0; i < 24; i++) {
      const idx = randomVals[i] % 2048;
      words.push(window.BIP39_WORDLIST[idx]);
    }

    return words;
  },

  // Hash BIP-39 phrase for account recovery verification
  async hashBip39Phrase(phrase) {
    const normalized = phrase.trim().toLowerCase().replace(/\s+/g, ' ');
    const enc = new TextEncoder();
    const hashBuf = await window.crypto.subtle.digest('SHA-256', enc.encode(normalized));
    return this.bufToHex(hashBuf);
  },

  // Derive Master Key from BIP-39 recovery phrase
  async deriveMasterKeyFromBip39(phrase, saltHex) {
    const normalized = phrase.trim().toLowerCase().replace(/\s+/g, ' ');
    return await this.deriveMasterKey(normalized, saltHex);
  },

  // Generate ephemeral File Encryption Key (FEK)
  async generateFEK() {
    return await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  },

  // Wrap FEK using Master Key
  async wrapFEK(fek, masterKey) {
    const iv = new Uint8Array(12);
    window.crypto.getRandomValues(iv);

    // Export raw FEK bytes
    const rawFek = await window.crypto.subtle.exportKey('raw', fek);

    // Encrypt raw FEK with Master Key
    const encryptedKeyBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      masterKey,
      rawFek
    );

    return {
      wrapped_fek: this.bufToBase64(encryptedKeyBuffer),
      wrap_iv: this.bufToBase64(iv)
    };
  },

  // Unwrap FEK using Master Key
  async unwrapFEK(wrappedFekBase64, wrapIvBase64, masterKey) {
    const encryptedKeyBuffer = this.base64ToBuf(wrappedFekBase64);
    const iv = this.base64ToBuf(wrapIvBase64);

    const rawFek = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      masterKey,
      encryptedKeyBuffer
    );

    return await window.crypto.subtle.importKey(
      'raw',
      rawFek,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  },

  // Encrypt raw ArrayBuffer with FEK (returns ciphertext + 96-bit IV)
  async encryptEvidence(rawArrayBuffer, fek) {
    const iv = new Uint8Array(12);
    window.crypto.getRandomValues(iv);

    const ciphertext = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      fek,
      rawArrayBuffer
    );

    return {
      ciphertextBuffer: ciphertext,
      ivBase64: this.bufToBase64(iv)
    };
  },

  // Decrypt ciphertext ArrayBuffer with FEK and IV
  async decryptEvidence(ciphertextBuffer, ivBase64, fek) {
    const iv = this.base64ToBuf(ivBase64);
    return await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      fek,
      ciphertextBuffer
    );
  }
};

window.LockerCrypto = LockerCrypto;
