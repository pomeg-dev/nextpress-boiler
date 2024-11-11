"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import cn from "classnames";
import Link from "next/link";

export const TaxonomyFilter = ({
  taxonomy,
  terms,
  label,
  placeholder,
  type,
  taxFilters,
  setTaxFilters,
  setCurrentPage,
  setLoadMore,
} : {
  taxonomy: string;
  terms: any;
  label: string;
  placeholder: string;
  type: string;
  taxFilters: any;
  setTaxFilters: any;
  setCurrentPage: any;
  setLoadMore: any;
}) => {
  const urlParams = useSearchParams();

  const setFilter = (term: string) => {
    const tempTax = [...taxFilters];
    const filter: any = {
      taxonomy: taxonomy,
      terms: term,
    };

    const termIndex = tempTax.findIndex(e => e.taxonomy === taxonomy);
    if (termIndex !== -1) {
      tempTax.splice(termIndex, 1);
    }
    tempTax.push(filter);
    setTaxFilters(tempTax);
  };

  const findTerm = (filtersArray: any[]) => {
    const filter = filtersArray.find((e: { taxonomy: string; }) => e.taxonomy === taxonomy);
    return filter ? filter.terms : '';
  };

  const handleFilterChange = (term: string) => {
    setFilter(term);
    setCurrentPage(1);
    setLoadMore(false);
  }
  
  useEffect(() => {
    const tempTax: any[] = [];
    urlParams.forEach((value, key) => {
      if (key.includes('filter_')) {
        const filter: any = {
          taxonomy: key.replace('filter_', ''),
          terms: value,
        };
        tempTax.push(filter);
      }
    });
    setTaxFilters(tempTax);
  }, []);

  return (
    <div
      className={cn(
        `filter-${taxonomy}`,
        "transition-[opacity,transform]",
        type === 'select' ? "max-w-lg" : "max-w-full"
      )}
    >
      {label &&
        <label className="mb-2 inline-block" htmlFor={taxonomy}>{label}</label>
      }
      {(() => {
          switch (type) {
            case "select":
              return (
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={findTerm(taxFilters)}
                  onChange={event => {
                    handleFilterChange(event.target.value);
                  }}
                  id={taxonomy}
                >
                  <option value="">{placeholder ?? 'Show all'}</option>
                  {terms &&
                    terms.map((term: any) => (
                      <option key={term.id} value={term.slug}>{term.name}</option>
                    ))
                  }
                </select>
              );
            case "button":
              return (
                <div
                  className="flex flex-row gap-2"
                  id={taxonomy}
                >
                  <Link
                    href=""
                    className={cn(
                      "button",
                      findTerm(taxFilters) === ''
                        ? "is-active"
                        : ""
                    )}
                    onClick={() => {
                      handleFilterChange("");
                    }}
                  >Show All</Link>
                  {terms &&
                    terms.map((term: any) => (
                      <Link
                        href=""
                        className={cn(
                          "button",
                          findTerm(taxFilters) === term.slug
                            ? "is-active"
                            : ""
                        )}
                        key={term.id}
                        onClick={() => {
                          handleFilterChange(term.slug);
                        }}
                      >{term.name}</Link>
                    ))
                  }
                </div>
              );
          }
      })()}
    </div>
  );
};