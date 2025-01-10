import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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

  // Parse the search query parameter
  const search = params.get("search");

    try {
      const beats = await prisma.beat.findMany({
        where: {
          genre: genres?.length ? { in: genres } : undefined,
          bpm: bpms?.length ? { in: bpms } : undefined,
          name: search ? { contains: search, mode: "insensitive" } : undefined,
          purchased: false,
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

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, genre, bpm, producerId } = body;

  console.log("ID:", body.id);

  try {
    const product = await stripe.products.create({
      name: name,
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: body.price * 100,
      currency: "eur",
    });

    const beat = await prisma.beat.create({
      data: {
        name,
        genre,
        bpm,
        producerId,
        songKey: body.songKey,
        audioSrc: body.audioSrc,
        price: body.price,
        purchased: false,
        length: body.length,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: body.id,
        stripePriceId: price.id,
        producer: { connect: { id: "1" } },
      },
    });

    return NextResponse.json(beat, { status: 201 });
  } catch (error) {
    console.error("Error creating beat:", error);
    return NextResponse.json({ error: "Error creating beat" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
  
}