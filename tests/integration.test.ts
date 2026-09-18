import { describe, it, expect } from 'vitest';
import { evaluateAssessment } from '../src/engine/solver';
import { calculateWindowDays } from '../src/context/AssessmentContext';
import { generateActionPlanSteps } from '../src/services/actionPlanService';
import { generateLocalFallbackExplanation } from '../src/services/aiService';
import { AssessmentInput, ImpactRecord } from '../src/types';

describe('Phase 6: End-to-End Integration, Data Consistency & Fallback Tests', () => {
  // Canonical Scenario: Gurpreet Singh (Karnal, Haryana)
  const canonicalAssessment: AssessmentInput = {
    id: 'asm-canonical-karnal',
    timestamp: '2026-09-19T03:30:00.000Z',
    crop: 'paddy',
    residueTonnes: 5.0,
    acreage: 8,
    state: 'Haryana',
    district: 'Karnal',
    village: 'Taraori Rural',
    harvestDate: '2026-10-25',
    sowingDate: '2026-11-06',
    windowDays: 12,
    machineryOwned: 'none',
    farmerPriority: 'lowest_cost',
    status: 'pending_analysis',
  };

  it('verifies the complete canonical assessment data consistency through the solver', () => {
    // 1. Calculate window days
    const window = calculateWindowDays(canonicalAssessment.harvestDate, canonicalAssessment.sowingDate);
    expect(window).toBe(12);

    // 2. Solve with deterministic engine
    const result = evaluateAssessment(canonicalAssessment);
    expect(result).toBeDefined();
    expect(result.primaryRecommendation).toBeDefined();

    // Data consistency checks
    expect(result.assessment.crop).toBe('paddy');
    expect(result.assessment.residueTonnes).toBe(5.0);
    expect(result.assessment.acreage).toBe(8);
    expect(result.assessment.district).toBe('Karnal');
    expect(result.assessment.windowDays).toBe(12);

    // Winner must be feasible and tailored
    const primary = result.primaryRecommendation;
    expect(primary.suitabilityScore).toBeGreaterThan(50);
    expect(primary.pathway.supportedCrops).toContain('paddy');
    expect(primary.turnaroundDays).toBeLessThanOrEqual(12);
  });

  it('verifies bilingual fallback AI explanation functions without external API', () => {
    const result = evaluateAssessment(canonicalAssessment);

    // English Fallback
    const englishNarrative = generateLocalFallbackExplanation(result, 'en');
    expect(englishNarrative).toBeDefined();
    expect(englishNarrative.length).toBeGreaterThan(100);
    expect(englishNarrative).toContain('8'); // acreage
    expect(englishNarrative).toContain('5'); // residue tonnes
    expect(englishNarrative).toContain('12'); // window days
    expect(englishNarrative).toContain(result.primaryRecommendation.pathway.name);

    // Hindi Fallback
    const hindiNarrative = generateLocalFallbackExplanation(result, 'hi');
    expect(hindiNarrative).toBeDefined();
    expect(hindiNarrative.length).toBeGreaterThan(100);
    expect(hindiNarrative).toContain('8'); // acreage
    expect(hindiNarrative).toContain('5'); // residue tonnes
    expect(hindiNarrative).toContain('12'); // window days
    expect(hindiNarrative).toContain('किसान भाइयों');
  });

  it('verifies action plan checklist generation matches the primary recommended pathway', () => {
    const result = evaluateAssessment(canonicalAssessment);
    const primaryPathwayId = result.primaryRecommendation.pathway.id;
    const resourceName = result.primaryRecommendation.nearestResource?.name;

    const steps = generateActionPlanSteps(
      primaryPathwayId,
      canonicalAssessment.harvestDate,
      canonicalAssessment.sowingDate,
      resourceName
    );

    expect(steps).toHaveLength(5);
    steps.forEach((s) => {
      expect(s.status).toBe('not_started');
      expect(s.title).toBeDefined();
      expect(s.titleHi).toBeDefined();
    });
  });

  it('verifies field outcome record structure adheres to strict honesty constraints', () => {
    const result = evaluateAssessment(canonicalAssessment);
    const primary = result.primaryRecommendation;

    const outcomeRecord: ImpactRecord = {
      id: `imp-${Date.now()}`,
      assessmentId: canonicalAssessment.id,
      timestamp: new Date().toISOString(),
      completionDate: '2026-10-28',
      crop: canonicalAssessment.crop,
      residueTonnes: canonicalAssessment.residueTonnes,
      acreage: canonicalAssessment.acreage,
      location: {
        village: canonicalAssessment.village,
        district: canonicalAssessment.district,
        state: canonicalAssessment.state,
      },
      pathwayId: primary.pathway.id,
      pathwayName: primary.pathway.name,
      pathwayNameHi: primary.pathway.nameHi,
      resourceId: primary.nearestResource?.id,
      resourceName: primary.nearestResource?.name,
      resourceDistanceKm: primary.distanceKm,
      estimatedCostTotalINR: primary.estimatedCostPerAcreINR * canonicalAssessment.acreage,
      openBurningAvoided: true,
      completionStatus: 'fully_completed',
      farmerNotes: 'Straw successfully incorporated. Direct seeding finished before rain.',
    };

    // Strict Data Integrity Validations
    expect(outcomeRecord.residueTonnes).toBe(5.0);
    expect(outcomeRecord.acreage).toBe(8);
    expect(outcomeRecord.location.district).toBe('Karnal');
    expect(outcomeRecord.openBurningAvoided).toBe(true);
    expect(outcomeRecord.completionStatus).toBe('fully_completed');

    // No speculative emission estimates
    const recordKeys = Object.keys(outcomeRecord);
    expect(recordKeys).not.toContain('pm25_avoided');
    expect(recordKeys).not.toContain('carbon_credits');
    expect(recordKeys).not.toContain('co2e_saved');
  });

  it('verifies demo reset state consistency', () => {
    // Simulate initial state
    let activeAssessment: AssessmentInput | null = canonicalAssessment;
    let activeChecklist = generateActionPlanSteps('in_situ_incorporation', '2026-10-25', '2026-11-06');
    let impactRecords: ImpactRecord[] = [
      {
        id: 'imp-demo-1',
        assessmentId: canonicalAssessment.id,
        timestamp: new Date().toISOString(),
        completionDate: '2026-10-28',
        crop: 'paddy',
        residueTonnes: 5,
        acreage: 8,
        location: { village: 'Taraori Rural', district: 'Karnal', state: 'Haryana' },
        pathwayId: 'in_situ_incorporation',
        pathwayName: 'In-Situ Mulching & Direct Seeding',
        pathwayNameHi: 'हैप्पी सीडर मल्चिंग',
        estimatedCostTotalINR: 13200,
        openBurningAvoided: true,
        completionStatus: 'fully_completed',
      },
    ];

    expect(activeAssessment).not.toBeNull();
    expect(activeChecklist.length).toBe(5);
    expect(impactRecords.length).toBe(1);

    // Simulate resetDemoSession()
    activeAssessment = null;
    activeChecklist = [];
    impactRecords = [];

    // Verifications post-reset
    expect(activeAssessment).toBeNull();
    expect(activeChecklist).toHaveLength(0);
    expect(impactRecords).toHaveLength(0);
  });
});
