import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAssessment } from '../context/AssessmentContext';
import { useLanguage } from '../context/LanguageContext';
import { SEED_PATHWAYS } from '../data/seedPathways';
import { SEED_RESOURCES, calculateDistanceKm, DISTRICT_CENTROIDS } from '../data/seedResources';
import { calculateTargetDate, formatDisplayDate } from '../services/actionPlanService';
import {
  Clock,
  ArrowLeft,
  Phone,
  RotateCcw,
  Sparkles,
  ClipboardCheck
} from 'lucide-react';

export const ActionPlanPage: React.FC = () => {
  const { language } = useLanguage();
  const lang = language;
  const navigate = useNavigate();
  const {
    currentAssessment,
    selectedPathwayId,
    selectedResourceId,
    checklist,
    updateStepStatus,
    resetChecklist,
    recordOutcome,
    saveAssessment,
  } = useAssessment();

  // Outcome recording form modal state
  const [showOutcomeModal, setShowOutcomeModal] = useState<boolean>(false);
  const [outcomeResidueTonnes, setOutcomeResidueTonnes] = useState<number | string>(
    currentAssessment?.residueTonnes || 5
  );
  const [outcomeBurningAvoided, setOutcomeBurningAvoided] = useState<boolean>(true);
  const [outcomeStatus, setOutcomeStatus] = useState<'fully_completed' | 'partially_completed'>('fully_completed');
  const [outcomeDate, setOutcomeDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [outcomeNotes, setOutcomeNotes] = useState<string>('');

  // Fallback demo assessment loader
  const handleLoadDemo = () => {
    saveAssessment({
      crop: 'paddy',
      residueTonnes: 5,
      acreage: 8,
      state: 'Haryana',
      district: 'Karnal',
      village: 'Taraori Rural',
      harvestDate: '2026-10-25',
      sowingDate: '2026-11-06',
      machineryOwned: 'none',
      farmerPriority: 'lowest_cost',
    });
  };

  // Selected Pathway Details
  const activePathway = useMemo(() => {
    return SEED_PATHWAYS.find((p) => p.id === selectedPathwayId) || null;
  }, [selectedPathwayId]);

  // Selected Resource Details
  const activeResource = useMemo(() => {
    return SEED_RESOURCES.find((r) => r.id === selectedResourceId) || null;
  }, [selectedResourceId]);

  // Distance calculation
  const resourceDistance = useMemo(() => {
    if (!activeResource || !currentAssessment) return null;
    const farmCoord = DISTRICT_CENTROIDS[currentAssessment.district] || DISTRICT_CENTROIDS['Karnal'];
    return calculateDistanceKm(farmCoord, activeResource.coordinates);
  }, [activeResource, currentAssessment]);

  // Deadlines
  const targetCompletionDate = useMemo(() => {
    if (!currentAssessment?.harvestDate || !activePathway) return '';
    return calculateTargetDate(currentAssessment.harvestDate, activePathway.turnaroundDays);
  }, [currentAssessment, activePathway]);

  // Checklist completion stats
  const completedCount = checklist.filter((s) => s.status === 'completed').length;
  const inProgressCount = checklist.filter((s) => s.status === 'in_progress').length;
  const totalCount = checklist.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Handle saving recorded outcome
  const handleRecordOutcomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAssessment || !activePathway) return;

    const acreage = currentAssessment.acreage || 8;
    const estimatedCostTotal =
      ((activePathway.estimatedCostPerAcre.min + activePathway.estimatedCostPerAcre.max) / 2) * acreage;

    recordOutcome({
      assessmentId: currentAssessment.id,
      completionDate: outcomeDate,
      crop: currentAssessment.crop,
      customCropName: currentAssessment.customCropName,
      residueTonnes: Number(outcomeResidueTonnes) || currentAssessment.residueTonnes,
      acreage: currentAssessment.acreage,
      location: {
        village: currentAssessment.village,
        district: currentAssessment.district,
        state: currentAssessment.state,
      },
      pathwayId: activePathway.id,
      pathwayName: activePathway.name,
      pathwayNameHi: activePathway.nameHi,
      resourceId: activeResource?.id,
      resourceName: activeResource?.name,
      resourceNameHi: activeResource?.nameHi,
      resourceDistanceKm: resourceDistance || undefined,
      estimatedCostTotalINR: estimatedCostTotal,
      openBurningAvoided: outcomeBurningAvoided,
      completionStatus: outcomeStatus,
      farmerNotes: outcomeNotes.trim() || undefined,
    });

    setShowOutcomeModal(false);
    navigate('/impact');
  };

  // 1. Missing Assessment Fallback State
  if (!currentAssessment) {
    return (
      <div className="py-12 bg-parchment min-h-screen">
        <Container>
          <div className="max-w-2xl mx-auto text-center bg-parchment-subtle p-8 rounded-lg border border-stone-300 shadow-sm">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <ClipboardCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-soil-charcoal mb-2">
              {lang === 'hi' ? 'कोई सक्रिय फसल आकलन नहीं मिला' : 'No Active Residue Assessment'}
            </h1>
            <p className="text-stone-600 mb-6 text-sm">
              {lang === 'hi'
                ? 'कार्य योजना तैयार करने के लिए कृपया पहले अपने खेत का अवशेष आकलन पूरा करें या करनाल डेमो प्रोफ़ाइल लोड करें।'
                : 'To generate a practical field action plan, please complete a residue assessment first or load our representative Karnal demo profile.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="primary" onClick={handleLoadDemo}>
                {lang === 'hi' ? 'करनाल डेमो डेटा लोड करें' : 'Load Karnal Demo Assessment'}
              </Button>
              <Link to="/assess">
                <Button variant="secondary">
                  {lang === 'hi' ? 'नया आकलन शुरू करें' : 'Start Fresh Assessment'}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // 2. Missing Pathway Fallback State
  if (!activePathway) {
    return (
      <div className="py-12 bg-parchment min-h-screen">
        <Container>
          <div className="max-w-2xl mx-auto text-center bg-parchment-subtle p-8 rounded-lg border border-stone-300 shadow-sm">
            <h1 className="text-2xl font-serif font-bold text-soil-charcoal mb-2">
              {lang === 'hi' ? 'कोई प्रबंधन विकल्प चयनित नहीं है' : 'No Pathway Selected'}
            </h1>
            <p className="text-stone-600 mb-6 text-sm">
              {lang === 'hi'
                ? 'कार्य योजना तैयार करने के लिए कृपया सिफारिश पृष्ठ अथवा तुलना मैट्रिक्स से कोई उपयुक्त विकल्प चुनें।'
                : 'Please select a feasible residue management pathway from the recommendation or comparison matrix to build your checklist.'}
            </p>
            <Link to="/compare">
              <Button variant="primary">
                {lang === 'hi' ? 'विकल्प तुलना पर जाएं →' : 'Go to Pathway Comparison →'}
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 bg-parchment min-h-screen">
      <Container>
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-300">
          <div className="flex items-center gap-2">
            <Link
              to="/compare"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-agri-dark transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'तुलना मैट्रिक्स पर वापस' : 'Back to Comparison'}</span>
            </Link>
            <span className="text-stone-300">/</span>
            <span className="text-xs font-bold text-agri-dark">
              {lang === 'hi' ? 'खेत कार्य योजना एवं चेकलिस्ट' : 'Field Action Plan'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowOutcomeModal(true)}
              className="px-3 py-1.5 bg-agri-dark hover:bg-agri-primary text-parchment text-xs font-bold rounded shadow-sm transition-colors inline-flex items-center gap-1.5"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>{lang === 'hi' ? 'कार्य परिणाम दर्ज करें' : 'Record Field Outcome'}</span>
            </button>
          </div>
        </div>

        {/* Page Title & Badges */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="neutral">
              Phase 5 • {lang === 'hi' ? 'खेत कार्य योजना' : 'Operational Checklist'}
            </Badge>
            <Badge variant="verified">
              {lang === 'hi' ? 'पारदर्शी चरण' : 'Field-Verified Protocol'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-soil-charcoal tracking-tight">
            {lang === 'hi' ? 'खेत कार्य योजना एवं चेकलिस्ट' : 'Interactive Field Action Plan'}
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-stone-600 max-w-3xl">
            {lang === 'hi'
              ? 'आपके चयनित विकल्प एवं नजदीकी केंद्र के अनुसार वास्तविक खेत तैयारी, मशीनरी बुकिंग और बुवाई समन्वय की चरणबद्ध चेकलिस्ट।'
              : 'Concrete, pathway-tailored operational checklist coordinating machinery reservations, field readiness, and seedbed clearance before target wheat sowing.'}
          </p>
        </div>

        {/* Missing Resource Warning Notice if applicable */}
        {!activeResource && activePathway.requiresChcIfNoMachinery && (
          <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950">
            <div>
              <span className="font-bold block mb-0.5">
                {lang === 'hi' ? 'सूचना: अभी तक कोई मशीनरी केंद्र नहीं चुना गया' : 'Notice: No machinery resource selected'}
              </span>
              <span>
                {lang === 'hi'
                  ? 'इस विकल्प के लिए सीएचसी या बेलर सेवा आवश्यक है। सटीक दूरी व संपर्क हेतु कृपया केंद्र चुनें।'
                  : 'This pathway requires specialized machinery. Select a local CHC or contractor for verified contact details and travel distance.'}
              </span>
            </div>
            <Link to="/resources">
              <button
                type="button"
                className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded font-bold whitespace-nowrap transition-colors"
              >
                {lang === 'hi' ? 'केंद्र चुनें →' : 'Select Resource →'}
              </button>
            </Link>
          </div>
        )}

        {/* Selected Pathway & Resource Context Summary Card */}
        <div className="mb-8 p-5 rounded-lg bg-parchment-subtle border border-stone-300 shadow-sm space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Pathway Column */}
            <div className="lg:col-span-6 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-agri-primary">
                  {lang === 'hi' ? 'सक्रिय प्रबंधन विकल्प' : 'Active Residue Pathway'}
                </span>
                <Link
                  to="/compare"
                  className="text-xs font-semibold text-agri-dark hover:underline"
                >
                  {lang === 'hi' ? 'विकल्प बदलें' : 'Change Pathway'}
                </Link>
              </div>

              <h2 className="font-serif font-bold text-lg text-soil-charcoal">
                {lang === 'hi' ? activePathway.nameHi : activePathway.name}
              </h2>

              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'hi' ? activePathway.descriptionHi : activePathway.description}
              </p>

              {/* Pathway Key Metrics Strip */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                <div className="p-2 rounded bg-stone-100 border border-stone-200">
                  <span className="block text-[10px] text-stone-500 uppercase font-semibold">
                    {lang === 'hi' ? 'अनुमानित दर' : 'Estimated Cost'}
                  </span>
                  <span className="font-bold text-stone-900">
                    ₹{activePathway.estimatedCostPerAcre.min}–₹{activePathway.estimatedCostPerAcre.max}
                  </span>
                  <span className="block text-[9px] text-stone-400">/{lang === 'hi' ? 'एकड़' : 'acre'}</span>
                </div>
                <div className="p-2 rounded bg-stone-100 border border-stone-200">
                  <span className="block text-[10px] text-stone-500 uppercase font-semibold">
                    {lang === 'hi' ? 'अवधि' : 'Turnaround'}
                  </span>
                  <span className="font-bold text-stone-900">
                    ~{activePathway.turnaroundDays} {lang === 'hi' ? 'दिन' : 'Days'}
                  </span>
                  <span className="block text-[9px] text-emerald-800 font-medium">
                    {lang === 'hi' ? 'खिड़की के भीतर' : 'Fits in window'}
                  </span>
                </div>
                <div className="p-2 rounded bg-stone-100 border border-stone-200">
                  <span className="block text-[10px] text-stone-500 uppercase font-semibold">
                    {lang === 'hi' ? 'उपकरण' : 'Machinery'}
                  </span>
                  <span className="font-bold text-stone-900 capitalize truncate block">
                    {activePathway.compatibleMachinery[0]?.replace('_', ' ')}
                  </span>
                  <span className="block text-[9px] text-stone-400">{lang === 'hi' ? 'सीएचसी से उपलब्ध' : 'CHC hiring'}</span>
                </div>
              </div>
            </div>

            {/* Selected Resource & Deadlines Column */}
            <div className="lg:col-span-6 space-y-3 lg:border-l lg:border-stone-200 lg:pl-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-agri-primary">
                  {lang === 'hi' ? 'संबद्ध मशीनरी केंद्र' : 'Linked Machinery Centre'}
                </span>
                <Link
                  to="/resources"
                  className="text-xs font-semibold text-agri-dark hover:underline"
                >
                  {lang === 'hi' ? 'केंद्र बदलें' : 'Change Centre'}
                </Link>
              </div>

              {activeResource ? (
                <div className="p-3 rounded-md bg-white border border-stone-200 text-xs space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-serif font-bold text-sm text-soil-charcoal">
                        {lang === 'hi' ? activeResource.nameHi : activeResource.name}
                      </div>
                      <div className="text-stone-500 text-[11px]">
                        📍 {activeResource.village}, {activeResource.district}
                      </div>
                    </div>
                    {resourceDistance !== null && (
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold text-[11px] border border-amber-200 flex-shrink-0">
                        ~{resourceDistance} km
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {activeResource.verificationStatus === 'verified_public' ? (
                      <span className="inline-block px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                        {lang === 'hi' ? 'सत्यापित सार्वजनिक केंद्र' : 'Verified Public Listing'}
                      </span>
                    ) : (
                      <span className="inline-block px-1.5 py-0.2 rounded bg-stone-100 text-stone-700 text-[10px] font-semibold border border-stone-300">
                        {lang === 'hi' ? 'डेमो संसाधन (नमूना)' : 'Demo Resource (Sample)'}
                      </span>
                    )}
                    <span className="text-[10px] text-stone-400 italic truncate">
                      {activeResource.provenanceNote}
                    </span>
                  </div>

                  {activeResource.contactPhone ? (
                    <div className="pt-1 flex items-center gap-1.5 text-xs text-agri-dark font-medium">
                      <Phone className="w-3 h-3 text-agri-primary" />
                      <a href={`tel:${activeResource.contactPhone}`} className="hover:underline font-bold">
                        {activeResource.contactPhone}
                      </a>
                      <span className="text-[10px] text-stone-500">
                        ({activeResource.contactPerson})
                      </span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-stone-500 italic pt-1">
                      {lang === 'hi' ? 'डेमो डेटासेट में संपर्क नंबर उपलब्ध नहीं है' : 'Contact info not available in demo dataset'}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded bg-stone-50 border border-stone-200 text-xs text-stone-500 italic">
                  {lang === 'hi' ? 'कोई केंद्र नहीं चुना गया।' : 'No specific center selected.'}
                </div>
              )}

              {/* Deadlines Strip */}
              <div className="p-3 rounded-md bg-stone-100 border border-stone-200 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-semibold">
                    {lang === 'hi' ? 'कटाई की तारीख' : 'Harvest Date'}
                  </span>
                  <span className="font-bold text-stone-900">
                    {formatDisplayDate(currentAssessment.harvestDate, lang)}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-semibold">
                    {lang === 'hi' ? 'अगली बुवाई लक्ष्य' : 'Target Next Sowing'}
                  </span>
                  <span className="font-bold text-stone-900">
                    {formatDisplayDate(currentAssessment.sowingDate, lang)}
                  </span>
                </div>
                <div className="col-span-2 pt-1 border-t border-stone-200 flex items-center justify-between text-[11px]">
                  <span className="text-stone-600">
                    {lang === 'hi' ? 'अनुशंसित पूर्णता लक्ष्य:' : 'Target Field Clearance:'}
                  </span>
                  <span className="font-bold text-agri-dark">
                    {targetCompletionDate ? formatDisplayDate(targetCompletionDate, lang) : (lang === 'hi' ? 'अनुमानित' : 'Estimated')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Responsible AI & Grounded Advisory Note */}
        <div className="mb-8 p-4 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">
              {lang === 'hi' ? 'प्रामाणिक परिचालन सलाह:' : 'Grounded Operational Protocol:'}
            </span>{' '}
            {lang === 'hi'
              ? `आपके खेत (तरावड़ी/करनाल, ${currentAssessment.acreage} एकड़ धान) के लिए ${activePathway.nameHi} का चयन किया गया है। मशीनरी आरक्षण कटाई से 3-5 दिन पूर्व अवश्य लॉक कर लें ताकि पीक सीजन में देरी न हो।`
              : `Calibrated for your field profile (${currentAssessment.acreage} acres of ${currentAssessment.crop} in ${currentAssessment.district}). Operating window requires ${activePathway.turnaroundDays} field days. Confirm CHC machine reservation at least 3 days prior to combine entry.`}{' '}
            <span className="block mt-1 font-semibold text-agri-dark">
              {lang === 'hi'
                ? 'संरचित निर्णय इंजन के आधार पर तैयार की गई चेकलिस्ट।'
                : 'Grounded AI guidance strictly based on structured decision-engine parameters.'}
            </span>
          </div>
        </div>

        {/* Interactive Checklist Section */}
        <div className="mb-10">
          {/* Checklist Header & Progress Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-stone-300">
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-soil-charcoal flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-agri-primary" />
                <span>{lang === 'hi' ? '5-चरणीय परिचालन चेकलिस्ट' : '5-Step Field Execution Checklist'}</span>
              </h2>
              <span className="text-xs text-stone-500">
                {completedCount} of {totalCount} {lang === 'hi' ? 'चरण पूरे हुए' : 'steps completed'} ({progressPercent}%)
                {inProgressCount > 0 && ` • ${inProgressCount} ${lang === 'hi' ? 'प्रगति पर' : 'in progress'}`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Progress bar */}
              <div className="w-32 bg-stone-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-agri-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <button
                type="button"
                onClick={resetChecklist}
                title={lang === 'hi' ? 'चेकलिस्ट रीसेट करें' : 'Reset Checklist'}
                className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 transition-colors p-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'रीसेट' : 'Reset'}</span>
              </button>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-4">
            {checklist.map((step) => {
              const isCompleted = step.status === 'completed';
              const isInProgress = step.status === 'in_progress';
              const stepTargetDate = currentAssessment?.harvestDate
                ? calculateTargetDate(currentAssessment.harvestDate, step.targetDayOffset)
                : '';

              return (
                <div
                  key={step.id}
                  className={`p-5 rounded-lg border transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-300/40'
                      : isInProgress
                      ? 'bg-amber-50/30 border-amber-300 ring-1 ring-amber-300/40'
                      : 'bg-parchment-subtle border-stone-300 hover:border-stone-400'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Left: Step Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-800 font-mono text-[11px] font-bold uppercase">
                          {lang === 'hi' ? `चरण ०${step.stepNumber}` : `STEP 0${step.stepNumber}`}
                        </span>

                        {/* Responsibility Badge */}
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[11px] font-semibold border border-stone-200">
                          👤 {lang === 'hi' ? step.responsibilityLabelHi : step.responsibilityLabel}
                        </span>

                        {/* Target Calendar Date */}
                        {stepTargetDate && (
                          <span className="text-[11px] text-stone-500 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-stone-400" />
                            <span>
                              {lang === 'hi' ? 'लक्ष्य:' : 'Target:'} {formatDisplayDate(stepTargetDate, lang)}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Step Title */}
                      <h3
                        className={`text-base font-serif font-bold ${
                          isCompleted ? 'text-emerald-950 line-through decoration-emerald-600/40' : 'text-soil-charcoal'
                        }`}
                      >
                        {lang === 'hi' ? step.titleHi : step.title}
                      </h3>

                      {/* Step Description */}
                      <p className="text-xs text-stone-600 leading-relaxed max-w-3xl">
                        {lang === 'hi' ? step.descriptionHi : step.description}
                      </p>

                      {/* Guidance Note Box */}
                      {(step.guidanceNotes || step.guidanceNotesHi) && (
                        <div className="p-2 rounded bg-stone-100/90 border border-stone-200 text-[11px] text-stone-700 inline-block">
                          <span className="font-bold">{lang === 'hi' ? 'खेत सुझाव:' : 'Field Tip:'}</span>{' '}
                          {lang === 'hi' ? step.guidanceNotesHi : step.guidanceNotes}
                        </div>
                      )}
                    </div>

                    {/* Right: Interactive Status Control Buttons */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
                      <div className="flex rounded border border-stone-300 p-0.5 bg-stone-100 text-xs">
                        <button
                          type="button"
                          onClick={() => updateStepStatus(step.id, 'not_started')}
                          className={`px-2.5 py-1.5 rounded text-xs font-semibold transition-colors min-h-[36px] ${
                            step.status === 'not_started'
                              ? 'bg-white text-stone-800 shadow-xs'
                              : 'text-stone-500 hover:text-stone-800'
                          }`}
                        >
                          {lang === 'hi' ? 'शुरू नहीं' : 'Not Started'}
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStepStatus(step.id, 'in_progress')}
                          className={`px-2.5 py-1.5 rounded text-xs font-semibold transition-colors min-h-[36px] ${
                            step.status === 'in_progress'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-stone-500 hover:text-stone-800'
                          }`}
                        >
                          {lang === 'hi' ? 'प्रगति पर' : 'In Progress'}
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStepStatus(step.id, 'completed')}
                          className={`px-2.5 py-1.5 rounded text-xs font-semibold transition-colors min-h-[36px] ${
                            step.status === 'completed'
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'text-stone-500 hover:text-stone-800'
                          }`}
                        >
                          {lang === 'hi' ? '✓ पूर्ण' : '✓ Completed'}
                        </button>
                      </div>

                      {isCompleted && step.completedAt && (
                        <span className="text-[10px] text-emerald-800 font-mono">
                          {lang === 'hi' ? 'सत्यापित:' : 'Verified:'}{' '}
                          {new Date(step.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Record Outcome Prompt Card */}
        <div className="mb-10 p-6 rounded-lg bg-emerald-50 border border-emerald-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <h3 className="text-base font-serif font-bold text-emerald-950">
                {lang === 'hi'
                  ? 'खेत में कार्य पूर्ण हो गया? अपना परिणाम दर्ज करें'
                  : 'Finished field operations? Record your verifiable outcome'}
              </h3>
            </div>
            <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
              {lang === 'hi'
                ? 'अपने वास्तविक प्रबंधित अवशेष की मात्रा और पराली न जलाने की पुष्टि दर्ज करके अपना प्रभाव बहीखाता (Impact Ledger) तैयार करें।'
                : 'Document your managed residue tonnage and open-burning avoidance to create your verifiable project outcome and impact record.'}
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant="primary"
              onClick={() => setShowOutcomeModal(true)}
              className="w-full sm:w-auto inline-flex items-center gap-2"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>{lang === 'hi' ? 'परिणाम दर्ज करें →' : 'Record Outcome Now →'}</span>
            </Button>
          </div>
        </div>

        {/* Responsible AI & Disclaimer Notice */}
        <div className="p-4 rounded bg-stone-100 border border-stone-300 text-xs text-stone-600 leading-relaxed">
          <span className="font-bold text-stone-800">
            {lang === 'hi' ? 'जिम्मेदार उपयोग सूचना:' : 'Responsible Use Notice:'}
          </span>{' '}
          {lang === 'hi'
            ? 'एग्रीसाइकिल किसान द्वारा दर्ज जानकारी और उपलब्ध संसाधन डेटा के आधार पर निर्णय सहायता प्रदान करता है। आगे बढ़ने से पहले स्थानीय मशीनरी उपलब्धता, वास्तविक दरों और खेत की स्थिति की स्वयं पुष्टि करें।'
            : 'AgriCycle provides decision support using the information entered by the user and configured resource data. Confirm local machinery availability, pricing and operating conditions before proceeding.'}
        </div>

        {/* Record Outcome Modal Dialog */}
        {showOutcomeModal && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-lg border border-stone-300 shadow-xl max-w-lg w-full p-6 my-8">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-agri-primary" />
                  <h3 className="font-serif font-bold text-lg text-soil-charcoal">
                    {lang === 'hi' ? 'खेत कार्य परिणाम दर्ज करें' : 'Record Field Outcome'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOutcomeModal(false)}
                  className="text-stone-400 hover:text-stone-700 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleRecordOutcomeSubmit} className="space-y-4 text-xs">
                {/* Residue Quantity Managed */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-700">
                      {lang === 'hi' ? 'प्रबंधित अवशेष की मात्रा (टन):' : 'Residue Quantity Managed (Tonnes):'}
                    </label>
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-mono font-bold">
                      USER-REPORTED
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    required
                    value={outcomeResidueTonnes}
                    onChange={(e) => setOutcomeResidueTonnes(e.target.value)}
                    className="w-full p-2 rounded border border-stone-300 bg-stone-50 font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-agri-primary"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    {lang === 'hi'
                      ? `प्रारंभिक आकलन: ${currentAssessment.residueTonnes} टन (${currentAssessment.acreage} एकड़)`
                      : `Initial assessment: ${currentAssessment.residueTonnes} Tonnes across ${currentAssessment.acreage} Acres`}
                  </span>
                </div>

                {/* Open Burning Avoidance Toggle */}
                <div className="p-3 rounded bg-stone-50 border border-stone-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-stone-800">
                      {lang === 'hi' ? 'पराली का खुला दहन (आग लगाना) रोका गया?' : 'Potential Open Burning Avoided?'}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-mono font-bold">
                      USER-REPORTED
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-stone-800">
                      <input
                        type="radio"
                        name="burningAvoided"
                        checked={outcomeBurningAvoided === true}
                        onChange={() => setOutcomeBurningAvoided(true)}
                        className="text-agri-primary focus:ring-agri-primary"
                      />
                      <span>{lang === 'hi' ? 'हाँ, 100% आग लगाना रोका गया' : 'Yes, Open Burning Avoided'}</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-stone-800">
                      <input
                        type="radio"
                        name="burningAvoided"
                        checked={outcomeBurningAvoided === false}
                        onChange={() => setOutcomeBurningAvoided(false)}
                        className="text-stone-500 focus:ring-stone-500"
                      />
                      <span>{lang === 'hi' ? 'नहीं' : 'No'}</span>
                    </label>
                  </div>
                </div>

                {/* Completion Date */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-700">
                      {lang === 'hi' ? 'कार्य समाप्ति तिथि:' : 'Actual / Target Completion Date:'}
                    </label>
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-mono font-bold">
                      USER-REPORTED
                    </span>
                  </div>
                  <input
                    type="date"
                    required
                    value={outcomeDate}
                    onChange={(e) => setOutcomeDate(e.target.value)}
                    className="w-full p-2 rounded border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-agri-primary"
                  />
                </div>

                {/* Status */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-700">
                      {lang === 'hi' ? 'कार्य पूर्णता स्तर:' : 'Execution Status:'}
                    </label>
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-mono font-bold">
                      USER-REPORTED
                    </span>
                  </div>
                  <select
                    value={outcomeStatus}
                    onChange={(e) => setOutcomeStatus(e.target.value as 'fully_completed' | 'partially_completed')}
                    className="w-full p-2 rounded border border-stone-300 bg-stone-50 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-agri-primary"
                  >
                    <option value="fully_completed">
                      {lang === 'hi' ? 'पूर्ण रूप से संपन्न (100% खेत साफ)' : 'Fully Completed (100% Field Clearance)'}
                    </option>
                    <option value="partially_completed">
                      {lang === 'hi' ? 'आंशिक रूप से संपन्न (प्रगति पर)' : 'Partially Completed (In Progress)'}
                    </option>
                  </select>
                </div>

                {/* Optional Notes */}
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {lang === 'hi' ? 'टिप्पणी / मशीनरी अनुभव (वैकल्पिक):' : 'Operational Notes & Farmer Remarks (Optional):'}
                  </label>
                  <textarea
                    rows={2}
                    value={outcomeNotes}
                    onChange={(e) => setOutcomeNotes(e.target.value)}
                    placeholder={
                      lang === 'hi'
                        ? 'जैसे: हैप्पी सीडर से समय पर बुवाई हो गई, मिट्टी में नमी अच्छी थी...'
                        : 'e.g., Happy Seeder operation completed smoothly, seedbed moisture was optimal...'
                    }
                    className="w-full p-2 rounded border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-agri-primary"
                  />
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowOutcomeModal(false)}
                  >
                    {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    {lang === 'hi' ? 'प्रभाव बहीखाते में दर्ज करें →' : 'Save to Impact Ledger →'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
