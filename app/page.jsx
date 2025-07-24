"use client";
import ImageKitImage from "@/components/ImageKitImage";
import React from "react";
import './globals.css'
import Navbar from "@/components/navbar";
import ImageCarousel from "@/components/ImageCarousel";
import PerfumeCard from "@/components/perfumecard";
export default function Home() {
  return (
    <>
    <div className="home-page">
    
      <ImageCarousel />
      <div className="reliability-icons">
        <img src="natural-ingredients.svg" alt="natural-ingredients" className="reliability-images" />
        <img src="cruelty-free.svg" alt="cruelty-free" className="reliability-images" />
        <img src="non-carcinogenic.svg" alt="non-carcinogenic" className="reliability-images" />
        <img src="paraben-free.svg" alt="paraben-free" className="reliability-images" />
        <img src="silicone-free.svg" alt="silicone-free" className="reliability-images" />
      </div>

      <div className="description">
        <h1 className="description-heading">
          GALLE - FOR A NEW CONFIDENT YOU
        </h1>
        <h3 className="description-text">
          <br/>
          Experience the transformative power of our products and embrace a new level of confidence. 

          At GALLE, we are committed to providing you with high-quality, natural, and safe solutions for your personal care needs. 
          Our products are crafted with carefully selected ingredients, ensuring they are free from harmful chemicals such as parabens and silicones. 
          We believe in cruelty-free practices and prioritize your well-being by offering non-carcinogenic formulas. 
        </h3>
      </div>
      <div className="perfume-cards">
        <PerfumeCard title="GALLE WINSEN" img="https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_2a9069f2.jpg?updatedAt=1751363008436"/>
        <PerfumeCard title="GALLE ADORE" img="https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_3ce2c1a8.jpg?updatedAt=1751363008373"/>
        <PerfumeCard title="GALLE ENTICE" img="https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.27_955a0e06.jpg?updatedAt=1751363008393"/>
        <PerfumeCard title="GALLE PIZZAZ" img="https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_ac278abd.jpg?updatedAt=1751363008376"/>
        <PerfumeCard title="DAY DREAM" img="https://ik.imagekit.io/garvchaudhary/IMG-20250706-WA0073.jpg?updatedAt=1752499477109"/>
        <PerfumeCard title="WHITE OUD" img="https://ik.imagekit.io/garvchaudhary/IMG-20250706-WA0074.jpg?updatedAt=1752499477046"/>
      </div>
      </div>
    </>
  );
}
