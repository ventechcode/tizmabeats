import BeatCard, { Beat } from "@/components/beat";
import SearchFilterSection from "@/components/SearchFilterSection";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { PrismaClient } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Beats() {
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

  return (
    <div className="flex flex-col items-center">
      {/* Search & Filter Section */}
      <SearchFilterSection genres={genres} />
      <ScrollArea className="w-full max-h-screen">
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {beats.map((beat, index) => (
            <BeatCard key={index} {...beat} />
          ))}
        </div>
      </ScrollArea>
      <BackgroundBeams className="-z-10 bg-base" />
    </div>
  );
}