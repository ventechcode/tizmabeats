"use client";

import { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";

export default function Searchbar({
  onSearch,
  initialValue,
}: {
  onSearch: (value: string) => void;
  initialValue: string;
}) {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setSearchValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      label="Search"
      classNames={{
        base: "w-3/4 h-8 sm:h-12 sm:h-full md:w-3/5 sm:mt-5 sm:px-5 mb-4 sm:mb-0",
        label: "text-text relative text-xs sm:text-sm",
        input: [
          "bg-surface0",
          "text-text",
          "placeholder:text-subtext0, text-sm md:text-lg",
          "sm:mb-1",
        ],
        innerWrapper:
          "bg-transparent flex flex-row items-center justify-center",
        inputWrapper: [
          "shadow-xl",
          "rounded-lg",
          "bg-surface0",
          "!cursor-text",
        ],       
      }}
      onValueChange={(value) => {
        onSearch(value);
        setSearchValue(value);
      }}
      placeholder="Type to search..."
      startContent={<SearchIcon />}
      value={searchValue}
    />
  );
}

export const SearchIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-5 sm:size-6 text-text sm:mb-1"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);
