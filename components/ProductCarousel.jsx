"use client";
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Thumbs, Zoom } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';

export default function ProductCarousel({ gallery }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [width, setWidth] = useState(1200);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth);
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const getMainHeight = () => {
    if (width < 700) return 320;
    if (width < 1100) return 420;
    return 520;
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 420,
        padding: 0,
        margin: 0,
      }}
    >
      <Swiper
        style={{
          width: '100%',
          height: getMainHeight(),
          borderRadius: 0,
          background: 'transparent',
          boxShadow: 'none',
        }}
        modules={[Pagination, Thumbs, Zoom]}
        pagination={{ clickable: true }}
        zoom
        thumbs={{ swiper: thumbsSwiper }}
        spaceBetween={10}
        slidesPerView={1}
        loop
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {gallery.map((img, idx) => (
          <SwiperSlide key={idx}>
            <div
              className="swiper-zoom-container"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                background: 'transparent',
                padding: width <= 700 ? 1 : 0,
                overflow: 'hidden'
              }}
            >
              <motion.img
                src={img}
                alt={`Product image ${idx + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  margin: 0,
                  borderRadius: 0,
                  background: 'transparent',
                  display: 'block',
                  padding: 0,
                  transition: 'transform 0.5s cubic-bezier(.4,0,.2,1)'
                }}
                whileHover={{ scale: 1.08, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300, damping: 12 }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        modules={[Thumbs]}
        spaceBetween={0}
        slidesPerView={Math.min(gallery.length, 5)}
        watchSlidesProgress
        style={{ marginTop: 10, width: '100%', height: 56, padding: 0 }}
      >
        {gallery.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              style={{
                width: 48,
                height: 48,
                objectFit: 'cover',
                borderRadius: 0,
                border: activeIndex === idx ? '2px solid #8B2E2E' : 'none',
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
