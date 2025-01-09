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
    const playlistUrl = `${blobBaseUrl}playlist-R4Z5fBb9amVpzYUGY9VHN1nrzN2Lqm.m3u8`;

    // Fetch the playlist file from storage
    const playlistRes = await fetch(playlistUrl);

    if (!playlistRes.ok) {
      throw new Error(`Failed to fetch playlist: ${playlistRes.statusText}`);
    }

    const playlistText = await playlistRes.text();

    // Fetch the list of files in the storage folder (mocking or use appropriate API if available)
    const segmentFiles = await fetchSegmentFileNames(beatId);

    // Replace segment names with their full Blob Storage paths
    const updatedPlaylist = playlistText.replace(
      /^(segment_\d+\.ts)$/gm, // Match segment file names
      (match) => segmentFiles[match] 
    );

    // Return the updated playlist
    return new Response(updatedPlaylist, {
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
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

// Mock function to fetch segment file names (replace with actual API if available)
async function fetchSegmentFileNames(beatId: string): Promise<Record<string, string>> {
  // Simulate fetching the file names from storage
  // Replace this with a proper call to Vercel Blob Storage API or any similar storage API
  const segments = await list({ prefix: `beats/${beatId}/converted/` }); 
  const fileNames = segments.blobs.filter((file) => file.pathname.endsWith(".ts")).map((file) => file.pathname);
  const urls = segments.blobs.filter((file) => file.pathname.endsWith(".ts")).map((file) => file.url);
  
  // Map the original segment file names to their actual Blob Storage URLs
  const segmentMap: Record<string, string> = {};
  fileNames.forEach((_, i) => {
    const [baseName] = fileNames[i].split("-"); // Extract the base name (e.g., `segment_000`)
    segmentMap[`${baseName}.ts`] = `${urls[i]}`;
  });

  console.log("Segment map:", segmentMap);

  return segmentMap;
}
