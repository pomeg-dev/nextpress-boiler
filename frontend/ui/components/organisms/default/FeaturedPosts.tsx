"use client";

import React, { ReactNode, useCallback, useRef, useState } from "react";
import classNames from "classnames";
import { Cards, LinkItemProps, Post } from "@/lib/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper";
import SliderNavigation from "../../molecules/SliderNavigation";
import Parser from "html-react-parser";
import PostCard from "../../molecules/PostCard";
import Button from "../../atoms/Button";
import "swiper/css";

type FeaturedPostsProps = {
  posts: Post[],
  card: Cards;
  heading?: string;
  button?: LinkItemProps;
  slides_to_show?: number;
  top_spacer?: "xl" | "lg" | "md" | "0";
  bottom_spacer?: "xl" | "lg" | "md" | "0";
  className?: string;
  id?: string;
};

const FeaturedPosts: React.FC<FeaturedPostsProps> = ({
  posts,
  card = "PostCard",
  heading,
  button,
  slides_to_show = 2,
  top_spacer = "xl",
  bottom_spacer = "xl",
  className,
  id,
}) => {
  const sliderRef = useRef<any>(null);
  const [prevHidden, setPrevHidden] = useState(true);
  const [nextHidden, setNextHidden] = useState(false);
  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  const onSlideChange = () => {
    if (!sliderRef.current) return;
    const slideIndex = sliderRef.current.swiper.realIndex;
    if (slideIndex === 0) {
      setPrevHidden(true);
      setNextHidden(false);
    } else if (slideIndex === sliderRef.current.swiper.slides.length - 1) {
      setPrevHidden(false);
      setNextHidden(true);
    } else {
      setPrevHidden(false);
      setNextHidden(false);
    }
  };

  const componentMap: Record<string, React.ElementType> = {
    PostCard
  };
  
  const DynamicComponent = ({ componentName, data }: { componentName: string; data: any }) => {
    const SelectedComponent = componentMap[componentName];
    if (!SelectedComponent) return <div>Invalid component name: {componentName}</div>;
    return <SelectedComponent post={data} />;
  };

  return (
    <div
      className={classNames(
        "break-out overflow-hidden",
        className,
      )}
      id={id}
    >
       <div
          className={classNames(
            "container w-full max-w-full max-h-[100vh] min-h-0 min-w-0",
            `pb-${bottom_spacer}`,
            `pt-${top_spacer}`,
          )}
        >
          <div className="flex flex-wrap items-end justify-between">
            {heading &&
              <div className="heading text-primary">{Parser(heading)}</div>
            }
            <div className="flex gap-[10px]">
              {button &&
                <Button
                  linkItem={button}
                  style="secondary"
                  size="md"
                  circular={true}
                />
              }
              <SliderNavigation
                prevHidden={prevHidden}
                nextHidden={nextHidden}
                handlePrev={handlePrev}
                handleNext={handleNext}
                className={classNames(
                  posts.length > slides_to_show ? "block" : "block md:hidden",
                )}
              />
            </div>
          </div>
          <Swiper
            onSlideChange={() => onSlideChange()}
            slidesPerView={posts.length >= 2 ? 1.2 : 1}
            breakpoints={{
              768: {
                slidesPerView: slides_to_show,
              },
            }}
            spaceBetween={16}
            autoplay={posts.length > slides_to_show && {
              delay: 4500,
              disableOnInteraction: false,
            }}
            loop={posts.length > 4}
            className="mt-4"
            modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
            ref={sliderRef}
          >
            {posts
              .map((post: any, i: number) => {
                return (
                  <SwiperSlide key={i} className="featured-posts-item">
                    <DynamicComponent componentName={post?.card || card} data={post} />
                  </SwiperSlide>
                );
              })
            }
          </Swiper>
        </div>
    </div>
  );
};

export default FeaturedPosts;