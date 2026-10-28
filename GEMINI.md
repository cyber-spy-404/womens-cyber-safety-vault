# Global Agent Directives

These guidelines are globally active for all AI interactions, code generation, refactoring, and reviews.

## 1. Quality & Design Standards
- Follow Emil Kowalski's Design Engineering principles:
  - Never use `transition: all`. Specify explicit properties.
  - No animations on high-frequency actions (100+/day).
  - Use `ease-out` for enter transitions and scale from `0.95`, not `0`.
  - Always output UI review findings in markdown tables: `| Before | After | Why |`.
  - Ensure mobile-native polish (`100dvh`, no tap highlight flash, 16px input font size).
- Follow Taste Skill anti-slop principles:
  - Eliminate generic AI templates (centered 3-line headlines with floating pill badges, pastel icon card grids).
  - Base art direction directly on the product's subject and intent.

## 2. Backend & Code Review Standards
- Apply CodeRabbit review rigor to all backend code:
  - Classify findings into: `Critical`, `Major`, `Minor`, `Trivial`, and `Info`.
  - Rigorously audit security: injection risks, constant-time comparisons (`timingSafeEqual`), authentication/authorization checks, rate limiting, and zero-knowledge integrity.
  - Enforce parameterized queries, atomic transactions, structured error handling, and leak prevention.
  - Always provide concrete, working code diffs.
