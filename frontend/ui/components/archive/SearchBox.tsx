"use client";

import TextInput from "@ui/components/molecules/TextInput";

export const SearchBox = ({
  label,
  placeholder,
  value,
  onChange,
} : {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="filter-search w-full transition-[opacity,transform] md:w-80">
      <TextInput
        label={label}
        name="search-box"
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
      />
    </div>
  );
};
