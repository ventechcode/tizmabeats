"use client";

import React, { useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { useSearchParams } from "next/navigation";

export default function BpmFilter({
  bpms,
  onBpmChange,
}: {
  bpms: Set<number>;
  onBpmChange: (selections: any) => void;
}) {
  const searchParams = useSearchParams();
  const [values, setValues] = React.useState<Set<number>>(new Set([]));

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const selectedBpms = params.get("bpm")?.split(",") || [];
    setValues(new Set(selectedBpms.map((bpm) => parseInt(bpm))));
  }, [searchParams]);

  const filterBpm = (selected: any) => {
    setValues(selected);
    onBpmChange(selected);
  };

  return (
    <Select
      label="BPMs"
      selectionMode="multiple"
      placeholder="All"
      selectedKeys={values}
      className="w-36 lg:w-64 rounded-lg text-text"
      classNames={{
        listboxWrapper: "bg-surface0 rounded-lg",
        mainWrapper: "bg-surface0 rounded-lg",
        label: "mb-5 text-text",
        value: "text-subtext0",
        listbox: "bg-surface0 rounded-lg overflow-y-auto h-full text-subtext0",
      }}
      onSelectionChange={filterBpm}
    >
      {Array.from(bpms).map((bpm) => (
        <SelectItem key={bpm.toString()}>{bpm.toString()}</SelectItem>
      ))}
    </Select>
  );
}
