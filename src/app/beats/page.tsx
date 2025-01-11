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
  const [flavor, setFlavor] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");

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

    // Detect color scheme and update theme
    if (typeof window !== "undefined") {
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const initialFlavor = prefersDarkMode ? "mocha" : "latte";
      updateTheme(initialFlavor, false);

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleColorSchemeChange = (event: MediaQueryListEvent) => {
        const newFlavor = event.matches ? "mocha" : "latte";
        localStorage.setItem("theme", JSON.stringify({ flavor: newFlavor }));
        updateTheme(newFlavor, true);
      };

      mediaQuery.addEventListener("change", handleColorSchemeChange);

      // Cleanup event listener
      return () => {
        mediaQuery.removeEventListener("change", handleColorSchemeChange);
      };
    }
  }, []);

  // Update theme based on color scheme
  const updateTheme = (newFlavor: string, manual_switch: boolean) => {
    if (manual_switch) {
      localStorage.setItem("theme", JSON.stringify({ flavor: newFlavor }));
      console.log("Theme saved to local storage: ", newFlavor);
    }

    if (!manual_switch && localStorage.getItem("theme")) {
      const theme = JSON.parse(localStorage.getItem("theme") || "");
      newFlavor = theme.flavor;
      setFlavor(newFlavor);
      console.log("Theme loaded from local storage: ", newFlavor);
    }

    if (document.body.className.includes("latte")) {
      document.body.className = document.body.className.replace(
        "latte",
        newFlavor
      );
    } else if (document.body.className.includes("mocha")) {
      document.body.className = document.body.className.replace(
        "mocha",
        newFlavor
      );
    } else {
      document.body.className = newFlavor;
    }

    setFlavor(newFlavor);

    // Calculate and set the background color immediately
    const flavorList = flavorEntries.map((entry) => entry[1]);
    const selectedFlavor = flavorList.find(
      (flavorItem) => flavorItem.name.toLowerCase() === newFlavor
    );
    if (selectedFlavor) {
      setBackgroundColor(selectedFlavor.colors.base.hex);
    }
  };

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
        beat.wavesurferRef.current?.playPause();
      } else {
        setCurrentlyPlaying(null);
      }
    } else {
      if (currentlyPlaying) {
        currentlyPlaying.wavesurferRef.current?.pause();
      }
      setCurrentlyPlaying(beat);
      // We'll handle the actual playback in the AudioPlayer component
    }
  };

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
      <ScrollArea className="absolute mt-12 sm:mt-80 h-full w-full z-10 mb-6">
        <div className="flex flex-col mt-44 sm:mt-0 sm:grid gap-4 sm:p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {isLoading ? (
            <div className="absolute inset-0 mt-32">
              <div className="loading loading-spinner loading-lg text-text"></div>
            </div>
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
      <footer className="absolute left-0 bottom-0 h-12 z-40 flex flex-row items-center justify-around text-text w-screen p-4 bg-mantle text-sm">
        <p className="hover:cursor-pointer">Copyright &copy; 2025 TIZMABEATS</p>
        <p className="hover:cursor-pointer hover:underline">Privacy Policy</p>
        <p className="hover:cursor-pointer hover:underline">Terms of Service</p>
        <p className="hover:cursor-pointer hover:underline">Legal</p>
        {flavor == "mocha" ? (
          <svg
            onClick={() => updateTheme("latte", true)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 hover:scale-125 hover:cursor-pointer duration-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            />
          </svg>
        ) : (
          <svg
            onClick={() => updateTheme("mocha", true)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 hover:scale-125 hover:cursor-pointer duration-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
            />
          </svg>
        )}
      </footer>
    </div>
  );
}
