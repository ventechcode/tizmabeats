"use client";

import { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/select";

export default function BpmFilter({
  initialValues,
  bpms,
  onBpmChange,
}: {
  initialValues: number[];
  bpms: number[];
  onBpmChange: (selections: string) => void;
}) {
  // Filter initialValues to only include bpms that exist in the collection, and convert to strings
  const validInitialValues =
    initialValues?.filter((bpm) => bpms.includes(bpm)).map(String) || [];

  // Use Set<string> to match the type expected by selectedKeys
  const [selectedBpms, setSelectedBpms] = useState<Set<string>>(
    new Set(validInitialValues)
  );

  // Type selected as Set<string>, as provided by onSelectionChange with selectionMode="multiple"
  const handleBpmChange = (selected: Set<string>) => {
    setSelectedBpms(selected);
    // Convert selected strings to numbers and join for onBpmChange
    const selectedNumbers = Array.from(selected).map(Number);
    onBpmChange(selectedNumbers.join(","));
  };

  // Ensure selectedBpms remains valid if bpms changes
  useEffect(() => {
    const currentSelected = Array.from(selectedBpms);
    const validSelected = currentSelected.filter((bpmString) =>
      bpms.includes(Number(bpmString))
    );
    if (validSelected.length !== selectedBpms.size) {
      const newSelected = new Set(validSelected);
      setSelectedBpms(newSelected);
      onBpmChange(validSelected.map(Number).join(","));
    }
  }, [bpms, onBpmChange]);

  return (
    <Select
      label="Bpms"
      selectionMode="multiple"
      placeholder="All"
      selectedKeys={selectedBpms}
      onSelectionChange={(keys) => handleBpmChange(keys as Set<string>)}
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
    >
      {bpms.map((bpm: number) => (
        <SelectItem key={bpm.toString()}>{bpm.toString()}</SelectItem>
      ))}
    </Select>
  );
}
