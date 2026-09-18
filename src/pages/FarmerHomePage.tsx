import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAssessment } from '../context/AssessmentContext';
import { 
  User, 
  MapPin, 
  Clock, 
  Calendar, 
  PlusCircle, 
  ArrowRight, 
  RotateCcw, 
  FileCheck2, 
  Layers, 
  Tractor,
  AlertTriangle,
  History
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';

export const FarmerHomePage: React.FC = () => {
  const { language, t } = useLanguage();
  const { currentUser } = useAuth();
  const { currentAssessment, clearCurrentAssessment } = useAssessment();
  const navigate = useNavigate();

  const getCropDisplay = (crop: string, custom?: string) => {
    if (crop === 'other' && custom) return custom;
    const names: Record<string, { en: string; hi: string }> = {
      paddy: { en: 'Paddy Straw', hi: 'धान की पराली' },
      wheat: { en: 'Wheat Residue', hi: 'गेहूं के अवशेष' },
      sugarcane: { en: 'Sugarcane Trash', hi: 'गन्ने की पत्तियां' },
      maize: { en: 'Maize Stover', hi: 'मक्के के डंठल' },
      other: { en: 'Other Crop Residue', hi: 'अन्य फसल अवशेष' }
    };
    return names[crop]?.[language] || crop;
  };

  const isUrgent = currentAssessment && currentAssessment.windowDays <= 10;

  return (
    <div className="py-8 sm:py-12">
      <Container size="md">
        {/* Page Editorial Header */}
        <div className="border-b border-field-border pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-soil-500 uppercase tracking-wider mb-1.5">
              <span className="w-2 h-2 rounded-full bg-agri-forest inline-block"></span>
              <span>{t('activeProfileTitle')}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-soil-900 tracking-tight">
              {language === 'hi' ? currentUser.nameHi : currentUser.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-soil-600 font-mono mt-2">
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-agri-forest" />
                {language === 'hi'
                  ? `${currentUser.location.villageHi}, ${currentUser.location.districtHi}, ${currentUser.location.stateHi}`
                  : `${currentUser.location.village}, ${currentUser.location.district}, ${currentUser.location.state}`}
              </span>
              <span>•</span>
              <span>{currentUser.acreage} {language === 'hi' ? 'एकड़ खेत' : 'Acres Farmland'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <Link
              to="/login"
              className="inline-flex items-center px-3 py-2 text-xs font-mono border border-field-border bg-parchment-100 hover:bg-parchment-200 text-soil-700 transition-colors"
            >
              <User className="w-3.5 h-3.5 mr-1.5 text-soil-500" />
              {language === 'hi' ? 'प्रोफ़ाइल बदलें' : 'Switch Profile'}
            </Link>

            <Link
              to="/assess"
              className="inline-flex items-center px-4 py-2 text-xs font-medium bg-agri-forest text-white hover:bg-agri-forest-700 border border-agri-forest-800 shadow-sm transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              {t('startNewAssessmentBtn')}
            </Link>
          </div>
        </div>

        {/* MAIN SECTION: LATEST RESIDUE ASSESSMENT LEDGER */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-soil-700">
              {t('latestAssessmentHeading')}
            </h2>
            {currentAssessment && (
              <span className="text-xs font-mono text-soil-500">
                ID: {currentAssessment.id}
              </span>
            )}
          </div>

          {currentAssessment ? (
            /* Active Assessment Record Card (Field Ledger layout) */
            <div className="bg-parchment-100 border border-field-border rounded-xs p-6 shadow-ledger">
              {/* Top Record Ribbon */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-field-border pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Badge variant={isUrgent ? 'urgent' : 'verified'}>
                    {isUrgent ? t('criticalWindowBadge') : t('manageableWindowBadge')}
                  </Badge>
                  <span className="text-xs font-mono text-soil-600">
                    Recorded: {new Date(currentAssessment.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={clearCurrentAssessment}
                  className="text-xs font-mono text-soil-500 hover:text-deep-clay underline flex items-center"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  {t('clearCurrentRecordBtn')}
                </button>
              </div>

              {/* Data Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-2 text-xs font-sans">
                {/* Metric 1: Crop */}
                <div className="p-3 bg-parchment-50 border border-field-border/60 rounded-xs">
                  <span className="text-soil-500 font-mono uppercase text-[11px] block mb-1">
                    {language === 'hi' ? 'फसल' : 'Harvest Crop'}
                  </span>
                  <p className="font-serif font-bold text-base text-soil-900">
                    {getCropDisplay(currentAssessment.crop, currentAssessment.customCropName)}
                  </p>
                  <span className="text-soil-500 font-mono text-[11px]">
                    {currentAssessment.acreage} {language === 'hi' ? 'एकड़' : 'Acres'}
                  </span>
                </div>

                {/* Metric 2: Straw Volume */}
                <div className="p-3 bg-parchment-50 border border-field-border/60 rounded-xs">
                  <span className="text-soil-500 font-mono uppercase text-[11px] block mb-1">
                    {language === 'hi' ? 'अवशेष की मात्रा' : 'Residue Volume'}
                  </span>
                  <p className="font-serif font-bold text-base text-soil-900">
                    {currentAssessment.residueTonnes.toFixed(1)} {language === 'hi' ? 'टन' : 'Tonnes'}
                  </p>
                  <span className="text-soil-500 font-mono text-[11px]">
                    ~{(currentAssessment.residueTonnes / (currentAssessment.acreage || 1)).toFixed(1)} T/acre
                  </span>
                </div>

                {/* Metric 3: Time Window */}
                <div className={`p-3 border rounded-xs ${
                  isUrgent 
                    ? 'bg-harvest-amber-50 border-harvest-amber-600/40 text-harvest-amber-700' 
                    : 'bg-parchment-50 border-field-border/60 text-soil-900'
                }`}>
                  <span className="font-mono uppercase text-[11px] block mb-1">
                    {language === 'hi' ? 'बुवाई का समय' : 'Sowing Window'}
                  </span>
                  <p className="font-serif font-bold text-base flex items-center">
                    <Clock className="w-4 h-4 mr-1.5 shrink-0" />
                    {currentAssessment.windowDays} {language === 'hi' ? 'दिन शेष' : 'Days'}
                  </p>
                  <span className="font-mono text-[11px]">
                    {currentAssessment.harvestDate} → {currentAssessment.sowingDate}
                  </span>
                </div>

                {/* Metric 4: Location */}
                <div className="p-3 bg-parchment-50 border border-field-border/60 rounded-xs">
                  <span className="text-soil-500 font-mono uppercase text-[11px] block mb-1">
                    {language === 'hi' ? 'स्थान' : 'Cluster Location'}
                  </span>
                  <p className="font-serif font-bold text-base text-soil-900 truncate">
                    {currentAssessment.district}, {currentAssessment.state}
                  </p>
                  <span className="text-soil-500 font-mono text-[11px] truncate block">
                    {currentAssessment.village}
                  </span>
                </div>
              </div>

              {/* Machinery & Priority Note */}
              <div className="mt-4 p-3.5 bg-parchment-50 border border-field-border/80 text-xs font-mono text-soil-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <Tractor className="w-4 h-4 text-agri-forest shrink-0" />
                  <span>
                    <strong>Machinery:</strong> {currentAssessment.machineryOwned}
                  </span>
                </div>
                <div>
                  <strong>Priority:</strong> {currentAssessment.farmerPriority.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              {/* Urgency Alert if window < 10 days */}
              {isUrgent && (
                <div className="mt-4 p-3 bg-harvest-amber-50 border-l-4 border-harvest-amber text-xs text-harvest-amber-700 font-sans flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{t('tightWindowWarning')}</p>
                </div>
              )}

              {/* Navigation Action Buttons */}
              <div className="mt-6 pt-4 border-t border-field-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/assess')}
                  className="px-4 py-2.5 text-xs font-medium border border-field-border bg-parchment-50 hover:bg-parchment-200 text-soil-900 transition-colors"
                >
                  {language === 'hi' ? 'मूल्यांकन संपादित करें' : 'Edit This Assessment'}
                </button>

                <div className="flex items-center space-x-2">
                  <Link
                    to="/history"
                    className="px-4 py-2.5 text-xs font-mono border border-field-border bg-parchment-50 hover:bg-parchment-200 text-soil-700 transition-colors"
                  >
                    <History className="w-3.5 h-3.5 mr-1.5 inline" />
                    {t('viewAllHistoryBtn')}
                  </Link>

                  <Link
                    to="/analyzing"
                    className="px-5 py-2.5 text-xs font-semibold bg-agri-forest text-white hover:bg-agri-forest-700 border border-agri-forest-800 shadow-sm flex items-center justify-center transition-colors"
                  >
                    <span>{t('viewLatestRecommendationBtn')}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Visually Intentional Empty State */
            <div className="bg-parchment-100 border border-dashed border-field-border rounded-xs p-8 text-center max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-sm bg-parchment-200 border border-field-border mx-auto flex items-center justify-center text-soil-500 mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-soil-900 mb-2">
                {t('noAssessmentTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-soil-600 font-sans leading-relaxed mb-6 max-w-md mx-auto">
                {t('noAssessmentDesc')}
              </p>
              <Link
                to="/assess"
                className="inline-flex items-center justify-center px-6 py-3 bg-agri-forest text-white hover:bg-agri-forest-700 text-xs font-semibold rounded-xs border border-agri-forest-800 shadow-sm transition-colors"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                {t('startFirstAssessmentBtn')}
              </Link>
            </div>
          )}
        </section>

        {/* PRACTICAL GUIDANCE & WORKFLOW REFERENCE */}
        <section className="border-t border-field-border pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Guide Card 1 */}
            <div className="bg-parchment-100 border border-field-border p-5 rounded-xs">
              <h3 className="font-serif text-base font-bold text-soil-900 mb-2 flex items-center">
                <FileCheck2 className="w-4 h-4 mr-2 text-agri-forest" />
                {language === 'hi' ? 'आवश्यक आकलन जानकारी' : 'What You Need for an Assessment'}
              </h3>
              <p className="text-xs text-soil-600 font-sans leading-relaxed mb-3">
                {language === 'hi'
                  ? 'सटीक परिणाम पाने के लिए आपको केवल अपनी कटाई की तारीख, पराली की मात्रा और अगली बुवाई की अपेक्षित तारीख मालूम होनी चाहिए।'
                  : 'To receive a realistic equipment and cost evaluation, all you need is your harvest date, estimated straw tonnage, and target sowing date.'}
              </p>
              <ul className="text-xs font-mono text-soil-700 space-y-1.5">
                <li>• 1 acre paddy ≈ 2.5 tonnes dry straw</li>
                <li>• Window &lt; 10 days requires zero-till / Happy Seeder</li>
                <li>• CHCs within 15 km minimize equipment travel charges</li>
              </ul>
            </div>

            {/* Guide Card 2 */}
            <div className="bg-parchment-100 border border-field-border p-5 rounded-xs">
              <h3 className="font-serif text-base font-bold text-soil-900 mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-harvest-amber" />
                {language === 'hi' ? 'अगले कदम' : 'Next Steps Once Assessed'}
              </h3>
              <p className="text-xs text-soil-600 font-sans leading-relaxed mb-3">
                {language === 'hi'
                  ? 'मूल्यांकन के बाद आप इन-सिटू व एक्स-सिटू विकल्पों की तुलना कर सकते हैं और नजदीकी कस्टम हायरिंग सेंटर का फोन नंबर देख सकते हैं।'
                  : 'After analysis, you can compare viable pathways, review nearby CHCs on the map, and lock in a 5-step checklist for your field.'}
              </p>
              <div className="pt-2">
                <Link
                  to="/resources"
                  className="text-xs font-medium text-agri-forest hover:underline inline-flex items-center font-mono"
                >
                  {t('exploreResourcesBtn')} →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
};
