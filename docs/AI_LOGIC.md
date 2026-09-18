# AgriCycle — Decision Engine & AI Logic Specification

## 1. Architectural Philosophy: The Hybrid Decision Engine

AgriCycle strictly enforces a **two-layer hybrid decision architecture**:

```
┌────────────────────────────────────────────────────────────────────────┐
│ LAYER 1: DETERMINISTIC CONSTRAINT SOLVER (Pure TypeScript Engine)       │
│ • Evaluates crop compatibility, tonnage, and moisture assumptions      │
│ • Checks hard time-window boundaries (Harvest Date -> Sowing Date)     │
│ • Matches local machinery availability & geographic distances          │
│ • Calculates transparent operational costs and Suitability Scores     │
│ • SOURCE OF TRUTH FOR ALL OPERATIONAL & FACTUAL DATA                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Structured JSON Output
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ LAYER 2: NARRATIVE EXPLANATION LAYER (Groq LLM + Local Fallback)       │
│ • Translates structured solver output into accessible farmer language  │
│ • Formulates bilingual (English/Hindi) "Why this option?" rationale    │
│ • Generates customized action plan advice                              │
│ • ZERO HALLUCINATION: Only reasons over Layer 1 structured JSON        │
│ • 100% Deterministic Fallback: Works with zero API keys or offline    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Layer 1: Deterministic Scoring & Constraints

### 2.1. Candidate Management Pathways
The engine evaluates four primary pathways:
1. `in_situ_chc`: **In-situ Incorporation via Custom Hiring Centre** (Super SMS on combine harvester + Happy Seeder / Smart Seeder sowing directly into mulch).
2. `ex_situ_baling`: **Ex-situ Baling & Off-field Utilization** (Rake + Baler machinery; supply to nearby biomass pellet plant, cardboard factory, or power plant).
3. `biological_decomposer`: **Bio-decomposer Microbial Spray** (Pusa Decomposer / bio-enzyme application followed by light rotavator mixing and field wetting).
4. `chc_surface_mulch`: **Surface Mulching & Zero-till Direct Drilling** (Straw Management System + Zero-Till drill without baling).

---

### 2.2. Mathematical Formulation of Suitability Score ($S_p$)

For each candidate pathway $p$, the Suitability Score $S_p \in [0, 100]$ is computed as:

$$S_p = \text{round}\left( 100 \times \left[ w_{\text{crop}} C_p + w_{\text{time}} T_p + w_{\text{mach}} M_p + w_{\text{dist}} D_p + w_{\text{cost}} K_p + w_{\text{prio}} P_p \right] \right)$$

Where weights sum to $1.0$:
- $w_{\text{crop}} = 0.20$ (Crop physical compatibility)
- $w_{\text{time}} = 0.25$ (Critical time-window feasibility)
- $w_{\text{mach}} = 0.15$ (Machinery ownership & local CHC access)
- $w_{\text{dist}} = 0.10$ (Proximity to nearest resource)
- $w_{\text{cost}} = 0.15$ (Net estimated operational expenditure)
- $w_{\text{prio}} = 0.15$ (Farmer stated priority alignment)

---

### 2.3. Scoring Parameter Definitions

#### 1. Time Window Factor ($T_p \in [0.1, 1.0]$)
Let $\Delta t = \text{Sowing Date} - \text{Harvest Date}$ (days):
- **If $\Delta t < 8$ days** (Extreme urgency):
  - In-situ Happy Seeder: $T_p = 1.0$ (Sowing occurs simultaneously with mulching).
  - Ex-situ Baling: $T_p = 0.4$ (High risk: baler aggregation + transport takes 5–8 days; field may not clear in time).
  - Bio-decomposer: $T_p = 0.1$ (Critical failure: biological decomposition requires 20–25 days; cannot be recommended).
- **If $8 \le \Delta t \le 18$ days** (Standard window, e.g. Karnal Paddy-Wheat rotation):
  - In-situ Happy Seeder / Super SMS: $T_p = 0.95$
  - Ex-situ Baling: $T_p = 0.85$ (Feasible if CHC baler within 15 km)
  - Bio-decomposer: $T_p = 0.40$
- **If $\Delta t > 18$ days** (Generous window):
  - Bio-decomposer: $T_p = 0.95$
  - In-situ & Ex-situ: $T_p = 0.90$

#### 2. Machinery Compatibility Factor ($M_p \in [0.2, 1.0]$)
- Farmer owns matching machinery: $M_p = 1.0$.
- Farmer owns standard 50HP tractor: $M_p = 0.85$ (Can hitch hired Happy Seeder or Baler).
- Farmer owns no machinery, but verified CHC with active equipment is within 15 km: $M_p = 0.80$.
- No CHC within 25 km: $M_p = 0.25$.

#### 3. Farmer Priority Multiplier ($P_p \in [0.3, 1.0]$)
- **Lowest Cost**: In-situ Happy Seeder rental has lowest net operating cost (~₹1,500–₹1,800/acre).
- **Fastest Solution**: In-situ direct seeding yields fastest field turnaround (1 day).
- **Maximum Economic Value**: Ex-situ baling allows sale of biomass bales to pellet plants (₹150–₹180/quintal).
- **Soil Health & Moisture**: Bio-decomposer and in-situ mulch add 3.5–4.5 tonnes organic carbon per hectare.

---

## 3. Layer 2: LLM Integration & Zero-Hallucination Guardrails

### 3.1. Prompt Engineering & Grounding Rules
When an API key (such as `GROQ_API_KEY`) is available:
- The system calls Groq (e.g. `llama-3.1-8b-instant` or `llama-3.3-70b-versatile`) via a dedicated service endpoint.
- **Strict Temperature**: Set to `0.1` to prevent decorative or speculative output.
- **System Guardrail**:
  > "You are the AgriCycle Decision Translator. You receive structured factual output from the deterministic agricultural solver. You must NEVER invent machinery, phone numbers, names, or distances not present in the payload. Explain the recommendation in empathetic, practical farmer language. Clearly state that estimates must be confirmed locally."

### 3.2. Deterministic Fallback Engine (Offline / No-Key Mode)
AgriCycle **MUST NEVER BREAK** if an API key is absent, expired, or rate-limited.
A dedicated `DeterministicExplanationSynthesizer` generates natural, grammatically flawless bilingual rationales:

#### English Template Output:
> **Recommended Pathway**: In-Situ Management via Custom Hiring Centre (Super SMS & Happy Seeder)  
> **Why this option?**:  
> 1. Your harvest-to-sowing window of **{days} days** requires an immediate turnaround.  
> 2. You do not own heavy equipment, but **{chcName}** is located **{distance} km** away with verified seeder availability.  
> 3. Aligns with your priority for **{priority}**, keeping estimated hiring expenses to approx **₹{cost}**.  
> *Notice: Estimated rates based on regional state benchmarks. Always confirm equipment slot directly before field prep.*

#### Hindi Template Output:
> **अनुशंसित विकल्प**: कस्टम हायरिंग सेंटर द्वारा इन-सिटू प्रबंधन (सुपर एसएमएस एवं हैप्पी सीडर)  
> **यह विकल्प क्यों चुना गया?**:  
> 1. आपकी कटाई से अगली बुवाई के बीच केवल **{days} दिन** का समय है, जिसके लिए तत्काल समाधान आवश्यक है।  
> 2. आपके पास स्वयं की भारी मशीन नहीं है, लेकिन **{chcName}** आपके गांव से मात्र **{distance} किमी** की दूरी पर उपलब्ध है।  
> 3. यह आपकी प्राथमिकता (**{priority}**) के अनुसार सबसे किफायती (अनुमानित खर्च ₹{cost}) विकल्प है।  
> *सूचना: यह अनुमानित दरें हैं। खेत में कार्य शुरू करने से पहले संचालक से पुष्टि अवश्य करें।*

---

## 4. Responsible AI & Operational Safety
- **No Scientific Fabrication**: Avoid claiming unverified carbon credit values or exact GHG reduction percentages. Use verifiable emission factors (e.g. CPCB baseline: 1 tonne paddy residue burned releases ~1.46 kg PM2.5).
- **Farmer Agency**: The top pathway is marked `Recommended`, but the user has full agency to select any feasible alternative on the `/compare` screen.
- **Explicit Labeling**: Every metric is clearly flagged as `Estimated — verify locally`.
