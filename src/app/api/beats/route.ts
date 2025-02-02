import prisma from "@/utils/prisma";
import { getToken } from "next-auth/jwt";
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
        name: search ? { contains: search, mode: "insensitive"} : undefined,
        purchased: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        producer: { select: { username: true } },
        licenses: {
          select: {
            id: true,
            price: true,
            licenseOption: { select: { name: true, contents: true, usageTerms: true } },
          },
          orderBy: { price: "asc" },
        }
      },
    });

    return NextResponse.json(beats);
  } catch (error) {
    console.error("Error fetching beats:", error);
    return NextResponse.json(
      { error: "Error fetching beats" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, genre, bpm, licenses } = body;

  try {
    const beatLicenses = [];

    const beat = await prisma.beat.create({
      data: {
        id: body.id,
        name,
        genre,
        bpm,
        songKey: body.songKey,
        audioSrc: body.audioSrc,
        purchased: false,
        length: body.length,
        createdAt: new Date(),
        updatedAt: new Date(),
        producer: { connect: { id: "1" } }, // Connect the producer
      },
    });

    console.log("Beat created:", beat);

    for (const license of licenses) {
      const beatLicense = await prisma.beatLicense.create({
        data: {
          beat: { connect: { id: beat.id } }, // Connect to the beat just created
          licenseOption: { connect: { id: license.id } }, // Connect to the licenseOption
          price: license.price,
          createdAt: new Date(),
          updatedAt: new Date(),
          stripePriceId: "",
        },
      });
      await prisma.download.create({
        data: {
          url: license.productSrc,
          license: { connect: { id: beatLicense.id } },
        },
      })
      beatLicenses.push(beatLicense);
    }

    console.log("Beat licenses created:", beatLicenses);

    await prisma.beat.update({
      where: { id: beat.id },
      data: {
        licenses: {
          connect: beatLicenses.map((license) => ({ id: license.id })),
        },
      },
    });

    const product = await stripe.products.create({
      name: beat.name,
      type: "good",
      metadata: {
        beatId: beat.id,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Error creating product" }, { status: 500 });
    }

    for (const license of beatLicenses) {
      const price = await stripe.prices.create({
        unit_amount: license.price * 100,
        currency: "eur",
        product: product.id,
        metadata: {
          beatId: beat.id,
          licenseId: license.id,
        },
      });

      if (!price) {
        return NextResponse.json({ error: "Error creating price" }, { status: 500 });
      }

      const res = await prisma.beatLicense.update({
        where: { id: license.id },
        data: {
          stripePriceId: price.id,
        },
      });

      if (!res) {
        return NextResponse.json({ error: "Error updating beat license" }, { status: 500 });
      }
    }

    return NextResponse.json(beat, { status: 200 });
  } catch (error) {
    console.error("Error creating beat:", error);
    return NextResponse.json({ error: "Error creating beat" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
