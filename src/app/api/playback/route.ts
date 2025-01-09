import { list } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const beatId = request.nextUrl.searchParams.get("id");

  if (!beatId) {
    return NextResponse.json(
      { error: "Beat ID is required" },
      { status: 400 }
    );
  }

  try {
    const blobBaseUrl = `https://blhf5x3zv0lnny2n.public.blob.vercel-storage.com/beats/${beatId}/converted/`;
    const playlistUrl = `${blobBaseUrl}playlist-vIHcTj5dMS9KeShGg4To2aZQ2a2fNN.m3u8`;

    // Fetch the playlist file from storage
    const playlistRes = await fetch(playlistUrl);

    if (!playlistRes.ok) {
      throw new Error(`Failed to fetch playlist: ${playlistRes.statusText}`);
    }

    // Read the playlist content as text
    const playlistText = await playlistRes.text();

    // Fetch the list of files in the storage folder using the Vercel Blob API
    const segmentFiles = await fetchSegmentFileNames(beatId);

    // Replace segment names with their full Blob Storage paths
    const updatedPlaylist = playlistText.replace(
      /^(segment_\d+\.ts)$/gm, // Match segment file names
      (match) => segmentFiles[match] || match // Replace if found, otherwise keep original
    );

    console.log("Updated playlist:", updatedPlaylist);

    // Return the updated playlist
    return new Response(updatedPlaylist, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error in playback API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Fetch segment file names and map them to their full URLs
async function fetchSegmentFileNames(beatId: string): Promise<Record<string, string>> {
  const segments = await list({ prefix: `beats/${beatId}/converted/` });

  // Filter out `.ts` files and create a mapping of segment base name to URL
  const segmentMap: Record<string, string> = {};
  segments.blobs
    .filter((file) => file.pathname.endsWith(".ts"))
    .forEach((file) => {
      const baseName = file.pathname.match(/segment_\d+\.ts/)?.[0]; // Extract the base name (e.g., `segment_000.ts`)
      if (baseName) {
        segmentMap[baseName] = file.url; // Map base name to the full URL
      }
    });

  return segmentMap;
}
