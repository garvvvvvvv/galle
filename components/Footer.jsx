"use client";
import Link from "next/link";
import { useState } from "react";
import "./footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: Add actual subscribe logic
    setSubscribed(true);
  };

  return (
    <footer className="galle-footer">
      <div className="footer-main">
        <div className="footer-logo-section">
          <img src="/galle-logo.svg" alt="GALLE Logo" className="footer-logo" />
          <div className="footer-brand">
            <span className="footer-title">GALLE</span>
            <span className="footer-tagline">For a New Confident You</span>
          </div>
        </div>
        <form className="footer-subscribe" onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="Subscribe for updates"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={subscribed}
          />
          <button type="submit" disabled={subscribed}>
            {subscribed ? "Subscribed!" : "Subscribe"}
          </button>
        </form>
        <div className="footer-links">
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/account">My Account</Link>
        </div>
        <div className="footer-socials">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <img src="/instagram.svg" alt="Instagram" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <img src="/facebook.svg" alt="Facebook" />
          </a>
          <a href="mailto:info@galle.com" aria-label="Email">
            <img src="/email.svg" alt="Email" />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} GALLE. All rights reserved.</span>
        <span>
          <Link href="/privacy">Privacy Policy</Link> | <Link href="/terms">Terms</Link>
        </span>
      </div>
    </footer>
  );
}
