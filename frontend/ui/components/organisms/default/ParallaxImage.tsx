"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Parser from "html-react-parser";
import { ImageProps, LinkItemProps } from "@/lib/types";
import Button from "../../atoms/Button";
import Image from "next/image";
import Link from "next/link";

type ButtonProps = {
  link: LinkItemProps;
};

type ParallaxImageProps = {
  style?: "container" | "break-out";
  image?: ImageProps;
  links?: ButtonProps[];
  top_spacer?: "xl" | "lg" | "md" | "0";
  bottom_spacer?: "xl" | "lg" | "md" | "0";
  className?: string;
  id?: string;
};

const ParallaxImage: React.FC<ParallaxImageProps> = ({
  style = "break-out",
  image,
  links,
  top_spacer = "xl",
  bottom_spacer = "xl",
  className,
  id,
}) => {
  const containerRef = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (isVisible && containerRef.current) {
        const image = containerRef.current.querySelector('img');
        if (image) {
          const rect = containerRef.current.getBoundingClientRect();
          const scrollPosition = window.scrollY;
          const offset = rect.top + scrollPosition;
          const parallaxOffset = (scrollPosition - offset) * 0.5;
          image.style.transform = `translateY(${parallaxOffset}px)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  return (
    <div
      className={classNames(
        className,
        `pb-${bottom_spacer}`,
        `pt-${top_spacer}`,
        style,
      )}
      id={id}
    >
      <div
        className={classNames(
          "relative overflow-hidden flex flex-col aspect-square md:aspect-[1440/800]",
          style === "container" && "rounded-lg"
        )}
        style={{ willChange: "transform" }}
        ref={containerRef}
      >
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width ?? 800}
            height={image.width ?? 600}
            className={image.className ?? "h-full w-full object-cover"}
            blurDataURL={image.blurImage ?? image.src}
            placeholder="blur"
          />
        )}
        <section className="absolute flex h-full w-full flex-col items-center justify-center text-white">
          {(links && links.length > 0) &&
            <div className="flex flex-wrap items-center justify-center gap-8">
              {links.map((item: ButtonProps, index: number) => (
                <React.Fragment key={index}>
                  {index !== 0 && <span className="text-lg font-[500] md:text-heading-md">•</span>}
                  <Link
                    href={item.link.url || '#'}
                    target={item.link.target || '_self'}
                    className="inline-flex items-center border-b border-transparent text-lg font-[500] transition-colors hover:border-white md:text-heading-lg"
                  >
                    {item.link.title}
                  </Link>
                </React.Fragment>
              ))}
            </div>
          }
        </section>
      </div>
    </div>
  );
};

export default ParallaxImage;