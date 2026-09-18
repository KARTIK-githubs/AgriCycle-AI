import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAssessment } from '../context/AssessmentContext';
import { 
  User, 
  MapPin, 
  Tractor, 
  Wheat, 
  ArrowRight, 
  ShieldAlert, 
  RotateCcw, 
  Check
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';

export const LoginPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { currentUser, setCurrentUserById, resetDemoSession, allProfiles } = useAuth();
  const { resetAllAssessments } = useAssessment();
  const navigate = useNavigate();
  const [resetMessage, setResetMessage] = useState(false);

  const handleSelectProfile = (profileId: string) => {
    setCurrentUserById(profileId);
    navigate('/home');
  };

  const handleResetSession = () => {
    resetDemoSession();
    resetAllAssessments();
    setResetMessage(true);
    setTimeout(() => setResetMessage(false), 3000);
  };

  return (
    <div className="py-8 sm:py-12">
      <Container size="md">
        {/* Page Header */}
        <div className="border-b border-field-border pb-6 mb-8">
          <div className="flex items-center space-x-2 text-xs font-mono text-soil-500 uppercase tracking-wider mb-1.5">
            <User className="w-3.5 h-3.5 text-agri-forest" />
            <span>Demonstration Access Gateway</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-soil-900 tracking-tight">
            {t('loginPageTitle')}
          </h1>
          <p className="text-sm text-soil-600 font-sans mt-2 max-w-2xl leading-relaxed">
            {t('loginPageSubtitle')}
          </p>
        </div>

        {/* Demo Notice Banner */}
        <div className="p-4 bg-parchment-100 border border-field-border rounded-xs mb-8 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-harvest-amber shrink-0 mt-0.5" />
          <div className="text-xs text-soil-700 leading-relaxed font-sans">
            <span className="font-semibold text-soil-900 font-mono uppercase block mb-0.5">
              Notice: Local Demonstration Environment
            </span>
            {t('loginNoticeBanner')}
          </div>
        </div>

        {resetMessage && (
          <div className="p-3 mb-6 bg-agri-forest-50 border border-agri-forest-600/40 text-agri-forest-900 text-xs font-mono flex items-center">
            <Check className="w-4 h-4 mr-2 text-agri-forest" />
            {t('resetSessionConfirm')}
          </div>
        )}

        {/* Profile Ledger List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-field-border">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-soil-700">
              Select a Representative Farmer Profile:
            </h2>
            <span className="text-xs font-mono text-soil-500">
              3 Northern Plains Clusters
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allProfiles.map((profile) => {
              const isActive = currentUser.id === profile.id;

              return (
                <div
                  key={profile.id}
                  className={`bg-parchment-100 border p-5 rounded-xs flex flex-col justify-between transition-all ${
                    isActive
                      ? 'border-agri-forest ring-1 ring-agri-forest bg-agri-forest-50/20'
                      : 'border-field-border hover:border-soil-500'
                  }`}
                >
                  <div>
                    {/* Top status indicator */}
                    <div className="flex items-center justify-between mb-3 text-xs font-mono">
                      <span className="text-soil-500">
                        {language === 'hi' ? profile.roleHi : profile.role}
                      </span>
                      {isActive && (
                        <Badge variant="verified">
                          {language === 'hi' ? 'सक्रिय' : 'Active'}
                        </Badge>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="font-serif text-lg font-bold text-soil-900 mb-1">
                      {language === 'hi' ? profile.nameHi : profile.name}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center text-xs text-soil-600 font-mono mb-4">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-agri-forest" />
                      <span>
                        {language === 'hi'
                          ? `${profile.location.villageHi}, ${profile.location.districtHi}, ${profile.location.stateHi}`
                          : `${profile.location.village}, ${profile.location.district}, ${profile.location.state}`}
                      </span>
                    </div>

                    {/* Specific operational attributes */}
                    <div className="space-y-2 py-3 border-t border-b border-field-border/70 text-xs font-sans">
                      <div className="flex items-center text-soil-700">
                        <Wheat className="w-3.5 h-3.5 mr-2 text-harvest-amber shrink-0" />
                        <span>
                          <strong>{language === 'hi' ? 'फसल:' : 'Crop:'}</strong>{' '}
                          {language === 'hi' ? profile.cropHi : profile.crop}
                        </span>
                      </div>
                      <div className="flex items-center text-soil-700">
                        <span className="w-3.5 text-center font-mono font-bold mr-2 text-soil-500">#</span>
                        <span>
                          <strong>{language === 'hi' ? 'रकबा:' : 'Land:'}</strong>{' '}
                          {profile.acreage} {language === 'hi' ? 'एकड़' : 'Acres'}
                        </span>
                      </div>
                      <div className="flex items-center text-soil-700">
                        <Tractor className="w-3.5 h-3.5 mr-2 text-soil-500 shrink-0" />
                        <span>
                          <strong>{language === 'hi' ? 'मशीनरी:' : 'Machinery:'}</strong>{' '}
                          {language === 'hi' ? profile.machineryHi : profile.machinery}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="pt-5 mt-2">
                    <button
                      type="button"
                      onClick={() => handleSelectProfile(profile.id)}
                      className={`w-full py-2.5 px-3 text-xs font-medium rounded-xs border flex items-center justify-center transition-colors min-h-[44px] ${
                        isActive
                          ? 'bg-agri-forest text-white border-agri-forest-800 hover:bg-agri-forest-700'
                          : 'bg-parchment-50 text-soil-900 border-field-border hover:bg-parchment-200'
                      }`}
                    >
                      <span>
                        {isActive
                          ? (language === 'hi' ? 'होम पर जारी रखें' : 'Continue to Farmer Home')
                          : t('selectProfileBtn')}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reset Session Option */}
          <div className="pt-8 border-t border-field-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-soil-600">
            <div>
              <p className="font-semibold text-soil-800 uppercase mb-0.5">Need a clean slate?</p>
              <p className="text-soil-500 font-sans">
                Clears all stored demo assessments and returns the profile to Karnal baseline.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetSession}
              className="inline-flex items-center px-3.5 py-2 text-xs font-medium border border-field-border bg-parchment-100 hover:bg-parchment-200 text-soil-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              {t('resetSessionBtn')}
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};
