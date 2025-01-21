import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import prisma from "@/utils/prisma";
import Stripe from "stripe";

import { Resend } from "resend";
import { EmailTemplate } from "@/components/EmailTemplate";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY);

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
      const session = event.data.object;
      const email = session.customer_details?.email as string;
      const name = session.customer_details?.name as string;
      const price = session.amount_total! / 100;
      const license_ids = JSON.parse(session.metadata!.items).map((item: any) => ({ id: item.id }));

      console.log(`Session ${session.id} was successful`);
      const items = await prisma.beatLicense.findMany({
        where: { id: { in: license_ids.map((item: any) => item.id) } },
        select: {
          id: true,
          beatId: true,
          price: true,
          licenseOption: { select: { name: true } },
          beat: { select: { name: true, licenses: true } },
          download: { select: { id: true } },
        },
      });

      // Check if user already exists
      let user = await prisma.user.findUnique({
        where: { email: email },
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

      // Create order in database
      const order = await prisma.order.create({
        data: {
          price: price,
          userId: user.id,
          beat: { connect: items!.map((item: any) => ({ id: item.beatId })) },
        },
      }); 

      // Create donwload link
      let downloadLinks: any[] = [];
      for (const item of items) {
        const download = await prisma.download.findUnique({
          where: { licenseId: item.id },
          select: { id: true },
        })

        const link = await prisma.downloadLink.create({
          data: {
            download: { connect: { id: download?.id } },
        }})

        downloadLinks.push(link);
        }
      

      // Send order confirmation email
      try {
        const { error } = await resend.emails.send({
          from: "Tizmabeats <onboarding@resend.dev>",
          to: ["lukas.schenkel1@gmail.com"],
          subject: "Receipt for your order",
          react: EmailTemplate({
            firstName: name,
            orderId: order.id,
            orderDate: new Date(),
            items,
            totalAmount: order.price,
            supportEmail: "support@tizmabeats.dev",
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
      for (const item of items) {
        await prisma.beat.update({
          where: { id: item.beatId },
          data: { purchased: true, order: { connect: { id: order.id } } },
        });
      }

      console.log(`Order ${order.id} created`);

      await stripe.checkout.sessions.update(session.id, {
        metadata: {
          order_id: order.id,
          items: JSON.stringify(items.map((item) => ({ id: item.id }))),
        },
      });

      break;
    default:
      console.log(`Unhandled event type ${event?.type}`);
  }

  return NextResponse.json({ status: 200 });
}
