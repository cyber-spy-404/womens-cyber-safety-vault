# Backend Architecture & Code Review Standards
*(Derived from CodeRabbit AI Code Review & Backend Architect Guidelines)*

## 1. Review Methodology & Severity Classification
When reviewing backend architecture, PRs, or server code, categorize every finding strictly by severity:

- **🚨 Critical**:
  - Security vulnerabilities (SQL/Command injection, authentication bypass, broken object-level authorization BOLA/IDOR, hardcoded secrets, timing attack vulnerabilities).
  - Data corruption, race conditions in concurrent transactions, or unhandled promise rejections that crash the process.
- **⚠️ Major**:
  - Significant logic flaws, broken error propagation, missing rate limiting on sensitive auth endpoints, missing input validation or payload sanitization.
  - Memory leaks, unclosed streams/file descriptors, lack of connection pooling, missing database indices on high-cardinality foreign keys or query filters.
- **💡 Minor**:
  - Performance sub-optimizations, redundant database round-trips (N+1 queries), inconsistent HTTP status codes, missing idempotency keys.
- **📝 Trivial**:
  - Code cleanliness, dead code, code formatting, spelling errors, or verbose boilerplate that can be simplified.
- **ℹ️ Info**:
  - Architecture observations, documentation improvements, forward-looking refactoring tips.

## 2. Security & Zero-Knowledge Verification
- **Cryptographic Rigor**:
  - Never roll custom crypto. Enforce standardized primitives (e.g. `AES-256-GCM`, `HMAC-SHA256`, `PBKDF2`, `bcrypt`).
  - Cryptographic comparisons must use constant-time comparison (`crypto.timingSafeEqual`) to prevent timing side-channel attacks.
  - Salt generation must use cryptographically secure PRNG (`crypto.randomBytes` or `window.crypto.getRandomValues`).
  - Passwords and master encryption keys must never be logged, transmitted in plaintext, or saved unhashed.
- **Input Validation & Sanitization**:
  - Never trust client inputs (`req.body`, `req.params`, `req.query`). Validate schemas and enforce strict types, byte-length limits, and content-type verification.
  - For file uploads, validate file sizes, MIME types, and sanitize file names to prevent directory traversal (`../`).

## 3. Database & Concurrency
- Ensure database queries use parameterized prepared statements without string concatenation.
- Manage atomic transactions for multi-step mutations (e.g. evidence records + audit logs).
- Ensure indexes exist for every frequently queried or joined column.

## 4. Error Handling & Defense in Depth
- Centralize error handling middleware.
- Never expose raw database errors, stack traces, or internal server paths in API responses to clients.
- Always provide structured, actionable review output with explicit diffs or code blocks.
