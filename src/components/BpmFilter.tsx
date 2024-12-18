'use client';

import React from "react";
import {Select, SelectItem} from "@nextui-org/select";

export default function BpmFilter({ bpms, onBpmChange }: { bpms: string[], onBpmChange: (selections: any) => void }) {

  const [values, setValues] = React.useState(
    new Set([])
  );

  const filterBpm = (selected: any) => {
    setValues(selected);
    onBpmChange(selected);
  }

  return (
    <Select
      label="Filter BPMs"
      selectionMode="multiple"
      placeholder="All"
      items={bpms.map(bpm => ({ key: bpm, label: bpm }))}
      selectedKeys={values}

      className="w-64 rounded-lg text-text"
      classNames={{
        listboxWrapper: "bg-surface0 rounded-lg",
        mainWrapper: "bg-surface0 rounded-lg",
        label: "mb-5 text-white/90",
        listbox: "bg-surface0 rounded-lg text-text overflow-y-auto h-full",
      }}
      onSelectionChange={filterBpm}
    >
      {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
    </Select>
  );
}