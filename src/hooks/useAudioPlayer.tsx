import { createContext, useContext, useState } from "react";
import { ReactNode } from "react";
import { Beat } from "@/types";

interface AudioPlayerContextType {
  beat: Beat | null;
  isOpen: boolean;
  play: (beat: Beat) => void;
  isPlaying: (beat: Beat) => boolean;
  pause: (beat: Beat) => void;
  isPaused: (beat: Beat) => boolean;
  stop: () => void;
}

export const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Beat | null>(null); // Currently playing beat
  const [isOpen, setIsOpen] = useState(false);
  const [paused, setPaused] = useState(false);

  const play = (beat: Beat) => {
    if (currentlyPlaying?.id === beat.id && paused) {
      setPaused(false); // Resume playback if paused
      beat.wavesurferRef?.current?.playPause();
      console.log("Resuming playback");
    } else {
      setCurrentlyPlaying(beat);
      setPaused(false); // Play new track
      console.log("Playing new track");
    }
  };

  const isPlaying = (beat: Beat) => beat.id === currentlyPlaying?.id && !paused;

  const pause = (beat: Beat) => {
    setPaused(true);
    beat.wavesurferRef?.current?.playPause();
    console.log("Pausing playback");
  };

  const isPaused = (beat: Beat) => beat.id === currentlyPlaying?.id && paused;

  const stop = () => {
    setCurrentlyPlaying(null);
    setPaused(false);
    setIsOpen(false);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        beat: currentlyPlaying,
        isOpen,
        play,
        isPlaying,
        pause,
        isPaused,
        stop,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export const useGlobalAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error(
      "useGlobalAudioPlayer must be used within an AudioPlayerProvider"
    );
  }
  return context;
};
