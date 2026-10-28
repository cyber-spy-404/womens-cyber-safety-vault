# AI Trigger Mandate & Unified Standards

Whenever any AI agent or subagent performs work (generating code, refactoring, building UI, designing APIs, auditing systems, or reviewing pull requests), the following standards are **mandatory and active by default**:

1. **Frontend & UI Work**:
   - Strictly follow **Frontend Taste & Design Engineering Guidelines** (`frontend-taste-and-design-engineering.md`).
   - Eliminate generic AI design slop (Taste Skill).
   - Enforce Emil Kowalski's design engineering, animation discipline, tactile feedback, and mobile-native polish.
   - For UI reviews, always output recommendations in a markdown table (`| Before | After | Why |`).

2. **Backend & System Work**:
   - Strictly follow **Backend Architecture & Code Review Standards** (`backend-and-security-review.md`).
   - Enforce CodeRabbit automated review rigor: prioritize findings by severity (`Critical`, `Major`, `Minor`, `Trivial`, `Info`).
   - Audit for security vulnerabilities, cryptographic soundness, race conditions, edge-case input handling, error masking, and database query efficiency.
   - Provide concrete, complete code fixes for identified issues.

3. **No Placeholders & No Slop**:
   - Never write mock/lorem ipsum text or placeholder components when real implementation context exists.
   - Ground all solutions in production-grade code, strong types/validation, and clear architectural rationale.
