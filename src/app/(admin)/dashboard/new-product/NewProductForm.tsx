"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { v4 as uuid } from "uuid";
import WaveSurfer from "wavesurfer.js";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(5).max(30),
  bpm: z.number().min(2).max(300),
  songKey: z.string().max(10),
  audioSrc: z.string(),
  price: z.number().min(1),
  genre: z.string(),
  productSrc: z.string(),
});

export default function NewProductForm() {
  const [uploading, setUploading] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLProgressElement>(null);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // if (!ffmpegLoaded) {
    //   alert("FFmpeg is not loaded yet. Please try again in a moment.");
    //   return;
    // }

    setUploading(true);
    const id = uuid();

    try {
      if (messageRef.current) {
        messageRef.current.innerHTML = "Initializing ffmpeg...";
      }

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

      const src = await fetchFile(file);
      await ffmpeg.writeFile("input.mp3", src);

      if (messageRef.current) {
        messageRef.current.innerHTML = "Extracting peaks and duration...";
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

      await ffmpeg.exec(["-i", "input.mp3", "-b:a", "96k", "output.mp3"]);

      const reducedAudio = new Blob([await ffmpeg.readFile("output.mp3")], {
        type: "audio/mp3",
      });

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

      const audioSrc = blob.url;
      const length = metadata.duration;

      await fetch("/api/beats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, id, audioSrc, length }),
      });
    } catch (error) {
      console.error("Error creating beat:", error);
      alert("Error creating beat. Please try again.");
    } finally {
      setUploading(false);
      inputFileRef!.current!.value = "";
      console.log("Resetting form...");
      form.reset();
      console.log("Form reset called.");
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bpm: 0,
      songKey: "",
      price: 0,
      genre: "",
      audioSrc: "",
      productSrc: "",
    },
  });

  return (
    <div className="bg-surface0 py-2 px-6 rounded-md w-full max-w-lg">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 rounded"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Trap Beat"
                    className="text-text"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Techno"
                    className="text-text"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bpm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bpm</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 90"
                    type="number"
                    className="text-text"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))} // Parse input as a number
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="songKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Song key</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. F#M"
                    className="text-text"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 30"
                    type="number"
                    className="text-text"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))} // Parse input as a number
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="audioSrc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Audio for streaming (mp3)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="audio/mp3"
                    className="text-text"
                    ref={inputFileRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        inputFileRef!.current!.files = e.target.files; // Store the file in inputFileRef
                        field.onChange(file.name); // Optionally update form value with the file name or URL
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="productSrc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product for selling (mp3, wav, stems)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="audio/*"
                    className="text-text"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex flex-row">
            <Button
              type="submit"
              disabled={uploading}
              className="bg-accentColor mb-2"
            >
              {uploading ? (
                <div className="loading loading-spinner"></div>
              ) : (
                "Create Beat"
              )}
            </Button>
            {uploading && (
              <div className="flex flex-col justify-around ml-2 w-full mb-2">
                <div ref={messageRef} className="text-subtext0 text-sm">Test</div>
                <progress
                  ref={progressRef}
                  className="progress"
                  value={0}
                  max={100}
                />
              </div>
            )}
          </div>
        </form>
      </Form>
      <div id="waveform" className="hidden"></div>
    </div>
  );
}
