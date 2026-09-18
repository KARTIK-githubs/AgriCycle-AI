import { describe, it, expect } from 'vitest';
import { evaluateAssessment, findNearestResourceForPathway } from '../src/engine/solver';
import { generateLocalFallbackExplanation } from '../src/services/aiService';
import { AssessmentInput } from '../src/types';

describe('AgriCycle Deterministic Decision Engine', () => {
  // Baseline Assessment Factory
  const createAssessment = (overrides?: Partial<AssessmentInput>): AssessmentInput => ({
    id: 'test-asm-1',
    timestamp: new Date().toISOString(),
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
    ...overrides,
  });

  // Test A: Paddy + 12-day window + no machinery
  it('A. Evaluates Paddy with 12-day window and no machinery correctly', () => {
    const input = createAssessment();
    const result = evaluateAssessment(input);

    expect(result.primaryRecommendation).toBeDefined();
    expect(result.primaryRecommendation.feasible).toBe(true);
    expect(result.primaryRecommendation.suitabilityScore).toBeGreaterThan(50);
    // Bio-decomposer should be excluded because 12 days < 20 days minimum
    const bioExcluded = result.excludedPathways.find(p => p.pathway.id === 'biological_decomposition');
    expect(bioExcluded).toBeDefined();
    expect(bioExcluded?.feasible).toBe(false);
    expect(bioExcluded?.exclusionReason).toContain('minimum of 20 days');
  });

  // Test B: Paddy + long enough window (e.g. 25 days) + appropriate machinery
  it('B. Allows bio-decomposer and rewards owned machinery when window is generous (25 days)', () => {
    const input = createAssessment({
      windowDays: 25,
      harvestDate: '2026-10-10',
      sowingDate: '2026-11-04',
      machineryOwned: 'tractor_standard',
      farmerPriority: 'soil_health',
    });
    const result = evaluateAssessment(input);

    // With 25 days, biological decomposition should be feasible
    const bioCandidate = [result.primaryRecommendation, ...result.alternativeOptions]
      .find(p => p.pathway.id === 'biological_decomposition');
    expect(bioCandidate).toBeDefined();
    expect(bioCandidate?.feasible).toBe(true);
    expect(result.excludedPathways.find(p => p.pathway.id === 'biological_decomposition')).toBeUndefined();
  });

  // Test C & H: Different farmer priorities change scoring and ranking where appropriate
  it('C & H. Confirms changing farmer priority shifts suitability scores', () => {
    const costInput = createAssessment({ farmerPriority: 'lowest_cost', windowDays: 15 });
    const soilInput = createAssessment({ farmerPriority: 'soil_health', windowDays: 25 });
    const econInput = createAssessment({ farmerPriority: 'max_economic_value', windowDays: 15 });

    const costResult = evaluateAssessment(costInput);
    const soilResult = evaluateAssessment(soilInput);
    const econResult = evaluateAssessment(econInput);

    // In-situ score should vary between cost and soil priorities
    const inSituCostScore = [costResult.primaryRecommendation, ...costResult.alternativeOptions]
      .find(p => p.pathway.id === 'in_situ_incorporation')?.suitabilityScore;
    const inSituSoilScore = [soilResult.primaryRecommendation, ...soilResult.alternativeOptions]
      .find(p => p.pathway.id === 'in_situ_incorporation')?.suitabilityScore;

    expect(inSituCostScore).toBeDefined();
    expect(inSituSoilScore).toBeDefined();

    // Max economic value should strongly reward biomass utilization
    const econBiomass = [econResult.primaryRecommendation, ...econResult.alternativeOptions]
      .find(p => p.pathway.id === 'biomass_utilization');
    const costBiomass = [costResult.primaryRecommendation, ...costResult.alternativeOptions]
      .find(p => p.pathway.id === 'biomass_utilization');

    expect(econBiomass?.scoringFactors.priorityScore).toBeGreaterThan(costBiomass?.scoringFactors.priorityScore || 0);
  });

  // Test D: Hard feasibility exclusion when time window is insufficient
  it('D. Excludes pathways that cannot satisfy minimum time window with clear reason', () => {
    // Window of only 4 days: baling (needs 6) and decomposer (needs 20) must fail
    const tightInput = createAssessment({ windowDays: 4 });
    const result = evaluateAssessment(tightInput);

    const balingExcluded = result.excludedPathways.find(p => p.pathway.id === 'ex_situ_baling');
    const decomposerExcluded = result.excludedPathways.find(p => p.pathway.id === 'biological_decomposition');

    expect(balingExcluded).toBeDefined();
    expect(balingExcluded?.exclusionReason).toContain('minimum of 6 days');
    expect(decomposerExcluded).toBeDefined();
    expect(decomposerExcluded?.exclusionReason).toContain('minimum of 20 days');
  });

  // Test E: Resource distance search & resolution
  it('E. Finds nearest Custom Hiring Centre in dataset', () => {
    const karnalRes = findNearestResourceForPathway('Karnal', 'in_situ_incorporation');
    expect(karnalRes).toBeDefined();
    expect(karnalRes?.resource.district).toBe('Karnal');
    expect(karnalRes?.distanceKm).toBeLessThan(30);

    const sangrurRes = findNearestResourceForPathway('Sangrur', 'in_situ_incorporation');
    expect(sangrurRes).toBeDefined();
    expect(sangrurRes?.resource.district).toBe('Sangrur');
  });

  // Test F: Different residue quantities compute correct totals
  it('F. Calculates total operational costs across varying residue tonnages and acreage', () => {
    const smallFarm = createAssessment({ acreage: 3, residueTonnes: 2.0 });
    const largeFarm = createAssessment({ acreage: 20, residueTonnes: 15.0 });

    const smallResult = evaluateAssessment(smallFarm);
    const largeResult = evaluateAssessment(largeFarm);

    expect(largeResult.primaryRecommendation.estimatedCostTotalINR)
      .toBeGreaterThan(smallResult.primaryRecommendation.estimatedCostTotalINR);
  });

  // Test G: Different locations (Karnal vs Sangrur vs Meerut)
  it('G. Correctly resolves local CHC partners across different districts', () => {
    const karnalResult = evaluateAssessment(createAssessment({ district: 'Karnal', state: 'Haryana' }));
    const meerutResult = evaluateAssessment(createAssessment({ district: 'Meerut', state: 'Uttar Pradesh', crop: 'sugarcane' }));

    expect(karnalResult.primaryRecommendation.nearestResource?.state).toBe('Haryana');
    expect(meerutResult.primaryRecommendation.nearestResource?.state).toBe('Uttar Pradesh');
  });

  // Test I & J: Deterministic fallback produces complete bilingual explanation without API
  it('I & J. Deterministic fallback produces complete bilingual explanation without Groq', () => {
    const input = createAssessment();
    const result = evaluateAssessment(input);

    const explanationEn = generateLocalFallbackExplanation(result, 'en');
    const explanationHi = generateLocalFallbackExplanation(result, 'hi');

    expect(explanationEn).toContain('Field Operational Advisory for Farmer:');
    expect(explanationEn).toContain('12-day');
    expect(explanationEn).toContain('5 tonnes');
    expect(explanationEn).toContain(result.primaryRecommendation.pathway.name);

    expect(explanationHi).toContain('किसान भाइयों के लिए विशेष परामर्श:');
    expect(explanationHi).toContain('12 दिन');
    expect(explanationHi).toContain('5 टन');
    expect(explanationHi).toContain(result.primaryRecommendation.pathway.nameHi);
  });
});
