"use client";
import React, { Suspense } from 'react';
import PerfumeCard from "@/components/perfumecard";
import PerfumeCard2 from '@/components/perfumecardforshop';
import ReviewSection from '@/components/ReviewSection';
import Testimonials from '@/components/Testimonials';
import './shop.css';
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import SpotlightButton from "@/components/SpotlightButton";
import AnimatedCartPopup from "@/components/AnimatedCartPopup";
import { useCart } from "@/components/CartContext";
import { useState } from "react";

const Shop = () => {
  const { addToCart, cart, lastAdded, setLastAdded } = useCart();
  const [showPopup, setShowPopup] = useState(false);

  // Handler for playful cart add
  const handleAddToCart = (product, quantity = 1) => {
    addToCart(product, quantity);
    if (setLastAdded) setLastAdded({ product, quantity }); // Fix: check if setLastAdded exists
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1800);
  };

  return (
    <Suspense fallback={<div className="loading-fill-text">GALLE</div>}>
      {/* Subtle playful background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
      }} />
      <motion.div
        className='shop-page'
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.section
          className="shop-page-heading"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } }
          }}
        >
          <h2 className='discover-your-new'>Discover your new</h2>
          <h1 className='signature-scent'>Signature Scent</h1>
        </motion.section>
        <div className='shop-line'></div>
        <motion.div
          className="perfume-shop-cards"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } }
          }}
        >
          {/* For each PerfumeCard2, pass a prop to zoom only the image */}
          {/* Example for one card: */}
          <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}>
            <PerfumeCard2
              title="GALLE WINSEN"
              readMoreLink="/shop/galle-winsen"
              addToCartLink="/cart?add=galle-winsen"
              img="https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_2a9069f2.jpg?updatedAt=1751363008436"
              description="A sophisticated blend for the modern individual."
              price={399}
              size="30ml"
              notes={{ top: "Bergamot, Lemon", middle: "Jasmine, Rose", base: "Musk, Amber" }}
              zoomImage
              onAddToCart={(product) => handleAddToCart(product)}
            />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}>
            <PerfumeCard2
              title="GALLE ADORE"
              readMoreLink="/shop/galle-adore"
              addToCartLink="/cart?add=galle-adore"
              img="https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_3ce2c1a8.jpg?updatedAt=1751363008373"
              description="A romantic floral scent with a touch of mystery."
              price={399}
              size="30ml"
              notes={{ top: "Peach, Pear", middle: "Rose, Peony", base: "Cedarwood, Vanilla" }}
              zoomImage
              onAddToCart={(product) => handleAddToCart(product)}
            />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}>
            <PerfumeCard2
              title="GALLE ENTICE"
              readMoreLink="/shop/galle-entice"
              addToCartLink="/cart?add=galle-entice"
              img="https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.27_955a0e06.jpg?updatedAt=1751363008393"
              description="An alluring fragrance for unforgettable moments."
              price={399}
              size="30ml"
              notes={{ top: "Mandarin, Blackcurrant", middle: "Iris, Violet", base: "Patchouli, Tonka Bean" }}
              zoomImage
              onAddToCart={(product) => handleAddToCart(product)}
            />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}>
            <PerfumeCard2
              title="GALLE PIZZAZ"
              readMoreLink="/shop/galle-pizzaz"
              addToCartLink="/cart?add=galle-pizzaz"
              img="https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_ac278abd.jpg?updatedAt=1751363008376"
              description="Vibrant and energetic, perfect for daily wear."
              price={399}
              size="30ml"
              notes={{ top: "Mint, Coriander", middle: "Lavender, Rose", base: "Amber, Musk" }}
              zoomImage
              onAddToCart={(product) => handleAddToCart(product)}
            />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}>
            <PerfumeCard2
              title="DAY DREAM"
              readMoreLink="/shop/day-dream"
              addToCartLink="/cart?add=day-dream"
              img="https://ik.imagekit.io/garvchaudhary/IMG-20250706-WA0073.jpg?updatedAt=1752499477109"
              description="A dreamy floral blend perfect for daytime elegance."
              price={399}
              size="30ml"
              notes={{ top: "Jasmine", middle: "Peony", base: "Sandalwood" }}
              zoomImage
              onAddToCart={(product) => handleAddToCart(product)}
            />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}>
            <PerfumeCard2
              title="WHITE OUD"
              readMoreLink="/shop/white-oud"
              addToCartLink="/cart?add=white-oud"
              img="https://ik.imagekit.io/garvchaudhary/IMG-20250706-WA0074.jpg?updatedAt=1752499477046"
              description="An exotic and rich oud experience with subtle spice."
              price={399}
              size="30ml"
              notes={{ top: "Rose", middle: "Oud", base: "Amber" }}
              zoomImage
              onAddToCart={(product) => handleAddToCart(product)}
            />
          </motion.div>
        </motion.div>
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
      </motion.div>
    </Suspense>
  );
}

export default Shop
