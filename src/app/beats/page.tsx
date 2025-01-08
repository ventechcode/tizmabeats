"use client";

import SearchFilterSection from "@/components/SearchFilterSection";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import BeatCard from "@/components/BeatCard";
import SkeletonBeatCard from "@/components/SkeletonBeatCard";
import { Beat } from "@/types";
import { useEffect, useState } from "react";
import AudioPlayer from "@/components/AudioPlayer";
import { useSearchParams, useRouter } from "next/navigation";
import { WavyBackground } from "@/components/ui/wavy-background";
import { flavorEntries } from "@catppuccin/palette";

export default function Beats() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [beats, setBeats] = useState<Beat[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [bpms, setBpms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [beatsLoading, setBeatsLoading] = useState(false);

  const baseQuery = "/api/beats";

  const [currentlyPlaying, setCurrentlyPlaying] = useState<Beat | null>(null);

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
    setBeatsLoading(true);
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
        setBeatsLoading(false);
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

  const onSearch = (value: string) => {
    router.push(`?${createQueryString("search", value)}`);
  };

  const onGenreChange = (selections: Set<string>) => {
    let selectedGenres = Array.from(selections).join(",");
    router.push(`?${createQueryString("genre", selectedGenres)}`);
  };

  const onBpmChange = (selections: Set<string>) => {
    let selectedBpms = Array.from(selections).join(",");
    router.push(`?${createQueryString("bpm", selectedBpms)}`);
  };

  const play = (beat: Beat, pause: boolean) => {
    if (currentlyPlaying && currentlyPlaying.id == beat.id) {
      if (pause) {
        beat.wavesurferRef.current?.playPause();
        return;
      } else {
        setCurrentlyPlaying(null);
        return;
      }
    }
    setCurrentlyPlaying(beat);
  };

  useEffect(() => {}, [currentlyPlaying]);

  // Get background color based on flavor for wavy background
  const getBgColor = () => {
    if (typeof window !== "undefined") {
      const flavorList = flavorEntries.map((entry) => entry[1]);
      const flavor = flavorList.filter((flavor) =>
        document.body.className.includes(flavor.name.toLowerCase())
      )[0];
      return flavor.colors.base.hex;
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-full overflow-hidden">
      <SearchFilterSection
        genres={genres}
        onGenreChange={onGenreChange}
        bpms={bpms}
        onBpmChange={onBpmChange}
        onSearch={onSearch}
      />
      -
      <ScrollArea className="absolute mt-20 sm:mt-80 h-screen w-full z-10 mb-6">
        <div className="flex flex-col mt-44 sm:mt-0 sm:grid gap-4 sm:p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {isLoading ? (
            <div className="loading loading-spinner loading-lg absolute inset-0 mt-12 text-blue"></div>
          ) : beatsLoading ? (
            beats.map((_, i) => <SkeletonBeatCard key={i} />)
          ) : (
            beats.map((beat: Beat, index: number) => (
              <BeatCard
                key={index}
                beat={beat}
                play={play}
                isPlaying={currentlyPlaying?.id === beat.id}
              />
            ))
          )}
        </div>
        <ScrollBar />
      </ScrollArea>
      {currentlyPlaying && (
        <AudioPlayer beat={currentlyPlaying} toggle={play} />
      )}
      <WavyBackground speed="fast" backgroundFill={getBgColor()} blur={5} />
    </div>
  );
}
