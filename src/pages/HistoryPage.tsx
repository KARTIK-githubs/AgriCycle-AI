import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAssessment } from '../context/AssessmentContext';
import { useLanguage } from '../context/LanguageContext';
import {
  History as HistoryIcon,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Clock,
  Layers,
  Trash2
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { language } = useLanguage();
  const lang = language;
  const navigate = useNavigate();
  const {
    assessments,
    impactRecords,
    currentAssessment,
    setCurrentAssessmentById,
    saveAssessment,
    recordOutcome,
    resetAllAssessments,
  } = useAssessment();

  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  // Calculate cumulative stats
  const totalResidueDiverted = impactRecords.reduce(
    (sum, r) => sum + (Number(r.residueTonnes) || 0),
    0
  );

  // Helper to load demonstration history if empty
  const handleLoadDemoHistory = () => {
    // 1. First record: Kharif 2025 Completed Outcome
    const asm2025 = saveAssessment({
      crop: 'paddy',
      residueTonnes: 14,
      acreage: 7,
      state: 'Haryana',
      district: 'Karnal',
      village: 'Taraori Rural',
      harvestDate: '2025-10-24',
      sowingDate: '2025-11-06',
      machineryOwned: 'none',
      farmerPriority: 'lowest_cost',
    });

    recordOutcome({
      assessmentId: asm2025.id,
      completionDate: '2025-10-29',
      crop: 'paddy',
      residueTonnes: 14,
      acreage: 7,
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
      resourceNameHi: 'तरावड़ी पैक्स प्राथमिक कृषि सहकारी कस्टम हायरिंग केंद्र',
      resourceDistanceKm: 4.2,
      estimatedCostTotalINR: 15400,
      openBurningAvoided: true,
      completionStatus: 'fully_completed',
      farmerNotes: 'Harvest completed smoothly. Wheat drilled directly into standing stubble with Taraori PACS Happy Seeder.',
    });

    // 2. Second record: Current Kharif 2026 Record
    const asm2026 = saveAssessment({
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

    recordOutcome({
      assessmentId: asm2026.id,
      completionDate: '2026-10-28',
      crop: 'paddy',
      residueTonnes: 5,
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
      resourceNameHi: 'तरावड़ी पैक्स प्राथमिक कृषि सहकारी कस्टम हायरिंग केंद्र',
      resourceDistanceKm: 4.2,
      estimatedCostTotalINR: 17600,
      openBurningAvoided: true,
      completionStatus: 'fully_completed',
      farmerNotes: 'Current season execution recorded. Soil moisture optimal, burning completely avoided.',
    });

    setCurrentAssessmentById(asm2026.id);
  };

  const handleSelectAssessment = (id: string, targetPath: string) => {
    setCurrentAssessmentById(id);
    navigate(targetPath);
  };

  const handleClearHistory = () => {
    resetAllAssessments();
    setConfirmClear(false);
  };

  return (
    <div className="py-8 sm:py-10 bg-parchment-100 min-h-screen">
      <Container size="lg">
        {/* Breadcrumb & Navigation */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-sm text-soil-600">
            <Link to="/home" className="hover:text-agri-forest flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              {lang === 'hi' ? 'किसान डैशबोर्ड' : 'Farmer Home'}
            </Link>
            <span>/</span>
            <span className="font-semibold text-soil-900">
              {lang === 'hi' ? 'मौसमी इतिहास' : 'Assessment History'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/assess">
              <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                {lang === 'hi' ? 'नया आकलन शुरू करें' : 'New Assessment'}
              </Button>
            </Link>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-8 border-b border-field-border pb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-baseline gap-3 mb-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-soil-900 tracking-tight">
                {lang === 'hi' ? 'मौसमी आकलन एवं प्रभाव इतिहास' : 'Seasonal Assessment & Impact History'}
              </h1>
              <Badge variant="neutral">
                {lang === 'hi' ? 'ऑडिट रिकॉर्ड' : 'Audit Trail'}
              </Badge>
            </div>
            <p className="text-soil-700 text-sm sm:text-base max-w-3xl leading-relaxed">
              {lang === 'hi'
                ? 'कटाई सत्रों के दौरान किए गए सभी आकलनों, अनुशंसित कार्य योजनाओं और दर्ज प्रभाव परिणामों का स्थायी रिकॉर्ड।'
                : 'Permanent audit record of all field assessments, decision solver recommendations, and recorded field execution outcomes across seasons.'}
            </p>
          </div>

          {assessments.length > 0 && (
            <div>
              {confirmClear ? (
                <div className="flex items-center gap-2 bg-amber-50 p-2 rounded border border-amber-300">
                  <span className="text-xs text-amber-900 font-medium">
                    {lang === 'hi' ? 'सभी रिकॉर्ड हटाएं?' : 'Clear all history?'}
                  </span>
                  <button
                    onClick={handleClearHistory}
                    className="px-2 py-1 bg-red-700 text-white rounded text-xs font-bold hover:bg-red-800"
                  >
                    {lang === 'hi' ? 'हाँ, मिटाएं' : 'Yes, Clear'}
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="px-2 py-1 bg-stone-200 text-stone-800 rounded text-xs hover:bg-stone-300"
                  >
                    {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="text-xs text-soil-500 hover:text-red-700 flex items-center gap-1 font-mono underline"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'इतिहास रीसेट करें' : 'Reset History'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* EMPTY STATE */}
        {assessments.length === 0 ? (
          <div className="bg-parchment-50 border border-field-border rounded-sm p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-16 h-16 bg-parchment-200 border border-field-border rounded-full flex items-center justify-center mx-auto mb-4 text-soil-600">
              <HistoryIcon className="w-8 h-8 text-agri-forest" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-soil-900 mb-2">
              {lang === 'hi' ? 'कोई पिछला आकलन रिकॉर्ड नहीं है' : 'No Assessment Records Found'}
            </h2>
            <p className="text-soil-700 text-sm mb-6 max-w-md mx-auto leading-relaxed">
              {lang === 'hi'
                ? 'आपके द्वारा किए गए सभी फसल अवशेष आकलन, कार्य योजनाएं और प्रभाव बहीखाता यहां सुरक्षित रखे जाएंगे।'
                : 'Your seasonal crop residue assessments, decision engine rankings, and recorded impact outcomes will appear here.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/assess">
                <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                  {lang === 'hi' ? 'पहला आकलन शुरू करें' : 'Start First Assessment'}
                </Button>
              </Link>
              <Button
                variant="outline"
                size="md"
                onClick={handleLoadDemoHistory}
              >
                {lang === 'hi' ? 'डेमो इतिहास लोड करें' : 'Load Demonstration History'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Cumulative Summary Tally */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-field-border rounded-sm p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono uppercase text-soil-600 font-bold">
                    {lang === 'hi' ? 'कुल मौसमी आकलन' : 'Total Assessments'}
                  </span>
                  <Layers className="w-4 h-4 text-soil-500" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-soil-900">
                  {assessments.length}
                </div>
                <div className="text-xs text-soil-500 mt-1">
                  {lang === 'hi' ? 'दर्ज किए गए खेत चक्र' : 'Recorded harvest cycles'}
                </div>
              </div>

              <div className="bg-white border border-field-border rounded-sm p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono uppercase text-soil-600 font-bold">
                    {lang === 'hi' ? 'सत्यापित प्रभाव परिणाम' : 'Outcomes Recorded'}
                  </span>
                  <FileCheck className="w-4 h-4 text-agri-forest" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-agri-forest">
                  {impactRecords.length}
                </div>
                <div className="text-xs text-soil-500 mt-1">
                  {lang === 'hi' ? 'खेत में निष्पादित व दर्ज' : 'Verified field executions'}
                </div>
              </div>

              <div className="bg-white border border-field-border rounded-sm p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono uppercase text-soil-600 font-bold">
                    {lang === 'hi' ? 'कुल प्रबंधित अवशेष' : 'Total Straw Diverted'}
                  </span>
                  <Badge variant="forest">USER-REPORTED</Badge>
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-soil-900">
                  {totalResidueDiverted}{' '}
                  <span className="text-sm font-sans font-normal text-soil-600">
                    {lang === 'hi' ? 'टन' : 'Tonnes'}
                  </span>
                </div>
                <div className="text-xs text-soil-500 mt-1">
                  {lang === 'hi' ? 'पराली दहन से सुरक्षित रूप से रोका गया' : 'Diverted from open-field burning'}
                </div>
              </div>
            </div>

            {/* Assessment Records List */}
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-soil-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-soil-600" />
                <span>{lang === 'hi' ? 'आकलन एवं परिणाम सूची' : 'Assessment & Execution Audit Log'}</span>
              </h2>

              <div className="divide-y divide-field-border bg-white border border-field-border rounded-sm overflow-hidden shadow-xs">
                {assessments.map((asm) => {
                  const correspondingImpact = impactRecords.find((imp) => imp.assessmentId === asm.id);
                  const isCurrent = currentAssessment?.id === asm.id;

                  return (
                    <div
                      key={asm.id}
                      className={`p-5 sm:p-6 transition-colors ${
                        isCurrent ? 'bg-parchment-50/80 border-l-4 border-l-agri-forest' : 'hover:bg-parchment-50/40'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Record Main Info */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono bg-parchment-200 px-2 py-0.5 rounded text-soil-800 font-semibold">
                              {asm.crop.toUpperCase()}
                            </span>
                            <span className="text-xs font-mono text-soil-500">
                              ID: {asm.id}
                            </span>
                            {isCurrent && (
                              <Badge variant="forest">
                                {lang === 'hi' ? 'वर्तमान सक्रिय' : 'Active Field'}
                              </Badge>
                            )}
                            {correspondingImpact ? (
                              <Badge variant="verified">
                                {lang === 'hi' ? 'किसान-रिपोर्टेड: दहन से बचाव — हाँ' : 'USER-REPORTED: Burning Avoided — Yes'}
                              </Badge>
                            ) : (
                              <Badge variant="neutral">
                                {lang === 'hi' ? 'योजना प्रगति पर' : 'Plan In Progress'}
                              </Badge>
                            )}
                          </div>

                          <div className="font-serif text-lg sm:text-xl font-bold text-soil-900">
                            {asm.residueTonnes} {lang === 'hi' ? 'टन फसल अवशेष' : 'Tonnes Residue'} • {asm.acreage} {lang === 'hi' ? 'एकड़' : 'Acres'}
                          </div>

                          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-soil-600">
                            <div>
                              <span className="font-medium text-soil-800">
                                {lang === 'hi' ? 'स्थान:' : 'Location:'}
                              </span>{' '}
                              {asm.village}, {asm.district}, {asm.state}
                            </div>
                            <div>
                              <span className="font-medium text-soil-800">
                                {lang === 'hi' ? 'कटाई:' : 'Harvest:'}
                              </span>{' '}
                              {asm.harvestDate}
                            </div>
                            <div>
                              <span className="font-medium text-soil-800">
                                {lang === 'hi' ? 'बुवाई समय सीमा:' : 'Window:'}
                              </span>{' '}
                              {asm.windowDays} {lang === 'hi' ? 'दिन' : 'days'}
                            </div>
                            <div>
                              <span className="font-medium text-soil-800">
                                {lang === 'hi' ? 'प्राथमिकता:' : 'Priority:'}
                              </span>{' '}
                              {asm.farmerPriority.replace('_', ' ')}
                            </div>
                          </div>

                          {correspondingImpact && (
                            <div className="mt-2 p-2.5 bg-parchment-100 rounded border border-field-border text-xs text-soil-700 flex items-center justify-between gap-2">
                              <div>
                                <span className="font-bold text-agri-forest">
                                  {lang === 'hi' ? 'लागू विधि:' : 'Executed Pathway:'}
                                </span>{' '}
                                {lang === 'hi' ? correspondingImpact.pathwayNameHi : correspondingImpact.pathwayName}
                              </div>
                              <div className="font-mono text-soil-600">
                                {lang === 'hi' ? 'सत्यापन तिथि:' : 'Verified:'} {correspondingImpact.completionDate}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-field-border">
                          {correspondingImpact ? (
                            <Button
                              variant="primary"
                              size="sm"
                              icon={<FileCheck className="w-3.5 h-3.5" />}
                              onClick={() => handleSelectAssessment(asm.id, '/impact')}
                            >
                              {lang === 'hi' ? 'प्रभाव बहीखाता देखें' : 'View Impact Ledger'}
                            </Button>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              icon={<ArrowRight className="w-3.5 h-3.5" />}
                              onClick={() => handleSelectAssessment(asm.id, '/action-plan')}
                            >
                              {lang === 'hi' ? 'कार्य योजना खोलें' : 'Open Action Plan'}
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectAssessment(asm.id, '/recommendation')}
                          >
                            {lang === 'hi' ? 'सिफारिश देखें' : 'View Recommendation'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-field-border">
              <Link to="/home">
                <Button variant="outline" size="md" icon={<ArrowLeft className="w-4 h-4" />}>
                  {lang === 'hi' ? 'किसान डैशबोर्ड' : 'Farmer Home'}
                </Button>
              </Link>
              <Link to="/assess">
                <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                  {lang === 'hi' ? 'नया आकलन जोड़ें' : 'Add New Seasonal Assessment'}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
