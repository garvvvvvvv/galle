import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { orderDetails } = await req.json();
  // Configure your SMTP credentials in .env.local
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Send to both admin and customer (if email provided)
  const recipients = [
    'seraphicquest@gmail.com',
    orderDetails.email && orderDetails.email !== '' ? orderDetails.email : null
  ].filter(Boolean).join(',');
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: recipients,
    subject: 'Order Confirmation',
    text: `Thank you for your order!\n\nOrder Details:\n${JSON.stringify(orderDetails, null, 2)}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
