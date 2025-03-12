import SearchFilterSection from "@/components/SearchFilterSection";
import Background from "@/components/Background";
import BeatList from "@/components/BeatList";
import prisma from "@/utils/prisma";
import { Beat } from "@/types";

export default async function BeatsPage({
  searchParams,
}: {
  searchParams: { search: string; genres: string; bpms: string };
}) {
  const beats = await prisma.beat.findMany({
    where: {
      genre: searchParams.genres?.length
        ? { in: searchParams.genres.split(",") }
        : undefined,
      bpm: searchParams.bpms?.length
        ? { in: searchParams.bpms.split(",").map(Number) }
        : undefined,
      name: searchParams.search
        ? { contains: searchParams.search!, mode: "insensitive" }
        : undefined,
      purchased: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      producer: { select: { username: true } },
      licenses: {
        select: {
          id: true,
          price: true,
          licenseOption: {
            select: { name: true, contents: true, usageTerms: true },
          },
        },
        orderBy: { price: "asc" },
      },
    },
  });

  const genres = await prisma.beat.findMany({
    select: {
      genre: true,
    },
    where: {
      purchased: false,
    },
    orderBy: {
      genre: "asc",
    },
    distinct: ["genre"],
  });

  const uniqueGenres = await genres.map((beat) => beat.genre);

  const bpms = await prisma.beat.findMany({
    select: {
      bpm: true,
    },
    where: {
      purchased: false,
    },
    orderBy: {
      bpm: "asc",
    },
    distinct: ["bpm"],
  });

  const uniqueBpms = bpms.map((beat) => beat.bpm.toString());

  return (
    <div className="flex flex-col items-center">
      <SearchFilterSection
        searchParams={searchParams}
        bpms={uniqueBpms}
        genres={uniqueGenres}
      />
      <BeatList beats={beats as unknown as Beat[]} />
      <Background />
    </div>
  );
}
