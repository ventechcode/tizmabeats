import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import prisma from "@/utils/prisma";
import Stripe from "stripe";

import { Resend } from "resend";
import { OrderConfirmationEmail } from "@/components/EmailTemplate";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY);
const unqiqueEvents = new Set();

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") as string;
  const webhook_secret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhook_secret);
  } catch (err: unknown) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      if (unqiqueEvents.has(event.id)) {
        console.log(`Event ${event.id} already processed`);
        return NextResponse.json({ status: 200 });
      }
      unqiqueEvents.add(event.id);

      const session = event.data.object;

      const order_id = session.metadata!.order_id;

      console.log(`Completing order ${order_id}`);

      const order = await prisma.order.findUnique({
        where: { id: order_id },
        select: {
          beats: { select: { id: true } },
          beatLicenses: {
            select: { id: true, price: true, beat: { select: { name: true } }, licenseOption: { select: { name: true } }, download: { select: { id: true, url: true } }},
          },
        },
      });

      if (!order) {
        console.error(`Order ${order_id} not found`);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const email = session.customer_details?.email as string;
      const name = session.customer_details?.name as string;

      // Check if user already exists
      let user = await prisma.user.findUnique({
        where: { email: email },
        select: { id: true, email: true, name: true },
      });

      if (!user) {
        // Create user in database
        user = await prisma.user.create({
          data: {
            email: email,
            name: name,
            address: JSON.stringify(session.customer_details?.address),
          },
        });
      }

      // Update order in database
      await prisma.order.update({
        where: { id: order_id },
        data: {
          user: { connect: { id: user.id } },
          status: "completed",
        },
      });

      // Create donwload links
      console.log("Creating download links");
      let downloadLinks: any[] = [];
      for (const item of order.beatLicenses) {
        const download = await prisma.download.findUnique({
          where: { licenseId: item.id },
          select: { id: true },
        });

        const link = await prisma.downloadLink.create({
          data: {
            download: { connect: { id: download?.id } },
          },
        });

        downloadLinks.push(link);
      }

      // Send order confirmation email
      try {

        console.log("Sending confirmation email");

        const { error } = await resend.emails.send({
          from: "Tizmabeats <onboarding@resend.dev>",
          to: ["lukas.schenkel1@gmail.com"],
          subject: "Receipt for your order",
          react: OrderConfirmationEmail({
            userName: user.name,
            orderId: order_id,
            beatLinceses: order.beatLicenses,
          }),
        });

        if (error) {
          console.error(error);
          return Response.json({ error }, { status: 500 });
        }
      } catch (error) {
        console.error(error);
        return Response.json({ error }, { status: 500 });
      }

      // Update product stock
      for (const beat of order.beats) {
        console.log(`Updating stock for beat ${beat.id}`);
        const res = await prisma.beat.update({
          where: { id: beat.id },
          data: { purchased: true, order: { connect: { id: order_id } } },
        });

        console.log(`Beat updated`, res);
      }

      console.log(`Order ${order_id} compeleted!`);
      break;
    default:
      console.log(`Unhandled event type ${event?.type}`);
  }

  return NextResponse.json({ status: 200 });
}
