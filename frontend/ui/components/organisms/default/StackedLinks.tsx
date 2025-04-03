import React, { ReactNode } from "react";
import classNames from "classnames";
import Parser from "html-react-parser";
import { LinkItemProps } from "@/lib/types";
import Pill from "../../atoms/Pill";
import Link from "next/link";
import { ArrowRight } from "../../../icons/icon-loader";

type StackedLinksProps = {
  label?: string;
  rows?: { link: LinkItemProps, description: string}[];
  top_spacer?: "xl" | "lg" | "md" | "0";
  bottom_spacer?: "xl" | "lg" | "md" | "0";
  className?: string;
  id?: string;
};

const StackedLinks: React.FC<StackedLinksProps> = ({
  label,
  rows,
  top_spacer = "xl",
  bottom_spacer = "xl",
  className,
  id,
}) => {
  return (
    <div
      className={classNames(
        "container",
        `pb-${bottom_spacer}`,
        `pt-${top_spacer}`,
        className
      )}
      id={id}
      data-bg="white"
    >
      {label &&
        <Pill
          style="no-fill"
          className="mb-sm"
        >
          {label}
        </Pill>
      }
      {rows &&
        <div className="flex flex-col">
          {rows.map((row: any, index: number) => (
            <Link
              href={row.link.url}
              target={row.link.target}
              key={index}
              className="group flex items-center justify-between border-b border-primary/20 py-md first:border-t first:border-primary/20"

            >
              <span className="w-[3em] text-heading-lg font-[500]">{(index + 1).toString().padStart(2, "0")}</span>
              <h3 className="!m-0 w-[8em] !text-heading-lg font-[500]">{row.link.title}</h3>
              <p className="!m-0 h-0 w-[calc(50%-8rem)] pr-20 text-lg font-[500] opacity-0 lg:h-auto lg:opacity-100">{row.description}</p>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary md:h-auto md:w-auto md:bg-transparent">
                <ArrowRight width="42px" height="36px" className="h-4 w-4 text-white md:h-auto md:w-auto md:text-primary" />
              </div>
            </Link>
          ))}
        </div>
      }
    </div>
  );
};

export default StackedLinks;