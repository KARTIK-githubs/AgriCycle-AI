import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAssessment } from '../context/AssessmentContext';
import { useLanguage } from '../context/LanguageContext';
import {
  CheckCircle2,
  Calendar,
  Truck,
  Flame,
  Leaf,
  ArrowRight,
  ArrowLeft,
  Printer,
  History as HistoryIcon,
  FileCheck,
  Info
} from 'lucide-react';
import { ImpactRecord } from '../types';

export const ImpactPage: React.FC = () => {
  const { language } = useLanguage();
  const lang = language;
  const {
    currentImpactRecord,
    impactRecords,
    currentAssessment,
    recordOutcome,
    saveAssessment,
  } = useAssessment();

  // Active record to view (current or selected from list)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(
    currentImpactRecord?.id || (impactRecords.length > 0 ? impactRecords[0].id : null)
  );

  const activeRecord: ImpactRecord | null =
    impactRecords.find((r) => r.id === selectedRecordId) ||
    currentImpactRecord ||
    (impactRecords.length > 0 ? impactRecords[0] : null);

  // Helper to load demonstration record if ledger is empty
  const handleLoadDemoRecord = () => {
    // Ensure an assessment exists first
    const asm = saveAssessment({
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

    const newRecord = recordOutcome({
      assessmentId: asm.id,
      completionDate: '2026-10-29',
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
      farmerNotes: 'Happy Seeder was dispatched from Taraori PACS. Direct wheat drilling completed in single pass without pre-burning. Optimal soil moisture retained.',
    });

    setSelectedRecordId(newRecord.id);
  };

  return (
    <div className="py-8 sm:py-10 bg-parchment-100 min-h-screen">
      <Container size="lg">
        {/* Breadcrumb & Navigation */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-sm text-soil-600">
            <Link to="/action-plan" className="hover:text-agri-forest flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              {lang === 'hi' ? 'कार्य योजना' : 'Action Plan'}
            </Link>
            <span>/</span>
            <span className="font-semibold text-soil-900">
              {lang === 'hi' ? 'प्रभाव बहीखाता' : 'Impact Ledger'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/history">
              <Button variant="outline" size="sm" icon={<HistoryIcon className="w-4 h-4" />}>
                {lang === 'hi' ? 'मौसमी इतिहास' : 'Assessment History'}
              </Button>
            </Link>
            {activeRecord && (
              <Button
                variant="outline"
                size="sm"
                icon={<Printer className="w-4 h-4" />}
                onClick={() => window.print()}
              >
                {lang === 'hi' ? 'प्रिंट / सेव' : 'Print Summary'}
              </Button>
            )}
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-8 border-b border-field-border pb-5">
          <div className="flex flex-wrap items-baseline gap-3 mb-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-soil-900 tracking-tight">
              {lang === 'hi' ? 'खेत परिणाम एवं प्रभाव बहीखाता' : 'Field Outcome & Impact Record'}
            </h1>
            <Badge variant="forest">
              {lang === 'hi' ? 'खेत परिणाम रिकॉर्ड' : 'Field Outcome Record'}
            </Badge>
          </div>
          <p className="text-soil-700 text-sm sm:text-base max-w-3xl leading-relaxed">
            {lang === 'hi'
              ? 'फसल अवशेष प्रबंधन, कस्टम मशीनरी उपयोग और खुले खेत में पराली दहन से बचाव का पारदर्शी व तथ्यपरक बहीखाता।'
              : 'Grounded operational accounting of crop residue diversion, machinery logistics, and open-burning avoidance with explicit data provenance.'}
          </p>
        </div>

        {/* EMPTY STATE */}
        {!activeRecord ? (
          <div className="bg-parchment-50 border border-field-border rounded-sm p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-16 h-16 bg-parchment-200 border border-field-border rounded-full flex items-center justify-center mx-auto mb-4 text-soil-600">
              <FileCheck className="w-8 h-8 text-agri-forest" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-soil-900 mb-2">
              {lang === 'hi' ? 'अभी तक कोई परिणाम दर्ज नहीं किया गया' : 'No Field Outcome Recorded Yet'}
            </h2>
            <p className="text-soil-700 text-sm mb-6 max-w-md mx-auto leading-relaxed">
              {lang === 'hi'
                ? 'प्रभाव बहीखाता तब तैयार होता है जब आप अपने खेत में कार्य पूरा करके कार्य योजना में "परिणाम दर्ज करें" पर क्लिक करते हैं।'
                : 'An impact record is generated once you execute your operational pathway and submit your field outcome in the Action Plan.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {currentAssessment ? (
                <Link to="/action-plan">
                  <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                    {lang === 'hi' ? 'कार्य योजना पर जाएं व परिणाम दर्ज करें' : 'Go to Action Plan & Record Outcome'}
                  </Button>
                </Link>
              ) : (
                <Link to="/assess">
                  <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                    {lang === 'hi' ? 'नया आकलन शुरू करें' : 'Start Field Assessment'}
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                size="md"
                onClick={handleLoadDemoRecord}
              >
                {lang === 'hi' ? 'नमूना रिकॉर्ड लोड करें (डेमो)' : 'Load Sample Demonstration Record'}
              </Button>
            </div>
          </div>
        ) : (
          /* ACTIVE IMPACT RECORD DISPLAY */
          <div className="space-y-8">
            {/* Record Selector if multiple exist */}
            {impactRecords.length > 1 && (
              <div className="bg-parchment-50 border border-field-border rounded-sm p-3 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-mono uppercase text-soil-600 font-bold">
                  {lang === 'hi' ? 'दर्ज रिकॉर्ड चुनें:' : 'Select Recorded Outcome:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {impactRecords.map((rec) => (
                    <button
                      key={rec.id}
                      onClick={() => setSelectedRecordId(rec.id)}
                      className={`text-xs px-3 py-1 rounded-xs border transition-colors ${
                        rec.id === activeRecord.id
                          ? 'bg-agri-forest text-white border-agri-forest font-semibold'
                          : 'bg-white text-soil-700 border-field-border hover:bg-parchment-100'
                      }`}
                    >
                      {rec.crop.toUpperCase()} • {rec.completionDate} ({rec.residueTonnes} T)
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Field Outcome Record / Ledger Card */}
            <div className="bg-parchment-50 border border-field-border rounded-sm shadow-xs overflow-hidden">
              {/* Top Record Header Bar */}
              <div className="bg-parchment-200/70 border-b border-field-border p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold tracking-widest text-soil-600 uppercase">
                      {lang === 'hi' ? 'खेत परिणाम रिकॉर्ड' : 'FIELD OUTCOME RECORD'}
                    </span>
                    <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-field-border text-soil-800">
                      ID: {activeRecord.id}
                    </span>
                  </div>
                  <div className="text-xs text-soil-600">
                    {lang === 'hi' ? 'दर्ज करने की तिथि:' : 'Recorded At:'}{' '}
                    <span className="font-medium text-soil-800">
                      {new Date(activeRecord.timestamp).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-agri-forest-50 border border-agri-forest-600/40 rounded-xs text-agri-forest-800 text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-agri-forest" />
                    <span>
                      {activeRecord.completionStatus === 'fully_completed'
                        ? lang === 'hi'
                          ? 'पूर्ण रूप से संपन्न (100% खेत साफ)'
                          : 'Fully Completed (100% Residue Cleared)'
                        : lang === 'hi'
                        ? 'आंशिक रूप से संपन्न'
                        : 'Partially Completed'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 border border-emerald-300 rounded-xs text-emerald-900 text-xs font-bold uppercase tracking-wider">
                    <Flame className="w-3.5 h-3.5 text-emerald-700" />
                    <span>
                      {lang === 'hi' ? 'किसान-रिपोर्टेड: पराली दहन से बचाव — हाँ' : 'USER-REPORTED: OPEN BURNING AVOIDED — YES'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Core Ledger Grid */}
              <div className="p-5 sm:p-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Metric 1: Residue Managed */}
                  <div className="bg-white border border-field-border rounded-sm p-4 relative flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-mono uppercase text-soil-600 font-bold">
                        {lang === 'hi' ? 'प्रबंधित फसल अवशेष' : 'Residue Diverted'}
                      </span>
                      <Badge variant="forest">USER-REPORTED</Badge>
                    </div>
                    <div className="my-2">
                      <div className="font-serif text-2xl sm:text-3xl font-bold text-soil-900">
                        {activeRecord.residueTonnes}{' '}
                        <span className="text-sm font-sans font-normal text-soil-600">
                          {lang === 'hi' ? 'टन' : 'Tonnes'}
                        </span>
                      </div>
                      <div className="text-xs text-soil-600 mt-1">
                        {lang === 'hi'
                          ? `${activeRecord.acreage} एकड़ खेत • ${activeRecord.crop === 'other' ? activeRecord.customCropName : activeRecord.crop}`
                          : `${activeRecord.acreage} Acres • ${activeRecord.crop === 'other' ? activeRecord.customCropName : activeRecord.crop} Straw`}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-field-border/60 text-[11px] text-soil-500">
                      {lang === 'hi' ? 'खेत में खुला दहन रोका गया' : 'Diverted from open-field burning'}
                    </div>
                  </div>

                  {/* Metric 2: Pathway Applied */}
                  <div className="bg-white border border-field-border rounded-sm p-4 relative flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-mono uppercase text-soil-600 font-bold">
                        {lang === 'hi' ? 'चुनी गई प्रबंधन विधि' : 'Applied Pathway'}
                      </span>
                      <Badge variant="verified">CALCULATED</Badge>
                    </div>
                    <div className="my-2">
                      <div className="font-serif text-lg sm:text-xl font-bold text-soil-900 leading-snug">
                        {lang === 'hi' ? activeRecord.pathwayNameHi : activeRecord.pathwayName}
                      </div>
                      <div className="text-xs text-soil-600 mt-1">
                        {lang === 'hi'
                          ? 'एग्रीसाइकिल निर्णय इंजन द्वारा अनुकूलित'
                          : 'Optimized by AgriCycle Decision Engine'}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-field-border/60 text-[11px] text-soil-500">
                      ID: {activeRecord.pathwayId}
                    </div>
                  </div>

                  {/* Metric 3: Machinery Resource */}
                  <div className="bg-white border border-field-border rounded-sm p-4 relative flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-mono uppercase text-soil-600 font-bold">
                        {lang === 'hi' ? 'कस्टम हायरिंग / मशीनरी केंद्र' : 'Machinery Hub / CHC'}
                      </span>
                      <Badge variant="neutral">ESTIMATED</Badge>
                    </div>
                    <div className="my-2">
                      <div className="font-serif text-base sm:text-lg font-bold text-soil-900 leading-tight">
                        {lang === 'hi'
                          ? activeRecord.resourceNameHi || activeRecord.resourceName || 'स्थानीय सेवा केंद्र'
                          : activeRecord.resourceName || 'Local Machinery Hub'}
                      </div>
                      <div className="text-xs text-soil-600 mt-1 flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-soil-500 shrink-0" />
                        <span>
                          {activeRecord.resourceDistanceKm !== undefined
                            ? lang === 'hi'
                              ? `खेत से ~${activeRecord.resourceDistanceKm.toFixed(1)} किमी दूरी`
                              : `~${activeRecord.resourceDistanceKm.toFixed(1)} km from field`
                            : lang === 'hi'
                            ? 'स्थानीय खेत में कार्यरत'
                            : 'On-site local operator'}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-field-border/60 text-[11px] text-soil-500">
                      {activeRecord.location.village}, {activeRecord.location.district}
                    </div>
                  </div>

                  {/* Metric 4: Estimated Operational Expense */}
                  <div className="bg-white border border-field-border rounded-sm p-4 relative flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-mono uppercase text-soil-600 font-bold">
                        {lang === 'hi' ? 'अनुमानित परिचालन लागत' : 'Estimated Cost'}
                      </span>
                      <Badge variant="neutral">ESTIMATED</Badge>
                    </div>
                    <div className="my-2">
                      <div className="font-serif text-2xl sm:text-3xl font-bold text-soil-900">
                        ₹{activeRecord.estimatedCostTotalINR.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-soil-600 mt-1">
                        {lang === 'hi'
                          ? `औसत ₹${Math.round(activeRecord.estimatedCostTotalINR / (activeRecord.acreage || 1)).toLocaleString('en-IN')} प्रति एकड़`
                          : `Avg ₹${Math.round(activeRecord.estimatedCostTotalINR / (activeRecord.acreage || 1)).toLocaleString('en-IN')} / acre`}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-field-border/60 text-[11px] text-soil-500">
                      {lang === 'hi'
                        ? 'क्षेत्रीय कस्टम हायरिंग किराए पर आधारित'
                        : 'Based on regional custom hiring benchmark'}
                    </div>
                  </div>

                  {/* Metric 5: Open Burning Avoidance Status */}
                  <div className="bg-white border border-field-border rounded-sm p-4 relative flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-mono uppercase text-soil-600 font-bold">
                        {lang === 'hi' ? 'पराली दहन से बचाव' : 'Burning Avoided'}
                      </span>
                      <Badge variant="forest">USER-REPORTED</Badge>
                    </div>
                    <div className="my-2">
                      <div className="font-serif text-2xl sm:text-3xl font-bold text-agri-forest flex items-center gap-2">
                        <CheckCircle2 className="w-7 h-7 text-agri-forest" />
                        <span>{lang === 'hi' ? '100% सुरक्षित' : 'Avoided'}</span>
                      </div>
                      <div className="text-xs text-soil-600 mt-1">
                        {lang === 'hi'
                          ? 'अवशेष को खेत में जलाए बिना प्रबंधित किया गया'
                          : 'Zero open-field combustion reported'}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-field-border/60 text-[11px] text-soil-500">
                      {lang === 'hi' ? 'स्थानीय वायु गुणवत्ता संरक्षित' : 'Air quality baseline preserved'}
                    </div>
                  </div>

                  {/* Metric 6: Completion Date */}
                  <div className="bg-white border border-field-border rounded-sm p-4 relative flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-mono uppercase text-soil-600 font-bold">
                        {lang === 'hi' ? 'कार्य संपन्न तिथि' : 'Completion Date'}
                      </span>
                      <Badge variant="neutral">USER-REPORTED</Badge>
                    </div>
                    <div className="my-2">
                      <div className="font-serif text-2xl sm:text-3xl font-bold text-soil-900 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-soil-600" />
                        <span>{activeRecord.completionDate}</span>
                      </div>
                      <div className="text-xs text-soil-600 mt-1">
                        {lang === 'hi'
                          ? 'रबी बुवाई से पूर्व खेत समय पर तैयार'
                          : 'Field cleared within critical sowing window'}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-field-border/60 text-[11px] text-soil-500">
                      {lang === 'hi' ? 'किसान द्वारा सत्यापित' : 'Verified by field operator'}
                    </div>
                  </div>
                </div>

                {/* Farmer Remarks / Operational Notes (if available) */}
                {activeRecord.farmerNotes && (
                  <div className="mt-6 bg-parchment-100 border border-field-border rounded-sm p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold uppercase text-soil-700">
                        {lang === 'hi' ? 'किसान की टिप्पणी / फील्ड अनुभव:' : 'Farmer Field Remarks & Operational Observations:'}
                      </span>
                      <Badge variant="forest">USER-REPORTED</Badge>
                    </div>
                    <p className="text-sm text-soil-800 italic font-serif leading-relaxed">
                      "{activeRecord.farmerNotes}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Scientific and Agronomic Impact Analysis */}
            <div className="bg-parchment-50 border border-field-border rounded-sm p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-5 h-5 text-agri-forest" />
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-soil-900">
                    {lang === 'hi' ? 'कृषि एवं पर्यावरणीय विश्लेषण' : 'Agronomic & Environmental Accounting'}
                  </h2>
                </div>
                <p className="text-soil-700 text-sm">
                  {lang === 'hi'
                    ? 'बिना काल्पनिक मॉडलिंग के स्थानीय वायु गुणवत्ता, मिट्टी संरचना और फसल चक्र पर पड़ने वाला वास्तविक प्रभाव।'
                    : 'Grounded assessment of local air quality preservation, soil structure, and crop turnaround without speculative modeling.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Air Quality Section */}
                <div className="bg-white border border-field-border rounded-sm p-5 space-y-3">
                  <div className="flex items-center gap-2 text-agri-forest font-bold text-sm">
                    <Flame className="w-4 h-4 text-emerald-700" />
                    <span>
                      {lang === 'hi'
                        ? '1. स्थानीय वायु गुणवत्ता एवं धुएं से बचाव'
                        : '1. Airshed Quality & Open-Fire Prevention'}
                    </span>
                  </div>
                  <p className="text-soil-700 text-sm leading-relaxed">
                    {lang === 'hi'
                      ? `उत्तरी भारत में धान की पराली को खुले में जलाने से कार्बन मोनोऑक्साइड, नाइट्रोजन ऑक्साइड और पार्टिकुलेट मैटर का सघन धुआं फैलता है। आपके द्वारा ${activeRecord.residueTonnes} टन अवशेष को खेत में जलाने के स्थान पर अनुशंसित विधि से प्रबंधित करने से वायु प्रदूषण का यह तीव्र स्रोत पूर्णतः रोक दिया गया।`
                      : `Open combustion of cereal straw in north-western India discharges concentrated plumes of fine particulates, carbon monoxide, nitrogen oxides, and polycyclic aromatic hydrocarbons into the regional winter inversion layer. By diverting ${activeRecord.residueTonnes} tonnes into sustainable management, open field fire was completely avoided.`}
                  </p>
                </div>

                {/* Soil & Agronomic Stewardship Section */}
                <div className="bg-white border border-field-border rounded-sm p-5 space-y-3">
                  <div className="flex items-center gap-2 text-agri-forest font-bold text-sm">
                    <Leaf className="w-4 h-4 text-agri-forest" />
                    <span>
                      {lang === 'hi'
                        ? '2. मृदा स्वास्थ्य एवं फसल पोषण चक्र'
                        : '2. Soil Health & Nutrient Stewardship'}
                    </span>
                  </div>
                  <p className="text-soil-700 text-sm leading-relaxed">
                    {activeRecord.pathwayId.includes('in_situ')
                      ? lang === 'hi'
                        ? 'खेत में हैप्पी सीडर / सुपर सीडर से मल्चिंग करने पर मिट्टी की ऊपरी परत में नमी संरक्षित रहती है, केंचुओं व सूक्ष्मजीवों की सक्रियता बढ़ती है और आगामी गेहूं की फसल को ठंड व सूखे से सुरक्षा मिलती है।'
                        : 'Mulching and in-situ incorporation via Happy Seeder / Super Seeder conserves capillary moisture, sustains subterranean microbial life, and creates an insulating surface blanket for emerging rabi wheat.'
                      : activeRecord.pathwayId.includes('ex_situ')
                      ? lang === 'hi'
                        ? 'बेलिंग व संकलन के माध्यम से अवशेष को बायो-एनर्जी बॉयलरों व पैकेजिंग उद्योगों में भेजा गया, जिससे जीवाश्म कोयले का विकल्प तैयार होता है और खेत अगली बुवाई के लिए पूर्णतः साफ रहता है।'
                        : 'Baling and ex-situ aggregation transports straw to industrial bio-energy boilers and packaging mills, displacing fossil fuels while delivering clean seedbed clearance.'
                      : lang === 'hi'
                        ? 'बायो-डीकंपोजर का छिड़काव लिग्नोसेल्यूलोज का प्राकृतिक अपघटन कर 20-25 दिनों में कार्बनिक खाद में बदल देता है, जिससे मिट्टी की उर्वरता में दीर्घकालिक सुधार होता है।'
                        : 'Microbial bio-decomposition accelerates natural cellulolytic breakdown, converting crop residue into organic humus over 20–25 days without mechanical incineration.'}
                  </p>
                </div>
              </div>

              {/* STRICT DEFENSE DISCLAIMER (Requirement 0 & 2 from User) */}
              <div className="bg-harvest-amber-50 border border-harvest-amber-600/30 rounded-sm p-4 sm:p-5 flex items-start gap-3 text-soil-800">
                <Info className="w-5 h-5 text-harvest-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
                  <div className="font-bold text-harvest-amber-900">
                    {lang === 'hi'
                      ? 'पारदर्शी रिपोर्टिंग मानक एवं वैज्ञानिक सीमाएं:'
                      : 'Notice on Scientific Accounting & Emission Limits:'}
                  </div>
                  <p className="text-soil-700">
                    {lang === 'hi'
                      ? 'बचाए गए PM2.5 की सटीक मात्रा (किलोग्राम में) अथवा मिट्टी में संचित कार्बन के प्रतिशत की गणना क्षेत्रीय वायुमंडलीय मॉडल, मशीनरी के डीजल व्यय और मिट्टी की प्रयोगशाला जांच के बिना करना भ्रामक होता है। एग्रीसाइकिल गैर-सत्यापित काल्पनिक उत्सर्जन आंकड़े प्रस्तुत नहीं करता। उपरोक्त सभी संख्याएं किसान द्वारा दर्ज (USER-REPORTED), क्षेत्रीय मानकों पर अनुमानित (ESTIMATED), अथवा निर्णय-इंजन द्वारा परिकलित (CALCULATED) हैं।'
                      : 'Quantitative claims of exact PM2.5 emissions prevented (in kilograms) or Soil Organic Carbon percentage gains require empirical soil core assays, machinery fuel expenditure logs, and micro-meteorological dispersion modeling. In strict adherence to defensible decision-support standards, AgriCycle does not invent uncalibrated numerical tonnage claims for emissions. All figures above are transparently categorized as USER-REPORTED, ESTIMATED, or CALCULATED.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-field-border">
              <Link to="/action-plan" className="w-full sm:w-auto">
                <Button variant="outline" size="md" fullWidth icon={<ArrowLeft className="w-4 h-4" />}>
                  {lang === 'hi' ? 'कार्य योजना पर वापस जाएं' : 'Back to Action Plan'}
                </Button>
              </Link>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                <Link to="/history">
                  <Button variant="outline" size="md" icon={<HistoryIcon className="w-4 h-4" />}>
                    {lang === 'hi' ? 'सभी आकलनों का इतिहास देखें' : 'View Seasonal History'}
                  </Button>
                </Link>
                <Link to="/assess">
                  <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                    {lang === 'hi' ? 'नया आकलन शुरू करें' : 'Start Next Assessment'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
