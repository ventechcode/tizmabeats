import prisma from "@/utils/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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
      });
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
      return NextResponse.json(
        { error: "Error creating product" },
        { status: 500 }
      );
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
        return NextResponse.json(
          { error: "Error creating price" },
          { status: 500 }
        );
      }

      const res = await prisma.beatLicense.update({
        where: { id: license.id },
        data: {
          stripePriceId: price.id,
        },
      });

      if (!res) {
        return NextResponse.json(
          { error: "Error updating beat license" },
          { status: 500 }
        );
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
