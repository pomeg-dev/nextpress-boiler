'use client';

import { CookiePreferences } from '@/lib/types';
import Button from '@ui/components/atoms/Button';
import { deleteAllCookies, getCookie, setCookie } from '@ui/utils/cookies';
import React, { useState, useEffect } from 'react';

interface CookieBannerProps {
  companyName?: string;
  onAcceptAll?: (preferences: CookiePreferences) => void;
  onDecline?: (preferences: CookiePreferences) => void;
  onSavePreferences?: (preferences: CookiePreferences) => void;
  showBanner?: boolean;
}

const CookieBanner: React.FC<CookieBannerProps> = ({
  companyName = "Your Company",
  onAcceptAll,
  onDecline,
  onSavePreferences,
  showBanner = false
}) => {
  const [isVisible, setIsVisible] = useState(showBanner);
  const [showPreferences, setShowPreferences] = useState(showBanner);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    const cookieConsent = getCookie('cookie-consent');
    if (!cookieConsent) {
      setIsVisible(true);
    } else {
      setPreferences(JSON.parse(cookieConsent));
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    
    setCookie('cookie-consent', JSON.stringify(allAccepted));
    setCookie('cookie-consent-date', new Date().toISOString());
    
    setIsVisible(false);
    onAcceptAll?.(allAccepted);
  };

  const handleDecline = () => {
    const declined = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    
    deleteAllCookies();
    setCookie('cookie-consent', JSON.stringify(declined));
    setCookie('cookie-consent-date', new Date().toISOString());
    
    setIsVisible(false);
    onDecline?.(declined);
  };

  const handleSavePreferences = () => {
    setCookie('cookie-consent', JSON.stringify(preferences));
    setCookie('cookie-consent-date', new Date().toISOString());
    
    setIsVisible(false);
    onSavePreferences?.(preferences);
  };

  const handlePreferenceChange = (type: keyof CookiePreferences) => {
    if (type === 'necessary') return;
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner fixed inset-0 z-50 flex items-end justify-end bg-black bg-opacity-50 p-8">
      <div className="max-h-[90vh] w-full max-w-[400px] overflow-y-auto bg-white">
        <div className="p-6">
          <h2 className="!mb-2 !text-heading-sm">
            {companyName} uses cookies
          </h2>
          
          <p className="mb-6 text-primary/70">
            We use cookies on this website to help us understand how we can better it for our students. Some cookies are used for analytical purposes and others are set up by third party services.
          </p>

          {!showPreferences ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                onClick={handleAcceptAll}
                size='sm'
              >
                Accept All
              </Button>
              
              <Button
                type="button"
                onClick={() => setShowPreferences(true)}
                size='sm'
                style='secondary'
              >
                Manage Cookies
              </Button>
              
              
              <Button
                type="button"
                onClick={handleDecline}
                size='sm'
                style='secondary'
              >
                Decline
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
                  <div>
                    <h3 className="!text-heading-xs">Necessary Cookies</h3>
                    <p className="text-sm">Required for the website to function properly</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="sr-only"
                    />
                    <div className="h-6 w-12 rounded-full bg-primary shadow-inner">
                      <div className="h-5 w-5 translate-x-6 translate-y-0.5 transform rounded-full bg-white shadow"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
                  <div>
                    <h3 className="!text-heading-xs">Analytics Cookies</h3>
                    <p className="text-sm">Help us understand how visitors interact with our website</p>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange('analytics')}
                    className="relative"
                  >
                    <div className={`w-12 h-6 rounded-full shadow-inner transition-colors duration-200 ${
                      preferences.analytics ? 'bg-primary' : 'bg-primary/50'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 translate-y-0.5 ${
                        preferences.analytics ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
                  <div>
                    <h3 className="!text-heading-xs">Marketing Cookies</h3>
                    <p className="text-sm">Used to track visitors across websites for advertising purposes</p>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange('marketing')}
                    className="relative"
                  >
                    <div className={`w-12 h-6 rounded-full shadow-inner transition-colors duration-200 ${
                      preferences.marketing ? 'bg-primary' : 'bg-primary/50'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 translate-y-0.5 ${
                        preferences.marketing ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
                  <div>
                    <h3 className="!text-heading-xs">Functional Cookies</h3>
                    <p className="text-sm">Enable enhanced functionality and personalization</p>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange('functional')}
                    className="relative"
                  >
                    <div className={`w-12 h-6 rounded-full shadow-inner transition-colors duration-200 ${
                      preferences.functional ? 'bg-primary' : 'bg-primary/50'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 translate-y-0.5 ${
                        preferences.functional ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4 sm:flex-row">
                <Button
                  type="button"
                  onClick={handleSavePreferences}
                  size='sm'
                >
                  Save Preferences
                </Button>
                
                <Button
                  type="button"
                  onClick={() => setShowPreferences(false)}
                  size='sm'
                  style='secondary'
                >
                  Back
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;