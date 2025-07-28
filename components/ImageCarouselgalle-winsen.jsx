"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import styles from "./ImageCarousel.module.css";

export default function ImageCarouselGalleWinsen({ images }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  // Helper: get path for ImageKit (strip domain if present)
  const getIKPath = (src) => {
    if (!src) return '';
    const match = src.match(/imagekit\.io\/[^\/]+\/(.+)/);
    return match ? match[1] : src;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      {/* Thumbnails */}
      <div style={{ width: '80px', minWidth: '80px', height: '400px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
        <Swiper
          onSwiper={setThumbsSwiper}
          direction="vertical"
          spaceBetween={8}
          slidesPerView={Math.min(images.length, 5)}
          watchSlidesProgress
          style={{ width: '80px', height: '400px' }}
          modules={[Thumbs]}
        >
          {images.map((src, i) => (
            <SwiperSlide key={i}>
              <img
                src={src}
                alt={`Thumbnail ${i + 1}`}
                style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #eee', cursor: 'pointer', transition: 'transform 0.3s' }}
                onMouseOver={e => e.currentTarget.style.transform = "scale(1.07)"}
                onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Main Image */}
      <div style={{ width: '400px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '12px' }}>
        <Swiper
          modules={[Autoplay, Pagination, Navigation, Thumbs]}
          thumbs={{ swiper: thumbsSwiper }}
          autoplay={{ delay: 4000 }}
          loop={true}
          pagination={{ clickable: true }}
          navigation={true}
          slidesPerView={1}
          style={{ width: '100%', height: '100%' }}
        >
          {images.map((src, i) => (
            <SwiperSlide key={i}>
              {src ? (
                <img
                  src={src}
                  alt={`Perfume ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px', background: '#f8f8f8', transition: 'transform 0.4s' }}
                  width={400}
                  height={400}
                  onMouseOver={e => e.currentTarget.style.transform = "scale(1.06)"}
                  onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                />
              ) : (
                <img src={src} alt={`Perfume ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px', background: '#f8f8f8' }} width={400} height={400} />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}


