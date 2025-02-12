import { Beat } from "@/types";

import SkeletonBeatCard from "@/components/SkeletonBeatCard";
import MobileSkeletonBeatCard from "@/components/MobileSkeletonBeatCard";

const SkeletonBeatList = () => {
  return (
    <div className="w-full sm:w-auto flex-grow flex flex-col sm:grid sm:p-4 gap-x-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 z-40 grid-flow-row auto-rows-max">
      {Array.from({length: 8}).map((_, i) => (
        <>
          <SkeletonBeatCard key={i} className="hidden sm:block" />
          <MobileSkeletonBeatCard key={i} className="sm:hidden" />{" "}
        </>
      ))}
    </div>
  );
};

export default SkeletonBeatList;
