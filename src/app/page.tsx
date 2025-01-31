import Link from "next/link";
import {
  TypewriterEffect,
  TypewriterEffectSmooth,
} from "@/components/ui/typewriter-effect";
import Background from "@/components/Background";

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
      className: "text-accentColor",
    },
  ];

  return (
    <main className="flex flex-col items-center justify-center space-y-5 py-20">
      <TypewriterEffectSmooth words={words} className="z-50" />
      <h1 className="relative z-10 text-sm sm:text-md md:text-lg text-subtext0">
        Hip-Hop, Techno, House and more!
      </h1>
      <Link
        href="/beats"
        prefetch={true}
        className="p-[3px] relative z-10 mt-5"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
        <div className="px-8 py-2 sm:bg-base rounded-[6px] hover:text-white relative group transition duration-500 text-white sm:text-text hover:bg-transparent">
          Explore Beats
        </div>
      </Link>
      <Background />
    </main>
  );
}
