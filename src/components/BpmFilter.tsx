"use client";

import React, { useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

export default function BpmFilter({
  onBpmChange,
}: {
  onBpmChange: (selections: any) => void;
}) {
  const searchParams = useSearchParams();
  const [values, setValues] = React.useState<Set<number>>(new Set([]));

  const { data, isLoading } = useSWR("/api/beats/bpms", async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const selectedBpms = params.get("bpm")?.split(",") || [];
    setValues(new Set(selectedBpms.map((bpm) => parseInt(bpm))));
  }, []);

  const filterBpm = (selected: any) => {
    setValues(selected);
    onBpmChange(selected);
  };

  return (
    <>
      {!data || isLoading ? (
        <Select
          label="BPMs"
          selectionMode="multiple"
          placeholder="All"
          selectedKeys={"Loading..."}
          className="w-36 lg:w-64 rounded-lg text-text"
          classNames={{
            mainWrapper: "bg-surface0 rounded-lg h-10 md:h-14 ",
            label: "mb-8 md:mb-5 text-sm md:text-lg",
            value: "text-subtext0 text-xs md:text-[1rem] mb-4 md:mb-0",
            selectorIcon: "mb-3 md:mb-0",
            popoverContent:
              "bg-surface0 rounded-lg text-subtext0 overflow-y-auto h-full",
          }}
        >
          <SelectItem key={"loading"}>Loading...</SelectItem>
        </Select>
      ) : (
        <Select
          label="BPMs"
          selectionMode="multiple"
          placeholder="All"
          selectedKeys={values}
          className="w-36 lg:w-64 rounded-lg text-text bg-transparent"
          classNames={{
            mainWrapper: "bg-surface0 rounded-lg h-10 md:h-14 ",
            label: "mb-8 md:mb-5 text-sm md:text-lg",
            value: "text-subtext0 text-xs md:text-[1rem] mb-4 md:mb-0",
            selectorIcon: "mb-3 md:mb-0",
            base: "bg-surface0",
            popoverContent:
              "bg-surface0 rounded-lg text-subtext0 overflow-y-auto h-full",
          }}
          onSelectionChange={filterBpm}
        >
          {data.map((bpm: number) => (
            <SelectItem key={bpm.toString()}>{bpm.toString()}</SelectItem>
          ))}
        </Select>
      )}
    </>
  );
}
