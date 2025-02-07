import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/utils/s3client";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const dir = formData.get("dir") as string;
    const beatId = formData.get("beatId") as string;
    const fileName = formData.get("fileName") as string;
    const fileType = formData.get("fileType") as string;
    const fileSize = formData.get("fileSize") as string;

    if (!beatId || !fileName || !fileType) {
      return NextResponse.json({ error: "Missing file data" }, { status: 400 });
    }

    // File size validation
    const MAX_FILE_SIZE =
      dir === "public" ? 10 * 1024 * 1024 : 100 * 1024 * 1024; // 10MB for public, 100MB for private
    if (parseInt(fileSize) > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit for MP3 streams" },
        { status: 413 }
      );
    }

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: `${dir}/${beatId}/${fileName}`,
      ContentType: fileType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
