import { nextpress } from "@/nextpress.config";
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
export const generateStaticParams = page.generateStaticParams;
