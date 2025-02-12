"use client";

import { useState } from "react";
import { Select, SelectItem } from "@nextui-org/select";

export default function BpmFilter({
  initialValues,
  bpms,
  onBpmChange,
}: {
  initialValues: number[];
  bpms: number[];
  onBpmChange: (selections: any) => void;
}) {
  const [selectedBpms, setSelectedBpms] = useState<Set<number>>(
    new Set(initialValues)
  );

  const handleBpmChange = (selected: any) => {
    setSelectedBpms(selected);
    onBpmChange(Array.from(selected).join(","));
  };

  return (
    <Select
      label="Bpms"
      selectionMode="multiple"
      placeholder="All"
      selectedKeys={selectedBpms}
      className="w-36 lg:w-64"
      classNames={{
        mainWrapper: "bg-surface0 rounded-lg h-10 md:h-14",
        label: "mb-8 md:mb-5 text-sm md:text-lg",
        value: "text-subtext0 text-xs md:text-[1rem] mb-4 md:mb-0",
        selectorIcon: "mb-3 md:mb-0",
        trigger: "shadow-none md:shadow-sm rounded-lg",
        popoverContent:
          "bg-surface0 rounded-lg text-subtext0 overflow-y-auto h-full",
      }}
      onSelectionChange={handleBpmChange}
    >
      {bpms.map((bpm: number) => (
        <SelectItem key={bpm.toString()}>{bpm.toString()}</SelectItem>
      ))}
    </Select>
  );
}
