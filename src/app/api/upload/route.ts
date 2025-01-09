import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
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

        const beatId = tokenPayload;
        const mp3Url = blob.downloadUrl;

        try {
          // Initialize FFmpeg
          const ffmpeg = new FFmpeg();
          
          console.log('FFmpeg initialized');

          // Load FFmpeg
          const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd';
          await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
          });

          console.log('FFmpeg loaded');

          // Fetch and write input file
          const inputData = await fetchFile(mp3Url);
          await ffmpeg.writeFile('input.mp3', inputData);

          console.log('Input file written');

          // Run FFmpeg command
          await ffmpeg.exec([
            '-i', 'input.mp3',
            '-codec:', 'copy',
            '-start_number', '0',
            '-hls_time', '10',
            '-hls_list_size', '0',
            '-f', 'hls',
            'playlist.m3u8'
          ]);

          console.log('FFmpeg command executed');

          // Read the generated playlist
          const playlist = await ffmpeg.readFile('playlist.m3u8');
          if (playlist) {
            await put(`converted/${beatId}/playlist.m3u8`, new Blob([playlist]), {
              access: 'public'
            });
          }

          console.log('Playlist uploaded');

          // Read and upload all generated .ts files
          const files = await ffmpeg.listDir('.');
          const tsFiles = files.filter(file => file.name.endsWith('.ts'));
          
          for (const file of tsFiles) {
            const content = await ffmpeg.readFile(file.name);
            if (content) {
              await put(`converted/${beatId}/${file.name}`, new Blob([content]), {
                access: 'public'
              });
            }
          }

          // Clean up
          await ffmpeg.deleteFile('input.mp3');
          await ffmpeg.deleteFile('playlist.m3u8');
          for (const file of tsFiles) {
            await ffmpeg.deleteFile(file.name);
          }

        } catch (error) {
          console.error('Error in FFmpeg processing:', error);
          throw error;
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}

