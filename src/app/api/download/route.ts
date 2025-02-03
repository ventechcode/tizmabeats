import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/utils/s3client";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const download_id = params.get("id");

  // Fetch download record
  const download = await prisma.download.findUnique({
    where: { id: download_id! },
    select: {
      id: true,
      url: true, 
      DownloadLink: {
        select: { expiresAt: true },
        where: { expiresAt: { gt: new Date() } },
      },
    },
  });

  if (!download || !download.DownloadLink) {
    return NextResponse.json(
      { error: "Download link expired or invalid" },
      { status: 404 }
    );
  }

  try {
    // Generate presigned URL for S3 private file
    const presignedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: download.url,
        ResponseContentDisposition: `attachment; filename="${download_id}"`,
      }),
      { expiresIn: 3600 } // 1 hour expiration (adjust as needed)
    );

    // Redirect to the presigned URL
    return NextResponse.redirect(presignedUrl);
  } catch (error) {
    console.error("S3 presigned URL error:", error);
    return NextResponse.json(
      { error: "Failed to generate download link" },
      { status: 500 }
    );
  }
}