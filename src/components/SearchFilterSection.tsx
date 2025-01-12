'use client'

import React from 'react';
import GenreFilter from "@/components/GenreFilter";
import Searchbar from "@/components/Searchbar";
import { Separator } from "@/components/ui/separator";
import BpmFilter from "@/components/BpmFilter";

const SearchFilterSection = ({ genres, onGenreChange, bpms, onBpmChange, onSearch, initialSearch }: { genres: string[], onGenreChange: (selections: any) => void, bpms: string[], onBpmChange: (selections: any) => void, onSearch: (value: string) => void, initialSearch: string}) => {
  return (
    <div className="z-40 w-screen sm:w-3/4 bg-crust rounded-b-3xl sm:rounded-b-3xl md:rounded-b-full flex flex-col sm:items-center justify-between mb-2" >
      <h1 className="text-xs sm:text-lg text-center md:text-2xl p-4 uppercase font-bold text-text">
        Our database of professionally produced beats
      </h1>
      <Separator className='hidden sm:block'/>
      <Searchbar onSearch={onSearch} initialValue={initialSearch}/>
      <div className="hidden sm:flex sm:flex-row justify-center gap-4 w-full p-5">
        <GenreFilter genres={genres} onGenreChange={onGenreChange} />
        <BpmFilter bpms={bpms} onBpmChange={onBpmChange} />
      </div>
    </div>
  );
};

export default SearchFilterSection;
