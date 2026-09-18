import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAssessment } from '../context/AssessmentContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Check, AlertTriangle, ShieldCheck, MapPin, Wrench, Clock, IndianRupee, Sparkles, Compass } from 'lucide-react';
import { ScoredPathway } from '../engine/solver';

export const ComparePage: React.FC = () => {
  const { language } = useLanguage();
  const lang = language;
  const navigate = useNavigate();
  const { currentAssessment, decisionResult, selectedPathwayId, setSelectedPathwayId, saveAssessment } = useAssessment();

  // Handle fallback if no assessment exists
  const handleLoadDemoAssessment = () => {
    saveAssessment({
      crop: 'paddy',
      residueTonnes: 16,
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

  if (!decisionResult || !currentAssessment) {
    return (
      <Container className="py-12">
        <div className="max-w-2xl mx-auto text-center bg-parchment-subtle p-8 rounded-lg border border-stone-300 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-soil-charcoal mb-2">
            {lang === 'hi' ? 'कोई सक्रिय आकलन नहीं मिला' : 'No Active Residue Assessment Found'}
          </h1>
          <p className="text-stone-600 mb-6 text-sm">
            {lang === 'hi'
              ? 'तुलना मैट्रिक्स देखने के लिए कृपया पहले अपने खेत का अवशेष आकलन पूरा करें या करनाल डेमो डेटा लोड करें।'
              : 'To view the multi-pathway comparison matrix, please complete an assessment for your field or explore using our sample Karnal harvest profile.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" onClick={handleLoadDemoAssessment}>
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
    );
  }

  const { primaryRecommendation, alternativeOptions, excludedPathways } = decisionResult;
  const allFeasible: ScoredPathway[] = [primaryRecommendation, ...alternativeOptions];

  const handleSelectPathway = (pathwayId: string) => {
    setSelectedPathwayId(pathwayId);
  };

  return (
    <div className="py-8 bg-parchment min-h-screen">
      <Container>
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-300">
          <div className="flex items-center gap-2">
            <Link
              to="/recommendation"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-agri-dark transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'सिफारिश पर वापस जाएं' : 'Back to Recommendation'}</span>
            </Link>
            <span className="text-stone-300">/</span>
            <span className="text-xs font-bold text-agri-dark">
              {lang === 'hi' ? 'विकल्प तुलना मैट्रिक्स' : 'Pathway Comparison Matrix'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/resources">
              <Button variant="outline" size="sm" className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-agri-primary" />
                <span>{lang === 'hi' ? 'नजदीकी केंद्र खोजें' : 'Find Nearby CHCs & Balers'}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Header Title & Context Ledger Bar */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="neutral">
              Phase 4 • {lang === 'hi' ? 'निर्णय सहायता तुलना' : 'Decision-Support Matrix'}
            </Badge>
            <Badge variant="verified">
              {lang === 'hi' ? 'पारदर्शी स्कोरिंग' : 'Deterministic Scoring'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-soil-charcoal tracking-tight">
            {lang === 'hi'
              ? 'फसल अवशेष प्रबंधन विकल्पों की तुलनात्मक समीक्षा'
              : 'Residue Management Pathway Comparison'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-stone-600 max-w-3xl">
            {lang === 'hi'
              ? 'आपके खेत के विशिष्ट मापदंडों (अवशेष की मात्रा, समय सीमा, उपलब्ध मशीनरी और दूरी) के आधार पर सभी विकल्पों का पारदर्शी मूल्यांकन।'
              : 'Side-by-side evaluation of regional crop residue pathways based on your specific field constraints: acreage, time window, machinery, and local custom hiring tariffs.'}
          </p>

          {/* Context Strip */}
          <div className="mt-5 p-4 rounded-lg bg-stone-100 border border-stone-300 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-stone-500 block uppercase tracking-wider font-semibold text-[10px]">
                {lang === 'hi' ? 'फसल व अवशेष' : 'Crop & Residue'}
              </span>
              <span className="font-bold text-stone-900 capitalize">
                {currentAssessment.crop} • {currentAssessment.residueTonnes} Tonnes ({currentAssessment.acreage} {lang === 'hi' ? 'एकड़' : 'Acres'})
              </span>
            </div>
            <div>
              <span className="text-stone-500 block uppercase tracking-wider font-semibold text-[10px]">
                {lang === 'hi' ? 'उपलब्ध समय खिड़की' : 'Available Window'}
              </span>
              <span className="font-bold text-stone-900">
                {currentAssessment.windowDays} {lang === 'hi' ? 'दिन (कटाई से बुवाई)' : 'Days (Harvest to Sowing)'}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block uppercase tracking-wider font-semibold text-[10px]">
                {lang === 'hi' ? 'किसान प्राथमिकता' : 'Farmer Priority'}
              </span>
              <span className="font-bold text-stone-900 capitalize">
                {currentAssessment.farmerPriority.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block uppercase tracking-wider font-semibold text-[10px]">
                {lang === 'hi' ? 'खेत का स्थान' : 'Farm Location'}
              </span>
              <span className="font-bold text-stone-900">
                {currentAssessment.village}, {currentAssessment.district}
              </span>
            </div>
          </div>
        </div>

        {/* Scientific / Methodology Notice */}
        <div className="mb-8 p-3.5 rounded bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
          <Sparkles className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">
              {lang === 'hi' ? 'उपयुक्तता स्कोर (Suitability Score) की व्याख्या:' : 'Understanding Suitability Score:'}
            </span>{' '}
            {lang === 'hi'
              ? '0–100 स्कोर एक उत्पाद-परिभाषित निर्णय-सहायता स्कोर है, जो समय, मशीनरी अनुकूलता, दूरी और लागत नियमों पर आधारित है; यह कोई वैज्ञानिक रूप से मान्य संभावना या गारंटी नहीं है।'
              : 'The 0–100 score is a product-defined decision-support score based on multi-factor weighted rules (time window, machinery match, logistics distance, and operational cost); it is not a scientifically validated probability or guarantee.'}{' '}
            <span className="font-semibold text-agri-dark underline block sm:inline mt-1 sm:mt-0">
              {lang === 'hi'
                ? 'संरचित निर्णय इंजन पर आधारित प्रामाणिक व्याख्या।'
                : 'Grounded AI explanation based on structured decision-engine output.'}
            </span>
          </div>
        </div>

        {/* Section 1: Feasible Pathways Matrix */}
        <div className="mb-12">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-soil-charcoal flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-agri-primary" />
              <span>{lang === 'hi' ? 'कार्यान्वित करने योग्य विकल्प (Feasible Pathways)' : 'Feasible Pathways for Your Conditions'}</span>
            </h2>
            <span className="text-xs text-stone-500">
              {allFeasible.length} {lang === 'hi' ? 'विकल्प उपयुक्त पाए गए' : 'pathways meet all constraints'}
            </span>
          </div>

          {/* Desktop & Tablet Comparison Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-stone-300 bg-parchment-subtle shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-100 border-b border-stone-300">
                  <th className="p-3.5 font-bold text-stone-700 uppercase tracking-wider text-[11px] w-1/5">
                    {lang === 'hi' ? 'तुलना मापदंड' : 'Evaluation Criteria'}
                  </th>
                  {allFeasible.map((sp) => {
                    const isRec = sp.isRecommended;
                    const isSelected = selectedPathwayId === sp.pathway.id;
                    return (
                      <th
                        key={sp.pathway.id}
                        className={`p-3.5 align-top border-l border-stone-300 ${
                          isRec ? 'bg-emerald-50/70' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          {isRec ? (
                            <Badge variant="verified">
                              {lang === 'hi' ? '★ प्रणाली अनुशंसित #1' : '★ Recommended #1'}
                            </Badge>
                          ) : (
                            <Badge variant="neutral">
                              {lang === 'hi' ? 'सक्षम विकल्प' : 'Feasible Alternative'}
                            </Badge>
                          )}
                          {isSelected && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                              {lang === 'hi' ? 'वर्तमान चयन' : 'Active Plan'}
                            </span>
                          )}
                        </div>
                        <div className="font-serif font-bold text-sm text-soil-charcoal mt-1">
                          {lang === 'hi' ? sp.pathway.nameHi : sp.pathway.name}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {/* Row 1: Suitability Score */}
                <tr className="hover:bg-stone-50">
                  <td className="p-3.5 font-bold text-stone-700 bg-stone-50/70">
                    <div className="flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-stone-500" />
                      <span>{lang === 'hi' ? 'उपयुक्तता स्कोर (Suitability Score)' : 'Suitability Score'}</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block font-normal mt-0.5">
                      {lang === 'hi' ? '0–100 वेटेड स्कोर' : '0–100 Weighted Score'}
                    </span>
                  </td>
                  {allFeasible.map((sp) => (
                    <td key={sp.pathway.id} className="p-3.5 border-l border-stone-200">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold font-serif text-soil-charcoal">
                          {sp.suitabilityScore}
                        </span>
                        <span className="text-stone-500 text-xs">/ 100</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-2 mt-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            sp.suitabilityScore >= 80
                              ? 'bg-agri-primary'
                              : sp.suitabilityScore >= 65
                              ? 'bg-amber-600'
                              : 'bg-stone-500'
                          }`}
                          style={{ width: `${sp.suitabilityScore}%` }}
                        />
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Row 2: Estimated Cost */}
                <tr className="hover:bg-stone-50">
                  <td className="p-3.5 font-bold text-stone-700 bg-stone-50/70">
                    <div className="flex items-center gap-1.5">
                      <IndianRupee className="w-4 h-4 text-stone-500" />
                      <span>{lang === 'hi' ? 'अनुमानित परिचालन लागत' : 'Estimated Total Cost'}</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block font-normal mt-0.5">
                      {lang === 'hi' ? 'सरकारी दर मानक पर आधारित' : 'Based on CHC tariff benchmarks'}
                    </span>
                  </td>
                  {allFeasible.map((sp) => (
                    <td key={sp.pathway.id} className="p-3.5 border-l border-stone-200">
                      <div className="text-base font-bold text-stone-900 font-serif">
                        ₹{sp.estimatedCostTotalINR.toLocaleString('en-IN')}
                      </div>
                      <div className="text-stone-600 text-xs mt-0.5">
                        ₹{sp.estimatedCostPerAcreINR.toLocaleString('en-IN')} / {lang === 'hi' ? 'एकड़' : 'acre'}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Row 3: Turnaround & Time */}
                <tr className="hover:bg-stone-50">
                  <td className="p-3.5 font-bold text-stone-700 bg-stone-50/70">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-stone-500" />
                      <span>{lang === 'hi' ? 'कार्य निष्पादन अवधि' : 'Turnaround Days'}</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block font-normal mt-0.5">
                      {lang === 'hi' ? `उपलब्ध: ${currentAssessment.windowDays} दिन` : `Available: ${currentAssessment.windowDays} days`}
                    </span>
                  </td>
                  {allFeasible.map((sp) => {
                    const fits = sp.turnaroundDays <= currentAssessment.windowDays;
                    return (
                      <td key={sp.pathway.id} className="p-3.5 border-l border-stone-200">
                        <span className="font-bold text-stone-900 text-sm">
                          ~{sp.turnaroundDays} {lang === 'hi' ? 'दिन' : 'Days'}
                        </span>
                        <div className="mt-1">
                          {fits ? (
                            <span className="text-[11px] text-emerald-800 font-medium inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              {lang === 'hi' ? 'समय सीमा के अनुकूल' : 'Fits comfortably in window'}
                            </span>
                          ) : (
                            <span className="text-[11px] text-amber-700 font-medium inline-flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              {lang === 'hi' ? 'समय सीमा बेहद तंग' : 'Very tight window'}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Row 4: Required Machinery */}
                <tr className="hover:bg-stone-50">
                  <td className="p-3.5 font-bold text-stone-700 bg-stone-50/70">
                    <div className="flex items-center gap-1.5">
                      <Wrench className="w-4 h-4 text-stone-500" />
                      <span>{lang === 'hi' ? 'आवश्यक कृषि उपकरण' : 'Machinery Required'}</span>
                    </div>
                  </td>
                  {allFeasible.map((sp) => (
                    <td key={sp.pathway.id} className="p-3.5 border-l border-stone-200">
                      <div className="text-stone-800 font-medium">
                        {sp.pathway.compatibleMachinery
                          .map((m) => m.replace('_', ' ').toUpperCase())
                          .filter((m) => m !== 'NONE')
                          .join(', ')}
                      </div>
                      <span className="text-[10px] text-stone-500 block mt-1">
                        {sp.pathway.requiresChcIfNoMachinery
                          ? lang === 'hi'
                            ? 'कस्टम हायरिंग सेंटर (CHC) से किराए पर उपलब्ध'
                            : 'Available via local CHC hiring'
                          : lang === 'hi'
                          ? 'सामान्य ट्रैक्टर से संभव'
                          : 'Operable with standard tractor'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Row 5: Nearest Resource */}
                <tr className="hover:bg-stone-50">
                  <td className="p-3.5 font-bold text-stone-700 bg-stone-50/70">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-stone-500" />
                      <span>{lang === 'hi' ? 'नजदीकी केंद्र व दूरी' : 'Nearest Resource & Distance'}</span>
                    </div>
                  </td>
                  {allFeasible.map((sp) => (
                    <td key={sp.pathway.id} className="p-3.5 border-l border-stone-200">
                      {sp.nearestResource ? (
                        <div>
                          <div className="font-semibold text-stone-900">
                            {lang === 'hi' ? sp.nearestResource.nameHi : sp.nearestResource.name}
                          </div>
                          <div className="text-xs text-stone-600 mt-0.5">
                            📍 {lang === 'hi' ? 'दूरी लगभग' : 'Approx.'} {sp.distanceKm} km ({sp.nearestResource.village})
                          </div>
                        </div>
                      ) : (
                        <span className="text-stone-500 italic">
                          {lang === 'hi' ? '30 किमी के दायरे में कोई केंद्र नहीं' : 'No center within 30 km'}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Row 6: Key Advantages */}
                <tr className="hover:bg-stone-50">
                  <td className="p-3.5 font-bold text-stone-700 bg-stone-50/70">
                    {lang === 'hi' ? 'मुख्य लाभ' : 'Key Advantages'}
                  </td>
                  {allFeasible.map((sp) => (
                    <td key={sp.pathway.id} className="p-3.5 border-l border-stone-200">
                      <ul className="space-y-1">
                        {(lang === 'hi' ? sp.pathway.advantagesHi : sp.pathway.advantages).map((adv, idx) => (
                          <li key={idx} className="text-[11px] text-stone-700 flex items-start gap-1.5">
                            <span className="text-emerald-700 font-bold mt-0.5">✓</span>
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Row 7: Limitations */}
                <tr className="hover:bg-stone-50">
                  <td className="p-3.5 font-bold text-stone-700 bg-stone-50/70">
                    {lang === 'hi' ? 'सीमाएं एवं सावधानियां' : 'Operational Limitations'}
                  </td>
                  {allFeasible.map((sp) => (
                    <td key={sp.pathway.id} className="p-3.5 border-l border-stone-200">
                      <ul className="space-y-1">
                        {(lang === 'hi' ? sp.pathway.limitationsHi : sp.pathway.limitations).map((lim, idx) => (
                          <li key={idx} className="text-[11px] text-stone-600 flex items-start gap-1.5">
                            <span className="text-amber-700 font-bold mt-0.5">!</span>
                            <span>{lim}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Row 8: Selection Action */}
                <tr className="bg-stone-50">
                  <td className="p-3.5 font-bold text-stone-700">
                    {lang === 'hi' ? 'योजना चयन' : 'Plan Selection'}
                  </td>
                  {allFeasible.map((sp) => {
                    const isSelected = selectedPathwayId === sp.pathway.id;
                    return (
                      <td key={sp.pathway.id} className="p-3.5 border-l border-stone-200">
                        {isSelected ? (
                          <div className="w-full py-2 px-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded text-center font-bold text-xs flex items-center justify-center gap-1.5">
                            <Check className="w-4 h-4" />
                            <span>{lang === 'hi' ? 'वर्तमान में चयनित' : 'Active Selection'}</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSelectPathway(sp.pathway.id)}
                            className="w-full py-2 px-3 bg-soil-charcoal hover:bg-agri-dark text-parchment font-semibold text-xs rounded transition-colors text-center"
                          >
                            {lang === 'hi' ? 'इस विकल्प को चुनें' : 'Select This Pathway'}
                          </button>
                        )}
                        <Link
                          to="/resources"
                          className="mt-2 block text-center text-[11px] text-agri-primary hover:underline font-medium"
                        >
                          {lang === 'hi' ? 'संबंधित केंद्र देखें →' : 'Find centers for this →'}
                        </Link>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards Layout (< 768px) */}
          <div className="md:hidden space-y-5">
            {allFeasible.map((sp) => {
              const isRec = sp.isRecommended;
              const isSelected = selectedPathwayId === sp.pathway.id;
              return (
                <div
                  key={sp.pathway.id}
                  className={`p-5 rounded-lg border shadow-sm ${
                    isRec
                      ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-300/60'
                      : 'bg-parchment-subtle border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {isRec ? (
                      <Badge variant="verified">
                        {lang === 'hi' ? '★ प्रणाली अनुशंसित #1' : '★ Recommended #1'}
                      </Badge>
                    ) : (
                      <Badge variant="neutral">
                        {lang === 'hi' ? 'सक्षम विकल्प' : 'Feasible Option'}
                      </Badge>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-stone-500">{lang === 'hi' ? 'स्कोर:' : 'Score:'}</span>
                      <span className="text-lg font-serif font-bold text-soil-charcoal">
                        {sp.suitabilityScore}/100
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-soil-charcoal mb-3">
                    {lang === 'hi' ? sp.pathway.nameHi : sp.pathway.name}
                  </h3>

                  {/* Key Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-stone-100 p-3 rounded mb-3 border border-stone-200">
                    <div>
                      <span className="text-stone-500 block text-[10px] uppercase font-semibold">
                        {lang === 'hi' ? 'कुल अनुमानित लागत' : 'Estimated Cost'}
                      </span>
                      <span className="font-bold text-stone-900">
                        ₹{sp.estimatedCostTotalINR.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        ₹{sp.estimatedCostPerAcreINR}/acre
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[10px] uppercase font-semibold">
                        {lang === 'hi' ? 'अवधि' : 'Turnaround'}
                      </span>
                      <span className="font-bold text-stone-900">
                        ~{sp.turnaroundDays} {lang === 'hi' ? 'दिन' : 'Days'}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-medium block">
                        {sp.turnaroundDays <= currentAssessment.windowDays
                          ? lang === 'hi' ? '✓ समय सीमा में' : '✓ Fits in window'
                          : lang === 'hi' ? '! तंग समय' : '! Tight window'}
                      </span>
                    </div>
                  </div>

                  {/* Nearest Resource */}
                  {sp.nearestResource && (
                    <div className="text-xs text-stone-700 mb-3 p-2.5 rounded bg-white border border-stone-200">
                      <div className="font-semibold text-stone-900">
                        📍 {lang === 'hi' ? sp.nearestResource.nameHi : sp.nearestResource.name}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {lang === 'hi' ? 'दूरी लगभग' : 'Approx.'} {sp.distanceKm} km ({sp.nearestResource.village})
                      </div>
                    </div>
                  )}

                  {/* Advantages Summary */}
                  <div className="mb-4">
                    <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                      {lang === 'hi' ? 'मुख्य लाभ:' : 'Key Advantages:'}
                    </span>
                    <ul className="space-y-1">
                      {(lang === 'hi' ? sp.pathway.advantagesHi : sp.pathway.advantages).slice(0, 2).map((adv, idx) => (
                        <li key={idx} className="text-xs text-stone-700 flex items-start gap-1.5">
                          <span className="text-emerald-700 font-bold">✓</span>
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2 border-t border-stone-200">
                    {isSelected ? (
                      <div className="w-full py-2 px-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded text-center font-bold text-xs flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4" />
                        <span>{lang === 'hi' ? 'वर्तमान में चयनित' : 'Active Selection'}</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSelectPathway(sp.pathway.id)}
                        className="w-full py-2.5 px-3 bg-soil-charcoal hover:bg-agri-dark text-parchment font-semibold text-xs rounded transition-colors text-center"
                      >
                        {lang === 'hi' ? 'इस विकल्प को चुनें' : 'Select This Pathway'}
                      </button>
                    )}
                    <Link
                      to="/resources"
                      className="block text-center text-xs text-agri-primary hover:underline font-medium"
                    >
                      {lang === 'hi' ? 'संबंधित नजदीकी केंद्र खोजें →' : 'Find centers for this →'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Excluded / Infeasible Pathways */}
        {excludedPathways.length > 0 && (
          <div className="mt-8 pt-8 border-t border-stone-300">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <h2 className="text-lg sm:text-xl font-serif font-bold text-soil-charcoal">
                {lang === 'hi'
                  ? 'वर्तमान परिस्थितियों में अनुपयुक्त विकल्प (Infeasible Pathways)'
                  : 'Pathways Infeasible for Your Field Conditions'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mb-5 max-w-3xl">
              {lang === 'hi'
                ? 'निर्णय इंजन ने कठोर बाधाओं (न्यूनतम समय खिड़की, फसल अनुकूलता या उपकरण दूरी) के कारण निम्नलिखित विकल्पों को बाहर कर दिया है:'
                : 'The deterministic decision engine ruled out the following pathways due to hard operational constraints (such as minimum decomposition days or machinery distance limits):'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {excludedPathways.map((ep) => (
                <div
                  key={ep.pathway.id}
                  className="p-4 rounded-lg bg-stone-100/90 border border-stone-300/80 text-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-serif font-bold text-sm text-stone-800">
                      {lang === 'hi' ? ep.pathway.nameHi : ep.pathway.name}
                    </span>
                    <Badge variant="urgent">
                      {lang === 'hi' ? 'अनुपयुक्त / बाहर' : 'Excluded'}
                    </Badge>
                  </div>
                  <div className="mt-2 p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-900">
                    <span className="font-bold block mb-0.5">
                      {lang === 'hi' ? 'अस्वीकृति का सटीक कारण:' : 'Exact Exclusion Constraint:'}
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      {lang === 'hi' ? ep.exclusionReasonHi : ep.exclusionReason}
                    </p>
                  </div>
                  <div className="mt-2 text-[11px] text-stone-500">
                    <span className="font-medium">{lang === 'hi' ? 'प्रकृति:' : 'Profile:'}</span>{' '}
                    {lang === 'hi' ? ep.pathway.descriptionHi : ep.pathway.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Call to Action Bar */}
        <div className="mt-12 p-6 rounded-lg bg-parchment-subtle border border-stone-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-serif font-bold text-soil-charcoal">
              {lang === 'hi' ? 'संतुष्ट हैं? आगे बढ़ें:' : 'Ready to proceed with your chosen pathway?'}
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              {lang === 'hi'
                ? 'नक्शे पर नजदीकी कस्टम हायरिंग सेंटर देखें और कार्य योजना तैयार करें।'
                : 'Locate local machinery centers on the map or proceed directly to your operational checklist.'}
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="primary"
              className="w-full sm:w-auto"
              onClick={() => navigate('/resources')}
            >
              {lang === 'hi' ? 'नक्शा व मशीनरी केंद्र देखें →' : 'View Machinery Map & Centres →'}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};
