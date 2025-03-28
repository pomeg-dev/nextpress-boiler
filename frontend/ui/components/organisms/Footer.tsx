"use client";

import React, { ReactNode, useEffect, useState } from "react";
import classNames from "classnames";
import { ImageProps, MenuItemsProps } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { linkFilter } from "@/utils/url";
import Parser from "html-react-parser";
import Button from "../atoms/Button";
import Modal from "./Modal";
import { getCookie, setCookie } from "@ui/utils/cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type FooterProps = {
  style: "solid" | "gradient" | "image";
  logo?: ImageProps;
  background_image?: ImageProps;
  background_colour?: string;
  menu_items?: MenuItemsProps[];
  copyright?: string;
  enable_safety_modal?: boolean;
  safety_modal?: string;
  safety_modal_dismiss_label?: string;
  safety_info_title?: string;
  safety_info?: { content: string }[];
  className?: string;
};

const Footer: React.FC<FooterProps> = ({
  logo,
  style = "image",
  background_image,
  background_colour,
  menu_items,
  copyright,
  enable_safety_modal,
  safety_modal,
  safety_modal_dismiss_label = "Acknowledge and Dismiss",
  safety_info_title,
  safety_info,
  className
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isBottom, setIsBottom] = useState(false);
  const [trayActive, setTrayActive] = useState(false);
  const [traysActive, setTraysActive] = useState<number[]>([]);

  const handleTrays = (i: number) => {
    const trays = [...traysActive];
    const index = traysActive.indexOf(i);
    if (index > -1) {
      trays.splice(index, 1);
    } else {
      trays.push(i);
    }
    setTraysActive(trays);
  };

  useEffect(() => {
    let isModalDismissed: string | boolean | null = getCookie('isi_dismissed');
    setShowModal(isModalDismissed === 'true' ? false : true);

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 5) {
        setIsBottom(true);
      } else {
        setIsBottom(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === "A" && 
        target.getAttribute("href")?.includes("#safety-info")
      ) {
        setTraysActive([1]);
      }
    };

    document.addEventListener("click", handleLinkClick);
    return () => {
      document.addEventListener("click", handleLinkClick);
    };
  }, []);

  return (
    <footer
      className={classNames(
        "footer",
        className,
        "relative z-[1] overflow-hidden pt-[140px] text-white bg-primary"
      )}
      style={{
        ...(background_colour ? { backgroundColor: background_colour } : {}),
      }}
      id="footer"
    >
      {style === "gradient" &&
        <div className="animated-gradient absolute bottom-0 left-0 z-[-1] h-full w-full bg-secondary">
          <div className="color-1 absolute bottom-[-90%] left-[-5%] aspect-square h-full w-[20%] bg-white opacity-35 blur-[130px]"></div>
          <div className="color-2 absolute right-[-5%] top-[-90%] aspect-square h-full w-[20%] bg-tertiary opacity-60 blur-[130px]"></div>
        </div>
      }
      {(style === "image" && background_image) && (
        <div className="absolute left-0 top-0 z-[-1] h-full w-full">
          <Image
            src={background_image.src}
            width={background_image.width}
            height={background_image.height}
            alt={background_image.alt}
            className={background_image.className}
            blurDataURL={background_image.blurImage ?? undefined}
            placeholder={background_image.blurImage ? "blur" : undefined}
          />
        </div>
      )}
      <div className="container flex items-end justify-between">
        {menu_items &&
          <ul className="flex flex-col gap-4 text-base">
            {menu_items.map((item: MenuItemsProps, i: number) => (
              <li key={i}>
                <Link
                  href={linkFilter(item.url, API_URL)}
                  target={item.target}
                  className={classNames(
                    "inline-flex items-center border-b-[1px] border border-transparent hover:border-b-white transition-colors",
                    item.classes
                  )}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        }
        {copyright &&
          <div className="max-w-[455px] text-[14px]">{Parser(copyright)}</div>
        }
      </div>
      {logo &&
        <Image
          src={logo.src}
          width={logo.width}
          height={logo.height}
          alt={logo.alt}
          className={logo.className}
        />
      }

      {safety_info &&
        <div className={classNames(
          "fixed z-50 w-full text-xs text-primary transition-[bottom]",
          isBottom ? "bottom-[-100px]" : "bottom-0",
        )}>
          <div className="container flex items-end justify-between gap-[48px]">
            {safety_info.map((item: any, i: number) => (
              <div
                key={i}
                className={classNames(
                  "md:basis-1/2 rounded-t-[15px] bg-[#F0F9FF] p-4 transition-[height] cursor-pointer relative duration-300",
                  traysActive.includes(i) ? "h-[75vh] overflow-y-auto" : "h-[100px]",
                  i === 0 ? "hidden md:block" : "basis-full"
                )}
                onClick={() => {
                  handleTrays(i);
                }}
              >
                <div className="absolute right-4 top-[14px] h-[18px] w-[18px]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" className={classNames(
                    !traysActive.includes(i) && "rotate-180"
                  )}>
                    <path d="M5.03033 6.21967C4.73744 5.92678 4.26256 5.92678 3.96967 6.21967C3.67678 6.51256 3.67678 6.98744 3.96967 7.28033L8.46967 11.7803C8.76256 12.0732 9.23744 12.0732 9.53033 11.7803L14.0303 7.28033C14.3232 6.98744 14.3232 6.51256 14.0303 6.21967C13.7374 5.92678 13.2626 5.92678 12.9697 6.21967L9 10.1893L5.03033 6.21967Z" fill="#01385D"/>
                  </svg>
                </div>
                <div className="isi-tray [&_a]:underline [&_li]:mb-2 [&_ul]:list-disc [&_ul]:pl-4">{Parser(item.content)}</div>
              </div>
            ))}
          </div>
        </div>
      }

      {/* {(safety_info_title && safety_info) &&
        <div
          className="fixed bottom-0 left-0 z-50 w-full backdrop-blur-[50px] transition-all"
          style={{
            height: trayActive ? "75vh" : "72px",
            background: trayActive ? "white" : "var(--color-primary)",
            boxShadow: "0px -4px 20px rgba(0, 0, 0, 0.15)"
          }}
        >
          <div className="container h-full">
            {trayActive ? (
              <div className="relative h-full text-primary">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-quaternary py-[20px]">
                  <h2 className="heading-xs !m-0">{safety_info_title}</h2>
                  <button
                    className="is-style-tertiary"
                    onClick={() => setTrayActive(false)}
                  >
                    Close
                  </button>
                </div>

                <div className="flex h-full flex-col gap-sm pt-sm md:flex-row">
                  {safety_info.map((item: any, i: number) => (
                    <div
                      key={i}
                      className={classNames(
                        "md:h-[calc(100%-100px)] overflow-auto",
                        i === 0 ? "h-[30%] lg:w-[420px] border-b border-quaternary md:border-none" : "h-[calc(80%-240px)] lg:w-[calc(100%-420px)] pr-2"
                      )}
                    >
                      <div className="isi-tray text-sm [&_li]:mb-4 [&_ul]:list-disc [&_ul]:pl-4">{Parser(item.content)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-between">
                <h2 className="!m-0 !text-lg">{safety_info_title}</h2>
                <button
                  className="is-style-quaternary"
                  onClick={() => setTrayActive(true)}
                >
                  Expand
                </button>
              </div>
            )}
          </div>
        </div>
      } */}

      {(enable_safety_modal && safety_modal) &&
        <Modal showModal={showModal} setShowModal={setShowModal} maxWidth={`480px`}>
          <div className="flex h-full flex-col gap-sm rounded-lg bg-white p-[20px] pt-8 text-primary">
            {safety_modal &&
              <div className="isi-tray flex flex-1 flex-col gap-2 [&_h5]:pr-8 [&_p]:!mb-[4px] [&_p]:text-sm">{Parser(safety_modal)}</div>
            }
            <Button
              style="secondary"
              className="m-auto"
              onClick={() => {
                setShowModal(false);
                setCookie('isi_dismissed', 'true', 7);
              }}
            >
              {safety_modal_dismiss_label ? safety_modal_dismiss_label : "Acknowledge and Dismiss"}
            </Button>
          </div>
        </Modal>
      }
    </footer>
  );
};

export default Footer;