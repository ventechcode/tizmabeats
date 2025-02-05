import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const genres = await prisma.beat.findMany({
    select: {
      genre: true,
    },
    where: {
      purchased: false,
    },
    orderBy: {
      genre: "asc",
    },
    distinct: ["genre"],
  });

  const res = genres.map((beat) => beat.genre);

  return NextResponse.json(res);
}
