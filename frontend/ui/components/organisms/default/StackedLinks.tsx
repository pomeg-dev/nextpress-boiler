import React from "react";
import { BlockOptions, LinkItemProps } from "@pomeg-dev/nextpress-client/types";
import Link from "next/link";
import { ArrowRight } from "../../../icons/icon-loader";
import BlockWrapper, { ownSpacing } from "./BlockWrapper";

type StackedLinksProps = {
  label?: string;
  rows?: { link: LinkItemProps, description: string}[];
  top_spacer?: "xl" | "lg" | "md" | "0";
  bottom_spacer?: "xl" | "lg" | "md" | "0";
  blockOptions?: BlockOptions;
  className?: string;
  id?: string;
};

// Full-width type rows. The accent fill sweeps in behind a row on hover.
const StackedLinks: React.FC<StackedLinksProps> = ({
  label,
  rows,
  top_spacer = "xl",
  bottom_spacer = "xl",
  blockOptions,
  className,
  id,
}) => {
  const items = (rows ?? []).filter((row) => row?.link?.url);

  return (
    <BlockWrapper
      blockOptions={blockOptions}
      className={className}
      id={id}
      style={{
        paddingTop: ownSpacing(top_spacer, blockOptions?.padding_top),
        paddingBottom: ownSpacing(bottom_spacer, blockOptions?.padding_bottom),
      }}
    >
      <div className="container">
        {label && <h2 className="heading-xl mb-lg">{label}</h2>}
        {items.length > 0 && (
          <ul className="border-t border-rule">
            {items.map((row, index) => (
              <li key={index} className="border-b border-rule">
                <Link
                  href={row.link.url || "#"}
                  target={row.link.target || undefined}
                  className="stacked-link"
                >
                  <span className="stacked-link-title">{row.link.title}</span>
                  {row.description && (
                    <span className="stacked-link-text">{row.description}</span>
                  )}
                  <span className="stacked-link-icon" aria-hidden="true">
                    <ArrowRight width="28" height="28" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </BlockWrapper>
  );
};

export default StackedLinks;
