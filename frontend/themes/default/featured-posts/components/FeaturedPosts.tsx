"use client";

import cn from "classnames";
import React, { useCallback, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";

export function FeaturedPosts({ posts }: {
  posts: any,
}) {
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

  return (
    <div className="featured-posts py-[40px] px-[20px]">
      <div
        className={cn(
          "container relative w-[100%] max-w-[100%] max-h-[100vh] min-h-0 min-w-0 overflow-hidden pb-[50px]"
        )}
      >
        <Swiper
          onSlideChange={() => onSlideChange()}
          slidesPerView={1}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
          className="slider"
          loop={true}
          ref={sliderRef}
        >
          {posts
            .map((post: any, i: number) => {
              return (
                <SwiperSlide key={i} className="featured-posts-item">
                  <Link href={post.path}>
                    <div
                      className="container w-full relative"
                    >
                      {post.featured_image.url &&
                        <div className="image w-full h-[80vh] relative mb-4">
                          <Image
                            fill
                            src={post.featured_image.url}
                            alt={post.title}
                            className="absolute object-cover"
                          />
                        </div>
                      }
                      <div
                        className={cn(
                          "content",
                          post.featured_image.url ? "absolute bottom-6 left-8 text-white" : "relative"
                        )}
                      >
                        <h2 className="title">
                          {post.title}
                        </h2>
                        {post.category_names &&
                          <div className="terms flex flex-row gap-2">
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
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })
          }
        </Swiper>
        <SliderNavigation
          prevHidden={prevHidden}
          nextHidden={nextHidden}
          handlePrev={handlePrev}
          handleNext={handleNext}
        />
      </div>
    </div>
  )
}

type SliderNavigationProps = {
  prevHidden: boolean;
  nextHidden: boolean;
  handlePrev: () => void;
  handleNext: () => void;
};

function SliderNavigation({
  prevHidden,
  nextHidden,
  handlePrev,
  handleNext,
}: SliderNavigationProps) {
  return (
    <div className="featured-posts-nav absolute bottom-0 z-[98] w-full flex justify-between pointer-events-none">
      <div className="prev">
        <button
          onClick={() => handlePrev()}
          className="pointer-events-auto"
        >
          Previous
        </button>
      </div>
      <div
        className="next"
      >
        <button
          onClick={() => handleNext()}
          className="pointer-events-auto"
        >
          Next
        </button>
      </div>
    </div>
  );
}
