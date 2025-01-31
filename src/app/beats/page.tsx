"use client";

import SearchFilterSection from "@/components/SearchFilterSection";
import { Beat } from "@/types";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BeatList from "@/components/BeatList";
import { useGlobalAudioPlayer } from "@/hooks/useAudioPlayer";
import useSWR from "swr";
import SkeletonBeatList from "@/components/SkeletonBeatList";
import Loading from "../loading";
import Background from "@/components/Background";
export default function BeatsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const audioPlayer = useGlobalAudioPlayer();

  const baseQuery = "/api/beats";
  const [query, setQuery] = useState(baseQuery);
  const [beats, setBeats] = useState<Beat[]>([]);
  const [search, setSearch] = useState(searchParams.get("search") || null);
  
  const { data, isLoading } = useSWR(query, async (query) => {
    const res = await fetch(query);
    const data = await res.json();
    for (const beat of data) {
      setWavesurferRef(beat);
    }
    setBeats(data);
    return data;
  });

  // Fetch data whenever queryParams changes
  useEffect(() => {
    if (isLoading) console.log("Loading...");
    const queryString = searchParams.toString();
    const fullQuery = queryString ? `${baseQuery}?${queryString}` : baseQuery;

    setQuery(fullQuery);

    router.replace(`?${queryString}`);
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
    setSearch(value);
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

  const setWavesurferRef = (beat: Beat) => {
    if (audioPlayer.beat?.id === beat.id) {
      beat.wavesurferRef = audioPlayer.beat?.wavesurferRef;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <SearchFilterSection
        onGenreChange={onGenreChange}
        onBpmChange={onBpmChange}
        onSearch={onSearch}
        initialSearch={search!}
      />

      {(isLoading && !data && beats.length === 0 && search === "") && (
        <Loading />
      )}

      {isLoading && !data ? <SkeletonBeatList beats={beats || [1,2,3,4,5,6,7,8]} /> : <BeatList beats={data || []} />}

      <Background />
    </div>
  );
}
