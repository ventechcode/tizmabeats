import React from "react";
import { Input } from "@nextui-org/input";

export default function Searchbar({
  onSearch,
}: {
  onSearch: (value: string) => void;
}) {
  return (
    <Input
      label="Search"
      classNames={{
        base: "w-full md:w-3/5 mt-5 px-5 mb-4 sm:mb-0",
        label: "text-text relative",
        input: [
          "bg-surface0",
          "text-text",
          "placeholder:text-subtext0",
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
      onValueChange={(value) => onSearch(value)}
      placeholder="Type to search..."
      startContent={<SearchIcon />}
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
    className="size-6 text-text"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);
