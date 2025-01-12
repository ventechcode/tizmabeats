"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import WaveSurfer from "wavesurfer.js";
import Hls from "hls.js";
import { Beat } from "@/types";
import {
  IoVolumeLowOutline,
  IoVolumeHighOutline,
  IoVolumeMuteOutline,
} from "react-icons/io5";
import { HiMiniXMark } from "react-icons/hi2";

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
  const [volume, setVolume] = useState(100);
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

    setVolume(parseInt(localStorage.getItem("volume") || "100"));

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

  const handleVolumeChange = (e: any)  => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    beat.wavesurferRef.current?.setVolume(newVolume / 100);
    localStorage.setItem("volume", newVolume.toString());
  };

  const getVolumeIcon = () => {
    if (volume == 0)
      return (
        <IoVolumeMuteOutline
          className="text-text text-3xl"
          onClick={() => {
            const storedVolume = localStorage.getItem("volume");
            setVolume(storedVolume ? parseInt(storedVolume) : 100);
            beat.wavesurferRef.current?.setVolume(storedVolume ? parseInt(storedVolume) / 100 : 1);
          }}
        />
      );
    else if (volume < 50)
      return (
        <IoVolumeLowOutline
          className="text-text text-3xl"
          onClick={() => {
            setVolume(0);
            beat.wavesurferRef.current?.setVolume(0);
          }}
        />
      );
    else if (volume >= 50)
      return (
        <IoVolumeHighOutline
          className="text-text text-3xl"
          onClick={() => {
            setVolume(0);
            beat.wavesurferRef.current?.setVolume(0);
          }}
        />
      );
  };

  return (
    <div className="fixed bottom-0 z-50 h-16 sm:h-20 bg-mantle w-full flex flex-row justify-between items-center px-4 sm:px-8">
      <audio ref={audioRef} className="hidden"></audio>
      <div className="flex flex-row flex-wrap items-center w-1/5">
        <div className="ml-3">
          <p className="font-semibold truncate overflow-hidden">
            {beat.name}
          </p>
          <div className="text-[12px] sm:text-sm">{beat.genre}</div>
        </div>
      </div>

      <div className="w-8 pr-4 sm:pr-12 text-sm sm:text-text">
        {formatTime(elapsedTime)}
      </div>

      <div id="waveform" className="w-3/5"></div>

      <div className="w-8 pl-2 sm:pl-4 text-sm sm:text-text">
        {formatTime(metadata.duration)}
      </div>

      <div className="sm:w-24 md:w-32 ml-10 hidden md:flex flex-row items-center space-x-2">
        {getVolumeIcon()}
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={handleVolumeChange}
          className="range range-xs range-primary text-text"
          aria-label="Volume control"
        />
      </div>

      <HiMiniXMark
        className="text-text cursor-pointer ml-8 sm:ml-24 hover:text-accentColor duration-300"
        onClick={() => toggle(beat, false, false)}
      />
    </div>
  );
}
