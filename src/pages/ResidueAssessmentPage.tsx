import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAssessment, calculateWindowDays } from '../context/AssessmentContext';
import { 
  CropType, 
  FarmerPriority, 
  MachineryOwned, 
  REGIONAL_DISTRICTS 
} from '../types';
import { 
  Clock, 
  Wheat, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft
} from 'lucide-react';
import { Container } from '../components/ui/Container';

export const ResidueAssessmentPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { currentUser } = useAuth();
  const { saveAssessment } = useAssessment();
  const navigate = useNavigate();

  // Helper dates (default: harvest 2 days ago, sowing in 12 days)
  const defaultHarvestDate = new Date();
  defaultHarvestDate.setDate(defaultHarvestDate.getDate() - 1);
  const defaultHarvestStr = defaultHarvestDate.toISOString().split('T')[0];

  const defaultSowingDate = new Date();
  defaultSowingDate.setDate(defaultSowingDate.getDate() + 11);
  const defaultSowingStr = defaultSowingDate.toISOString().split('T')[0];

  // Form State initialized with realistic demo baseline
  const [crop, setCrop] = useState<CropType>('paddy');
  const [customCropName, setCustomCropName] = useState('');
  const [acreage, setAcreage] = useState<string>(currentUser.acreage ? String(currentUser.acreage) : '8');
  const [residueTonnes, setResidueTonnes] = useState<string>(
    currentUser.defaultResidueTonnes ? String(currentUser.defaultResidueTonnes) : '5.0'
  );
  const [state, setState] = useState(currentUser.location.state || 'Haryana');
  const [district, setDistrict] = useState(currentUser.location.district || 'Karnal');
  const [village, setVillage] = useState(currentUser.location.village || 'Taraori Rural');
  const [harvestDate, setHarvestDate] = useState(defaultHarvestStr);
  const [sowingDate, setSowingDate] = useState(defaultSowingStr);
  const [machineryOwned, setMachineryOwned] = useState<MachineryOwned>('none');
  const [machineryDetails, setMachineryDetails] = useState('');
  const [farmerPriority, setFarmerPriority] = useState<FarmerPriority>('lowest_cost');

  // Inline Validation Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic window calculation
  const windowDays = calculateWindowDays(harvestDate, sowingDate);
  const isTightWindow = windowDays > 0 && windowDays <= 10;

  // Auto-recalculate estimated residue when acreage or crop changes
  const handleAcreageChange = (newAcreage: string) => {
    setAcreage(newAcreage);
    const num = parseFloat(newAcreage);
    if (!isNaN(num) && num > 0) {
      const multiplier = crop === 'paddy' ? 2.5 : crop === 'sugarcane' ? 3.5 : crop === 'wheat' ? 1.8 : 2.0;
      setResidueTonnes((num * (multiplier * 0.25)).toFixed(1)); // Realistic straw estimate
    }
  };

  const handleCropChange = (newCrop: CropType) => {
    setCrop(newCrop);
    const num = parseFloat(acreage);
    if (!isNaN(num) && num > 0) {
      const multiplier = newCrop === 'paddy' ? 2.5 : newCrop === 'sugarcane' ? 3.5 : newCrop === 'wheat' ? 1.8 : 2.0;
      setResidueTonnes((num * (multiplier * 0.25)).toFixed(1));
    }
  };

  // Filter districts based on selected state
  const availableDistricts = REGIONAL_DISTRICTS.filter(d => d.state === state);

  // Validate form
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    // Residue quantity validation
    const residueNum = parseFloat(residueTonnes);
    if (isNaN(residueNum) || residueNum <= 0) {
      errs.residueTonnes = t('errorResiduePositive');
    }

    // Acreage validation
    const acreageNum = parseFloat(acreage);
    if (isNaN(acreageNum) || acreageNum <= 0) {
      errs.acreage = t('errorAcreagePositive');
    }

    // Location validation
    if (!state.trim()) {
      errs.state = t('errorStateRequired');
    }
    if (!district.trim()) {
      errs.district = t('errorDistrictRequired');
    }
    if (!village.trim()) {
      errs.village = t('errorVillageRequired');
    }

    // Dates validation
    if (!harvestDate) {
      errs.harvestDate = t('errorHarvestDateRequired');
    }
    if (!sowingDate) {
      errs.sowingDate = t('errorSowingDateRequired');
    }
    if (harvestDate && sowingDate) {
      const harvestTime = new Date(harvestDate).getTime();
      const sowingTime = new Date(sowingDate).getTime();
      if (sowingTime < harvestTime) {
        errs.sowingDate = t('errorSowingBeforeHarvest');
      } else if (sowingTime === harvestTime || windowDays <= 0) {
        errs.sowingDate = t('errorWindowTooShort');
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll to first error on mobile
      const firstError = document.querySelector('[aria-invalid="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Save properly typed assessment into state & localStorage
    const saved = saveAssessment({
      crop,
      customCropName: crop === 'other' ? customCropName : undefined,
      residueTonnes: parseFloat(residueTonnes),
      acreage: parseFloat(acreage),
      state,
      district,
      village,
      harvestDate,
      sowingDate,
      machineryOwned,
      machineryDetails: machineryDetails.trim() || undefined,
      farmerPriority,
    });

    // Navigate to operational solver screen (Phase 3 destination)
    navigate('/analyzing', { state: { assessmentId: saved.id } });
  };

  return (
    <div className="py-8 sm:py-12">
      <Container size="md">
        {/* Editorial Header */}
        <div className="border-b border-field-border pb-6 mb-8">
          <div className="flex items-center space-x-2 text-xs font-mono text-soil-500 uppercase tracking-wider mb-1.5">
            <Wheat className="w-3.5 h-3.5 text-agri-forest" />
            <span>Field Assessment Protocol #2026</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-soil-900 tracking-tight">
            {t('assessPageTitle')}
          </h1>
          <p className="text-sm text-soil-600 font-sans mt-2 max-w-2xl leading-relaxed">
            {t('assessPageSubtitle')}
          </p>
        </div>

        {/* Assessment Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          {/* SECTION 1: CROP & RESIDUE VOLUME */}
          <div className="bg-parchment-100 border border-field-border p-6 rounded-xs shadow-ledger">
            <div className="border-b border-field-border pb-3 mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-soil-900">
                  {t('formSection1Title')}
                </h2>
                <p className="text-xs text-soil-600 font-sans mt-0.5">
                  {t('formSection1Desc')}
                </p>
              </div>
              <span className="font-mono text-xs text-soil-400">Step 01 / 04</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Crop Selector */}
              <div>
                <label htmlFor="crop" className="block text-xs font-mono font-semibold text-soil-800 uppercase mb-1.5">
                  {t('cropLabel')} *
                </label>
                <select
                  id="crop"
                  value={crop}
                  onChange={(e) => handleCropChange(e.target.value as CropType)}
                  className="w-full bg-parchment-50 border border-field-border px-3.5 py-2.5 text-sm text-soil-900 rounded-xs focus-visible:outline-agri-forest"
                >
                  <option value="paddy">Paddy / धान (Basmati / PR)</option>
                  <option value="wheat">Wheat / गेहूं</option>
                  <option value="sugarcane">Sugarcane / गन्ना (Trash & Ratoon)</option>
                  <option value="maize">Maize / मक्का (Stover)</option>
                  <option value="other">Other Crop / अन्य फसल</option>
                </select>
              </div>

              {/* Custom Crop Name if 'other' */}
              {crop === 'other' && (
                <div>
                  <label htmlFor="customCropName" className="block text-xs font-mono font-semibold text-soil-800 uppercase mb-1.5">
                    {t('customCropLabel')} *
                  </label>
                  <input
                    type="text"
                    id="customCropName"
                    value={customCropName}
                    onChange={(e) => setCustomCropName(e.target.value)}
                    placeholder="e.g. Cotton, Mustard"
                    className="w-full bg-parchment-50 border border-field-border px-3.5 py-2.5 text-sm text-soil-900 rounded-xs focus-visible:outline-agri-forest"
                  />
                </div>
              )}

              {/* Acreage */}
              <div>
                <label htmlFor="acreage" className="block text-xs font-mono font-semibold text-soil-800 uppercase mb-1.5">
                  {t('acreageLabel')} *
                </label>
                <input
                  type="number"
                  id="acreage"
                  min="0.5"
                  step="0.5"
                  value={acreage}
                  onChange={(e) => handleAcreageChange(e.target.value)}
                  aria-invalid={!!errors.acreage}
                  className={`w-full bg-parchment-50 border px-3.5 py-2.5 text-sm text-soil-900 rounded-xs focus-visible:outline-agri-forest ${
                    errors.acreage ? 'border-deep-clay bg-clay-light/20' : 'border-field-border'
                  }`}
                />
                {errors.acreage ? (
                  <p className="text-xs text-deep-clay mt-1 font-sans flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                    {errors.acreage}
                  </p>
                ) : (
                  <p className="text-[11px] text-soil-500 font-sans mt-1">
                    {t('acreageHelper')}
                  </p>
                )}
              </div>

              {/* Residue Quantity in Tonnes */}
              <div>
                <label htmlFor="residueTonnes" className="block text-xs font-mono font-semibold text-soil-800 uppercase mb-1.5">
                  {t('residueTonnesLabel')} *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="residueTonnes"
                    min="0.1"
                    step="0.1"
                    value={residueTonnes}
                    onChange={(e) => setResidueTonnes(e.target.value)}
                    aria-invalid={!!errors.residueTonnes}
                    className={`w-full bg-parchment-50 border px-3.5 py-2.5 text-sm font-mono text-soil-900 rounded-xs focus-visible:outline-agri-forest ${
                      errors.residueTonnes ? 'border-deep-clay bg-clay-light/20' : 'border-field-border'
                    }`}
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-mono text-soil-500 pointer-events-none">
                    Tonnes
                  </span>
                </div>
                {errors.residueTonnes ? (
                  <p className="text-xs text-deep-clay mt-1 font-sans flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                    {errors.residueTonnes}
                  </p>
                ) : (
                  <p className="text-[11px] text-soil-500 font-sans mt-1">
                    {t('residueHelper')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: FARM LOCATION & CLUSTER */}
          <div className="bg-parchment-100 border border-field-border p-6 rounded-xs shadow-ledger">
            <div className="border-b border-field-border pb-3 mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-soil-900">
                  {t('formSection2Title')}
                </h2>
                <p className="text-xs text-soil-600 font-sans mt-0.5">
                  {t('formSection2Desc')}
                </p>
              </div>
              <span className="font-mono text-xs text-soil-400">Step 02 / 04</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* State */}
              <div>
                <label htmlFor="state" className="block text-xs font-mono font-semibold text-soil-800 uppercase mb-1.5">
                  {t('stateLabel')} *
                </label>
                <select
                  id="state"
                  value={state}
                  onChange={(e) => {
                    const newState = e.target.value;
                    setState(newState);
                    // Update district default for that state
                    const firstInState = REGIONAL_DISTRICTS.find(d => d.state === newState);
                    if (firstInState) setDistrict(firstInState.value);
                  }}
                  className="w-full bg-parchment-50 border border-field-border px-3.5 py-2.5 text-sm text-soil-900 rounded-xs focus-visible:outline-agri-forest"
                >
                  <option value="Haryana">Haryana / हरियाणा</option>
                  <option value="Punjab">Punjab / पंजाब</option>
                  <option value="Uttar Pradesh">Uttar Pradesh / उत्तर प्रदेश</option>
                </select>
              </div>

              {/* District */}
              <div>
                <label htmlFor="district" className="block text-xs font-mono font-semibold text-soil-800 uppercase mb-1.5">
                  {t('districtLabel')} *
                </label>
                <select
                  id="district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-parchment-50 border border-field-border px-3.5 py-2.5 text-sm text-soil-900 rounded-xs focus-visible:outline-agri-forest"
                >
                  {availableDistricts.map((d) => (
                    <option key={d.value} value={d.value}>
                      {language === 'hi' ? d.labelHi : d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Village / Block */}
              <div>
                <label htmlFor="village" className="block text-xs font-mono font-semibold text-soil-800 uppercase mb-1.5">
                  {t('villageLabel')} *
                </label>
                <input
                  type="text"
                  id="village"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder={t('villagePlaceholder')}
                  aria-invalid={!!errors.village}
                  className={`w-full bg-parchment-50 border px-3.5 py-2.5 text-sm text-soil-900 rounded-xs focus-visible:outline-agri-forest ${
                    errors.village ? 'border-deep-clay bg-clay-light/20' : 'border-field-border'
                  }`}
                />
                {errors.village && (
                  <p className="text-xs text-deep-clay mt-1 font-sans flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                    {errors.village}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: HARVEST & SOWING DEADLINES */}
          <div className="bg-parchment-100 border border-field-border p-6 rounded-xs shadow-ledger">
            <div className="border-b border-field-border pb-3 mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-soil-900">
                  {t('formSection3Title')}
                </h2>
                <p className="text-xs text-soil-600 font-sans mt-0.5">
                  {t('formSection3Desc')}
                </p>
              </div>
              <span className="font-mono text-xs text-soil-400">Step 03 / 04</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Harvest Date */}
              <div>
                <label htmlFor="harvestDate" className="block text-xs font-mono font-semibold text-soil-800 uppercase mb-1.5">
                  {t('harvestDateLabel')} *
                </label>
                <input
                  type="date"
                  id="harvestDate"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  aria-invalid={!!errors.harvestDate}
                  className={`w-full bg-parchment-50 border px-3.5 py-2.5 text-sm text-soil-900 rounded-xs font-mono focus-visible:outline-agri-forest ${
                    errors.harvestDate ? 'border-deep-clay bg-clay-light/20' : 'border-field-border'
                  }`}
                />
                {errors.harvestDate && (
                  <p className="text-xs text-deep-clay mt-1 font-sans flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                    {errors.harvestDate}
                  </p>
                )}
              </div>

              {/* Next Sowing Date */}
              <div>
                <label htmlFor="sowingDate" className="block text-xs font-mono font-semibold text-soil-800 uppercase mb-1.5">
                  {t('sowingDateLabel')} *
                </label>
                <input
                  type="date"
                  id="sowingDate"
                  value={sowingDate}
                  onChange={(e) => setSowingDate(e.target.value)}
                  aria-invalid={!!errors.sowingDate}
                  className={`w-full bg-parchment-50 border px-3.5 py-2.5 text-sm text-soil-900 rounded-xs font-mono focus-visible:outline-agri-forest ${
                    errors.sowingDate ? 'border-deep-clay bg-clay-light/20' : 'border-field-border'
                  }`}
                />
                {errors.sowingDate && (
                  <p className="text-xs text-deep-clay mt-1 font-sans flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                    {errors.sowingDate}
                  </p>
                )}
              </div>
            </div>

            {/* Computed Available Window Days Indicator */}
            {harvestDate && sowingDate && (
              <div className={`mt-6 p-4 rounded-xs border ${
                isTightWindow
                  ? 'bg-harvest-amber-50 border-harvest-amber-600/40'
                  : windowDays > 0
                  ? 'bg-agri-forest-50 border-agri-forest-600/40'
                  : 'bg-clay-light/40 border-deep-clay'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className={`w-4 h-4 ${isTightWindow ? 'text-harvest-amber' : 'text-agri-forest'}`} />
                    <span className="text-xs font-mono uppercase font-bold text-soil-900">
                      {t('computedWindowLabel')}
                    </span>
                  </div>
                  <span className={`text-base font-serif font-bold ${
                    isTightWindow ? 'text-harvest-amber' : 'text-agri-forest'
                  }`}>
                    {windowDays > 0 ? `${windowDays} ${t('daysLabel')}` : 'Invalid Window'}
                  </span>
                </div>

                {isTightWindow && (
                  <p className="text-xs text-harvest-amber-700 mt-2 font-sans leading-relaxed">
                    {t('tightWindowWarning')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* SECTION 4: MACHINERY & PRIORITIES */}
          <div className="bg-parchment-100 border border-field-border p-6 rounded-xs shadow-ledger">
            <div className="border-b border-field-border pb-3 mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-soil-900">
                  {t('formSection4Title')}
                </h2>
                <p className="text-xs text-soil-600 font-sans mt-0.5">
                  {t('formSection4Desc')}
                </p>
              </div>
              <span className="font-mono text-xs text-soil-400">Step 04 / 04</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Machinery Owned */}
              <div>
                <label htmlFor="machineryOwned" className="block text-xs font-mono font-semibold text-soil-800 uppercase mb-1.5">
                  {t('machineryOwnedLabel')} *
                </label>
                <select
                  id="machineryOwned"
                  value={machineryOwned}
                  onChange={(e) => setMachineryOwned(e.target.value as MachineryOwned)}
                  className="w-full bg-parchment-50 border border-field-border px-3.5 py-2.5 text-sm text-soil-900 rounded-xs focus-visible:outline-agri-forest"
                >
                  <option value="none">None (Rent from Custom Hiring Centre)</option>
                  <option value="tractor_standard">Standard Tractor (40–55 HP)</option>
                  <option value="happy_seeder">Happy Seeder / Smart Seeder</option>
                  <option value="super_sms">Combine with Super SMS</option>
                  <option value="baler">Baler / Rake Equipment</option>
                </select>
              </div>

              {/* Machinery Details (Optional) */}
              <div>
                <label htmlFor="machineryDetails" className="block text-xs font-mono font-semibold text-soil-800 uppercase mb-1.5">
                  {t('machineryDetailsLabel')}
                </label>
                <input
                  type="text"
                  id="machineryDetails"
                  value={machineryDetails}
                  onChange={(e) => setMachineryDetails(e.target.value)}
                  placeholder={t('machineryDetailsPlaceholder')}
                  className="w-full bg-parchment-50 border border-field-border px-3.5 py-2.5 text-sm text-soil-900 rounded-xs focus-visible:outline-agri-forest"
                >
                </input>
              </div>

              {/* Farmer Priority */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono font-semibold text-soil-800 uppercase mb-2">
                  {t('farmerPriorityLabel')} *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'lowest_cost', labelKey: 'priorityLowestCost' as const, desc: 'Minimize immediate hiring expenses' },
                    { id: 'fastest_solution', labelKey: 'priorityFastest' as const, desc: 'Field cleared & sown in under 48 hours' },
                    { id: 'max_economic_value', labelKey: 'priorityEconomic' as const, desc: 'Earn revenue from straw bale delivery' },
                    { id: 'soil_health', labelKey: 'prioritySoil' as const, desc: 'Retain carbon, mulch and mycorrhizae' },
                  ].map((p) => {
                    const isSelected = farmerPriority === p.id;
                    return (
                      <label
                        key={p.id}
                        className={`p-3.5 border rounded-xs cursor-pointer flex items-start space-x-3 transition-colors ${
                          isSelected
                            ? 'bg-agri-forest-50 border-agri-forest ring-1 ring-agri-forest text-soil-900'
                            : 'bg-parchment-50 border-field-border hover:bg-parchment-200 text-soil-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="farmerPriority"
                          value={p.id}
                          checked={isSelected}
                          onChange={() => setFarmerPriority(p.id as FarmerPriority)}
                          className="mt-0.5 text-agri-forest focus:ring-agri-forest"
                        />
                        <div>
                          <span className="text-xs font-bold block text-soil-900">
                            {t(p.labelKey)}
                          </span>
                          <span className="text-[11px] text-soil-500 font-sans block mt-0.5">
                            {p.desc}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Form Action Controls */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <Link
              to="/home"
              className="inline-flex items-center justify-center px-4 py-3 text-xs font-medium text-soil-700 hover:text-soil-900 border border-field-border bg-parchment-100 hover:bg-parchment-200 transition-colors min-h-[48px]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('formCancelBtn')}
            </Link>

            <button
              type="submit"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold bg-agri-forest text-white hover:bg-agri-forest-700 active:bg-agri-forest-800 rounded-xs border border-agri-forest-800 shadow-sm transition-all min-h-[48px]"
            >
              <span>{t('formSubmitBtn')}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </form>
      </Container>
    </div>
  );
};
