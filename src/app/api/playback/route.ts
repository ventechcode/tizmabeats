import { NextRequest, NextResponse } from "next/server";
import { head } from "@vercel/blob";

export const config = {
  runtime: 'edge',
};

export async function GET(request: NextRequest) {
  const beatId = request.nextUrl.searchParams.get("id");

  if (!beatId) {
    return NextResponse.json({ error: "Beat ID is required" }, { status: 400 });
  }

  try {
    const playlist = await head(`beats/${beatId}/converted/playlist.m3u8`);
    console.log("Playlist:", playlist);
    const res = await fetch(playlist.url);

    // Return the playlist content
    return new Response((await res.blob()).stream(), {
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error("Error in playback API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

