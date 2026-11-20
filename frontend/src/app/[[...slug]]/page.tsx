import { getPosts, nextpress } from "@/nextpress.config";
import "@/nextpress.blocks"; // registers the site's blocks for this route
import CategoryArchive from "@/ui/category-archive";
import PasswordGate from "@ui/components/organisms/default/PasswordGate";

const page = nextpress.page.createCatchAllPage({
  renderTaxPage: ({ taxonomy, term }) => <CategoryArchive taxonomy={taxonomy} term={term} />,
  wrapContent: ({ children, post }) =>
    post?.password ? <PasswordGate password={post.password}>{children}</PasswordGate> : children,
  // The boilerplate has no coming-soon redirect.
  comingSoonPath: null,
});

export default page.Page;
export const generateMetadata = page.generateMetadata;

// Prerender every page and post at build. The package's version reads
// `post.slug.full_path`, but `slug_only` posts come back as `{ slug, full_path }`,
// so it found no paths and every page rendered on its first request instead.
export async function generateStaticParams() {
  const posts: any[] = await getPosts({ per_page: -1, slug_only: true }).catch(() => []);
  return posts
    .map((post) => post.full_path ?? post.slug?.full_path)
    .filter((path): path is string => typeof path === "string")
    .map((path) => ({ slug: path.split("/").filter(Boolean) }));
}
