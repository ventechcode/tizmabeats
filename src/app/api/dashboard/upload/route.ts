import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error("Missing AWS configuration");
}

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

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
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${dir}/${beatId}/${fileName}`,
      ContentType: fileType,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb", // 10 MB max client upload size
    },
  },
};
