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
import { useTheme } from "next-themes";

export default function Beats() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [beats, setBeats] = useState<Beat[]>([]);
  const [genres, setGenres] = useState<Set<string>>(new Set([]));
  const [bpms, setBpms] = useState<Set<number>>(new Set([]));
  const [isLoading, setIsLoading] = useState(true);
  const [beatsLoading, setBeatsLoading] = useState(false);
  const [flavor, setFlavor] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [initialSearch, setInitialSearch] = useState("");
  const { theme, setTheme } = useTheme();

  const baseQuery = "/api/beats";

  const [currentlyPlaying, setCurrentlyPlaying] = useState<Beat | null>(null);

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
        setIsLoading(false);
      });

    // Detect color scheme and update theme
    // if (typeof window !== "undefined") {
    //   const prefersDarkMode = window.matchMedia(
    //     "(prefers-color-scheme: dark)"
    //   ).matches;
    //   const initialFlavor = prefersDarkMode ? "mocha" : "latte";
    //   updateTheme(initialFlavor, false);

    //   const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    //   const handleColorSchemeChange = (event: MediaQueryListEvent) => {
    //     const newFlavor = event.matches ? "mocha" : "latte";
    //     localStorage.setItem("theme", JSON.stringify({ flavor: newFlavor }));
    //     updateTheme(newFlavor, true);
    //   };

    //   mediaQuery.addEventListener("change", handleColorSchemeChange);

    //   // Cleanup event listener
    //   return () => {
    //     mediaQuery.removeEventListener("change", handleColorSchemeChange);
    //   };
    // }
  }, [searchParams, router]);

  // Update theme based on color scheme
  // const updateTheme = (newFlavor: string, manual_switch: boolean) => {
  //   if (manual_switch) {
  //     localStorage.setItem("theme", JSON.stringify({ flavor: newFlavor }));
  //     console.log("Theme saved to local storage: ", newFlavor);
  //   }

  //   if (!manual_switch && localStorage.getItem("theme")) {
  //     const theme = JSON.parse(localStorage.getItem("theme") || "");
  //     newFlavor = theme.flavor;
  //     setFlavor(newFlavor);
  //     console.log("Theme loaded from local storage: ", newFlavor);
  //   }

  //   if (document.body.className.includes("latte")) {
  //     document.body.className = document.body.className.replace(
  //       "latte",
  //       newFlavor
  //     );
  //   } else if (document.body.className.includes("mocha")) {
  //     document.body.className = document.body.className.replace(
  //       "mocha",
  //       newFlavor
  //     );
  //   } else {
  //     document.body.className = newFlavor;
  //   }

  //   setFlavor(newFlavor);

  //   // Calculate and set the background color immediately
  //   const flavorList = flavorEntries.map((entry) => entry[1]);
  //   const selectedFlavor = flavorList.find(
  //     (flavorItem) => flavorItem.name.toLowerCase() === newFlavor
  //   );
  //   if (selectedFlavor) {
  //     setBackgroundColor(selectedFlavor.colors.base.hex);
  //   }
  // };

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
  }, [searchParams, router]);

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

  const play = (beat: Beat, pause: boolean, next: boolean) => {
    if (next) {
      const index = beats.findIndex((b) => b.id === beat.id);
      const nextBeat = beats[index + 1];
      if (nextBeat) {
        setCurrentlyPlaying(nextBeat);
      } else {
        setCurrentlyPlaying(null);
      }
      return;
    }

    if (currentlyPlaying && currentlyPlaying.id === beat.id) {
      if (pause) {
        beat.wavesurferRef.current.playPause();
      } else {
        setCurrentlyPlaying(null);
      }
    } else {
      if (currentlyPlaying) {
        currentlyPlaying.wavesurferRef.current.pause();
      }
      setCurrentlyPlaying(beat);
    }
  };

  // Get background color based on flavor for wavy background
  // const getBgColor = () => {
  //   if (typeof window !== "undefined") {
  //     const flavorList = flavorEntries.map((entry) => entry[1]);
  //     const flavor = flavorList.filter((flavor) =>
  //       document.body.className.includes(flavor.name.toLowerCase())
  //     )[0];
  //     return flavor.colors.base.hex;
  //   }
  // };

  const getBgColor = () => {
    const flavorList = flavorEntries.map((entry) => entry[1]);
    const selectedFlavor = flavorList.find(
      (flavorItem) => flavorItem.name.toLowerCase() === theme
    );
    if (selectedFlavor) {
      return selectedFlavor.colors.base.hex;
    }
  };

  return (
    <div className="flex flex-col overflow-y-scroll items-center">
      <SearchFilterSection
        genres={genres}
        onGenreChange={onGenreChange}
        bpms={bpms}
        onBpmChange={onBpmChange}
        onSearch={onSearch}
        initialSearch={initialSearch}
      />

      <div className="flex-grow flex flex-col sm:grid sm:p-4 gap-x-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 z-40 grid-flow-row auto-rows-max">
        {beatsLoading
          ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_, i) => (
              <SkeletonBeatCard key={i} />
            ))
          : beats.map((beat: Beat, index: number) => (
              <BeatCard
                key={index}
                beat={beat}
                play={play}
                isPlaying={currentlyPlaying?.id === beat.id}
              />
            ))}
      </div>

      {currentlyPlaying && (
        <AudioPlayer beat={currentlyPlaying} toggle={play} />
      )}
      <WavyBackground speed="slow" backgroundFill={getBgColor()} blur={5} />
    </div>
  );
}
