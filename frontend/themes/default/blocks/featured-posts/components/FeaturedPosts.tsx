"use client";

import classNames from "classnames";
import React, { useCallback, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper";
import Link from "next/link";
import Image from "next/image";

export function FeaturedPosts({
  posts,
  heading,
  slidesToShow,
}: {
  posts: any;
  heading: string;
  slidesToShow: number;
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
    <div className="featured-posts py-[40px] break-out overflow-hidden">
      <div
        className={classNames(
          "container relative w-full max-w-full max-h-[100vh] min-h-0 min-w-0"
        )}
      >
        <div className="flex justify-between items-end">
          {heading &&
            <div className="text-primary heading" dangerouslySetInnerHTML={{ __html: heading }}></div>
          }
          <SliderNavigation
            prevHidden={prevHidden}
            nextHidden={nextHidden}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
        </div>
        <Swiper
          onSlideChange={() => onSlideChange()}
          slidesPerView={posts.length >= 2 ? 1.2 : 1}
          breakpoints={{
            768: {
              slidesPerView: posts.length >= slidesToShow ? slidesToShow - 0.2 : slidesToShow,
            },
          }}
          spaceBetween={16}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          loop={posts.length > 4}
          className="slider mt-[16px]"
          style={{ overflow: 'visible' }}
          modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
          ref={sliderRef}
        >
          {posts
            .map((post: any, i: number) => {
              return (
                <SwiperSlide key={i} className="featured-posts-item">
                  <Link href={post.path}>
                    <div
                      className="relative"
                    >
                      {post.featured_image.url &&
                        <div className="image relative aspect-[480/290] rounded-[5px] overflow-hidden">
                          <Image
                            fill
                            src={post.featured_image.url}
                            alt={post.title}
                            className="absolute object-cover"
                          />
                        </div>
                      }
                      {post.tags && post.tags.length > 0 &&
                        <div className="terms absolute top-[16px] right-[16px] flex flex-row gap-2">
                          {post.tags.map((tag: any, index: number) => (
                            <span className="pill !bg-white text-[14px]" key={index}>{tag.name}</span>
                          ))}
                        </div>
                      }
                      <div
                        className={classNames(
                          "content relative"
                        )}
                      >
                        <h3 className="title text-large my-[8px]">
                          {post.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })
          }
        </Swiper>
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
    <div className="featured-posts-nav flex gap-[10px]">
      <div className="prev">
        <button
          onClick={() => handlePrev()}
          className="pointer-events-auto is-style-secondary"
        >
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17" fill="none" className="relative transition-transform duration-300 group-hover:translate-x-[6px]">
              <path d="M20 8.5L0.999999 8.5M0.999999 8.5L8.41463 16M0.999999 8.5L8.41463 1" stroke="currentColor"/>
            </svg>
          </span>
        </button>
      </div>
      <div
        className="next"
      >
        <button
          onClick={() => handleNext()}
          className="pointer-events-auto is-style-secondary"
        >
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17" fill="none" className="relative rotate-180 transition-transform duration-300 group-hover:translate-x-[6px]">
              <path d="M20 8.5L0.999999 8.5M0.999999 8.5L8.41463 16M0.999999 8.5L8.41463 1" stroke="currentColor"/>
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
