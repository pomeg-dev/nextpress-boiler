"use client";

import TextInput from "@ui/components/molecules/TextInput";

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
  return (
    <div className="filter-search w-full transition-[opacity,transform] md:w-80">
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