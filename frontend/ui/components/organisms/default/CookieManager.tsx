'use client';

import { useEffect, useState } from 'react';
import { getCookie } from '@ui/utils/cookies';
import { CookiePreferences } from '@pomeg-dev/nextpress-client/types';
import { usePathname, useSearchParams } from 'next/navigation';
import CookieBanner from './CookieBanner';
import { RawHtml } from './RawHtml';

declare global {
  interface Window {
    dataLayer?: Object[];
    gtag?: (...args: any[]) => void;
  }
}

interface CookieManagerProps {
  settings: {
    blogname?: string,
    google_tag_manager_enabled: boolean;
    google_tag_manager_id: string;
    head_scripts?: string;
    body_opening?: string;
    body_closing?: string;
  };
}

const gtag = (...args: any[]) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
};

const pageview = (url: string) => {
  (window as any).dataLayer?.push({
    event: "pageview",
    page: url,
  });
};

const updateConsent = (preferences: CookiePreferences) => {
  gtag('consent', 'update', {
    'ad_storage': preferences.marketing ? 'granted' : 'denied',
    'analytics_storage': preferences.analytics ? 'granted' : 'denied',
    'ad_user_data': preferences.marketing ? 'granted' : 'denied',
    'ad_personalization': preferences.marketing ? 'granted' : 'denied',
    'personalization_storage': preferences.functional ? 'granted' : 'denied',
    'functionality_storage': preferences.functional ? 'granted' : 'denied',
    'security_storage': preferences.necessary ? 'granted' : 'denied',
  });
};

// Everything starts denied; a stored choice is applied straight after.
const initializeGTM = (gtmId: string, stored: CookiePreferences | null) => {
  // Check if GTM is already initialized
  if (window.dataLayer?.find(item =>
    typeof item === 'object' && item !== null && 'gtm.start' in item
  )) {
    return;
  }

  window.dataLayer = window.dataLayer || [];

  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };

  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'personalization_storage': 'denied',
    'functionality_storage': 'denied',
    'security_storage': 'granted',
    'wait_for_update': 500
  });
  if (stored) updateConsent(stored);

  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
  
  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }

  // Fallback
  const noscript = document.createElement('noscript');
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
  iframe.height = '0';
  iframe.width = '0';
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';
  noscript.appendChild(iframe);
  document.body.appendChild(noscript);
};

export function CookieManager({ settings }: CookieManagerProps) {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { google_tag_manager_enabled: gtmEnabled, google_tag_manager_id: gtmId } = settings;

  useEffect(() => {
    const storedConsent = getCookie('cookie-consent');
    const stored: CookiePreferences | null = storedConsent ? JSON.parse(storedConsent) : null;
    setPreferences(stored);

    // Proceed on production only.
    if (process.env.NODE_ENV !== 'production') return;

    // GTM immediately starts. A placeholder ID (GTM-XXXXXXX) would load ~90 KB
    // of script for a container that doesn't exist.
    if (gtmEnabled && gtmId && !/^GTM-X+$/i.test(gtmId)) {
      initializeGTM(gtmId, stored);
    }
  }, [gtmEnabled, gtmId]);

  // Push pageview.
  useEffect(() => {
    if (pathname) {
      pageview(pathname);
    }
  }, [pathname, searchParams]);

  const handleConsentChange = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);
    updateConsent(newPreferences);
  };

  return (
    <>
      {/* Admin-supplied scripts run only once the user grants functional consent. */}
      {preferences?.functional && (
        <>
          <RawHtml html={settings.head_scripts} target="head" />
          <RawHtml html={settings.body_opening} target="body-start" />
          <RawHtml html={settings.body_closing} target="body-end" />
        </>
      )}
      <CookieBanner
        companyName={settings.blogname || "Nextpress"}
        onAcceptAll={handleConsentChange}
        onDecline={handleConsentChange}
        onSavePreferences={handleConsentChange}
      />
    </>
  );
}