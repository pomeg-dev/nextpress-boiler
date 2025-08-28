"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import cn from "classnames";
import SelectInput from "@ui/components/molecules/SelectInput";
import Button from "@ui/components/atoms/Button";
import Loader from "@ui/components/atoms/Loader";

const TaxonomyFilterInner = ({
  taxonomy,
  terms,
  tax_query,
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
  tax_query: any;
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
    if (tax_query) {
      const filter = tax_query.find((e: { taxonomy: string; }) => e.taxonomy === taxonomy);
      return filter ? filter.term : '';
    } else {
      const filter = filtersArray.find((e: { taxonomy: string; }) => e.taxonomy === taxonomy);
      return filter ? filter.terms : '';
    }
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

  const taxTerms = terms.map((term: { term_id: any; slug: any; name: any; }) => {
    const { term_id, slug, name } = term;
    return {
      term_id,
      value: slug,
      label: name
    };
  });

  return (
    <div
      className={cn(
        `filter-${taxonomy}`,
        "transition-[opacity,transform]",
        type === 'select' ? "max-w-lg" : "max-w-full"
      )}
    >
      {(() => {
          switch (type) {
            case "select":
              return (
                <SelectInput
                  defaultValue={findTerm(taxFilters)}
                  name={taxonomy}
                  onChange={event => {
                    handleFilterChange(event.target.value);
                  }}
                  placeholder={placeholder ?? 'Show all'}
                  options={taxTerms}
                  label={label}
                />
              );
            case "button":
              return (
                <>
                  {label &&
                    <label className="mb-2 block font-[500]" htmlFor={taxonomy}>{label}</label>
                  }
                  <div
                    className="flex flex-row flex-wrap gap-2 md:justify-end"
                    id={taxonomy}
                  >
                    {terms &&
                      <>
                        {terms.length > 1 &&
                          <Button
                            type="button"
                            size="md"
                            style={
                              findTerm(taxFilters) === ''
                                ? 'primary'
                                : 'secondary'
                            }
                            onClick={() => {
                              handleFilterChange("");
                            }}
                          >
                            {placeholder ? placeholder : "Show All"}
                          </Button>
                        }
                        {terms.map((term: any) => (
                          <Button
                            type="button"
                            size="md"
                            style={
                              findTerm(taxFilters) === term.slug
                                ? 'primary'
                                : 'secondary'
                            }
                            key={term.term_id}
                            onClick={() => {
                              handleFilterChange(term.slug);
                            }}
                          >
                            {term.name}
                          </Button>
                        ))}
                      </>
                    }
                  </div>
                </>
              );
          }
      })()}
    </div>
  );
};

export const TaxonomyFilter = ({
  taxonomy,
  terms,
  tax_query,
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
  tax_query: any;
  label: string;
  placeholder: string;
  type: string;
  taxFilters: any;
  setTaxFilters: any;
  setCurrentPage: any;
  setLoadMore: any;
}) => {
  return (
    <Suspense fallback={<Loader isLoading={true}/>}>
      <TaxonomyFilterInner 
        taxonomy={taxonomy}
        terms={terms}
        tax_query={tax_query}
        label={label}
        placeholder={placeholder}
        type={type}
        taxFilters={taxFilters}
        setTaxFilters={setTaxFilters}
        setCurrentPage={setCurrentPage}
        setLoadMore={setLoadMore}
      />
    </Suspense>
  );
};