'use client';

import { useEffect } from 'react';

type RawHtmlTarget = 'head' | 'body-start' | 'body-end';

interface RawHtmlProps {
  /** Arbitrary HTML pasted by an admin (e.g. WP settings head/body scripts). */
  html?: string | null;
  /** Where to inject the markup. */
  target: RawHtmlTarget;
}

/**
 * Browsers do NOT execute <script> tags inserted via innerHTML /
 * dangerouslySetInnerHTML. This component injects admin-supplied HTML and then
 * re-creates each <script> so the browser actually runs it (inline and src).
 *
 * Mount/unmount is consent-driven by the caller — injected nodes are removed on
 * unmount, so revoking consent tears the markup back out of the DOM.
 */
function reviveScript(oldScript: HTMLScriptElement) {
  const script = document.createElement('script');
  for (const attr of Array.from(oldScript.attributes)) {
    script.setAttribute(attr.name, attr.value);
  }
  script.text = oldScript.textContent ?? '';
  oldScript.replaceWith(script);
  return script;
}

export function RawHtml({ html, target }: RawHtmlProps) {
  useEffect(() => {
    if (!html) return;

    const fragment = document.createRange().createContextualFragment(html);
    const topLevel = Array.from(fragment.childNodes);

    if (target === 'head') document.head.appendChild(fragment);
    else if (target === 'body-start') document.body.prepend(fragment);
    else document.body.appendChild(fragment);

    // Nodes are now connected to the document — replacing each <script> with a
    // freshly created one makes the browser execute it.
    const managed: ChildNode[] = [];
    topLevel.forEach((node) => {
      if (node instanceof HTMLScriptElement) {
        managed.push(reviveScript(node));
      } else {
        if (node instanceof Element) {
          node.querySelectorAll('script').forEach((s) => reviveScript(s));
        }
        managed.push(node as ChildNode);
      }
    });

    return () => {
      managed.forEach((node) => node.remove());
    };
  }, [html, target]);

  return null;
}
