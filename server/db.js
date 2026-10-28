const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'evidence_locker.db');
const db = new DatabaseSync(DB_PATH);

// Enable WAL mode and foreign keys for high performance and integrity
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email_pseudonym TEXT UNIQUE NOT NULL,
    auth_hash TEXT NOT NULL,
    crypto_salt TEXT NOT NULL,
    bip39_verification_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS evidence_records (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    file_hash TEXT NOT NULL,
    encrypted_blob_hash TEXT NOT NULL,
    storage_filename TEXT NOT NULL,
    wrapped_fek TEXT NOT NULL,
    encryption_iv TEXT NOT NULL,
    metadata_json TEXT NOT NULL,
    custodian_timestamp TEXT NOT NULL,
    custodian_signature TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_evidence_file_hash ON evidence_records(file_hash);
  CREATE INDEX IF NOT EXISTS idx_evidence_user ON evidence_records(user_id);

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evidence_id TEXT,
    event_type TEXT NOT NULL,
    details TEXT,
    timestamp TEXT NOT NULL
  );
`);

module.exports = {
  db,

  // User management
  createUser: (user) => {
    const stmt = db.prepare(`
      INSERT INTO users (id, email_pseudonym, auth_hash, crypto_salt, bip39_verification_hash, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(user.id, user.email_pseudonym, user.auth_hash, user.crypto_salt, user.bip39_verification_hash, user.created_at);
  },

  findUserByPseudonym: (emailPseudonym) => {
    const stmt = db.prepare(`SELECT * FROM users WHERE email_pseudonym = ?`);
    return stmt.get(emailPseudonym);
  },

  findUserById: (userId) => {
    const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
    return stmt.get(userId);
  },

  updateUserPassword: (userId, authHash, cryptoSalt) => {
    const stmt = db.prepare(`
      UPDATE users SET auth_hash = ?, crypto_salt = ? WHERE id = ?
    `);
    stmt.run(authHash, cryptoSalt, userId);
  },

  // Evidence management
  insertEvidence: (evidence) => {
    const stmt = db.prepare(`
      INSERT INTO evidence_records (
        id, user_id, file_hash, encrypted_blob_hash, storage_filename,
        wrapped_fek, encryption_iv, metadata_json, custodian_timestamp,
        custodian_signature, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      evidence.id,
      evidence.user_id,
      evidence.file_hash,
      evidence.encrypted_blob_hash,
      evidence.storage_filename,
      evidence.wrapped_fek,
      evidence.encryption_iv,
      evidence.metadata_json,
      evidence.custodian_timestamp,
      evidence.custodian_signature,
      evidence.created_at
    );
  },

  getEvidenceByUser: (userId) => {
    const stmt = db.prepare(`
      SELECT id, file_hash, encrypted_blob_hash, storage_filename, wrapped_fek,
             encryption_iv, metadata_json, custodian_timestamp, custodian_signature, created_at
      FROM evidence_records
      WHERE user_id = ?
      ORDER BY custodian_timestamp DESC
    `);
    return stmt.all(userId);
  },

  getEvidenceById: (id) => {
    const stmt = db.prepare(`
      SELECT * FROM evidence_records WHERE id = ?
    `);
    return stmt.get(id);
  },

  getEvidenceByHash: (fileHash) => {
    if (!fileHash) return null;
    const cleanHash = fileHash.toLowerCase().trim();
    const stmt = db.prepare(`
      SELECT id, file_hash, encrypted_blob_hash, custodian_timestamp, custodian_signature, created_at, metadata_json
      FROM evidence_records
      WHERE LOWER(file_hash) = ?
      ORDER BY custodian_timestamp ASC
      LIMIT 1
    `);
    let row = stmt.get(cleanHash);
    if (!row) {
      const stmtMeta = db.prepare(`
        SELECT id, file_hash, encrypted_blob_hash, custodian_timestamp, custodian_signature, created_at, metadata_json
        FROM evidence_records
        WHERE metadata_json LIKE ?
        ORDER BY custodian_timestamp ASC
        LIMIT 1
      `);
      row = stmtMeta.get(`%"raw_file_hash":"${cleanHash}"%`);
    }
    return row;
  },

  deleteEvidence: (id, userId) => {
    const stmt = db.prepare(`
      DELETE FROM evidence_records WHERE id = ? AND user_id = ?
    `);
    return stmt.run(id, userId);
  },

  updateEvidenceMetadata: (id, userId, metadataJson) => {
    const stmt = db.prepare(`
      UPDATE evidence_records SET metadata_json = ? WHERE id = ? AND user_id = ?
    `);
    return stmt.run(metadataJson, id, userId);
  },

  // Audit trail logging
  logAudit: (evidenceId, eventType, details) => {
    const stmt = db.prepare(`
      INSERT INTO audit_logs (evidence_id, event_type, details, timestamp)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(evidenceId, eventType, details, new Date().toISOString());
  },

  getAuditLogs: (evidenceId) => {
    const stmt = db.prepare(`
      SELECT * FROM audit_logs WHERE evidence_id = ? ORDER BY timestamp ASC
    `);
    return stmt.all(evidenceId);
  }
};
