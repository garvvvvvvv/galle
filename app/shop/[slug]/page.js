"use client";
import React, { useState, Suspense } from 'react';
import products from '../../../data/product';
import './productslug.css';
import ProductCarousel from '@/components/ProductCarousel';
import { useCart } from '@/components/CartContext';
import Link from 'next/link';
import ReviewSection from '@/components/ReviewSection';
import Testimonials from '@/components/Testimonials';
import AnimatedCartPopup from '@/components/AnimatedCartPopup';
import { motion, AnimatePresence } from 'framer-motion';
import SpotlightButton from '@/components/SpotlightButton';

export default function ProductPage({ params }) {
  const { addToCart, cart, lastAdded, setLastAdded } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const resolvedParams = React.use(params);
  const product = products.find((p) => p.slug === resolvedParams.slug);
  if (!product) return <div>Product not found</div>;
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

  const highlights = product.highlights || [
    'Non-Returnable',
    'Secure Transaction',
    'Free Shipping',
    'Authentic Product'
  ];

  // Handler for playful cart add
  const handleAddToCart = () => {
    addToCart(product, quantity);
    if (setLastAdded) setLastAdded({ product, quantity }); // Fix: check if setLastAdded exists
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1800);
  };

  return (
    <Suspense fallback={<div className="loading-fill-text">GALLE</div>}>
      <>
      {/* Subtle playful background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        background: 'radial-gradient(circle at 70% 20%, #ffe5e5 0%, #fff7f0 100%)'
      }} />
      <div className="product-detail-page">
        <div className="product-detail-header">
        {/* Carousel with explicit image sizes and zoom-on-hover */}
        <ProductCarousel gallery={gallery} imgProps={{ width: 400, height: 400, className: "zoom-on-hover" }} />
        {/* Disclaimer below carousel */}
        <div style={{ fontSize: '0.87rem', color: '#7a5c3a', margin: '8px 30px 18px 30px', background: '#f7f2ed', padding: '8px 14px', borderRadius: '8px', maxWidth: 420 }}>
          <span style={{ fontWeight: 100 }}>Disclaimer:</span> The image is for representation purpose only. The packaging you receive might vary.
        </div>
        {/* Amazon-like share button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', margin: 'auto 40px', maxWidth: 420, background: 'transparent' }}>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: product.title,
                  text: product.description,
                  url: typeof window !== 'undefined' ? window.location.href : ''
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid #ccc', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontWeight: 500, fontSize: '1rem', color: '#412a1f'
            }}
            aria-label="Share product"
          >
            <img src="/share-button.svg" alt="Share" style={{ width: '20px', height: '20px' }} />
            Share
          </button>
          <span style={{ fontSize: '0.95rem', color: '#888' }}></span>
        </div>
        </div>
        <div className="product-info">
          <h1 style={{ fontFamily: 'Playfair Display', fontWeight: 600, fontSize: '2rem' }}>{product.title}</h1>
          <section className="product-description">
            <p style={{ lineHeight: '1.2' }}>{product.description}</p>
          </section>
          <div style={{ fontSize: '1.5rem', color: '#8B2E2E', fontWeight: 700 }}>
            ₹
            <span style={{ display: 'inline-block', marginLeft: 2 }}>{product.price}</span>
          </div>
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
          {/* Quantity Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
            <label htmlFor="quantity" style={{ fontWeight: 500 }}>Quantity:</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #ccc',
              borderRadius: '8px',
              overflow: 'hidden',
              height: '38px',
            }}>
              <button
                type="button"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                style={{
                  padding: '0 12px',
                  fontSize: '18px',
                  background: '#f8f8f8',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#444'
                }}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span style={{
                width: '50px',
                textAlign: 'center',
                border: 'none',
                fontSize: '1rem',
                outline: 'none'
              }}>
                {/* AnimateNumber removed, just show quantity */}
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(prev => prev + 1)}
                style={{
                  padding: '0 12px',
                  fontSize: '18px',
                  background: '#f8f8f8',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#444'
                }}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <span style={{ fontWeight: 400, color: '#555', fontSize: '1rem' }}>(30ml)</span>
          </div>

          <div className="buy-buttons" style={{ display: 'flex', gap: 16 }}>
            <SpotlightButton
              className="add-to-cart"
              onClick={handleAddToCart}
              style={{ minWidth: 140 }}
            >
              Add to Cart
            </SpotlightButton>
            <Link href="/checkout" passHref legacyBehavior>
              <SpotlightButton
                as="a"
                className="add-to-cart"
                style={{ minWidth: 140 }}
              >
                Checkout Now
              </SpotlightButton>
            </Link>
          </div>
        </div>
      </div>
      <ReviewSection /><br />
      {/* Animated playful cart popup */}
      <AnimatePresence>
        {showPopup && lastAdded && (
          <AnimatedCartPopup
            key={lastAdded.product.slug}
            product={lastAdded.product}
            quantity={lastAdded.quantity}
            onClose={() => setShowPopup(false)}
          />
        )}
      </AnimatePresence>
      </>
    </Suspense>
  );
}

