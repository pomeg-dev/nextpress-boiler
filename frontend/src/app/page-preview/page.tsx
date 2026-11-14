import { PreviewCanvas, PagePreviewSkeleton, PreviewUnauthorized } from "@pomeg-dev/nextpress-client/preview";
import { preview } from "@/nextpress.preview";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

export default async function PagePreview({ searchParams }: Props) {
  const sp = await searchParams;
  const post = String(sp.post ?? "");
  const token = String(sp.np_token ?? "");
  if (!preview.isAuthorized(token, post)) return <PreviewUnauthorized />;

  async function renderAction(t: string, p: string, blocks: unknown[]) {
    "use server";
    return preview.renderPreviewBlocks(t, p, blocks);
  }

  return (
    <PreviewCanvas post={post} token={token} renderAction={renderAction}>
      <PagePreviewSkeleton />
    </PreviewCanvas>
  );
}
