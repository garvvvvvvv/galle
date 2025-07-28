"use client";
import React, { useState, Suspense } from "react";
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
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { SpotlightButton } from "@/components/SpotlightButton";

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
        fontFamily: "'Playfair Display', serif",
        fontWeight: 700,
        fontSize: '2rem',
        color: '#8B2E2E',
        marginBottom: 24,
        textAlign: 'center'
      }}>
        From Our Blog
      </h2>
      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={32}
        slidesPerView={1}
        breakpoints={{
          700: { slidesPerView: 2 },
          1100: { slidesPerView: 3 },
        }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        style={{ maxWidth: 1100, margin: "0 auto" }}
      >
        {blogPosts.map((post, i) => (
          <SwiperSlide key={i}>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
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
                    borderBottom: '1px solid #f7ece6',
                    transition: 'transform 0.35s cubic-bezier(.4,0,.2,1)'
                  }}
                  className="zoom-on-hover"
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
            </motion.div>
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
      modules={[Pagination, A11y, Autoplay]}
      pagination={{ clickable: true }}
      spaceBetween={32}
      slidesPerView={1}
      breakpoints={{
        700: { slidesPerView: 2 },
      }}
      autoplay={{ delay: 2000, disableOnInteraction: false }}
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

// --- FeatureCardSlider (Swiper horizontal slider) ---


function FeatureCardSlider() {
  const features = [
    {
      icon: "natural-ingredients.svg",
      title: "Natural Ingredients",
      desc: "Only the purest, safest botanicals."
    },
    {
      icon: "ifra.svg",
      title: "IFRA Certified",
      desc: "Meets the highest safety standards."
    },
    {
      icon: "cruelty-free.svg",
      title: "Cruelty-Free",
      desc: "Never tested on animals."
    },
    {
      icon: "non-carcinogenic.svg",
      title: "Non-Carcinogenic",
      desc: "No harmful chemicals or toxins."
    },
    {
      icon: "paraben-free.svg",
      title: "Paraben-Free",
      desc: "Gentle and safe for all skin types."
    },
  ];

  return (
    <section
      style={{
        maxWidth: 1400,
        margin: "0 auto 3rem auto",
        padding: "0 1rem"
      }}
    >
      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: "2rem",
          color: "#241B19",
          marginBottom: 24,
          textAlign: "center"
        }}
      >
        Why Choose Us
      </h2>

      <div
        className="feature-slider"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
        }}
      >
        {features.map((f, i) => (
          <div
            key={i}
            className="feature-card"
            style={{
              background: "#fff7f0",
              borderRadius: 16,
              boxShadow: "0 2px 12px rgba(80,60,40,0.07)",
              padding: "2rem 1.5rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 220,
              scrollSnapAlign: "start"
            }}
          >
            <img
              src={f.icon}
              alt={f.title}
              style={{ width: 48, height: 48, marginBottom: 10, color: "#8B2E2E", backgroundColor: "#fff" }}
            />
            <h3
              style={{
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#8B2E2E",
                margin: 0
              }}
            >
              {f.title}
            </h3>
            <p
              style={{
                color: "#412a1f",
                fontSize: "1rem",
                margin: 0,
                marginTop: 8
              }}
            >
              {f.desc}
            </p>
          </div>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .feature-slider {
            display: flex !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 8px;
          }

          .feature-card {
            flex: 0 0 auto;
          }
        }
      `}</style>
    </section>
  );
}




// --- BlogPageSideContent (for blog page left/right white space) ---
function BlogPageSideContent() {
  return (
    <div style={{
      background: '#fff7f0',
      borderRadius: 18,
      boxShadow: '0 2px 12px rgba(80,60,40,0.07)',
      padding: '2rem 1.2rem',
      minWidth: 220,
      maxWidth: 260,
      margin: '0 1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 18
    }}>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="loading-fill-text">GALLE</div>}>
      <div className="home-page">
        {/* 1. Carousel at the top */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <ImageCarousel />
        </motion.div>

        {/* 2. Hero Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '3rem 1rem 2rem 1rem', textAlign: 'center',
            background: 'linear-gradient(90deg, #fff7f0 0%, #f7ece6 100%)',
            borderRadius: 24, margin: '2rem auto', maxWidth: 900, boxShadow: '0 4px 32px rgba(80,60,40,0.07)'
          }}
        >
          <h1 style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: '2.7rem', color: '#8B2E2E', marginBottom: 12 }}>
            Discover Your Signature Scent
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#412a1f', maxWidth: 700, margin: '0 auto 1.5rem auto', fontWeight: 400 }}>
            Experience the transformative power of GALLE perfumes. Crafted with natural, safe, and cruelty-free ingredients for a new confident you.
          </p>
          <SpotlightButton
            as="a"
            href="/shop"
            style={{
              background: '#8B2E2E',
              color: '#fff',
              padding: '0.9rem 2.2rem',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '1.15rem',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(80,60,40,0.10)'
            }}
          >
            Shop Now
          </SpotlightButton>
        </motion.section>

        {/* 3. Features Grid (now horizontal slider) */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ maxWidth: 1200, margin: '2.5rem auto', padding: '0 1rem' }}
        >
          <FeatureCardSlider />
        </motion.section>

        {/* 4. Bestsellers Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ maxWidth: 1200, margin: '0 auto 3rem auto', padding: '0 1rem' }}
        >
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '2rem', color: '#241B19', marginBottom: 24, textAlign: 'center' }}>
            Bestsellers
          </h2>
          <div
            className="bestseller-slider"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 32,
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              paddingBottom: 8
            }}
          >
            <PerfumeCard title="GALLE WINSEN" img="https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_2a9069f2.jpg?updatedAt=1751363008436" />
            <PerfumeCard title="GALLE ADORE" img="https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_3ce2c1a8.jpg?updatedAt=1751363008373" />
            <PerfumeCard title="GALLE ENTICE" img="https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.27_955a0e06.jpg?updatedAt=1751363008393" />
            <PerfumeCard title="GALLE PIZZAZ" img="https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_ac278abd.jpg?updatedAt=1751363008376" />
          </div>
        </motion.section>

        {/* 5. Blog Carousel with side content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ display: 'flex', justifyContent: 'center', gap: 24, maxWidth: 1400, margin: '0 auto' }}
        >
          {/* <BlogPageSideContent /> */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <BlogCarousel />
          </div>
          {/* <BlogPageSideContent /> */}
        </motion.div>

        {/* 6. Testimonials Carousel */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ background: '#fff7f0', padding: '3rem 0', borderRadius: 24, margin: '0 auto 3rem auto', maxWidth: 1100, boxShadow: '0 2px 16px rgba(80,60,40,0.07)' }}
        >
          <h2 style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: '2rem', color: '#8B2E2E', marginBottom: 24, textAlign: 'center' }}>
            What Our Customers Say
          </h2>
          <TestimonialsCarousel />
        </motion.section>

        {/* 7. Call to Action */}
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ textAlign: 'center', margin: '3rem 0 2rem 0' }}
        >
          <h2 style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: '2rem', color: '#241B19', marginBottom: 16 }}>
            Ready to find your new signature scent?
          </h2>
          <SpotlightButton
            as="a"
            href="/shop"
            style={{
              background: '#8B2E2E',
              color: '#fff',
              padding: '1rem 2.5rem',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '1.2rem',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(80,60,40,0.10)'
            }}
          >
            Shop All Perfumes
          </SpotlightButton>
        </motion.section>
      </div>
    </Suspense>
  );
}


      // <h3 style={{ fontFamily: 'Playfair Display', fontWeight: 700, color: '#8B2E2E', fontSize: '1.1rem' }}>GALLE Tips</h3>
      // <ul style={{ padding: 0, margin: 0, listStyle: 'none', fontSize: '1rem', color: '#412a1f', fontWeight: 400 }}>
      //   <li>🌸 How to make your perfume last longer</li>
      //   <li>💧 Store fragrances away from sunlight</li>
      //   <li>🎁 Gift ideas for every occasion</li>
      //   <li>🧴 Layer scents for a unique blend</li>
      // </ul>
      // <Link href="/shop" style={{ background: '#8B2E2E', color: '#fff', borderRadius: 8, padding: '0.7rem 1.2rem', fontWeight: 600, textDecoration: 'none', marginTop: 12 }}>Shop Now</Link>