import React from "react";
import classNames from "classnames";
import { BlockOptions, ImageProps } from "@pomeg-dev/nextpress-client/types";
import Image from "next/image";
import BlockWrapper from "./BlockWrapper";

type GalleryProps = {
  heading?: string;
  images?: ImageProps[];
  captions?: string[];
  layout?: "mosaic" | "filmstrip" | "stagger" | "collage";
  blockOptions?: BlockOptions;
  className?: string;
  id?: string;
};

// Image sizes hint per layout (the grids live in theme.scss `.gallery-*`).
const SIZES = {
  mosaic: "(min-width: 1024px) 33vw, 50vw",
  filmstrip: "(min-width: 1024px) 30vw, 80vw",
  stagger: "(min-width: 768px) 45vw, 100vw",
  collage: "(min-width: 1024px) 40vw, 100vw",
};

const Gallery: React.FC<GalleryProps> = ({
  heading,
  images = [],
  captions = [],
  layout = "mosaic",
  blockOptions,
  className,
  id,
}) => {
  if (images.length === 0) return null;
  const isFilmstrip = layout === "filmstrip";

  const items = images.map((image, index) => (
    <figure key={index} className="gallery-item chip">
      <div className="gallery-media relative overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt ?? ""}
          fill
          sizes={SIZES[layout] ?? SIZES.mosaic}
          className="object-cover"
          {...(image.blurImage && { placeholder: "blur", blurDataURL: image.blurImage })}
        />
      </div>
      {captions[index] && <figcaption className="chip-strip">{captions[index]}</figcaption>}
    </figure>
  ));

  return (
    <BlockWrapper
      blockOptions={blockOptions}
      className={classNames("overflow-x-clip", className)}
      id={id}
      style={{ paddingTop: "var(--space-xl)", paddingBottom: "var(--space-xl)" }}
    >
      <div className="container">
        {heading && (
          <h2 className={classNames("mb-lg", isFilmstrip ? "heading-2xl" : "heading-xl")}>
            {heading}
          </h2>
        )}
        {isFilmstrip ? (
          // Scrollable row: focusable so keyboard users can scroll it.
          <div
            className="gallery-filmstrip"
            role="region"
            tabIndex={0}
            aria-label={heading || "Image gallery"}
          >
            {items}
          </div>
        ) : (
          <div className={`gallery-${layout}`}>{items}</div>
        )}
      </div>
    </BlockWrapper>
  );
};

export default Gallery;
