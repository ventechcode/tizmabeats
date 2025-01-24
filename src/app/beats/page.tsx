"use client";

import SearchFilterSection from "@/components/SearchFilterSection";
import { Beat } from "@/types";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BeatList from "@/components/BeatList";
import { useGlobalAudioPlayer } from "@/hooks/useAudioPlayer";
import Background from "@/components/Background";

export default function Beats() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const audioPlayer = useGlobalAudioPlayer();

  const [beats, setBeats] = useState<Beat[]>([]);
  const [genres, setGenres] = useState<Set<string>>(new Set([]));
  const [bpms, setBpms] = useState<Set<number>>(new Set([]));
  const [beatsLoading, setBeatsLoading] = useState(false);
  const [initialSearch, setInitialSearch] = useState("");

  const baseQuery = "/api/beats";

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.has("search")) {
      setInitialSearch(params.get("search") || "");
    }

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
        const genres: string[] = data
          .map((beat: any) => beat.genre)
          .sort((a: string, b: string) => a.localeCompare(b));
        const bpms: number[] = data
          .map((beat: any) => parseInt(beat.bpm))
          .sort((a: number, b: number) => a - b);
        const unqiueBpms = new Set(bpms);
        const uniqueGenres = new Set(genres);
        setGenres(uniqueGenres);
        setBpms(unqiueBpms);
      });

    fetch(query)
      .then((res) => res.json())
      .then((data) => {
        setBeats(data);
        for (const beat of data) {
          setWavesurferRef(beat);
        }
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
        for (const beat of data) {
          setWavesurferRef(beat);
        }
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

  const setWavesurferRef = (beat: Beat) => {
    if (audioPlayer.beat?.id === beat.id) {
      beat.wavesurferRef = audioPlayer.beat?.wavesurferRef;
    }
  };

  

  return (
    <div className="flex flex-col items-center">
      <SearchFilterSection
        genres={genres}
        onGenreChange={onGenreChange}
        bpms={bpms}
        onBpmChange={onBpmChange}
        onSearch={onSearch}
        initialSearch={initialSearch}
      />

      <BeatList beats={beats} loading={beatsLoading} />

      <Background />
    </div>
  );
}
