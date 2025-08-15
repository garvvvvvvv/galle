"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import products from "@/data/product";
import { toast } from "react-toastify";

export default function GiftingPage() {
  const [form, setForm] = useState({
    sender_name: "",
    sender_email: "",
    sender_phone: "",
    recipient_name: "",
    recipient_email: "",
    recipient_phone: "",
    recipient_address: "",
    recipient_city: "",
    recipient_pincode: "",
    recipient_country_code: "+91",
    message: "",
    product_slugs: [products[0]?.slug || ""], // changed to array
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([products[0]]);
  const [razorpayResponse, setRazorpayResponse] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    // Update selectedProducts array based on product_slugs
    setSelectedProducts(form.product_slugs.map(slug => products.find(p => p.slug === slug)));
  }, [form.product_slugs]);

  useEffect(() => {
    // Process order after successful Razorpay payment
    if (!razorpayResponse) return;
    const processOrder = async () => {
      setLoading(true);
      setError("");
      // 3. Save gifting order in Supabase
      const giftingPayload = {
        ...form,
        product_slugs: form.product_slugs,
        product_titles: selectedProducts.map(p => p?.title),
        product_images: selectedProducts.map(p => p?.image),
        product_prices: selectedProducts.map(p => p?.price),
        total_price: totalPrice,
        payment_id: String(razorpayResponse.razorpay_payment_id),
        order_id: String(razorpayResponse.razorpay_order_id),
        status: "Placed",
      };
      const { error: dbError } = await supabase.from("gifting_orders").insert([giftingPayload]);
      if (dbError) {
        setError("Order placed but failed to save in database: " + dbError.message);
        toast.error("Order placed but failed to save in database.");
      }
      // 4. Send gifting confirmation emails
      try {
        const emailRes = await fetch("/api/send-order-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderDetails: {
              ...giftingPayload,
              gifting: true,
              recipient_email: form.recipient_email,
              sender_email: form.sender_email,
              message: form.message,
            },
          }),
        });
        const emailData = await emailRes.json();
        if (!emailData.success) throw new Error(emailData.error || "Email failed");
        setSuccess(true);
        toast.success("Gift order placed! Confirmation sent.");
      } catch (err) {
        setError("Order placed but email failed: " + (err.message || ""));
        toast.error("Order placed but email failed.");
      }
      setLoading(false);
      setRazorpayResponse(null); // Reset for next order
    };
    processOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [razorpayResponse]);

  const handleChange = (e, idx) => {
    const { name, value } = e.target;
    if (name === "product_slugs") {
      // Update the specific product slug in the array
      setForm(f => {
        const arr = [...f.product_slugs];
        arr[idx] = value;
        return { ...f, product_slugs: arr };
      });
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleAddProduct = () => {
    if (form.product_slugs.length < 4) {
      setForm(f => ({
        ...f,
        product_slugs: [...f.product_slugs, products[0].slug]
      }));
    }
  };

  const handleRemoveProduct = (idx) => {
    if (form.product_slugs.length > 1) {
      setForm(f => {
        const arr = [...f.product_slugs];
        arr.splice(idx, 1);
        return { ...f, product_slugs: arr };
      });
    }
  };

  const totalPrice = selectedProducts.reduce((sum, p) => sum + (p?.price || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      // 1. Create Razorpay order
      const res = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          currency: "INR",
          receipt: `gifting_${Date.now()}`,
        }),
      });
      const data = await res.json();
      if (!data.orderId) throw new Error(data.error || "Failed to create order");

      // 2. Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalPrice * 100,
        currency: "INR",
        name: "Galle Gifting",
        description: `Gift: ${selectedProducts.map(p => p?.title).join(", ")}`,
        image: selectedProducts[0]?.image,
        order_id: data.orderId,
        handler: function (response) {
          // Save Razorpay response to state for further processing
          setRazorpayResponse(response);
        },
        prefill: {
          name: form.sender_name,
          email: form.sender_email,
          contact: form.sender_phone,
        },
        theme: { color: "#8B2E2E" },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };
      if (typeof window !== "undefined" && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        throw new Error("Razorpay SDK not loaded");
      }
    } catch (err) {
      setError(err.message || "Gifting failed");
      toast.error(err.message || "Gifting failed");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(80,60,40,0.09)", padding: "2.5rem 2rem" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "2rem", marginBottom: "1.2rem", color: "#241B19" }}>
        Send a Gift with Galle
      </h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h3 style={{ color: "#8B2E2E", marginBottom: 0 }}>Sender Details</h3>
        <input name="sender_name" placeholder="Your Name" value={form.sender_name} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: "1px solid #d2beab" }} />
        <input name="sender_email" placeholder="Your Email" value={form.sender_email} onChange={handleChange} required type="email" style={{ padding: 10, borderRadius: 8, border: "1px solid #d2beab" }} />
        <input name="sender_phone" placeholder="Your Phone" value={form.sender_phone} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: "1px solid #d2beab" }} />

        <h3 style={{ color: "#8B2E2E", marginBottom: 0, marginTop: 16 }}>Recipient Details</h3>
        <input name="recipient_name" placeholder="Recipient Name" value={form.recipient_name} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: "1px solid #d2beab" }} />
        <input name="recipient_email" placeholder="Recipient Email" value={form.recipient_email} onChange={handleChange} required type="email" style={{ padding: 10, borderRadius: 8, border: "1px solid #d2beab" }} />
        <input name="recipient_phone" placeholder="Recipient Phone" value={form.recipient_phone} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: "1px solid #d2beab" }} />
        <input name="recipient_address" placeholder="Recipient Address" value={form.recipient_address} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: "1px solid #d2beab" }} />
        <input name="recipient_city" placeholder="Recipient City" value={form.recipient_city} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: "1px solid #d2beab" }} />
        <input name="recipient_pincode" placeholder="Recipient Pincode" value={form.recipient_pincode} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: "1px solid #d2beab" }} />
        <select name="recipient_country_code" value={form.recipient_country_code} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: "1px solid #d2beab" }}>
          <option value="+91">India (+91)</option>
          <option value="+1">United States (+1)</option>
          <option value="+44">United Kingdom (+44)</option>
          {/* ...add more as needed... */}
        </select>
        <textarea name="message" placeholder="Gift Message (optional)" value={form.message} onChange={handleChange} style={{ padding: 10, borderRadius: 8, border: "1px solid #d2beab", minHeight: 60 }} />

        <h3 style={{ color: "#8B2E2E", marginBottom: 0, marginTop: 16 }}>Select up to 4 Products to Gift</h3>
        {form.product_slugs.map((slug, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <select
              name="product_slugs"
              value={slug}
              onChange={e => handleChange(e, idx)}
              required
              style={{ padding: 10, borderRadius: 8, border: "1px solid #d2beab", flex: 1 }}
            >
              {products.map((p) => (
                <option key={p.slug} value={p.slug}>{p.title} (₹{p.price})</option>
              ))}
            </select>
            {form.product_slugs.length > 1 && (
              <button type="button" onClick={() => handleRemoveProduct(idx)} style={{ background: "#eee", border: "none", borderRadius: 4, padding: "0 8px", cursor: "pointer", fontWeight: 700, color: "#8B2E2E" }}>×</button>
            )}
          </div>
        ))}
        {form.product_slugs.length < 4 && (
          <button type="button" onClick={handleAddProduct} style={{ background: "#f8e8e0", color: "#8B2E2E", border: "1px dashed #8B2E2E", borderRadius: 8, padding: "8px 16px", fontWeight: 600, fontSize: "1rem", cursor: "pointer", marginBottom: 8 }}>
            + Add another product
          </button>
        )}
        <div>
          {selectedProducts.map((p, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: 16, margin: "1rem 0" }}>
              <img src={p?.image} alt={p?.title} style={{ width: 70, height: 70, borderRadius: 8, objectFit: "cover" }} />
              <div>
                <div style={{ fontWeight: 600 }}>{p?.title}</div>
                <div style={{ color: "#412a1f" }}>{p?.description}</div>
                <div style={{ fontWeight: 500 }}>₹{p?.price}</div>
              </div>
            </div>
          ))}
          <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#8B2E2E", marginTop: 8 }}>
            Total: ₹{totalPrice}
          </div>
        </div>
        <button type="submit" disabled={loading} style={{ background: "#8B2E2E", color: "#fff", padding: "12px 32px", borderRadius: 8, fontWeight: 600, fontSize: "1.1rem", border: "none", cursor: "pointer", marginTop: 8 }}>
          {loading ? "Processing..." : "Send Gift & Pay"}
        </button>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        {success && <div style={{ color: "green", marginTop: 8 }}>Gift order placed! Confirmation sent to you and the recipient.</div>}
      </form>
    </div>
  );
}
