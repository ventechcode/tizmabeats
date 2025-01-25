import { Beat } from "@/types";
import SearchFilterSection from "./SearchFilterSection";
import SkeletonBeatCard from "./SkeletonBeatCard";

const SkeletonBeatList = ({beats}: {beats: Beat[]}) => {
  

  return (
    <div className="flex-grow flex flex-col sm:grid sm:p-4 gap-x-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 z-40 grid-flow-row auto-rows-max">
      {beats.map((_, i) => (
        <SkeletonBeatCard key={i} />
      ))}
    </div>
  );
};

export default SkeletonBeatList;
