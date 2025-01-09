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
    const blobUrl = `https://blhf5x3zv0lnny2n.public.blob.vercel-storage.com/beats/${beatId}/converted/playlist-R4Z5fBb9amVpzYUGY9VHN1nrzN2Lqm.m3u8`;
    const res = await fetch(blobUrl);

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
