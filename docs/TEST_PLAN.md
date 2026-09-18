# AgriCycle — Comprehensive Verification & Test Plan

## 1. Quality Assurance Objective
AgriCycle must be a dependable, battle-tested decision support tool. Every interactive element, calculation, state transition, and translation must execute smoothly without dead buttons or unhandled errors.

---

## 2. Testing Levels & Matrix

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Engine Unit Tests (Vitest)                                │
│    • Deterministic scoring correctness & edge constraints   │
│    • Time window threshold boundaries (e.g. <8 days)        │
│    • Impact math verification                               │
├─────────────────────────────────────────────────────────────┤
│ 2. Component & Integration Tests                             │
│    • Form validation (invalid dates, negative tonnages)     │
│    • Language dictionary parity (every key in EN exists in HI)│
│    • LocalStorage persistence and hydration                 │
├─────────────────────────────────────────────────────────────┤
│ 3. Browser End-to-End Testing (Playwright / Browser Runner) │
│    • Full 19-Step User Journey Verification                 │
│    • Mobile viewport responsiveness (375px, 768px, 1280px)  │
│    • Fallback handling when AI API key is missing           │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. The Canonical 19-Step E2E Test Protocol

Every deployment candidate must strictly pass this test scenario:

| Step | Action | Expected Verification Result |
| :--- | :--- | :--- |
| **1** | Open AgriCycle home URL (`/`) | Editorial hero renders cleanly; no console errors. |
| **2** | Navigate to `/login` and select Demo User | Pre-fills Gurpreet Singh (Karnal, Haryana); enters `/home`. |
| **3** | Click "Start Residue Assessment" | Navigates to `/assess`; progressive form initialized. |
| **4** | Fill assessment form with target data: <br>• Crop: `Paddy` <br>• Location: `Karnal, Haryana` <br>• Residue: `~5 tonnes` <br>• Machinery Owned: `None` <br>• Sowing Window: `~12 days` | Validation accepts inputs; "Calculate Options" button becomes active. |
| **5** | Submit form | Navigates to `/analyzing` screen. |
| **6** | Observe analysis progress | Solver visually progresses through crop, window, machinery, and CHC checks without artificial lag. |
| **7** | Land on `/recommendation` | Multiple feasible pathways displayed with computed suitability scores based genuinely on input parameters. |
| **8** | Verify top recommendation | Top-ranked pathway matches the genuine highest-scoring candidate from the deterministic engine. |
| **9** | Inspect "Why this option?" rationale | Verifies explicit references to: 12-day window, 0 machinery, and nearby Karnal CHCs. |
| **10** | Click "Compare All Options" | Navigates to `/compare`; 4-column comparison table/cards rendered. |
| **11** | Select alternative or confirm recommended | State records selected pathway ID; feedback shown. |
| **12** | Click "View Nearby Resources" | Navigates to `/resources`; map renders Taraori and Indri CHC pins. |
| **13** | Click "Generate Action Plan" | Navigates to `/action-plan`; practical operational checklist created for the chosen pathway. |
| **14** | Toggle Step 1 ("Confirm CHC machine") | Step status flips to completed; progress updates; persists in session. |
| **15** | Click "View Environmental & Operational Impact" | Navigates to `/impact`; displays residue managed, selected pathway, estimated distance, estimated operational cost, potential open burning avoided, and potential environmental impact. Clearly labels estimates and assumptions. |
| **16** | Open "Assessment History" (`/history`) | The Karnal paddy assessment appears with timestamp and active status. |
| **17** | Hard Refresh Page (`F5` or Reload) | Application state hydrates cleanly from storage; no crash or white screen. |
| **18** | Resize viewport to Mobile (375px x 667px) | Single-column stacks, readable fonts, 48px touch targets, zero horizontal bleed. |
| **19** | Test LLM failure / offline mode | Disconnect network or omit API key; fallback synthesizer displays flawless bilingual rationale without error toast. |

---

## 4. Linguistic Verification (Bilingual Dictionary Parity)
- Automated lint test runs against `translations.ts` ensuring that for every key in `en`, an exact corresponding translation exists in `hi`.
- Hindi typography tested on mobile browsers to ensure Devanagari vowel matras do not clip or break text flow.

---

## 5. Performance & Accessibility Acceptance Gates
- **Lighthouse Performance**: $\ge 90$ on Mobile.
- **Accessibility (a11y)**: All form controls have associated `<label>` elements; all interactive buttons have visible focus outlines; color contrast ratio $\ge 7:1$ for body text.
- **Bundle Size**: Initial JS bundle $< 200\text{ KB}$ gzipped.
