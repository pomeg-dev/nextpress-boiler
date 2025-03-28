import "swiper/css";
import type { Decorator, Meta, StoryObj } from "@storybook/react";
import FeaturedPosts from "../../organisms/FeaturedPosts";
import { useEffect, useState } from "react";
import { getRestPosts } from "@/lib/wp/posts";
import { mockPost } from "@ui/utils/placeholders";

const fetchPosts = async (postType: string) => {
  const params = {
    is_archive: true,
    per_page: 4,
  };

  try {
    const response = await getRestPosts(postType, params);
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
  title: "Components/Organisms/FeaturedPosts",
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
    postType: "posts"
  }
};

export const Products: Story = {
  args: {
    card: "ProductCard",
    heading: "<h2>Products</h2>",
    slides_to_show: 3,
  },
  render: (args, context) => <FeaturedPostsStoryWrapper postType={context.globals.postType} {...args} />,
  globals: {
    viewportWidth: '100%',
    postType: "product"
  }
};

export const Courses: Story = {
  args: {
    card: "CourseCard",
    heading: "<h2>Courses</h2>",
    slides_to_show: 3,
  },
  render: (args, context) => <FeaturedPostsStoryWrapper postType={context.globals.postType} {...args} />,
  globals: {
    viewportWidth: '100%',
    postType: "course"
  }
};
