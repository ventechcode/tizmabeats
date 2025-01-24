"use client";

import { WavyBackground } from "@/components/ui/wavy-background";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import Link from "next/link";
import { flavorEntries } from "@catppuccin/palette";
import { useTheme } from "next-themes";
import Footer from "@/components/Footer";

export default function Home() {
  const { theme, setTheme } = useTheme();

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
    <main className="flex flex-col items-center justify-start mx-auto h-screen">
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
      <WavyBackground speed="slow" backgroundFill={getBgColor()} blur={5} />
    </main>
  );
}
