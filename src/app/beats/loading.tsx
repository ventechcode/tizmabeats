import Background from "@/components/Background";
import SearchFilterSection from "@/components/SearchFilterSection";
import SkeletonBeatList from "@/components/SkeletonBeatList";

export default function Loading() {
  return (
    <div className="flex flex-col items-center">
      <SearchFilterSection bpms={[]} genres={[]} />
      <SkeletonBeatList />
      <Background />
    </div>
  );
}
