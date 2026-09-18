# AgriCycle — Design System & Visual Specification

## 1. Aesthetic Philosophy: The Agricultural Field Record

AgriCycle rejects the generic "AI SaaS" aesthetic. Stubble management is not an abstract cloud software problem; it is an earthy, time-critical agricultural reality happening in fields of clay, loess, and straw under harsh harvest suns.

### Visual Identity Hybrid:
1. **Primary — Editorial Information Design**: High-contrast typography, clear hierarchy, generous whitespace, confident headlines, and prose that speaks plainly.
2. **Secondary — Agricultural Field Notebook**: Fine ruled borders, numbered steps, ledger tables, parameter tags, stamp/badge indicators, and physical record clarity.
3. **Tertiary — Spatial Resource Cartography**: Clean, pragmatic geographic interface connecting the farm to concrete Custom Hiring Centres and baling hubs.

---

## 2. Color System & Semantic Tokens

The palette is derived directly from soil, harvested crop straw, deep tree cover, and fired clay terracotta.

| Token Name | Hex Code | Purpose & Usage |
| :--- | :--- | :--- |
| **Parchment Light** | `#FBF9F4` | Primary app background (warm, readable in outdoor glare) |
| **Parchment Muted** | `#F3EFE6` | Secondary panels, table headers, field record sub-sections |
| **Soil Black** | `#1C1D18` | Primary text, maximum contrast, high legibility |
| **Soil Charcoal** | `#3A3C34` | Secondary text, field labels, metadata descriptions |
| **Field Border** | `#D8D2C4` | Hairline dividers (1px solid), ledger borders, table lines |
| **Agri Forest** | `#265337` | Primary action buttons, verified badge, recommended pathway accent |
| **Agri Forest Light** | `#EBF2ED` | Success/recommended container background |
| **Harvest Amber** | `#B85D2A` | Urgent deadline alerts (e.g. <7 days to sowing), active step indicator |
| **Harvest Amber Light** | `#FDF3EC` | Warning notification banners, urgent constraint badges |
| **Deep Clay** | `#8F391B` | Critical warnings, open burning risk alerts |
| **Field White** | `#FFFFFF` | Form input surfaces, active map popups, modal canvases |

### Contrast & Sunlight Rule:
All core text pairings (`#1C1D18` on `#FBF9F4` or `#FFFFFF`) exceed **WCAG AAA** contrast ratio (> 12:1), ensuring readability on a budget smartphone screen in bright sunlight.

---

## 3. Typography & Typesetting

### Font Stacks
- **Display / Editorial Headings**: `Lora`, `Newsreader`, or `Georgia` (Editorial serif)
  - *Feel*: Authoritative, grounded, human, non-corporate.
- **Interface / Data / Forms**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto` (Clean sans-serif)
  - *Feel*: High legibility, crisp numbers, rapid scanning.
- **Bilingual Devanagari**: `Noto Sans Devanagari`, `Kohinoor Devanagari`, or system Devanagari fallbacks.
  - *Feel*: Native, uncompressed, highly readable glyphs for Hindi speakers.
- **Field Data & Monospace**: `JetBrains Mono`, `Consolas`, or `monospace`
  - *Feel*: Used for operational coordinates, tonnage calculations, distance metrics, and rate estimates.

### Type Scale (Mobile-First)
- **H1 (Screen Title)**: 28px–32px (1.75rem–2rem), 600 weight, tight line-height (1.2)
- **H2 (Section Header)**: 20px–22px (1.25rem–1.375rem), 600 weight
- **H3 (Sub-heading)**: 16px–18px (1rem–1.125rem), 600 weight
- **Body Regular**: 15px–16px (0.938rem–1rem), 400 weight, 1.5 line-height
- **Caption / Meta**: 12px–13px (0.75rem–0.813rem), 500 weight, uppercase tracking where appropriate

---

## 4. Layout Architecture: Rejecting Card-Soup

### The Anti-Card Rule
Standard SaaS templates wrap every single data point in a floating rounded rectangle with heavy dropshadows. AgriCycle replaces this with **Field Ledgers**:
- Use **hairline border dividers** (`1px solid #D8D2C4`) to demarcate sections.
- Use **alternating ledger rows** or subtle background tints (`#F3EFE6`) for tables.
- Use **left border accents** (e.g., `border-l-4 border-[#265337]`) for highlighted recommendations.
- Use **Cards ONLY** when an element represents an actionable, discrete entity (such as a selectable pathway card or a specific CHC listing in the map sidebar).

### Mobile Form Factors (360px – 430px)
- Minimum tap target: **48px x 48px** for all buttons, toggles, and select options.
- Inputs: Single-column full-width with explicit high-contrast labels and contextual helper hints below.
- Sticky Bottom Action Bar: On assessment and recommendation screens, the primary forward action is anchored at the bottom for easy one-thumb completion.

### Desktop Form Factors (1024px – 1440px)
- Max readable content width: 1120px, centered with generous editorial margins.
- Dual-pane layouts: Field notebook summary on the left, interactive comparison/map on the right.

---

## 5. UI Components & Patterns

### 5.1. The Recommendation Sheet
Rather than an AI score card, the recommendation is styled like an official Field Advisory:
```
┌───────────────────────────────────────────────────────────┐
│ RECOMMENDED PATHWAY                                       │
│ In-Situ Management via Custom Hiring Centre (Super SMS)   │
│                                                           │
│ ┌─ WHY THIS OPTION? ────────────────────────────────────┐ │
│ │ • Available sowing window is 12 days (ex-situ baling   │ │
│ │   risk is too high due to tight window)                │ │
│ │ • 2 CHCs within 9.5 km have Super SMS combo units       │ │
│ │ • Matches priority: Lowest Operational Cost             │ │
│ └───────────────────────────────────────────────────────┘ │
│ Distance: 8.4 km | Est. Rental: ₹1,650/acre | Time: 1 day │
└───────────────────────────────────────────────────────────┘
```

### 5.2. Language Switcher
- Placed persistently in the header navigation: `English | हिन्दी`.
- Accessible button group that instantly toggles translation without resetting form or assessment state.

### 5.3. Status Indicators & Badges
- `Verified Public Record`: Solid olive green border, muted green tint, check icon.
- `Sample / Demonstration Data`: Muted earth border, subtle amber tag, explicit disclaimer.
- `Urgent Timeline`: Terracotta indicator for sowing windows under 10 days.

---

## 6. Prohibited Visual Tropes (Zero Tolerance)
- ❌ No neon greens (`#00FF66`, `#10B981` saturated emeralds).
- ❌ No dark-mode neon glowing borders or cybernetic elements.
- ❌ No glassmorphism (frosted blurry glass cards).
- ❌ No cartoonish robot or sparkling AI sparkle icons (`✨`).
- ❌ No 4-metric KPI ribbon at the top of every screen.
- ❌ No marketing fluff phrases like "Powered by Hyper-Intelligent AI".
