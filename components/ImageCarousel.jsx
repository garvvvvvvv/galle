"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./ImageCarousel.module.css";
import React from "react";
import { motion } from "framer-motion";

const desktopImages = [
  "https://ik.imagekit.io/garvchaudhary/Untitled%20(1920%20x%20720%20px).png?updatedAt=1753594300719",
  "https://ik.imagekit.io/garvchaudhary/1.png?updatedAt=1753612536402",
  "https://ik.imagekit.io/garvchaudhary/2.png?updatedAt=1753612536461",
  "https://ik.imagekit.io/garvchaudhary/3.png?updatedAt=1753612536441",
  "https://ik.imagekit.io/garvchaudhary/4.png?updatedAt=1753612536521",
  "https://ik.imagekit.io/garvchaudhary/5.png?updatedAt=1753612536541"
];

const mobileImages = [
  "https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_3ce2c1a8.jpg?updatedAt=1751363008373",
  "https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_2a9069f2.jpg?updatedAt=1751363008436",
  "https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_ac278abd.jpg?updatedAt=1751363008376",
  "https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.25_90a0ce52.jpg?updatedAt=1751363008372",
  "https://ik.imagekit.io/garvchaudhary/IMG-20250706-WA0073.jpg?updatedAt=1752499477109",
  "https://ik.imagekit.io/garvchaudhary/IMG-20250706-WA0074.jpg?updatedAt=1752499477046"
];

function useMediaQuery(query) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

export default function ImageCarousel() {
  const isDesktop = useMediaQuery("(min-width: 900px)");
  const images = isDesktop ? desktopImages : mobileImages;

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
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <motion.img
              src={src}
              alt={`Perfume ${i + 1}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="zoom-on-hover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
