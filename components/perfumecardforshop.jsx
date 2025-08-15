"use client";

import React, { useState } from 'react';
import './perfumecardforshop.css'
import Link from 'next/link';
import { useCart } from './CartContext';
import { motion } from "framer-motion";
import * as Toast from '@radix-ui/react-toast';
import { SpotlightButton } from './SpotlightButton'; // Adjust the import path as necessary
import { toast } from 'react-toastify';

const PerfumeCard2 = ({
  title,
  img,
  description,
  price,
  size,
  highlights = [],
  notes = {},
  readMoreLink,
  slug,
  onAddToCart // Accept onAddToCart as a prop
}) => {
  const { addToCart } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

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

  const handleAddToCart = async () => {
    await addToCart(product, 1);
    setShowPopup(true);
    setToastOpen(true);
    toast.success('Added to cart!');
    setTimeout(() => setShowPopup(false), 1200);
  };

  return (
    <>
      <Toast.Provider swipeDirection="right">
        <motion.div
          className="perfumeCard2"
          style={{ position: 'relative' }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          whileHover={{ scale: 1.015, boxShadow: "0 8px 32px rgba(80,60,40,0.10)" }}
          whileTap={{ scale: 0.98 }}
        >
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
            <img src={img} alt={title} className="zoom-on-hover" />
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
              <SpotlightButton
                className="addToCartButton2"
                onClick={async () => {
                  if (onAddToCart) {
                    await onAddToCart(product);
                  } else {
                    await handleAddToCart();
                  }
                }}
                style={{ marginLeft: 8 }}
              >
                Add to Cart
              </SpotlightButton>
            </div>
          </div>
        </motion.div>
        <Toast.Root open={toastOpen} onOpenChange={setToastOpen} duration={1200} style={{
          background: "#241B19", color: "#fff", borderRadius: 8, padding: "12px 22px", fontWeight: 600, fontSize: "1.05rem", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", position: "fixed", bottom: 32, right: 32, zIndex: 9999
        }}>
          Added to cart!
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    </>
  );
}

export default PerfumeCard2;
