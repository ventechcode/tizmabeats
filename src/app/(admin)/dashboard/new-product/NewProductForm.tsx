"use client";

import { useRef, useState, useEffect } from "react";
import { upload } from "@vercel/blob/client";
import { v4 as uuid } from "uuid";
import WaveSurfer from "wavesurfer.js";
import { set, z } from "zod";
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

// Define the license schema
const licenseSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().min(1, "Price must be greater than 0"),
  productSrc: z.string().min(1, "Product source is required"),
});

const formSchema = z.object({
  name: z
    .string()
    .min(5, {
      message: "Title must be at least 5 characters long",
    })
    .max(30),
  bpm: z.number().min(1, "Bpm is required").max(300),
  songKey: z.string().min(1, "Song key is required").max(10),
  audioSrc: z.string().min(1, "Audio source is required"),
  genre: z.string().min(1, "Genre is required"),
  licenses: z.array(licenseSchema).min(1, "At least one license is required"),
});

interface NewProductFormProps {
  licenseOptions: {
    id: string;
    name: string;
    basePrice: number;
    contents: string[];
  }[];
}

export default function NewProductForm({
  licenseOptions,
}: NewProductFormProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedLicenses, setSelectedLicenses] = useState<
    {
      id: string;
      name: string;
      price: number;
      productSrc: string;
    }[]
  >([]);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLProgressElement>(null);
  const productFiles = useRef<{ [key: string]: File | null }>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bpm: 0,
      songKey: "",
      genre: "",
      audioSrc: "",
      licenses: [], // Changed from having a default empty license
    },
  });

  const handleLicenseSelect = (option: (typeof licenseOptions)[0]) => {
    const isSelected = selectedLicenses.some(
      (license) => license.id === option.id
    );

    if (isSelected) {
      setSelectedLicenses((prev) =>
        prev.filter((license) => license.id !== option.id)
      );
      const currentLicenses = form.getValues("licenses");
      form.setValue(
        "licenses",
        currentLicenses.filter((license) => license.id !== option.id)
      );
    } else {
      const newLicense = {
        id: option.id,
        name: option.name,
        price: option.basePrice,
        productSrc: "",
      };
      setSelectedLicenses((prev) => [...prev, newLicense]);
      const currentLicenses = form.getValues("licenses") || [];
      form.setValue("licenses", [...currentLicenses, newLicense], {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  const handleLicensePriceChange = (licenseId: string, price: number) => {
    setSelectedLicenses((prev) =>
      prev.map((license) =>
        license.id === licenseId ? { ...license, price: price || 0 } : license
      )
    );

    const licenseIndex = form
      .getValues("licenses")
      .findIndex((l) => l.id === licenseId);
    if (licenseIndex !== -1) {
      const updatedLicenses = [...form.getValues("licenses")];
      updatedLicenses[licenseIndex] = {
        ...updatedLicenses[licenseIndex],
        price: price || 0,
      };
      form.setValue("licenses", updatedLicenses);
    }
  };

  const handleProductFileChange = (licenseId: string, fileName: string) => {
    setSelectedLicenses((prev) =>
      prev.map((license) =>
        license.id === licenseId
          ? { ...license, productSrc: fileName }
          : license
      )
    );

    const licenseIndex = form
      .getValues("licenses")
      .findIndex((l) => l.id === licenseId);
    if (licenseIndex !== -1) {
      const updatedLicenses = [...form.getValues("licenses")];
      updatedLicenses[licenseIndex] = {
        ...updatedLicenses[licenseIndex],
        productSrc: fileName,
      };
      form.setValue("licenses", updatedLicenses, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form values at submission:", values);

    // Validate that all selected licenses have prices and product files
    const hasInvalidLicenses = values.licenses.some(
      (license) => !license.price || !license.productSrc
    );

    if (hasInvalidLicenses) {
      form.setError("licenses", {
        type: "manual",
        message: "All selected licenses must have a price and product file",
      });
      return;
    }

    if (!values.licenses || values.licenses.length === 0) {
      console.error("No licenses selected");
      return;
    }

    setUploading(true);
    const id = uuid();

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
        alert("No mp3 file for audio streaming selected");
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
        messageRef.current.innerHTML = "Uploading product files...";
      }

      let productSrcs = [];

      for (const license of selectedLicenses) {
        const file = productFiles.current[license.name];
        if (messageRef.current) {
          messageRef.current.innerHTML = `Uploading ${file?.name}...`;
        }
        if (file) {
          const res = await upload(`/beats/${id}/products/${license.name}/${file.name}`, file, {
            access: "public",
            handleUploadUrl: "/api/upload",
            clientPayload: id,
            onUploadProgress: (progress) => {
              if (progressRef.current) {
                progressRef.current.value = progress.percentage;
              }
            },
          });
          productSrcs.push(res.url);
        }
      }

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
        body: JSON.stringify({
          ...values,
          id,
          audioSrc,
          length,
          licenses: values.licenses.map((license) => ({
            id: license.id,
            name: license.name,
            price: license.price,
            productSrc: productSrcs.find((src) => src.includes(license.name)),
          })),
        }),
      });
      console.log("Beat created successfully");
    } catch (error) {
      console.error("Error creating beat:", error);
      alert("Error creating beat. Please try again.");
    } finally {
      setUploading(false);
      inputFileRef!.current!.value = "";
      setSelectedLicenses([]);
      for (const key in productFiles.current) {
        productFiles.current[key] = null;
      }
      form.reset();
    }
  };

  return (
    <div className="bg-mantle py-4 px-6 rounded-md w-2/3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-x-8"
        >
          <div className="space-y-4">
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
                  <FormMessage />
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
                  <FormMessage />
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
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage />
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
                          field.onChange(file.name);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <p className="text-sm mt-0.5">Select or add licensing options</p>
            <div className="grid grid-cols-3 gap-2 w-full">
              {licenseOptions.map((option: any) => {
                const isSelected = selectedLicenses.some(
                  (license) => license.id === option.id
                );
                return (
                  <div
                    key={option.id}
                    onClick={() => handleLicenseSelect(option)}
                    className={`h-20 hover:bg-crust hover:cursor-pointer border-2 rounded-md flex flex-col items-start justify-around pl-2 py-1 ${
                      isSelected ? "border-accentColor bg-crust" : ""
                    }`}
                  >
                    <p className="text-md">{option.name}</p>
                    <input
                      type="text"
                      placeholder={option.basePrice + " €"}
                      value={
                        selectedLicenses.find((l) => l.id === option.id)?.price
                          ? `${
                              selectedLicenses.find((l) => l.id === option.id)
                                ?.price
                            } €`
                          : ""
                      }
                      onChange={(e) => {
                        e.stopPropagation();
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        const numericValue = parseInt(value, 10);
                        if (!isNaN(numericValue)) {
                          handleLicensePriceChange(
                            option.id,
                            isNaN(numericValue) ? 0 : numericValue
                          );
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace") {
                          e.stopPropagation();
                          const currentValue =
                            selectedLicenses
                              .find((l) => l.id === option.id)
                              ?.price?.toString() || "";
                          const newValue = currentValue.slice(0, -1);
                          handleLicensePriceChange(
                            option.id,
                            newValue === "" ? 0 : parseInt(newValue, 10)
                          );
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onFocus={(e) => e.stopPropagation()}
                      className="border-none w-16 bg-transparent pl-0 text-text focus:outline-none focus:ring-0 focus:border-transparent cursor-text"
                    />
                    <p className="text-subtext0 text-[10px]">
                      {option.contents.join(", ")}
                    </p>
                  </div>
                );
              })}
            </div>

            {selectedLicenses.map((license) => (
              <FormField
                key={license.name}
                control={form.control}
                name={`licenses.${form
                  .getValues("licenses")
                  .findIndex((l) => l.name === license.name)}.productSrc`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Add product for license: {license.name}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="audio/*"
                        className="text-text"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file.name);
                            handleProductFileChange(license.name, file.name);
                            productFiles.current[license.name] = file;
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            {form.formState.errors.licenses && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.licenses.message}
              </p>
            )}

            <div className="col-span-2 flex flex-row">
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
                  <div ref={messageRef} className="text-subtext0 text-sm">
                    Initializing ffmpeg...
                  </div>
                  <progress
                    ref={progressRef}
                    className="progress"
                    value={0}
                    max={100}
                  />
                </div>
              )}
            </div>
          </div>
        </form>
      </Form>
      <div id="waveform" className="hidden col-span-2"></div>
    </div>
  );
}
