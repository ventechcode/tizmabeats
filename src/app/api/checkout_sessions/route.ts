import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/utils/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();

  const beatLicenses = await prisma.beatLicense.findMany({
    where: {
      id: { in: body.items.map((item: any) => item.id) },
    },
    select: {
      id: true,
      stripePriceId: true,
      price: true,
      beatId: true,
    },
  });

  // Create order intent
  const order = await prisma.order.create({
    data: {
      total: beatLicenses.reduce((acc, item) => acc + item.price, 0),
      beats: {connect: beatLicenses.map((item: any) => ({id: item.beatId}))},
      beatLicenses: {connect: beatLicenses.map((item: any) => ({id: item.id}))},
    },
  });

  console.log("Order intent created", order);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "klarna", "paypal"],
    line_items: [
      ...beatLicenses.map((item: any) => ({
        price: item.stripePriceId,
        quantity: 1,
      })),
    ],
    mode: "payment",
    success_url: `${request.headers.get(
      "origin"
    )}/payments/success?order_id=${order.id}`,
    cancel_url: `${request.headers.get("origin")}/payments/failure`,
    metadata: {
      order_id: order.id,
    },
  });

  return NextResponse.json({ id: session.id });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const params = request.nextUrl.searchParams;
  const session_id = params.get("session_id");
  const session = await stripe.checkout.sessions.retrieve(session_id!);
  const items = await JSON.parse(session.metadata!.items);

  let products = [];

  for (const item of items) {
    const product = await prisma.beatLicense.findUnique({
      where: { id: item.id },
      select: {
        id: true,
        price: true,
        download: { select: { DownloadLink: true, url: true, id: true } },
        beat: { select: { name: true } },
        licenseOption: { select: { name: true, contents: true } },
      },
    });
    products.push(product);
  }

  const data = {
    session: await session,
    customerEmail: await session.customer_details?.email,
    customerName: await session.customer_details?.name,
    products: await JSON.stringify(products),
    order_id: await session.metadata?.order_id,
  };

  return NextResponse.json(data);
}
