# AgriCycle — Product Specification
**Product Name**: AgriCycle  
**Subtitle**: Crop Residue Management Assistant  
**Primary SDG**: SDG 12 (Responsible Consumption and Production)  
**Secondary SDG**: SDG 13 (Climate Action)  
**Target Geography (Initial)**: Punjab, Haryana, Western Uttar Pradesh  

---

## 1. Executive Summary & Core Mission
Every autumn and harvest season across the Indo-Gangetic plains, farmers face an acute, high-pressure dilemma: a tight 10–20 day window between harvesting paddy and preparing the field for wheat or winter crops. Without clear, actionable knowledge of accessible local machinery, custom hiring centres (CHCs), balers, or decomposers, burning stubble often becomes the default distress choice.

**AgriCycle** is a practical, field-grounded decision-support web application designed to answer one central question:  
> *"What can I practically do with my crop residue right now?"*

It is:
- **NOT** a satellite stubble-burning surveillance or penal system.
- **NOT** a generic AI chatbot or marketing gimmick.
- **NOT** an unverified speculative marketplace.
- **NOT** a replacement for Krishi Vigyan Kendras (KVKs) or agricultural officers.

It **IS** a structured decision-support tool that combines deterministic agricultural constraints (crop, tonnage, harvest-sowing window, machinery, distance, cost, farmer priority) with verified local resource records and accessible bilingual explanations to guide farmers into feasible, immediate action.

---

## 2. Target Persona & User Needs

### Primary Persona: Small-to-Medium Farmer (Kisan)
- **Profile**: 3–15 acres in districts like Karnal, Sangrur, or Meerut. Operates under tight deadlines, rising diesel costs, and limited capital to purchase specialized heavy machinery (Happy Seeder, Super SMS, Balers).
- **Pain Points**:
  - Unclear whether a CHC within 10 km actually has available equipment.
  - Inability to quickly calculate total operational costs (rental + diesel + labor) vs ex-situ collection value.
  - Confused by generic government advisories that do not consider field-specific harvest dates.
  - High linguistic and digital barriers; intimidated by tech-heavy corporate SaaS dashboards.
- **Needs**:
  - Simple, mobile-first interface in clear Hindi or plain English.
  - Rapid, reliable recommendation based on their exact timeline (e.g. "12 days until sowing").
  - Actionable checklist with real phone numbers and locations for local Custom Hiring Centres.

### Secondary Personas (Data Model & Future Expansion)
- **Custom Hiring Centre (CHC) Operator**: Needs to optimize equipment utilization rates during peak 20-day harvest windows.
- **Biomass Aggregator / Pellet Plant Procurement**: Needs reliable cluster estimation of paddy straw supply within 25–40 km economic hauling radii.

---

## 3. Product Principles & Anti-Goals

| What AgriCycle Is | What AgriCycle Is NOT |
| :--- | :--- |
| **Deterministic Decision Engine**: Operational data (costs, days, machinery compatibility) is computed using transparent agricultural rules. | **LLM Guesswork**: We do NOT let an AI make up distances, equipment compatibility, or hire rates. |
| **Field Notebook & Editorial Visuals**: Earthy, calm, high-contrast, structured tables, maps, and checklists. | **SaaS Card Grids**: No neon glowing cards, no purple gradients, no glassmorphism, no meaningless charts. |
| **Action-Oriented**: Ends in a 5-step concrete execution checklist with contacts. | **Academic Paper**: No endless scientific reports or unapplied calculations. |
| **Transparent Confidence**: Labels demonstration data honestly; states estimates clearly. | **False Authority**: Never claims nationwide real-time data or unverified CO2 credits. |

---

## 4. Key Functional Requirements

### 4.1. Visual & Accessibility Standards
- **Mobile-First Responsive Layout**: Designed first for a 360px–420px smartphone screen with 48px tap targets, high contrast (WCAG AAA in field sunlight), and single-column progressive disclosure. Expands gracefully to desktop.
- **Bilingual Interface**: Full toggle between English and हिन्दी (`hi-IN`). No partial translations; labels, form inputs, validation messages, and generated plans translate seamlessly.

### 4.2. Core User Journey Modules
1. **Editorial Landing**: Explains the harvest-to-sowing bottleneck and the decision path through restrained typography and agricultural imagery.
2. **Demo Access**: One-click demo login pre-configured with realistic northern Indian farmer profiles (e.g. Karnal Paddy Farmer, Ludhiana Wheat Farmer).
3. **Farmer Home (Field Record)**: Status of active residue assessments, current harvest cycle, and immediate action items.
4. **Residue Assessment Engine**:
   - Required: Crop (Paddy, Wheat, Sugarcane, Maize, Other), Residue quantity (tonnes or acreage equivalent), State/District/Village, Harvest Date, Next Sowing Date, Machinery owned/accessible.
   - Optional: Farmer priority (Lowest Cost, Fastest Solution, Maximum Economic Value, Long-term Soil Health).
5. **Operational Constraint Solver & Analysis State**: Real, deterministic evaluation of time windows, machinery fit, and radius-limited CHCs.
6. **Recommendation & Transparency Sheet**: Top-ranked primary pathway + structured rationale ("Why this option?") + secondary alternatives.
7. **Pathway Comparison Matrix**: Side-by-side comparison of In-situ, Ex-situ, and Biological pathways across cost, time, machinery, and environmental impact.
8. **Local Resource Registry & Spatial Map**: Interactive map showing verified and demonstration CHCs, baling contractors, and biomass aggregators within economic range.
9. **Interactive Action Plan**: Real checklist (booking, pre-irrigation, machine operation, verification) with persistent session state.
10. **Impact Ledger**: Grounded, verifiable calculations of residue diverted from open fire, particulate matter reduction, and soil organic carbon benefits.
11. **Assessment History**: Audit trail of previous assessments with option to re-evaluate or duplicate.

---

## 5. Success Metrics for MVP
- **Workflow Completion**: User can complete the journey from landing to action plan in under 3 minutes on mobile.
- **Zero Dead Ends**: 100% of buttons, filters, and interactive elements perform real actions.
- **Zero Hallucinations**: Recommendations cite real engine parameters; missing AI keys degrade seamlessly to local deterministic synthesis.
- **Offline Resilience**: Essential decision logic and cached resource directory function smoothly on poor rural cellular connections.
