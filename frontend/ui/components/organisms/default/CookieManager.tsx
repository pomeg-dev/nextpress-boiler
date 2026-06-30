'use client';

import { useEffect, useState } from 'react';
import { getCookie } from '@ui/utils/cookies';
import { CookiePreferences } from '@/lib/types';
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

export function CookieManager({ settings }: CookieManagerProps) {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const storedConsent = getCookie('cookie-consent');
    const parsed = storedConsent ? JSON.parse(storedConsent) : preferences;
    setPreferences(parsed);

    // Proceed on production only.
    if (process.env.NODE_ENV !== 'production') return;

    // GTM immediately starts.
    if (settings.google_tag_manager_enabled && settings.google_tag_manager_id) {
      initializeGTM(settings.google_tag_manager_id);
    }
  }, []);

  // Push pageview.
  useEffect(() => {
    if (pathname) {
      pageview(pathname);
    }
  }, [pathname, searchParams]);

  const initializeGTM = (gtmId: string) => {
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

    if (!preferences) {
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
    }

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

  const handleConsentChange = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);

    gtag('consent', 'update', {
      'ad_storage': newPreferences.marketing ? 'granted' : 'denied',
      'analytics_storage': newPreferences.analytics ? 'granted' : 'denied',
      'ad_user_data': newPreferences.marketing ? 'granted' : 'denied',
      'ad_personalization': newPreferences.marketing ? 'granted' : 'denied',
      'personalization_storage': newPreferences.functional ? 'granted' : 'denied',
      'functionality_storage': newPreferences.functional ? 'granted' : 'denied',
      'security_storage': newPreferences.necessary ? 'granted' : 'denied',
    });
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