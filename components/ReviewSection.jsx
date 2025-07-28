"use client";
import React from 'react';
import { motion } from "framer-motion";

const reviews = [
  {
    name: 'Aarav S.',
    rating: 5,
    text: 'Absolutely love the scent! Long-lasting and unique. Will buy again.'
  },
  {
    name: 'Priya M.',
    rating: 4,
    text: 'Beautiful packaging and fast delivery. The fragrance is elegant.'
  },
  {
    name: 'Rahul K.',
    rating: 5,
    text: 'Perfect for daily wear. Got many compliments!'
  }
];

export default function ReviewSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{ margin: '2rem 0', padding: '1.5rem', background: '#fff8f2', borderRadius: 12, maxWidth: '1400px', alignContent: 'center', margin: 'auto', textAlign: 'center'  }}
    >
      <h2 style={{ fontFamily: 'Playfair Display', fontWeight: 600, fontSize: '1.5rem', marginBottom: 16 }}>Customer Reviews</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {reviews.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 18, minWidth: 220, flex: 1 }}
          >
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{r.name} <span data-v-cd260612="" style={{ color: 'rgb(0, 0, 0)' }}> 🇮🇳</span></div><cite data-v-4c2f4803="" className="yotpo-reviewer-verified-buyer-text unselectable" style={{ marginInlineStart: 5 }}>Verified Buyer</cite>
            <div style={{ color: '#FFD700', fontSize: '1.1rem', marginBottom: 8 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
            <div style={{ color: '#412a1f', fontWeight: 400 }}>{r.text}</div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
