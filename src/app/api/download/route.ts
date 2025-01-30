import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const download_id = params.get("id");

  const download = await prisma.download.findUnique({
    where: { id: download_id! },
    select: {
      id: true,
      url: true,
      DownloadLink: {
        select: {
          expiresAt: true,
        },
        where: {
          expiresAt: {
            gt: new Date(),
          },
        },
      },
    },
  });

  if (!download) {
    return NextResponse.json({ error: "Download not found" }, { status: 404 });
  }

  if (!download.DownloadLink) {
    return NextResponse.json(
      { error: "Download link expired" },
      { status: 400 }
    );
  }

  console.log(`Downloading ${download_id}`);

  const response = await fetch(download.url);
  const readableStream = response.body;

  return new NextResponse(readableStream, {
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${download_id}"`,
    },
  });
}
