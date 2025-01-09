import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import { put } from "@vercel/blob";

const execAsync = promisify(exec);

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const res = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload, multipart) => {
        return {
          allowedContentTypes: ["audio/mpeg", "audio/wav", "audio/mp3"],
          maximumSizeInBytes: 10485760,
          addRandomSuffix: true,
          cacheControlMaxAge: 3600,
          tokenPayload: clientPayload,
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("Upload completed");
        console.log("Download URL:", blob.downloadUrl);
        console.log("Beat ID:", tokenPayload);

        const beatId = tokenPayload; // Assume beat_id is passed in tokenPayload
        if (beatId === undefined) console.error("Beat ID not found");
        const mp3Url = blob.downloadUrl;

        // Step 1: Download MP3
        const tempDir = path.join("/tmp", beatId!);
        const tempMp3Path = path.join(tempDir, "audio.mp3");
        console.log("Temp directory:", tempDir);
        console.log("Temp MP3 path:", tempMp3Path);

        try {
          fs.mkdirSync(tempDir, { recursive: true });
        } catch (error) {
          console.log("Error creating temp directory", error);
        }

        try {
          const res = await execAsync(`curl -o ${tempMp3Path} "${mp3Url}"`);
          console.log("Download MP3 response:", res);
        } catch (error) {
          console.log("Error downloading MP3", error);
        }

        // Convert MP3 to HLS
        const hlsOutputDir = path.join(tempDir, "hls");
        fs.mkdirSync(hlsOutputDir, { recursive: true });
        console.log("HLS output directory:", hlsOutputDir);

        const ffmpegPath = path.join(process.cwd(), 'bin', 'ffmpeg');
        console.log("FFmpeg path:", ffmpegPath);
        const hlsCommand = `
          ${ffmpegPath} -i ${tempMp3Path} \
                -codec: copy \
                -start_number 0 \
                -hls_time 10 \
                -hls_list_size 0 \
                -f hls ${hlsOutputDir}/playlist.m3u8
            `;

        try {
          await execAsync(hlsCommand);
          console.log("HLS conversion completed.");
        } catch (error) {
          console.log("Error during HLS conversion:", error);
        }

        try {
          // Upload HLS files to /converted folder
          const hlsFiles = fs.readdirSync(hlsOutputDir);
          const uploadPromises = hlsFiles.map(async (file) => {
            const filePath = path.join(hlsOutputDir, file);
            const fileContent = fs.readFileSync(filePath);

            const res = await put(`/converted/${beatId}/${file}`, fileContent, {
              access: "public",
            });

            return await res.url;
          });

          const hlsUrls = await Promise.all(uploadPromises);
          console.log("HLS URLs:", hlsUrls);
        } catch (error) {
          console.log("Error uploading HLS files", error);
        }
      },
    });

    return NextResponse.json(res, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Upload failed" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
