"use client";

import { useRef, useState, useEffect } from "react";
import { upload } from "@vercel/blob/client";
import { v4 as uuid } from "uuid";
import WaveSurfer from "wavesurfer.js";

interface FormData {
  name: string;
  bpm: number;
  songKey: string;
  audioSrc: string;
  price: number;
  producer: string;
  genre: string;
  length: number;
}

export default function NewProductForm() {
  const initialFormData: FormData = {
    name: "",
    bpm: 0,
    songKey: "",
    audioSrc: "",
    price: 0,
    producer: "",
    genre: "",
    length: 0,
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [uploading, setUploading] = useState(false);
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLProgressElement>(null);

  useEffect(() => {
    let isMounted = true;
    const loadFFmpeg = async () => {
      if (typeof window !== "undefined") {
        try {
          const { FFmpeg } = await import("@ffmpeg/ffmpeg");
          const { fetchFile, toBlobURL } = await import("@ffmpeg/util");
          if (isMounted) {
            setFFmpegLoaded(true);
          }
        } catch (error) {
          console.error("Failed to load FFmpeg:", error);
        }
      }
    };
    loadFFmpeg();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ffmpegLoaded) {
      alert("FFmpeg is not loaded yet. Please try again in a moment.");
      return;
    }

    setUploading(true);

    const id = uuid();
    console.log("ID:", id);

    try {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { fetchFile, toBlobURL } = await import("@ffmpeg/util");
      const ffmpeg = new FFmpeg();

      // FFmpeg setup
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

      ffmpeg.on("progress", ({ progress, time }) => {
        console.log(`Progress: ${progress} | Time: ${time}`);
        if (progressRef.current) {
          progressRef.current.value = progress * 100;
        }
      });

      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });

      // Transcode audio file
      const file = inputFileRef.current?.files?.[0];

      if (!file) {
        alert("No file selected");
        return;
      }

      let fileName = file.name.replace("#", "");

      const audioSrc = await fetchFile(file);
      await ffmpeg.writeFile("input.mp3", audioSrc);

      if (messageRef.current) {
        messageRef.current.innerHTML =
          "Extracting peaks and duration from audio file...";
      }

      const metadata: { duration: number; peaks: number[][] } = {
        duration: 0,
        peaks: [],
      };
      const wS = WaveSurfer.create({
        container: "#waveform",
        barWidth: 5,
        barRadius: 8,
        cursorWidth: 3,
        hideScrollbar: true,
      });

      wS.on("ready", async () => {
        const peaks = await wS.exportPeaks();
        const duration = wS.getDuration();
        metadata.peaks = peaks;
        metadata.duration = duration;
      });

      wS.load(URL.createObjectURL(file));

      if (messageRef.current) {
        messageRef.current.innerHTML = "Reducing audio quality...";
      }

      await ffmpeg.exec([
        "-i",
        "input.mp3",
        "-b:a",
        "96k",
        "output.mp3",
      ]);

      const reducedAudio = new Blob([await ffmpeg.readFile("output.mp3")], {type: "audio/mp3"});

      if (messageRef.current) {
        messageRef.current.innerHTML =
          "Converting audio file to streamable format...";
      }

      await ffmpeg.exec([
        "-i",
        "output.mp3",
        "-hls_time",
        "10",
        "-hls_playlist_type",
        "vod",
        "-hls_segment_filename",
        "segment_%03d.ts",
        "playlist.m3u8",
      ]);

      // Retrieve the generated files
      const playlist = await ffmpeg.readFile("playlist.m3u8");
      const playlistBlob = new Blob([playlist], {
        type: "application/vnd.apple.mpegurl",
      });

      const playlistText = await playlistBlob.text();

      // Extract segment filenames from the playlist
      const segmentFilenames = playlistText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && line.endsWith(".ts"));

      // Read all segment files dynamically
      const segments = await Promise.all(
        segmentFilenames.map((filename) => ffmpeg.readFile(filename))
      );

      if (messageRef.current) {
        messageRef.current.innerHTML = "Uploading .mp3 file...";
      }
      if (progressRef.current) {
        progressRef.current.value = 0;
      }

      await upload(`/beats/${id}/${fileName}`, reducedAudio, {
        access: "public",
        handleUploadUrl: "/api/upload",
        clientPayload: id,
        onUploadProgress: (progress) => {
          if (progressRef.current) {
            progressRef.current.value = progress.percentage;
          }
        },
      });

      if (messageRef.current) {
        messageRef.current.innerHTML = "Uploading playlist.m3u8 file...";
      }
      if (progressRef.current) {
        progressRef.current.value = 0;
      }

      const blob = await upload(
        `/beats/${id}/converted/playlist.m3u8`,
        playlistBlob,
        {
          access: "public",
          handleUploadUrl: "/api/upload",
          clientPayload: id,
          onUploadProgress: (progress) => {
            console.log("HLS playlist upload progress:", progress);
            if (progressRef.current) {
              progressRef.current.value = progress.percentage;
            }
          },
        }
      );

      if (progressRef.current) {
        progressRef.current.value = 0;
      }

      for (let i = 0; i < segments.length; i++) {
        const paddedIndex = String(i).padStart(3, "0");
        const segmentBlob = new Blob([segments[i]], {
          type: "video/mp2t",
        });

        if (messageRef.current) {
          messageRef.current.innerHTML = `Uploading segment_${paddedIndex}.ts...`;
        }

        await upload(
          `/beats/${id}/converted/segment_${paddedIndex}.ts`,
          segmentBlob,
          {
            access: "public",
            handleUploadUrl: "/api/upload",
            multipart: true,
            clientPayload: id,
            onUploadProgress: (progress) => {
              if (progressRef.current) {
                progressRef.current.value = progress.percentage;
              }
            },
          }
        );
      }

      if (messageRef.current) {
        messageRef.current.innerHTML = `Uploading audio metadata...`;
      }

      await upload(
        `/beats/${id}/converted/audio-info.json`,
        JSON.stringify(metadata),
        {
          access: "public",
          handleUploadUrl: "/api/upload",
          clientPayload: id,
        }
      );

      if (messageRef.current) {
        messageRef.current.innerHTML = "Updating database...";
      }

      formData.audioSrc = blob.url;
      formData.length = metadata.duration;

      await fetch("/api/beats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, id }),
      });

      setFormData(initialFormData);
    } catch (error) {
      console.error("Error creating beat:", error);
      alert("Error creating beat. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 bg-surface0 py-5 px-7 rounded flex flex-col items-start"
    >
      <input
        type="text"
        id="name"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="input input-bordered bg-surface2 focus:outline-none w-full"
      />

      <input
        type="number"
        id="bpm"
        name="bpm"
        placeholder="0€"
        value={formData.bpm}
        onChange={handleChange}
        required
        style={{
          WebkitAppearance: "none",
          MozAppearance: "textfield",
        }}
        className="input input-bordered bg-surface2 focus:outline-none w-full"
      />

      <input
        type="text"
        id="songKey"
        name="songKey"
        placeholder="Song Key"
        value={formData.songKey}
        onChange={handleChange}
        required
        className="input input-bordered bg-surface2 focus:outline-none w-full"
      />

      <input
        type="number"
        id="price"
        name="price"
        placeholder="Preis"
        value={formData.price}
        onChange={handleChange}
        required
        className="input input-bordered bg-surface2 focus:outline-none w-full"
        style={{
          WebkitAppearance: "none",
          MozAppearance: "textfield",
        }}
      />

      <div className="form-group">
        <label
          className="block text-sm font-medium text-text mb-2"
          htmlFor="genre"
        >
          Genre
        </label>
        <input
          type="text"
          id="genre"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          required
          className="w-full border-2 border-text rounded px-4 py-2 bg-surface2 focus:outline-none"
        />
      </div>

      <div className="form-group">
        <label
          className="block text-sm font-medium text-text mb-2"
          htmlFor="audioSrc"
        >
          Audio Source (.mp3 for streaming)
        </label>
        <input
          type="file"
          onChange={handleChange}
          ref={inputFileRef}
          accept="audio/*"
          className="file-input bg-overlay2"
        />
      </div>

      {uploading && (
        <div className="flex flex-col space-y-2 w-full">
          <p ref={messageRef} className="text-text">
            Initializing ffmpeg...
          </p>
          <progress
            ref={progressRef}
            className="progress progress-primary w-full"
            value={0}
            max="100"
          ></progress>
        </div>
      )}
      <div id="waveform" className="hidden"></div>
      <button
        type="submit"
        className="bg-blue text-white w-24 h-12 px-6 py-2 rounded shadow hover:bg-bright-blue"
        disabled={!ffmpegLoaded}
      >
        {uploading ? (
          <span className="loading loading-spinner loading-md mt-1"></span>
        ) : (
          "Create"
        )}
      </button>
    </form>
  );
}
