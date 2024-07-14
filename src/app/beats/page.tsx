import BeatCard, {Beat} from "@/components/beat";
import SearchFilterSection from "@/components/SearchFilterSection";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { PrismaClient } from "@prisma/client";
import { Selection } from "@nextui-org/react";

export async function getData() {
  'use server'
  const prisma = new PrismaClient();
  let beats: Beat[] = [];
  let genres: string[] = [];

  try {
    beats = await prisma.beat.findMany();
    genres = beats.map((beat) => beat.genre);
  } catch (error) {
    console.error("Error fetching beats:", error);
  } finally {
    await prisma.$disconnect();
  }

  const data = {beats, genres};
  return data;
}


async function Beats() {
  const {beats, genres} = await getData();

  return (
    <div className="flex flex-col items-center">
      {/* Search & Filter Section */}
      <SearchFilterSection genres={genres} />
      <div className="w-full grid sm:grid-cols-4 sm:grid-rows-none grid-cols-1 gap-8 sm:mt-5">
        {beats.map((beat, index) => (
          <BeatCard {...beat} />
        ))}
      </div>
      <BackgroundBeams className="-z-50 bg-base" />
    </div>
  );
}

export default Beats;