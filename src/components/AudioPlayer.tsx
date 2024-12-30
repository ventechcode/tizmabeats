import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import WaveSurfer from "wavesurfer.js";
import { Beat } from "@/types";

export default function AudioPlayer({
  beat,
  toggle,
}: {
  beat: Beat;
  toggle: (beat: Beat, pause: boolean) => void;
}) {
  beat.wavesurferRef = useRef<WaveSurfer | null>(null); // Store the WaveSurfer instance
  const [elapsedTime, setElapsedTime] = useState(0); // Track elapsed time
  const [volume, setVolume] = useState(0.5); // Track volume level

  useEffect(() => {
    // Initialize WaveSurfer when the component mounts
    if (!beat.wavesurferRef.current) {
      beat.wavesurferRef.current = WaveSurfer.create({
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
        cursorColor: "#cdd6f4",
      });

      beat.wavesurferRef.current.on("interaction", () => {
        setElapsedTime(beat.wavesurferRef.current?.getCurrentTime() || 0);
      });

      // Update elapsed time during playback
      beat.wavesurferRef.current.on("audioprocess", () => {
        setElapsedTime(beat.wavesurferRef.current?.getCurrentTime() || 0);
      });

      // Optionally, close player when audio finishes or loop
      // beat.wavesurferRef.current.on("finish", () => {
      //   toggle(beat, false); false -> close, true -> loop
      // });
    }

    // Load the audio file into WaveSurfer
    beat.wavesurferRef.current.load(beat.audioSrc);

    // Set initial volume
    beat.wavesurferRef.current.setVolume(volume);

    // Clean up the WaveSurfer instance on unmount
    return () => {
      if (beat.wavesurferRef.current) {
        try {
          // Abort any ongoing audio loading or processing
          beat.wavesurferRef.current.stop(); // Stops audio playback
          beat.wavesurferRef.current.unAll(); // Unsubscribes from all events
          beat.wavesurferRef.current.destroy(); // Destroys the instance safely
        } catch (error) {
          console.warn("Error while destroying WaveSurfer instance:", error);
        }
        beat.wavesurferRef.current = null;
      }
    };
  }, [beat]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleVolumeChange = (vol: any) => {
    // Ensure the volume is within the 0-1 range
    const clampedVolume = Math.min(Math.max(vol, 0), 1);

    setVolume(clampedVolume);
    beat.wavesurferRef.current?.setVolume(clampedVolume); // Update the volume on WaveSurfer
  };

  return (
    <div className="absolute bottom-0 left-0 z-50 h-16 sm:h-20 bg-mantle w-full flex flex-row justify-around items-center px-4 sm:px-8">
      {/* Info Section */}
      <div className="w-1/4 sm:w-1/6 flex flex-row flex-wrap items-center text-text mr-4 sm:mr-16 md:mr-20 lg:mr-40">
        <div className="ml-3">
          <div className="text-xs sm:text-lg font-semibold">{beat.name}</div>
          <div className="text-[12px] sm:text-sm text-muted">{beat.genre}</div>
        </div>
      </div>

      {/* WaveSurfer Visualization */}
      <div id="waveform" className="w-2/3"></div>

      {/* Volume Control */}
      {/* <div className="hidden sm:flex items-center space-x-2">
        <FontAwesomeIcon icon={faVolumeUp} className="text-text text-lg" />
        <div className="relative w-24">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 rounded-lg appearance-none  cursor-pointer dark:bg-gray-700"
          />
        </div>
      </div> */}
      {/* <div className="flex flex-col gap-2 w-full h-12 max-w-md items-start justify-center z-50">
        <Slider
          aria-label="Volume"
          color="primary"
          size="lg"
          className="max-w-md"
          value={volume}
          onChange={(vol) => handleVolumeChange(vol)}
          step={0.01} // Define the step for volume control

          endContent={
            <FontAwesomeIcon icon={faVolumeUp} className="text-text text-lg" />
          }
          startContent={
            <FontAwesomeIcon
              icon={faVolumeDown}
              className="text-text text-lg"
            />
          }
        />
      </div> */}

      {/* Elapsed Time */}
      <div className="w-8 pl-2 sm:pl-4 text-sm sm:text-text">{formatTime(elapsedTime)}</div>

      {/* Close Button */}
      <FontAwesomeIcon
        icon={faXmark}
        className="text-text cursor-pointer ml-8 sm:ml-24"
        onClick={() => toggle(beat, false)}
      />
    </div>
  );
}
