//@ts-nocheck

import React, { Suspense } from "react";
import * as Fallback from "./fallback";
import { BlockBoundary } from "./block-boundary";
import { MissingBlock } from "./missing-block";
import { Block } from "@/lib/types";
import fs from "fs";
import path from "path";

type ImportedComponent = React.ComponentType<
  Block & { innerBlocks?: React.ReactNode }
>;

// Component cache - stores imported components by path
const componentCache = new Map<string, ImportedComponent>();

// Directory existence cache - caches fs.statSync results
const directoryCache = new Map<string, boolean>();

// Theme availability cache - prevents repeated theme checks
const themeAvailabilityCache = new Map<string, boolean>();

export function BlockParser({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, index) => (
        // Suspense lets a server render error fall back to the client, where
        // BlockBoundary drops just that block instead of failing the page.
        <Suspense key={block.id ?? index} fallback={null}>
          <BlockBoundary name={block.blockName}>
            <BlockRenderer block={block} />
          </BlockBoundary>
        </Suspense>
      ))}
    </>
  );
}

const getComponent = (mod: any): ImportedComponent => {
  return mod.default || (Object.values(mod)[0] as ImportedComponent);
};

const isDirectory = (dirPath: string): boolean => {
  // Check cache first
  if (directoryCache.has(dirPath)) {
    return directoryCache.get(dirPath)!;
  }
  
  try {
    const result = fs.statSync(dirPath).isDirectory();
    directoryCache.set(dirPath, result);
    return result;
  } catch {
    directoryCache.set(dirPath, false);
    return false;
  }
};

const isThemeAvailable = (themeName: string): boolean => {
  // Check cache first
  if (themeAvailabilityCache.has(themeName)) {
    return themeAvailabilityCache.get(themeName)!;
  }
  
  const themePath = path.join(process.cwd(), "themes", themeName);
  const result = isDirectory(themePath);
  themeAvailabilityCache.set(themeName, result);
  return result;
};

/**
 * Theme (acf/) blocks with no component resolve to null and render nothing:
 * a block can be pushed to WordPress before its component is deployed.
 * Core blocks fall back to rendering their innerHTML.
 */
const importComponent = async (
  componentPath: string,
  isThemeComponent: boolean = false
): Promise<ImportedComponent | null> => {
  // Create cache key that includes the component type
  const cacheKey = `${isThemeComponent ? 'theme' : 'core'}:${componentPath}`;
  
  // Return cached component if available
  if (componentCache.has(cacheKey)) {
    return componentCache.get(cacheKey)!;
  }

  try {
    let npModule;

    if (isThemeComponent) {
      const themeName = componentPath.split("/")[0];
      
      // Use cached theme availability check
      if (!isThemeAvailable(themeName)) {
        throw new Error(`Theme directory not found: ${themeName}`);
      }
      
      npModule = await import(`../../themes/${componentPath}`);
    } else {
      npModule = await import(`./${componentPath}`);
    }

    const component = getComponent(npModule);
    
    // Cache the successfully imported component
    componentCache.set(cacheKey, component);
    return component;
    
  } catch (error) {
    const fallbackComponent = isThemeComponent ? null : getComponent(Fallback);
    if (isThemeComponent) {
      console.warn(`Nextpress: no component for ${componentPath}, skipping`);
    } else {
      console.log(`Failed to import component: ${componentPath}`, error);
    }

    // Cache misses in production only, so a newly added block is picked up in dev.
    if (process.env.NODE_ENV === "production") {
      componentCache.set(cacheKey, fallbackComponent);
    }
    return fallbackComponent;
  }
};

export const BlockRenderer: React.FC<{ block: Block }> = async ({ block }) => {
  const { blockName, innerBlocks } = block;
  let ImportedComponent: ImportedComponent | null = null;

  if (blockName) {
    const [theme, componentName] = parseBlockName(blockName);

    // Use cached theme availability check
    if (theme && !isThemeAvailable(theme)) {
      console.warn(
        `Skipping import from non-existent theme directory: ${theme}`
      );
      return null;
    }

    if (!theme) {
      ImportedComponent = await importComponent(
        `wordpress/blocks/${componentName}`,
        false
      );
    } else if (componentName) {
      ImportedComponent = await importComponent(
        `${theme}/blocks/${componentName}`,
        true
      );
      // Unknown theme block: skip it and its innerBlocks (they belong to its
      // layout). In dev, show a placeholder with its data to build against.
      if (!ImportedComponent) {
        return process.env.NODE_ENV === "development" ? (
          <MissingBlock name={blockName} data={block.data} />
        ) : null;
      }
    }
  }

  if (ImportedComponent) {
    return <ImportedComponent {...block} />;
  }

  if (innerBlocks && innerBlocks.length > 0) {
    return (
      <>
        {innerBlocks.map((innerBlock) => (
          <BlockRenderer key={innerBlock.id} block={innerBlock} />
        ))}
      </>
    );
  }

  return null;
};

function parseBlockName(blockName: string): [string | null, string] {
  const parts = blockName.split("--");
  if (parts.length > 1) {
    const theme = parts[0].replace("acf/", "");
    return [theme, parts[1]];
  }
  return [null, blockName.replace("core/", "")];
}

// Cache warming utility - can be called during build or app startup
export const warmComponentCache = async (commonBlocks: string[]) => {
  console.log('Warming component cache...');
  
  const promises = commonBlocks.map(async (blockName) => {
    const [theme, componentName] = parseBlockName(blockName);
    
    try {
      if (theme) {
        return await importComponent(`${theme}/blocks/${componentName}`, true);
      } else {
        return await importComponent(`wordpress/blocks/${componentName}`, false);
      }
    } catch (error) {
      // Silently skip missing components during cache warming
      console.log(`Skipping cache warming for missing component: ${blockName}`);
      return null;
    }
  });
  
  const results = await Promise.allSettled(promises);
  const successCount = results.filter(result => result.status === 'fulfilled' && result.value !== null).length;
  console.log(`Cache warmed with ${successCount} components (${commonBlocks.length - successCount} skipped)`);
};

// Cache statistics for debugging
export const getCacheStats = () => ({
  components: componentCache.size,
  directories: directoryCache.size,
  themes: themeAvailabilityCache.size,
});

// Clear cache utility for development
export const clearComponentCache = () => {
  componentCache.clear();
  directoryCache.clear();
  themeAvailabilityCache.clear();
};
