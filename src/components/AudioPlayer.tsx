"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import WaveSurfer from "wavesurfer.js";
import Hls from "hls.js";
import { Beat } from "@/types";

export default function AudioPlayer({
  beat,
  toggle,
}: {
  beat: Beat;
  toggle: (beat: Beat, pause: boolean, next: boolean) => void;
}) {
  beat.wavesurferRef = useRef<WaveSurfer | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [volume, setVolume] = useState(50);
  const [playlistUrl, setPlaylistUrl] = useState<string | null>();
  const [metadata, setMetadata] = useState({ duration: 0, peaks: [] });

  useEffect(() => {
    const setupHls = async () => {
      if (!audioRef.current) return;

      const audio_info = await fetch(
        `https://blhf5x3zv0lnny2n.public.blob.vercel-storage.com/beats/${beat.id}/converted/audio-info.json`
      );
      const metadata = await audio_info.json();
      setMetadata(metadata);

      // Destroy previous HLS instance if it exists
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls();
      hlsRef.current = hls;

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", event, data);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Start playback as soon as the manifest is parsed
        audioRef.current
          ?.play()
          .catch((error) => console.error("Autoplay failed:", error));
      });

      hls.loadSource(beat.audioSrc);
      hls.attachMedia(audioRef.current);

      // Create a blob URL for the audio element
      const blobUrl = URL.createObjectURL(
        new Blob([], { type: "application/vnd.apple.mpegurl" })
      );

      setPlaylistUrl(blobUrl);
    };

    setupHls();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.detachMedia();
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [beat.id]);

  useEffect(() => {
    if (!playlistUrl || !audioRef.current) return;

    if (beat.wavesurferRef.current) {
      beat.wavesurferRef.current.destroy();
    }

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
        media: audioRef.current,
        duration: metadata.duration,
        peaks: metadata.peaks,
        dragToSeek: true,
      });

      beat.wavesurferRef.current.on("interaction", () => {
        setElapsedTime(beat.wavesurferRef.current?.getCurrentTime() || 0);
      });

      beat.wavesurferRef.current.on("audioprocess", () => {
        setElapsedTime(beat.wavesurferRef.current?.getCurrentTime() || 0);
      });

      // Start playback as soon as WaveSurfer is ready
      beat.wavesurferRef.current.on("ready", () => {
        beat.wavesurferRef.current?.play();
      });

      beat.wavesurferRef.current.on("finish", () => {
        setElapsedTime(0);
        toggle(beat, false, true);
      });
    }

    beat.wavesurferRef.current.setVolume(volume / 100);

    return () => {
      if (beat.wavesurferRef.current) {
        try {
          beat.wavesurferRef.current.destroy();
        } catch (error) {
          console.warn("Error while destroying WaveSurfer instance:", error);
        }
        beat.wavesurferRef.current = null;
      }
    };
  }, [beat, playlistUrl, metadata]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleVolumeChange = (e: any) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    beat.wavesurferRef.current?.setVolume(newVolume / 100);
  };

  const getVolumeIcon = () => {
    if (volume > 0) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-7 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
          />
        </svg>
      );
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-7 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
          />
        </svg>
      );
    }
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

      {getVolumeIcon()}

      <input
        type="range"
        min={0}
        max={100}
        value={volume}
        onChange={handleVolumeChange}
        className="range range-sm w-1/5 sm:w-1/6 pr-4 sm:pr-12 range-primary"
        aria-label="Volume control"
      />

      <div className="w-8 pr-4 sm:pr-12 text-sm sm:text-text">
        {formatTime(elapsedTime)}
      </div>

      <div id="waveform" className="w-2/3"></div>

      <div className="w-8 pl-2 sm:pl-4 text-sm sm:text-text">
        {formatTime(metadata.duration)}
      </div>

      <FontAwesomeIcon
        icon={faXmark}
        className="text-text cursor-pointer ml-8 sm:ml-24"
        onClick={() => toggle(beat, false, false)}
      />
    </div>
  );
}
