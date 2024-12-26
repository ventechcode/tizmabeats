import { WavyBackground } from "@/components/ui/wavy-background";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "./loading";

export default function Home() {
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
        <TypewriterEffect words={words} className="relative z-10 mt-16" />
        <h1 className="relative z-10 sm:text-lg mt-5">
          Hip-Hop, Techno, House and more!
        </h1>
        <Link
          href="/beats"
          prefetch={true}
          className="p-[3px] relative z-10 mt-5"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-500 text-white hover:bg-transparent">
            Explore Beats
          </div>
        </Link>
      </div>
      <WavyBackground speed="slow" />
    </main>
  );
}
