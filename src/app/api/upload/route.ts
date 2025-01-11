import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        return {
          allowedContentTypes: [
            "audio/mpeg",
            "audio/wav",
            "audio/mp3",
            "application/octet-stream",
            "application/vnd.apple.mpegurl",
            "video/mp2t",
            "application/json"
          ],
          maximumSizeInBytes: 10485760, // 10 MB max client upload size
          addRandomSuffix: pathname.endsWith(".mp3") || pathname.endsWith(".wav"),
          cacheControlMaxAge: 3600,
          tokenPayload: clientPayload,
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("Upload for", blob.pathname, "completed");
        console.log("Download URL:", blob.url);
        console.log("Beat ID:", tokenPayload);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}
