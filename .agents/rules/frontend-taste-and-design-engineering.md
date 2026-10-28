# Frontend Taste & Design Engineering Guidelines
*(Synthesized from Emil Kowalski's Design Engineering & tasteskill v2)*

## 1. Anti-Slop Aesthetic Mandates (Taste Skill)
- **Eliminate AI Clichés**:
  - Never generate the standard "AI template": centered 3-line headline with a floating pill badge above it, followed by a 3-column row of generic icon cards with pastel gradients and purple glow blurs.
  - Avoid thin decorative rules, generic lorem ipsum numbers, or rainbow vanity charts.
- **Substance & Identity**:
  - Base art direction directly on the product's subject and intent, not generic SaaS patterns.
  - Use high-character, modern typography with intentional scale and hierarchy.
  - Use curated, intentional color palettes with rich background fields rather than washed-out pastel fills.
  - In app screens (dashboards, settings, tables, tools): prioritize quiet borders, purposeful density, structured hierarchy, and real data that adds up.

## 2. Animation & Interaction Discipline (Emil Kowalski)
- **The Animation Decision Framework**:
  - **100+ times/day interactions** (keyboard shortcuts, command palettes, global navigation toggle): **Never animate.** It feels sluggish and disconnects the user from their speed.
  - **Tens of times/day** (list items, everyday clicks): Keep animations instantaneous or minimal (under 150ms).
  - **Occasional/Contextual** (modals, drawers, toasts): Smooth, purposeful transitions (180ms–240ms).
  - Every animation must answer "Why does this animate?" (spatial consistency, state change, feedback, or preventing jarring layout jumps).
- **CSS Transition Rules**:
  - **NEVER use `transition: all`**. Always name the exact properties being animated (e.g., `transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1), opacity 180ms ease-out`).
  - **Natural Entrances**: Elements must never appear out of nowhere (`scale(0)`). Use `scale(0.95)` with `opacity: 0` for natural entry.
  - **Easing**:
    - Elements entering or exiting the screen: use `ease-out` (starts immediately, feels responsive).
    - Elements moving across the screen: use custom spring or cubic-bezier curves (avoid standard linear or sluggish `ease-in`).
- **Tactility & Micro-Interactions**:
  - Buttons and interactive items **must** have an `:active` state (e.g., `transform: scale(0.98)`).
  - Popovers and menus must scale from their trigger origin (`transform-origin: var(--origin)`), not from random centers (modals remain centered).

## 3. Mobile-Native Quality
- Avoid mobile browser quirks:
  - Use `100dvh` instead of buggy `100vh`.
  - Disable web tap highlight flash: `-webkit-tap-highlight-color: transparent`.
  - Prevent accidental text selection on controls: `user-select: none`.
  - Minimum font size of 16px on form inputs to prevent unwanted iOS auto-zoom.

## 4. Required UI Review Format
When reviewing or auditing frontend code, **always format issues in a Markdown table**:

| Before | After | Why |
| :--- | :--- | :--- |
| `transition: all 300ms` | `transition: transform 180ms ease-out, opacity 180ms ease-out` | Specific properties prevent layout thrashing; 180ms is responsive |
| `transform: scale(0)` | `transform: scale(0.96); opacity: 0` | Physical objects don't spawn from point zero |
| Missing `:active` | `button:active { transform: scale(0.98); }` | Provides immediate tactile haptic feedback |

## 5. UI Stress Testing (`break-ui`)
Always evaluate UI against extreme worst-case scenarios:
- Extra-long unbreakable text strings (emails, URLs, hash digests).
- Zero states, 1 item states, and 10,000 item overflow states.
- Mobile viewport constraints and keyboard obstructions.
