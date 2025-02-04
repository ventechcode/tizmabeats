import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const bpms = await prisma.beat.findMany({
    select: {
      bpm: true,
    },
    where: {
      purchased: false,
    },
    orderBy: {
      bpm: "asc",
    },
    distinct: ["bpm"],
  });

  const res = bpms.map((beat) => beat.bpm);

  return NextResponse.json(res);
}
