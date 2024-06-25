import React from "react";
import { Select, SelectItem, Selection } from "@nextui-org/react";

export default function GenreFilter() {
  const [values, setValues] = React.useState<Selection>(
    new Set([])
  );

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
      onSelectionChange={setValues}
    >
      {genres.map((genre) => (
        <SelectItem key={genre.key}>{genre.label}</SelectItem>
      ))}
    </Select>
  );
}

export const genres = [
  { key: "hiphop", label: "Hip Hop" },
  { key: "techno", label: "Techno" },
  { key: "rock", label: "Rock" },
  { key: "pop", label: "Pop" },
  { key: "jazz", label: "Jazz" },
  { key: "country", label: "Country" },
  { key: "reggae", label: "Reggae" },
  { key: "blues", label: "Blues" },
  { key: "rnb", label: "R&B" },
  { key: "metal", label: "Metal" },
  { key: "classical", label: "Classical" },
  { key: "electronic", label: "Electronic" },
  { key: "indie", label: "Indie" },
];
