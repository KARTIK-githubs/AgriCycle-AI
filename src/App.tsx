import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { FarmerHomePage } from './pages/FarmerHomePage';
import { ResidueAssessmentPage } from './pages/ResidueAssessmentPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { RecommendationPage } from './pages/RecommendationPage';
import { ComparePage } from './pages/ComparePage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ActionPlanPage } from './pages/ActionPlanPage';
import { ImpactPage } from './pages/ImpactPage';
import { HistoryPage } from './pages/HistoryPage';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {/* Phase 1: Operational Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Phase 2: Live Operational Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<FarmerHomePage />} />
        <Route path="/assess" element={<ResidueAssessmentPage />} />

        {/* Phase 3: Live Solver & Recommendation */}
        <Route path="/analyzing" element={<AnalysisPage />} />
        <Route path="/recommendation" element={<RecommendationPage />} />

        {/* Phase 4: Pathway Comparison & Spatial Resources */}
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/resources" element={<ResourcesPage />} />

        {/* Phase 5: Action Plan, Impact Ledger & History */}
        <Route path="/action-plan" element={<ActionPlanPage />} />
        <Route path="/impact" element={<ImpactPage />} />
        <Route path="/history" element={<HistoryPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
