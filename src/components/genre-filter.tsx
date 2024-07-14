'use client';

import React from "react";
import { Select, SelectItem, Selection } from "@nextui-org/react";

export default function GenreFilter({ genres }: { genres: string[]}) {

  const [values, setValues] = React.useState<Selection>(
    new Set([])
  );

  const filterGenre = (selected: Selection) => {
    setValues(selected);
  }

  return (
    <Select
      label="Filter Genres"
      selectionMode="multiple"
      placeholder="All"
      selectedKeys={values}
      className="w-64 rounded-lg text-text "
      classNames={{
        mainWrapper: "bg-surface0 rounded-lg",
        label: "mb-5 text-white/90",
        listbox: "bg-surface0 rounded-lg text-text",
      }}
      onSelectionChange={filterGenre}
    >
      {genres.map((genre) => (
        <SelectItem key={genre} value={genre}>
          {genre}
        </SelectItem>
      ))}
    </Select>
  );
}