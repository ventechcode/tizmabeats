import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center space-y-2 mt-32">
      <h1 className="relative z-10 text-lg md:text-2xl">
        Create awesome projects with our beats
      </h1>
      <h2 className="relative z-10 text-sm sm:text-md md:text-lg text-subtext0">
        Hip-Hop, Techno, House and more!
      </h2>
      <div className="bg-text text-crust hover:text-text hover:bg-crust duration-300 p-2 rounded-lg mt-4">
        <Link
          href="/beats"
          prefetch={true}
          className="p-[3px] relative z-10 mt-5"
        >
          Explore Beats
        </Link>
      </div>
    </main>
  );
}
