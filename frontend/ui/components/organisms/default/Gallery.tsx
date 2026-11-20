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

// Image sizes per layout and tile, from the grids in theme.scss `.gallery-*`
// (container 92vw; md 720px, lg 1080px).
const sizesFor = (layout: GalleryProps["layout"], index: number) => {
  switch (layout) {
    case "filmstrip":
      // Tile width clamp(15rem, 28vw, 26rem).
      return "(min-width: 1486px) 416px, (min-width: 857px) 28vw, 240px";
    case "stagger":
      return "(min-width: 720px) 45vw, 92vw";
    case "collage":
      return index === 0 ? "(min-width: 1080px) 46vw, 92vw" : "(min-width: 1080px) 31vw, 46vw";
    default: {
      // Mosaic: tiles 1 and 4 of each six span both mobile columns; on lg,
      // tiles 1, 4, 5 and 6 span two of the four columns.
      const n = index % 6;
      const mobile = n === 0 || n === 3 ? "92vw" : "46vw";
      const desktop = n === 0 || n >= 3 ? "46vw" : "23vw";
      return `(min-width: 1080px) ${desktop}, ${mobile}`;
    }
  }
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
  // Header padding means the block opens the page, so it carries the h1 and
  // its first images load at once (one of them is the LCP).
  const opensPage = blockOptions?.padding_top === "header";
  const Heading = opensPage ? "h1" : "h2";

  const items = images.map((image, index) => (
    <figure key={index} className="gallery-item chip">
      <div className="gallery-media img-duotone is-revealable relative overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt ?? ""}
          fill
          sizes={sizesFor(layout, index)}
          priority={opensPage && index < 3}
          className="object-cover"
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
          <Heading className={classNames("mb-lg", isFilmstrip ? "heading-2xl" : "heading-xl")}>
            {heading}
          </Heading>
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
