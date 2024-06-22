'use client'

import Beat from "@/components/Beat"
import { BackgroundBeams } from "@/components/ui/background-beams"

function Beats() {
  return (
    <div>
      <h1>Beats</h1>
      <Beat />
      <BackgroundBeams className="-z-50" />
    </div>
  )
}

export default Beats