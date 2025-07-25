"use client";
import React, { useState } from "react";
import ImageKitImage from "@/components/ImageKitImage";
import './globals.css'
import Navbar from "@/components/navbar";
import ImageCarousel from "@/components/ImageCarousel";
import PerfumeCard from "@/components/perfumecard";
import Link from "next/link";
import "swiper/css";

import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
// --- Testimonials data ---
const testimonials = [
  {
    name: 'Simran D.',
    text: 'Galle perfumes are my new favorite! The scent lasts all day and feels luxurious.'
  },
  {
    name: 'Vikram P.',
    text: 'I gifted this to my wife and she loved it. The packaging is premium and delivery was quick.'
  },
  {
    name: 'Megha R.',
    text: 'I have sensitive skin and this perfume works perfectly for me. Highly recommended!'
  },
  {
    name: 'Aarav S.',
    text: 'The best value for money. Will definitely buy again!'
  },
  {
    name: 'Priya K.',
    text: 'The fragrance is so unique and long-lasting. Love the eco-friendly packaging.'
  }
];

const blogPosts = [
  {
    slug: "fragrance-trends-2025",
    title: "Fragrance Trends 2025: Scents That Will Define the Year",
    date: "July 25, 2025",
    image: "/perfume.jpg",
    desc: "Explore the top fragrance trends for 2025, from sustainable ingredients to bold new blends. Discover what scents will be everywhere this year and how to choose the perfect one for you.",
  },
  {
    slug: "choosing-signature-scent",
    title: "How to Choose Your Signature Scent: A Guide for Beginners",
    date: "July 20, 2025",
    image: "/perfume.jpg",
    desc: "Finding your signature scent can be overwhelming. We break down the process, from understanding fragrance families to testing perfumes the right way.",
  },
  {
    slug: "perfume-layering-tips",
    title: "Perfume Layering: Tips to Create a Unique Fragrance",
    date: "July 15, 2025",
    image: "/perfume.jpg",
    desc: "Learn the art of perfume layering to create a scent that’s uniquely yours. Our experts share their favorite combinations and dos and don’ts.",
  },
  {
    slug: "eco-friendly-perfume",
    title: "Why Eco-Friendly Perfume Matters in 2025",
    date: "July 10, 2025",
    image: "/perfume.jpg",
    desc: "Sustainability is more than a trend—it's a movement. Discover why eco-friendly perfumes are taking over and how to spot truly green fragrances.",
  }
];

// --- BlogCarousel (Swiper, responsive) ---
function BlogCarousel() {
  return (
    <section style={{ margin: "3rem 0" }}>
      <h2 style={{
        fontFamily: 'Playfair Display', fontWeight: 700, fontSize: '2rem',
        color: '#8B2E2E', marginBottom: 24, textAlign: 'center'
      }}>
        From Our Blog
      </h2>
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={32}
        slidesPerView={1}
        breakpoints={{
          700: { slidesPerView: 2 },
          1100: { slidesPerView: 3 },
        }}
        style={{ maxWidth: 1100, margin: "0 auto" }}
      >
        {blogPosts.map((post, i) => (
          <SwiperSlide key={i}>
            <Link
              href={`/blog/${post.slug}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#fff',
                borderRadius: 14,
                boxShadow: '0 2px 12px rgba(80,60,40,0.06)',
                textDecoration: 'none',
                color: '#241B19',
                overflow: 'hidden',
                minHeight: 340
              }}
            >
              <img
                src={post.image}
                alt={post.title}
                style={{
                  width: '100%',
                  height: 220,
                  objectFit: 'cover',
                  borderBottom: '1px solid #f7ece6'
                }}
              />
              <div style={{
                padding: '1.2rem 1.2rem 1.5rem 1.2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.7rem'
              }}>
                <div style={{ fontSize: '0.95rem', color: '#8B2E2E', fontWeight: 500 }}>{post.date}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'Playfair Display, serif' }}>{post.title}</div>
                <div style={{ fontSize: '1.05rem', color: '#412a1f', fontWeight: 400 }}>{post.desc}</div>
                <span style={{ color: '#A62639', fontWeight: 700, marginTop: '0.5rem', fontSize: '1.05rem' }}>Read More →</span>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <Link href="/blog" style={{
          background: '#8B2E2E',
          color: '#fff',
          padding: '0.8rem 2rem',
          borderRadius: 10,
          fontWeight: 700,
          fontSize: '1.1rem',
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(80,60,40,0.10)'
        }}>
          View All Blogs
        </Link>
      </div>
    </section>
  );
}

// --- FeatureCard component ---
function FeatureCard({ icon, title, desc }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(80,60,40,0.06)', padding: '2rem 1.5rem', minWidth: 180, maxWidth: 220, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12
    }}>
      <img src={icon} alt={title} style={{ width: 48, height: 48, marginBottom: 10 }} />
      <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#8B2E2E', margin: 0 }}>{title}</h3>
      <p style={{ color: '#412a1f', fontSize: '1rem', margin: 0 }}>{desc}</p>
    </div>
  );
}

// --- TestimonialsCarousel (Swiper, responsive) ---
function TestimonialsCarousel() {
  return (
    <Swiper
      modules={[Pagination, A11y]}
      pagination={{ clickable: true }}
      spaceBetween={32}
      slidesPerView={1}
      breakpoints={{
        700: { slidesPerView: 2 },
      }}
      className="testimonials-carousel"
      style={{ maxWidth: 900, margin: "0 auto" }}
    >
      {testimonials.map((t, i) => (
        <SwiperSlide key={i}>
          <div style={{
            background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(80,60,40,0.08)', padding: '2.2rem 1.5rem', minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 8
          }}>
            <p style={{ fontSize: '1.15rem', color: '#412a1f', fontStyle: 'italic', marginBottom: 18, minHeight: 60 }}>
              "{t.text}"
            </p>
            <div style={{ fontWeight: 700, color: '#8B2E2E', fontSize: '1.1rem' }}>- {t.name}</div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

// --- BlogCarousel (Swiper, responsive) ---
// ...existing code...



// ...existing code...

export default function Home() {
  return (
    <div className="home-page" style={{ background: 'var(--bg-page, #FDF9EF)' }}>
      {/* 1. Carousel at the top */}
      <ImageCarousel />

      {/* 2. Hero Section */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '3rem 1rem 2rem 1rem', textAlign: 'center',
        background: 'linear-gradient(90deg, #fff7f0 0%, #f7ece6 100%)',
        borderRadius: 24, margin: '2rem auto', maxWidth: 900, boxShadow: '0 4px 32px rgba(80,60,40,0.07)'
      }}>
        <h1 style={{ fontFamily: 'Playfair Display', fontWeight: 800, fontSize: '2.7rem', color: '#8B2E2E', marginBottom: 12 }}>
          Discover Your Signature Scent
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#412a1f', maxWidth: 700, margin: '0 auto 1.5rem auto', fontWeight: 400 }}>
          Experience the transformative power of GALLE perfumes. Crafted with natural, safe, and cruelty-free ingredients for a new confident you.
        </p>
        <a href="/shop" style={{ background: '#8B2E2E', color: '#fff', padding: '0.9rem 2.2rem', borderRadius: 10, fontWeight: 700, fontSize: '1.15rem', textDecoration: 'none', boxShadow: '0 2px 8px rgba(80,60,40,0.10)' }}>Shop Now</a>
      </section>

      {/* 3. Features Grid */}
      <section style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', margin: '2.5rem 0' }}>
        <FeatureCard icon="natural-ingredients.svg" title="Natural Ingredients" desc="Only the purest, safest botanicals." />
        <FeatureCard icon="cruelty-free.svg" title="Cruelty-Free" desc="Never tested on animals." />
        <FeatureCard icon="non-carcinogenic.svg" title="Non-Carcinogenic" desc="No harmful chemicals or toxins." />
        <FeatureCard icon="paraben-free.svg" title="Paraben-Free" desc="Gentle and safe for all skin types." />
        <FeatureCard icon="silicone-free.svg" title="Silicone-Free" desc="Clean beauty, always." />
      </section>

      {/* 4. Bestsellers Section */}
      <section style={{ maxWidth: 1200, margin: '0 auto 3rem auto', padding: '0 1rem' }}>
        <h2 style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: '2rem', color: '#241B19', marginBottom: 24, textAlign: 'center' }}>
          Bestsellers
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
          <PerfumeCard title="GALLE WINSEN" img="https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_2a9069f2.jpg?updatedAt=1751363008436" />
          <PerfumeCard title="GALLE ADORE" img="https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_3ce2c1a8.jpg?updatedAt=1751363008373" />
          <PerfumeCard title="GALLE ENTICE" img="https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.27_955a0e06.jpg?updatedAt=1751363008393" />
          <PerfumeCard title="GALLE PIZZAZ" img="https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_ac278abd.jpg?updatedAt=1751363008376" />
        </div>
      </section>

      {/* 5. Blog Carousel */}
      <BlogCarousel />

      {/* 6. Testimonials Carousel */}
      <section style={{ background: '#fff7f0', padding: '3rem 0', borderRadius: 24, margin: '0 auto 3rem auto', maxWidth: 1100, boxShadow: '0 2px 16px rgba(80,60,40,0.07)' }}>
        <h2 style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: '2rem', color: '#8B2E2E', marginBottom: 24, textAlign: 'center' }}>
          What Our Customers Say
        </h2>
        <TestimonialsCarousel />
      </section>

      {/* 7. Call to Action */}
      <section style={{ textAlign: 'center', margin: '3rem 0 2rem 0' }}>
        <h2 style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: '2rem', color: '#241B19', marginBottom: 16 }}>
          Ready to find your new signature scent?
        </h2>
        <a href="/shop" style={{ background: '#8B2E2E', color: '#fff', padding: '1rem 2.5rem', borderRadius: 12, fontWeight: 700, fontSize: '1.2rem', textDecoration: 'none', boxShadow: '0 2px 8px rgba(80,60,40,0.10)' }}>Shop All Perfumes</a>
      </section>
    </div>
  );
}