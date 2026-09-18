import React, { createContext, useContext, useState } from 'react';
import { DemoUser } from '../types';

export const DEMO_PROFILES: DemoUser[] = [
  {
    id: 'gurpreet-karnal',
    name: 'Gurpreet Singh',
    nameHi: 'गुरप्रीत सिंह',
    role: 'Paddy Smallholder',
    roleHi: 'धान उत्पादक छोटे किसान',
    location: {
      village: 'Taraori Rural',
      villageHi: 'तरावड़ी ग्रामीण',
      district: 'Karnal',
      districtHi: 'करनाल',
      state: 'Haryana',
      stateHi: 'हरियाणा'
    },
    crop: 'Paddy (Basmati / PR-126)',
    cropHi: 'धान (बासमती / पीआर-126)',
    acreage: 8,
    machinery: 'None (Relies on CHC rental)',
    machineryHi: 'कोई नहीं (सीएचसी किराए पर निर्भर)',
    defaultResidueTonnes: 5.0
  },
  {
    id: 'balwinder-sangrur',
    name: 'Balwinder Singh',
    nameHi: 'बलविंदर सिंह',
    role: 'Medium Paddy Grower',
    roleHi: 'मध्यम धान उत्पादक',
    location: {
      village: 'Sunam Kalan',
      villageHi: 'सुनाम कलां',
      district: 'Sangrur',
      districtHi: 'संगरूर',
      state: 'Punjab',
      stateHi: 'पंजाब'
    },
    crop: 'Paddy (PUSA 44)',
    cropHi: 'धान (पूसा 44)',
    acreage: 15,
    machinery: '50HP Standard Tractor',
    machineryHi: '50 एचपी सामान्य ट्रैक्टर',
    defaultResidueTonnes: 9.5
  },
  {
    id: 'ramesh-meerut',
    name: 'Ramesh Kumar',
    nameHi: 'रमेश कुमार',
    role: 'Sugarcane & Cereal Grower',
    roleHi: 'गन्ना व अनाज उत्पादक',
    location: {
      village: 'Mawana Khurd',
      villageHi: 'मवाना खुर्द',
      district: 'Meerut',
      districtHi: 'मेरठ',
      state: 'Uttar Pradesh',
      stateHi: 'उत्तर प्रदेश'
    },
    crop: 'Sugarcane Trash & Ratoon',
    cropHi: 'गन्ने की पत्तियां व अवशेष',
    acreage: 6,
    machinery: '45HP Tractor + Cultivator',
    machineryHi: '45 एचपी ट्रैक्टर + कल्टीवेटर',
    defaultResidueTonnes: 4.2
  }
];

interface AuthContextType {
  currentUser: DemoUser;
  setCurrentUserById: (id: string) => void;
  resetDemoSession: () => void;
  allProfiles: DemoUser[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<DemoUser>(() => {
    const saved = localStorage.getItem('agricycle_demo_user');
    if (saved) {
      const found = DEMO_PROFILES.find(p => p.id === saved);
      if (found) return found;
    }
    return DEMO_PROFILES[0]; // Default to Gurpreet Singh (Karnal)
  });

  const setCurrentUserById = (id: string) => {
    const found = DEMO_PROFILES.find(p => p.id === id);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('agricycle_demo_user', found.id);
    }
  };

  const resetDemoSession = () => {
    setCurrentUser(DEMO_PROFILES[0]);
    localStorage.removeItem('agricycle_demo_user');
    localStorage.removeItem('agricycle_current_assessment');
    localStorage.removeItem('agricycle_assessments');
    localStorage.removeItem('agricycle_selected_pathway_id');
    localStorage.removeItem('agricycle_selected_resource_id');
    localStorage.removeItem('agricycle_checklist_steps');
    localStorage.removeItem('agricycle_impact_records');
    localStorage.removeItem('agricycle_current_impact');
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUserById, resetDemoSession, allProfiles: DEMO_PROFILES }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
