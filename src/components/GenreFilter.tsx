"use client";

import React, { use, useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { useSearchParams } from "next/navigation";

export default function GenreFilter({
  genres,
  onGenreChange,
}: {
  genres: string[];
  onGenreChange: (selections: any) => void;
}) {
  const searchParams = useSearchParams();
  const [values, setValues] = React.useState<Set<string>>(new Set([]));

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const selectedGenres = params.get("genre")?.split(",") || [];
    setValues(new Set(selectedGenres));
  }, []); 

  const filterGenre = (selected: any) => {
    setValues(selected);
    onGenreChange(selected);
  };

  return (
    <Select
      label="Filter Genres"
      selectionMode="multiple"
      placeholder="All"
      selectedKeys={values}
      className="w-64 rounded-lg text-text"
      classNames={{
        listboxWrapper: "bg-surface0 rounded-lg",
        mainWrapper: "bg-surface0 rounded-lg",
        label: "mb-5 text-white/90",
        listbox: "bg-surface0 rounded-lg text-text overflow-y-auto h-full",
      }}
      onSelectionChange={filterGenre}
    >
      {genres.map((genre) => (
        <SelectItem key={genre}>{genre}</SelectItem>
      ))}
    </Select>
  );
}
