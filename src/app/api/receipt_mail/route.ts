import { EmailTemplate } from '@/components/EmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {

  const body = await request.json();

  console.log(body);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Tizmabeats <tizmabeats@resend.dev>',
      to: body.customerEmail,
      subject: 'Receipt for your order',
      react: EmailTemplate({ firstName: body.name, orderId: 'test', orderDate: new Date(), items: [...body.items], totalAmount: body.totalAmount, supportEmail: "support@tizmabeats.dev" }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
