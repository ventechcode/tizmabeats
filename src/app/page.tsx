"use client";

import { WavyBackground } from "@/components/ui/wavy-background";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import Link from "next/link";
import { flavorEntries } from "@catppuccin/palette";
import { useEffect, useState } from "react";
import TizmaBackground from "@/components/TizmaBackground";
import { Nav, NavLink } from "@/components/Nav";

export default function Home() {
  const [flavor, setFlavor] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");

  useEffect(() => {
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
      className: "text-accentColor",
    },
  ];

  return (
    <main className="flex flex-col justify-center h-screen">
      <Nav className="bg-crust top-0 absolute z-50 w-screen sm:px-8">
        <NavLink href="/beats">Beats</NavLink>
        <NavLink href="/beat-bundles">Beat-Bundles</NavLink>
        <NavLink href="/contact">Contact</NavLink>
      </Nav>

      {/* Hero flex container */}
      <div className="flex flex-col items-center mb-96">
        <TypewriterEffectSmooth
          words={words}
          className="relative z-10 sm:mt-16 text-3xl"
        />
        <h1 className="relative z-10 text-sm sm:text-md md:text-lg text-text">
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

      {/* WavyBackground updates immediately based on backgroundColor */}
      {/* {backgroundColor && (
        <WavyBackground
          speed="fast"
          backgroundFill={backgroundColor}
          blur={5}
        />
      )} */}
    </main>
  );
}
