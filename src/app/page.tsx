"use client";

import { WavyBackground } from "@/components/ui/wavy-background";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import Link from "next/link";
import { flavorEntries } from "@catppuccin/palette";
import { useEffect, useState } from "react";

export default function Home() {
  const [flavor, setFlavor] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialFlavor = prefersDarkMode ? "mocha" : "latte";
      updateTheme(initialFlavor);

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleColorSchemeChange = (event: MediaQueryListEvent) => {
        const newFlavor = event.matches ? "mocha" : "latte";
        updateTheme(newFlavor);
      };

      mediaQuery.addEventListener("change", handleColorSchemeChange);

      // Cleanup event listener
      return () => {
        mediaQuery.removeEventListener("change", handleColorSchemeChange);
      };
    }
  }, []);

  const updateTheme = (newFlavor: string) => {
    if (document.body.className.includes("latte")) {
      document.body.className = document.body.className.replace("latte", newFlavor);
    } else if (document.body.className.includes("mocha")) {
      document.body.className = document.body.className.replace("mocha", newFlavor);
    } else {
      document.body.className = newFlavor;
    }

    setFlavor(newFlavor);

    // Calculate and set the background color immediately
    const flavorList = flavorEntries.map((entry) => entry[1]);
    const selectedFlavor = flavorList.find((flavorItem) => flavorItem.name.toLowerCase() === newFlavor);
    if (selectedFlavor) {
      setBackgroundColor(selectedFlavor.colors.base.hex);
    }
  };

  // Debug logs
  useEffect(() => {
    console.log("Flavor updated:", flavor);
    console.log("Background color updated:", backgroundColor);
  }, [flavor, backgroundColor]);

  const words = [
    {
      text: "Create",
    },
    {
      text: "awesome",
    },
    {
      text: "projects",
    },
    {
      text: "with",
    },
    {
      text: "our",
    },
    {
      text: "Beats.",
      className: "text-blue dark:text-blue",
    },
  ];

  return (
    <main>
      {/* Hero flex container */}
      <div className="flex flex-col items-center mb-96">
        <TypewriterEffectSmooth
          words={words}
          className="relative z-10 sm:mt-16 text-3xl"
        />
        <h1 className="relative z-10 text-sm sm:text-md md:text-lg">
          Hip-Hop, Techno, House and more!
        </h1>
        <Link
          href="/beats"
          prefetch={true}
          className="p-[3px] relative z-10 mt-5"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-2 bg-base rounded-[6px] hover:text-white relative group transition duration-500 text-text hover:bg-transparent">
            Explore Beats
          </div>
        </Link>
      </div>

      {/* WavyBackground updates immediately based on backgroundColor */}
      {backgroundColor && (
        <WavyBackground speed="fast" backgroundFill={backgroundColor} blur={5} />
      )}
    </main>
  );
}
