import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAssessment } from '../context/AssessmentContext';
import { generateNarrativeExplanation } from '../services/aiService';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';
import { 
  Award, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Bot,
  XCircle,
  FileCheck
} from 'lucide-react';

export const RecommendationPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { currentAssessment, decisionResult, selectedPathwayId, setSelectedPathwayId } = useAssessment();

  const [aiNarrative, setAiNarrative] = useState<string>('');
  const [aiSource, setAiSource] = useState<'groq' | 'local_fallback'>('local_fallback');
  const [loadingAi, setLoadingAi] = useState<boolean>(true);

  // Generate or fetch narrative explanation
  useEffect(() => {
    if (!decisionResult) return;

    let isMounted = true;
    setLoadingAi(true);

    generateNarrativeExplanation(decisionResult, language).then(res => {
      if (isMounted) {
        setAiNarrative(res.narrative);
        setAiSource(res.source);
        setLoadingAi(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [decisionResult, language]);

  if (!currentAssessment || !decisionResult) {
    return (
      <div className="py-12 sm:py-16">
        <Container size="sm">
          <div className="bg-parchment-100 border border-field-border p-8 rounded-xs text-center shadow-ledger">
            <h1 className="font-serif text-xl font-bold text-soil-900 mb-2">
              {language === 'hi' ? 'कोई सक्रिय सिफारिश उपलब्ध नहीं है' : 'No Recommendation Available'}
            </h1>
            <p className="text-xs text-soil-600 font-sans mb-6">
              {language === 'hi'
                ? 'सिफारिश देखने के लिए पहले फसल अवशेष का मूल्यांकन पूरा करें।'
                : 'Please complete a residue assessment first to calculate feasible management pathways.'}
            </p>
            <Link
              to="/assess"
              className="inline-flex items-center px-4 py-2.5 text-xs font-semibold bg-agri-forest text-white hover:bg-agri-forest-700 rounded-xs"
            >
              {t('startAssessmentBtn')}
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const rec = decisionResult.primaryRecommendation;
  const isSelected = selectedPathwayId === rec.pathway.id;

  return (
    <div className="py-8 sm:py-12">
      <Container size="md">
        {/* Editorial Advisory Header */}
        <div className="border-b border-field-border pb-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-soil-500 uppercase tracking-wider mb-1.5">
            <div className="flex items-center space-x-2">
              <Award className="w-3.5 h-3.5 text-agri-forest" />
              <span>Advisory Case #{currentAssessment.id.replace('asm-', '')}</span>
            </div>
            <Badge variant="verified">
              {language === 'hi' ? 'तार्किक विश्लेषण सत्यापित' : 'Deterministic Logic Verified'}
            </Badge>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-soil-900 tracking-tight">
            {t('recommendationPageTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-soil-600 font-sans mt-2 max-w-2xl leading-relaxed">
            {t('recommendationPageSubtitle')}
          </p>
        </div>

        {/* 1. FIELD SITUATION SUMMARY LEDGER */}
        <div className="bg-parchment-100 border border-field-border p-4 sm:p-5 rounded-xs mb-8 shadow-ledger">
          <div className="flex items-center justify-between border-b border-field-border pb-2.5 mb-3 text-xs font-mono">
            <span className="font-bold text-soil-800 uppercase tracking-wider">
              {t('fieldSummaryTitle')}
            </span>
            <Link to="/assess" className="text-agri-forest hover:underline text-[11px]">
              {language === 'hi' ? 'पैरामीटर बदलें' : 'Edit Inputs'} →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-sans">
            <div>
              <span className="text-soil-500 font-mono text-[10px] uppercase block">Crop</span>
              <strong className="text-soil-900">{currentAssessment.crop.toUpperCase()}</strong>
            </div>
            <div>
              <span className="text-soil-500 font-mono text-[10px] uppercase block">Residue Volume</span>
              <strong className="text-soil-900">{currentAssessment.residueTonnes} Tonnes ({currentAssessment.acreage} ac)</strong>
            </div>
            <div>
              <span className="text-soil-500 font-mono text-[10px] uppercase block">Sowing Window</span>
              <strong className="text-harvest-amber font-mono font-bold flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {currentAssessment.windowDays} Days Remaining
              </strong>
            </div>
            <div>
              <span className="text-soil-500 font-mono text-[10px] uppercase block">Cluster Location</span>
              <strong className="text-soil-900">{currentAssessment.district}, {currentAssessment.state}</strong>
            </div>
            <div>
              <span className="text-soil-500 font-mono text-[10px] uppercase block">Farmer Priority</span>
              <strong className="text-soil-900">{currentAssessment.farmerPriority.replace('_', ' ').toUpperCase()}</strong>
            </div>
          </div>
        </div>

        {/* 2. PRIMARY RECOMMENDATION SHEET */}
        <div className="bg-agri-forest-50/40 border-2 border-agri-forest rounded-xs p-6 sm:p-8 mb-10 shadow-ledger relative">
          {/* Top Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-agri-forest-600/30 pb-4 mb-6">
            <div className="space-y-1">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-agri-forest-800 block">
                {t('recommendedPathwayTag')}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-soil-900">
                {language === 'hi' ? rec.pathway.nameHi : rec.pathway.name}
              </h2>
            </div>

            <div className="text-right sm:text-right">
              <div className="inline-flex items-center px-3.5 py-1.5 bg-agri-forest text-white rounded-xs font-mono text-sm font-bold shadow-sm">
                <span>{t('suitabilityScoreLabel')}: {rec.suitabilityScore} / 100</span>
              </div>
              <p className="text-[10px] font-mono text-soil-500 mt-1 max-w-[200px]">
                {t('suitabilityScoreNote')}
              </p>
            </div>
          </div>

          {/* Operational Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-xs font-mono">
            {/* Cost Metric */}
            <div className="p-3.5 bg-parchment-50 border border-field-border rounded-xs">
              <span className="text-soil-500 uppercase text-[11px] block mb-1">
                {t('estimatedCostLabel')}
              </span>
              <div className="text-lg font-bold text-soil-900 font-serif">
                ₹{rec.estimatedCostPerAcreINR} <span className="text-xs font-mono font-normal text-soil-600">/ acre</span>
              </div>
              <span className="text-[11px] text-soil-500 font-sans">
                ~₹{rec.estimatedCostTotalINR.toLocaleString()} total for {currentAssessment.acreage} acres
              </span>
            </div>

            {/* Turnaround Metric */}
            <div className="p-3.5 bg-parchment-50 border border-field-border rounded-xs">
              <span className="text-soil-500 uppercase text-[11px] block mb-1">
                {t('turnaroundLabel')}
              </span>
              <div className="text-lg font-bold text-soil-900 font-serif">
                ~{rec.turnaroundDays} Days
              </div>
              <span className="text-[11px] text-soil-500 font-sans">
                Fits inside {currentAssessment.windowDays}-day sowing deadline
              </span>
            </div>

            {/* Nearest Resource Metric */}
            <div className="p-3.5 bg-parchment-50 border border-field-border rounded-xs">
              <span className="text-soil-500 uppercase text-[11px] block mb-1">
                {t('nearestChcLabel')}
              </span>
              <div className="text-sm font-bold text-soil-900 font-sans truncate">
                {language === 'hi' ? (rec.nearestResource?.nameHi || 'स्थानीय सीएचसी') : (rec.nearestResource?.name || 'Local CHC')}
              </div>
              <div className="flex items-center justify-between text-[11px] text-soil-600 mt-1">
                <span className="flex items-center">
                  <MapPin className="w-3 h-3 mr-0.5 text-agri-forest" />
                  {rec.distanceKm} km away
                </span>
                {rec.nearestResource && (
                  <span className="font-mono text-agri-forest font-medium flex items-center">
                    <Phone className="w-3 h-3 mr-0.5" />
                    {rec.nearestResource.contactPhone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Structured Rationale: Why This Option Ranked First */}
          <div className="bg-parchment-50 border border-field-border p-5 rounded-xs mb-6">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-soil-800 mb-3 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-agri-forest" />
              {t('whyThisOptionTitle')}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-soil-700 font-sans">
              {(language === 'hi' ? decisionResult.explanation.whyThisOptionHi : decisionResult.explanation.whyThisOption).map((point, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-agri-forest font-bold mr-2 text-base leading-none">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Advantages vs Limitations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs font-sans">
            {/* Advantages */}
            <div className="p-4 bg-parchment-50 border border-field-border rounded-xs">
              <h4 className="font-mono text-xs font-bold uppercase text-agri-forest mb-2">
                {t('keyAdvantagesTitle')}
              </h4>
              <ul className="space-y-1.5 text-soil-700">
                {(language === 'hi' ? rec.pathway.advantagesHi : rec.pathway.advantages).map((adv, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-agri-forest mr-1.5 font-bold">✓</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Limitations */}
            <div className="p-4 bg-parchment-50 border border-field-border rounded-xs">
              <h4 className="font-mono text-xs font-bold uppercase text-harvest-amber mb-2">
                {t('keyLimitationsTitle')}
              </h4>
              <ul className="space-y-1.5 text-soil-700">
                {(language === 'hi' ? rec.pathway.limitationsHi : rec.pathway.limitations).map((lim, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-harvest-amber mr-1.5 font-bold">!</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Assumptions Notice */}
          <div className="p-3.5 bg-parchment-100 border border-field-border/80 rounded-xs text-xs text-soil-600 font-sans flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-soil-500 shrink-0 mt-0.5" />
            <div>
              <strong className="font-mono uppercase text-[11px] text-soil-700 block mb-0.5">
                {t('confirmLocallyNotice')}
              </strong>
              <p className="text-[11px] text-soil-500 leading-relaxed font-mono">
                {language === 'hi' ? rec.pathway.assumptionsNotesHi : rec.pathway.assumptionsNotes}
              </p>
            </div>
          </div>

          {/* Pathway Selection State Action */}
          <div className="mt-6 pt-4 border-t border-agri-forest-600/30 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-soil-700">
                Current Active Selection:
              </span>
              <Badge variant={isSelected ? 'verified' : 'neutral'}>
                {isSelected ? (language === 'hi' ? 'चयनित मुख्य विकल्प' : 'Active Pathway') : 'Alternative'}
              </Badge>
            </div>

            {!isSelected && (
              <button
                type="button"
                onClick={() => setSelectedPathwayId(rec.pathway.id)}
                className="px-4 py-2 text-xs font-semibold bg-agri-forest text-white rounded-xs"
              >
                {t('selectAlternativeBtn')}
              </button>
            )}
          </div>
        </div>

        {/* 3. SYNTHESIZED NARRATIVE AI EXPLANATION SECTION */}
        <section className="mb-10">
          <div className="bg-parchment-100 border border-field-border p-5 sm:p-6 rounded-xs shadow-ledger">
            <div className="flex items-center justify-between border-b border-field-border pb-3 mb-4 text-xs font-mono">
              <div className="flex items-center space-x-2 text-soil-800">
                {aiSource === 'groq' ? (
                  <Sparkles className="w-4 h-4 text-agri-forest" />
                ) : (
                  <Bot className="w-4 h-4 text-soil-600" />
                )}
                <span className="font-bold uppercase tracking-wider">
                  {t('aiNarrativeTitle')}
                </span>
              </div>
              <Badge variant="demo">
                {aiSource === 'groq' ? t('sourceGroqAi') : t('sourceLocalFallback')}
              </Badge>
            </div>

            {loadingAi ? (
              <div className="py-6 text-center text-xs font-mono text-soil-500 animate-pulse">
                Synthesizing agricultural field advisory...
              </div>
            ) : (
              <div className="text-xs sm:text-sm text-soil-800 font-sans leading-relaxed whitespace-pre-line bg-parchment-50 p-4 border border-field-border/70 rounded-xs">
                {aiNarrative}
              </div>
            )}
          </div>
        </section>

        {/* 4. OTHER FEASIBLE ALTERNATIVES SECTION */}
        {decisionResult.alternativeOptions.length > 0 && (
          <section className="mb-10">
            <div className="border-b border-field-border pb-3 mb-4">
              <h3 className="font-serif text-xl font-bold text-soil-900">
                {t('alternativeOptionsTitle')}
              </h3>
              <p className="text-xs text-soil-600 font-sans mt-0.5">
                {t('alternativeOptionsDesc')}
              </p>
            </div>

            <div className="space-y-4">
              {decisionResult.alternativeOptions.map((alt) => {
                const isThisSelected = selectedPathwayId === alt.pathway.id;

                return (
                  <div
                    key={alt.pathway.id}
                    className={`bg-parchment-100 border p-5 rounded-xs transition-colors ${
                      isThisSelected
                        ? 'border-agri-forest ring-1 ring-agri-forest bg-agri-forest-50/20'
                        : 'border-field-border'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-field-border pb-3 mb-3">
                      <div>
                        <span className="font-mono text-[10px] text-soil-500 uppercase block">
                          Alternative Feasible Option
                        </span>
                        <h4 className="font-serif font-bold text-lg text-soil-900">
                          {language === 'hi' ? alt.pathway.nameHi : alt.pathway.name}
                        </h4>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs font-bold text-soil-800 bg-parchment-50 px-2.5 py-1 border border-field-border rounded-xs">
                          {t('suitabilityScoreLabel')}: {alt.suitabilityScore}
                        </span>
                        {isThisSelected && (
                          <Badge variant="verified">
                            {t('selectedBadge')}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono mb-4 text-soil-700">
                      <div>
                        <span className="text-soil-500 text-[10px] uppercase block">Est. Cost</span>
                        ₹{alt.estimatedCostPerAcreINR}/acre (~₹{alt.estimatedCostTotalINR.toLocaleString()})
                      </div>
                      <div>
                        <span className="text-soil-500 text-[10px] uppercase block">Turnaround</span>
                        ~{alt.turnaroundDays} Days
                      </div>
                      <div>
                        <span className="text-soil-500 text-[10px] uppercase block">Nearest Service</span>
                        {alt.nearestResource?.name || 'Cluster Partner'} ({alt.distanceKm} km)
                      </div>
                    </div>

                    <p className="text-xs text-soil-600 font-sans mb-4">
                      {language === 'hi' ? alt.pathway.descriptionHi : alt.pathway.description}
                    </p>

                    <div className="pt-2 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => setSelectedPathwayId(alt.pathway.id)}
                        className={`px-4 py-2 text-xs font-semibold rounded-xs border transition-colors ${
                          isThisSelected
                            ? 'bg-agri-forest text-white border-agri-forest-800'
                            : 'bg-parchment-50 text-soil-900 border-field-border hover:bg-parchment-200'
                        }`}
                      >
                        {isThisSelected
                          ? (language === 'hi' ? 'सक्रिय चुना हुआ विकल्प' : 'Active Selection')
                          : t('selectAlternativeBtn')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 5. INFEASIBLE PATHWAYS (EXCLUDED WITH REASONS) */}
        {decisionResult.excludedPathways.length > 0 && (
          <section className="mb-10">
            <div className="border-b border-field-border pb-3 mb-4">
              <h3 className="font-serif text-lg font-bold text-deep-clay flex items-center">
                <XCircle className="w-4 h-4 mr-2" />
                {t('infeasibleOptionsTitle')}
              </h3>
              <p className="text-xs text-soil-600 font-sans mt-0.5">
                {t('infeasibleOptionsDesc')}
              </p>
            </div>

            <div className="space-y-3">
              {decisionResult.excludedPathways.map((excl) => (
                <div
                  key={excl.pathway.id}
                  className="bg-parchment-100 border border-field-border/80 p-4 rounded-xs text-xs font-sans"
                >
                  <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                    <strong className="text-soil-800">
                      {language === 'hi' ? excl.pathway.nameHi : excl.pathway.name}
                    </strong>
                    <span className="text-deep-clay font-bold uppercase tracking-wider">
                      {language === 'hi' ? 'अव्यवहार्य' : 'Not Feasible'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-clay-light/30 border border-deep-clay/20 text-deep-clay text-xs rounded-xs mt-1.5 flex items-start space-x-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>
                      <strong>Reason: </strong>
                      {language === 'hi' ? excl.exclusionReasonHi : excl.exclusionReason}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. NEXT STEPS & NAVIGATION ACTION STRIP */}
        <div className="pt-6 border-t border-field-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <Link
            to="/home"
            className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-medium border border-field-border bg-parchment-100 hover:bg-parchment-200 text-soil-700 transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            {language === 'hi' ? 'वापस किसान होम' : 'Return to Farmer Home'}
          </Link>

          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              to="/compare"
              className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-medium border border-field-border bg-parchment-100 hover:bg-parchment-200 text-soil-900 transition-colors min-h-[44px]"
            >
              {t('continueToCompareBtn')}
            </Link>

            <Link
              to="/resources"
              className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-medium border border-field-border bg-parchment-100 hover:bg-parchment-200 text-soil-900 transition-colors min-h-[44px]"
            >
              <MapPin className="w-3.5 h-3.5 mr-1 text-agri-forest" />
              {t('continueToResourcesBtn')}
            </Link>

            <Link
              to="/action-plan"
              className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold bg-agri-forest text-white hover:bg-agri-forest-700 border border-agri-forest-800 shadow-sm transition-colors min-h-[44px]"
            >
              <FileCheck className="w-3.5 h-3.5 mr-1.5" />
              <span>{t('continueToActionPlanBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};
