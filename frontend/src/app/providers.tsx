"use client";

import { LocaleProvider as NextpressLocaleProvider } from "@pomeg-dev/nextpress-client/i18n";
import enMessages from "../../ui/languages/en.json";

const messages = { en: enMessages };

export function LocaleProvider({
  children,
  defaultLocale = "en",
}: {
  children: React.ReactNode;
  defaultLocale?: string;
}) {
  return (
    <NextpressLocaleProvider
      messages={messages}
      locales={{ default: defaultLocale, available: [defaultLocale] }}
    >
      {children}
    </NextpressLocaleProvider>
  );
}

export { useLocaleContext, LocaleContext } from "@pomeg-dev/nextpress-client/i18n";
