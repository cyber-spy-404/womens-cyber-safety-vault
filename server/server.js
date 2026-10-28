const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { pipeline } = require('stream/promises');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const VAULT_DIR = path.join(__dirname, 'vault');

if (!fs.existsSync(VAULT_DIR)) {
  fs.mkdirSync(VAULT_DIR, { recursive: true });
}

// Persistent Custodian Authority Key for digital chain-of-custody seals
const KEY_FILE = path.join(__dirname, '.custodian_key');
let CUSTODIAN_SECRET;
if (fs.existsSync(KEY_FILE)) {
  CUSTODIAN_SECRET = fs.readFileSync(KEY_FILE, 'utf8').trim();
} else {
  CUSTODIAN_SECRET = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(KEY_FILE, CUSTODIAN_SECRET, { mode: 0o600 });
}

const JWT_SECRET = process.env.JWT_SECRET || CUSTODIAN_SECRET;

// ── Validation helpers ──────────────────────────────────
const HEX_SHA256_RE = /^[0-9a-f]{64}$/i;
function isValidSHA256Hex(str) { return typeof str === 'string' && HEX_SHA256_RE.test(str); }

/** Constant-time string comparison (prevents timing attacks) */
function timingSafeStringEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/** Hash a file on disk without blocking the event loop */
async function hashFileAsync(filePath) {
  const hash = crypto.createHash('sha256');
  await pipeline(fs.createReadStream(filePath), hash);
  return hash.digest('hex');
}

// ── Rate Limiters ───────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 20,                   // 20 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again later.' }
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Upload rate limit exceeded. Please wait before uploading more evidence.' }
});

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Verification rate limit exceeded.' }
});

// ── Global Middleware ───────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Content Security Policy — defence-in-depth against XSS
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' blob: data:",
    "media-src 'self' blob:",
    "frame-src blob:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://www.google.com"
  ].join('; '));
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../public')));

// ── Multer Configuration ───────────────────────────────
const ALLOWED_MIME_TYPES = new Set([
  'application/octet-stream',
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff',
  'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/mp4', 'audio/aac',
  'video/mp4', 'video/webm', 'video/quicktime',
  'application/pdf',
  'text/plain', 'text/csv', 'application/json',
  'application/zip', 'application/x-zip-compressed'
]);

const fileFilter = (req, file, cb) => {
  // Encrypted blobs always arrive as application/octet-stream,
  // but also allow common evidence types for the verification endpoint
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Unsupported file type'), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, VAULT_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueId = crypto.randomUUID();
    cb(null, `${uniqueId}.enc`);
  }
});
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB max per evidence file
});

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired session token' });
    }
    req.user = user;
    next();
  });
}

// Digital Custodian Signature generator
function signChainOfCustody(evidenceId, fileHash, timestamp) {
  const hmac = crypto.createHmac('sha256', CUSTODIAN_SECRET);
  hmac.update(`${evidenceId}|${fileHash}|${timestamp}`);
  return hmac.digest('hex');
}

// ----------------------------------------------------
// AUTHENTICATION ROUTES (Zero-Knowledge Compatible)
// ----------------------------------------------------

// Retrieve cryptographic salt prior to login
app.post('/api/auth/get-salt', authLimiter, (req, res) => {
  const { email_pseudonym } = req.body;
  if (!email_pseudonym) {
    return res.status(400).json({ error: 'Email pseudonym is required' });
  }

  const user = db.findUserByPseudonym(email_pseudonym.toLowerCase().trim());
  if (!user) {
    // Generate a deterministic fake salt to prevent username enumeration attacks
    const fakeSalt = crypto.createHash('sha256').update(email_pseudonym).digest('hex').substring(0, 32);
    return res.json({ crypto_salt: fakeSalt, exists: false });
  }

  res.json({ crypto_salt: user.crypto_salt, exists: true });
});

// Register user
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { email_pseudonym, auth_verifier, crypto_salt, bip39_verification_hash } = req.body;

    if (!email_pseudonym || !auth_verifier || !crypto_salt || !bip39_verification_hash) {
      return res.status(400).json({ error: 'Missing required registration parameters' });
    }

    const cleanName = email_pseudonym.toLowerCase().trim();
    const existing = db.findUserByPseudonym(cleanName);
    if (existing) {
      return res.status(409).json({ error: 'Pseudonym or email already registered' });
    }

    // Hash client-side auth verifier with bcrypt before storing
    const authHash = await bcrypt.hash(auth_verifier, 12);
    const userId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    db.createUser({
      id: userId,
      email_pseudonym: cleanName,
      auth_hash: authHash,
      crypto_salt,
      bip39_verification_hash,
      created_at: createdAt
    });

    const token = jwt.sign({ id: userId, email_pseudonym: cleanName }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      user_id: userId,
      email_pseudonym: cleanName,
      session_token: token,
      crypto_salt
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// Login user
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email_pseudonym, auth_verifier } = req.body;
    if (!email_pseudonym || !auth_verifier) {
      return res.status(400).json({ error: 'Pseudonym and auth verifier are required' });
    }

    const cleanName = email_pseudonym.toLowerCase().trim();
    const user = db.findUserByPseudonym(cleanName);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(auth_verifier, user.auth_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email_pseudonym: cleanName }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user_id: user.id,
      email_pseudonym: cleanName,
      session_token: token,
      crypto_salt: user.crypto_salt
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// BIP-39 Recovery Phrase Key Reset
app.post('/api/auth/recover', authLimiter, async (req, res) => {
  try {
    const { email_pseudonym, bip39_verification_hash, new_auth_verifier, new_crypto_salt } = req.body;

    if (!email_pseudonym || !bip39_verification_hash || !new_auth_verifier || !new_crypto_salt) {
      return res.status(400).json({ error: 'All recovery parameters required' });
    }

    const cleanName = email_pseudonym.toLowerCase().trim();
    const user = db.findUserByPseudonym(cleanName);
    if (!user) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Timing-safe comparison prevents side-channel timing attacks on the recovery hash
    if (!timingSafeStringEqual(user.bip39_verification_hash, bip39_verification_hash)) {
      return res.status(403).json({ error: 'BIP-39 recovery verification failed. Key mismatch.' });
    }

    const newAuthHash = await bcrypt.hash(new_auth_verifier, 12);
    db.updateUserPassword(user.id, newAuthHash, new_crypto_salt);

    const token = jwt.sign({ id: user.id, email_pseudonym: cleanName }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Account recovered and master key updated successfully',
      user_id: user.id,
      session_token: token,
      crypto_salt: new_crypto_salt
    });
  } catch (err) {
    console.error('Recovery error:', err);
    res.status(500).json({ error: 'Recovery failed due to server error' });
  }
});

// ----------------------------------------------------
// EVIDENCE & CHAIN OF CUSTODY ROUTES
// ----------------------------------------------------

// Anchor new evidence (Upload encrypted blob + metadata)
app.post('/api/evidence', authLimiter, authenticateToken, uploadLimiter, upload.single('encrypted_blob'), async (req, res) => {
  try {
    const { file_hash, wrapped_fek, encryption_iv, metadata_json } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Encrypted payload file is required' });
    }

    // Validate file_hash is a well-formed SHA-256 hex string
    if (!isValidSHA256Hex(file_hash)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'file_hash must be a valid 64-character hexadecimal SHA-256 digest' });
    }
    if (!wrapped_fek || !encryption_iv) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Missing cryptographic envelope data' });
    }

    // Cap metadata_json size to prevent DB bloat (max 64 KB)
    const metaStr = metadata_json || '{}';
    if (metaStr.length > 65536) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'metadata_json exceeds maximum allowed size (64 KB)' });
    }

    // Compute hash of the stored encrypted ciphertext on disk — non-blocking stream
    const encryptedBlobHash = await hashFileAsync(req.file.path);

    const evidenceId = crypto.randomUUID();
    const custodianTimestamp = new Date().toISOString();
    const custodianSignature = signChainOfCustody(evidenceId, file_hash, custodianTimestamp);
    const createdAt = custodianTimestamp;

    db.insertEvidence({
      id: evidenceId,
      user_id: req.user.id,
      file_hash,
      encrypted_blob_hash: encryptedBlobHash,
      storage_filename: req.file.filename,
      wrapped_fek,
      encryption_iv,
      metadata_json: metaStr,
      custodian_timestamp: custodianTimestamp,
      custodian_signature: custodianSignature,
      created_at: createdAt
    });

    db.logAudit(evidenceId, 'EVIDENCE_ANCHORED', `Anchored with SHA-256 fingerprint: ${file_hash}`);

    res.status(201).json({
      evidence_id: evidenceId,
      file_hash,
      custodian_timestamp: custodianTimestamp,
      custodian_signature: custodianSignature,
      status: 'anchored'
    });
  } catch (err) {
    console.error('Evidence upload error:', err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to record evidence' });
  }
});

// List user's evidence records
app.get('/api/evidence', authenticateToken, (req, res) => {
  try {
    const records = db.getEvidenceByUser(req.user.id);
    const formatted = records.map(r => ({
      id: r.id,
      file_hash: r.file_hash,
      encrypted_blob_hash: r.encrypted_blob_hash,
      wrapped_fek: r.wrapped_fek,
      encryption_iv: r.encryption_iv,
      metadata: JSON.parse(r.metadata_json || '{}'),
      custodian_timestamp: r.custodian_timestamp,
      custodian_signature: r.custodian_signature,
      created_at: r.created_at
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Fetch evidence error:', err);
    res.status(500).json({ error: 'Failed to retrieve evidence list' });
  }
});

// Download encrypted ciphertext blob for client-side decryption
app.get('/api/evidence/:id/blob', authenticateToken, (req, res) => {
  try {
    const record = db.getEvidenceById(req.params.id);
    if (!record || record.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Evidence record not found' });
    }

    // Path traversal guard: storage_filename must be a plain filename with no separators
    if (/[\/\\]/.test(record.storage_filename)) {
      console.error(`PATH TRAVERSAL BLOCKED: storage_filename="${record.storage_filename}"`);
      return res.status(403).json({ error: 'Forbidden: invalid storage reference' });
    }
    const filePath = path.join(VAULT_DIR, record.storage_filename);
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(path.resolve(VAULT_DIR))) {
      console.error(`PATH TRAVERSAL BLOCKED: resolved="${resolvedPath}"`);
      return res.status(403).json({ error: 'Forbidden: invalid storage reference' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(410).json({ error: 'Encrypted storage blob missing or purged' });
    }

    db.logAudit(record.id, 'BLOB_RETRIEVED', `Client retrieved encrypted blob for local decryption`);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${record.id}.enc"`);
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    console.error('Download blob error:', err);
    res.status(500).json({ error: 'Failed to deliver encrypted evidence' });
  }
});

// Delete evidence record and purge encrypted file
app.delete('/api/evidence/:id', authenticateToken, (req, res) => {
  try {
    const record = db.getEvidenceById(req.params.id);
    if (!record || record.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Evidence record not found' });
    }

    const filePath = path.join(VAULT_DIR, record.storage_filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    db.deleteEvidence(record.id, req.user.id);
    db.logAudit(record.id, 'EVIDENCE_PURGED', `User purged evidence item`);

    res.json({ message: 'Evidence securely removed', id: req.params.id });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete evidence' });
  }
});

// Update evidence metadata (tags, incident category, notes)
app.patch('/api/evidence/:id/metadata', authenticateToken, (req, res) => {
  try {
    const record = db.getEvidenceById(req.params.id);
    if (!record || record.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Evidence record not found' });
    }

    const { metadata_json } = req.body;
    if (!metadata_json) {
      return res.status(400).json({ error: 'metadata_json is required' });
    }

    // Cap metadata_json size to prevent DB bloat (max 64 KB)
    const rawMeta = typeof metadata_json === 'string' ? metadata_json : JSON.stringify(metadata_json);
    if (rawMeta.length > 65536) {
      return res.status(400).json({ error: 'metadata_json exceeds maximum allowed size (64 KB)' });
    }

    // Merge or set new metadata while preserving critical crypto envelope fields
    const currentMeta = JSON.parse(record.metadata_json || '{}');
    const newMeta = typeof metadata_json === 'string' ? JSON.parse(metadata_json) : metadata_json;
    const merged = {
      ...currentMeta,
      ...newMeta,
      wrap_iv: currentMeta.wrap_iv // Never overwrite cryptographic wrap_iv
    };

    const updatedJsonStr = JSON.stringify(merged);
    db.updateEvidenceMetadata(record.id, req.user.id, updatedJsonStr);
    db.logAudit(record.id, 'METADATA_UPDATED', `User updated incident metadata/tags`);

    res.json({
      message: 'Metadata updated successfully',
      id: record.id,
      metadata: merged
    });
  } catch (err) {
    console.error('Metadata update error:', err);
    res.status(500).json({ error: 'Failed to update evidence metadata' });
  }
});

// Forensic Verification Audit Trail
app.get('/api/evidence/:id/report', authenticateToken, (req, res) => {
  try {
    const record = db.getEvidenceById(req.params.id);
    if (!record || record.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const logs = db.getAuditLogs(record.id);
    const expectedSig = signChainOfCustody(record.id, record.file_hash, record.custodian_timestamp);
    const signatureValid = timingSafeStringEqual(expectedSig, record.custodian_signature);

    res.json({
      record: {
        id: record.id,
        file_hash: record.file_hash,
        custodian_timestamp: record.custodian_timestamp,
        custodian_signature: record.custodian_signature,
        signature_valid: signatureValid,
        metadata: JSON.parse(record.metadata_json || '{}')
      },
      audit_history: logs
    });
  } catch (err) {
    console.error('Report error:', err);
    res.status(500).json({ error: 'Failed to generate report data' });
  }
});

// Public Chain of Custody Verifier (Independent Forensic Verification)
const verifyUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max for verification uploads
});
app.post('/api/evidence/verify', verifyLimiter, verifyUpload.single('file'), (req, res) => {
  try {
    let targetHash = req.body.file_hash;
    const sanitizedHash = req.body.sanitized_hash;

    // If an inspector uploaded the raw file directly, calculate its SHA-256 hash
    if (req.file) {
      targetHash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
    }

    if (!targetHash && !sanitizedHash) {
      return res.status(400).json({ error: 'Provide a file_hash string or upload a file to verify' });
    }

    let match = targetHash ? db.getEvidenceByHash(targetHash) : null;
    let matchedOnSanitized = false;

    if (!match && sanitizedHash) {
      match = db.getEvidenceByHash(sanitizedHash);
      if (match) matchedOnSanitized = true;
    }

    if (!match) {
      return res.json({
        verified: false,
        file_hash: targetHash || sanitizedHash,
        message: 'No matching cryptographic record found in the immutable custody ledger. File may be modified, unanchored, or falsified.'
      });
    }

    // Verify custodian digital signature
    const expectedSig = signChainOfCustody(match.id, match.file_hash, match.custodian_timestamp);
    const signatureValid = timingSafeStringEqual(expectedSig, match.custodian_signature);

    db.logAudit(match.id, 'FORENSIC_VERIFIED', `External verification performed. Hash: ${targetHash || sanitizedHash}`);

    const meta = JSON.parse(match.metadata_json || '{}');

    res.json({
      verified: true,
      file_hash: match.file_hash,
      custodian_timestamp: match.custodian_timestamp,
      custodian_signature: match.custodian_signature,
      signature_valid: signatureValid,
      evidence_id: match.id,
      chain_of_custody_intact: signatureValid,
      original_filename: meta.original_filename || 'Evidence Record',
      incident_category: meta.incident_category || 'Digital Evidence',
      platform: meta.platform || '',
      matched_on_sanitized: matchedOnSanitized,
      was_sanitized: !!meta.trackers_removed,
      message: 'Cryptographic match confirmed! The file fingerprint perfectly matches the timestamped custody ledger.'
    });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ error: 'Forensic verification failed' });
  }
});

app.listen(PORT, () => {
  console.log(`[Evidence Locker Custodian] Running on http://localhost:${PORT}`);
});
