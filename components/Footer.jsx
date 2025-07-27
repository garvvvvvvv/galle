"use client";
import Link from "next/link";
import { useState } from "react";
import { FaInstagram, FaFacebook, FaEnvelope } from "react-icons/fa";
import "./footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: Add actual subscribe logic
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="galle-footer">
      <div className="footer-main">
        {/* Section 1: Logo & Brand */}
        <div className="footer-section footer-logo-section">
          <img src="/galle-logo.svg" alt="GALLE Logo" className="footer-logo" />
          <div>
            <div className="footer-title">GALLE</div>
            <div className="footer-tagline">For a New Confident You</div>
          </div>
        </div>
        {/* Section 2: Get in Touch */}
        <div className="footer-section">
          <div className="footer-contact">Get in Touch</div>
          <div>Contact us:</div>
          <div className="footer-socials">
            <a href="https://instagram.com/galleperfumes" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://facebook.com/galleperfumes" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="mailto:hello@galleperfumes.com" aria-label="Email">
              <FaEnvelope />
            </a>
          </div>
        </div>
        {/* Section 3: Policies */}
        <div className="footer-section footer-policies">
          <div className="footer-contact">Our Policies</div>
          <a href="/shipping-policy">Shipping Policy</a>
          <a href="/return-policy">Return Policy</a>
          <a href="/privacy-policy">Privacy Policy</a>
        </div>
        {/* Section 4: Subscribe */}
        <div className="footer-section footer-subscribe">
          <div className="footer-contact">Subscribe to our newsletter</div>
          <div className="footer-subscribe-desc">
            Subscribe to get notified about product launches, special offers and company news.
          </div>
          <form className="footer-subscribe-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
          {subscribed && (
            <div style={{ color: "#A62639", fontWeight: 500, marginTop: "0.5rem" }}>
              Thank you for subscribing!
            </div>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} GALLE. All rights reserved.</span>
        <span>Made with ❤️ in India</span>
      </div>
    </footer>
  );
}
