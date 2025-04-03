import "swiper/css";
import type { Decorator, Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { getPosts } from "@/lib/wp/posts";
import { mockPost } from "@ui/utils/placeholders";
import FeaturedPosts from "@ui/components/organisms/default/FeaturedPosts";

const fetchPosts = async (postType: string) => {
  const params = {
    post_type: postType,
    per_page: 4,
  };

  try {
    const response = await getPosts(params);
    if (!response) throw new Error("Failed to fetch posts");
    return response;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [mockPost, mockPost];
  }
};

const FeaturedPostsStoryWrapper = (args: any) => {
  const [posts, setPosts] = useState<any>(null);

  useEffect(() => {
    fetchPosts(args.postType).then((posts) => {
      if (posts.length > 0) {
        setPosts(posts);
      }
    });
  }, []);

  if (!posts) return <div>Loading posts...</div>;

  return <FeaturedPosts {...args} posts={posts} />;
};

const withGlobals: Decorator = (Story, context) => {
  return <Story {...context} />;
};

const meta: Meta<typeof FeaturedPosts> = {
  title: "Components/Organisms/Default/FeaturedPosts",
  component: FeaturedPosts,
  decorators: [withGlobals],
  tags: ["autodocs"],
  parameters: {
    controls: { expanded: true },
  },
  args: {
    posts: undefined,
    heading: "<h2>Resources</h2>",
    slides_to_show: 2,
    card: "PostCard",
  },
};

export default meta;

type Story = StoryObj<typeof FeaturedPosts>;

export const Resources: Story = {
  render: (args, context) => <FeaturedPostsStoryWrapper postType={context.globals.postType} {...args} />,
  globals: {
    viewportWidth: '100%',
    postType: "post"
  }
};
