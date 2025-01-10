import { list } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const beatId = request.nextUrl.searchParams.get("id");

  if (!beatId) {
    return NextResponse.json({ error: "Beat ID is required" }, { status: 400 });
  }

  try {
    const blobBaseUrl = `https://blhf5x3zv0lnny2n.public.blob.vercel-storage.com/beats/${beatId}/converted/`;
    const playlistUrl = `${blobBaseUrl}playlist.m3u8`;

    // Fetch the playlist file from storage
    const playlistRes = await fetch(playlistUrl);

    if (!playlistRes.ok) {
      throw new Error(`Failed to fetch playlist: ${playlistRes.statusText}`);
    }

    // Read the playlist content as text
    const playlistText = await playlistRes.text();

    // Fetch the list of files in the storage folder using the Vercel Blob API
    const segmentedFiles = await fetchSegmentFileNames(beatId);

    const updatedPlaylist = playlistText.replace(
      /segment_(\d+)\.ts/gm, // Match segment file names with numbers
      (match, number) => {

        // Construct the expected key from the matched number
        const segmentKey = `segment_${number.padStart(2, "0")}.ts`;

        // Retrieve URL from segmentFiles if available, otherwise return match
        return segmentedFiles[segmentKey];
      }
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
async function fetchSegmentFileNames(
  beatId: string
): Promise<Record<string, string>> {
  const segments = await list({ prefix: `beats/${beatId}/converted/` });

  // Filter out `.ts` files and create a mapping of segment base name to URL
  const segmentMap: Record<string, string> = {};
  segments.blobs
    .filter((file) => file.pathname.endsWith(".ts"))
    .forEach((file) => {
      const baseNameMatch = file.pathname.match(/segment_\d+\.ts/); // Match segment without fixed padding
      if (baseNameMatch) {
        const baseName = baseNameMatch[0]; // Extract the base name (e.g., `segment_00.ts`, `segment_01.ts`, etc.)
        segmentMap[baseName] = file.url; // Map base name to the full URL
      }
    });

  return segmentMap;
}
