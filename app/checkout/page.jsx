"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useCart } from '@/components/CartContext';
import { supabase } from '@/utils/supabaseClient';
import countryCodes from '@/components/countryCodes.json'; // You need to create this file
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function CheckoutPage() {
    const { cart, clearCart } = useCart();
    const [form, setForm] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
        pincode: '',
        country_code: '+91',
        city: ''
    });
    //
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && !window.Razorpay) {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleCheckout = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);
        try {
            // 1. Create Razorpay order
            const res = await fetch('/api/create-razorpay-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: total,
                    currency: 'INR',
                    receipt: `order_${Date.now()}`
                })
            });
            let data;
            try {
                data = await res.json();
            } catch (e) {
                throw new Error('Server error: Invalid JSON response');
            }
            if (!data.orderId) throw new Error(data.error || 'Failed to create order');

            // 2. Open Razorpay checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: total * 100,
                currency: 'INR',
                name: 'Galle Perfume',
                description: 'Order Checkout',
                order_id: data.orderId,
                handler: async function (response) {
                    // 3. Ensure user is signed in and profile is up-to-date
                    const { data: { user }, error: userError } = await supabase.auth.getUser();
                    if (userError || !user) {
                      setError("You're not signed in. Please sign in to place an order.");
                      setLoading(false);
                      return;
                    }

                    // Optional: Ensure user profile is complete
                    try {
                      const { data: profileData, error: profileError } = await supabase.rpc('upsert_user_profile', {
                        input_first_name: form.name, // Adjust if you have separate first/last name
                        input_email: form.email,
                        input_phone: form.phone,
                        input_country_code: form.country_code,
                        input_city: form.city
                      });
                      if (profileError) {
                        console.warn('Could not update profile:', profileError);
                      }
                    } catch (err) {
                      console.warn('Profile update attempt failed:', err);
                    }

                    // Ensure all fields are correct types for Supabase
                    const orderPayload = {
                      name: form.name,
                      email: form.email,
                      address: form.address,
                      phone: form.phone,
                      country_code: form.country_code,
                      pincode: form.pincode,
                      city: form.city,
                      cart: JSON.stringify(cart), // must be string for jsonb
                      total: Number(total), // ensure numeric
                      payment_id: String(response.razorpay_payment_id),
                      order_id: String(response.razorpay_order_id),
                      status: 'Placed',
                      user_id: user.id
                    };
                    console.log("Supabase Auth User ID:", user.id);
                    const { error: orderError } = await supabase.from('orders').insert([orderPayload]);
                    if (orderError) {
                      setError('Order saved but failed to save in database: ' + orderError.message);
                    }
                    // 4. Send order confirmation email
                    try {
                        const emailRes = await fetch('/api/send-order-email', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                orderDetails: {
                                    ...form,
                                    cart,
                                    total,
                                    paymentId: response.razorpay_payment_id,
                                    orderId: response.razorpay_order_id
                                }
                            })
                        });
                        const emailData = await emailRes.json();
                        if (!emailData.success) throw new Error(emailData.error || 'Email failed');
                        setSuccess(true);
                        clearCart();
                        toast.success('Order placed!');
                    } catch (err) {
                        setError('Order placed but email failed: ' + (err.message || ''));
                    }
                },
                prefill: {
                    name: form.name,
                    email: form.email,
                    contact: form.phone
                },
                theme: { color: '#8B2E2E' }
            };
            if (typeof window !== 'undefined' && window.Razorpay) {
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                throw new Error('Razorpay SDK not loaded');
            }
        } catch (err) {
            setError(err.message || 'Checkout failed');
            toast.error(err.message || 'Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Suspense fallback={<div className="loading-fill-text">GALLE</div>}>
        <div>
            <div style={{ maxWidth: 600, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h2 style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: '2rem' }}>Checkout</h2>
                    <Link href="/checkout" style={{ display: 'flex', alignItems: 'center', color: '#241B19', fontWeight: 600, fontSize: '1.2rem', textDecoration: 'none', gap: 8 }}>
                        <FaShoppingCart style={{ fontSize: '1.5rem' }} /> Go to Cart
                    </Link>
                </div>
                <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: '1px solid #d2beab' }} />
                    <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: '1px solid #d2beab' }} />
                    <div style={{ display: 'flex', gap: 8 }}>
                        <select name="country_code" value={form.country_code} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: '1px solid #d2beab', minWidth: 110 }}>
                            {countryCodes.map((c) => (
                                <option key={c.code} value={c.dial_code}>{c.name} ({c.dial_code})</option>
                            ))}
                        </select>
                        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #d2beab' }} />
                    </div>
                    <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: '1px solid #d2beab' }} />
                    <input name="city" placeholder="City" value={form.city} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: '1px solid #d2beab' }} />
                    <textarea name="address" placeholder="Shipping Address" value={form.address} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: '1px solid #d2beab', minHeight: 60 }} />
                    <h3 style={{ fontWeight: 600, marginTop: 12 }}>Order Summary</h3>
                    <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', paddingLeft: 0, marginBottom: 8 }}>
                        {cart.map(item => (
                            <li key={item._cartKey} style={{
                              display: 'flex',
                              alignItems: 'center',
                              background: '#f7ece6',
                              borderRadius: 10,
                              padding: '0.7rem 1.2rem',
                              boxShadow: '0 2px 8px rgba(80,60,40,0.07)',
                              minWidth: 220,
                              gap: '1rem'
                            }}>
                              <img src={item.img || item.image} alt={item.title} style={{ width: 54, height: 54, borderRadius: 8, objectFit: 'cover', marginRight: 12 }} />
                              <div>
                                <div style={{ fontWeight: 600 }}>{item.title}</div>
                                <div style={{ fontSize: '0.98rem', color: '#412a1f' }}>Qty: {item.quantity}</div>
                                <div style={{ fontWeight: 500 }}>₹{item.price * item.quantity}</div>
                              </div>
                            </li>
                        ))}
                    </ul>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>Total: ₹{total}</div>
                    <button type="submit" disabled={loading || cart.length === 0} style={{ background: '#8B2E2E', color: '#fff', padding: '12px 32px', borderRadius: 8, fontWeight: 600, fontSize: '1.1rem', border: 'none', cursor: 'pointer', marginTop: 8 }}>{loading ? 'Processing...' : 'Pay Now'}</button>
                    {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
                    {success && <div style={{ color: 'green', marginTop: 8 }}>Order placed! Confirmation sent to your email.</div>}
                </form>
            </div>
        </div>
        </Suspense>
    );
}
