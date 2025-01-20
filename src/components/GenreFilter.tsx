"use client";

import React, { use, useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { useSearchParams } from "next/navigation";

export default function GenreFilter({
  genres,
  onGenreChange,
}: {
  genres: Set<string>;
  onGenreChange: (selections: any) => void;
}) {
  const searchParams = useSearchParams();
  const [values, setValues] = React.useState<Set<string>>(new Set([]));

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const selectedGenres = params.get("genre")?.split(",") || [];
    setValues(new Set(selectedGenres));
  }, [searchParams]); 

  const filterGenre = (selected: any) => {
    setValues(selected);
    onGenreChange(selected);
  };

  return (
    <Select
      label="Genres"
      selectionMode="multiple"
      placeholder="All"
      selectedKeys={values}
      className="w-36 lg:w-64 rounded-lg text-text"
      classNames={{
        mainWrapper: "bg-surface0 rounded-lg",
        label: "mb-5 text-text",  
        value: "text-subtext0",
        popoverContent: "bg-surface0 rounded-lg text-subtext0 overflow-y-auto h-full",
      }}
      onSelectionChange={filterGenre}

    >
      {Array.from(genres).map((genre) => (
        <SelectItem key={genre}>{genre}</SelectItem>
      ))}
    </Select>
  );
}
