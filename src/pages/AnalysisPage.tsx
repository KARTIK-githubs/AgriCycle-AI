import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAssessment } from '../context/AssessmentContext';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';
import { 
  CheckCircle2, 
  Clock, 
  Cpu, 
  ArrowRight,
  PlusCircle
} from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { currentAssessment } = useAssessment();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { text: t('solverStep1') },
    { text: t('solverStep2') },
    { text: t('solverStep3') },
    { text: t('solverStep4') },
    { text: t('solverStep5') },
    { text: t('solverStep6') },
  ];

  useEffect(() => {
    if (!currentAssessment) return;

    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            navigate('/recommendation');
          }, 450);
          return prev;
        }
      });
    }, 280); // ~1.7s total sequence

    return () => clearInterval(interval);
  }, [currentAssessment, navigate]);

  if (!currentAssessment) {
    return (
      <div className="py-12 sm:py-16">
        <Container size="sm">
          <div className="bg-parchment-100 border border-field-border p-8 rounded-xs text-center shadow-ledger">
            <h1 className="font-serif text-xl font-bold text-soil-900 mb-2">
              {language === 'hi' ? 'कोई सक्रिय मूल्यांकन नहीं मिला' : 'No Assessment Found for Analysis'}
            </h1>
            <p className="text-xs text-soil-600 font-sans mb-6">
              {language === 'hi' 
                ? 'विकल्पों के विश्लेषण के लिए पहले अपने खेत की स्थिति दर्ज करें।' 
                : 'Please record a residue assessment first before evaluating feasible pathways.'}
            </p>
            <Link
              to="/assess"
              className="inline-flex items-center px-4 py-2.5 text-xs font-semibold bg-agri-forest text-white hover:bg-agri-forest-700 rounded-xs"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              {t('startAssessmentBtn')}
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16">
      <Container size="sm">
        <div className="bg-parchment-100 border border-field-border rounded-xs p-6 sm:p-8 shadow-ledger">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-field-border pb-4 mb-6 text-xs font-mono">
            <div className="flex items-center space-x-2 text-agri-forest">
              <Cpu className="w-4 h-4" />
              <span className="font-bold uppercase tracking-wider">
                {language === 'hi' ? 'तार्किक निर्णय विश्लेषक' : 'Deterministic Constraint Solver'}
              </span>
            </div>
            <Badge variant="verified">
              {currentAssessment.district}, {currentAssessment.state}
            </Badge>
          </div>

          <h1 className="font-serif text-2xl font-bold text-soil-900 tracking-tight mb-2">
            {t('analyzingPageTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-soil-600 font-sans leading-relaxed mb-6">
            {t('analyzingSubtitle')}
          </p>

          {/* Active Field Parameter Bar */}
          <div className="p-3.5 bg-parchment-50 border border-field-border/80 rounded-xs mb-6 text-xs font-mono grid grid-cols-2 sm:grid-cols-4 gap-2 text-soil-700">
            <div>
              <span className="text-soil-400 block text-[10px] uppercase">Crop</span>
              <strong className="text-soil-900">{currentAssessment.crop.toUpperCase()}</strong>
            </div>
            <div>
              <span className="text-soil-400 block text-[10px] uppercase">Residue</span>
              <strong className="text-soil-900">{currentAssessment.residueTonnes} Tonnes</strong>
            </div>
            <div>
              <span className="text-soil-400 block text-[10px] uppercase">Sowing Window</span>
              <strong className="text-harvest-amber font-bold">{currentAssessment.windowDays} Days</strong>
            </div>
            <div>
              <span className="text-soil-400 block text-[10px] uppercase">Priority</span>
              <strong className="text-soil-900">{currentAssessment.farmerPriority.replace('_', ' ').toUpperCase()}</strong>
            </div>
          </div>

          {/* Step-by-Step Solver Execution Progress */}
          <div className="space-y-3 py-2 border-t border-b border-field-border/70 my-6">
            {steps.map((step, idx) => {
              const isCompleted = idx < activeStep;
              const isCurrent = idx === activeStep;

              return (
                <div
                  key={idx}
                  className={`flex items-start space-x-3 text-xs font-mono py-1.5 transition-opacity ${
                    isCompleted
                      ? 'text-soil-900 opacity-100'
                      : isCurrent
                      ? 'text-agri-forest font-bold opacity-100'
                      : 'text-soil-400 opacity-40'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-agri-forest" />
                    ) : isCurrent ? (
                      <Clock className="w-4 h-4 text-harvest-amber animate-spin" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-field-border inline-block text-center text-[10px] leading-4 text-soil-400">
                        {idx + 1}
                      </span>
                    )}
                  </div>
                  <span className="leading-snug">{step.text}</span>
                </div>
              );
            })}
          </div>

          {/* Status Ribbon & Immediate Skip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] font-mono text-soil-500 pt-2">
            <span>{t('calculatingNotice')}</span>
            <button
              type="button"
              onClick={() => navigate('/recommendation')}
              className="text-agri-forest hover:underline flex items-center font-medium"
            >
              <span>{language === 'hi' ? 'सीधे परिणाम पर जाएं' : 'Skip Directly to Results'}</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};
