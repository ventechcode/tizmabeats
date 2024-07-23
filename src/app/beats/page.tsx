"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import SearchFilterSection from "@/components/SearchFilterSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import BeatCard from "@/components/BeatCard";
import { Beat } from "@/types";
import { useEffect, useState } from "react";

export default function Beats() {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  let query = "/api/beats";

  useEffect(() => {
    fetch(query)
      .then((res) => res.json())
      .then((data) => {
        setBeats(data);
        const genres = data.map((beat: any) => beat.genre);
        console.log(genres);
        setGenres(genres);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    console.log("Loading...");
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  const onGenreChange = (selections: Set<string>) => {
    let selectedGenres = Array.from(selections);
    query = "/api/beats?genres=" + selectedGenres.join(",");
    fetch(query)
      .then((res) => res.json())
      .then((data) => {
        setBeats(data);
        console.log(data);
      });
  };

  return (
    <div className="flex flex-col items-center h-full overflow-hidden ">
      {/* Search & Filter Section */}
      <SearchFilterSection genres={genres} onGenreChange={onGenreChange} />
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
