import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

// Replace with your Razorpay key and secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET || process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  const { amount, currency, receipt } = await req.json();
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
    });
    return NextResponse.json({ orderId: order.id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
