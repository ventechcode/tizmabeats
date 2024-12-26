'use client'

import React from 'react';
import GenreFilter from "@/components/GenreFilter";
import Searchbar from "./Searchbar";
import { Separator } from "@/components/ui/separator";
import BpmFilter from "@/components/BpmFilter";

const SearchFilterSection = ({ genres, onGenreChange, bpms, onBpmChange }: { genres: string[], onGenreChange: (selections: any) => void, bpms: string[], onBpmChange: (selections: any) => void}) => {
  return (
    <div className="absolute top-20 z-40 w-screen sm:w-3/4 bg-crust rounded-b-3xl sm:rounded-b-3xl md:rounded-b-full flex flex-col items-center justify-between" >
      <h1 className="text-lg sm:text-xl text-center md:text-2xl p-4 ">
        Our database of professionally produced beats.
      </h1>
      <Separator />
      <Searchbar />
      <div className="flex flex-row sm:flex-row justify-center gap-4 w-full p-5">
        <GenreFilter genres={genres} onGenreChange={onGenreChange} />
        <BpmFilter bpms={bpms} onBpmChange={onBpmChange} />
      </div>
    </div>
  );
};

export default SearchFilterSection;
