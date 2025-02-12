import SearchFilterSection from "@/components/SearchFilterSection";
import Background from "@/components/Background";
import BeatList from "@/components/BeatList";

export default async function BeatsPage({
  searchParams,
}: {
  searchParams: { search: string; genres: string; bpms: string };
}) {
  console.log(new URLSearchParams(searchParams).toString());

  const data = await fetch(
    `${process.env.API_URL}/beats?${new URLSearchParams(searchParams).toString()}`,
    {
      next: {
        tags: ["bpms"],
        revalidate: 0, // no revalidation
      },
    }
  );
  const beats = await data.json();

  const genres = await fetch(`${process.env.API_URL}/beats/genres`, {
    next: {
      tags: ["genres"],
      revalidate: 3600 * 24, // 24 hours cached data validity
    },
  });

  const uniqueGenres = await genres.json();

  const bpms = await fetch(`${process.env.API_URL}/beats/bpms`, {
    next: {
      tags: ["bpms"],
      revalidate: 3600 * 24, // 24 hours cached data validity
    },
  });

  const uniqueBpms = await bpms.json();

  return (
    <div className="flex flex-col items-center">
      <SearchFilterSection
        searchParams={searchParams}
        bpms={uniqueBpms}
        genres={uniqueGenres}
      />
      <BeatList beats={beats} />
      <Background />
    </div>
  );
}
