"use client"

import { useGlobalAudioPlayer } from "@/hooks/useAudioPlayer";
import AudioPlayer from "./AudioPlayer";

export default function AudioPlayerWrapper() {
  const audioPlayer = useGlobalAudioPlayer();

  return <div>{audioPlayer.beat && <AudioPlayer />}</div>;
}
