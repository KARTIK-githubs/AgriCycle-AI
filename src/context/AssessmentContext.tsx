import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AssessmentInput,
  CropType,
  FarmerPriority,
  MachineryOwned,
  ActionPlanStep,
  StepStatus,
  ImpactRecord,
} from '../types';
import { DecisionResult, evaluateAssessment } from '../engine/solver';
import { generateActionPlanSteps } from '../services/actionPlanService';
import { SEED_RESOURCES } from '../data/seedResources';

export interface AssessmentFormData {
  crop: CropType;
  customCropName?: string;
  residueTonnes: number | string;
  acreage: number | string;
  state: string;
  district: string;
  village: string;
  harvestDate: string;
  sowingDate: string;
  machineryOwned: MachineryOwned;
  machineryDetails?: string;
  farmerPriority: FarmerPriority;
}

interface AssessmentContextType {
  currentAssessment: AssessmentInput | null;
  assessments: AssessmentInput[];
  decisionResult: DecisionResult | null;
  selectedPathwayId: string | null;
  selectedResourceId: string | null;
  checklist: ActionPlanStep[];
  impactRecords: ImpactRecord[];
  currentImpactRecord: ImpactRecord | null;
  saveAssessment: (data: AssessmentFormData) => AssessmentInput;
  setSelectedPathwayId: (id: string) => void;
  setSelectedResourceId: (id: string) => void;
  setCurrentAssessmentById: (id: string) => void;
  updateStepStatus: (stepId: string, status: StepStatus) => void;
  resetChecklist: () => void;
  recordOutcome: (record: Omit<ImpactRecord, 'id' | 'timestamp'>) => ImpactRecord;
  clearCurrentAssessment: () => void;
  resetAllAssessments: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const calculateWindowDays = (harvestDate: string, sowingDate: string): number => {
  if (!harvestDate || !sowingDate) return 0;
  const harvest = new Date(harvestDate);
  const sowing = new Date(sowingDate);
  const diffTime = sowing.getTime() - harvest.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assessments, setAssessments] = useState<AssessmentInput[]>(() => {
    try {
      const saved = localStorage.getItem('agricycle_assessments');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading assessments from storage', e);
      return [];
    }
  });

  const [currentAssessment, setCurrentAssessment] = useState<AssessmentInput | null>(() => {
    try {
      const saved = localStorage.getItem('agricycle_current_assessment');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Error loading current assessment from storage', e);
      return null;
    }
  });

  const [decisionResult, setDecisionResult] = useState<DecisionResult | null>(() => {
    if (currentAssessment) {
      try {
        return evaluateAssessment(currentAssessment);
      } catch (e) {
        console.error('Error evaluating current assessment', e);
        return null;
      }
    }
    return null;
  });

  const [selectedPathwayId, setSelectedPathwayIdState] = useState<string | null>(() => {
    const saved = localStorage.getItem('agricycle_selected_pathway_id');
    return saved || null;
  });

  const [selectedResourceId, setSelectedResourceIdState] = useState<string | null>(() => {
    const saved = localStorage.getItem('agricycle_selected_resource_id');
    return saved || null;
  });

  // Action Plan Checklist State
  const [checklist, setChecklist] = useState<ActionPlanStep[]>(() => {
    try {
      const saved = localStorage.getItem('agricycle_checklist_steps');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading checklist steps', e);
    }
    return [];
  });

  // Impact Records State
  const [impactRecords, setImpactRecords] = useState<ImpactRecord[]>(() => {
    try {
      const saved = localStorage.getItem('agricycle_impact_records');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading impact records', e);
      return [];
    }
  });

  const [currentImpactRecord, setCurrentImpactRecord] = useState<ImpactRecord | null>(() => {
    try {
      const saved = localStorage.getItem('agricycle_current_impact');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Error loading current impact record', e);
      return null;
    }
  });

  const setSelectedResourceId = (id: string) => {
    setSelectedResourceIdState(id);
    localStorage.setItem('agricycle_selected_resource_id', id);
  };

  const setSelectedPathwayId = (id: string) => {
    setSelectedPathwayIdState(id);
    localStorage.setItem('agricycle_selected_pathway_id', id);
  };

  // Re-evaluate whenever currentAssessment changes
  useEffect(() => {
    if (currentAssessment) {
      const result = evaluateAssessment(currentAssessment);
      setDecisionResult(result);
      if (
        !selectedPathwayId ||
        !result.alternativeOptions
          .concat(result.primaryRecommendation)
          .some((p) => p.pathway.id === selectedPathwayId)
      ) {
        setSelectedPathwayIdState(result.primaryRecommendation.pathway.id);
        localStorage.setItem(
          'agricycle_selected_pathway_id',
          result.primaryRecommendation.pathway.id
        );
      }
      // Auto-set default nearest resource if none selected
      if (!selectedResourceId && result.primaryRecommendation.nearestResource) {
        setSelectedResourceIdState(result.primaryRecommendation.nearestResource.id);
        localStorage.setItem(
          'agricycle_selected_resource_id',
          result.primaryRecommendation.nearestResource.id
        );
      }
    } else {
      setDecisionResult(null);
      setSelectedPathwayIdState(null);
      setSelectedResourceIdState(null);
      localStorage.removeItem('agricycle_selected_pathway_id');
      localStorage.removeItem('agricycle_selected_resource_id');
    }
  }, [currentAssessment]);

  // Synchronize Checklist with Active Pathway
  useEffect(() => {
    if (selectedPathwayId && currentAssessment) {
      const matchingResource = SEED_RESOURCES.find((r) => r.id === selectedResourceId);
      setChecklist((prev) => {
        // If current checklist already matches the selected pathway, preserve its statuses
        if (prev.length > 0 && prev[0].id.includes(selectedPathwayId)) {
          return prev;
        }
        const freshSteps = generateActionPlanSteps(
          selectedPathwayId,
          currentAssessment.harvestDate,
          currentAssessment.sowingDate,
          matchingResource?.name
        );
        try {
          localStorage.setItem('agricycle_checklist_steps', JSON.stringify(freshSteps));
        } catch (e) {
          console.error('Error saving checklist', e);
        }
        return freshSteps;
      });
    }
  }, [selectedPathwayId, selectedResourceId, currentAssessment]);

  // Persist assessments list
  useEffect(() => {
    try {
      localStorage.setItem('agricycle_assessments', JSON.stringify(assessments));
    } catch (e) {
      console.error('Failed to persist assessments', e);
    }
  }, [assessments]);

  // Persist current assessment
  useEffect(() => {
    try {
      if (currentAssessment) {
        localStorage.setItem(
          'agricycle_current_assessment',
          JSON.stringify(currentAssessment)
        );
      } else {
        localStorage.removeItem('agricycle_current_assessment');
      }
    } catch (e) {
      console.error('Failed to persist current assessment', e);
    }
  }, [currentAssessment]);

  const updateStepStatus = (stepId: string, status: StepStatus) => {
    setChecklist((prev) => {
      const updated = prev.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return step;
      });
      try {
        localStorage.setItem('agricycle_checklist_steps', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to persist checklist updates', e);
      }
      return updated;
    });
  };

  const resetChecklist = () => {
    if (selectedPathwayId && currentAssessment) {
      const matchingResource = SEED_RESOURCES.find((r) => r.id === selectedResourceId);
      const freshSteps = generateActionPlanSteps(
        selectedPathwayId,
        currentAssessment.harvestDate,
        currentAssessment.sowingDate,
        matchingResource?.name
      );
      setChecklist(freshSteps);
      localStorage.setItem('agricycle_checklist_steps', JSON.stringify(freshSteps));
    }
  };

  const recordOutcome = (data: Omit<ImpactRecord, 'id' | 'timestamp'>): ImpactRecord => {
    const newRecord: ImpactRecord = {
      ...data,
      id: `imp-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    setCurrentImpactRecord(newRecord);
    setImpactRecords((prev) => [newRecord, ...prev.filter((r) => r.id !== newRecord.id)]);
    try {
      localStorage.setItem('agricycle_current_impact', JSON.stringify(newRecord));
      localStorage.setItem(
        'agricycle_impact_records',
        JSON.stringify([newRecord, ...impactRecords.filter((r) => r.id !== newRecord.id)])
      );
    } catch (e) {
      console.error('Failed to persist impact record', e);
    }

    // Mark current assessment as completed in state and storage
    if (currentAssessment) {
      const updatedAssessment: AssessmentInput = {
        ...currentAssessment,
        status: 'completed',
      };
      setCurrentAssessment(updatedAssessment);
      setAssessments((prev) =>
        prev.map((a) => (a.id === updatedAssessment.id ? updatedAssessment : a))
      );
      try {
        localStorage.setItem(
          'agricycle_current_assessment',
          JSON.stringify(updatedAssessment)
        );
      } catch (e) {
        console.error('Failed to persist completed assessment', e);
      }
    }

    return newRecord;
  };

  const saveAssessment = (data: AssessmentFormData): AssessmentInput => {
    const windowDays = calculateWindowDays(data.harvestDate, data.sowingDate);
    const newAssessment: AssessmentInput = {
      id: `asm-${Date.now()}`,
      timestamp: new Date().toISOString(),
      crop: data.crop,
      customCropName: data.customCropName,
      residueTonnes: Number(data.residueTonnes) || 0,
      acreage: Number(data.acreage) || 0,
      state: data.state,
      district: data.district,
      village: data.village,
      harvestDate: data.harvestDate,
      sowingDate: data.sowingDate,
      windowDays,
      machineryOwned: data.machineryOwned,
      machineryDetails: data.machineryDetails,
      farmerPriority: data.farmerPriority,
      status: 'pending_analysis',
    };

    setAssessments((prev) => [newAssessment, ...prev.filter((a) => a.id !== newAssessment.id)]);
    setCurrentAssessment(newAssessment);
    return newAssessment;
  };

  const setCurrentAssessmentById = (id: string) => {
    const found = assessments.find((a) => a.id === id);
    if (found) {
      setCurrentAssessment(found);
      // Load corresponding impact record if one exists
      const matchImpact = impactRecords.find((imp) => imp.assessmentId === id);
      if (matchImpact) {
        setCurrentImpactRecord(matchImpact);
        localStorage.setItem('agricycle_current_impact', JSON.stringify(matchImpact));
      }
    }
  };

  const clearCurrentAssessment = () => {
    setCurrentAssessment(null);
    setDecisionResult(null);
    setSelectedPathwayIdState(null);
    setSelectedResourceIdState(null);
    setChecklist([]);
    setCurrentImpactRecord(null);
    localStorage.removeItem('agricycle_selected_pathway_id');
    localStorage.removeItem('agricycle_selected_resource_id');
    localStorage.removeItem('agricycle_checklist_steps');
    localStorage.removeItem('agricycle_current_impact');
  };

  const resetAllAssessments = () => {
    setAssessments([]);
    setCurrentAssessment(null);
    setDecisionResult(null);
    setSelectedPathwayIdState(null);
    setSelectedResourceIdState(null);
    setChecklist([]);
    setImpactRecords([]);
    setCurrentImpactRecord(null);
    localStorage.removeItem('agricycle_assessments');
    localStorage.removeItem('agricycle_current_assessment');
    localStorage.removeItem('agricycle_selected_pathway_id');
    localStorage.removeItem('agricycle_selected_resource_id');
    localStorage.removeItem('agricycle_checklist_steps');
    localStorage.removeItem('agricycle_impact_records');
    localStorage.removeItem('agricycle_current_impact');
  };

  return (
    <AssessmentContext.Provider
      value={{
        currentAssessment,
        assessments,
        decisionResult,
        selectedPathwayId,
        selectedResourceId,
        checklist,
        impactRecords,
        currentImpactRecord,
        saveAssessment,
        setSelectedPathwayId,
        setSelectedResourceId,
        setCurrentAssessmentById,
        updateStepStatus,
        resetChecklist,
        recordOutcome,
        clearCurrentAssessment,
        resetAllAssessments,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};
