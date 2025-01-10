"use client";

import { useRef, useState, useEffect } from "react";
import { upload } from "@vercel/blob/client";
import { v4 as uuid } from "uuid";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

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
      if (typeof window !== 'undefined') {
        try {
          const { FFmpeg } = await import('@ffmpeg/ffmpeg');
          const { fetchFile, toBlobURL } = await import('@ffmpeg/util');
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
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      const { fetchFile, toBlobURL } = await import('@ffmpeg/util');
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
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });

      if (messageRef.current) {
        messageRef.current.innerHTML = "Transcoding audio file...";
      }

      // Transcode audio file
      const file = inputFileRef.current?.files?.[0];

      if (!file) {
        alert("No file selected");
        return;
      }

      let fileName = file.name.replace("#", "");

      const audioSrc = await fetchFile(file);
      await ffmpeg.writeFile("input.mp3", audioSrc);

      await ffmpeg.exec([
        "-i",
        "input.mp3",
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

      console.log("Segment filenames:", segmentFilenames);

      // Read all segment files dynamically
      const segments = await Promise.all(segmentFilenames.map((filename) =>
        ffmpeg.readFile(filename)
      ));

      if (messageRef.current) {
        messageRef.current.innerHTML = "Uploading .mp3 file...";
      }
      if (progressRef.current) {
        progressRef.current.value = 0;
      }

      await upload(`/beats/${id}/${fileName}`, file, {
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

      await upload(
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

      console.log("Segments:", segments.length);

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
        messageRef.current.innerHTML = "Updating database...";
      }

      setFormData((prev) => ({
        ...prev,
        audioSrc: URL.createObjectURL(playlistBlob),
      }));

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
      className="space-y-2 bg-surface0 py-2 px-6 rounded"
    >
      <div className="form-group">
        <label
          className="block text-sm font-medium text-text mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border-2 border-text rounded px-4 py-2 bg-surface2 focus:outline-none"
        />
      </div>

      <div className="form-group">
        <label
          className="block text-sm font-medium text-text mb-2"
          htmlFor="bpm"
        >
          BPM
        </label>
        <input
          type="number"
          id="bpm"
          name="bpm"
          value={formData.bpm}
          onChange={handleChange}
          required
          className="w-full border-2 border-text rounded px-4 py-2 bg-surface2 focus:outline-none"
          style={{
            WebkitAppearance: "none",
            MozAppearance: "textfield",
          }}
          placeholder="0"
        />
      </div>

      <div className="form-group">
        <label
          className="block text-sm font-medium text-text mb-2"
          htmlFor="songKey"
        >
          Song Key
        </label>
        <input
          type="text"
          id="songKey"
          name="songKey"
          value={formData.songKey}
          onChange={handleChange}
          required
          className="w-full border-2 border-text rounded px-4 py-2 bg-surface2 focus:outline-none"
        />
      </div>

      <div className="form-group">
        <label
          className="block text-sm font-medium text-text mb-2"
          htmlFor="price"
        >
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full border-2 border-text rounded px-4 py-2 bg-surface2 focus:outline-none"
          style={{
            WebkitAppearance: "none",
            MozAppearance: "textfield",
          }}
          placeholder="0.00"
        />
      </div>

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
          htmlFor="length"
        >
          Length (in seconds)
        </label>
        <input
          type="number"
          id="length"
          name="length"
          value={formData.length}
          onChange={handleChange}
          required
          className="w-full border-2 border-text rounded px-4 py-2 bg-surface2 focus:outline-none"
          style={{
            WebkitAppearance: "none",
            MozAppearance: "textfield",
          }}
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
          accept="audio/mp3"
          className="file-input w-full bg-overlay2"
        />
      </div>

      {uploading && (
        <div className="flex flex-col space-y-2">
          <p ref={messageRef} className="text-text text-sm">
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

