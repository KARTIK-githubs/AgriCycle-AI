export type Language = 'en' | 'hi';

export interface NavItem {
  id: string;
  label: string;
  labelHi: string;
  href: string;
  badge?: string;
  badgeHi?: string;
}

export interface DemoUser {
  id: string;
  name: string;
  nameHi: string;
  role: string;
  roleHi: string;
  location: {
    village: string;
    villageHi: string;
    district: string;
    districtHi: string;
    state: string;
    stateHi: string;
  };
  crop: string;
  cropHi: string;
  acreage: number;
  machinery: string;
  machineryHi: string;
  defaultResidueTonnes: number;
}

export type CropType = 'paddy' | 'wheat' | 'sugarcane' | 'maize' | 'other';
export type FarmerPriority = 'lowest_cost' | 'fastest_solution' | 'max_economic_value' | 'soil_health';
export type MachineryOwned = 'none' | 'tractor_standard' | 'happy_seeder' | 'super_sms' | 'baler';

export interface AssessmentInput {
  id: string;
  timestamp: string;
  crop: CropType;
  customCropName?: string;
  residueTonnes: number;
  acreage: number;
  state: string;
  district: string;
  village: string;
  harvestDate: string; // YYYY-MM-DD
  sowingDate: string;  // YYYY-MM-DD
  windowDays: number;
  machineryOwned: MachineryOwned;
  machineryDetails?: string;
  farmerPriority: FarmerPriority;
  status: 'pending_analysis' | 'analyzed' | 'action_in_progress' | 'completed';
}

export interface DistrictOption {
  value: string;
  label: string;
  labelHi: string;
  state: string;
}

export const REGIONAL_DISTRICTS: DistrictOption[] = [
  // Haryana
  { value: 'Karnal', label: 'Karnal', labelHi: 'करनाल', state: 'Haryana' },
  { value: 'Kaithal', label: 'Kaithal', labelHi: 'कैथल', state: 'Haryana' },
  { value: 'Kurukshetra', label: 'Kurukshetra', labelHi: 'कुरुक्षेत्र', state: 'Haryana' },
  { value: 'Ambala', label: 'Ambala', labelHi: 'अम्बाला', state: 'Haryana' },
  { value: 'Panipat', label: 'Panipat', labelHi: 'पानीपत', state: 'Haryana' },
  // Punjab
  { value: 'Sangrur', label: 'Sangrur', labelHi: 'संगरूर', state: 'Punjab' },
  { value: 'Ludhiana', label: 'Ludhiana', labelHi: 'लुधियाना', state: 'Punjab' },
  { value: 'Patiala', label: 'Patiala', labelHi: 'पटियाला', state: 'Punjab' },
  { value: 'Bathinda', label: 'Bathinda', labelHi: 'बठिंडा', state: 'Punjab' },
  { value: 'Fatehgarh Sahib', label: 'Fatehgarh Sahib', labelHi: 'फतेहगढ़ साहिब', state: 'Punjab' },
  // Western Uttar Pradesh
  { value: 'Meerut', label: 'Meerut', labelHi: 'मेरठ', state: 'Uttar Pradesh' },
  { value: 'Muzaffarnagar', label: 'Muzaffarnagar', labelHi: 'मुज़फ़्फ़रनगर', state: 'Uttar Pradesh' },
  { value: 'Shamli', label: 'Shamli', labelHi: 'शामली', state: 'Uttar Pradesh' },
  { value: 'Saharanpur', label: 'Saharanpur', labelHi: 'सहारनपुर', state: 'Uttar Pradesh' },
];

export type StepStatus = 'not_started' | 'in_progress' | 'completed';
export type StepResponsibility = 'farmer' | 'operator' | 'chc_provider' | 'transport_operator';

export interface ActionPlanStep {
  id: string;
  stepNumber: number;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  responsibility: StepResponsibility;
  responsibilityLabel: string;
  responsibilityLabelHi: string;
  targetDayOffset: number; // offset in days from harvestDate
  status: StepStatus;
  completedAt?: string;
  guidanceNotes?: string;
  guidanceNotesHi?: string;
}

export type DataCategory = 'USER_REPORTED' | 'ESTIMATED' | 'CALCULATED' | 'DEMO';

export interface ImpactRecord {
  id: string;
  assessmentId: string;
  timestamp: string; // ISO string when recorded
  completionDate: string; // YYYY-MM-DD
  crop: CropType;
  customCropName?: string;
  residueTonnes: number; // USER_REPORTED
  acreage: number; // USER_REPORTED
  location: {
    village: string;
    district: string;
    state: string;
  };
  pathwayId: string;
  pathwayName: string;
  pathwayNameHi: string;
  resourceId?: string;
  resourceName?: string;
  resourceNameHi?: string;
  resourceDistanceKm?: number; // ESTIMATED
  estimatedCostTotalINR: number; // ESTIMATED
  openBurningAvoided: boolean; // USER_REPORTED
  completionStatus: 'fully_completed' | 'partially_completed'; // USER_REPORTED
  farmerNotes?: string; // USER_REPORTED
}

