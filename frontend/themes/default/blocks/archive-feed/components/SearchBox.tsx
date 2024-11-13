"use client";

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
      {label &&
        <label className="inline-block mb-2" htmlFor="search-box">{label}</label>
      }
      <input
        className="block w-full h-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        id="search-box"
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