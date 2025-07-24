"use client";
import { useState } from 'react';
import ProductCarousel from '@/components/ProductCarousel';

export default function ProductPageClient({ product }) {
  const gallery = product.gallery || [product.image];

  // Parse notes if stored as string
  let notes = product.notes;
  if (typeof notes === 'string') {
    const noteObj = {};
    notes.split(',').forEach((part) => {
      const [key, value] = part.split(':');
      if (key && value) noteObj[key.trim().toLowerCase()] = value.trim();
    });
    notes = noteObj;
  }

  // Highlights (badges/icons)
  const highlights = product.highlights || [
    'Non-Returnable',
    'Secure Transaction',
    'Free Shipping',
    'Authentic Product'
  ];

  // State for quantity and order
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState('');

  // Razorpay handler
  const handleBuy = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Create Razorpay order
      const res = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: product.price * quantity,
          currency: 'INR',
          receipt: `order_${Date.now()}`
        })
      });
      const data = await res.json();
      if (!data.orderId) throw new Error('Failed to create order');

      // 2. Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: product.price * quantity * 100,
        currency: 'INR',
        name: product.title,
        description: product.description,
        image: product.image,
        order_id: data.orderId,
        handler: async function (response) {
          // 3. Send order confirmation email
          await fetch('/api/send-order-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: 'customer@email.com', // Replace with real email input
              orderDetails: {
                product: product.title,
                price: product.price,
                quantity,
                total: product.price * quantity,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id
              }
            })
          });
          setOrderSuccess(true);
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: { color: '#8B2E2E' }
      };
      if (typeof window !== 'undefined' && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setError('Razorpay SDK not loaded');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (<>
    <div className="product-detail-page">
      <ProductCarousel gallery={gallery} />

      <div className="product-info" style={{ flex: '1 1 400px', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        <h1 style={{ fontFamily: 'Playfair Display', fontWeight: 600, fontSize: '2rem' }}>{product.title}</h1>
        <section className="product-description">
          <p style={{ lineHeight: '1.2' }}>{product.description}</p>
        </section>
        <div style={{ fontSize: '1.5rem', color: '#8B2E2E', fontWeight: 700 }}>₹{product.price}</div>
        <ul style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', listStyle: 'none', padding: 0, margin: '8px 0' }}>
          {highlights.map((h, i) => <li key={i} style={{ background: '#F7ECE6', color: '#412a1f', borderRadius: '8px', padding: '4px 12px', fontSize: '0.95rem', fontWeight: 500 }}>{h}</li>)}
        </ul>
        <section className="fragrance-notes" style={{fontFamily: 'inter'}}>
          <h3 style={{ fontWeight: 500, marginBottom: '4px' }}>Fragrance Notes:</h3>
          <ul style={{ paddingLeft: '0', margin: 0, fontWeight: 200, listStyle: 'none' }}>
            {notes.top && <li><strong>Top:</strong> {notes.top}</li>}
            {notes.middle && <li><strong>Middle:</strong> {notes.middle}</li>}
            {notes.base && <li><strong>Base:</strong> {notes.base}</li>}
          </ul>
        </section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
          <label htmlFor="quantity" style={{ fontWeight: 500 }}>Quantity:</label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
            style={{ width: '60px', padding: '6px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }}
          />
          <span style={{ fontWeight: 400, color: '#555', fontSize: '1rem' }}>(30ml)</span>
        </div>
        <button
          className="add-to-cart"
          style={{ background: '#8B2E2E', color: '#fff', padding: '12px 32px', borderRadius: '8px', fontWeight: 600, fontSize: '1.1rem', border: 'none', cursor: 'pointer', marginTop: '16px' }}
          onClick={handleBuy}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Buy Now'}
        </button>
        {orderSuccess && <div style={{ color: 'green', marginTop: '12px' }}>Order placed! Confirmation sent to your email.</div>}
        {error && <div style={{ color: 'red', marginTop: '12px' }}>{error}</div>}
        <div style={{ display: 'flex', gap: '16px', marginTop: '24px', alignItems: 'center' }}>
          <span style={{ fontWeight: 500 }}>Share:</span>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
            <img src="/window.svg" alt="Facebook" style={{ width: '28px', height: '28px' }} />
          </a>
          <a href={`https://twitter.com/intent/tweet?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
            <img src="/globe.svg" alt="Twitter" style={{ width: '28px', height: '28px' }} />
          </a>
          <a href={`https://wa.me/?text=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
            <img src="/vercel.svg" alt="WhatsApp" style={{ width: '28px', height: '28px' }} />
          </a>
        </div>
        <div style={{ display: 'flex', gap: '18px', marginTop: '32px', alignItems: 'center' }}>
          <img src="/secure-transaction.svg" alt="Secure Transaction" style={{ width: '38px', height: '38px' }} />
          <img src="/authentic-product.svg" alt="Authentic Product" style={{ width: '38px', height: '38px' }} />
          <img src="/free-shipping.svg" alt="Free Shipping" style={{ width: '38px', height: '38px' }} />
          <img src="/non-returnable.svg" alt="Non-Returnable" style={{ width: '38px', height: '38px' }} />
        </div>
      </div>
    </div>
    </>
  );
}
