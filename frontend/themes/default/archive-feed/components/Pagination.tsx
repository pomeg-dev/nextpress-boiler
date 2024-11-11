"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import cn from "classnames";
import Link from "next/link";

export function Pagination({ totalPages, currentPage, setCurrentPage }: {
  totalPages: number,
  currentPage: number,
  setCurrentPage: any,
}) {
  const urlParams = useSearchParams();
  useEffect(() => {
    const pageUrlParam = urlParams.get('page');
    if (pageUrlParam && parseInt(pageUrlParam) > 1) {
      setCurrentPage(pageUrlParam);
    }
  }, []);

  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    const button = (page: any) => {
      return (
        <Link
          href=""
          key={page}
          onClick={() => {
            setCurrentPage(page);
          }}
          className={cn(
            "button curspor-pointer w-auto",
            currentPage == page ? "is-active" : ""
          )}
        >{page}</Link>
      );
    };
    paginationButtons.push(button(i));
  }

  return (
    <div
      className={cn(
        "archive-pagination flex flex-row my-[20px] items-center justify-center gap-2 transition-[opacity,transform]",
        totalPages > 1 ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-0 translate-y-[100px]"
      )}
    >
      {totalPages > 1 &&
        <>
          {currentPage !== 1 &&
            <Link
              href=""
              onClick={() => {
                setCurrentPage(currentPage - 1);
              }}
              className="button cursor-pointer"
            >Previous</Link>
          }
          {paginationButtons}
          {currentPage !== totalPages &&
            <Link
              href=""
              onClick={() => {
                setCurrentPage(currentPage + 1);
              }}
              className="button cursor-pointer"
            >Next</Link>
          }
        </>
      }
    </div>
  );
}