import type { Meta, StoryObj } from "@storybook/react";
import PostCard from "../../molecules/PostCard";
import { useEffect, useState } from "react";
import { getPosts } from "@/lib/wp/posts";
import { mockPost } from "@ui/utils/placeholders";

const fetchPosts = async () => {
  const params = {
    post_type: 'post',
    per_page: 1,
  };

  try {
    const response = await getPosts(params);
    if (!response) throw new Error("Failed to fetch posts");
    return response;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [mockPost];
  }
};

const PostCardStoryWrapper = (args: any) => {
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    fetchPosts().then((posts) => {
      if (posts.length > 0) {
        setPost(posts[0]);
      }
    });
  }, []);

  if (!post) return <div>Loading post...</div>;

  return <PostCard {...args} post={post} />;
};

const meta: Meta<typeof PostCard> = {
  title: "Components/Molecules/PostCard",
  component: PostCard,
  tags: ["autodocs"],
  parameters: {
    controls: { expanded: true },
  },
  args: {
    post: undefined,
  },
};

export default meta;

type Story = StoryObj<typeof PostCard>;

export const Default: Story = {
  render: (args) => <PostCardStoryWrapper {...args} />,
};
