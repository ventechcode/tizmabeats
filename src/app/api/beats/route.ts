import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  // Parse the genres query parameter
  const genreParams = params.get("genre");
  let genres: string[] | undefined = genreParams
    ? genreParams.includes(",")
      ? genreParams.split(",")
      : [genreParams]
    : undefined;

  // Parse the bpm query parameter
  const bpmParams = params.get("bpm");
  let bpms: number[] | undefined = bpmParams
    ? bpmParams.includes(",")
      ? bpmParams.split(",").map((bpm) => parseInt(bpm, 10))
      : [parseInt(bpmParams, 10)]
    : undefined;

    try {
      const beats = await prisma.beat.findMany({
        where: {
          genre: genres?.length ? { in: genres } : undefined,
          bpm: bpms?.length ? { in: bpms } : undefined,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          producer: { select: { name: true } },
        },
      });
  
      return NextResponse.json(beats);
    } catch (error) {
      console.error("Error fetching beats:", error);
      return NextResponse.json({ error: "Error fetching beats" }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
}