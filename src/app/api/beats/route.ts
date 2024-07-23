import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const genreParams = params.get("genres");
  let genres: string[] = [];
  if(genreParams) {
    genres = genreParams.includes(",") ? genreParams.split(",") : [genreParams] || undefined;
  }

  try {
    const beats = await prisma.beat.findMany({
      where: {
        genre: genres.length > 0 ? { in: genres } : undefined,
        bpm: parseInt(params.get("bpm") as string) || undefined,
        songKey: params.get("key") || undefined,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {    
        producer: { select: { name: true } },
      }
    });
    return NextResponse.json(beats);
  } catch (error) {
    console.error("Error fetching beats:", error);
    return NextResponse.json({ error: "Error fetching beats" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}