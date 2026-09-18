import { describe, it, expect } from 'vitest';
import {
  SEED_RESOURCES,
  DISTRICT_CENTROIDS,
  calculateDistanceKm,
} from '../src/data/seedResources';
import { findNearestResourceForPathway, evaluateAssessment } from '../src/engine/solver';
import { AssessmentInput } from '../src/types';

describe('Phase 4: Spatial Resources & Pathway Comparison Tests', () => {
  const farmCentroidKarnal = DISTRICT_CENTROIDS['Karnal']; // [29.6857, 76.9905]

  // Test 1: Haversine distance calculator accuracy
  it('calculates realistic geographic distances between district centroids and resources', () => {
    // Distance from Karnal centroid to Taraori CHC [29.8021, 76.9298]
    const distTaraori = calculateDistanceKm(farmCentroidKarnal, [29.8021, 76.9298]);
    expect(distTaraori).toBeGreaterThan(10);
    expect(distTaraori).toBeLessThan(20);

    // Distance from Karnal to Ludhiana baler [30.7850, 75.4789]
    const distLudhiana = calculateDistanceKm(farmCentroidKarnal, [30.7850, 75.4789]);
    expect(distLudhiana).toBeGreaterThan(150);
    expect(distLudhiana).toBeLessThan(220);

    // Same point distance should be 0
    expect(calculateDistanceKm(farmCentroidKarnal, farmCentroidKarnal)).toBe(0);
  });

  // Test 2: Seed resources integrity and honest labeling
  it('ensures all seed resources adhere to honest data labeling rules', () => {
    expect(SEED_RESOURCES.length).toBeGreaterThanOrEqual(6);

    SEED_RESOURCES.forEach((resource) => {
      // Must have valid coordinates
      expect(resource.coordinates).toHaveLength(2);
      expect(resource.coordinates[0]).toBeGreaterThan(25);
      expect(resource.coordinates[1]).toBeGreaterThan(70);

      // Must have valid verification status
      expect(['verified_public', 'demonstration_sample']).toContain(resource.verificationStatus);

      // Must have valid type
      expect(['chc', 'baler_operator', 'biomass_aggregator', 'pellet_plant']).toContain(resource.type);

      // Must specify supported pathways
      expect(resource.supportedPathways.length).toBeGreaterThan(0);

      // Honest contact check: phone numbers must either be valid format or handled cleanly
      if (resource.contactPhone) {
        expect(resource.contactPhone).toMatch(/^\+91/);
      }
    });
  });

  // Test 3: Nearest resource resolution for pathways
  it('resolves the closest matching resource for a given pathway and district', () => {
    const inSituMatch = findNearestResourceForPathway('Karnal', 'in_situ_incorporation');
    expect(inSituMatch).not.toBeNull();
    expect(inSituMatch?.resource.district).toBe('Karnal');
    expect(inSituMatch?.resource.supportedPathways).toContain('in_situ_incorporation');
    expect(inSituMatch?.distanceKm).toBeLessThan(25);

    const balerMatch = findNearestResourceForPathway('Ludhiana', 'ex_situ_baling');
    expect(balerMatch).not.toBeNull();
    expect(balerMatch?.resource.district).toBe('Ludhiana');
    expect(balerMatch?.resource.supportedPathways).toContain('ex_situ_baling');
  });

  // Test 4: Resource filtering by pathway relevance
  it('filters resources correctly according to pathway compatibility', () => {
    const balingResources = SEED_RESOURCES.filter((r) =>
      r.supportedPathways.includes('ex_situ_baling')
    );
    expect(balingResources.length).toBeGreaterThan(0);
    balingResources.forEach((r) => {
      expect(['baler_operator', 'biomass_aggregator']).toContain(r.type);
    });

    const inSituResources = SEED_RESOURCES.filter((r) =>
      r.supportedPathways.includes('in_situ_incorporation')
    );
    expect(inSituResources.length).toBeGreaterThan(0);
    inSituResources.forEach((r) => {
      expect(r.type).toBe('chc');
    });
  });

  // Test 5: Integration with deterministic evaluation output
  it('provides genuine candidate scoring and nearest resource pairing in evaluation', () => {
    const sampleInput: AssessmentInput = {
      id: 'test-phase4',
      timestamp: new Date().toISOString(),
      crop: 'paddy',
      residueTonnes: 16,
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

    const result = evaluateAssessment(sampleInput);
    expect(result.primaryRecommendation).toBeDefined();
    expect(result.primaryRecommendation.nearestResource).toBeDefined();
    expect(result.primaryRecommendation.distanceKm).toBeGreaterThan(0);

    // Suitability Score should be 0-100
    expect(result.primaryRecommendation.suitabilityScore).toBeGreaterThan(0);
    expect(result.primaryRecommendation.suitabilityScore).toBeLessThanOrEqual(100);

    // Check that excluded pathways have reasons
    result.excludedPathways.forEach((ep) => {
      expect(ep.exclusionReason).toBeDefined();
      expect(ep.exclusionReasonHi).toBeDefined();
    });
  });
});
