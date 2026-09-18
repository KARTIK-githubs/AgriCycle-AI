import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Sprout, Globe, Compass } from 'lucide-react';
import { Container } from '../ui/Container';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-parchment-100 border-t border-field-border text-soil-800 py-12 mt-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-field-border">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-agri-forest flex items-center justify-center text-white rounded-xs">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-soil-900 tracking-tight">
                {t('brandName')}
              </span>
            </div>
            <p className="text-xs text-soil-600 max-w-md leading-relaxed font-sans">
              {t('footerDisclaimer')}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center text-[11px] font-mono px-2 py-0.5 bg-parchment-200 border border-field-border text-soil-700">
                <Globe className="w-3 h-3 mr-1 text-agri-forest" /> SDG 12: Responsible Consumption
              </span>
              <span className="inline-flex items-center text-[11px] font-mono px-2 py-0.5 bg-parchment-200 border border-field-border text-soil-700">
                <Compass className="w-3 h-3 mr-1 text-agri-forest" /> SDG 13: Climate Action
              </span>
            </div>
          </div>

          {/* Quick Workflows */}
          <div>
            <h4 className="font-mono text-xs font-semibold text-soil-900 uppercase tracking-wider mb-3">
              Workflow Steps
            </h4>
            <ul className="space-y-2 text-xs text-soil-600">
              <li>
                <Link to="/assess" className="hover:text-agri-forest transition-colors">
                  1. Residue Assessment
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-agri-forest transition-colors">
                  2. Compare Feasible Pathways
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-agri-forest transition-colors">
                  3. Nearby Custom Hiring Centres
                </Link>
              </li>
              <li>
                <Link to="/action-plan" className="hover:text-agri-forest transition-colors">
                  4. Field Action Plan
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-agri-forest transition-colors">
                  5. Impact Ledger
                </Link>
              </li>
            </ul>
          </div>

          {/* Demonstration Notice */}
          <div>
            <h4 className="font-mono text-xs font-semibold text-soil-900 uppercase tracking-wider mb-3">
              Regional Calibration
            </h4>
            <p className="text-xs text-soil-600 leading-relaxed">
              Configured for Haryana (Karnal, Kaithal), Punjab (Sangrur, Ludhiana), and Western UP (Meerut).
            </p>
            <p className="text-[11px] text-soil-500 mt-2 font-mono">
              Status: Demonstration & Field Test Prototype v1.0
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-soil-500 font-mono">
          <p>© {new Date().getFullYear()} AgriCycle Assistant • Dedicated to Sustainable Northern Plains Farming</p>
          <p className="mt-2 sm:mt-0">Field Decision Engine • Zero-Stubble Open Burning Mission</p>
        </div>
      </Container>
    </footer>
  );
};
