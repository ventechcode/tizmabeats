'use client'

import React from 'react';
import GenreFilter from "@/components/GenreFilter";
import Searchbar from "@/components/Searchbar";
import { Separator } from "@/components/ui/separator";
import BpmFilter from "@/components/BpmFilter";

const SearchFilterSection = ({ genres, onGenreChange, bpms, onBpmChange }: { genres: string[], onGenreChange: (selections: any) => void, bpms: string[], onBpmChange: (selections: any) => void}) => {
  return (
    <div className="w-3/4 bg-crust rounded-lg flex flex-col items-center justify-between sm:mt-10" >
      <h1 className="sm:text-2xl p-4 ">
        Our database of professionally produced beats.
      </h1>
      <Separator />
      <Searchbar />
      <div className="flex flex-row justify-center gap-4 w-full p-5">
        <GenreFilter genres={genres} onGenreChange={onGenreChange} />
        <BpmFilter bpms={bpms} onBpmChange={onBpmChange} />
      </div>
    </div>
  );
};

export default SearchFilterSection;
