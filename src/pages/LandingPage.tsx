import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowRight, 
  Clock, 
  MapPin, 
  Tractor, 
  Flame, 
  Leaf
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';

export const LandingPage: React.FC = () => {
  const { language, t } = useLanguage();

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="py-6 sm:py-10">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="border-b border-field-border pb-12 sm:pb-16">
        <Container>
          {/* Header Metadata Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-3 border-b border-field-border text-xs font-mono text-soil-500">
            <span className="tracking-wider uppercase">
              {t('heroPreTitle')}
            </span>
            <span className="text-soil-600">
              {language === 'hi' ? 'खरीफ-रबी संक्रमण सत्र 2026' : 'Kharif-Rabi Transition Cycle 2026'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-soil-900 leading-[1.12] tracking-tight">
                {t('heroTitle')}
              </h1>

              <p className="text-base sm:text-lg text-soil-700 leading-relaxed font-sans max-w-xl">
                {t('heroSubtitle')}
              </p>

              {/* Action Group */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  to="/assess"
                  className="inline-flex items-center justify-center px-6 py-3.5 bg-agri-forest text-white hover:bg-agri-forest-700 active:bg-agri-forest-800 text-sm font-semibold rounded-xs border border-agri-forest-800 shadow-sm transition-all"
                >
                  <span>{t('heroPrimaryCta')}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>

                <button
                  type="button"
                  onClick={scrollToHowItWorks}
                  className="inline-flex items-center justify-center px-5 py-3.5 bg-parchment-100 hover:bg-parchment-200 text-soil-900 text-sm font-medium rounded-xs border border-field-border transition-colors"
                >
                  {t('heroSecondaryCta')}
                </button>
              </div>

              {/* Advisory note */}
              <div className="pt-3 flex items-start space-x-2 text-xs text-soil-600">
                <span className="font-mono text-harvest-amber font-bold text-sm leading-none">•</span>
                <p className="leading-normal">
                  {t('heroNotice')}
                </p>
              </div>
            </div>

            {/* Right Column: Agricultural Field Notebook Visual Artifact */}
            <div className="lg:col-span-5">
              <div className="bg-parchment-100 border border-field-border rounded-xs p-5 sm:p-6 shadow-ledger relative">
                {/* Field Notebook Header */}
                <div className="flex items-center justify-between border-b border-field-border pb-3 mb-4 text-xs font-mono">
                  <span className="uppercase text-soil-500 tracking-wider">
                    {language === 'hi' ? 'क्षेत्रीय रिकॉर्ड सारांश' : 'Field Case Record #402'}
                  </span>
                  <Badge variant="verified">
                    {language === 'hi' ? 'सत्यापित पैरामीटर' : 'Field Baseline'}
                  </Badge>
                </div>

                {/* Practical Dilemma Ledger */}
                <div className="space-y-3.5 text-xs sm:text-sm">
                  <div className="flex justify-between items-baseline py-1.5 border-b border-field-border/60">
                    <span className="text-soil-600 font-sans">
                      {language === 'hi' ? 'फसल व प्रकार:' : 'Harvest Crop:'}
                    </span>
                    <span className="font-mono font-medium text-soil-900">
                      {language === 'hi' ? 'धान (बासमती अवशेष)' : 'Paddy Straw (Non-basmati / PR)'}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline py-1.5 border-b border-field-border/60">
                    <span className="text-soil-600 font-sans">
                      {language === 'hi' ? 'अनुमानित मात्रा:' : 'Residue Volume:'}
                    </span>
                    <span className="font-mono font-medium text-soil-900">
                      ~5.2 {language === 'hi' ? 'टन (2.6 टन/एकड़)' : 'Tonnes (~2.6 T/acre)'}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline py-1.5 border-b border-field-border/60">
                    <span className="text-soil-600 font-sans">
                      {language === 'hi' ? 'अगली बुवाई में शेष:' : 'Time Window to Wheat:'}
                    </span>
                    <span className="font-mono font-bold text-harvest-amber flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      12 {language === 'hi' ? 'दिन शेष (संवेदनशील)' : 'Days (High Urgency)'}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline py-1.5 border-b border-field-border/60">
                    <span className="text-soil-600 font-sans">
                      {language === 'hi' ? 'उपलब्ध नजदीकी संसाधन:' : 'Nearby CHCs in Radius:'}
                    </span>
                    <span className="font-mono font-medium text-soil-900">
                      3 {language === 'hi' ? 'केंद्र (औसत 8.4 किमी)' : 'Centres (Avg 8.4 km)'}
                    </span>
                  </div>
                </div>

                {/* Field Decision Snapshot */}
                <div className="mt-5 p-3 bg-agri-forest-50 border border-agri-forest-600/30 rounded-xs">
                  <div className="text-[11px] font-mono uppercase text-agri-forest-800 font-bold mb-1">
                    {language === 'hi' ? 'मूल्यांकन परिणाम' : 'Calculated Outcome'}
                  </div>
                  <p className="text-xs text-soil-800 leading-relaxed font-sans">
                    {language === 'hi' 
                      ? 'कम समय के कारण इन-सिटू हैप्पी सीडर व सुपर एसएमएस सर्वोच्च वरीयता (लागत ₹1,650/एकड़)।'
                      : 'Tight 12-day window favors in-situ Super SMS + Happy Seeder custom hiring over ex-situ baling.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-field-border/60 flex items-center justify-between text-[11px] font-mono text-soil-500">
                  <span>Karnal, Haryana</span>
                  <Link to="/home" className="text-agri-forest hover:underline flex items-center">
                    {language === 'hi' ? 'डेमो रिकॉर्ड खोलें' : 'View Sample Evaluation'} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. THE REAL BOTTLENECK NARRATIVE */}
      <section className="py-12 sm:py-16 border-b border-field-border bg-parchment-100/60">
        <Container size="md">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="urgent" icon={<Flame className="w-3 h-3 text-harvest-amber" />}>
              {language === 'hi' ? 'कृषि वास्तविकता' : 'Operational Reality'}
            </Badge>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-soil-900 mt-3 tracking-tight">
              {t('bottleneckTitle')}
            </h2>
            <p className="text-sm sm:text-base text-soil-700 mt-4 leading-relaxed font-sans">
              {t('bottleneckDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Factor 1: The Timeline Crunch */}
            <div className="bg-parchment-50 border border-field-border p-5 rounded-xs">
              <div className="w-8 h-8 rounded-xs bg-harvest-amber-50 border border-harvest-amber-600/30 flex items-center justify-center text-harvest-amber mb-3">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-base text-soil-900 mb-2">
                {language === 'hi' ? 'सीमित समय सीमा' : 'The 10–20 Day Window'}
              </h3>
              <p className="text-xs text-soil-600 leading-relaxed font-sans">
                {language === 'hi'
                  ? 'धान की कटाई के तुरंत बाद गेहूं बोना आवश्यक है। हर सप्ताह की देरी से पैदावार 1.5 क्विंटल प्रति एकड़ तक घट सकती है।'
                  : 'Wheat sowing cannot wait. Every week of delay post-November 15 can decrease grain yields by 1.5 quintals per acre.'}
              </p>
            </div>

            {/* Factor 2: Machinery Bottleneck */}
            <div className="bg-parchment-50 border border-field-border p-5 rounded-xs">
              <div className="w-8 h-8 rounded-xs bg-agri-forest-50 border border-agri-forest-600/30 flex items-center justify-center text-agri-forest mb-3">
                <Tractor className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-base text-soil-900 mb-2">
                {language === 'hi' ? 'मशीनरी की उपलब्धता' : 'Machinery Access'}
              </h3>
              <p className="text-xs text-soil-600 leading-relaxed font-sans">
                {language === 'hi'
                  ? 'हैप्पी सीडर, सुपर एसएमएस व बेलर महंगे हैं। छोटे किसान कस्टम हायरिंग सेंटर के जरिए ही इनका किफायती उपयोग कर सकते हैं।'
                  : 'Specialized equipment like Happy Seeders or Balers are capital heavy. Custom Hiring Centres bridge this gap when accessible.'}
              </p>
            </div>

            {/* Factor 3: Soil Nutrient Loss */}
            <div className="bg-parchment-50 border border-field-border p-5 rounded-xs">
              <div className="w-8 h-8 rounded-xs bg-parchment-200 border border-field-border flex items-center justify-center text-soil-700 mb-3">
                <Leaf className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-base text-soil-900 mb-2">
                {language === 'hi' ? 'मिट्टी की उर्वरता' : 'Soil Nutrient Preservation'}
              </h3>
              <p className="text-xs text-soil-600 leading-relaxed font-sans">
                {language === 'hi'
                  ? 'पराली जलाने से प्रति हेक्टेयर 30 किलो नाइट्रोजन और मिट्टी के लाभकारी सूक्ष्मजीव नष्ट होते हैं। सही प्रबंधन इसे बचाता है।'
                  : 'Burning 1 tonne of paddy straw incinerates 5.5 kg nitrogen, 2.3 kg phosphorus, and essential soil mycorrhizal microbes.'}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. HOW IT WORKS: THE NARRATIVE DECISION PATH */}
      <section id="how-it-works" className="py-12 sm:py-16 border-b border-field-border">
        <Container>
          <div className="mb-10">
            <span className="font-mono text-xs text-soil-500 uppercase tracking-wider block mb-1">
              {language === 'hi' ? 'कार्यप्रणाली' : 'SYSTEM ARCHITECTURE'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-soil-900 tracking-tight">
              {t('howItWorksTitle')}
            </h2>
            <p className="text-sm text-soil-600 mt-2 font-sans max-w-xl">
              {language === 'hi'
                ? 'कोई काल्पनिक चैट या अस्पष्ट सलाह नहीं — आपकी सटीक स्थिति के आधार पर सत्यापित तार्किक प्रक्रिया।'
                : 'No speculative chatbot answers. A grounded, transparent constraint evaluation designed for real farm logistics.'}
            </p>
          </div>

          {/* Sequential Step Ledger */}
          <div className="border-t border-field-border divide-y divide-field-border">
            {/* Step 1 */}
            <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <div className="md:col-span-1">
                <span className="font-mono text-2xl font-bold text-soil-400">01</span>
              </div>
              <div className="md:col-span-4">
                <h3 className="font-serif text-lg font-bold text-soil-900">
                  {t('step1Title')}
                </h3>
                <span className="text-xs font-mono text-soil-500 uppercase mt-0.5 block">
                  Input: Crop, Tonnage, Sowing Window
                </span>
              </div>
              <div className="md:col-span-7 text-xs sm:text-sm text-soil-700 leading-relaxed">
                {t('step1Desc')}
              </div>
            </div>

            {/* Step 2 */}
            <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <div className="md:col-span-1">
                <span className="font-mono text-2xl font-bold text-soil-400">02</span>
              </div>
              <div className="md:col-span-4">
                <h3 className="font-serif text-lg font-bold text-soil-900">
                  {t('step2Title')}
                </h3>
                <span className="text-xs font-mono text-soil-500 uppercase mt-0.5 block">
                  Logic: Hard Bounds & Radius Filter
                </span>
              </div>
              <div className="md:col-span-7 text-xs sm:text-sm text-soil-700 leading-relaxed">
                {t('step2Desc')}
              </div>
            </div>

            {/* Step 3 */}
            <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <div className="md:col-span-1">
                <span className="font-mono text-2xl font-bold text-soil-400">03</span>
              </div>
              <div className="md:col-span-4">
                <h3 className="font-serif text-lg font-bold text-soil-900">
                  {t('step3Title')}
                </h3>
                <span className="text-xs font-mono text-soil-500 uppercase mt-0.5 block">
                  Output: Scored Suitability & Rationale
                </span>
              </div>
              <div className="md:col-span-7 text-xs sm:text-sm text-soil-700 leading-relaxed">
                {t('step3Desc')}
              </div>
            </div>

            {/* Step 4 */}
            <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <div className="md:col-span-1">
                <span className="font-mono text-2xl font-bold text-soil-400">04</span>
              </div>
              <div className="md:col-span-4">
                <h3 className="font-serif text-lg font-bold text-soil-900">
                  {t('step4Title')}
                </h3>
                <span className="text-xs font-mono text-soil-500 uppercase mt-0.5 block">
                  Action: Step Checklist & Verified Numbers
                </span>
              </div>
              <div className="md:col-span-7 text-xs sm:text-sm text-soil-700 leading-relaxed">
                {t('step4Desc')}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. REGIONAL SCOPE & DEMO CONTEXT BANNER */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="bg-parchment-100 border border-field-border p-6 sm:p-8 rounded-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <Badge variant="demo" icon={<MapPin className="w-3 h-3 text-agri-forest" />}>
                  {t('regionalFocusTag')}
                </Badge>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-soil-900">
                  {t('regionalFocusTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-soil-600 leading-relaxed">
                  {t('regionalFocusText')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <Link
                  to="/resources"
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-parchment-50 hover:bg-parchment-200 text-soil-900 text-xs font-medium border border-field-border transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-agri-forest" />
                  {t('exploreResourcesBtn')}
                </Link>

                <Link
                  to="/assess"
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-agri-forest text-white hover:bg-agri-forest-700 text-xs font-medium border border-agri-forest-800 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5 mr-1.5" />
                  {t('startAssessmentBtn')}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
