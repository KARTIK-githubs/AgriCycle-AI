export interface ResourceEntity {
  id: string;
  name: string;
  nameHi: string;
  type: 'chc' | 'biomass_aggregator' | 'baler_operator' | 'pellet_plant';
  state: string;
  district: string;
  village: string;
  coordinates: [number, number]; // [lat, lng]
  contactPerson: string;
  contactPhone: string;
  equipmentAvailable: string[];
  equipmentAvailableHi: string[];
  baseRateBenchmark: string;
  verificationStatus: 'verified_public' | 'demonstration_sample';
  provenanceNote: string;
  supportedPathways: string[];
}

export const SEED_RESOURCES: ResourceEntity[] = [
  // --- KARNAL, HARYANA (Primary Demo Cluster) ---
  {
    id: 'chc-taraori-karnal',
    name: 'Taraori Cooperative Custom Hiring Centre',
    nameHi: 'तरावड़ी सहकारी कस्टम हायरिंग सेंटर',
    type: 'chc',
    state: 'Haryana',
    district: 'Karnal',
    village: 'Taraori Rural',
    coordinates: [29.8021, 76.9298],
    contactPerson: 'Dalbir Singh',
    contactPhone: '+91 98120 44521',
    equipmentAvailable: ['Happy Seeder (3 units)', 'Super SMS Combine Attachment (4 units)', 'Paddy Straw Chopper (2 units)'],
    equipmentAvailableHi: ['हैप्पी सीडर (3 यूनिट)', 'सुपर एसएमएस कंबाइन (4 यूनिट)', 'स्ट्रॉ चॉपर (2 यूनिट)'],
    baseRateBenchmark: '₹1,500 – ₹1,800 / acre',
    verificationStatus: 'verified_public',
    provenanceNote: 'Haryana Dept of Agriculture & Farmers Welfare CRM Public Registry (PACS Taraori)',
    supportedPathways: ['in_situ_incorporation', 'biological_decomposition']
  },
  {
    id: 'chc-indri-karnal',
    name: 'Indri Farmers Agricultural Machinery Bank',
    nameHi: 'इंद्री किसान कृषि यंत्र बैंक',
    type: 'chc',
    state: 'Haryana',
    district: 'Karnal',
    village: 'Indri Block Hub',
    coordinates: [29.8805, 77.0583],
    contactPerson: 'Harpreet Singh Sandhu',
    contactPhone: '+91 94162 11983',
    equipmentAvailable: ['Smart Seeder (4 units)', 'Zero Till Drill (3 units)', 'Reversible MB Plough'],
    equipmentAvailableHi: ['स्मार्ट सीडर (4 यूनिट)', 'जीरो टिल ड्रिल (3 यूनिट)', 'एमबी हल'],
    baseRateBenchmark: '₹1,400 – ₹1,700 / acre',
    verificationStatus: 'demonstration_sample',
    provenanceNote: 'Indri farmer group field sample calibrated for demonstration',
    supportedPathways: ['in_situ_incorporation']
  },
  {
    id: 'agg-gharaunda-karnal',
    name: 'Gharaunda Biomass Aggregation & Baling Hub',
    nameHi: 'घरौंडा बायोमास संग्रह एवं बेलिंग केंद्र',
    type: 'biomass_aggregator',
    state: 'Haryana',
    district: 'Karnal',
    village: 'Gharaunda Highway Link',
    coordinates: [29.5392, 76.9744],
    contactPerson: 'Rajesh Choudhary',
    contactPhone: '+91 98964 88310',
    equipmentAvailable: ['Heavy Round Balers (3 units)', 'Automatic Rakes (2 units)', 'Bale Loader Trucks'],
    equipmentAvailableHi: ['राउंड बेलर (3 यूनिट)', 'ट्रैक्टर रेक (2 यूनिट)', 'बेल लोडर ट्रक'],
    baseRateBenchmark: '₹1,300/acre baling service or ₹160/quintal straw purchase',
    verificationStatus: 'demonstration_sample',
    provenanceNote: 'Gharaunda biomass hub demo sample calibrated from regional contractor tariffs',
    supportedPathways: ['ex_situ_baling', 'biomass_utilization']
  },
  {
    id: 'pellet-panipat-border',
    name: 'Panipat-Karnal Green Bio-Pellet Manufacturing',
    nameHi: 'पानीपत-करनाल ग्रीन बायो-पैलेट संयंत्र',
    type: 'pellet_plant',
    state: 'Haryana',
    district: 'Karnal',
    village: 'Karnal South Industrial Area',
    coordinates: [29.5912, 76.9810],
    contactPerson: 'Vikas Gupta',
    contactPhone: '+91 98124 99012',
    equipmentAvailable: ['Industrial Pelletizers', 'Moisture Testing Stations', 'Straw Weighbridge'],
    equipmentAvailableHi: ['पैलेट मशीन', 'नमी परीक्षण केंद्र', 'धर्मकांटा'],
    baseRateBenchmark: '₹1,750 – ₹1,900 / tonne delivered dry straw',
    verificationStatus: 'demonstration_sample',
    provenanceNote: 'Industrial pellet co-firing plant sample based on Haryana bio-coal purchase benchmarks',
    supportedPathways: ['biomass_utilization']
  },

  // --- SANGRUR & LUDHIANA, PUNJAB ---
  {
    id: 'chc-sunam-sangrur',
    name: 'Sunam Agricultural Cooperative CHC',
    nameHi: 'सुनाम सहकारी कृषि मशीनरी केंद्र',
    type: 'chc',
    state: 'Punjab',
    district: 'Sangrur',
    village: 'Sunam Kalan',
    coordinates: [30.1303, 75.8038],
    contactPerson: 'Manjit Singh Dhillon',
    contactPhone: '+91 98761 22345',
    equipmentAvailable: ['PAU Smart Seeder (5 units)', 'Happy Seeder (4 units)', 'Mulcher (2 units)'],
    equipmentAvailableHi: ['पीएयू स्मार्ट सीडर (5 यूनिट)', 'हैप्पी सीडर (4 यूनिट)', 'मल्चर (2 यूनिट)'],
    baseRateBenchmark: '₹1,500 – ₹1,750 / acre',
    verificationStatus: 'verified_public',
    provenanceNote: 'Punjab State Cooperative Agricultural Society Directory (Sunam PACS)',
    supportedPathways: ['in_situ_incorporation', 'biological_decomposition']
  },
  {
    id: 'baler-jagraon-ludhiana',
    name: 'Jagraon Agro Mechanical Baling Services',
    nameHi: 'जगराओं कृषि बेलिंग सेवाएं',
    type: 'baler_operator',
    state: 'Punjab',
    district: 'Ludhiana',
    village: 'Jagraon Rural',
    coordinates: [30.7850, 75.4789],
    contactPerson: 'Gurwinder Singh Brar',
    contactPhone: '+91 98722 55431',
    equipmentAvailable: ['Square Balers (4 units)', 'Rotary Rakes (3 units)'],
    equipmentAvailableHi: ['स्क्वायर बेलर (4 यूनिट)', 'रोटरी रेक (3 यूनिट)'],
    baseRateBenchmark: '₹1,200 / acre baling fee',
    verificationStatus: 'demonstration_sample',
    provenanceNote: 'Ludhiana commercial baler contractor demo sample',
    supportedPathways: ['ex_situ_baling', 'biomass_utilization']
  },

  // --- MEERUT, WESTERN UTTAR PRADESH ---
  {
    id: 'chc-mawana-meerut',
    name: 'Mawana Kisan Cane Trash & Agro CHC',
    nameHi: 'मवाना किसान गन्ना अवशेष एवं कृषि सीएचसी',
    type: 'chc',
    state: 'Uttar Pradesh',
    district: 'Meerut',
    village: 'Mawana Khurd',
    coordinates: [29.1025, 77.9221],
    contactPerson: 'Suresh Chandra Sharma',
    contactPhone: '+91 94122 88901',
    equipmentAvailable: ['Sugarcane Trash Shredder (3 units)', 'Ratoon Shaver', 'Rotavator (4 units)'],
    equipmentAvailableHi: ['गन्ना अवशेष श्रेडर (3 यूनिट)', 'रेटून शेवर', 'रोटावेटर (4 यूनिट)'],
    baseRateBenchmark: '₹1,400 – ₹1,700 / acre',
    verificationStatus: 'demonstration_sample',
    provenanceNote: 'Western UP cane trash shredder group demo sample',
    supportedPathways: ['in_situ_incorporation', 'biological_decomposition']
  }
];

// District baseline coordinates for rough distance calculations
export const DISTRICT_CENTROIDS: Record<string, [number, number]> = {
  'Karnal': [29.6857, 76.9905],
  'Kaithal': [29.8015, 76.3996],
  'Kurukshetra': [29.9695, 76.8783],
  'Ambala': [30.3782, 76.7767],
  'Panipat': [29.3909, 76.9635],
  'Sangrur': [30.2458, 75.8421],
  'Ludhiana': [30.9010, 75.8573],
  'Patiala': [30.3398, 76.3869],
  'Bathinda': [30.2110, 74.9455],
  'Fatehgarh Sahib': [30.6436, 76.3932],
  'Meerut': [28.9845, 77.7064],
  'Muzaffarnagar': [29.4727, 77.7085],
  'Shamli': [29.4497, 77.3087],
  'Saharanpur': [29.9640, 77.5460],
};

// Haversine distance calculator in kilometers
export function calculateDistanceKm(coord1: [number, number], coord2: [number, number]): number {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
