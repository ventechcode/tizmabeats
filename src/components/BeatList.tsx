import { ScrollArea } from "@/components/ui/scroll-area";
import { Beat } from "@/types";
import BeatCard from "@/components/BeatCard";
import SkeletonBeatCard from "./SkeletonBeatCard";

const BeatList = ({ beats, loading }: { beats: Beat[]; loading: boolean }) => {
  return (
    <div className="flex-grow flex flex-col sm:grid sm:p-4 gap-x-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 z-40 grid-flow-row auto-rows-max">
      {loading
        ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_, i) => (
            <SkeletonBeatCard key={i} />
          ))
        : beats.map((beat: Beat, index: number) => (
            <BeatCard key={index} beat={beat} />
          ))}
    </div>
  );
};

export default BeatList;
