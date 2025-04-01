"use client";

import TextInput from "@ui/components/molecules/TextInput";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const SearchBox = ({
  label,
  placeholder,
  searchTerm,
  setSearchTerm,
  setCurrentPage,
  setLoadMore,
} : {
  label: string;
  placeholder: string;
  searchTerm: string;
  setSearchTerm: any;
  setCurrentPage: any;
  setLoadMore: any;
}) => {
  const urlParams = useSearchParams();

  useEffect(() => {
    const searchUrlParam = urlParams.get('search');
    if (searchUrlParam) {
      setSearchTerm(searchUrlParam);
    }
  }, []);

  return (
    <div className="filter-search max-w-lg transition-[opacity,transform]">
      <TextInput
        label={label}
        name="search-box"
        value={searchTerm}
        placeholder={placeholder}
        onChange={event => {
          setSearchTerm(event.target.value);
          setCurrentPage(1);
          setLoadMore(false);
        }}
      />
    </div>
  );
};