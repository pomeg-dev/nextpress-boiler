"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { domainLocales } from '@ui/utils/locales';

export const LocaleContext = createContext({ locale: 'en' });

export function LocaleProvider({
  children, 
  defaultLocale = 'en',
  themes = []
}: { 
  children: React.ReactNode, 
  defaultLocale?: string,
  themes?: string[]
}) {
  const [locale, setLocale] = useState(defaultLocale);
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hostname = window.location.hostname;
    const detectedLocale = hostname in domainLocales ? domainLocales[hostname as keyof typeof domainLocales] : defaultLocale;
    const defaultTheme = themes?.[0] || "default";
    
    import(`../../themes/${defaultTheme}/languages/${detectedLocale}.json`)
      .then((importedMessages) => {
        setLocale(detectedLocale);
        setMessages(importedMessages.default);
        setLoading(false);
      })
      .catch(() => {
        import(`../../themes/${defaultTheme}/languages/${defaultLocale}.json`)
          .then((importedMessages) => {
            setLocale(defaultLocale);
            setMessages(importedMessages.default);
            setLoading(false);
          });
      });
  }, [defaultLocale]);

  return (
    <LocaleContext.Provider value={{ locale }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export const useLocaleContext = () => useContext(LocaleContext);