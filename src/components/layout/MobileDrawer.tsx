import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { X, Sprout, ChevronRight, User } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser } = useAuth();
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const navLinks = [
    { href: '/home', labelKey: 'navHome' as const, desc: 'Overview & field status' },
    { href: '/assess', labelKey: 'navAssess' as const, desc: 'Field situation & sowing date' },
    { href: '/compare', labelKey: 'navCompare' as const, desc: 'In-situ vs Ex-situ trade-offs' },
    { href: '/resources', labelKey: 'navResources' as const, desc: 'Local CHCs & baler directory' },
    { href: '/action-plan', labelKey: 'navActionPlan' as const, desc: 'Step-by-step field checklist' },
    { href: '/impact', labelKey: 'navImpact' as const, desc: 'Residue & operational metrics' },
    { href: '/history', labelKey: 'navHistory' as const, desc: 'Past seasonal assessments' },
    { href: '/login', labelKey: 'navLogin' as const, desc: 'Switch demo farmer profile' },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-soil-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-parchment-50 border-l border-field-border flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 border-b border-field-border bg-parchment-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-sm bg-agri-forest flex items-center justify-center text-white">
              <Sprout className="w-4 h-4" />
            </div>
            <span className="font-serif font-bold text-soil-900 text-sm">
              {t('brandName')}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation drawer"
            className="w-11 h-11 flex items-center justify-center text-soil-700 hover:bg-parchment-200 border border-field-border"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Demo Profile Banner */}
        <div className="p-3 border-b border-field-border bg-parchment-100/70 text-xs">
          <div className="flex items-center space-x-1.5 text-soil-600 mb-1">
            <User className="w-3.5 h-3.5 text-agri-forest" />
            <span className="font-mono uppercase text-[10px] text-soil-500">Active Profile</span>
          </div>
          <p className="font-medium text-soil-900">
            {language === 'hi' ? currentUser.nameHi : currentUser.name}
          </p>
          <p className="text-[11px] text-soil-600">
            {language === 'hi'
              ? `${currentUser.location.villageHi}, ${currentUser.location.districtHi}`
              : `${currentUser.location.village}, ${currentUser.location.district}`}
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-2 px-3 divide-y divide-field-border/60">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center justify-between py-3.5 px-2.5 transition-colors ${
                  isActive
                    ? 'bg-agri-forest-50 border-l-4 border-agri-forest text-agri-forest font-semibold'
                    : 'text-soil-900 hover:bg-parchment-100'
                }`}
              >
                <div>
                  <div className="text-sm font-medium">{t(item.labelKey)}</div>
                  <div className="text-[11px] text-soil-500">{item.desc}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-soil-400" />
              </Link>
            );
          })}
        </div>

        {/* Language Selection Footer */}
        <div className="p-4 border-t border-field-border bg-parchment-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-soil-600 uppercase">
              {t('switchLanguageLabel')}
            </span>
            <Badge variant="demo">Demo</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`py-2.5 px-3 text-xs font-medium border text-center transition-colors ${
                language === 'en'
                  ? 'bg-agri-forest text-white border-agri-forest-800 font-semibold'
                  : 'bg-parchment-50 text-soil-800 border-field-border hover:bg-parchment-200'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`py-2.5 px-3 text-xs font-medium border text-center transition-colors ${
                language === 'hi'
                  ? 'bg-agri-forest text-white border-agri-forest-800 font-semibold'
                  : 'bg-parchment-50 text-soil-800 border-field-border hover:bg-parchment-200'
              }`}
            >
              हिन्दी (Hindi)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
