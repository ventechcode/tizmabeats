import React from "react";
import { Input } from "@nextui-org/input";

export default function Searchbar() {
  return (
    <Input
      label="Search"
      isClearable
      classNames={{
        base: "w-full md:w-3/4 mt-5 px-5",
        label: "text-white/90 relative pb-5",
        input: [
          "bg-surface0",
          "text-text",
          "placeholder:text-default-700/50 dark:placeholder:text-white/60",
        ],
        innerWrapper: "bg-transparent flex flex-row items-center justify-center",
        inputWrapper: [
          "shadow-xl",
          "rounded-lg",
          "bg-surface0",
          "!cursor-text",
        ],
      }}
      placeholder="Type to search..."
      startContent={<SearchIcon className="" />}
    />
  );
}

export const SearchIcon = (props: any) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);
