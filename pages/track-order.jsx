import React, { useState } from "react";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState(null);

  const handleSearch = () => {
    // Replace with actual API call
    setStatus("Order status will appear here.");
  };

  return (
    <div style={{
      maxWidth: 420,
      margin: "80px auto",
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 2px 12px rgba(80,60,40,0.09)",
      padding: "2.5rem 2rem",
      fontFamily: "Montserrat, Jost, Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 700,
        fontSize: "2rem",
        marginBottom: "1.2rem",
        color: "#241B19"
      }}>
        Track status of your shipment
      </h2>
      <label htmlFor="orderId" style={{ fontWeight: 600, fontSize: "1.08rem", color: "#8B2E2E" }}>Order ID</label>
      <input
        id="orderId"
        type="text"
        value={orderId}
        onChange={e => setOrderId(e.target.value)}
        placeholder="Enter Order ID to search"
        style={{
          width: "100%",
          padding: "0.7rem 1rem",
          margin: "0.7rem 0 1.2rem 0",
          borderRadius: 8,
          border: "1px solid #d2beab",
          fontSize: "1.08rem",
          fontFamily: "Montserrat, Jost, Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          background: "#A62639",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "0.7rem 1.5rem",
          fontWeight: 600,
          fontSize: "1.08rem",
          cursor: "pointer"
        }}
      >
        Search
      </button>
      {status && (
        <div style={{ marginTop: "2rem", color: "#241B19", fontWeight: 500 }}>
          {status}
        </div>
      )}
    </div>
  );
}
