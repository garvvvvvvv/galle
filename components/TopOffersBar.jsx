"use client";
import { useState, useEffect } from "react";
import "./topoffersbar.css";

const offers = [
  "Get a free T-Shirt on min. order of 999",
  "Free shipping on all orders above ₹499",
  "Buy 2 perfumes, get 1 mini free",
];

export default function TopOffersBar() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(i => (i + 1) % offers.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="top-offers-bar">
      <span>{offers[idx]}</span>
    </div>
  );
}
