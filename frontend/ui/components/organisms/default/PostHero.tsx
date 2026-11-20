import React from "react";
import classNames from "classnames";
import Image from "next/image";
import { BlockOptions } from "@pomeg-dev/nextpress-client/types";
import Pill from "../../atoms/Pill";
import BlockWrapper from "./BlockWrapper";

type PostHeroProps = {
  title?: string;
  /** WordPress local date, "YYYY-MM-DD HH:MM:SS". */
  date?: string;
  excerpt?: string;
  image?: string;
  categories?: string[];
  themes?: string[];
  /** Post ID: the last two digits make the chip code. */
  code?: number;
  blockOptions?: BlockOptions;
  className?: string;
  id?: string;
};

// Formats the date part only, in UTC, so the server's time zone can't shift the day.
const formatDate = (date: string) => {
  const [year, month, day] = date.slice(0, 10).split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, day)));
};

// A single post's title block: the hero-image split at post scale. Meta closes
// the text (no kicker above the title); the featured image is a 3:2 chip like
// the post cards, coded with the first category.
const PostHero: React.FC<PostHeroProps> = ({
  title,
  date,
  excerpt,
  image,
  categories = [],
  themes = [],
  code,
  blockOptions,
  className,
  id,
}) => {
  if (!title) return null;

  const hasMeta = date || categories.length > 0 || themes.length > 0;

  return (
    <BlockWrapper
      blockOptions={blockOptions}
      className={className}
      id={id}
      style={{
        paddingTop: "var(--space-lg)",
        paddingBottom: "var(--space-lg)",
      }}
    >
      <div className={classNames("container grid gap-lg", image && "lg:grid-cols-12 lg:items-end")}>
        <div className={classNames("flow", image ? "lg:col-span-7" : "measure")}>
          <h1 className="heading-xl">{title}</h1>
          {excerpt && <p className="body-lg measure text-muted">{excerpt}</p>}
          {hasMeta && (
            <div className="mt-md! flex flex-wrap items-center gap-xs">
              {date && (
                <time dateTime={date.slice(0, 10)} className="label mr-xs text-muted">
                  {formatDate(date)}
                </time>
              )}
              {categories.map((category) => (
                <Pill key={category} size="sm" style="high-contrast">{category}</Pill>
              ))}
              {themes.map((theme) => (
                <Pill key={theme} size="sm" style="primary">{theme}</Pill>
              ))}
            </div>
          )}
        </div>

        {image && (
          <figure className="chip lg:col-span-5 lg:col-start-8">
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image
                src={image}
                alt=""
                fill
                priority
                sizes="(min-width: 1080px) 40vw, 92vw"
                className="object-cover"
              />
            </div>
            {categories[0] && (
              <figcaption className="chip-strip">
                <span>{`NP–${String((code ?? 0) % 100).padStart(2, "0")} · ${categories[0]}`}</span>
                <span className="size-3 bg-accent-fill" aria-hidden="true" />
              </figcaption>
            )}
          </figure>
        )}
      </div>
    </BlockWrapper>
  );
};

export default PostHero;
