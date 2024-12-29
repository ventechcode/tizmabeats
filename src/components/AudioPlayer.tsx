import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import WaveSurfer from "wavesurfer.js";
import { Beat } from "@/types";

export default function AudioPlayer({ beat, toggle }: { beat: Beat, toggle: (beat: Beat) => void }) {
  const waveSurferRef = useRef<WaveSurfer | null>(null); // Store the WaveSurfer instance

  useEffect(() => {
    // Initialize WaveSurfer when the component mounts
    if (!waveSurferRef.current) {
      waveSurferRef.current = WaveSurfer.create({
        container: "#waveform",
        waveColor: "#4c4f69",
        progressColor: "#89b4fa",
        barWidth: 5,
        barRadius: 8,
        autoplay: true,
        cursorWidth: 3,
        hideScrollbar: true,
        normalize: false,
        mediaControls: false,
        barGap: 3,
        height: 50,
        cursorColor: "#89b4fa",
      });

      // Add play/pause interaction
      waveSurferRef.current.on("interaction", () => {
        waveSurferRef.current?.playPause();
      });
    }

    // Load the audio file into WaveSurfer
    waveSurferRef.current.load(beat.audioSrc);

    // Clean up the WaveSurfer instance on unmount
    return () => {
      waveSurferRef.current?.destroy();
      waveSurferRef.current = null;
    };
  }, [beat]); // Re-initialize WaveSurfer when the `beat` changes Hide the player if closed

  return (
    <div className="absolute bottom-0 left-0 z-50 h-16 sm:h-20 bg-mantle w-full flex justify-between items-center px-4 sm:px-8">
      {/* Info Section */}
      <div className="flex flex-row items-center text-text">
        <div className="ml-3">
          <div className="text-sm sm:text-lg font-semibold">{beat.name}</div>
          <div className="text-xs sm:text-sm text-muted">{beat.genre}</div>
        </div>
      </div>

      {/* WaveSurfer Visualization */}
      <div id="waveform" className="w-2/3"></div>

      {/* Close Button */}
      <FontAwesomeIcon
        icon={faXmark}
        className="text-text cursor-pointer"
        onClick={() => toggle(beat)}
      />
    </div>
  );
}
