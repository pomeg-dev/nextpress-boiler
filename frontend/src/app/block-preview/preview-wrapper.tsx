"use client";

import { useEffect, useRef } from "react";

export function PreviewWrapper({
  children, 
  postId,
  iframeId
}: { 
  children: React.ReactNode;
  postId?: string | string[];
  iframeId?: string | string[];
}) {
  const mainRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    let lastSentHeight: number | string = 0;
    let isCalculating = false;
    let lastCalculationTime = 0;
    const MIN_CALCULATION_INTERVAL = 300; // Minimum 300ms between calculations

    const hasViewportHeight = (element: Element): boolean => {
      // Check if element or any child has viewport-based height
      const className = element.className;

      // Convert to string if it's a DOMTokenList or other object
      const classString = typeof className === 'string' ? className : String(className || '');

      // Check for full viewport height classes
      if (
        classString.includes('h-screen') ||
        classString.includes('min-h-screen') ||
        classString.includes('max-h-screen') ||
        classString.includes('h-[100vh]') ||
        classString.includes('min-h-[100vh]') ||
        classString.includes('lg:h-screen') ||
        classString.includes('md:h-screen') ||
        classString.includes('lg\\:h-screen') ||
        classString.includes('md\\:h-screen') ||
        classString.includes('md\\:min-h-screen') ||
        classString.includes('md:min-h-screen')
      ) {
        return true;
      }

      // Check for any vh-based height in classes (e.g., h-[50vh], min-h-[80vh], h-[calc(100vh-120px)])
      const vhPattern = /(?:h-\[|min-h-\[|max-h-\[)(?:.*?vh|calc\(.*?vh.*?\))/;
      if (vhPattern.test(classString)) {
        return true;
      }

      // Check computed styles for vh/dvh/svh/lvh values (all viewport units)
      const computedStyle = window.getComputedStyle(element);
      const heightValue = computedStyle.height || '';
      const minHeightValue = computedStyle.minHeight || '';
      const maxHeightValue = computedStyle.maxHeight || '';

      const viewportUnits = ['vh', 'dvh', 'svh', 'lvh'];
      for (const unit of viewportUnits) {
        if (
          heightValue.includes(unit) ||
          minHeightValue.includes(unit) ||
          maxHeightValue.includes(unit)
        ) {
          return true;
        }
      }

      return false;
    };

    const calculateHeight = () => {
      if (!mainRef.current || isCalculating) return;

      // Throttle calculations to prevent loops
      const now = Date.now();
      if (now - lastCalculationTime < MIN_CALCULATION_INTERVAL) {
        console.log('[PreviewWrapper] Skipping calculation - too soon since last calculation');
        return;
      }
      lastCalculationTime = now;

      // Prevent re-entry
      isCalculating = true;

      try {
        const customBlock = mainRef.current.querySelector('.custom-block');

        // Check for viewport-based heights in custom-block or its children
        let useViewportHeight = false;
        if (customBlock && hasViewportHeight(customBlock)) {
          useViewportHeight = true;
        }

        // Also check all children for vh-based heights (but limit scan to avoid performance issues)
        if (!useViewportHeight && mainRef.current) {
          const allElements = mainRef.current.querySelectorAll('*');
          for (let i = 0; i < Math.min(allElements.length, 100); i++) {
            if (hasViewportHeight(allElements[i])) {
              useViewportHeight = true;
              break;
            }
          }
        }

        if (useViewportHeight) {
          // For viewport-based heights, use a fixed large height to prevent loops
          const fixedHeight = '100vh';
          if (lastSentHeight !== fixedHeight) {
            console.log('[PreviewWrapper] Detected viewport-based height, using 100vh');
            lastSentHeight = fixedHeight;
            mainRef.current.setAttribute('data-height', fixedHeight);
            if (window.parent && window.parent !== window) {
              window.parent.postMessage({
                type: 'blockPreviewHeight',
                height: fixedHeight,
                iframeId: iframeId
              }, '*');
            }
          }
          return;
        }

        // Measure height using stable methods only
        const bodyScrollHeight = document.body.scrollHeight;
        const bodyOffsetHeight = document.body.offsetHeight;

        // Get body margins
        const bodyStyle = window.getComputedStyle(document.body);
        const bodyMarginTop = parseInt(bodyStyle.marginTop, 10) || 0;
        const bodyMarginBottom = parseInt(bodyStyle.marginBottom, 10) || 0;

        // Use body measurements only - more stable than documentElement
        let contentHeight = Math.max(bodyScrollHeight, bodyOffsetHeight);

        // Add a reasonable maximum to prevent runaway growth
        const MAX_HEIGHT = 5000;
        if (contentHeight > MAX_HEIGHT) {
          console.warn('[PreviewWrapper] Height exceeds maximum, using last known good height');
          // If height is unreasonably large, something went wrong - keep last height
          if (typeof lastSentHeight === 'number' && lastSentHeight < MAX_HEIGHT) {
            contentHeight = lastSentHeight;
          } else {
            contentHeight = MAX_HEIGHT;
          }
        }

        const totalHeight = contentHeight + bodyMarginTop + bodyMarginBottom + 10;

        console.log('[PreviewWrapper] Height measurements - body scroll:', bodyScrollHeight,
          'body offset:', bodyOffsetHeight,
          'margins:', bodyMarginTop + bodyMarginBottom,
          'FINAL:', totalHeight, 'px');

        // Only update if height changed significantly (more than 5px) to prevent micro-adjustments
        const heightChanged = typeof lastSentHeight === 'number'
          ? Math.abs(totalHeight - lastSentHeight) > 5
          : true;

        if (heightChanged) {
          lastSentHeight = totalHeight;
          mainRef.current.setAttribute('data-height', `${totalHeight}`);

          if (window.parent && window.parent !== window) {
            window.parent.postMessage({
              type: 'blockPreviewHeight',
              height: totalHeight,
              iframeId: iframeId
            }, '*');
          }
        }
      } finally {
        isCalculating = false;
      }
    };

    const hideCookieBanners = () => {
      const cookieBanners = document.querySelectorAll('[class*="cookie"], [class*="Cookie"], [id*="cookie"], [id*="Cookie"]');
      cookieBanners.forEach(banner => {
        (banner as HTMLElement).style.display = "none";
      });
    };

    const hideOtherElements = () => {
      if (mainRef.current) {
        const bodyChildren = document.body.children;
        for (let i = 0; i < bodyChildren.length; i++) {
          const element = bodyChildren[i];
          if (element !== mainRef.current && element.tagName.toLowerCase() !== 'script') {
            (element as HTMLElement).style.display = 'none';
          }
        }
        const loader = mainRef.current.querySelector('.loader');
        if (loader) {
          (loader as HTMLElement).style.display = "none";
        }

        // Hide cookie banners in preview
        hideCookieBanners();
      }
    };

    // Initial setup
    hideOtherElements();

    // Watch for dynamically added cookie banners
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // Check if the added node or any of its children is a cookie banner
            if (
              node.className && (
                node.className.includes('cookie') ||
                node.className.includes('Cookie')
              ) ||
              node.id && (
                node.id.includes('cookie') ||
                node.id.includes('Cookie')
              )
            ) {
              (node as HTMLElement).style.display = 'none';
            }
            // Also check children of the added node
            const childCookieBanners = node.querySelectorAll('[class*="cookie"], [class*="Cookie"], [id*="cookie"], [id*="Cookie"]');
            childCookieBanners.forEach(banner => {
              (banner as HTMLElement).style.display = 'none';
            });
          }
        });
      });
    });

    // Start observing the document body for added nodes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Calculate height after DOM is ready
    calculateHeight();

    // Recalculate after images and fonts load
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    const totalImages = images.length;

    if (totalImages > 0) {
      images.forEach(img => {
        if (img.complete) {
          loadedImages++;
          if (loadedImages === totalImages) {
            setTimeout(calculateHeight, 100);
          }
        } else {
          img.addEventListener('load', () => {
            loadedImages++;
            if (loadedImages === totalImages) {
              setTimeout(calculateHeight, 100);
            }
          });
          img.addEventListener('error', () => {
            loadedImages++;
            if (loadedImages === totalImages) {
              setTimeout(calculateHeight, 100);
            }
          });
        }
      });
    }

    // Fallback timings for fonts and other async content
    const timeout1 = setTimeout(calculateHeight, 500);
    const timeout2 = setTimeout(calculateHeight, 1000);

    // Special handling for Embla carousels - they need extra time to initialize
    const emblaCarousels = document.querySelectorAll('.embla, [class*="carousel"]');
    if (emblaCarousels.length > 0) {
      console.log('[PreviewWrapper] Detected carousel, adding extra calculation delays');
      setTimeout(calculateHeight, 2000);
      setTimeout(calculateHeight, 3000);
    } else {
      // Only add 2s timeout if no carousel
      setTimeout(calculateHeight, 2000);
    }

    // Store initial window dimensions to detect real resizes vs iframe resizes
    let lastWindowWidth = window.innerWidth;
    let lastWindowHeight = window.innerHeight;

    // Only recalculate on actual window/viewport resize, not iframe resize
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      // Only calculate if viewport actually changed (not just iframe height)
      if (currentWidth !== lastWindowWidth || currentHeight !== lastWindowHeight) {
        console.log('[PreviewWrapper] Viewport size changed, recalculating');
        lastWindowWidth = currentWidth;
        lastWindowHeight = currentHeight;
        calculateHeight();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('load', calculateHeight);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', calculateHeight);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      observer.disconnect();
    };
  }, [postId, iframeId]);

  return (
    <main 
      ref={mainRef} 
      data-pageurl="block-preview" 
      data-postid={postId}
      className="block-preview"
    >
      <div className="loader fixed left-0 top-0 z-[9999] flex h-full w-full items-center justify-center bg-white text-primary">Loading...</div>
      {children}
    </main>
  );
}