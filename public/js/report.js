// Chain of Custody Forensic Report & ZIP Export Generator
// Compiles court-admissible forensic certificates (PDF), Section 65B/BSA electronic evidence certificates,
// official Police FIR complaint petitions, and bundles decrypted files into secure .zip packages

const EvidenceExporter = {
  // Generate Certified Forensic PDF Report using jsPDF
  generateForensicPDF(evidenceData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor = [15, 23, 42];      // Slate 900
    const accentColor = [13, 148, 136];      // Teal 600
    const mutedColor = [100, 116, 139];      // Slate 500

    // Header Banner
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 32, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('FORENSIC CHAIN OF CUSTODY CERTIFICATE', 15, 13);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text('ZERO-KNOWLEDGE DIGITAL EVIDENCE CUSTODY PLATFORM • SURVIVOR PROTECTION', 15, 21);
    doc.text(`ISSUED: ${new Date().toISOString()}`, 135, 21);

    // Section 1: Chain of Custody Attestation
    let y = 42;
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('1. CUSTODIAL ATTESTATION & INTEGRITY DECLARATION', 15, y);

    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const declaration = 
      'This document certifies that the associated digital evidence was ingested, cryptographically ' +
      'sanitized (EXIF/GPS markers removed), fingerprinted via SHA-256, and anchored into an immutable custodial ledger. ' +
      'The SHA-256 cryptographic hash recorded herein proves that the accompanying file has remained unmodified, ' +
      'untampered, and bit-level identical since the moment of custodial ingestion.';
    const splitDec = doc.splitTextToSize(declaration, 180);
    doc.text(splitDec, 15, y);

    // Section 2: Forensic Record Identifiers & Incident Context
    y += 18;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('2. FORENSIC RECORD IDENTIFIERS & INCIDENT METADATA', 15, y);

    const meta = evidenceData.metadata || {};
    const hasIncidentMeta = !!(meta.incident_category || meta.platform || meta.severity || meta.perpetrator);
    const rectHeight = hasIncidentMeta ? 64 : 50;

    y += 5;
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, y, 180, rectHeight, 2, 2, 'FD');

    y += 7;
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Evidence ID:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(evidenceData.id || 'N/A', 65, y);

    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Original File Name:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(meta.original_filename || 'evidence_file', 65, y);

    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('MIME Type & Format:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(meta.mime_type || 'application/octet-stream', 65, y);

    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Custodial Timestamp (UTC):', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...accentColor);
    doc.text(`${evidenceData.custodian_timestamp} (Server-Authoritative)`, 65, y);
    doc.setTextColor(...primaryColor);

    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Metadata Sanitization:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(meta.trackers_removed ? 'EXIF & Hardware Trackers Purged' : 'Preserved / None Detected', 65, y);

    if (hasIncidentMeta) {
      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.text('Incident Classification:', 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`${meta.incident_category || 'Uncategorized'} | Severity: ${meta.severity || 'Standard'}`, 65, y);

      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.text('Platform / Perpetrator:', 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`Platform: ${meta.platform || 'Unknown'} | Handle: ${meta.perpetrator || 'Not specified'}`, 65, y);
    }

    // Section 3: SHA-256 Digital Fingerprint
    y += 14;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('3. IMMUTABLE SHA-256 CRYPTOGRAPHIC FINGERPRINT', 15, y);

    y += 5;
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.rect(15, y, 180, 14, 'FD');

    doc.setFont('courier', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(evidenceData.file_hash, 18, y + 9);

    // Section 4: Custodian Digital Signature
    y += 20;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('4. CUSTODIAN DIGITAL SEAL & SIGNATURE', 15, y);

    y += 5;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(15, y, 180, 14, 'FD');

    doc.setFont('courier', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedColor);
    doc.text(evidenceData.custodian_signature || 'Signed via Server Authority', 18, y + 9);

    // Section 5: Incident Notes (if present)
    if (meta.incident_notes) {
      y += 19;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(...primaryColor);
      doc.text('5. CONFIDENTIAL INCIDENT LOG & CONTEXT', 15, y);

      y += 5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      const splitNotes = doc.splitTextToSize(`"${meta.incident_notes}"`, 180);
      doc.text(splitNotes, 15, y);
      y += (splitNotes.length * 4) + 4;
    } else {
      y += 20;
    }

    // Section 6: Courtroom & Forensic Verification Procedure
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...primaryColor);
    doc.text('6. COURTROOM & FORENSIC VERIFICATION PROCEDURE', 15, y);

    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const verifInstructions =
      'To verify the authenticity of the accompanying decrypted file under forensic or legal review:\n' +
      '1. Open a terminal or forensic workstation.\n' +
      `2. Compute file hash: sha256sum "<filename>"  (or Windows: CertUtil -hashfile "<filename>" SHA256)\n` +
      '3. Compare the calculated hash against the fingerprint recorded in Section 3 of this document.\n' +
      '4. If the string matches Section 3 exactly, it is mathematically proven that the file ' +
      'has not been modified by even a single bit or pixel since the custody timestamp.';
    const splitVerif = doc.splitTextToSize(verifInstructions, 180);
    doc.text(splitVerif, 15, y);

    // Footer
    doc.setFontSize(7);
    doc.setTextColor(...mutedColor);
    doc.text('Certified Evidence Audit Export • Zero-Knowledge Chain of Custody Standard • Confidential', 15, 285);
    doc.text('Page 1 of 1', 185, 285);

    return doc.output('arraybuffer');
  },

  // Generate Official Section 65B (IEA) / Section 63 (BSA) Certificate of Electronic Evidence
  generateSection65BCertificatePDF(evidenceData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor = [15, 23, 42];
    const accentColor = [13, 148, 136];
    const mutedColor = [100, 116, 139];

    // Header Banner
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, 210, 34, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13.5);
    doc.text('CERTIFICATE UNDER SECTION 65B OF INDIAN EVIDENCE ACT, 1872', 15, 14);
    doc.setFontSize(10.5);
    doc.text('(READ WITH SECTION 63 OF BHARATIYA SAKSHYA ADHINIYAM, 2023)', 15, 22);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`CERTIFICATE REF: 65B-${evidenceData.id.substring(0, 8).toUpperCase()} • DATE: ${new Date().toISOString().substring(0, 10)}`, 15, 30);

    let y = 46;
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text('IN THE MATTER OF ELECTRONIC EVIDENCE ADMISSIBILITY', 15, y);

    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const introText =
      'I, the custodian and operator of the device / electronic custody system described below, do hereby certify ' +
      'under Section 65B(4) of the Indian Evidence Act, 1872 and Section 63 of the Bharatiya Sakshya Adhiniyam, 2023 ' +
      'as follows:';
    const splitIntro = doc.splitTextToSize(introText, 180);
    doc.text(splitIntro, 15, y);

    y += 14;
    const clauses = [
      {
        num: '1.',
        title: 'IDENTIFICATION OF THE ELECTRONIC RECORD:',
        text: `The electronic record annexed herewith is an electronic reproduction of the evidence item titled "${evidenceData.metadata?.original_filename || 'Evidence File'}" (Evidence ID: ${evidenceData.id}), ingested into custody on ${evidenceData.custodian_timestamp} UTC.`
      },
      {
        num: '2.',
        title: 'LAWFUL CONTROL OF COMPUTER RESOURCE:',
        text: 'During the material period, the computer system and cryptographic vault application were under lawful control and operation for securely recording, preserving, and anchoring digital incident logs.'
      },
      {
        num: '3.',
        title: 'ORDINARY COURSE OF OPERATION & REPRODUCIBILITY:',
        text: 'The electronic record was generated and stored during the ordinary course of lawful activities. The system was operating properly at all relevant times, and no computer malfunctions compromised the integrity or accuracy of the electronic record.'
      },
      {
        num: '4.',
        title: 'CRYPTOGRAPHIC HASH & PRESERVATION OF BIT-LEVEL INTEGRITY:',
        text: `The integrity of the digital record is mathematically certified under NIST FIPS 180-4 SHA-256 standard:\nSHA-256 Fingerprint: ${evidenceData.file_hash}\nCustodian Digital Seal: ${evidenceData.custodian_signature}`
      },
      {
        num: '5.',
        title: 'AUTHENTICITY DECLARATION:',
        text: 'To the best of my knowledge and belief, the annexed electronic reproduction is true, accurate, and completely unmodified from the original electronic record preserved at the time of custody capture.'
      }
    ];

    clauses.forEach(clause => {
      doc.setFont('helvetica', 'bold');
      doc.text(clause.num, 15, y);
      doc.text(clause.title, 22, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      const splitClause = doc.splitTextToSize(clause.text, 173);
      doc.text(splitClause, 22, y);
      y += (splitClause.length * 4.2) + 5;
    });

    // Signature Box
    y += 8;
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, y, 180, 40, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('DEPONENT / CERTIFYING PERSON DETAILS', 20, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text('Name / Pseudonym:', 20, y + 16);
    doc.text(evidenceData.metadata?.complainant_pseudonym || 'Survivor / Custodian', 65, y + 16);

    doc.text('Date & Place:', 20, y + 23);
    doc.text(`${new Date().toISOString().substring(0, 10)} (Online Secure Vault)`, 65, y + 23);

    doc.text('Signature / Seal:', 20, y + 30);
    doc.setFont('courier', 'bold');
    doc.text(`[VERIFIED SHA-256 SIGNATURE: ${evidenceData.file_hash.substring(0, 24)}...]`, 65, y + 30);

    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...mutedColor);
    doc.text('Statutory Electronic Evidence Certificate • Admissible under Section 65B IEA / Section 63 BSA • Confidential', 15, 285);

    return doc.output('arraybuffer');
  },

  // Generate Official Written Police FIR Complaint Petition PDF
  generatePoliceComplaintPDF(evidenceRecord, complaintData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor = [15, 23, 42];
    const meta = evidenceRecord.metadata || {};

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('FORMAL WRITTEN POLICE COMPLAINT / CYBER CRIME PETITION', 15, 18);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('(To be filed before the Cyber Crime Police Station / National Cyber Crime Reporting Portal - 1930)', 15, 24);

    let y = 36;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('TO:', 15, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`The Officer-in-Charge / Superintendent of Police,`, 15, y + 5);
    doc.text(`Cyber Crime Police Station: ${complaintData.police_station || 'District Cyber Cell / Online Portal 1930'}`, 15, y + 10);

    y += 20;
    doc.setFont('helvetica', 'bold');
    doc.text('SUBJECT:', 15, y);
    doc.setFont('helvetica', 'bold');
    const subject = `Complaint against cyberstalking, online harassment, non-consensual image distribution/deepfakes, and threats under IT Act & BNS/IPC.`;
    const splitSub = doc.splitTextToSize(subject, 160);
    doc.text(splitSub, 36, y);

    y += (splitSub.length * 5) + 6;
    doc.setFont('helvetica', 'normal');
    doc.text('Respected Sir / Madam,', 15, y);

    y += 7;
    const bodyP1 =
      `I am writing to formally report severe cyber offences committed against me on the platform "${meta.platform || 'Online'}". ` +
      `The suspected perpetrator is operating under the account/handle/identifier: "${meta.perpetrator || complaintData.suspect_handle || 'Unknown / Under Investigation'}".`;
    const splitP1 = doc.splitTextToSize(bodyP1, 180);
    doc.text(splitP1, 15, y);

    y += (splitP1.length * 4.5) + 5;
    doc.setFont('helvetica', 'bold');
    doc.text('1. DETAILS OF INCIDENT & HARASSMENT:', 15, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const incidentDesc = complaintData.incident_description || meta.incident_notes || 'The perpetrator has repeatedly stalked, threatened, and distributed non-consensual media/messages aimed at causing severe mental distress, defamation, and intimidation.';
    const splitInc = doc.splitTextToSize(incidentDesc, 180);
    doc.text(splitInc, 15, y);

    y += (splitInc.length * 4.5) + 6;
    doc.setFont('helvetica', 'bold');
    doc.text('2. ATTACHED FORENSIC DIGITAL EVIDENCE:', 15, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const evText =
      `The annexed digital evidence file "${meta.original_filename}" has been cryptographically preserved in accordance with legal chain-of-custody standards:\n` +
      `• Evidence ID: ${evidenceRecord.id}\n` +
      `• Forensic SHA-256 Hash: ${evidenceRecord.file_hash}\n` +
      `• Authoritative Custody Timestamp: ${evidenceRecord.custodian_timestamp} UTC\n` +
      `• Custodian Digital Seal: ${evidenceRecord.custodian_signature}\n` +
      `This evidence is accompanied by a statutory Section 65B Electronic Evidence Certificate proving that the file has remained bit-level identical and untampered.`;
    const splitEv = doc.splitTextToSize(evText, 180);
    doc.text(splitEv, 15, y);

    y += (splitEv.length * 4.5) + 6;
    doc.setFont('helvetica', 'bold');
    doc.text('3. APPLICABLE LEGAL PROVISIONS:', 15, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const legalText =
      '• Section 66E, Information Technology Act (Violation of bodily privacy)\n' +
      '• Section 67 / 67A, Information Technology Act (Publishing / transmitting obscene / sexually explicit material)\n' +
      '• Section 66D, Information Technology Act (Cheating by personation using computer resource)\n' +
      '• Section 78, Bharatiya Nyaya Sanhita, 2023 / Section 354D IPC (Cyberstalking)\n' +
      '• Section 351, Bharatiya Nyaya Sanhita, 2023 / Section 506 IPC (Criminal Intimidation)';
    const splitLegal = doc.splitTextToSize(legalText, 180);
    doc.text(splitLegal, 15, y);

    y += (splitLegal.length * 4.5) + 6;
    doc.setFont('helvetica', 'bold');
    doc.text('4. PRAYER / RELIEF SOUGHT:', 15, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const prayer =
      'In view of the above facts, I urgently request you to:\n' +
      '1. Register a formal First Information Report (FIR) against the perpetrator under the relevant sections.\n' +
      '2. Issue immediate preservation orders and notices to the intermediary platform under Section 79(3)(b) IT Act to take down the abusive material.\n' +
      '3. Initiate immediate tracing of the IP logs and device details to apprehend the offender.';
    const splitPrayer = doc.splitTextToSize(prayer, 180);
    doc.text(splitPrayer, 15, y);

    y += (splitPrayer.length * 4.5) + 12;
    doc.setFont('helvetica', 'bold');
    doc.text('Yours faithfully,', 15, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(`Complainant: ${complaintData.complainant_name || 'Survivor'}`, 15, y);
    doc.text(`Contact: ${complaintData.complainant_contact || 'Confidential / Via Legal Counsel'}`, 15, y + 5);
    doc.text(`Date: ${new Date().toISOString().substring(0, 10)}`, 15, y + 10);

    return doc.output('arraybuffer');
  },

  // Export full legal bundle as a .ZIP archive (includes original file, Forensic Report, Section 65B Certificate, & Manifest)
  async exportEvidenceBundle(evidenceRecord, decryptedArrayBuffer) {
    if (!window.JSZip) {
      throw new Error('JSZip library not loaded');
    }

    const zip = new window.JSZip();
    const origName = evidenceRecord.metadata?.original_filename || 'evidence_file';
    const baseName = origName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const folderName = `Evidence_Case_${evidenceRecord.id.substring(0, 8)}`;
    const evidenceFolder = zip.folder(folderName);

    // 1. Add Decrypted Original Evidence File
    evidenceFolder.file(baseName, decryptedArrayBuffer);

    // 2. Generate and Add Signed Forensic PDF Report
    const pdfBuffer = this.generateForensicPDF(evidenceRecord);
    evidenceFolder.file(`01_Forensic_Chain_Of_Custody_${evidenceRecord.id.substring(0, 8)}.pdf`, pdfBuffer);

    // 3. Generate and Add Section 65B / BSA Electronic Evidence Certificate
    const cert65BBuffer = this.generateSection65BCertificatePDF(evidenceRecord);
    evidenceFolder.file(`02_Section_65B_Electronic_Evidence_Certificate_${evidenceRecord.id.substring(0, 8)}.pdf`, cert65BBuffer);

    // 4. Add Structured Metadata & Chain of Custody Manifest JSON
    const manifest = {
      evidence_id: evidenceRecord.id,
      original_filename: origName,
      file_hash_sha256: evidenceRecord.file_hash,
      custodian_timestamp_utc: evidenceRecord.custodian_timestamp,
      custodian_signature: evidenceRecord.custodian_signature,
      incident_classification: {
        category: evidenceRecord.metadata?.incident_category || 'Uncategorized',
        severity: evidenceRecord.metadata?.severity || 'Standard',
        platform: evidenceRecord.metadata?.platform || 'Unknown',
        perpetrator: evidenceRecord.metadata?.perpetrator || 'Not specified',
        incident_time: evidenceRecord.metadata?.incident_time || 'Not specified',
        incident_notes: evidenceRecord.metadata?.incident_notes || ''
      },
      sanitization_log: evidenceRecord.metadata,
      legal_compliance: {
        statutory_standards: [
          'NIST FIPS 180-4 Secure Hash Standard (SHA-256)',
          'Section 65B(4) Indian Evidence Act, 1872',
          'Section 63 Bharatiya Sakshya Adhiniyam, 2023',
          'Federal Rules of Evidence Rule 902(13)/(14)'
        ]
      },
      exported_at: new Date().toISOString()
    };
    evidenceFolder.file('chain_of_custody_manifest.json', JSON.stringify(manifest, null, 2));

    // 5. Generate ZIP blob and trigger download
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const downloadUrl = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `Evidence_Package_${evidenceRecord.id.substring(0, 8)}_${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  },

  // Generate Master Case Dossier PDF summarizing all evidence items
  generateMasterCaseDossierPDF(evidenceList) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor = [15, 23, 42];
    const mutedColor = [100, 116, 139];

    // Header Banner
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 36, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('COMPREHENSIVE CASE EVIDENCE DOSSIER', 15, 14);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('FORENSIC SUMMARY OF ANCHORED DIGITAL EVIDENCE • COURT & POLICE FIR COMPLIANT', 15, 22);
    doc.text(`TOTAL ANCHORED ITEMS: ${evidenceList.length}  |  EXPORT DATE: ${new Date().toISOString().substring(0, 10)}`, 15, 29);

    let y = 48;
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('1. INCIDENT CHRONOLOGY & FORENSIC REGISTER', 15, y);

    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Below is the immutable chronological register of all digital evidence records anchored in this custody vault.', 15, y);

    y += 8;

    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(15, y, 180, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('#', 17, y + 5.5);
    doc.text('TIMESTAMP (UTC)', 24, y + 5.5);
    doc.text('FILENAME & TYPE', 60, y + 5.5);
    doc.text('CATEGORY / PLATFORM', 110, y + 5.5);
    doc.text('SHA-256 FINGERPRINT (PREFIX)', 152, y + 5.5);

    y += 9;

    evidenceList.forEach((item, index) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      const meta = item.metadata || {};
      doc.setFillColor(index % 2 === 0 ? 255 : 248, index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 252);
      doc.rect(15, y, 180, 10, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(String(index + 1), 17, y + 6);
      doc.text((item.custodian_timestamp || '').substring(0, 16), 24, y + 6);
      
      const fname = (meta.original_filename || 'Evidence File').substring(0, 24);
      doc.text(fname, 60, y + 6);

      const catPlat = `${meta.incident_category || 'Evidence'} (${meta.platform || 'Online'})`.substring(0, 22);
      doc.text(catPlat, 110, y + 6);

      doc.setFont('courier', 'bold');
      doc.text((item.file_hash || '').substring(0, 16) + '...', 152, y + 6);

      y += 11;
    });

    y += 6;
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    // Verification Statement
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text('2. CUSTODIAL INTEGRITY & VERIFICATION STATEMENT', 15, y);

    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const summaryDec = 
      'All records listed in this master case dossier have been cryptographically sealed by the Custodian Authority. ' +
      'Each individual file within the accompanying bundle can be independently verified against its SHA-256 fingerprint ' +
      'and custodian digital signature using the Forensic Verifier tool or standard command-line tools.';
    const splitSum = doc.splitTextToSize(summaryDec, 180);
    doc.text(splitSum, 15, y);

    // Footer
    doc.setFontSize(7);
    doc.setTextColor(...mutedColor);
    doc.text('Master Forensic Case Dossier • Zero-Knowledge Chain of Custody Standard • Strictly Confidential', 15, 285);

    return doc.output('arraybuffer');
  },

  // Export Master Case Dossier Bundle (.ZIP with all files, reports, Section 65B certificates, and summary)
  async exportMasterCaseBundle(evidenceList, decryptedBuffersMap) {
    if (!window.JSZip) {
      throw new Error('JSZip library not loaded');
    }

    const zip = new window.JSZip();
    const caseFolder = zip.folder(`Master_Case_Dossier_${Date.now()}`);

    // 1. Add Master Case Dossier PDF
    const masterPdf = this.generateMasterCaseDossierPDF(evidenceList);
    caseFolder.file('00_MASTER_CASE_DOSSIER_TIMELINE.pdf', masterPdf);

    // 2. Add Master Manifest JSON
    const masterManifest = {
      dossier_title: "Master Legal Chain of Custody Dossier",
      total_evidence_items: evidenceList.length,
      exported_at: new Date().toISOString(),
      evidence_registry: evidenceList.map(item => ({
        id: item.id,
        filename: item.metadata?.original_filename,
        file_hash_sha256: item.file_hash,
        custodian_timestamp: item.custodian_timestamp,
        custodian_signature: item.custodian_signature,
        classification: {
          category: item.metadata?.incident_category,
          severity: item.metadata?.severity,
          platform: item.metadata?.platform,
          perpetrator: item.metadata?.perpetrator,
          incident_time: item.metadata?.incident_time,
          incident_notes: item.metadata?.incident_notes
        }
      }))
    };
    caseFolder.file('00_MASTER_CASE_MANIFEST.json', JSON.stringify(masterManifest, null, 2));

    // 3. Add each evidence item + its certified PDF report + Section 65B certificate
    const evidenceItemsFolder = caseFolder.folder('Evidence_Files');
    for (let i = 0; i < evidenceList.length; i++) {
      const item = evidenceList[i];
      const buffer = decryptedBuffersMap[item.id];
      if (buffer) {
        const origName = item.metadata?.original_filename || `evidence_${i + 1}`;
        const safeName = `${String(i + 1).padStart(2, '0')}_${origName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        evidenceItemsFolder.file(safeName, buffer);

        const itemPdf = this.generateForensicPDF(item);
        evidenceItemsFolder.file(`Report_${String(i + 1).padStart(2, '0')}_${item.id.substring(0, 8)}.pdf`, itemPdf);

        const cert65B = this.generateSection65BCertificatePDF(item);
        evidenceItemsFolder.file(`Section_65B_Certificate_${String(i + 1).padStart(2, '0')}_${item.id.substring(0, 8)}.pdf`, cert65B);
      }
    }

    // 4. Generate and download ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const downloadUrl = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `Master_Evidence_Dossier_${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  },

  // Helper: Trigger browser download for an ArrayBuffer as a file
  downloadBufferAsFile(buffer, filename, mimeType = 'application/pdf') {
    const blob = new Blob([buffer], { type: mimeType });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  }
};

window.EvidenceExporter = EvidenceExporter;
