"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import SearchFilterSection from "@/components/SearchFilterSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import BeatCard from "@/components/BeatCard";
import { Beat } from "@/types";
import { useEffect, useState } from "react";
import AudioPlayer from "@/components/AudioPlayer";

export default function Beats() {
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [beats, setBeats] = useState<Beat[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [bpms, setBpms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  let baseQuery = "/api/beats";

  // Initialize state based on URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialParams: Record<string, string> = {};
    
    params.forEach((value, key) => {
      initialParams[key] = value;
    });

    console.log("Initial Params:", initialParams);
    setQueryParams(initialParams);

    // Initial fetch
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
        setBpms(bpms.sort());
        setIsLoading(false);
      });
  }, []);

  // Fetch data based on queryParams
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

  // Update URL query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams();

    // Only append non-empty parameters to the URL
    if (queryParams.genre) {
      urlParams.set("genre", queryParams.genre);
    }
    if (queryParams.bpm) {
      urlParams.set("bpm", queryParams.bpm);
    }

    // If there are no query parameters, we don't need to change the URL
    if (urlParams.toString()) {
      window.history.pushState(null, "", "?" + urlParams.toString());
    } else {
      // If there are no parameters, just use the base URL
      window.history.pushState(null, "", window.location.pathname);
    }
  }, [queryParams]);

  if (isLoading) {
    console.log("Loading...");
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  const onGenreChange = (selections: Set<string>) => {
    let selectedGenres = Array.from(selections).join(",");
    // If no genres are selected, remove the genre from queryParams
    setQueryParams((prev) => {
      const newParams = { ...prev };
      if (selectedGenres) {
        newParams.genre = selectedGenres;
      } else {
        delete newParams.genre;
      }
      return newParams;
    });
  };

  const onBpmChange = (selections: Set<string>) => {
    let selectedBpms = Array.from(selections).join(",");
    // If no bpms are selected, remove the bpm from queryParams
    setQueryParams((prev) => {
      const newParams = { ...prev };
      if (selectedBpms) {
        newParams.bpm = selectedBpms;
      } else {
        delete newParams.bpm;
      }
      return newParams;
    });
  };

  const toogleAudioPlayer = () => {
    setShowAudioPlayer(!showAudioPlayer);
  };

  return (
    <div className="flex flex-col items-center h-full overflow-hidden ">
      {/* Search & Filter Section */}
      <SearchFilterSection genres={genres} onGenreChange={onGenreChange} bpms={bpms} onBpmChange={onBpmChange} />
      {/* Beats Section */}
      <ScrollArea>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {beats.map((beat: Beat, index: number) => (
            <BeatCard key={index} beat={beat} toggle={toogleAudioPlayer} />
          ))}
        </div>
      </ScrollArea>
      {/* Audio Player */}
      {showAudioPlayer && <AudioPlayer />}
      {/* Background */}
      <BackgroundBeams className="-z-10 bg-base" />
    </div>
  );
}
