export default function DashboardHeader({
  text,
  subtext,
}: {
  text: string;
  subtext: string;
}) {
  return (
    <div className="w-1/5 md:w-1/4 h-10 lg:h-16 text-center bg-mantle rounded-b-full hidden md:block lg:pt-2 sm:mb-12">
      <div className="flex flex-col items-center justify-center">
        <h1 className="sm:text-md lg:text-xl xl:text-2xl font-bold uppercase absolute top-28 hidden md:block mt-10 lg:mt-8">
          {text}
        </h1>
        {subtext && (
          <p className="text-subtext0 mt-4 md:text-xs lg:text-xs hidden lg:block">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
