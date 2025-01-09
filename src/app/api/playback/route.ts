import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob"

export async function GET(request: NextRequest) {
  const beatId = request.nextUrl.searchParams.get("id");

  if (!beatId) {
    return NextResponse.json(
      { error: "Beat ID is required" },
      { status: 400 }
    );
  }

  try {
    const items = await list({prefix: `beats/${beatId}/converted`});
    const playlist = items.blobs.find(blob => blob.pathname.endsWith('.m3u8'));

    for (const item of items.blobs) {
      console.log(item.url);
    }

    const res = await fetch(playlist!.url);
    console.log("Playlist URL:", playlist!.url);

    if (!res.ok) {
      throw new Error(`Failed to fetch file from Blob Storage: ${res.statusText}`);
    }

    // Stream the content back to the client
    return new Response(res.body, {
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/octet-stream",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error in proxy endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
