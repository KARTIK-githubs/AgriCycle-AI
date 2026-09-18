import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Menu, Sprout, ShieldCheck } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser } = useAuth();
  const location = useLocation();

  const navLinks = [
    { href: '/home', labelKey: 'navHome' as const },
    { href: '/assess', labelKey: 'navAssess' as const },
    { href: '/compare', labelKey: 'navCompare' as const },
    { href: '/resources', labelKey: 'navResources' as const },
    { href: '/action-plan', labelKey: 'navActionPlan' as const },
    { href: '/impact', labelKey: 'navImpact' as const },
    { href: '/history', labelKey: 'navHistory' as const },
  ];

  return (
    <header className="sticky top-0 z-40 bg-parchment-50/95 backdrop-blur-xs border-b border-field-border">
      {/* Top Ledger Strip: Demo Indicator & Operational Status */}
      <div className="bg-parchment-100 border-b border-field-border/60 py-1 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-soil-600">
          <div className="flex items-center space-x-2">
            <Badge variant="demo" icon={<ShieldCheck className="w-3 h-3 text-agri-forest" />}>
              {t('demoModeBadge')}
            </Badge>
            <span className="hidden md:inline text-soil-500 font-mono">
              {language === 'hi' ? `${currentUser.nameHi} (${currentUser.location.districtHi})` : `${currentUser.name} (${currentUser.location.district})`}
            </span>
          </div>

          {/* Persistent Bilingual Switcher */}
          <div className="flex items-center space-x-1">
            <span className="text-soil-500 mr-1.5 font-mono uppercase text-[11px]">
              {t('switchLanguageLabel')}:
            </span>
            <div className="inline-flex rounded-xs border border-field-border bg-parchment-50 p-0.5" role="group" aria-label="Language selection">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                aria-pressed={language === 'en'}
                className={`px-2 py-0.5 text-xs font-medium transition-colors ${
                  language === 'en'
                    ? 'bg-agri-forest text-white'
                    : 'text-soil-700 hover:text-soil-900'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                aria-pressed={language === 'hi'}
                className={`px-2 py-0.5 text-xs font-medium transition-colors ${
                  language === 'hi'
                    ? 'bg-agri-forest text-white'
                    : 'text-soil-700 hover:text-soil-900'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand Anchor */}
        <Link to="/" className="group flex items-center space-x-3 focus-visible:outline-agri-forest">
          <div className="w-9 h-9 rounded-sm bg-agri-forest flex items-center justify-center text-white border border-agri-forest-800 transition-transform group-hover:scale-[1.02]">
            <Sprout className="w-5 h-5 text-parchment-50" />
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-soil-900 leading-none">
                {t('brandName')}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-soil-600 font-sans tracking-tight">
              {t('brandSubtitle')}
            </p>
          </div>
        </Link>

        {/* Desktop Primary Navigation */}
        <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-agri-forest text-agri-forest font-semibold'
                    : 'border-transparent text-soil-700 hover:text-soil-900 hover:border-field-border'
                }`}
              >
                {t(link.labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Mobile Menu Trigger */}
        <div className="flex items-center space-x-2">
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center text-xs font-mono font-medium px-3 py-1.5 border border-field-border bg-parchment-100 hover:bg-parchment-200 text-soil-800 transition-colors"
          >
            {t('navLogin')}
          </Link>

          <Link
            to="/assess"
            className="inline-flex items-center text-xs font-medium px-3.5 py-2 bg-agri-forest text-white hover:bg-agri-forest-700 border border-agri-forest-800 shadow-sm"
          >
            {t('heroPrimaryCta')}
          </Link>

          {/* Mobile Drawer Trigger (min 48px touch target) */}
          <button
            type="button"
            onClick={onOpenMobileNav}
            aria-label="Open mobile navigation menu"
            className="lg:hidden w-11 h-11 flex items-center justify-center text-soil-800 hover:bg-parchment-200 border border-field-border ml-1"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
