"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./ImageCarousel.module.css";

const imageKitUrls = [
  "https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_3ce2c1a8.jpg?updatedAt=1751363008373",
  "https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_2a9069f2.jpg?updatedAt=1751363008436",
  "https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_ac278abd.jpg?updatedAt=1751363008376",
  "https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.25_90a0ce52.jpg?updatedAt=1751363008372",
  "https://ik.imagekit.io/garvchaudhary/IMG-20250706-WA0073.jpg?updatedAt=1752499477109",
  "https://ik.imagekit.io/garvchaudhary/IMG-20250706-WA0074.jpg?updatedAt=1752499477046"
];

export default function ImageCarousel() {
  return (
    <div className={styles.carouselWrapper}>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 2000 }}
        loop={true}
        pagination={{ clickable: true }}
        navigation={true}
        slidesPerView={1}
        className="mySwiper"
      >
        {imageKitUrls.map((src, i) => (
          <SwiperSlide key={i}>
            <img
              src={src}
              alt={`Perfume ${i + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}


