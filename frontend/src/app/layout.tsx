import { getSettings } from "@/lib/wp/settings";
import "../ui/globals.scss";
import { getBlockTheme } from "@/lib/wp/theme";
import { Suspense } from "react";
import { LocaleProvider } from "./providers";
import { fontVariables } from "ui/fonts/font-loader";
import { initializeComponentCache } from "@/lib/cache-warmer";
import { CookieManager } from "@ui/components/organisms/default/CookieManager";
import { figmaVariablesCSS } from "@/lib/figma-variables.css";

// Create separate components for async operations
async function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themes = await getBlockTheme();
  
  // Initialize component cache in background (non-blocking)
  initializeComponentCache().catch(console.warn);
  
  const themeProps = themes.reduce(
    (acc: { [key: string]: string }, theme: string, index: number) => {
      if (index === 0) acc["data-theme"] = theme;
      else acc[`data-theme-${index}`] = theme;
      return acc;
    },
    {}
  );

  return (
    <html {...themeProps} className={fontVariables}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: figmaVariablesCSS }} />
      </head>
      {children}
    </html>
  );
}

async function SettingsProvider({ children }: { children: React.ReactNode }) {
  const settings = await getSettings(
    [
      'blocks_theme',
      'blogname',
      'google_tag_manager_enabled', 
      'google_tag_manager_id',
    ]
  );
  
  return (
    <LocaleProvider defaultLocale="en" themes={settings.blocks_theme}>
      {children}
      <Suspense>
        <CookieManager 
          settings={{
            blogname: settings.blogname,
            google_tag_manager_enabled: settings.google_tag_manager_enabled,
            google_tag_manager_id: settings.google_tag_manager_id,
          }}
        />
      </Suspense>
    </LocaleProvider>
  );
}

export default function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <body>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </ThemeProvider>
  );
}
