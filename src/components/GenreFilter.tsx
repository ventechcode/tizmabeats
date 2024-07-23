'use client';

import React from "react";
import {Select, SelectItem} from "@nextui-org/select";

export default function GenreFilter({ genres, onGenreChange }: { genres: string[], onGenreChange: (selections: any) => void }) {

  const [values, setValues] = React.useState(
    new Set([])
  );

  const filterGenre = (selected: any) => {
    setValues(selected);
    onGenreChange(selected);
  }

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
        console.log(genre),
        <SelectItem key={genre}>
          {genre}
        </SelectItem>
      ))}
    </Select>
  );
}