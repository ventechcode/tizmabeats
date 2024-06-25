'use client'

import Beat from "@/components/beat"
import GenreFilter from "@/components/genre-filter"
import Searchbar from "@/components/searchbar"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { Separator } from "@/components/ui/separator"

function Beats() {
  return (
    <div className="sm:w-4/5 min-h-[calc(100vh-10rem)] flex flex-col items-center">
      <div className="mt-5 flex flex-col w-3/4 rounded-lg bg-crust text-text h-fit items-center">
        <h1 className="sm:text-2xl p-4 ">Our database of professionally produced beats.</h1>
        <Separator />
        <Searchbar />
        <div className="flex flex-row justify-center gap-4 w-full p-5">
          <GenreFilter />
          <GenreFilter />
          <GenreFilter />
        </div>
      </div>
      
      <Beat />
      <BackgroundBeams className="-z-50" />
    </div>
  )
}

export default Beats