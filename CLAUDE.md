# CLAUDE.md — Whole-Star

## Project Overview

Whole-Star is an astrology app built on an original concept: every planet has an implicit Twin — the complementary quality it presupposes but does not express. The app calculates Twin intensities from real planetary data and presents them as luminous, pulsing visual fields with daily invitations.

**Read SYSTEM.md for the full philosophical and logical specification.** Every design decision in this codebase should be traceable to that document.

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router) with TypeScript
- **Ephemeris:** swisseph-wasm (Swiss Ephemeris compiled to WebAssembly — runs client-side and server-side)
- **Visualization:** React Three Fiber (@react-three/fiber) + custom GLSL shaders
- **Styling:** Tailwind CSS for layout, CSS variables for the Twin color system
- **State:** React state + Context for user birth data; no external state library needed initially
- **Storage:** localStorage for prototype; Supabase planned for production
- **Package Manager:** npm
- **Node version:** 18+

---

## Project Structure

```
whole-star/
├── CLAUDE.md                    # This file — technical instructions
├── SYSTEM.md                    # Full system specification (philosophy + logic)
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
│
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Landing / birth data input
│   │   ├── chart/
│   │   │   └── page.tsx         # Main visualization view
│   │   └── daily/
│   │       └── page.tsx         # Daily invitation view
│   │
│   ├── core/                    # Pure calculation logic — NO UI dependencies
│   │   ├── types.ts             # All TypeScript types and interfaces
│   │   ├── ephemeris.ts         # swisseph-wasm wrapper — planet positions from birth data
│   │   ├── dignity.ts           # Dignity calculation (domicile, exaltation, fall, exile)
│   │   ├── aspects.ts           # Aspect detection and classification
│   │   ├── stress.ts            # Stress index calculation (the main formula)
│   │   ├── twins.ts             # Twin intensity derivation from stress index
│   │   ├── houses.ts            # House calculation + opposite house logic
│   │   ├── pairs.ts             # Active Twin pair detection and description lookup
│   │   └── engine.ts            # Orchestrator: birth data in → full Twin state out
│   │
│   ├── data/                    # Static data — all Twin definitions, tables, texts
│   │   ├── twins.json           # The 10 Twins: names, descriptions, colors
│   │   ├── pairs.json           # The 45 Twin pairs: descriptions, qualities
│   │   ├── dignity-table.json   # Traditional dignity assignments (sign → planet → dignity)
│   │   ├── aspects.json         # Aspect definitions and orbs
│   │   ├── houses.json          # House axis definitions and themes
│   │   └── invitations.json     # Daily invitation templates (to be expanded)
│   │
│   ├── visual/                  # Three.js visualization components
│   │   ├── TwinField.tsx        # Single Twin as a pulsing luminous field
│   │   ├── TwinCanvas.tsx       # Full scene: all active Twin fields + interference
│   │   ├── ClassicalChart.tsx   # Muted background birth chart (traditional circle)
│   │   ├── TwinSymbol.tsx       # Open-form SVG symbol for each Twin
│   │   ├── shaders/
│   │   │   ├── glow.vert        # Vertex shader for field rendering
│   │   │   ├── glow.frag        # Fragment shader for pulsing glow
│   │   │   └── interference.frag # Fragment shader for field overlap patterns
│   │   └── colors.ts            # Twin color definitions and complement logic
│   │
│   ├── components/              # UI components (forms, layout, text)
│   │   ├── BirthDataForm.tsx    # Input: date, time, location
│   │   ├── TwinCard.tsx         # Individual Twin display with intensity
│   │   ├── DailyInvitation.tsx  # Daily invitation text component
│   │   ├── PairDisplay.tsx      # Active Twin pair display
│   │   └── Navigation.tsx       # App navigation
│   │
│   └── lib/                     # Utilities
│       ├── geocoding.ts         # Birth location → lat/lon
│       └── time.ts              # Time zone + Julian day conversions
│
├── public/
│   ├── ephemeris/               # Swiss Ephemeris data files (sepl_18.se1 etc.)
│   └── fonts/                   # Custom typography
│
└── __tests__/                   # Tests mirror src/core/ structure
    ├── dignity.test.ts
    ├── aspects.test.ts
    ├── stress.test.ts
    ├── twins.test.ts
    ├── houses.test.ts
    └── engine.test.ts
```

---

## Build Order

Build in this exact sequence. Each phase must work before moving to the next.

### Phase 1: Foundation
1. Initialize Next.js project with TypeScript and Tailwind
2. Create all type definitions in `src/core/types.ts`
3. Create static data files in `src/data/`

### Phase 2: Calculation Core (no UI)
4. Implement `dignity.ts` — given a planet and zodiac sign, return dignity level
5. Implement `aspects.ts` — given planet positions, detect all aspects with orbs
6. Implement `stress.ts` — compute stress index from dignity + aspects + retrograde + house
7. Implement `twins.ts` — derive Twin intensity from stress index
8. Implement `houses.ts` — determine house placement + opposite house
9. Implement `pairs.ts` — detect which Twin pairs are active (both > threshold)
10. Implement `engine.ts` — orchestrate all above: birth data → full Twin state
11. Write tests for all core modules

### Phase 3: Ephemeris Integration
12. Set up swisseph-wasm
13. Implement `ephemeris.ts` — birth datetime + location → planet positions, signs, houses, retrograde status
14. Connect ephemeris output to the calculation core
15. Test with known birth charts

### Phase 4: Simple UI
16. Build `BirthDataForm` — date, time, location input
17. Build a debug/numbers view showing all 10 stress indices and Twin intensities
18. Build `TwinCard` showing individual Twin info

### Phase 5: Visualization
19. Set up React Three Fiber canvas
20. Implement `TwinField` — single pulsing luminous field with intensity-driven opacity and size
21. Implement glow shaders
22. Implement interference shader for overlapping fields
23. Build `TwinCanvas` composing all active fields
24. Add `ClassicalChart` as muted background layer

### Phase 6: Daily Experience
25. Implement daily invitation logic — brightest Twin + house axis → invitation text
26. Build `DailyInvitation` component
27. Build daily page with visualization + invitation

---

## Code Standards

- **Pure core:** Everything in `src/core/` must be pure functions with no side effects, no UI imports, no browser APIs. This is the intellectual heart of the app and must be testable in isolation.
- **Types first:** Define types before implementing logic. The type system should mirror the conceptual system in SYSTEM.md.
- **Data-driven:** Twin descriptions, pair descriptions, dignity tables — all live in `src/data/` as JSON. Code reads data; it does not hardcode astrological knowledge.
- **Shader comments:** GLSL shaders must have inline comments explaining what each section does visually.
- **Test coverage:** Every function in `src/core/` must have tests. Use known birth charts with verified planet positions.

---

## Key Design Decisions

- **Twin intensity IS the stress index.** No separate transformation. Simple, direct, traceable.
- **Opposite house logic.** The Twin always operates in the house opposite to its planet. This is non-negotiable — it is fundamental to the system's meaning.
- **Twin pairs activate when both > 50.** The threshold for a pair being "active" is both Twins having intensity above 50. This can be tuned later.
- **Pulsation rate = planet orbital period mapped to animation cycle.** Moon's Twin pulses fast, Pluto's Twin barely breathes.
- **No deterministic text.** The app never says "you will" or "this means." It says "what if" and "notice."

---

## Visual Reference

The visual language is described in detail in SYSTEM.md Section 7. Key principles for implementation:

- Twin fields are rendered as soft, luminous, semi-transparent volumes — NOT sharp geometric shapes
- Colors follow the Twin Color Direction table in SYSTEM.md
- Interference patterns where fields overlap should emerge from shader math, not be pre-designed
- The classical birth chart in the background should be recognizable but subdued (low opacity, thin lines)
- Typography should feel contemplative, not technological — avoid tech/startup aesthetics

---

## Important Terminology

| Term | Meaning |
|------|---------|
| Twin | The implicit complementary quality of a planet |
| Stress Index | 0–100 measure of a planet's difficulty (dignity + aspects + retrograde + house) |
| Twin Intensity | = Stress Index. How strongly the Twin is calling. |
| Twin Pair | The quality that emerges when two Twins are both active |
| House Axis | The line between a house and its opposite — where the Twin dynamic plays out |
| Invitation | The daily message — a question, not a statement |
| Manifest Layer | Classical astrology: planets, signs, houses |
| Implicit Layer | Whole-Star's contribution: Twins, intensities, pairs |
| Emergent Layer | What arises unpredictably when Twin fields interact |
