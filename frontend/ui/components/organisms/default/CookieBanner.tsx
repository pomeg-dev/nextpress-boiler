'use client';

import { CookiePreferences } from '@pomeg-dev/nextpress-client/types';
import Button from '@ui/components/atoms/Button';
import { deleteAllCookies, getCookie, setCookie } from '@ui/utils/cookies';
import React, { useState, useEffect, useId } from 'react';

interface CookieBannerProps {
  companyName?: string;
  onAcceptAll?: (preferences: CookiePreferences) => void;
  onDecline?: (preferences: CookiePreferences) => void;
  onSavePreferences?: (preferences: CookiePreferences) => void;
  showBanner?: boolean;
}

const OPTIONS: { key: keyof CookiePreferences; title: string; text: string }[] = [
  { key: 'necessary', title: 'Necessary', text: 'Keep the site working. Always on.' },
  { key: 'analytics', title: 'Analytics', text: 'Show us how visitors use the site.' },
  { key: 'marketing', title: 'Marketing', text: 'Let ad partners recognise you across sites.' },
  { key: 'functional', title: 'Functional', text: 'Turn on extra features and embedded services.' },
];

const CookieBanner: React.FC<CookieBannerProps> = ({
  companyName = "Your Company",
  onAcceptAll,
  onDecline,
  onSavePreferences,
  showBanner = false
}) => {
  const id = useId();
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

  // Non-modal: the page stays usable until the visitor chooses.
  return (
    <section
      className="cookie-banner cookie-panel"
      data-theme="dark"
      aria-labelledby={`${id}-title`}
    >
      <h2 id={`${id}-title`} className="heading-xs !mb-2">
        {companyName} uses cookies
      </h2>
      <p className="body-sm text-muted mb-md">
        We use cookies to understand how the site is used and to run optional services. Choose what you allow.
      </p>

      {!showPreferences ? (
        <div className="flex flex-wrap gap-xs">
          <Button type="button" onClick={handleAcceptAll} size="md">
            Accept all
          </Button>
          <Button type="button" onClick={handleDecline} size="md" style="secondary">
            Decline
          </Button>
          <Button type="button" onClick={() => setShowPreferences(true)} size="md" style="no-fill">
            Manage cookies
          </Button>
        </div>
      ) : (
        <>
          <ul className="mb-md border-b border-rule">
            {OPTIONS.map(({ key, title, text }) => {
              const locked = key === 'necessary';
              return (
                <li key={key}>
                  <button
                    type="button"
                    role="switch"
                    className="cookie-option"
                    aria-checked={locked ? true : preferences[key]}
                    aria-disabled={locked || undefined}
                    aria-labelledby={`${id}-${key}`}
                    aria-describedby={`${id}-${key}-text`}
                    onClick={() => handlePreferenceChange(key)}
                  >
                    <span>
                      <span id={`${id}-${key}`} className="block font-medium">{title}</span>
                      <span id={`${id}-${key}-text`} className="block body-sm text-muted">{text}</span>
                    </span>
                    <span className="switch-track" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap gap-xs">
            <Button type="button" onClick={handleSavePreferences} size="md">
              Save preferences
            </Button>
            <Button type="button" onClick={() => setShowPreferences(false)} size="md" style="secondary">
              Back
            </Button>
          </div>
        </>
      )}
    </section>
  );
};

export default CookieBanner;
