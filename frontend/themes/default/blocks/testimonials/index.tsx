"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, Autoplay } from "swiper";
import Image from "next/image";
import "swiper/css";

export function testimonial(props: any) {
  return (
    <div className="testimonial my-[60px] mx-auto flex max-w-[1000px] items-center justify-center gap-[39px] rounded-[40px] bg-gray-dark px-[40px] py-[40px] text-white">
      <Swiper
        // onSlideChange={() => onSlideChange()}
        slidesPerView={1}
        pagination={{
          dynamicBullets: true,
        }}
        autoHeight={true}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        modules={[Navigation, A11y, Autoplay]}
        className="flex w-full"
        loop={true}
        // ref={sliderRef}
      >
        {props.data.testimonials.map((testimonial: any, index: number) => (
          <SwiperSlide key={index}>
            <div
              className="testimonial flex w-full flex-col items-center justify-center gap-[16px]"
              key={index}
            >
              <div className="testimonial__quote text-center text-[26px]">
                {testimonial.quote}
              </div>
              <div className="testimonial__image relative aspect-square h-[42px] w-[42px] shrink-0 overflow-hidden rounded-full">
                <Image
                  src={testimonial.person.url}
                  alt={"testimonial.person"}
                  fill
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="testimonial__quotee text-[16px] font-bold">
                  {testimonial.quotee}
                </div>
                <div className="testimonial__quotee_position text-[16px]">
                  {testimonial.quotee_position}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
// [
//   {
//     "id": "testimonials",
//     "type": "repeater",
//     "fields": [
//       {
//         "id": "person",
//         "type": "image"
//       },
//       {
//         "id": "quote",
//         "type": "textarea"
//       },
//       {
//         "id": "quotee",
//         "type": "text"
//       },
//       {
//         "id": "quotee_position",
//         "type": "text"
//       }
//     ]
//   }
// ]
