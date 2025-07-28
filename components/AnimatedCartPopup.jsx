import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const AnimatedCartPopup = ({ product, quantity, onClose }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        background: "#241B19",
        color: "#fff",
        borderRadius: 12,
        padding: "18px 32px",
        fontWeight: 600,
        fontSize: "1.08rem",
        boxShadow: "0 2px 16px rgba(0,0,0,0.13)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
      onClick={onClose}
    >
      <img
        src={product.image}
        alt={product.title}
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          objectFit: "cover",
          marginRight: 12,
        }}
      />
      <span>
        <strong>{product.title}</strong> added to cart! &nbsp;
        <span style={{ color: "#ffe5e5" }}>({quantity})</span>
      </span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          fontWeight: 700,
          fontSize: "1.2rem",
          marginLeft: 18,
          cursor: "pointer",
        }}
        aria-label="Close"
      >
        ×
      </button>
    </motion.div>
  </AnimatePresence>
);

export default AnimatedCartPopup;
