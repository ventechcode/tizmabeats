"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Hls from "hls.js";
import {
  IoVolumeLowOutline,
  IoVolumeHighOutline,
  IoVolumeMuteOutline,
} from "react-icons/io5";
import { HiMiniXMark } from "react-icons/hi2";
import { useGlobalAudioPlayer } from "@/hooks/useAudioPlayer";
import { Tooltip } from "@/components/ui/tooltip";

export default function AudioPlayer() {
  const audioPlayer = useGlobalAudioPlayer();

  audioPlayer.beat!.wavesurferRef = useRef<WaveSurfer | null>(null);
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
        `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${audioPlayer?.beat?.id}/metadata.json`
      );

      const metadata = await audio_info.json();
      setMetadata(metadata);

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

      hls.loadSource(`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}${audioPlayer?.beat?.audioSrc}`);
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
  }, [audioPlayer.beat]);

  useEffect(() => {
    if (!playlistUrl || !audioRef.current) return;

    if (audioPlayer.beat?.wavesurferRef.current) {
      audioPlayer.beat?.wavesurferRef.current.destroy();
    }

    if (!audioPlayer.beat?.wavesurferRef.current) {
      audioPlayer.beat!.wavesurferRef.current = WaveSurfer.create({
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

      audioPlayer.beat?.wavesurferRef.current.on("interaction", () => {
        setElapsedTime(
          audioPlayer.beat?.wavesurferRef.current.getCurrentTime() || 0
        );
      });

      audioPlayer.beat?.wavesurferRef.current.on("audioprocess", () => {
        setElapsedTime(
          audioPlayer.beat?.wavesurferRef.current.getCurrentTime() || 0
        );
      });

      // Start playback as soon as WaveSurfer is ready
      audioPlayer.beat?.wavesurferRef.current.on("ready", () => {
        audioPlayer.beat?.wavesurferRef.current.play();
      });

      audioPlayer.beat?.wavesurferRef.current.on("finish", () => {
        setElapsedTime(0);
        audioPlayer.stop();
      });
    }

    audioPlayer.beat?.wavesurferRef.current.setVolume(volume / 100);

    return () => {
      if (audioPlayer.beat?.wavesurferRef.current) {
        try {
          audioPlayer.beat?.wavesurferRef.current.destroy();
        } catch (error) {
          console.warn("Error while destroying WaveSurfer instance:", error);
        }
        audioPlayer.beat!.wavesurferRef.current = null;
      }
    };
  }, [audioPlayer.beat, audioRef, playlistUrl, metadata]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleVolumeChange = (e: any) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    audioPlayer.beat?.wavesurferRef.current.setVolume(newVolume / 100);
    localStorage.setItem("volume", newVolume.toString());
  };

  const getVolumeIcon = () => {
    if (volume == 0)
      return (
        <Tooltip
          content="Unmute"
          side="top"
          className="z-50 bg-surface2 text-subtext1"
          showArrow={false}
        >
          <IoVolumeMuteOutline
            className="text-subtext0 text-2xl cursor-pointer hover:text-text duration-300"
            onClick={() => {
              const storedVolume = localStorage.getItem("volume");
              setVolume(storedVolume ? parseInt(storedVolume) : 100);
              audioPlayer.beat?.wavesurferRef.current.setVolume(
                storedVolume ? parseInt(storedVolume) / 100 : 1
              );
            }}
          />
        </Tooltip>
      );
    else if (volume < 50)
      return (
        <Tooltip
          content="Mute"
          side="top"
          className="z-50 bg-surface2 text-subtext1"
          showArrow={false}
        >
          <IoVolumeLowOutline
            className="text-subtext0 text-2xl cursor-pointer hover:text-text duration-300"
            onClick={() => {
              setVolume(0);
              audioPlayer.beat?.wavesurferRef.current.setVolume(0);
            }}
          />
        </Tooltip>
      );
    else if (volume >= 50)
      return (
        <Tooltip
          content="Mute"
          side="top"
          className="z-50 bg-surface2 text-subtext1"
          showArrow={false}
          sideOffset={10}
        >
          <IoVolumeHighOutline
            className="text-subtext0 text-2xl cursor-pointer hover:text-text duration-300"
            onClick={() => {
              setVolume(0);
              audioPlayer.beat?.wavesurferRef.current.setVolume(0);
            }}
          />
        </Tooltip>
      );
  };

  return (
    <div className="fixed bottom-0 z-40 h-16 sm:h-20 bg-mantle w-full flex flex-row justify-between items-center px-4 sm:px-8">
      <audio ref={audioRef} className="hidden"></audio>
      <div className="flex flex-row flex-wrap items-center w-1/5">
        <div className="ml-3">
          <p className="font-semibold truncate overflow-hidden">
            {audioPlayer.beat?.name}
          </p>
          <div className="text-[12px] sm:text-sm">
            {audioPlayer.beat?.genre}
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-center sm:w-full self-justify-center">
        <div className="w-8 sm:pr-12 text-sm sm:text-text">
          {formatTime(elapsedTime)}
        </div>

        <div id="waveform" className="w-3/5 hidden sm:block"></div>

        <button
          onClick={() => {
            if (audioPlayer?.isPlaying(audioPlayer.beat!)) {
              audioPlayer?.pause(audioPlayer.beat!);
            } else {
              audioPlayer?.play(audioPlayer.beat!);
            }
          }}
          className="text-text hover:text-accentColor transition-colors flex-shrink-0 sm:hidden px-2"
        >
          {audioPlayer?.isPlaying(audioPlayer.beat!) ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-12 h-12"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM9 8.25a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75h.75a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75H9Zm5.25 0a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75H15a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75h-.75Z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-12 h-12"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        <div className="w-8 sm:pl-4 text-sm sm:text-text">
          {formatTime(metadata.duration)}
        </div>
      </div>

      <div className="flex flex-row items-center space-x-12">
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

        <button>
            <HiMiniXMark
              className="text-subtext0 hover:text-text cursor-pointer duration-300"
              onClick={() => audioPlayer.stop()}
            />
          </button>
      </div>
    </div>
  );
}
