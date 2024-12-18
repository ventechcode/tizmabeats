"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import SearchFilterSection from "@/components/SearchFilterSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import BeatCard from "@/components/BeatCard";
import { Beat } from "@/types";
import { useEffect, useState } from "react";

export default function Beats() {
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [beats, setBeats] = useState<Beat[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [bpms, setBpms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  let baseQuery = "/api/beats";

  // Initial fetch
  useEffect(() => {
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    const query = `${baseQuery}?${queryString}`;

    fetch(query)
      .then((res) => res.json())
      .then((data) => {
        setBeats(data);
        const genres = data.map((beat: any) => beat.genre);
        const bpms = data.map((beat: any) => beat.bpm);
        setGenres(genres);
        setBpms(bpms);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    const query = `${baseQuery}?${queryString}`;

    fetch(query)
      .then((res) => res.json())
      .then((data) => {
        setBeats(data);
        setIsLoading(false);
      });
  }, [queryParams]);

  if (isLoading) {
    console.log("Loading...");
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  const onGenreChange = (selections: Set<string>) => {
    let selectedGenres = Array.from(selections);
    setQueryParams((prev) => ({ ...prev, genre: selectedGenres.join(",") }));
  };

  const onBpmChange = (selections: Set<string>) => {
    let selectedBpms = Array.from(selections);
    setQueryParams((prev) => ({ ...prev, bpm: selectedBpms.join(",") }));
  };

  return (
    <div className="flex flex-col items-center h-full overflow-hidden ">
      {/* Search & Filter Section */}
      <SearchFilterSection genres={genres} onGenreChange={onGenreChange} bpms={bpms} onBpmChange={onBpmChange} />
      {/* Beats Section */}
      <ScrollArea>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {beats.map((beat: Beat, index: number) => (
            <BeatCard key={index} {...beat} />
          ))}
        </div>
      </ScrollArea>
      {/* <AudioPlayer /> */}
      <BackgroundBeams className="-z-10 bg-base" />
    </div>
  );
}
