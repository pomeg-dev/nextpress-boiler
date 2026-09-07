"use client";

// SPIKE (page-preview 2b): canvas-side bridge.
//
// - tells the parent editor we're ready
// - receives blocks over postMessage, renders them via the renderBlocks Server
//   Action (returns REAL server-side BlockParser as an RSC payload → client
//   components hydrate), and swaps the result in. No globalThis store, no
//   router.refresh() — Vercel-safe and keeps scroll position.
// - highlights each block (any nesting level) on hover and reports the clicked
//   block's id back. That id === the editor clientId (the bridge stamps it via
//   anchor), so the editor can selectBlock() it directly — inner blocks included.

import { useEffect, useRef, useState } from "react";
import { renderBlocks } from "./actions";

type Props = {
  post: string;
  token: string;
  children: React.ReactNode;
};

// Collect block ids at every depth (they equal editor clientIds — see bridge).
function collectIds(blocks: any[]): string[] {
  const ids: string[] = [];
  for (const b of blocks ?? []) {
    if (b?.id != null) ids.push(String(b.id));
    if (b?.innerBlocks?.length) ids.push(...collectIds(b.innerBlocks));
  }
  return ids;
}

export function PreviewCanvas({ post, token, children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState<React.ReactNode>(null);
  const [blockIds, setBlockIds] = useState<string[]>([]);
  const idSet = new Set(blockIds);
  const idKey = blockIds.join(",");

  // Receive blocks from the editor, render them via the Server Action, swap in.
  useEffect(() => {
    async function onMessage(event: MessageEvent) {
      // Only accept messages from the editor (the parent window). A third-party
      // widget iframe inside a block (e.g. Trustpilot) has event.source ===
      // its own contentWindow, so this rejects it cleanly — cross-origin safe,
      // and it's a known reference (not event.origin, which we must never trust
      // to derive a reply target — see the "*" posts below).
      if (event.source !== window.parent) return;
      const data = event.data || {};
      if (data.type === "np-scroll-to" && data.clientId) {
        const container = containerRef.current;
        const target = container?.querySelector<HTMLElement>(`[id="${CSS.escape(data.clientId)}"]`);
        container?.querySelectorAll<HTMLElement>(".np-selected").forEach((n) =>
          n.classList.remove("np-selected")
        );
        if (target) {
          target.classList.add("np-selected");
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      if (data.type !== "np-blocks") return;
      try {
        const blocks = data.blocks ?? [];
        // Server Action verifies the token, then returns <BlockParser> as an RSC
        // node (client components inside hydrate); render it directly.
        const node = await renderBlocks(token, post, blocks);
        setRendered(node);
        setBlockIds(collectIds(blocks));
        // Tell the editor real content has painted → it fades its boot loader.
        window.parent?.postMessage({ type: "np-rendered", post }, "*");
      } catch (err) {
        console.error("[np-canvas] render failed", err);
      }
    }

    window.addEventListener("message", onMessage);
    // Announce readiness so the editor pushes the current blocks.
    window.parent?.postMessage({ type: "np-ready", post }, "*");
    return () => window.removeEventListener("message", onMessage);
  }, [post, token]);

  // Mark every rendered block (any depth) whose DOM id is a known block id, so
  // it can be hovered/clicked. Re-run when the render or the id set changes.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function tag() {
      if (!container) return;
      container.querySelectorAll<HTMLElement>("[data-np-block]").forEach((el) => {
        delete el.dataset.npBlock;
      });
      blockIds.forEach((id) => {
        const el = container.querySelector<HTMLElement>(`[id="${CSS.escape(id)}"]`);
        if (el) el.dataset.npBlock = "";
      });
    }

    tag();
    const observer = new MutationObserver(tag);
    observer.observe(container, { childList: true, subtree: true });

    function onClick(e: MouseEvent) {
      // Walk up to the nearest ancestor that is a known block (deepest wins →
      // clicking an inner block selects the inner block, not its parent).
      let node = e.target as HTMLElement | null;
      while (node && node !== container) {
        if (node.id && idSet.has(node.id)) {
          e.preventDefault();
          window.parent?.postMessage({ type: "np-select", clientId: node.id }, "*");
          return;
        }
        node = node.parentElement;
      }
    }

    container.addEventListener("click", onClick, true);
    return () => {
      observer.disconnect();
      container.removeEventListener("click", onClick, true);
    };
  }, [idKey]);

  return (
    <>
      <style>{`
        .np-canvas [data-np-block] { cursor: pointer; }
        .np-canvas [data-np-block]:hover { outline: 2px solid #7c8cf8; outline-offset: -2px; }
        .np-canvas [data-np-block].np-selected { outline: 2px solid #3858e9; outline-offset: -2px; }
      `}</style>
      <div ref={containerRef} className="np-canvas">
        {rendered ?? children}
      </div>
    </>
  );
}
