import { CropType, MachineryOwned } from '../types';

export interface PathwayDefinition {
  id: 'in_situ_incorporation' | 'ex_situ_baling' | 'biomass_utilization' | 'biological_decomposition';
  name: string;
  nameHi: string;
  category: 'in_situ' | 'ex_situ' | 'utilization' | 'biological';
  description: string;
  descriptionHi: string;
  supportedCrops: CropType[];
  compatibleMachinery: MachineryOwned[];
  requiresChcIfNoMachinery: boolean;
  minimumTimeWindowDays: number;
  maximumPracticalDistanceKm: number;
  estimatedCostPerAcre: { min: number; max: number };
  turnaroundDays: number;
  speedCategory: 'urgent' | 'moderate' | 'slow';
  soilBenefitCategory: 'high' | 'moderate' | 'neutral';
  economicValueCategory: 'high' | 'neutral' | 'cost';
  carbonRetainedKgPerAcre: number;
  advantages: string[];
  advantagesHi: string[];
  limitations: string[];
  limitationsHi: string[];
  assumptionsNotes: string;
  assumptionsNotesHi: string;
}

export const SEED_PATHWAYS: PathwayDefinition[] = [
  {
    id: 'in_situ_incorporation',
    name: 'In-Situ Mulch & Sowing (Super SMS + Happy/Smart Seeder)',
    nameHi: 'इन-सिटू प्रबंधन एवं सीधी बुवाई (सुपर एसएमएस व हैप्पी सीडर)',
    category: 'in_situ',
    description: 'Combine harvester with Super SMS attachment shreds and scatters straw evenly; Happy Seeder or Smart Seeder sows wheat directly into the loose mulch without pre-tillage.',
    descriptionHi: 'सुपर एसएमएस कंबाइन पराली को छोटे टुकड़ों में काटकर समान रूप से बिखेरती है; हैप्पी या स्मार्ट सीडर बिना जुताई सीधे पराली के बीच गेहूं की बुवाई कर देता है।',
    supportedCrops: ['paddy', 'wheat', 'sugarcane', 'maize', 'other'],
    compatibleMachinery: ['happy_seeder', 'super_sms', 'tractor_standard', 'none'],
    requiresChcIfNoMachinery: true,
    minimumTimeWindowDays: 2, // Can operate in as little as 2-3 days
    maximumPracticalDistanceKm: 25,
    estimatedCostPerAcre: { min: 1400, max: 1800 },
    turnaroundDays: 2,
    speedCategory: 'urgent',
    soilBenefitCategory: 'high',
    economicValueCategory: 'cost',
    carbonRetainedKgPerAcre: 1800,
    advantages: [
      'Fastest field turnaround (sowing happens simultaneously with residue management)',
      'Conserves 100% of organic carbon and moisture in field soil',
      'Acts as natural mulch, suppressing Phalaris minor (canary grass) weeds'
    ],
    advantagesHi: [
      'सबसे तेज समाधान (कटाई के तुरंत बाद एक ही दिन में बुवाई संभव)',
      'मिट्टी की पूरी नमी और 100% जैविक कार्बन खेत में ही सुरक्षित रहता है',
      'गुल्ली डंडा (खरपतवार) को उगने से प्राकृतिक रूप से रोकता है'
    ],
    limitations: [
      'Requires experienced 50+ HP tractor operator to prevent seeder clogging',
      'Initial wheat germination may look patchy before crown roots establish',
      'Requires uniform straw spreading by the harvester'
    ],
    limitationsHi: [
      'हैप्पी सीडर चलाने के लिए 50 एचपी का कुशल ट्रैक्टर चालक चाहिए',
      'शुरुआती 10-15 दिन गेहूं का जमाव थोड़ा असमान दिख सकता है',
      'कंबाइन से पराली का समान रूप से कटना और बिखरना आवश्यक है'
    ],
    assumptionsNotes: 'Estimated benchmark rate of ₹1,500–₹1,800/acre based on Punjab & Haryana Agriculture Dept Custom Hiring norms.',
    assumptionsNotesHi: 'पंजाब एवं हरियाणा कृषि विभाग के कस्टम हायरिंग मानकों के अनुसार ₹1,500–₹1,800/एकड़ अनुमानित दर।'
  },
  {
    id: 'ex_situ_baling',
    name: 'Ex-Situ Mechanical Baling & Field Clearance',
    nameHi: 'एक्स-सिटू बेलिंग एवं खेत निकासी',
    category: 'ex_situ',
    description: 'Straw is raked into windrows, compressed into high-density rectangular or round bales, and removed from the field by baler operators.',
    descriptionHi: 'पराली को ट्रैक्टर रेक से कतारों में इकट्ठा कर बेलर मशीन द्वारा गांठों (बंडलों) में बांधकर खेत से बाहर निकाल दिया जाता है।',
    supportedCrops: ['paddy', 'wheat', 'sugarcane', 'maize'],
    compatibleMachinery: ['baler', 'tractor_standard', 'none'],
    requiresChcIfNoMachinery: true,
    minimumTimeWindowDays: 6, // Needs at least 6 days for dry down and baler aggregation
    maximumPracticalDistanceKm: 35,
    estimatedCostPerAcre: { min: 1100, max: 1500 },
    turnaroundDays: 5,
    speedCategory: 'moderate',
    soilBenefitCategory: 'neutral',
    economicValueCategory: 'neutral',
    carbonRetainedKgPerAcre: 0,
    advantages: [
      'Leaves the field completely clean for conventional seed drills or rotavator sowing',
      'Avoids machinery choking risks in heavy Basmati straw',
      'Many baling contractors offer subsidized or free clearance in exchange for straw'
    ],
    advantagesHi: [
      'खेत पूरी तरह साफ हो जाता है, जिससे पारंपरिक ड्रिल से सामान्य बुवाई संभव है',
      'भारी बासमती पराली में भी मशीन फंसने का कोई जोखिम नहीं रहता',
      'कई बेलर संचालक पराली के बदले बहुत कम या बिना खर्च के खेत खाली कर देते हैं'
    ],
    limitations: [
      'Removes organic carbon and nutrients entirely from field soil',
      'Requires 5 to 7 dry weather days; rain stalls baling equipment',
      'Baler availability becomes extremely scarce during peak harvest weeks'
    ],
    limitationsHi: [
      'खेत से जैविक कार्बन और पोषक तत्व पूरी तरह बाहर चले जाते हैं',
      'खेत सूखने के लिए 5 से 7 दिन का समय चाहिए; बारिश होने पर काम रुक जाता है',
      'कटाई के चरम समय में बेलर मशीन की उपलब्धता मिलना कठिन हो सकता है'
    ],
    assumptionsNotes: 'Commercial baling contractor service charge or straw-offset demo assumption.',
    assumptionsNotesHi: 'व्यावसायिक बेलर सेवा शुल्क अथवा पराली के बदले निकासी का अनुमानित मॉडल।'
  },
  {
    id: 'biomass_utilization',
    name: 'Biomass Aggregator Supply & Commercial Utilization',
    nameHi: 'बायोमास संग्रह केंद्र आपूर्ति एवं व्यावसायिक उपयोग',
    category: 'utilization',
    description: 'Farmer or village cooperative aggregates baled straw and delivers it to nearby biomass pelleting plants, paper mills, or 2G ethanol refineries for economic revenue.',
    descriptionHi: 'किसान अथवा ग्रामीण समूह पराली की गांठों को नजदीकी बायोमास पेलेट संयंत्र, गत्ता फैक्ट्री या ऊर्जा संयंत्र में बेचकर अतिरिक्त आमदनी प्राप्त करते हैं।',
    supportedCrops: ['paddy', 'sugarcane', 'maize'],
    compatibleMachinery: ['baler', 'tractor_standard', 'none'],
    requiresChcIfNoMachinery: true,
    minimumTimeWindowDays: 8,
    maximumPracticalDistanceKm: 45,
    estimatedCostPerAcre: { min: 600, max: 1100 }, // Low net cost after straw revenue
    turnaroundDays: 7,
    speedCategory: 'moderate',
    soilBenefitCategory: 'neutral',
    economicValueCategory: 'high',
    carbonRetainedKgPerAcre: 0,
    advantages: [
      'Turns crop waste into direct revenue stream (₹150–₹180/quintal at plant gate)',
      'Supports green industrial fuel pellets and bio-ethanol co-firing (SDG 12)',
      'Maximizes net economic return when transport distance is under 40 km'
    ],
    advantagesHi: [
      'पराली से नकद आमदनी का साधन (फैक्ट्री गेट पर ₹150–₹180 प्रति क्विंटल दर)',
      'बायो-कोल और स्वच्छ ऊर्जा उत्पादन में योगदान (एसडीजी 12)',
      '40 किमी के दायरे में संयंत्र होने पर सबसे अधिक आर्थिक लाभ'
    ],
    limitations: [
      'High logistics and cartage overhead if plant is beyond 45 km',
      'Requires moisture level below 18% at delivery gate or factory rejects loads',
      'Requires coordination with local aggregation transport aggregators'
    ],
    limitationsHi: [
      'यदि संयंत्र 45 किमी से दूर हो तो ट्रैक्टर-ट्राली का भाड़ा अधिक लग सकता है',
      'फैक्ट्री में नमी 18% से कम होनी चाहिए, अधिक नमी पर माल अस्वीकार हो सकता है',
      'स्थानीय ट्रांसपोर्टर व तौल कांटे से समन्वय आवश्यक है'
    ],
    assumptionsNotes: 'Based on industrial biomass co-firing purchase benchmarks (₹1,600–₹1,900/tonne delivered).',
    assumptionsNotesHi: 'बायोमास विद्युत संयंत्रों की खरीद दर (₹1,600–₹1,900/टन डिलीवरी) पर आधारित अनुमान।'
  },
  {
    id: 'biological_decomposition',
    name: 'Microbial Bio-Decomposer Spray (Pusa Decomposer)',
    nameHi: 'माइक्रोबियल बायो-डीकंपोजर स्प्रे (पूसा डीकंपोजर)',
    category: 'biological',
    description: 'Fungal/bacterial microbial consortium sprayed on freshly chopped stubble, followed by light rotavator rototilling and Rauni irrigation to digest straw into field compost.',
    descriptionHi: 'फसल कटाई के बाद खेत में कटी पराली पर पूसा बायो-डीकंपोजर स्प्रे कर हल्का रोटावेटर चलाया जाता है और पलेवा (पानी) दिया जाता है, जिससे पराली खेत में ही खाद बन जाती है।',
    supportedCrops: ['paddy', 'wheat', 'sugarcane', 'maize', 'other'],
    compatibleMachinery: ['tractor_standard', 'none'],
    requiresChcIfNoMachinery: false,
    minimumTimeWindowDays: 20, // HARD CONSTRAINT: Requires 20-25 days warm decomposition!
    maximumPracticalDistanceKm: 30,
    estimatedCostPerAcre: { min: 500, max: 850 },
    turnaroundDays: 22,
    speedCategory: 'slow',
    soilBenefitCategory: 'high',
    economicValueCategory: 'cost',
    carbonRetainedKgPerAcre: 2200,
    advantages: [
      'Lowest direct input cost (bacterial capsules/solution subsidized by state agencies)',
      'Significantly enriches soil humus, nitrogen, and beneficial mycorrhizae',
      'Does not require expensive heavy sowing equipment'
    ],
    advantagesHi: [
      'सबसे कम नकद लागत (सरकारी केंद्रों पर डीकंपोजर की बहुत मामूली कीमत)',
      'मिट्टी में केंचुए, जीवाणु और प्राकृतिक नाइट्रोजन की मात्रा बढ़ाता है',
      'किसी बहुत भारी या विशेष बुवाई मशीन की जरूरत नहीं होती'
    ],
    limitations: [
      'REQUIRES MINIMUM 20–25 DAYS: Completely infeasible for tight 10–14 day wheat sowing windows',
      'Requires immediate post-spray field irrigation (Rauni/paleva) to maintain moisture',
      'Cool autumn nights can slow down microbial enzyme digestion speed'
    ],
    limitationsHi: [
      'कम से कम 20 से 25 दिन का समय अनिवार्य: यदि बुवाई में 10-14 दिन हैं तो यह संभव नहीं है',
      'स्प्रे के तुरंत बाद खेत में पर्याप्त नमी/पानी देना जरूरी है',
      'नवंबर में ठंड बढ़ने पर जीवाणुओं के गलने की गति धीमी हो सकती है'
    ],
    assumptionsNotes: 'ICAR / Pusa Institute bio-decomposer standard application protocol.',
    assumptionsNotesHi: 'भारतीय कृषि अनुसंधान संस्थान (पूसा) की मानक डीकंपोजर प्रक्रिया पर आधारित।'
  }
];
