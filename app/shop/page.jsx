import React from 'react';
import PerfumeCard from "@/components/perfumecard";
import PerfumeCard2 from '@/components/perfumecardforshop';
import ReviewSection from '@/components/ReviewSection';
import Testimonials from '@/components/Testimonials';
import './shop.css';
import Link from 'next/link';
const Shop = () => {
  return (<>
    <div className='shop-page'>
      <div className="shop-page-heading">
        <h2 className='discover-your-new'>Discover your new</h2>
        <h1 className='signature-scent'>Signature Scent</h1>
      </div>

      <div className='shop-line'></div>
      <div className="perfume-shop-cards">
        <PerfumeCard2
          title="GALLE WINSEN"
          readMoreLink="/shop/galle-winsen"
          addToCartLink="/cart?add=galle-winsen"
          img="https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_2a9069f2.jpg?updatedAt=1751363008436"
          description="A sophisticated blend for the modern individual."
          price={399}
          size="30ml"
          notes={{ top: "Bergamot, Lemon", middle: "Jasmine, Rose", base: "Musk, Amber" }}
        />
        <PerfumeCard2
          title="GALLE ADORE"
          readMoreLink="/shop/galle-adore"
          addToCartLink="/cart?add=galle-adore"
          img="https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_3ce2c1a8.jpg?updatedAt=1751363008373"
          description="A romantic floral scent with a touch of mystery."
          price={399}
          size="30ml"
          notes={{ top: "Peach, Pear", middle: "Rose, Peony", base: "Cedarwood, Vanilla" }}
        />
        <PerfumeCard2
          title="GALLE ENTICE"
          readMoreLink="/shop/galle-entice"
          addToCartLink="/cart?add=galle-entice"
          img="https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.27_955a0e06.jpg?updatedAt=1751363008393"
          description="An alluring fragrance for unforgettable moments."
          price={399}
          size="30ml"
          notes={{ top: "Mandarin, Blackcurrant", middle: "Iris, Violet", base: "Patchouli, Tonka Bean" }}
        />
        <PerfumeCard2
          title="GALLE PIZZAZ"
          readMoreLink="/shop/galle-pizzaz"
          addToCartLink="/cart?add=galle-pizzaz"
          img="https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_ac278abd.jpg?updatedAt=1751363008376"
          description="Vibrant and energetic, perfect for daily wear."
          price={399}
          size="30ml"
          notes={{ top: "Mint, Coriander", middle: "Lavender, Rose", base: "Amber, Musk" }}
        />
        <PerfumeCard2
          title="DAY DREAM"
          readMoreLink="/shop/day-dream"
          addToCartLink="/cart?add=day-dream"
          img="https://ik.imagekit.io/garvchaudhary/IMG-20250706-WA0073.jpg?updatedAt=1752499477109"
          description="A dreamy floral blend perfect for daytime elegance."
          price={399}
          size="30ml"
          notes={{ top: "Jasmine", middle: "Peony", base: "Sandalwood" }}
        />
        <PerfumeCard2
          title="WHITE OUD"
          readMoreLink="/shop/white-oud"
          addToCartLink="/cart?add=white-oud"
          img="https://ik.imagekit.io/garvchaudhary/IMG-20250706-WA0074.jpg?updatedAt=1752499477046"
          description="An exotic and rich oud experience with subtle spice."
          price={399}
          size="30ml"
          notes={{ top: "Rose", middle: "Oud", base: "Amber" }}
        />
      </div>
    </div>
  </>
  );
}

export default Shop
