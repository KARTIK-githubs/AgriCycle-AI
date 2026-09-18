import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

export const translations = {
  // Brand & Shell
  brandName: {
    en: 'AGRICYCLE',
    hi: 'एग्रीसाइकिल (AgriCycle)',
  },
  brandSubtitle: {
    en: 'Crop Residue Management Assistant',
    hi: 'फसल अवशेष प्रबंधन सहायक',
  },
  demoModeBadge: {
    en: 'Demo Mode • Selected Districts',
    hi: 'डेमो मोड • चयनित जिले',
  },
  demoIndicatorActive: {
    en: 'Active Profile: Gurpreet Singh (Karnal, Haryana)',
    hi: 'सक्रिय प्रोफ़ाइल: गुरप्रीत सिंह (करनाल, हरियाणा)',
  },

  // Navigation
  navHome: {
    en: 'Home',
    hi: 'होम',
  },
  navAssess: {
    en: 'Assess Residue',
    hi: 'अवशेष का मूल्यांकन',
  },
  navCompare: {
    en: 'Compare Pathways',
    hi: 'विकल्पों की तुलना',
  },
  navResources: {
    en: 'Nearby Machinery & CHCs',
    hi: 'मशीनरी एवं सीएचसी',
  },
  navActionPlan: {
    en: 'Action Plan',
    hi: 'कार्य योजना',
  },
  navImpact: {
    en: 'Impact Tracker',
    hi: 'पर्यावरण व बचत प्रभाव',
  },
  navHistory: {
    en: 'History',
    hi: 'पिछला रिकॉर्ड',
  },
  navLogin: {
    en: 'Demo Access',
    hi: 'डेमो लॉगिन',
  },

  // Hero Section
  heroPreTitle: {
    en: 'FIELD ADVISORY & DECISION SUPPORT • NORTHERN PLAINS',
    hi: 'कृषि परामर्श एवं निर्णय सहायता • उत्तरी मैदानी क्षेत्र',
  },
  heroTitle: {
    en: 'AFTER THE HARVEST, WHAT HAPPENS TO THE RESIDUE?',
    hi: 'कटाई के बाद, फसल अवशेष का क्या समाधान है?',
  },
  heroSubtitle: {
    en: 'Find a practical, cost-effective pathway to manage crop residue without open burning. Designed specifically for farmers facing tight sowing windows.',
    hi: 'बिना पराली जलाए फसल अवशेष प्रबंधन का व्यावहारिक व किफायती तरीका चुनें। अगली बुवाई के सीमित समय को ध्यान में रखकर तैयार किया गया सहायक।',
  },
  heroPrimaryCta: {
    en: 'Assess My Residue',
    hi: 'फसल अवशेष का आकलन करें',
  },
  heroSecondaryCta: {
    en: 'How It Works',
    hi: 'यह कैसे कार्य करता है',
  },
  heroNotice: {
    en: 'Estimated information based on regional benchmarks — always confirm equipment availability with local operators.',
    hi: 'क्षेत्रीय मानकों पर आधारित अनुमानित जानकारी — खेत में कार्य से पूर्व स्थानीय मशीन संचालक से पुष्टि अवश्य करें।',
  },

  // Operational Realities Section
  bottleneckTitle: {
    en: 'The Harvest-to-Sowing Bottleneck',
    hi: 'कटाई और बुवाई के बीच समय का संकट',
  },
  bottleneckDesc: {
    en: 'Between harvesting paddy and sowing wheat, farmers face an acute 10 to 20 day window. Without immediate access to compatible machinery or local collection hubs, burning often feels like the only viable choice. AgriCycle helps you navigate real, accessible alternatives.',
    hi: 'धान की कटाई और गेहूं की बुवाई के बीच किसानों के पास मात्र 10 से 20 दिन का नाजुक समय होता है। सही मशीन या संग्रह केंद्र की तत्काल जानकारी न होने पर पराली जलाना मजबूरी बन जाता है। एग्रीसाइकिल आपको उपलब्ध व्यावहारिक विकल्पों से जोड़ता है।',
  },

  // Core Pillars / How it works
  howItWorksTitle: {
    en: 'A Practical Decision Path, Not a Chatbot',
    hi: 'एक व्यावहारिक निर्णय प्रक्रिया, न कि साधारण चैटबॉट',
  },
  step1Title: {
    en: '1. Enter Your Field Situation',
    hi: '1. अपने खेत की स्थिति दर्ज करें',
  },
  step1Desc: {
    en: 'Specify crop type, estimated straw volume, location, and the critical days remaining before your next sowing date.',
    hi: 'फसल का प्रकार, पराली की अनुमानित मात्रा, स्थान और अगली बुवाई के शेष दिन दर्ज करें।',
  },
  step2Title: {
    en: '2. Constraint & Resource Analysis',
    hi: '2. समय व स्थानीय संसाधनों का विश्लेषण',
  },
  step2Desc: {
    en: 'Deterministic logic tests in-situ incorporation, baling, and biological decomposition against your exact timeline and nearby CHCs.',
    hi: 'तार्किक गणना द्वारा आपके समय और नजदीकी कस्टम हायरिंग सेंटर्स के अनुसार इन-सिटू, बेलिंग या डीकंपोजर की व्यवहार्यता जांची जाती है।',
  },
  step3Title: {
    en: '3. Transparent Recommendation',
    hi: '3. स्पष्ट व तर्कसंगत अनुशंसा',
  },
  step3Desc: {
    en: 'Receive a top-ranked pathway scored by your chosen priority (Lowest Cost, Fastest Turnaround, or Long-term Soil Health).',
    hi: 'अपनी प्राथमिकता (कम लागत, त्वरित कार्य, या मिट्टी का स्वास्थ्य) के अनुसार सबसे उपयुक्त विकल्प का सुझाव पाएं।',
  },
  step4Title: {
    en: '4. Action Checklist & Local Contacts',
    hi: '4. कार्य योजना एवं संपर्क सूत्र',
  },
  step4Desc: {
    en: 'Get a concrete 5-step checklist with verified local Custom Hiring Centre operators and equipment booking contacts.',
    hi: 'स्थानीय कस्टम हायरिंग सेंटर संचालकों के फोन नंबर और मशीन बुकिंग के स्पष्ट 5 चरणों की सूची प्राप्त करें।',
  },

  // Regional Focus Banner
  regionalFocusTag: {
    en: 'GEOGRAPHIC DEMO FOCUS',
    hi: 'भौगोलिक डेमो दायरा',
  },
  regionalFocusTitle: {
    en: 'Focused on Selected Districts in Punjab, Haryana, and Western UP',
    hi: 'पंजाब, हरियाणा और पश्चिमी उत्तर प्रदेश के चयनित जिलों पर आधारित',
  },
  regionalFocusText: {
    en: 'Demonstration and public registry data currently calibrated for Karnal, Kaithal, Sangrur, Ludhiana, and Meerut agricultural clusters.',
    hi: 'वर्तमान डेमो डेटा करनाल, कैथल, संगरूर, लुधियाना और मेरठ के कृषि क्षेत्रों के अनुसार व्यवस्थित है।',
  },

  // Common UI & Footer
  footerDisclaimer: {
    en: 'AgriCycle is a decision-support prototype aligned with SDG 12 (Responsible Consumption and Production) and SDG 13 (Climate Action). Operational data and hiring costs are regional estimates; confirm details with local Custom Hiring Centres.',
    hi: 'एग्रीसाइकिल एसडीजी 12 और 13 के अनुरूप एक निर्णय-सहायता प्रोटोटाइप है। कार्य की लागत व मशीन उपलब्धता क्षेत्रीय अनुमान हैं; संबंधित केंद्र से संपर्क कर अंतिम पुष्टि करें।',
  },
  switchLanguageLabel: {
    en: 'Language',
    hi: 'भाषा',
  },
  exploreResourcesBtn: {
    en: 'View Nearby Resources',
    hi: 'नजदीकी संसाधन देखें',
  },
  startAssessmentBtn: {
    en: 'Start Residue Assessment',
    hi: 'अवशेष का मूल्यांकन शुरू करें',
  },

  // Phase 2: DEMO LOGIN
  loginPageTitle: {
    en: 'Demo Access & Profile Selection',
    hi: 'डेमो एक्सेस एवं किसान प्रोफ़ाइल',
  },
  loginPageSubtitle: {
    en: 'Select a representative Northern Plains farm profile to test the decision flow. This is a local demonstration session, not a real user account.',
    hi: 'निर्णय प्रक्रिया का परीक्षण करने के लिए उत्तरी मैदानों का प्रतिनिधि किसान प्रोफ़ाइल चुनें। यह एक स्थानीय डेमो सत्र है, वास्तविक खाता नहीं।',
  },
  loginNoticeBanner: {
    en: 'Demonstration Notice: No password or personal credentials required. All operational data and simulated assessments remain stored locally in your browser.',
    hi: 'डेमो सूचना: किसी पासवर्ड या व्यक्तिगत विवरण की आवश्यकता नहीं है। सभी डेटा और आकलन आपके ब्राउज़र में सुरक्षित रहेंगे।',
  },
  selectProfileBtn: {
    en: 'Select Profile & Enter',
    hi: 'यह प्रोफ़ाइल चुनें और आगे बढ़ें',
  },
  activeProfileTag: {
    en: 'Current Active Profile',
    hi: 'वर्तमान सक्रिय प्रोफ़ाइल',
  },
  resetSessionBtn: {
    en: 'Reset Demo Session',
    hi: 'डेमो सत्र रीसेट करें',
  },
  resetSessionConfirm: {
    en: 'Session data and recorded assessments have been reset.',
    hi: 'डेमो डेटा और दर्ज किए गए आकलन रीसेट कर दिए गए हैं।',
  },

  // Phase 2: FARMER HOME
  homePageTitle: {
    en: 'Farmer Home & Field Ledger',
    hi: 'किसान होम व खेत रिकॉर्ड',
  },
  homePageSubtitle: {
    en: 'Operational field notebook for crop residue management and upcoming sowing schedules.',
    hi: 'फसल अवशेष प्रबंधन एवं आगामी बुवाई समय सीमा की फील्ड नोटबुक।',
  },
  activeProfileTitle: {
    en: 'Profile & Farm Record',
    hi: 'किसान प्रोफ़ाइल व खेत विवरण',
  },
  latestAssessmentHeading: {
    en: 'Latest Residue Assessment',
    hi: 'नवीनतम फसल अवशेष मूल्यांकन',
  },
  noAssessmentTitle: {
    en: 'No Active Residue Assessment Recorded',
    hi: 'कोई सक्रिय अवशेष मूल्यांकन दर्ज नहीं है',
  },
  noAssessmentDesc: {
    en: 'You have not recorded an assessment for this harvest season yet. Enter your crop, straw volume, and upcoming sowing date to analyze practical management options.',
    hi: 'आपने इस कटाई सत्र के लिए अभी तक कोई मूल्यांकन दर्ज नहीं किया है। व्यावहारिक प्रबंधन विकल्पों के विश्लेषण के लिए अपनी फसल, अवशेष की मात्रा और बुवाई की तारीख दर्ज करें।',
  },
  startFirstAssessmentBtn: {
    en: 'Start First Residue Assessment',
    hi: 'पहला अवशेष मूल्यांकन शुरू करें',
  },
  startNewAssessmentBtn: {
    en: 'Start New Assessment',
    hi: 'नया मूल्यांकन शुरू करें',
  },
  viewLatestRecommendationBtn: {
    en: 'View Recommendation Analysis',
    hi: 'अनुशंसा व विश्लेषण देखें',
  },
  viewAllHistoryBtn: {
    en: 'View Assessment History',
    hi: 'पिछला रिकॉर्ड देखें',
  },
  clearCurrentRecordBtn: {
    en: 'Clear Active Record',
    hi: 'सक्रिय रिकॉर्ड हटाएं',
  },
  urgencyDaysLeft: {
    en: 'days remaining before next sowing',
    hi: 'दिन अगली बुवाई में शेष',
  },
  criticalWindowBadge: {
    en: 'Critical Time Window',
    hi: 'संवेदनशील समय सीमा',
  },
  manageableWindowBadge: {
    en: 'Manageable Window',
    hi: 'अनुकूल समय सीमा',
  },
  statusPendingAnalysis: {
    en: 'Ready for Analysis',
    hi: 'विश्लेषण हेतु तैयार',
  },
  statusAnalyzed: {
    en: 'Analyzed & Feasible',
    hi: 'विश्लेषित एवं व्यवहार्य',
  },

  // Phase 2: RESIDUE ASSESSMENT FORM
  assessPageTitle: {
    en: 'Residue Assessment',
    hi: 'फसल अवशेष मूल्यांकन',
  },
  assessPageSubtitle: {
    en: 'Tell us what you are dealing with. We calculate feasible options based on your exact crop volume, location, and sowing deadline.',
    hi: 'अपने खेत की स्थिति बताएं। हम आपकी फसल की मात्रा, स्थान और बुवाई समय सीमा के आधार पर व्यावहारिक विकल्प खोजेंगे।',
  },
  formSection1Title: {
    en: '1. Crop & Residue Volume',
    hi: '1. फसल व अवशेष की मात्रा',
  },
  formSection1Desc: {
    en: 'Select the harvested crop and enter approximate straw tonnage or acreage.',
    hi: 'कटाई की गई फसल चुनें और पराली की अनुमानित मात्रा या एकड़ दर्ज करें।',
  },
  cropLabel: {
    en: 'Harvested Crop',
    hi: 'कटाई की गई फसल',
  },
  customCropLabel: {
    en: 'Specify Crop Name',
    hi: 'फसल का नाम लिखें',
  },
  acreageLabel: {
    en: 'Cultivated Area (Acres)',
    hi: 'खेत का रकबा (एकड़)',
  },
  acreageHelper: {
    en: 'For paddy, 1 acre typically produces 2.2 to 2.8 tonnes of dry straw residue.',
    hi: 'धान में आमतौर पर प्रति एकड़ 2.2 से 2.8 टन सूखी पराली निकलती है।',
  },
  residueTonnesLabel: {
    en: 'Approximate Residue Quantity (Tonnes)',
    hi: 'अवशेष / पराली की अनुमानित मात्रा (टन)',
  },
  residueHelper: {
    en: 'Enter total estimated tonnes across your field.',
    hi: 'अपने पूरे खेत की कुल अनुमानित टन मात्रा दर्ज करें।',
  },

  formSection2Title: {
    en: '2. Farm Location & Cluster',
    hi: '2. खेत का स्थान व जिला',
  },
  formSection2Desc: {
    en: 'Used to locate Custom Hiring Centres (CHCs) and aggregators within economic transport radius.',
    hi: 'किफायती दूरी के भीतर कस्टम हायरिंग सेंटर एवं संग्रह केंद्र खोजने के लिए आवश्यक।',
  },
  stateLabel: {
    en: 'State',
    hi: 'राज्य',
  },
  districtLabel: {
    en: 'District',
    hi: 'जिला',
  },
  villageLabel: {
    en: 'Village / Block / Tehsil',
    hi: 'गांव / ब्लॉक / तहसील',
  },
  villagePlaceholder: {
    en: 'e.g. Taraori Rural, Block Indri',
    hi: 'उदा. तरावड़ी ग्रामीण, ब्लॉक इंद्री',
  },

  formSection3Title: {
    en: '3. Harvest & Sowing Deadlines',
    hi: '3. कटाई व अगली बुवाई की तारीखें',
  },
  formSection3Desc: {
    en: 'The time window between harvest and next planting dictates which pathways are physically feasible.',
    hi: 'कटाई और अगली बुवाई के बीच का समय ही तय करता है कि कौन सा विकल्प व्यावहारिक है।',
  },
  harvestDateLabel: {
    en: 'Harvest Date (Actual or Expected)',
    hi: 'कटाई की तारीख (वास्तविक या संभावित)',
  },
  sowingDateLabel: {
    en: 'Expected Next Sowing Date',
    hi: 'अगली बुवाई की संभावित तारीख',
  },
  computedWindowLabel: {
    en: 'Calculated Time Window:',
    hi: 'गणना की गई समय सीमा:',
  },
  daysLabel: {
    en: 'Days',
    hi: 'दिन',
  },
  tightWindowWarning: {
    en: 'High Urgency: Window is under 10 days. Biological decomposition is unlikely to decompose in time; rapid in-situ sowing or fast baling recommended.',
    hi: 'अत्यधिक संवेदनशीलता: समय 10 दिन से कम है। डीकंपोजर इतनी जल्दी नहीं गलेगा; तत्काल इन-सिटू बुवाई या तेज बेलिंग उपयुक्त रहेगी।',
  },

  formSection4Title: {
    en: '4. Machinery & Priorities',
    hi: '4. मशीनरी व किसान की प्राथमिकता',
  },
  formSection4Desc: {
    en: 'Helps evaluate whether you need CHC rental equipment or can utilize on-farm horsepower.',
    hi: 'यह जानने के लिए कि क्या आपको सीएचसी से किराए की आवश्यकता है या आपका अपना ट्रैक्टर पर्याप्त है।',
  },
  machineryOwnedLabel: {
    en: 'Machinery Owned / Available on Farm',
    hi: 'खेत पर स्वयं की उपलब्ध मशीनरी',
  },
  machineryDetailsLabel: {
    en: 'Optional Machinery Details / Tractor HP',
    hi: 'मशीनरी का विवरण / ट्रैक्टर हॉर्सपावर (वैकल्पिक)',
  },
  machineryDetailsPlaceholder: {
    en: 'e.g. 50 HP Swaraj with dual clutch',
    hi: 'उदा. 50 एचपी स्वराज ड्यूल क्लच',
  },
  farmerPriorityLabel: {
    en: 'Your Primary Operational Priority',
    hi: 'आपकी मुख्य प्राथमिकता',
  },
  priorityLowestCost: {
    en: 'Lowest Out-of-Pocket Cost',
    hi: 'सबसे कम नकद खर्च',
  },
  priorityFastest: {
    en: 'Fastest Solution (Urgent Turnaround)',
    hi: 'सबसे तेज समाधान (शीघ्र बुवाई)',
  },
  priorityEconomic: {
    en: 'Maximum Economic Value (Biomass Sale)',
    hi: 'अधिकतम आर्थिक लाभ (पराली बिक्री)',
  },
  prioritySoil: {
    en: 'Long-term Soil Health & Moisture Retention',
    hi: 'मिट्टी की उर्वरता एवं नमी संरक्षण',
  },

  // Phase 3: ANALYSIS & OPERATIONAL SOLVER
  analyzingPageTitle: {
    en: 'Analyzing Operational Constraints',
    hi: 'खेत की स्थिति व बाधाओं का तार्किक विश्लेषण',
  },
  analyzingSubtitle: {
    en: 'Testing candidate pathways against your crop volume, remaining sowing days, and local equipment access.',
    hi: 'आपकी फसल, पराली की मात्रा, बुवाई समय सीमा और स्थानीय मशीनरी की उपलब्धता के आधार पर जांच की जा रही है।',
  },
  solverStep1: {
    en: 'Reading crop parameters and residue density...',
    hi: 'फसल की स्थिति एवं पराली घनत्व की गणना...',
  },
  solverStep2: {
    en: 'Checking hard sowing window boundaries...',
    hi: 'अगली बुवाई की समय सीमा और न्यूनतम दिनों की जांच...',
  },
  solverStep3: {
    en: 'Filtering machinery constraints & regional CHC radius...',
    hi: 'उपलब्ध मशीनरी एवं नजदीकी कस्टम हायरिंग सेंटर्स की दूरी का मिलान...',
  },
  solverStep4: {
    en: 'Evaluating feasibility rules and excluding incompatible pathways...',
    hi: 'असंभव विकल्पों को स्पष्ट कारणों सहित बाहर करना...',
  },
  solverStep5: {
    en: 'Computing transparent multi-factor suitability scores...',
    hi: 'लागत, समय और किसान प्राथमिकता के आधार पर उपयुक्तता स्कोर तैयार करना...',
  },
  solverStep6: {
    en: 'Finalizing primary recommendation and field advisory...',
    hi: 'अंतिम अनुशंसित विकल्प और खेत परामर्श तैयार है...',
  },
  calculatingNotice: {
    en: 'Deterministic Agricultural Rule Engine • Real-time constraint solver',
    hi: 'तार्किक कृषि नियम प्रणाली • वास्तविक समय बाधा समाधानकर्ता',
  },

  // Phase 3: RECOMMENDATION PAGE
  recommendationPageTitle: {
    en: 'Field Decision Advisory',
    hi: 'खेत प्रबंधन निर्णय परामर्श',
  },
  recommendationPageSubtitle: {
    en: 'Practical, transparent pathway recommendation generated from your field parameters and regional machinery data.',
    hi: 'आपके खेत के आंकड़ों और क्षेत्रीय मशीनरी के आधार पर तैयार की गई व्यावहारिक व पारदर्शी अनुशंसा।',
  },
  recommendedPathwayTag: {
    en: 'RECOMMENDED PRIMARY PATHWAY',
    hi: 'सर्वोच्च अनुशंसित मुख्य विकल्प',
  },
  suitabilityScoreLabel: {
    en: 'Suitability Score',
    hi: 'उपयुक्तता स्कोर',
  },
  suitabilityScoreNote: {
    en: 'Scored out of 100 based on your time window, local CHC distance, cost, and selected priority.',
    hi: 'समय सीमा, सीएचसी दूरी, लागत और आपकी प्राथमिकता के आधार पर 100 में से निर्धारित स्कोर।',
  },
  whyThisOptionTitle: {
    en: 'Why This Option Ranked First',
    hi: 'यह विकल्प पहले स्थान पर क्यों रहा?',
  },
  keyAdvantagesTitle: {
    en: 'Key Operational Advantages',
    hi: 'मुख्य व्यावहारिक लाभ',
  },
  keyLimitationsTitle: {
    en: 'Operational Limitations & Cautions',
    hi: 'सावधानियां एवं सीमाएं',
  },
  importantConstraintsTitle: {
    en: 'Important Field Directives',
    hi: 'महत्वपूर्ण कृषि निर्देश',
  },
  dataAssumptionsTitle: {
    en: 'Data & Rate Assumptions',
    hi: 'डेटा एवं दर संबंधी अनुमान',
  },
  aiNarrativeTitle: {
    en: 'Synthesized Field Explanation',
    hi: 'विस्तृत कृषि परामर्श व्याख्या',
  },
  sourceLocalFallback: {
    en: 'Source: Local Deterministic Advisory Synthesizer',
    hi: 'स्रोत: स्थानीय तार्किक परामर्श प्रणाली',
  },
  sourceGroqAi: {
    en: 'Source: Grounded AI explanation based on structured decision-engine output',
    hi: 'स्रोत: तार्किक निर्णय डेटा पर आधारित प्रामाणिक एआई परामर्श',
  },
  alternativeOptionsTitle: {
    en: 'Other Feasible Pathways',
    hi: 'अन्य व्यवहार्य विकल्प',
  },
  alternativeOptionsDesc: {
    en: 'These pathways also meet your minimum constraints. You can review and choose any feasible option based on your judgment.',
    hi: 'ये विकल्प भी आपकी न्यूनतम शर्तों को पूरा करते हैं। किसान अपनी सुविधानुसार इनमें से भी किसी का चयन कर सकते हैं।',
  },
  selectAlternativeBtn: {
    en: 'Select This Pathway',
    hi: 'यह विकल्प चुनें',
  },
  selectedBadge: {
    en: 'Active Selection',
    hi: 'सक्रिय चयन',
  },
  infeasibleOptionsTitle: {
    en: 'Infeasible Pathways (Excluded with Reasons)',
    hi: 'अव्यवहार्य विकल्प (कारण सहित बाहर)',
  },
  infeasibleOptionsDesc: {
    en: 'These pathways were evaluated but cannot realistically function under your field constraints.',
    hi: 'इन विकल्पों की भी जांच की गई, किंतु आपकी वर्तमान स्थिति के कारण ये लागू नहीं हो सकते।',
  },
  continueToCompareBtn: {
    en: 'Compare All Pathways',
    hi: 'सभी विकल्पों की विस्तृत तुलना',
  },
  continueToResourcesBtn: {
    en: 'Find Nearby Machinery & CHCs',
    hi: 'नजदीकी मशीनरी व सीएचसी देखें',
  },
  continueToActionPlanBtn: {
    en: 'Build Field Action Plan',
    hi: 'खेत कार्य योजना तैयार करें',
  },
  fieldSummaryTitle: {
    en: 'Evaluated Field Situation',
    hi: 'मूल्यांकित खेत की स्थिति',
  },
  estimatedCostLabel: {
    en: 'Est. Operational Expense',
    hi: 'अनुमानित परिचालन खर्च',
  },
  turnaroundLabel: {
    en: 'Field Turnaround',
    hi: 'कार्य समाप्ति समय',
  },
  nearestChcLabel: {
    en: 'Nearest Equipment Centre',
    hi: 'नजदीकी मशीनरी केंद्र',
  },
  confirmLocallyNotice: {
    en: 'Notice: This recommendation is a decision aid based on regional benchmarks. Always confirm machinery availability and rates directly with operators before taking action.',
    hi: 'सूचना: यह अनुशंसा क्षेत्रीय मानकों पर आधारित एक सहायता प्रणाली है। खेत में काम शुरू करने से पहले मशीन संचालक से दर व उपलब्धता की पुष्टि अवश्य करें।',
  },
  errorResiduePositive: {
    en: 'Residue quantity must be a positive number greater than 0.',
    hi: 'अवशेष की मात्रा 0 से अधिक एक मान्य संख्या होनी चाहिए।',
  },
  errorAcreagePositive: {
    en: 'Acreage must be a positive number.',
    hi: 'रकबा 0 से अधिक एक मान्य संख्या होनी चाहिए।',
  },
  errorStateRequired: {
    en: 'Please select a state.',
    hi: 'कृपया राज्य चुनें।',
  },
  errorDistrictRequired: {
    en: 'Please select a district.',
    hi: 'कृपया जिला चुनें।',
  },
  errorVillageRequired: {
    en: 'Village or block location cannot be empty.',
    hi: 'गांव या ब्लॉक का नाम भरना अनिवार्य है।',
  },
  errorHarvestDateRequired: {
    en: 'Please enter a valid harvest date.',
    hi: 'कृपया कटाई की मान्य तारीख दर्ज करें।',
  },
  errorSowingDateRequired: {
    en: 'Please enter an expected sowing date.',
    hi: 'कृपया अगली बुवाई की मान्य तारीख दर्ज करें।',
  },
  errorSowingBeforeHarvest: {
    en: 'Next sowing date cannot be before the harvest date.',
    hi: 'अगली बुवाई की तारीख कटाई की तारीख से पहले नहीं हो सकती।',
  },
  errorWindowTooShort: {
    en: 'Sowing date must be at least 1 day after harvest date.',
    hi: 'बुवाई की तारीख कटाई से कम से कम 1 दिन बाद की होनी चाहिए।',
  },
  formSubmitBtn: {
    en: 'Analyze Feasible Pathways',
    hi: 'व्यवहार्य विकल्पों का विश्लेषण करें',
  },
  formCancelBtn: {
    en: 'Cancel & Return Home',
    hi: 'रद्द करें और होम पर जाएं',
  },
};

export type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('agricycle_lang');
    return (saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('agricycle_lang', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: TranslationKey): string => {
    const item = translations[key];
    if (!item) {
      console.warn(`Translation key missing: ${key}`);
      return key;
    }
    return item[language] || item['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
