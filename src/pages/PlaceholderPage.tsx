import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAssessment } from '../context/AssessmentContext';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';
import { Construction, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  titleHi: string;
  phaseNumber: number;
  description: string;
  descriptionHi: string;
  nextRoute?: string;
  nextLabel?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  titleHi,
  phaseNumber,
  description,
  descriptionHi,
  nextRoute,
  nextLabel,
}) => {
  const { language } = useLanguage();
  const { currentAssessment } = useAssessment();
  const location = useLocation();

  return (
    <div className="py-12 sm:py-16">
      <Container size="sm">
        <div className="bg-parchment-100 border border-field-border p-6 sm:p-8 rounded-xs shadow-ledger">
          <div className="flex items-center justify-between border-b border-field-border pb-3 mb-4 text-xs font-mono">
            <span className="text-soil-500 uppercase tracking-wider">
              {location.pathname}
            </span>
            <Badge variant="demo">
              Phase {phaseNumber} Module
            </Badge>
          </div>

          <div className="flex items-center space-x-3 text-agri-forest mb-3">
            <Construction className="w-6 h-6 text-harvest-amber" />
            <h1 className="font-serif text-2xl font-bold text-soil-900">
              {language === 'hi' ? titleHi : title}
            </h1>
          </div>

          <p className="text-sm text-soil-700 font-sans leading-relaxed mb-6">
            {language === 'hi' ? descriptionHi : description}
          </p>

          {/* If arriving with an active assessment (e.g. on /analyzing) */}
          {currentAssessment && (
            <div className="p-4 bg-agri-forest-50 border border-agri-forest-600/40 text-xs font-mono text-soil-800 mb-6 space-y-1">
              <div className="text-agri-forest-900 font-bold uppercase flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1 text-agri-forest" />
                Active Assessment Received in State:
              </div>
              <div>• Crop: {currentAssessment.crop.toUpperCase()} (~{currentAssessment.residueTonnes} tonnes)</div>
              <div>• Location: {currentAssessment.village}, {currentAssessment.district}, {currentAssessment.state}</div>
              <div>• Window: {currentAssessment.windowDays} Days ({currentAssessment.harvestDate} → {currentAssessment.sowingDate})</div>
              <div>• Priority: {currentAssessment.farmerPriority.replace('_', ' ').toUpperCase()}</div>
            </div>
          )}

          <div className="p-4 bg-parchment-50 border border-field-border/80 text-xs font-mono text-soil-600 mb-6 space-y-1">
            <div className="text-soil-800 font-semibold uppercase">Phase 1 Route Verification:</div>
            <div>• Route active and responsive</div>
            <div>• Bilingual state bound to: {language.toUpperCase()}</div>
            <div>• Implementation scheduled for Phase {phaseNumber}</div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-field-border">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-medium bg-parchment-50 hover:bg-parchment-200 text-soil-800 border border-field-border transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              {language === 'hi' ? 'वापस मुख्य पृष्ठ' : 'Return to Landing'}
            </Link>

            {nextRoute && nextLabel && (
              <Link
                to={nextRoute}
                className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-medium bg-agri-forest hover:bg-agri-forest-700 text-white border border-agri-forest-800 transition-colors"
              >
                <span>{nextLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
