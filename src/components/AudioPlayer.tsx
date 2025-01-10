"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import WaveSurfer from "wavesurfer.js";
import Hls from "hls.js";
import { Beat } from "@/types";
import { test } from "./test"

export default function AudioPlayer({
  beat,
  toggle,
}: {
  beat: Beat;
  toggle: (beat: Beat, pause: boolean) => void;
}) {
  beat.wavesurferRef = useRef<WaveSurfer | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(beat.audioSrc);

  // useEffect(() => {
  //   const fetchPlaylistUrl = async () => {
  //     try {
  //       const response = await fetch(`/api/playback?id=${beat.id}`);
  //       if (!response.ok) throw new Error("Failed to fetch playlist");
  //       const blob = await response.blob();
  //       const url = URL.createObjectURL(blob);
  //       console.log("Playlist URL:", url);
  //       setPlaylistUrl(url);
  //     } catch (error) {
  //       console.error("Error fetching playlist:", error);
  //     }
  //   };

  //   fetchPlaylistUrl();

  //   return () => {
  //     if (playlistUrl) URL.revokeObjectURL(playlistUrl);
  //   };
  // }, [beat.id]);

  useEffect(() => {
    if (!playlistUrl || !audioRef.current) return;

    console.log("Playlist URL:", beat.audioSrc);

    const hls = new Hls();
    hls.loadSource(playlistUrl);
    hls.attachMedia(audioRef.current);

    if (!beat.wavesurferRef.current) {
      beat.wavesurferRef.current = WaveSurfer.create({
        container: "#waveform",
        waveColor: "#4c4f69",
        progressColor: "#89b4fa",
        barWidth: 5,
        barRadius: 8,
        cursorWidth: 3,
        hideScrollbar: true,
        normalize: false,
        mediaControls: false,
        autoplay: true,
        barGap: 3,
        height: 50,
        cursorColor: "#cdd6f4",
        peaks: [test.data],
        duration: test.duration,
        media: audioRef.current,
      }); 

      beat.wavesurferRef.current.on("interaction", () => {
        setElapsedTime(beat.wavesurferRef.current?.getCurrentTime() || 0);
      });

      beat.wavesurferRef.current.on("audioprocess", () => {
        setElapsedTime(beat.wavesurferRef.current?.getCurrentTime() || 0);
      });
    }

    beat.wavesurferRef.current.setVolume(volume);

    return () => {
      //hls.destroy(); // Destroy HLS instance to avoid memory leaks
      if (beat.wavesurferRef.current) {
        try {
          beat.wavesurferRef.current.destroy();
        } catch (error) {
          console.warn("Error while destroying WaveSurfer instance:", error);
        }
        beat.wavesurferRef.current = null;
      }
    };
  }, [beat, playlistUrl, volume]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleVolumeChange = (vol: number) => {
    const clampedVolume = Math.min(Math.max(vol, 0), 1);
    setVolume(clampedVolume);
    beat.wavesurferRef.current?.setVolume(clampedVolume);
  };

  return (
    <div className="absolute bottom-0 left-0 z-50 h-16 sm:h-20 bg-mantle w-full flex flex-row justify-around items-center px-4 sm:px-8">
      <audio ref={audioRef} className="hidden"></audio>
      <div className="w-1/4 sm:w-1/6 flex flex-row flex-wrap items-center text-text mr-4 sm:mr-16 md:mr-20 lg:mr-40">
        <div className="ml-3">
          <div className="text-xs sm:text-lg font-semibold">{beat.name}</div>
          <div className="text-[12px] sm:text-sm text-muted">{beat.genre}</div>
        </div>
      </div>

      <div id="waveform" className="w-2/3"></div>

      <div className="w-8 pl-2 sm:pl-4 text-sm sm:text-text">
        {formatTime(elapsedTime)}
      </div>

      <FontAwesomeIcon
        icon={faXmark}
        className="text-text cursor-pointer ml-8 sm:ml-24"
        onClick={() => toggle(beat, false)}
      />
    </div>
  );
}
