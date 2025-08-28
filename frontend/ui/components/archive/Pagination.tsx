"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import cn from "classnames";
import Button from "@ui/components/atoms/Button";

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
        <Button
          type="button"
          key={page}
          onClick={() => {
            setCurrentPage(page);
          }}
          size="md"
          style={
            currentPage == page
              ? 'primary'
              : 'secondary'
          }
        >{page}</Button>
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
            <Button
              type="button"
              size="md"
              onClick={() => {
                setCurrentPage(currentPage - 1);
              }}
            >Previous</Button>
          }
          {paginationButtons}
          {currentPage !== totalPages &&
            <Button
              type="button"
              size="md"
              onClick={() => {
                setCurrentPage(currentPage + 1);
              }}
            >Next</Button>
          }
        </>
      }
    </div>
  );
}