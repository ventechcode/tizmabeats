"use client";

import React from "react";
import GenreFilter from "@/components/GenreFilter";
import Searchbar from "@/components/Searchbar";
import { Separator } from "@/components/ui/separator";
import BpmFilter from "@/components/BpmFilter";
import { useRouter, useSearchParams } from "next/navigation";

const SearchFilterSection = ({
  searchParams,
  genres,
  bpms,
}: {
  searchParams?: { search: string; genres: string; bpms: string };
  genres: string[];
  bpms: string[];
}) => {
  const router = useRouter();

  const updateSearch = (search: string) => {
    const params = new URLSearchParams(searchParams);
    if (search === "") {
      params.delete("search");
      router.push(`/beats?${params.toString()}`, { scroll: false });
    } else {
      params.set("search", search);
      router.push(`/beats?${params.toString()}`, { scroll: false });
    }
  };

  const onGenreChange = (genres: string) => {
    const params = new URLSearchParams(searchParams);
    if (genres === "") {
      params.delete("genres");
      router.push(`/beats?${params.toString()}`, { scroll: false });
    } else {
      params.set("genres", genres);
      router.push(`/beats?${params.toString()}`, { scroll: false });
    }
  };

  const onBpmChange = (bpms: string) => {
    const params = new URLSearchParams(searchParams);
    if (bpms === "") {
      params.delete("bpms");
      router.push(`/beats?${params.toString()}`, { scroll: false });
    } else {
      params.set("bpms", bpms);
      router.push(`/beats?${params.toString()}`, { scroll: false });
    }
  };

  return (
    <div className="relative z-40 w-full sm:w-3/4 bg-crust sm:rounded-b-3xl md:rounded-b-full flex flex-col items-center sm:items-center">
      <h1 className="text-xs xs:text-sm sm:text-lg text-center md:text-2xl p-4 uppercase font-bold text-text">
        Browse our professionally produced beats
      </h1>
      <Separator className="hidden sm:block" />
      <Searchbar
        value={searchParams?.search || ""}
        updateSearch={updateSearch}
      />
      <div className="flex flex-row justify-center gap-2 py-2">
        <GenreFilter
          initialValues={searchParams?.genres?.split(",") || []}
          genres={genres}
          onGenreChange={onGenreChange}
        />
        <BpmFilter
          initialValues={
            searchParams?.bpms?.split(",").map((bpm) => parseInt(bpm)) || []
          }
          bpms={bpms.map((bpm) => parseInt(bpm))}
          onBpmChange={onBpmChange}
        />
      </div>
    </div>
  );
};

export default SearchFilterSection;
