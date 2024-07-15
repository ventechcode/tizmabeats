'use client'

import React from 'react';
import GenreFilter from "@/components/genre-filter";
import Searchbar from "@/components/searchbar";
import { Separator } from "@/components/ui/separator";
import { Selection } from "@nextui-org/react";

const SearchFilterSection = ({ genres }: { genres: string[]}) => {
  return (
    <div className="w-full bg-crust rounded-lg flex flex-col items-center justify-between sm:mt-10" >
      <h1 className="sm:text-2xl p-4 ">
        Our database of professionally produced beats.
      </h1>
      <Separator />
      <Searchbar />
      <div className="flex flex-row justify-center gap-4 w-full p-5">
        <GenreFilter genres={genres} />
        <GenreFilter genres={genres}  />
        <GenreFilter genres={genres}  />
      </div>
    </div>
  );
};

export default SearchFilterSection;
