'use client'

import React from 'react';
import GenreFilter from "@/components/GenreFilter";
import Searchbar from "@/components/Searchbar";
import { Separator } from "@/components/ui/separator";
import BpmFilter from "@/components/BpmFilter";

const SearchFilterSection = ({ onGenreChange, onBpmChange, onSearch, initialSearch }: { onGenreChange: (selections: any) => void, onBpmChange: (selections: any) => void, onSearch: (value: string) => void, initialSearch: string}) => {
  return (
    <div className="relative z-40 w-full sm:w-3/4 bg-crust sm:rounded-b-3xl md:rounded-b-full flex flex-col items-center sm:items-center" >
      <h1 className="text-sm sm:text-lg text-center md:text-2xl p-4 uppercase font-bold text-text">
        Browse our professionally produced beats
      </h1>
      <Separator className='hidden sm:block'/>
      <Searchbar onSearch={onSearch} initialValue={initialSearch}/>
      <div className="flex flex-row justify-center gap-2 py-2">
        <GenreFilter  onGenreChange={onGenreChange} />
        <BpmFilter onBpmChange={onBpmChange} />
      </div>
    </div>
  );
};

export default SearchFilterSection;
