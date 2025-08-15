import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { orderDetails } = await req.json();
  const isGifting = !!orderDetails.gifting;

  // Compose recipients for gifting: sender + recipient + admin
  let recipients = ['seraphicquest@gmail.com'];
  if (isGifting) {
    if (orderDetails.sender_email) recipients.push(orderDetails.sender_email);
    if (orderDetails.recipient_email) recipients.push(orderDetails.recipient_email);
  } else {
    if (orderDetails.email) recipients.push(orderDetails.email);
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  let subject = isGifting ? 'Your Galle Gift Order' : 'Order Confirmation';
  let text;
  if (isGifting) {
    text = `A gift order has been placed!

Gifted by: ${orderDetails.sender_name} (${orderDetails.sender_email})
To: ${orderDetails.recipient_name} (${orderDetails.recipient_email})

Gift Message: ${orderDetails.message || "(No message provided)"}

Product: ${orderDetails.product_title}
Price: ₹${orderDetails.product_price}

Shipping Address:
${orderDetails.recipient_address}, ${orderDetails.recipient_city}, ${orderDetails.recipient_pincode} (${orderDetails.recipient_country_code})

Order ID: ${orderDetails.order_id}
Payment ID: ${orderDetails.payment_id}
Status: ${orderDetails.status}

Thank you for choosing Galle for your gifting needs!`;
  } else {
    text = `Thank you for your order!

Order Details:
${JSON.stringify(orderDetails, null, 2)}`;
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: recipients.join(','),
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
