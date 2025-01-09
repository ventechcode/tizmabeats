import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

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
          tokenPayload: clientPayload
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("Upload completed");
        console.log("Download URL:", blob.downloadUrl);
        console.log("Client payload:", tokenPayload);
        const res = await fetch("https://tizmabeats.vercel.app/api/upload/webhook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: blob.url }),
        });

        console.log("Webhook response:", await res.json());
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
