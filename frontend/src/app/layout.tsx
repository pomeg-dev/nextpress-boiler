import "@/ui/globals.css";
import type { Metadata } from "next";
import { getSettings } from "@/lib/wp/settings";
import { getBlockTheme } from "@/lib/wp/theme";
import { Suspense } from "react";
import { LocaleProvider } from "./providers";
import { fontVariables } from "ui/fonts/font-loader";
import { CookieManager } from "@ui/components/organisms/default/CookieManager";
import { initializeComponentCache } from "@/lib/cache-warmer";

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/images/favicon/favicon.ico", sizes: "any" },
      {
        url: "/images/favicon/favicon-16x16.png",
        type: "image/png",
        sizes: "16x16",
      },
      {
        url: "/images/favicon/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/images/favicon/android-chrome-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/images/favicon/android-chrome-512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    apple: [
      {
        url: "/images/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/images/favicon/site.webmanifest",
};

async function SettingsProvider({ children }: { children: React.ReactNode }) {
  const settings = await getSettings(
    [
      'enable_user_flow',
      'enable_custom_cookie_manager',
      'google_tag_manager_enabled', 
      'google_tag_manager_id',
      'head_scripts',
      'body_opening',
      'body_closing',
      'default_language',
      'blogname'
    ]
  );

  const themes = await getBlockTheme();
  
  // Initialize component cache in background
  initializeComponentCache().catch(console.warn);

  // Add theme atts.
  const themeProps = themes.reduce(
    (acc: { [key: string]: string }, theme: string, index: number) => {
      if (index === 0) acc["data-theme"] = theme;
      else acc[`data-theme-${index}`] = theme;
      return acc;
    },
    {}
  );
  
  const defaultLocale = settings?.default_language || "en";
  
  return (
    <LocaleProvider defaultLocale={defaultLocale}>
      <html {...themeProps} lang={defaultLocale} className={fontVariables}>
        <body suppressHydrationWarning>
          {/* Google Consent Mode default — inline so it executes at parse time,
              before GTM boots and before OneTrust injects, giving every tag a
              known (denied) starting state. OneTrust is expected to emit the
              `update` once it has the user's choice. */}
          <script
            id="google-consent-default"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',personalization_storage:'denied',functionality_storage:'denied',security_storage:'granted',wait_for_update:500});`,
            }}
          />
          <Suspense>
            <CookieManager
              settings={settings}
            />
          </Suspense>
          {children}
        </body>
      </html>
    </LocaleProvider>
  );
}

export default function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      {children}
    </SettingsProvider>
  );
}
