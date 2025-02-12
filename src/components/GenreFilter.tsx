"use client";

import { Select, SelectItem } from "@nextui-org/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function GenreFilter({
  initialValues,
  genres,
  onGenreChange,
}: {
  initialValues: string[];
  genres: string[];
  onGenreChange: (genre: string) => void;
}) {
  
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(
    new Set(initialValues)
  );

  const handleGenreChange = (selected: any) => {
    setSelectedGenres(selected);
    onGenreChange(Array.from(selected).join(","));
  };

  return (
    <Select
      label="Genres"
      selectionMode="multiple"
      placeholder="All"
      selectedKeys={selectedGenres}
      className="w-36 lg:w-64 rounded-lg text-text"
      classNames={{
        mainWrapper: "bg-surface0 rounded-lg h-10 md:h-14",
        label: "mb-8 md:mb-5 text-sm md:text-lg",
        value: "text-subtext0 text-xs md:text-[1rem] mb-4 md:mb-0",
        selectorIcon: "mb-3 md:mb-0",
        trigger: "shadow-none md:shadow-sm rounded-lg",
        popoverContent:
          "bg-surface0 rounded-lg text-subtext0 overflow-y-auto h-full",
      }}
      onSelectionChange={handleGenreChange}
    >
      {genres.map((genre: string) => (
        <SelectItem key={genre} value={genre}>
          {genre}
        </SelectItem>
      ))}
    </Select>
  );
}
