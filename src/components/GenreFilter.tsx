"use client";

import React, { use, useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

export default function GenreFilter({
  onGenreChange,
}: {
  onGenreChange: (selections: any) => void;
}) {
  const searchParams = useSearchParams();
  const [values, setValues] = React.useState<Set<string>>(new Set([]));

  const { data, isLoading } = useSWR("/api/beats/genres", async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  });

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
    <>
      {!data || isLoading ? (
        <Select
          label="Genres"
          selectionMode="multiple"
          placeholder="All"
          selectedKeys={"Loading..."}
          className="w-36 lg:w-64 rounded-lg text-text"
          classNames={{
            listboxWrapper: "bg-surface0 rounded-lg",
            mainWrapper: "bg-surface0 rounded-lg",
            label: "mb-5 text-text",
            value: "text-subtext0",
            listbox:
              "bg-surface0 rounded-lg overflow-y-auto h-full text-subtext0",
          }}
        >
          <SelectItem key={"loading"}>Loading...</SelectItem>
        </Select>
      ) : (
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
            popoverContent:
              "bg-surface0 rounded-lg text-subtext0 overflow-y-auto h-full",
          }}
          onSelectionChange={filterGenre}
        >
          {data.map((genre: string) => (
            <SelectItem key={genre}>{genre}</SelectItem>
          ))}
        </Select>
      )}
    </>
  );
}
