import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LeafletMap } from '../components/map/LeafletMap';
import { useAssessment } from '../context/AssessmentContext';
import { useLanguage } from '../context/LanguageContext';
import { SEED_RESOURCES, DISTRICT_CENTROIDS, calculateDistanceKm } from '../data/seedResources';
import { SEED_PATHWAYS } from '../data/seedPathways';
import { REGIONAL_DISTRICTS } from '../types';
import {
  MapPin,
  Search,
  Phone,
  Check,
  ArrowRight,
  RefreshCw,
  Building2,
  Tractor,
  ArrowLeft,
  Info
} from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const { language } = useLanguage();
  const lang = language;
  const { currentAssessment, selectedPathwayId, selectedResourceId, setSelectedResourceId, saveAssessment } = useAssessment();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(currentAssessment?.district || 'all');
  const [onlyMatchingPathway, setOnlyMatchingPathway] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [focusResourceId, setFocusResourceId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'split' | 'map' | 'list'>('split');

  // Fallback demo assessment if none exists
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

  // Farmer Reference Coordinates
  const farmerDistrict = currentAssessment?.district || 'Karnal';
  const farmCoordinates = DISTRICT_CENTROIDS[farmerDistrict] || DISTRICT_CENTROIDS['Karnal'];
  const farmLabel = currentAssessment ? `${currentAssessment.village}, ${currentAssessment.district}` : 'Taraori, Karnal';
  const farmLabelHi = currentAssessment ? `${currentAssessment.village}, ${currentAssessment.district}` : 'तरावड़ी, करनाल';

  // Active Selected Pathway Definition
  const activePathway = useMemo(() => {
    return SEED_PATHWAYS.find((p) => p.id === selectedPathwayId) || SEED_PATHWAYS[0];
  }, [selectedPathwayId]);

  // Filter Resources with Distance Computation
  const filteredResources = useMemo(() => {
    return SEED_RESOURCES.filter((res) => {
      // 1. Pathway filter
      if (onlyMatchingPathway && selectedPathwayId) {
        if (!res.supportedPathways.includes(selectedPathwayId)) return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'all' && res.type !== selectedCategory) {
        return false;
      }

      // 3. District filter
      if (selectedDistrict !== 'all' && res.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
        return false;
      }

      // 4. Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = res.name.toLowerCase().includes(q) || res.nameHi.includes(q);
        const matchesVillage = res.village.toLowerCase().includes(q) || res.district.toLowerCase().includes(q);
        const matchesEquip = res.equipmentAvailable.some((e) => e.toLowerCase().includes(q));
        if (!matchesName && !matchesVillage && !matchesEquip) return false;
      }

      return true;
    }).map((res) => {
      const distanceKm = calculateDistanceKm(farmCoordinates, res.coordinates);
      return { ...res, calculatedDistanceKm: distanceKm };
    }).sort((a, b) => a.calculatedDistanceKm - b.calculatedDistanceKm);
  }, [selectedCategory, selectedDistrict, onlyMatchingPathway, selectedPathwayId, searchQuery, farmCoordinates]);

  // Selected Resource Entity
  const currentSelectedResource = useMemo(() => {
    return SEED_RESOURCES.find((r) => r.id === selectedResourceId);
  }, [selectedResourceId]);

  const handleSelectResource = (id: string) => {
    setSelectedResourceId(id);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedDistrict('all');
    setOnlyMatchingPathway(false);
    setSearchQuery('');
  };

  return (
    <div className="py-8 bg-parchment min-h-screen">
      <Container>
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-300">
          <div className="flex items-center gap-2">
            <Link
              to="/recommendation"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-agri-dark transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'सिफारिश पर वापस' : 'Back to Recommendation'}</span>
            </Link>
            <span className="text-stone-300">/</span>
            <Link
              to="/compare"
              className="text-xs font-semibold text-stone-600 hover:text-agri-dark transition-colors"
            >
              {lang === 'hi' ? 'तुलना मैट्रिक्स' : 'Comparison Matrix'}
            </Link>
            <span className="text-stone-300">/</span>
            <span className="text-xs font-bold text-agri-dark">
              {lang === 'hi' ? 'मशीनरी केंद्र व नक्शा' : 'Nearby Resources & Map'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/action-plan">
              <Button variant="primary" size="sm" className="inline-flex items-center gap-1.5">
                <span>{lang === 'hi' ? 'कार्य योजना पर जाएं' : 'Proceed to Action Plan'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Header Title */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="neutral">
              Phase 4 • {lang === 'hi' ? 'भौगोलिक संसाधन निर्देशिका' : 'Spatial Resource Directory'}
            </Badge>
            <Badge variant="verified">
              {lang === 'hi' ? 'ओपनस्ट्रीटमैप लाइव लेयर' : 'OpenStreetMap Live Map'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-soil-charcoal tracking-tight">
            {lang === 'hi'
              ? 'नजदीकी मशीनरी व कस्टम हायरिंग सेंटर'
              : 'Nearby Machinery & Custom Hiring Centres'}
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-stone-600 max-w-3xl">
            {lang === 'hi'
              ? 'अपने चयनित प्रबंधन विकल्प के लिए नजदीकी सहकारी कस्टम हायरिंग सेंटर (CHC), निजी बेलर संचालक और बायोमास केंद्र खोजें।'
              : 'Interactive map and directory of local CHCs, baler contractors, and biomass hubs supporting your chosen residue management pathway.'}
          </p>

          {!currentAssessment && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2">
              <span>
                {lang === 'hi'
                  ? 'वर्तमान में कोई सक्रिय खेत आकलन नहीं है। करनाल डेमो डेटा का उपयोग किया जा रहा है।'
                  : 'Viewing with default regional sample coordinates (Karnal, Haryana). Complete an assessment for precise distances.'}
              </span>
              <button
                type="button"
                onClick={handleLoadDemoAssessment}
                className="px-2.5 py-1 bg-amber-700 text-white rounded font-medium hover:bg-amber-800 transition-colors"
              >
                {lang === 'hi' ? 'डेमो डेटा लोड करें' : 'Load Demo Profile'}
              </button>
            </div>
          )}
        </div>

        {/* Selected Pathway & Farm Context Strip */}
        <div className="mb-6 p-4 rounded-lg bg-stone-100 border border-stone-300 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <span className="text-stone-500 block uppercase tracking-wider font-semibold text-[10px]">
                {lang === 'hi' ? 'खेत का संदर्भ स्थान' : 'Farm Reference Centroid'}
              </span>
              <span className="font-bold text-stone-900 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                {farmLabel}
              </span>
            </div>

            <div className="h-8 w-px bg-stone-300 hidden md:block" />

            <div>
              <span className="text-stone-500 block uppercase tracking-wider font-semibold text-[10px]">
                {lang === 'hi' ? 'वर्तमान में सक्रिय विकल्प' : 'Active Management Pathway'}
              </span>
              <span className="font-bold text-stone-900 flex items-center gap-1">
                <Tractor className="w-3.5 h-3.5 text-agri-primary" />
                {lang === 'hi' ? activePathway.nameHi : activePathway.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/compare"
              className="text-xs font-semibold text-agri-primary hover:underline"
            >
              {lang === 'hi' ? 'विकल्प बदलें →' : 'Change Pathway →'}
            </Link>
          </div>
        </div>

        {/* Currently Selected Resource Banner */}
        {currentSelectedResource ? (
          <div className="mb-6 p-3.5 rounded-lg bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                ✓
              </span>
              <div>
                <span className="font-bold">
                  {lang === 'hi' ? 'कार्य योजना के लिए चयनित केंद्र:' : 'Active Resource Selected for Action Plan:'}
                </span>{' '}
                <span className="font-serif font-bold text-sm">
                  {lang === 'hi' ? currentSelectedResource.nameHi : currentSelectedResource.name}
                </span>{' '}
                <span className="text-stone-600">
                  ({currentSelectedResource.village}, {currentSelectedResource.district})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-banner-view-map="true"
                onClick={() => {
                  setOnlyMatchingPathway(false);
                  setSelectedCategory('all');
                  setSelectedDistrict('all');
                  setFocusResourceId(currentSelectedResource.id);
                }}
                className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-400 rounded font-semibold transition-colors"
              >
                {lang === 'hi' ? 'नक्शे पर देखें' : 'View on Map'}
              </button>
              <Link to="/action-plan">
                <button
                  type="button"
                  className="px-3 py-1 bg-agri-dark hover:bg-agri-primary text-parchment rounded font-semibold transition-colors"
                >
                  {lang === 'hi' ? 'चेकलिस्ट खोलें →' : 'Open Checklist →'}
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-3 rounded-lg bg-stone-100 border border-stone-200 flex items-center gap-2 text-xs text-stone-600">
            <Info className="w-4 h-4 text-stone-500 flex-shrink-0" />
            <span>
              {lang === 'hi'
                ? 'कृपया नीचे दी गई सूची अथवा नक्शे से अपनी कार्य योजना के लिए उपयुक्त मशीनरी केंद्र का चयन करें।'
                : 'Please select a machinery center or baler from the directory or map to link with your field action plan.'}
            </span>
          </div>
        )}

        {/* Filters & Search Control Bar */}
        <div className="mb-6 p-4 rounded-lg bg-parchment-subtle border border-stone-300 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === 'hi'
                    ? 'केंद्र का नाम, गांव या मशीनरी खोजें (जैसे Happy Seeder, Baler)...'
                    : 'Search by center name, village, or equipment (e.g. Happy Seeder, Baler)...'
                }
                className="w-full pl-9 pr-3 py-2 text-xs rounded border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-agri-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* District Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-stone-600 whitespace-nowrap">
                {lang === 'hi' ? 'जिला:' : 'District:'}
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="py-1.5 px-2.5 text-xs rounded border border-stone-300 bg-white font-medium focus:outline-none focus:ring-1 focus:ring-agri-primary"
              >
                <option value="all">{lang === 'hi' ? 'सभी क्षेत्रीय जिले (All)' : 'All Regional Districts'}</option>
                {REGIONAL_DISTRICTS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {lang === 'hi' ? d.labelHi : d.label} ({d.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filter Pills & Pathway Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mr-1">
                {lang === 'hi' ? 'श्रेणी:' : 'Category:'}
              </span>
              {[
                { id: 'all', label: 'All Resources', labelHi: 'सभी प्रकार' },
                { id: 'chc', label: 'CHCs', labelHi: 'कस्टम हायरिंग सेंटर' },
                { id: 'baler_operator', label: 'Baler Operators', labelHi: 'बेलर संचालक' },
                { id: 'biomass_aggregator', label: 'Biomass Hubs', labelHi: 'बायोमास केंद्र' },
                { id: 'pellet_plant', label: 'Pellet Plants', labelHi: 'पैलेट संयंत्र' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors border ${
                    selectedCategory === tab.id
                      ? 'bg-agri-dark text-parchment border-agri-dark'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-300'
                  }`}
                >
                  {lang === 'hi' ? tab.labelHi : tab.label}
                </button>
              ))}
            </div>

            {/* Pathway match toggle */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs text-stone-700">
                <input
                  type="checkbox"
                  checked={onlyMatchingPathway}
                  onChange={(e) => setOnlyMatchingPathway(e.target.checked)}
                  className="rounded border-stone-300 text-agri-primary focus:ring-agri-primary w-3.5 h-3.5"
                />
                <span>
                  {lang === 'hi'
                    ? 'केवल चयनित विकल्प के अनुकूल केंद्र'
                    : 'Filter by Active Pathway'}
                </span>
              </label>

              {(selectedCategory !== 'all' || selectedDistrict !== 'all' || !onlyMatchingPathway || searchQuery) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-[11px] text-amber-800 hover:underline font-semibold ml-2"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{lang === 'hi' ? 'रीसेट' : 'Reset'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile View Mode Switcher (Visible on < 1024px) */}
        <div className="lg:hidden flex rounded border border-stone-300 p-1 bg-stone-100 mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMobileTab('split')}
            className={`flex-1 py-1.5 text-center rounded transition-colors ${
              mobileTab === 'split' ? 'bg-white shadow text-agri-dark' : 'text-stone-600'
            }`}
          >
            {lang === 'hi' ? 'नक्शा + सूची' : 'Map & List'}
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('map')}
            className={`flex-1 py-1.5 text-center rounded transition-colors ${
              mobileTab === 'map' ? 'bg-white shadow text-agri-dark' : 'text-stone-600'
            }`}
          >
            {lang === 'hi' ? 'केवल नक्शा' : 'Map Only'}
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('list')}
            className={`flex-1 py-1.5 text-center rounded transition-colors ${
              mobileTab === 'list' ? 'bg-white shadow text-agri-dark' : 'text-stone-600'
            }`}
          >
            {lang === 'hi' ? `केवल सूची (${filteredResources.length})` : `List Only (${filteredResources.length})`}
          </button>
        </div>

        {/* Main Dual Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Top Column: Leaflet Map */}
          <div
            className={`lg:col-span-6 xl:col-span-7 ${
              mobileTab === 'list' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="sticky top-20">
              <LeafletMap
                resources={filteredResources}
                farmCentroid={farmCoordinates}
                farmLabel={farmLabel}
                farmLabelHi={farmLabelHi}
                selectedResourceId={selectedResourceId}
                focusResourceId={focusResourceId}
                onSelectResource={handleSelectResource}
                heightClass="h-[440px] md:h-[520px] lg:h-[620px]"
              />

              <div className="mt-2.5 px-3 py-2 bg-stone-100 rounded border border-stone-300 text-[11px] text-stone-600 flex items-center justify-between">
                <span>
                  {lang === 'hi'
                    ? 'संकेत: केंद्र की पूरी जानकारी देखने या चयन करने के लिए नक्शे के पिन पर क्लिक करें।'
                    : 'Tip: Click any marker to view equipment details, rates, and select for your action plan.'}
                </span>
                <span className="font-semibold text-agri-dark">
                  {filteredResources.length} {lang === 'hi' ? 'केंद्र प्रदर्शित' : 'locations shown'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Filtered Resource Directory Cards */}
          <div
            className={`lg:col-span-6 xl:col-span-5 space-y-4 ${
              mobileTab === 'map' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-300">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-700">
                {lang === 'hi' ? 'उपलब्ध केंद्र एवं ऑपरेटर' : 'Available Centres & Operators'} (
                {filteredResources.length})
              </div>
              <span className="text-[11px] text-stone-500">
                {lang === 'hi' ? 'न्यूनतम दूरी के आधार पर क्रमित' : 'Sorted by nearest distance'}
              </span>
            </div>

            {/* Empty State */}
            {filteredResources.length === 0 ? (
              <div className="p-8 rounded-lg border border-dashed border-stone-300 bg-parchment-subtle text-center">
                <Building2 className="w-10 h-10 mx-auto text-stone-400 mb-2" />
                <h4 className="font-serif font-bold text-soil-charcoal text-base">
                  {lang === 'hi' ? 'कोई केंद्र नहीं मिला' : 'No Matching Resources Found'}
                </h4>
                <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
                  {lang === 'hi'
                    ? 'वर्तमान खोज फ़िल्टर में कोई मशीनरी केंद्र उपलब्ध नहीं है। कृपया फ़िल्टर रीसेट करें या सभी जिलों का चयन करें।'
                    : 'No machinery centers or balers match your current criteria. Try selecting "All Districts" or expanding your pathway filter.'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="mt-4"
                >
                  {lang === 'hi' ? 'सभी फ़िल्टर साफ़ करें' : 'Reset All Filters'}
                </Button>
              </div>
            ) : (
              /* Resource Cards List */
              <div className="space-y-3.5 max-h-[720px] overflow-y-auto pr-1">
                {filteredResources.map((res) => {
                  const isSelected = selectedResourceId === res.id;
                  const isPublic = res.verificationStatus === 'verified_public';

                  let categoryLabel = 'Machinery Centre';
                  if (res.type === 'chc') categoryLabel = lang === 'hi' ? 'कस्टम हायरिंग सेंटर' : 'CHC Machinery Bank';
                  if (res.type === 'baler_operator') categoryLabel = lang === 'hi' ? 'बेलर ऑपरेटर' : 'Baler Operator';
                  if (res.type === 'biomass_aggregator') categoryLabel = lang === 'hi' ? 'बायोमास संग्रह केंद्र' : 'Biomass Aggregator';
                  if (res.type === 'pellet_plant') categoryLabel = lang === 'hi' ? 'बायो-पैलेट संयंत्र' : 'Bio-Pellet Plant';

                  return (
                    <div
                      key={res.id}
                      className={`p-4 rounded-lg border transition-all shadow-sm ${
                        isSelected
                          ? 'bg-emerald-50/50 border-emerald-400 ring-2 ring-emerald-400/40'
                          : 'bg-white border-stone-300 hover:border-stone-400'
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-agri-primary">
                              {categoryLabel}
                            </span>
                            <span className="text-stone-300">•</span>
                            {isPublic ? (
                              <span className="inline-block px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                                {lang === 'hi' ? 'सत्यापित सार्वजनिक केंद्र' : 'Verified Public Listing'}
                              </span>
                            ) : (
                              <span className="inline-block px-1.5 py-0.2 rounded bg-stone-100 text-stone-700 text-[10px] font-semibold border border-stone-300">
                                {lang === 'hi' ? 'डेमो संसाधन (नमूना)' : 'Demo Resource (Sample)'}
                              </span>
                            )}
                          </div>
                          <h3 className="font-serif font-bold text-sm sm:text-base text-soil-charcoal">
                            {lang === 'hi' ? res.nameHi : res.name}
                          </h3>
                        </div>

                        {/* Approx Distance Badge */}
                        <div className="text-right flex-shrink-0">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <MapPin className="w-3 h-3" />
                            <span>~{res.calculatedDistanceKm} km</span>
                          </span>
                          <span className="block text-[9px] text-stone-400 mt-0.5">
                            {lang === 'hi' ? 'अनुमानित दूरी' : 'approx. distance'}
                          </span>
                        </div>
                      </div>

                      {/* Location details */}
                      <div className="text-xs text-stone-600 mb-2 flex items-center gap-1">
                        <span>📍</span>
                        <span>
                          {res.village}, {res.district}, {res.state}
                        </span>
                      </div>

                      {/* Equipment List */}
                      <div className="mb-2.5">
                        <span className="text-[10px] uppercase font-bold text-stone-500 block mb-1">
                          {lang === 'hi' ? 'उपलब्ध कृषि यंत्र:' : 'Available Machinery:'}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {(lang === 'hi' ? res.equipmentAvailableHi : res.equipmentAvailable).map((eq, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200"
                            >
                              {eq}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Benchmark Rate */}
                      <div className="p-2 rounded bg-stone-50 border border-stone-200 text-xs mb-3 text-stone-700">
                        <span className="font-bold text-stone-900">
                          {lang === 'hi' ? 'दर मानक:' : 'Benchmark Tariff:'}
                        </span>{' '}
                        <span>{res.baseRateBenchmark}</span>
                      </div>

                      {/* Contact Phone & Actions */}
                      <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div>
                          {res.contactPhone ? (
                            <div className="flex items-center gap-1 text-agri-dark font-medium">
                              <Phone className="w-3.5 h-3.5 text-agri-primary" />
                              <a
                                href={`tel:${res.contactPhone}`}
                                className="font-bold hover:underline"
                              >
                                {res.contactPhone}
                              </a>
                              <span className="text-[10px] text-stone-500">
                                ({res.contactPerson})
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-stone-500 italic">
                              {lang === 'hi'
                                ? 'डेमो डेटासेट में संपर्क उपलब्ध नहीं'
                                : 'Contact info not available in demo dataset'}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            data-card-view-map={res.id}
                            onClick={() => setFocusResourceId(res.id)}
                            className="text-[11px] font-semibold text-stone-600 hover:text-stone-900 underline px-1.5 py-1"
                          >
                            {lang === 'hi' ? 'नक्शे पर देखें' : 'View on Map'}
                          </button>

                          {isSelected ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-300">
                              <Check className="w-3.5 h-3.5" />
                              <span>{lang === 'hi' ? 'चयनित' : 'Selected'}</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSelectResource(res.id)}
                              className="px-3 py-1 bg-soil-charcoal hover:bg-agri-dark text-parchment rounded font-semibold text-xs transition-colors"
                            >
                              {lang === 'hi' ? 'योजना हेतु चुनें' : 'Select Resource'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Disclaimer on tariffs */}
            <div className="p-3 rounded bg-stone-100/90 border border-stone-300/80 text-[11px] text-stone-500 leading-relaxed">
              <span className="font-bold text-stone-700">
                {lang === 'hi' ? 'महत्वपूर्ण सूचना:' : 'Operational Notice:'}
              </span>{' '}
              {lang === 'hi'
                ? 'प्रदर्शित दरें और मशीनरी उपलब्धता राज्य कृषि विभाग के दिशा-निर्देशों पर आधारित संदर्भ मानक हैं। खेत में कार्य शुरू करने से पहले केंद्र संचालक से सीधे संपर्क कर उपलब्धता की पुष्टि करें।'
                : 'Tariffs and equipment listed are reference benchmarks derived from state agricultural department guidelines and regional surveys. Always verify machine availability and booking schedules directly with the operator before harvest operations.'}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
