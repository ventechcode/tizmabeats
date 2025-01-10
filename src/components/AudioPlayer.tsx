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
  const [playlistUrl, setPlaylistUrl] = useState<string | null>();

  useEffect(() => {
    const setupHls = async () => {
      if (!audioRef.current) return;

      const hls = new Hls();
      
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log("HLS media attached");
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", event, data);
      });

      hls.loadSource(beat.audioSrc);
      hls.attachMedia(audioRef.current);

      // Create a blob URL for the audio element
      const blobUrl = URL.createObjectURL(new Blob([], { type: 'application/vnd.apple.mpegurl' }));
      setPlaylistUrl(blobUrl);

      return () => {
        hls.destroy();
        if (blobUrl) URL.revokeObjectURL(blobUrl);
      };
    };

    setupHls();
  }, [beat.audioSrc]);

  useEffect(() => {
    if (!playlistUrl || !audioRef.current) return;

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
      <audio ref={audioRef} src={playlistUrl || undefined} className="hidden"></audio>
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
