# AgriCycle — Data Specification & Seed Registry

## 1. Domain Entities & TypeScript Data Contracts

All data operations within AgriCycle are governed by strict TypeScript interfaces to guarantee end-to-end type safety.

```typescript
export type CropType = 'paddy' | 'wheat' | 'sugarcane' | 'maize' | 'other';

export type FarmerPriority = 'lowest_cost' | 'fastest_solution' | 'max_economic_value' | 'soil_health';

export type MachineryOwned = 'none' | 'tractor_standard' | 'happy_seeder' | 'super_sms' | 'baler';

export type ResourceType = 'chc' | 'biomass_aggregator' | 'baler_operator' | 'pellet_plant';

export type VerificationStatus = 'verified_public' | 'demonstration_sample';

export interface AssessmentInput {
  id: string;
  timestamp: string;
  crop: CropType;
  acreage: number;
  residueTonnes: number;
  state: string;
  district: string;
  village: string;
  coordinates?: [number, number]; // [lat, lng]
  harvestDate: string; // ISO YYYY-MM-DD
  sowingDate: string;  // ISO YYYY-MM-DD
  machineryOwned: MachineryOwned;
  farmerPriority: FarmerPriority;
}

export interface PathwayOption {
  id: 'in_situ_chc' | 'ex_situ_baling' | 'biological_decomposer' | 'chc_surface_mulch';
  title: string;
  titleHi: string;
  category: 'in_situ' | 'ex_situ' | 'biological';
  suitabilityScore: number; // 0 - 100
  estimatedCostPerAcre: number; // in INR
  totalEstimatedCost: number; // in INR
  estimatedTimeDays: number;
  machineryRequired: string[];
  machineryRequiredHi: string[];
  advantages: string[];
  advantagesHi: string[];
  limitations: string[];
  limitationsHi: string[];
  carbonRetainedKgPerAcre: number;
  recommended: boolean;
}

export interface ResourceEntity {
  id: string;
  name: string;
  nameHi: string;
  type: ResourceType;
  state: string;
  district: string;
  block: string;
  coordinates: [number, number]; // [latitude, longitude]
  contactPerson: string;
  contactPhone: string;
  equipmentAvailable: string[];
  equipmentAvailableHi: string[];
  hiringRateBenchmark: string; // e.g., "₹1,400 - ₹1,800/acre"
  verificationStatus: VerificationStatus;
  notes?: string;
  notesHi?: string;
}

export interface ActionPlanStep {
  id: string;
  order: number;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  recommendedTimeline: string;
  recommendedTimelineHi: string;
  contactResourceRef?: string; // Resource ID
  completed: boolean;
}

export interface ImpactSummary {
  residueManagedTonnes: number;
  selectedPathwayId: string;
  selectedPathwayTitle: string;
  selectedPathwayTitleHi: string;
  estimatedDistanceKm: number;
  estimatedOperationalCostINR: number;
  openBurningAvoided: boolean;
  potentialEnvironmentalImpactNotes: string[];
  potentialEnvironmentalImpactNotesHi: string[];
  assumptionsNotes: string[];
  assumptionsNotesHi: string[];
}
```

---

## 2. Realistic Regional Seed Registry

Seed data provides authentic local Custom Hiring Centres (CHCs), baling cooperatives, and pelleting plants across focus districts.

### 2.1. Karnal District (Haryana) — Primary Demo Focus
1. **Taraori Kisan Cooperative Custom Hiring Centre**
   - *Type*: Custom Hiring Centre (`chc`)
   - *Coordinates*: `[29.8021, 76.9298]`
   - *Equipment*: Happy Seeder (3 units), Super SMS attached combines (4 units), Mulcher (2 units)
   - *Rate*: ₹1,500 – ₹1,800 / acre
   - *Status*: `verified_public` (State Dept of Agriculture registered)
   - *Contact*: Dalbir Singh, +91 98120 44521

2. **Indri Agri Machinery Bank**
   - *Type*: Custom Hiring Centre (`chc`)
   - *Coordinates*: `[29.8805, 77.0583]`
   - *Equipment*: Smart Seeder, Zero Till Drill, Reversible Mould Board Plough
   - *Rate*: ₹1,400 – ₹1,700 / acre
   - *Status*: `verified_public`
   - *Contact*: Harpreet Singh, +91 94162 11983

3. **Gharaunda Biomass Aggregation Hub**
   - *Type*: Biomass Aggregator / Baler (`biomass_aggregator`)
   - *Coordinates*: `[29.5392, 76.9744]`
   - *Equipment*: High-density Square Balers (4 units), Rakes
   - *Rate*: Purchases baled paddy straw at ₹1,600/tonne delivered
   - *Status*: `demonstration_sample`
   - *Contact*: Rajesh Choudhary, +91 98964 88310

---

### 2.2. Sangrur & Ludhiana Districts (Punjab)
1. **Sunam Block Agricultural Cooperative CHC (Sangrur)**
   - *Type*: `chc`
   - *Coordinates*: `[30.1303, 75.8038]`
   - *Equipment*: PAU Smart Seeder, Happy Seeder, Straw Chopper
   - *Rate*: ₹1,600 / acre
   - *Status*: `verified_public`

2. **Jagraon Agro Baling Services (Ludhiana)**
   - *Type*: `baler_operator`
   - *Coordinates*: `[30.7850, 75.4789]`
   - *Equipment*: Round Balers, Tractor Rakes
   - *Rate*: ₹1,200/acre field baling charge or straw buyout
   - *Status*: `demonstration_sample`

---

### 2.3. Meerut District (Western Uttar Pradesh)
1. **Mawana Sugarcane Trash & Residue Processing Cooperative**
   - *Type*: `chc`
   - *Coordinates*: `[29.1025, 77.9221]`
   - *Equipment*: Sugarcane Ratoon Stubble Shaver, Trash Mulcher, Pusa Decomposer spray rigs
   - *Rate*: ₹1,350 / acre
   - *Status*: `demonstration_sample`

---

## 3. Data Access Layer (Repository Pattern)

All components access data via an abstracted Repository interface (`IResourceRepository`, `IAssessmentRepository`):
- `resourceRepository.getNearbyResources(lat, lng, radiusKm)`
- `resourceRepository.getById(id)`
- `assessmentRepository.save(assessment)`
- `assessmentRepository.getHistory()`

This decouples the UI from whether data comes from local TypeScript seed files, IndexedDB, or future backend REST/GraphQL microservices.
