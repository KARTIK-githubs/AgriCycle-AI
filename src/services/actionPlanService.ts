import { ActionPlanStep } from '../types';

/**
 * Generates concrete, pathway-tailored action plan steps.
 * Different pathways generate distinct operational steps, responsibilities, and target days.
 */
export function generateActionPlanSteps(
  pathwayId: string,
  _harvestDate?: string,
  _sowingDate?: string,
  resourceName?: string
): ActionPlanStep[] {
  const targetResourceName = resourceName || 'Selected Machinery Centre';

  switch (pathwayId) {
    case 'in_situ_incorporation':
      return [
        {
          id: 'step-in_situ-1',
          stepNumber: 1,
          title: 'Harvester Super SMS Attachment Verification',
          titleHi: 'कंबाइन हार्वेस्टर में सुपर एसएमएस सत्यापन',
          description:
            'Confirm the combine harvester has a functional Super SMS (Straw Management System) attachment installed before field harvesting begins to ensure straw is cut and distributed uniformly.',
          descriptionHi:
            'धान कटाई शुरू करने से पहले सुनिश्चित करें कि कंबाइन हार्वेस्टर में सुपर एसएमएस लगा हो, ताकि पराली छोटे टुकड़ों में कटकर पूरे खेत में बराबर फैले।',
          responsibility: 'farmer',
          responsibilityLabel: 'Farmer & Harvester Operator',
          responsibilityLabelHi: 'किसान एवं कंबाइन चालक',
          targetDayOffset: 0, // Day of harvest
          status: 'not_started',
          guidanceNotes: 'Harvester cut height should be maintained at 15–20 cm above ground.',
          guidanceNotesHi: 'कंबाइन से कटाई जमीन से 15-20 सेमी ऊपर रखें।',
        },
        {
          id: 'step-in_situ-2',
          stepNumber: 2,
          title: 'Confirm Seeder & 50+ HP Tractor Reservation',
          titleHi: 'हैप्पी सीडर व 50+ एचपी ट्रैक्टर बुकिंग',
          description: `Contact ${targetResourceName} to confirm reservation of a Happy Seeder or Smart Seeder along with a 50+ HP tractor for the target sowing date.`,
          descriptionHi: `${targetResourceName} से संपर्क करके बुवाई की तिथि हेतु हैप्पी सीडर / स्मार्ट सीडर और 50+ एचपी ट्रैक्टर की बुकिंग सुनिश्चित करें।`,
          responsibility: 'chc_provider',
          responsibilityLabel: 'Farmer & CHC Manager',
          responsibilityLabelHi: 'किसान व केंद्र प्रबंधक',
          targetDayOffset: 1,
          status: 'not_started',
          guidanceNotes: 'Confirm driver experience with mulch seeding to avoid seeder clogging.',
          guidanceNotesHi: 'मशीन चालक को पराली में सीडर चलाने का अनुभव होना आवश्यक है।',
        },
        {
          id: 'step-in_situ-3',
          stepNumber: 3,
          title: 'Field Moisture & Straw Scatter Inspection',
          titleHi: 'खेत की नमी एवं पराली फैलाव का निरीक्षण',
          description:
            'Inspect the harvested field. Ensure loose straw is spread evenly without thick windrows or heaps, and test soil moisture for direct seed drilling.',
          descriptionHi:
            'खेत का मुआयना करें। सुनिश्चित करें कि कटी पराली कहीं ढेर न बनी हो और जमीन में गेहूं की सीधी बुवाई हेतु पर्याप्त नमी हो।',
          responsibility: 'farmer',
          responsibilityLabel: 'Farmer',
          responsibilityLabelHi: 'किसान',
          targetDayOffset: 2,
          status: 'not_started',
          guidanceNotes: 'If heaps exist, use a tractor rake or manual sweep to disperse straw evenly.',
          guidanceNotesHi: 'यदि पराली का ढेर हो तो उसे रेक या हाथ से समान रूप से फैला दें।',
        },
        {
          id: 'step-in_situ-4',
          stepNumber: 4,
          title: 'Direct Wheat Seeding with Loose Mulch Cover',
          titleHi: 'हैप्पी सीडर से गेहूं की सीधी बुवाई',
          description:
            'Execute direct wheat sowing into standing stubble and loose mulch (depth 3–4 cm, 45 kg/acre certified seed rate) without any pre-sowing tillage.',
          descriptionHi:
            'बिना जुताई किए हैप्पी सीडर से सीधे पराली के बीच 3-4 सेमी गहराई पर 45 किग्रा प्रति एकड़ की दर से प्रमाणित बीज की बुवाई करें।',
          responsibility: 'operator',
          responsibilityLabel: 'Machinery Operator',
          responsibilityLabelHi: 'मशीन चालक',
          targetDayOffset: 3,
          status: 'not_started',
          guidanceNotes: 'Operate tractor at steady 2.5–3.0 km/h in 1st low gear for optimal furrow closure.',
          guidanceNotesHi: 'ट्रैक्टर को 1ले लो गियर में 2.5-3 किमी/घंटा की स्थिर गति से चलाएं।',
        },
        {
          id: 'step-in_situ-5',
          stepNumber: 5,
          title: 'Post-Sowing Furrow & Mulch Blanket Audit',
          titleHi: 'बुवाई पश्चात बीज जमाव एवं पराली सुरक्षा जांच',
          description:
            'Verify seed-to-soil placement across the field rows. Confirm that the mulch layer provides uniform soil moisture conservation and weed suppression.',
          descriptionHi:
            'खेत में कतारों का निरीक्षण करें कि बीज ठीक से ढका है और पराली की परत मिट्टी में नमी बनाए रखने व खरपतवार रोकने हेतु सही है।',
          responsibility: 'farmer',
          responsibilityLabel: 'Farmer',
          responsibilityLabelHi: 'किसान',
          targetDayOffset: 4,
          status: 'not_started',
          guidanceNotes: 'First irrigation (crown root initiation) is typically due 21 days after sowing.',
          guidanceNotesHi: 'पहली सिंचाई बुवाई के 21 दिन बाद (सीआरआई अवस्था) पर दें।',
        },
      ];

    case 'ex_situ_baling':
      return [
        {
          id: 'step-baling-1',
          stepNumber: 1,
          title: 'Lock In Baler Contractor Operating Window',
          titleHi: 'बेलर ठेकेदार से कार्य तिथि तय करना',
          description: `Contact ${targetResourceName} to schedule baling operations within 3–5 days post-harvest while dry weather prevails.`,
          descriptionHi: `${targetResourceName} से संपर्क कर कटाई के 3-5 दिन के भीतर सूखे मौसम में बेलर मशीन की तारीख तय करें।`,
          responsibility: 'farmer',
          responsibilityLabel: 'Farmer & Baler Contractor',
          responsibilityLabelHi: 'किसान व बेलर ठेकेदार',
          targetDayOffset: 1,
          status: 'not_started',
          guidanceNotes: 'Confirm whether baling service is charged at fixed per-acre rate or straw-offset trade.',
          guidanceNotesHi: 'पुष्टि करें कि बेलिंग शुल्क प्रति एकड़ लगेगा या पराली के बदले मुफ्त निकासी होगी।',
        },
        {
          id: 'step-baling-2',
          stepNumber: 2,
          title: 'Field Access & Bund Clearance Preparation',
          titleHi: 'खेत का रास्ता एवं मेड़ निकासी तैयारी',
          description:
            'Clear farm bund entrance points, verify soil has dried sufficiently to bear heavy machinery, and clear access paths for high-density baler tractors.',
          descriptionHi:
            'खेत में भारी ट्रैक्टर-बेलर के प्रवेश के लिए मेड़ व रास्ता साफ करें तथा सुनिश्चित करें कि जमीन सूखी हो ताकि पहिए न धंसें।',
          responsibility: 'farmer',
          responsibilityLabel: 'Farmer',
          responsibilityLabelHi: 'किसान',
          targetDayOffset: 2,
          status: 'not_started',
          guidanceNotes: 'Wet or marshy corners must be flagged to avoid machine entrapment.',
          guidanceNotesHi: 'गीले हिस्सों की पहचान पहले ही कर लें ताकि मशीन न फंसे।',
        },
        {
          id: 'step-baling-3',
          stepNumber: 3,
          title: 'Raking & Mechanical Baling Operation',
          titleHi: 'ट्रैक्टर रेक से कतार बनाना व बेलिंग करना',
          description:
            'Execute tractor rotary raking into concentrated windrows, followed by high-density baler compression into standardized round/rectangular bales.',
          descriptionHi:
            'ट्रैक्टर रेक से पराली को कतारों में इकट्ठा करें और फिर बेलर मशीन से मजबूत गांठों (बंडलों) में बांधें।',
          responsibility: 'operator',
          responsibilityLabel: 'Machinery Operator',
          responsibilityLabelHi: 'मशीन चालक',
          targetDayOffset: 3,
          status: 'not_started',
          guidanceNotes: 'Average output is 25–30 round bales (or 40 rectangular bales) per acre.',
          guidanceNotesHi: 'औसतन प्रति एकड़ 25-30 राउंड बेल या 40 आयताकार गांठें बनती हैं।',
        },
        {
          id: 'step-baling-4',
          stepNumber: 4,
          title: 'Bale Cartage & Field Perimeter Clearance',
          titleHi: 'गांठों की लोडिंग एवं खेत से बाहर ढुलाई',
          description:
            'Load bales onto transport trolleys/loaders and evacuate all straw bales completely beyond the field perimeter to the collection depot.',
          descriptionHi:
            'बनी हुई गांठों को ट्रैक्टर-ट्राली पर लोड करके खेत की सीमा से बाहर संग्रह केंद्र तक पहुंचाएं।',
          responsibility: 'transport_operator',
          responsibilityLabel: 'Contractor & Transport Crew',
          responsibilityLabelHi: 'ठेकेदार व ट्रांसपोर्ट टीम',
          targetDayOffset: 4,
          status: 'not_started',
          guidanceNotes: 'Ensure no stray bales are abandoned along field bunds.',
          guidanceNotesHi: 'खेत की मेड़ों पर कोई भी बेल न छूटे यह सुनिश्चित करें।',
        },
        {
          id: 'step-baling-5',
          stepNumber: 5,
          title: 'Field Inspection & Conventional Sowing Prep',
          titleHi: 'खेत का निरीक्षण एवं पारंपरिक बुवाई तैयारी',
          description:
            'Inspect cleared field for complete straw evacuation; proceed with standard rotavator or zero-till seed drill preparation for wheat sowing.',
          descriptionHi:
            'खेत पूरी तरह साफ होने की पुष्टि करें; इसके बाद पारंपरिक रोटावेटर या ड्रिल से अगली फसल की बुवाई शुरू करें।',
          responsibility: 'farmer',
          responsibilityLabel: 'Farmer',
          responsibilityLabelHi: 'किसान',
          targetDayOffset: 5,
          status: 'not_started',
          guidanceNotes: 'Field is now 100% clean for conventional tillage implements.',
          guidanceNotesHi: 'खेत अब सामान्य बुवाई यंत्रों के लिए पूरी तरह तैयार है।',
        },
      ];

    case 'biomass_utilization':
      return [
        {
          id: 'step-biomass-1',
          stepNumber: 1,
          title: 'Biomass Aggregator Gate Slot & Tariff Agreement',
          titleHi: 'बायोमास केंद्र डिलीवरी स्लॉट एवं दर अनुबंध',
          description: `Register planned delivery tonnage with ${targetResourceName} and lock in accepted straw gate rate (₹150–₹180/quintal benchmark).`,
          descriptionHi: `${targetResourceName} से संपर्क करके आपूर्ति स्लॉट बुक करें और फैक्ट्री गेट दर (₹150–₹180/क्विंटल मानक) तय करें।`,
          responsibility: 'farmer',
          responsibilityLabel: 'Farmer & Aggregator',
          responsibilityLabelHi: 'किसान व बायोमास खरीदार',
          targetDayOffset: 1,
          status: 'not_started',
          guidanceNotes: 'Obtain designated delivery dates to avoid long truck queues at the weighbridge.',
          guidanceNotesHi: 'तौल कांटे पर लंबी कतार से बचने के लिए पूर्व निर्धारित डिलीवरी समय लें।',
        },
        {
          id: 'step-biomass-2',
          stepNumber: 2,
          title: 'Moisture Testing for Factory Gate Compliance',
          titleHi: 'नमी परीक्षण (18% से कम मानक)',
          description:
            'Verify that straw moisture content is strictly below 18% using a digital moisture meter to avoid load penalties or gate rejection.',
          descriptionHi:
            'डिजिटल नमी मीटर से जांचें कि पराली में नमी 18% से कम हो, ताकि फैक्ट्री गेट पर माल अस्वीकार न हो।',
          responsibility: 'farmer',
          responsibilityLabel: 'Farmer & Quality Inspector',
          responsibilityLabelHi: 'किसान व गुणवत्ता परीक्षक',
          targetDayOffset: 2,
          status: 'not_started',
          guidanceNotes: 'Dry sunny days are required; avoid baling early in the morning when dew is heavy.',
          guidanceNotesHi: 'सुबह की ओस सूखने के बाद धूप में ही बेलिंग करवाएं।',
        },
        {
          id: 'step-biomass-3',
          stepNumber: 3,
          title: 'High-Density Baling & Roadside Staging',
          titleHi: 'सघन बेलिंग एवं सड़क किनारे सुरक्षित भंडारण',
          description:
            'Compress straw into dense transportable bales and stage them at an accessible roadside pickup point for truck loading.',
          descriptionHi:
            'पराली की सघन गांठें बनाकर उन्हें मुख्य सड़क या ट्रैक्टर-ट्राली पहुंचने योग्य स्थान पर इकट्ठा करें।',
          responsibility: 'operator',
          responsibilityLabel: 'Machinery Operator',
          responsibilityLabelHi: 'मशीन चालक',
          targetDayOffset: 3,
          status: 'not_started',
          guidanceNotes: 'Cover staged bales with tarpaulins if unseasonal rain is forecast.',
          guidanceNotesHi: 'बारिश की आशंका हो तो गांठों को तिरपाल से ढकें।',
        },
        {
          id: 'step-biomass-4',
          stepNumber: 4,
          title: 'Dispatch, Weighbridge Gross-Tare & Unloading',
          titleHi: 'डिस्पैच, धर्मकांटा तौल एवं अनलोडिंग',
          description:
            'Coordinate tractor-trolley or truck transit to the aggregator weighbridge, capture certified gross-tare weight, and unload straw.',
          descriptionHi:
            'ट्राली को बायोमास केंद्र भेजें, अधिकृत कांटे पर खाली व भरी ट्राली का वजन करवाएं और माल अनलोड करें।',
          responsibility: 'transport_operator',
          responsibilityLabel: 'Transport Logistics Team',
          responsibilityLabelHi: 'ट्रांसपोर्ट व तौल टीम',
          targetDayOffset: 5,
          status: 'not_started',
          guidanceNotes: 'Retain signed weighment slip showing net metric tonnes delivered.',
          guidanceNotesHi: 'नेट टन वजन दर्शाने वाली अधिकृत तौल पर्ची संभाल कर रखें।',
        },
        {
          id: 'step-biomass-5',
          stepNumber: 5,
          title: 'Payment Settlement Receipt & Field Verification',
          titleHi: 'भुगतान रसीद / पर्ची सत्यापन एवं खेत निकासी',
          description:
            'Collect official delivery receipt, verify payment credit or transport fee offset, and confirm field is clear for next sowing.',
          descriptionHi:
            'डिलीवरी रसीद प्राप्त करें, बैंक खाते में भुगतान की पुष्टि करें और खेत खाली होने का सत्यापन करें।',
          responsibility: 'farmer',
          responsibilityLabel: 'Farmer',
          responsibilityLabelHi: 'किसान',
          targetDayOffset: 6,
          status: 'not_started',
          guidanceNotes: 'Record final net revenue or clearance cost in your seasonal farm ledger.',
          guidanceNotesHi: 'अपने कृषि खाते में अंतिम आय अथवा ढुलाई खर्च दर्ज करें।',
        },
      ];

    case 'biological_decomposition':
      return [
        {
          id: 'step-bio-1',
          stepNumber: 1,
          title: 'Procure Microbial Consortium & Prepare Jaggery Solution',
          titleHi: 'पूसा डीकंपोजर व गुड़-बेसन घोल तैयार करना',
          description:
            'Procure certified Pusa bio-decomposer capsules or liquid microbial consortium. Brew with 2 kg jaggery and 2 kg chickpea flour in 200L water for 4–5 days.',
          descriptionHi:
            'प्रमाणित पूसा बायो-डीकंपोजर लेकर 200 लीटर पानी में 2 किलो गुड़ और 2 किलो बेसन मिलाकर 4-5 दिन तक सक्रिय घोल तैयार करें।',
          responsibility: 'farmer',
          responsibilityLabel: 'Farmer',
          responsibilityLabelHi: 'किसान',
          targetDayOffset: 0,
          status: 'not_started',
          guidanceNotes: 'Stir solution daily; white microbial film on surface indicates active culture.',
          guidanceNotesHi: 'घोल को रोजाना डंडे से हिलाएं; सतह पर सफेद परत आने का मतलब जीवाणु सक्रिय हैं।',
        },
        {
          id: 'step-bio-2',
          stepNumber: 2,
          title: 'Chop Standing Stubble Post-Harvest',
          titleHi: 'कंबाइन के बाद स्ट्रॉ चॉपर चलाना',
          description:
            'Run a tractor-mounted straw chopper or mulcher immediately after harvest to chop stubble down to 8–10 cm pieces for maximum microbial surface contact.',
          descriptionHi:
            'कटाई के तुरंत बाद स्ट्रॉ चॉपर या मल्चर चलाएं ताकि पराली 8-10 सेमी के टुकड़ों में कट जाए।',
          responsibility: 'operator',
          responsibilityLabel: 'Machinery Operator',
          responsibilityLabelHi: 'मशीन चालक',
          targetDayOffset: 1,
          status: 'not_started',
          guidanceNotes: 'Smaller stubble size speeds up microbial decomposition by 35%.',
          guidanceNotesHi: 'पराली जितनी बारीक कटेगी, जीवाणु उतनी ही तेजी से खाद बनाएंगे।',
        },
        {
          id: 'step-bio-3',
          stepNumber: 3,
          title: 'Uniform Spraying of Activated Suspension',
          titleHi: 'तैयार डीकंपोजर घोल का समान स्प्रे',
          description:
            'Spray 200–250 litres of activated microbial suspension per acre evenly across the chopped residue using a tractor boom sprayer or foot sprayer.',
          descriptionHi:
            'ट्रैक्टर बूम स्प्रेयर से प्रति एकड़ 200-250 लीटर तैयार घोल का कटी पराली पर समान रूप से छिड़काव करें।',
          responsibility: 'farmer',
          responsibilityLabel: 'Farmer & Sprayer Operator',
          responsibilityLabelHi: 'किसान व स्प्रे चालक',
          targetDayOffset: 2,
          status: 'not_started',
          guidanceNotes: 'Spray during morning or late afternoon to shield live fungi from harsh direct midday UV.',
          guidanceNotesHi: 'तेज धूप से बचने के लिए छिड़काव सुबह या शाम के समय करें।',
        },
        {
          id: 'step-bio-4',
          stepNumber: 4,
          title: 'Shallow Rotavator Incorporation (5 cm depth)',
          titleHi: 'हल्का रोटावेटर चलाकर मिट्टी में मिलाना',
          description:
            'Immediately follow spray application with a shallow rotavator pass (5 cm depth) to blend the microbial culture directly with soil and chopped straw.',
          descriptionHi:
            'स्प्रे के तुरंत बाद हल्का रोटावेटर (5 सेमी गहराई) चलाएं ताकि जीवाणु मिट्टी और पराली के संपर्क में आ जाएं।',
          responsibility: 'operator',
          responsibilityLabel: 'Machinery Operator',
          responsibilityLabelHi: 'मशीन चालक',
          targetDayOffset: 3,
          status: 'not_started',
          guidanceNotes: 'Do not till deeper than 5–7 cm to keep beneficial aerobic fungi in the topsoil.',
          guidanceNotesHi: 'ज्यादा गहरी जुताई न करें ताकि जीवाणु ऊपरी मिट्टी में ही सक्रिय रहें।',
        },
        {
          id: 'step-bio-5',
          stepNumber: 5,
          title: 'Rauni Irrigation & Decomposition Window Monitoring',
          titleHi: 'पलेवा (सिंचाई) एवं 20-25 दिन सड़न निगरानी',
          description:
            'Apply light Rauni irrigation (पलेवा) within 24 hours to establish 60% soil moisture; allow 20–25 warm days for complete enzymatic digestion into field compost.',
          descriptionHi:
            '24 घंटे के भीतर खेत में हल्का पानी (पलेवा) दें ताकि नमी बनी रहे; पराली को खाद बनने के लिए 20-25 दिन का समय दें।',
          responsibility: 'farmer',
          responsibilityLabel: 'Farmer',
          responsibilityLabelHi: 'किसान',
          targetDayOffset: 4,
          status: 'not_started',
          guidanceNotes: 'Do not sow subsequent crop until stubble becomes dark, brittle, and easily crushed.',
          guidanceNotesHi: 'जब पराली काली और भुरभुरी होकर हाथ से टूटने लगे, तभी अगली बुवाई करें।',
        },
      ];

    default:
      return generateActionPlanSteps('in_situ_incorporation', _harvestDate, _sowingDate, resourceName);
  }
}

/**
 * Calculate a calendar target date based on a reference harvest date and offset in days.
 * Returns ISO YYYY-MM-DD string or undefined if invalid.
 */
export function calculateTargetDate(referenceDateStr: string, offsetDays: number): string {
  if (!referenceDateStr) return '';
  try {
    const d = new Date(referenceDateStr);
    if (isNaN(d.getTime())) return '';
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
}

/**
 * Format date for friendly human reading in English or Hindi
 */
export function formatDisplayDate(dateStr: string, lang: 'en' | 'hi'): string {
  if (!dateStr) return lang === 'hi' ? 'तारीख अनुपलब्ध' : 'Date not set';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
