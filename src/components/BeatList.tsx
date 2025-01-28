import { Beat } from "@/types";
import BeatCard from "@/components/BeatCard";
import MobileBeatCard from "./MobileBeatCard";

const BeatList = ({ beats }: { beats: Beat[] }) => {
  if (beats.length === 0) {
    return (
      <div className="text-2xl text-subtext0 mt-4 z-50">No beats found!</div>
    );
  }

  return (
    <div className="w-full sm:w-auto flex-grow flex flex-col sm:grid sm:p-4 gap-x-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 z-40 grid-flow-row auto-rows-max">
      {beats.map((beat: Beat, index: number) => (
        <>
          <BeatCard
            key={index}
            beat={beat}
            className="inter-var hidden sm:block"
          />
          <MobileBeatCard
            key={index}
            beat={beat}
            className="inter-var block sm:hidden"
          />
        </>
      ))}
    </div>
  );
};

export default BeatList;
