"use client";

import { WavyBackground } from "@/components/ui/WavyBackground";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

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
      <div className="flex flex-col items-center max-h-screen">
        <TypewriterEffect words={words} className="relative z-10 mt-16" />
        <h1 className="relative z-10 text-lg mt-5">
          Hip-Hop, Techno, House and more!
        </h1>
        <button
          className="p-[3px] relative z-10 mt-5"
          onClick={() => router.push("/beats")}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
            Explore Beats
          </div>
        </button>
        <WavyBackground backgroundFill="bg-base" />
      </div>
      {/* More landing page content here */}
    </main>
  );
}
