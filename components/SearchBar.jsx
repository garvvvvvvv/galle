"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import products from "@/data/product";

export default function SearchBar({ mobile }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Only search perfume titles, not notes
  const suggestions = products.filter(
    p => p.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    const found = products.find(
      p => p.title.toLowerCase().includes(query.toLowerCase())
    );
    if (found) {
      router.push(`/shop/${found.slug}`);
    } else {
      alert("No perfume found!");
    }
  };

  return (
    <form className={`search-bar${mobile ? " mobile" : ""}`} onSubmit={handleSearch} style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder="Search perfumes..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="search-input"
        autoComplete="off"
      />
      <button type="submit" className="search-btn" aria-label="Search">
        <img src="/search-icon.svg" alt="Search" style={{ width: 22, height: 22 }} />
      </button>
      {query && (
        <div style={{
          position: 'absolute',
          top: '2.5rem',
          left: 0,
          width: '100%',
          background: '#fff',
          border: '1px solid #d2beab',
          borderRadius: 8,
          boxShadow: '0 4px 16px rgba(80,60,40,0.10)',
          zIndex: 200,
          padding: '0.5rem 0',
          maxHeight: 320,
          overflowY: 'auto'
        }}>
          {suggestions.length > 0 ? (
            suggestions.map(p => (
              <div
                key={p.slug}
                style={{ padding: '0.7rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #f3e5d7' }}
                onMouseDown={() => router.push(`/shop/${p.slug}`)}
              >
                <img src={p.image} alt={p.title} style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{p.title}</div>
                  <div style={{ fontSize: '0.95rem', color: '#8B2E2E' }}>{p.description}</div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '1rem', textAlign: 'center', color: '#8B2E2E' }}>
              No matches found.
            </div>
          )}
        </div>
      )}
    </form>
  );
}
