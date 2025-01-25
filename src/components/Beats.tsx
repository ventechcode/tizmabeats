import { Beat } from "@/types";
import BeatCard from "@/components/BeatCard";
import { Suspense } from "react";
import BeatList from "./BeatList";
import SkeletonBeatList from "./SkeletonBeatList";

const Beats = ({ beats }: { beats: Beat[] }) => {
  return (
    <div className="flex-grow flex flex-col sm:grid sm:p-4 gap-x-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 z-40 grid-flow-row auto-rows-max">
      <Suspense fallback={<SkeletonBeatList beats={beats} />}>
        {beats && <BeatList beats={beats} />}
      </Suspense>
    </div>
  );
};

export default Beats;
