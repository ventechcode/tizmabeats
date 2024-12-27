"use client";

import SearchFilterSection from "@/components/SearchFilterSection";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import BeatCard from "@/components/BeatCard";
import { Beat } from "@/types";
import { useEffect, useState } from "react";
import AudioPlayer from "@/components/AudioPlayer";
import { useSearchParams, useRouter } from "next/navigation";

export default function Beats() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [beats, setBeats] = useState<Beat[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [bpms, setBpms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  const baseQuery = "/api/beats";

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Fetch data based on initial query params
    const queryArray: string[] = [];
    params.forEach((value, key) => {
      queryArray.push(`${key}=${value}`);
    });
    const queryString = queryArray.join("&");
    const query = queryString ? `${baseQuery}?${queryString}` : baseQuery;

    router.push(`?${queryString}`);

    fetch(baseQuery)
      .then((res) => res.json())
      .then((data) => {
        const genres = data.map((beat: any) => beat.genre);
        const bpms = data.map((beat: any) => beat.bpm);
        setGenres(genres);
        setBpms(bpms.sort());
      });

    fetch(query)
      .then((res) => res.json())
      .then((data) => {
        setBeats(data);
        setIsLoading(false);
      });
  }, []);

  // Fetch data whenever queryParams changes
  useEffect(() => {
    setIsLoading(true); // Show loading spinner
    const params = new URLSearchParams(searchParams.toString());

    const queryArray: string[] = [];
    params.forEach((value, key) => {
      queryArray.push(`${key}=${value}`);
    });
    const queryString = queryArray.join("&");
    const query = queryString ? `${baseQuery}?${queryString}` : baseQuery;

    router.push(`?${queryString}`);

    fetch(query)
      .then((res) => res.json())
      .then((data) => {
        setBeats(data);
        setIsLoading(false);
      });
  }, [searchParams]);

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    return params.toString();
  };

  const onGenreChange = (selections: Set<string>) => {
    let selectedGenres = Array.from(selections).join(",");
    router.push(`?${createQueryString("genre", selectedGenres)}`);
  };

  const onBpmChange = (selections: Set<string>) => {
    let selectedBpms = Array.from(selections).join(",");
    router.push(`?${createQueryString("bpm", selectedBpms)}`);
  };

  const toogleAudioPlayer = () => {
    setShowAudioPlayer(!showAudioPlayer);
  };

  return (
    <div className="flex flex-col items-center justify-start h-full overflow-hidden">
      {/* Search & Filter Section */}
      <SearchFilterSection
        genres={genres}
        onGenreChange={onGenreChange}
        bpms={bpms}
        onBpmChange={onBpmChange}
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Beats Section */}
      <ScrollArea className="absolute mt-24 sm:mt-64 h-screen">
        <div className="flex flex-col mt-44 sm:mt-0 sm:grid gap-4 sm:p-4 sm:grid-cols-1 md:grid-cols-2 lg lg:grid-cols-2 xl:grid-cols-4">
          {beats.map((beat: Beat, index: number) => (
            <BeatCard key={index} beat={beat} toggle={toogleAudioPlayer} />
          ))}
        </div>
        <ScrollBar />
      </ScrollArea>

      {/* Audio Player */}
      {showAudioPlayer && <AudioPlayer />}
      {/* Background */}
    </div>
  );
}
