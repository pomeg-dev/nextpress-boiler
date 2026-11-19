import { getPostByPath, getSettings } from "@/nextpress.config";
import { BlockParser } from "@/nextpress.blocks";
import Button from "@ui/components/atoms/Button";

export default async function NotFound() {
  const settings = await getSettings([
    'page_404',
    'before_content',
    'after_content'
  ]);
  const post = settings.page_404
    ? await getPostByPath(settings.page_404.post_name, true, false)
    : undefined;

  return (
    <>
      {settings?.before_content && (
        <BlockParser blocks={settings.before_content} />
      )}
      {post ? (
        <main id="main" data-pageurl={post.path} data-postid={post.id}>
          {post.content && <BlockParser blocks={post.content} />}
        </main>
      ) : (
        // Fallback when WordPress has no 404 page set.
        <main id="main" className="page-404">
          <div className="container grid min-h-[calc(100svh-var(--header-h))] content-center py-section">
            <div className="flow max-w-160">
              <h1 className="heading-3xl">Nothing here.</h1>
              <p className="body-lg measure text-muted">
                The link may be out of date, or the page may have moved. Start again from the home page, or get in touch.
              </p>
              <div className="mt-md! flex flex-wrap gap-xs">
                <Button linkItem={{ url: "/", title: "Back to home" }} size="lg" iconRight="ArrowRight" />
                <Button linkItem={{ url: "/contact/", title: "Contact" }} size="lg" style="secondary" />
              </div>
              <p className="label mt-lg! border-t border-rule pt-xs text-muted">NP–404 · Missing</p>
            </div>
          </div>
        </main>
      )}
      {settings?.after_content && (
        <BlockParser blocks={settings.after_content} />
      )}
    </>
  );
}

export async function generateMetadata() {
  const notFound = {
    title: "Not found",
    description: "Not found",
  };
  const settings = await getSettings([
    'page_404'
  ]);
  if (!settings.page_404) return notFound;
  const page404 = await getPostByPath(settings.page_404.post_name);
  return page404.yoastHeadJSON;
}
