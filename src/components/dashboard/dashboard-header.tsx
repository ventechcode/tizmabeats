export default function DashboardHeader({
  text,
  subtext,
}: {
  text: string;
  subtext: string;
}) {
  return (
    <div className="w-[15%] md:w-1/4 h-10 lg:h-16 text-center bg-mantle rounded-b-full hidden xl:block lg:pt-2 ">
      <div className="flex flex-col items-center justify-center">
        <h1 className="sm:text-md lg:text-xl xl:text-2xl font-bold uppercase absolute top-28 hidden xl:block mt-10 lg:mt-8 ">
          {text}
        </h1>
        {subtext && (
          <p className="text-subtext0 mt-4 md:text-xs lg:text-sm hidden xl:block">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
