"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { linkFilter } from "utils/url";
import moment from "moment";

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export function PostsList({ posts, settings }: {
  posts: any;
  settings?: any;
}) {
  const path = usePathname();

  return (
    <div className="archive-posts">
      <div
        className="my-[50px] grid w-full gap-x-[19px] gap-y-[35px] relative items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        {posts &&
          posts.map((post: any, index: number) => {
            // console.log(post);
            return (
              <div className="archive-post-item flex flex-col" key={index}>
                <Link
                  href={post.path}
                >
                  {post.featured_image.sizes.medium &&
                    <div className="aspect-video relative mb-4">
                      <Image fill src={post.featured_image.sizes.medium} alt={post.title} />
                    </div>
                  }
                  <h3 className="!mb-0">{post.title}</h3>
                  {post.category_names &&
                    <div className="flex flex-row gap-2">
                      {post.category_names.map((category: any, index: number) => (
                        <p key={index}>{category}</p>
                      ))}
                    </div>
                  }
                  <p className="date mb-0">
                    {moment(post.post_date).format(
                      post.acf_data?.date_format ? post.acf_data.date_format : "LL"
                    )}
                  </p>
                </Link>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}