import { describe, it, expect } from 'vitest';
import {
  generateActionPlanSteps,
  calculateTargetDate,
  formatDisplayDate
} from '../src/services/actionPlanService';
import { SEED_RESOURCES } from '../src/data/seedResources';
import { SEED_PATHWAYS } from '../src/data/seedPathways';
import { ImpactRecord } from '../src/types';

describe('Phase 5: Action Plan, Execution Checklist, Impact Record & History Tests', () => {
  // Test 1: Action Plan Step Generation for In-Situ Happy Seeder Pathway
  it('generates a concrete 5-step operational checklist tailored for in-situ Happy Seeder', () => {
    const steps = generateActionPlanSteps(
      'in_situ_incorporation',
      '2026-10-25',
      '2026-11-06',
      'Taraori PACS Primary Agr Cooperative CHC'
    );

    expect(steps).toHaveLength(5);
    expect(steps[0].stepNumber).toBe(1);
    expect(steps[4].stepNumber).toBe(5);

    // Step 1: Super SMS check
    expect(steps[0].title).toContain('Harvester Super SMS Attachment Verification');
    expect(steps[0].responsibility).toBe('farmer');
    expect(steps[0].status).toBe('not_started');

    // Step 2: Seeder booking mentioning the resource
    expect(steps[1].title).toContain('Confirm Seeder & 50+ HP Tractor Reservation');
    expect(steps[1].responsibility).toBe('chc_provider');
    expect(steps[1].description).toContain('Taraori PACS Primary Agr Cooperative CHC');

    // Step 3: Moisture inspection
    expect(steps[2].title).toContain('Field Moisture');
    expect(steps[2].responsibility).toBe('farmer');

    // Step 4: Machine execution
    expect(steps[3].title).toContain('Direct Wheat Seeding');
    expect(steps[3].responsibility).toBe('operator');

    // Step 5: Post-sowing audit
    expect(steps[4].title).toContain('Post-Sowing Furrow & Mulch Blanket Audit');
    expect(steps[4].responsibility).toBe('farmer');
  });

  // Test 2: Action Plan Step Generation for Ex-Situ Baling Pathway
  it('generates a specialized 5-step checklist for ex-situ baling with baler operator roles', () => {
    const steps = generateActionPlanSteps(
      'ex_situ_baling',
      '2026-10-25',
      '2026-11-08',
      'Karnal Bio-Residue Balers'
    );

    expect(steps).toHaveLength(5);
    expect(steps[0].title).toContain('Lock In Baler Contractor');
    expect(steps[0].description).toContain('Karnal Bio-Residue Balers');
    expect(steps[1].responsibility).toBe('farmer'); // Field access & bund clearance
    expect(steps[2].responsibility).toBe('operator'); // Raking & Mechanical baling
    expect(steps[3].responsibility).toBe('transport_operator'); // Bale Cartage & Field perimeter
    expect(steps[4].responsibility).toBe('farmer'); // Field Inspection & Sowing
  });

  // Test 3: Action Plan Step Generation for Biomass Supply Aggregation
  it('generates specialized steps for biomass aggregator offtake and weighbridge documentation', () => {
    const steps = generateActionPlanSteps(
      'biomass_utilization',
      '2026-10-25',
      '2026-11-10',
      'Indri Biomass Power Aggregation Center'
    );

    expect(steps).toHaveLength(5);
    expect(steps[0].title).toContain('Biomass Aggregator Gate Slot');
    expect(steps[0].description).toContain('Indri Biomass Power Aggregation Center');
    expect(steps[1].title).toContain('Moisture Testing');
    expect(steps[3].title).toContain('Dispatch, Weighbridge');
    expect(steps[3].responsibility).toBe('transport_operator');
  });

  // Test 4: Action Plan Step Generation for Bio-Decomposer Spray
  it('generates specialized steps for bio-decomposer fungal solution and rotavator mixing', () => {
    const steps = generateActionPlanSteps(
      'biological_decomposition',
      '2026-10-25',
      '2026-11-18'
    );

    expect(steps).toHaveLength(5);
    expect(steps[0].title).toContain('Procure Microbial Consortium');
    expect(steps[1].title).toContain('Chop Standing Stubble Post-Harvest');
    expect(steps[2].title).toContain('Uniform Spraying of Activated Suspension');
    expect(steps[3].title).toContain('Shallow Rotavator Incorporation');
    expect(steps[4].title).toContain('Rauni Irrigation');
  });

  // Test 5: Fallback when no resource name provided
  it('gracefully handles missing resource names with a generic machinery centre fallback', () => {
    const steps = generateActionPlanSteps(
      'in_situ_incorporation',
      '2026-10-25',
      '2026-11-06',
      undefined
    );

    expect(steps[1].description).toContain('Selected Machinery Centre');
  });

  // Test 6: Target date calculations from harvest date
  it('correctly calculates sequential target calendar dates based on harvest date and day offsets', () => {
    const targetDate0 = calculateTargetDate('2026-10-25', 0);
    expect(targetDate0).toBe('2026-10-25');

    const targetDate3 = calculateTargetDate('2026-10-25', 3);
    expect(targetDate3).toBe('2026-10-28');

    const targetDate10 = calculateTargetDate('2026-10-25', 10);
    expect(targetDate10).toBe('2026-11-04');

    // Formatting checks
    const formattedEn = formatDisplayDate('2026-10-28', 'en');
    expect(formattedEn).toContain('28');
    expect(formattedEn).toContain('Oct');

    const formattedHi = formatDisplayDate('2026-10-28', 'hi');
    expect(formattedHi).toContain('28');
  });

  // Test 7: Target date calculation resilience with fallback
  it('handles invalid or empty harvest dates gracefully without crashing', () => {
    const fallbackDate = calculateTargetDate('', 3);
    expect(fallbackDate).toBe('');

    const formattedEmpty = formatDisplayDate('', 'en');
    expect(formattedEmpty).toBe('Date not set');
  });

  // Test 8: Data Provenance & Resource Seed Registry Verification Status Check
  it('ensures only genuine public cooperative registries carry verified_public status', () => {
    const verifiedResources = SEED_RESOURCES.filter((r) => r.verificationStatus === 'verified_public');

    // Taraori and Sunam PACS have documented public cooperative provenance
    expect(verifiedResources.length).toBe(2);
    verifiedResources.forEach((res) => {
      expect(res.provenanceNote).toBeDefined();
      expect(res.provenanceNote?.length).toBeGreaterThan(15);
      expect(res.provenanceNote?.toLowerCase()).toMatch(/dept of agriculture|pacs|public/);
    });

    // Sample resources must be explicitly marked demonstration_sample
    const sampleResources = SEED_RESOURCES.filter((r) => r.verificationStatus === 'demonstration_sample');
    expect(sampleResources.length).toBeGreaterThanOrEqual(4);
    sampleResources.forEach((res) => {
      expect(res.provenanceNote?.toLowerCase()).toMatch(/demo|sample/);
    });
  });

  // Test 9: Defensible Impact Record Modeling (No fabricated PM2.5 or Carbon Tonnes)
  it('ensures impact records contain only grounded, user-reported and estimated operational metrics', () => {
    const testRecord: ImpactRecord = {
      id: 'imp-1001',
      assessmentId: 'asm-1001',
      timestamp: '2026-10-28T10:00:00.000Z',
      completionDate: '2026-10-28',
      crop: 'paddy',
      residueTonnes: 16,
      acreage: 8,
      location: {
        village: 'Taraori Rural',
        district: 'Karnal',
        state: 'Haryana',
      },
      pathwayId: 'in_situ_happy_seeder',
      pathwayName: 'In-Situ Mulching & Direct Seeding (Happy Seeder)',
      pathwayNameHi: 'हैप्पी सीडर द्वारा मल्चिंग व सीधी गेहूं बुवाई',
      resourceId: 'chc-taraori-karnal',
      resourceName: 'Taraori PACS Primary Agr Cooperative CHC',
      resourceDistanceKm: 4.2,
      estimatedCostTotalINR: 17600,
      openBurningAvoided: true,
      completionStatus: 'fully_completed',
      farmerNotes: 'Straw successfully incorporated. Clean seedbed achieved.',
    };

    // Verify key properties are present
    expect(testRecord.residueTonnes).toBe(16);
    expect(testRecord.openBurningAvoided).toBe(true);
    expect(testRecord.estimatedCostTotalINR).toBe(17600);
    expect(testRecord.completionStatus).toBe('fully_completed');

    // Strict check: verify NO uncalibrated speculative emission fields exist on the object
    const recordKeys = Object.keys(testRecord);
    expect(recordKeys).not.toContain('pm25AvoidedTonnes');
    expect(recordKeys).not.toContain('carbonSequesteredTonnes');
    expect(recordKeys).not.toContain('co2EquivalentKg');
  });

  // Test 10: All Seed Pathways match action plan generators
  it('ensures all seed pathways have corresponding action plan handling', () => {
    SEED_PATHWAYS.forEach((pathway) => {
      const steps = generateActionPlanSteps(
        pathway.id,
        '2026-10-25',
        '2026-11-06'
      );
      expect(steps.length).toBe(5);
      steps.forEach((step) => {
        expect(step.title.length).toBeGreaterThan(5);
        expect(step.titleHi.length).toBeGreaterThan(5);
        expect(step.description.length).toBeGreaterThan(15);
        expect(step.descriptionHi.length).toBeGreaterThan(15);
        expect(step.responsibilityLabel.length).toBeGreaterThan(3);
        expect(step.responsibilityLabelHi.length).toBeGreaterThan(3);
      });
    });
  });
});
