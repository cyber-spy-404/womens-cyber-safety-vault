# Privacy-First Digital Evidence Locker

> **A zero-knowledge, forensic-grade digital evidence custody platform for survivors of cyber harassment, deepfake abuse, and online stalking.**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/cyber-spy-404/womens-cyber-safety-vault)

---

## 🛡️ Core Security Architecture

```
[User Browser] ---> (Client-Side Encryption: AES-256-GCM) ---> [Encrypted Payload]
      |                                                                 |
      v                                                                 v
[Generate SHA-256 Hash] ----------------------------------------> [Backend Custodian]
                                                                        |
                                                                        v
                                                               [Immutable Ledger]
                                                             (SQLite / PostgreSQL)
```

### 1. Zero-Knowledge Cryptography (Client-Side)
- **Key Derivation**: Master key derived in-browser via **PBKDF2-HMAC-SHA256 (600,000 iterations)**.
- **Envelope Encryption**: Each evidence file is encrypted using a unique, random 256-bit **File Encryption Key (FEK)** under **AES-256-GCM** with a 96-bit random IV. The FEK is wrapped using the user's Master Key.
- **Zero Server Knowledge**: Plaintext files and master passwords never leave the client's memory. The custodian database and storage vault persist only ciphertext and encrypted keys.

### 2. Legal Chain of Custody & Fingerprinting
- **SHA-256 Digital Fingerprint**: Computed directly in-browser prior to encryption (`crypto.subtle.digest`).
- **Server Timestamp Authority**: Server logs authoritative UTC timestamp upon arrival.
- **Digital Custodian Seal**: HMAC-SHA256 digital signature binds `(evidence_id, file_hash, timestamp)` to prove the evidence was anchored at that exact moment.
- **Courtroom Verification**: If an evidence file is modified by a single pixel or byte, re-hashing will fail the verification test.

### 3. Automatic Metadata & EXIF Stripping
- Strips hidden EXIF and GPS markers (`APP1 / 0xFFE1` in JPEG, `tEXt / zTXt / eXIf` in PNG) to protect the survivor's physical location and device identifiers.
- Extracts sanitized technical attributes into a separate encrypted audit log.

### 4. Survivor Safety Features
- **Emergency Quick Exit**: Hotkey (`Double-press ESC`) or top-bar button immediately clears browser memory, purges session storage, and redirects to Google.
- **24-Word BIP-39 Recovery Phrase**: Offline disaster recovery if the survivor forgets their password, ensuring evidence is never permanently lost.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ (Node.js v22 recommended with native `node:sqlite`)
- npm

### Installation & Run

1. Clone or navigate to the project directory:
   ```bash
   cd "Cybersecurity Women's Cyber Safety Project"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the application:
   ```bash
   npm start
   ```

4. Open your browser:
   ```
   http://localhost:3000
   ```

---

## ☁️ Cloud Deployment (Render Blueprint)

This project contains a turnkey **Render Blueprint** ([render.yaml](file:///d:/Projects/Cybersecurity%20Women's%20Cyber%20Safety%20Project/render.yaml)) and `.node-version` (Node 22 LTS for native `node:sqlite`).

### 1-Click Deployment
1. Push your repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** > **Blueprint**.
3. Select your `womens-cyber-safety-vault` repository.
4. Render will automatically read [render.yaml](file:///d:/Projects/Cybersecurity%20Women's%20Cyber%20Safety%20Project/render.yaml), generate cryptographically secure secrets (`CUSTODIAN_SECRET`, `JWT_SECRET`), provision the Node.js 22 container, and perform automated zero-downtime healthchecks via `/api/health`.

### Environment Configuration
| Variable | Description | Default / Provisioning |
| :--- | :--- | :--- |
| `NODE_VERSION` | Node.js engine version (>= 22.5.0 required for `node:sqlite`) | `22.14.0` |
| `NODE_ENV` | Production environment flag | `production` |
| `CUSTODIAN_SECRET` | 256-bit HMAC secret for legal chain-of-custody seals | `generateValue: true` |
| `JWT_SECRET` | Token signing secret for survivor vault sessions | `generateValue: true` |
| `DATA_DIR` | Storage mount path (optional; for persistent disks) | `./server` |

---

## 📂 Project Structure

```text
├── package.json
├── README.md
├── server/
│   ├── server.js          # Custodian API Gateway, JWT auth, timestamp authority & verification
│   ├── db.js              # SQLite database layer using node:sqlite
│   ├── evidence_locker.db # Local database storing evidence hashes and audit logs
│   └── vault/             # Directory storing encrypted binary blobs (.enc)
└── public/
    ├── index.html         # Single-page interface with trauma-informed design & emergency exit
    ├── css/
    │   └── style.css      # Dark-mode glassmorphic styling, responsive layout
    ├── vendor/
    │   ├── jspdf.umd.min.js # Local air-gapped PDF generation library
    │   └── jszip.min.js     # Local air-gapped ZIP bundling library
    └── js/
        ├── bip39-words.js # Standard 2048-word BIP-39 wordlist for offline recovery
        ├── crypto.js      # Zero-knowledge Web Crypto API engine
        ├── sanitizer.js   # Client-side EXIF/GPS parser and binary stripper
        ├── report.js      # Certified Forensic PDF report and ZIP package exporter
        └── app.js         # Application state, 4-stage upload pipeline, verifier logic
```

---

## ⚖️ Forensic Export & Court Verification

1. **Export Legal Bundle**:
   Clicking **"Export Report"** on any anchored evidence item decrypts the file locally in memory and generates a `.zip` archive containing:
   - The decrypted evidence file (`.png`, `.jpg`, `.pdf`, etc.).
   - A signed **Forensic Chain of Custody Certificate (PDF)** with immutable SHA-256 fingerprint, server UTC timestamp, and custodian seal.
   - A machine-readable `chain_of_custody_manifest.json`.

2. **Independent Verification**:
   Attorneys or forensic investigators can visit the **"Forensic Verifier"** tab and drag any file into the portal. The browser computes its SHA-256 hash and validates it against the custodial ledger to verify whether the file remains untampered.
