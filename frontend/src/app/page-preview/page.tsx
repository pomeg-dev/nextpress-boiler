// SPIKE (page-preview 2b): full-page live canvas.
//
// The shell page: it loads the real app layout/globals/fonts (so blocks look
// exactly like prod), verifies the preview token, and hands off to the canvas,
// which renders blocks via the renderBlocks Server Action (RSC → hydrated).
// Blocks travel with each action call — no server store — so this is Vercel-safe
// and two editors on the same post can't collide.
import { PreviewCanvas } from "./preview-canvas";
import { isAuthorized } from "./token";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PagePreview({ searchParams }: Props) {
  const sp = await searchParams;
  const post = String(sp.post ?? "");
  const token = String(sp.np_token ?? "");

  // Gate the render: no valid, post-bound token → no content (closes the
  // public-draft leak the old unauthenticated store had).
  if (!isAuthorized(token, post)) {
    return (
      <div style={{ padding: 40, font: "14px/1.5 sans-serif", color: "#b91c1c" }}>
        Unauthorized — open this preview from the editor.
      </div>
    );
  }

  return (
    <PreviewCanvas post={post} token={token}>
      <CanvasSkeleton />
    </PreviewCanvas>
  );
}

// Shown until the editor pushes blocks (the boot loader usually covers this, but
// it's the graceful fallback for an empty/slow page rather than grey text).
function CanvasSkeleton() {
  return (
    <div aria-hidden style={{ padding: "56px clamp(24px, 8vw, 120px)" }}>
      <style>{`
        @keyframes np-shimmer { 100% { background-position: -200% 0; } }
        .np-sk {
          border-radius: 8px;
          background: linear-gradient(90deg, #eef0f4 0%, #f6f7fb 40%, #eef0f4 80%);
          background-size: 200% 100%;
          animation: np-shimmer 1.3s ease-in-out infinite;
        }
      `}</style>
      <div className="np-sk" style={{ height: 40, width: "55%", marginBottom: 20 }} />
      <div className="np-sk" style={{ height: 18, width: "90%", marginBottom: 12 }} />
      <div className="np-sk" style={{ height: 18, width: "80%", marginBottom: 12 }} />
      <div className="np-sk" style={{ height: 18, width: "86%", marginBottom: 40 }} />
      <div className="np-sk" style={{ height: 260, width: "100%", marginBottom: 24 }} />
      <div style={{ display: "flex", gap: 24 }}>
        <div className="np-sk" style={{ height: 160, flex: 1 }} />
        <div className="np-sk" style={{ height: 160, flex: 1 }} />
        <div className="np-sk" style={{ height: 160, flex: 1 }} />
      </div>
    </div>
  );
}
