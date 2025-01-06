"use client";

import React, { useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { useSearchParams } from "next/navigation";

export default function BpmFilter({
  bpms,
  onBpmChange,
}: {
  bpms: string[];
  onBpmChange: (selections: any) => void;
}) {
  const searchParams = useSearchParams();
  const [values, setValues] = React.useState<Set<string>>(new Set([]));

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const selectedBpms = params.get("bpm")?.split(",") || [];
    setValues(new Set(selectedBpms));
  }, []);

  const filterBpm = (selected: any) => {
    setValues(selected);
    onBpmChange(selected);
  };

  return (
    <Select
      label="Filter BPMs"
      selectionMode="multiple"
      placeholder="All"
      selectedKeys={values}
      className="w-64 rounded-lg text-text"
      classNames={{
        listboxWrapper: "bg-surface0 rounded-lg",
        mainWrapper: "bg-surface0 rounded-lg",
        label: "mb-5 text-text",
        value: "text-subtext0",
        listbox: "bg-surface0 rounded-lg overflow-y-auto h-full text-subtext0",
      }}
      onSelectionChange={filterBpm}
    >
      {bpms.map((bpm) => (
        <SelectItem key={bpm.toString()}>{bpm.toString()}</SelectItem>
      ))}
    </Select>
  );
}
