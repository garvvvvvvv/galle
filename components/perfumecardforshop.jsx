"use client";

import React, { useState } from 'react';
import './perfumecardforshop.css'
import Link from 'next/link';
import { useCart } from './CartContext';



const PerfumeCard2 = ({
  title,
  img,
  description,
  price,
  size,
  highlights = [],
  notes = {},
  readMoreLink,
  slug
}) => {
  const { addToCart } = useCart();
  const [showPopup, setShowPopup] = useState(false);

  // Ensure slug is present (fallback to title if not provided)
  const safeSlug = slug || (title ? title.toLowerCase().replace(/\s+/g, "-") : "");

  // Build product object with all required fields for cart
  const product = {
    slug: safeSlug,
    title,
    image: img, // use 'image' key for consistency with products data
    description,
    price,
    size,
    highlights,
    notes
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  return (
    <div className="perfumeCard2" style={{ position: 'relative' }}>
      {showPopup && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: '#241B19',
          color: '#fff',
          padding: '8px 18px',
          borderRadius: 8,
          zIndex: 10,
          fontWeight: 500,
          fontSize: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
        }}>
          Added to cart!
        </div>
      )}
      <div className="imgcontainer">
        <img src={img} alt={title} />
      </div>
      <div className='shop-page-details-cards'>
        <h1 className="perfumeName">{title}</h1>
        {description && <h3 className="perfumeDescription2">{description}</h3>}
        <div className="perfumeDetails2">
          <h2 className="perfumePrice2">Rs.{price}</h2>
          <h3 className="perfumeSize2">{size}</h3>
        </div>
        {notes.top || notes.middle || notes.base ? (
          <section className="fragrance-notes">
            <ul>
              {notes.top && <li><strong>Top:</strong> {notes.top}</li>}
              {notes.middle && <li><strong>Middle:</strong> {notes.middle}</li>}
              {notes.base && <li><strong>Base:</strong> {notes.base}</li>}
            </ul>
          </section>
        ) : null}
        <div className="bothbuttons">
          <Link href={readMoreLink} className="readMoreButton2">Read More</Link>
          <button className="addToCartButton2" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default PerfumeCard2
