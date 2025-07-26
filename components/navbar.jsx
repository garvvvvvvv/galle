"use client";
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import './navbar.css';
import { FaShoppingCart, FaSearch, FaBars } from 'react-icons/fa';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartContext';

const perfumes = [
  { id: 1, title: "Amber Oud", desc: "Warm, woody, and luxurious.", image: "/amber-oud.jpg" },
  { id: 2, title: "Rose Elixir", desc: "Floral and romantic.", image: "/rose-elixir.jpg" },
  { id: 3, title: "Citrus Zest", desc: "Fresh and energizing.", image: "/citrus-zest.jpg" },
  { id: 4, title: "Vanilla Spice", desc: "Sweet and spicy.", image: "/vanilla-spice.jpg" },
  // ...existing code...
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const router = useRouter();
  const { cart } = useCart();
  const cartCount = cart?.reduce((sum, item) => sum + (item.quantity || 1), 0);

  React.useEffect(() => {
    let ignore = false;
    const getUser = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      if (!ignore) {
        setUser(data?.user || null);
        setLoading(false);
      }
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange(() => getUser());
    return () => {
      ignore = true;
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLinkClick = () => setOpen(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAccountOpen(false);
    router.refresh?.();
  };

  // Search logic (fix: only search perfume titles)
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    // Only match perfume titles
    const matches = perfumes.filter(p =>
      p.title.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(matches);
    setShowSuggestions(true);
  };

  const handleSearchFocus = () => {
    setSearchActive(true);
    setShowSuggestions(searchValue.trim() !== '');
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      setSearchActive(false);
    }, 200);
  };

  const handleSearchButtonClick = () => {
    setSearchActive(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleSuggestionClick = (perfume) => {
    router.push(`/shop?search=${encodeURIComponent(perfume.title)}`);
    setSearchValue('');
    setShowSuggestions(false);
    setSearchActive(false);
  };

  // Responsive: show mobile nav
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hamburger menu close on any button click (mobile)
  const handleMobileMenuClick = () => setOpen(false);

  return (
    <>
      {/* Offers strip */}
      <div className="offers-strip">
        <span>🔥 Summer Sale: Up to 40% off on select perfumes! Free shipping over ₹999.</span>
      </div>
      <nav className='navbar-outer'>
        {/* Desktop/Tablet */}
        <div className="navbar-top-row">
          <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <img src='/galle-logo.svg' alt='Galle Logo' width={54} height={54} style={{ minWidth: 44, minHeight: 44 }} />
          </Link>
          <div className="navbar-brand">
            <span className="navbar-title">GALLE</span>
            <span className="navbar-tagline">For a new confident you</span>
          </div>
          <div className="navbar-actions">
            <div style={{ position: 'relative' }}>
              {user ? (
                <>
                  <button
                    className="account-navbar-btn"
                    onClick={() => setAccountOpen(v => !v)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#241B19',
                      fontWeight: 600,
                      fontSize: '1.13rem',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    MY ACCOUNT
                  </button>
                  {accountOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '2.5rem',
                        right: 0,
                        background: '#fff',
                        border: '1px solid #eee',
                        borderRadius: 8,
                        boxShadow: '0 4px 16px rgba(80,60,40,0.10)',
                        zIndex: 100,
                        minWidth: 260,
                        padding: 18
                      }}
                    >
                      {loading ? (
                        <div>Loading...</div>
                      ) : (
                        <div>
                          <div style={{ marginBottom: 8, fontWeight: 600 }}>
                            {user.user_metadata?.first_name || ''} {user.user_metadata?.last_name || ''}
                          </div>
                          <div style={{ fontSize: '0.95rem', color: '#8B2E2E', marginBottom: 8 }}>
                            {user.email}
                          </div>
                          <Link href="/account" onClick={() => setAccountOpen(false)} style={{ display: 'block', marginBottom: 10, color: '#241B19', textDecoration: 'underline' }}>
                            Account Details
                          </Link>
                          <button
                            onClick={handleSignOut}
                            style={{
                              background: '#8B2E2E',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 6,
                              padding: '8px 16px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <button
                  className="account-navbar-btn"
                  onClick={() => { router.push('/account'); setOpen(false); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#241B19',
                    fontWeight: 600,
                    fontSize: '1.13rem',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  SIGN IN
                </button>
              )}
            </div>
            <Link href='/checkout' className='cart-navbar-btn desktop-cart-btn' aria-label='Go to Cart' style={{ display: 'flex', alignItems: 'center', color: '#241B19', fontSize: '2.2rem', marginLeft: '16px', height: 48, position: 'relative' }}>
              <FaShoppingCart />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -6,
                  right: -10,
                  background: '#A62639',
                  color: '#fff',
                  borderRadius: '50%',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  minWidth: 22,
                  height: 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(80,60,40,0.10)'
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
        <div className="navbar-links-row">
          <ul className="nav-links">
            <li><Link href='/' onClick={handleLinkClick}>HOME</Link></li>
            <li><Link href='/shop' onClick={handleLinkClick}>SHOP</Link></li>
            <li><Link href='/about' onClick={handleLinkClick}>ABOUT</Link></li>
            <li><Link href='/contact' onClick={handleLinkClick}>CONTACT US</Link></li>
          </ul>
          <div className="search-bar-container">
            {!searchActive ? (
              <button className="search-btn" aria-label="Search" onClick={handleSearchButtonClick}>
                <FaSearch size={22} />
              </button>
            ) : (
              <div className="search-bar-expanded" style={{ position: 'relative' }}>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchValue}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  placeholder="Search perfumes..."
                  style={{
                    border: '1px solid #d2beab',
                    borderRadius: 8,
                    padding: '0.5rem 1.2rem',
                    fontSize: '1.08rem',
                    minWidth: 240,
                    background: '#fff'
                  }}
                />
                <button className="search-btn" aria-label="Close" onClick={() => { setSearchActive(false); setSearchValue(''); setShowSuggestions(false); }} style={{ marginLeft: 8 }}>
                  ✕
                </button>
                {showSuggestions && (
                  <div className="search-suggestions-dropdown">
                    {suggestions.length > 0 ? (
                      suggestions.map(perfume => (
                        <div
                          key={perfume.id}
                          className="search-suggestion"
                          onMouseDown={() => handleSuggestionClick(perfume)}
                        >
                          <img src={perfume.image} alt={perfume.title} style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: 600 }}>{perfume.title}</div>
                            <div style={{ fontSize: '0.95rem', color: '#8B2E2E' }}>{perfume.desc}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '1rem', textAlign: 'center', color: '#8B2E2E' }}>
                        No matches found.<br />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                          {perfumes.map(perfume => (
                            <div key={perfume.id} className="perfume-card"
                              onMouseDown={() => handleSuggestionClick(perfume)}
                            >
                              <img src={perfume.image} alt={perfume.title} />
                              <div className="title">{perfume.title}</div>
                              <div className="desc">{perfume.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Mobile */}
        <div className="navbar-mobile-row">
          <div className="mobile-logo">
            <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <img src='/galle-logo.svg' alt='Galle Logo' width={38} height={38} style={{ minWidth: 32, minHeight: 32 }} />
            </Link>
          </div>
          <div className="mobile-center">
            <span className="navbar-title">GALLE</span>
            <span className="navbar-tagline">For a New Confident You</span>
          </div>
          <div className="mobile-actions">
            <button className="search-btn" aria-label="Search" onClick={handleSearchButtonClick}>
              <FaSearch size={22} />
            </button>
            <button className="hamburger" aria-label="Menu" onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <FaBars size={28} />
            </button>
          </div>
        </div>
        {/* Mobile search expanded */}
        {isMobile && searchActive && (
          <div style={{ width: '100%', background: '#ffeedc', padding: '0.7rem 1rem', position: 'relative', zIndex: 1200 }}>
            <div className="search-bar-expanded" style={{ position: 'relative', width: '100%' }}>
              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                placeholder="Search perfumes..."
                style={{
                  border: '1px solid #d2beab',
                  borderRadius: 8,
                  padding: '0.5rem 1.2rem',
                  fontSize: '1.08rem',
                  width: '100%',
                  background: '#fff'
                }}
              />
              <button className="search-btn" aria-label="Close" onClick={() => { setSearchActive(false); setSearchValue(''); setShowSuggestions(false); }} style={{ marginLeft: 8 }}>
                ✕
              </button>
              {showSuggestions && (
                <div className="search-suggestions-dropdown" style={{ position: 'absolute', top: '2.5rem', left: 0, width: '100%', background: '#fff', border: '1px solid #d2beab', borderRadius: 8, boxShadow: '0 4px 16px rgba(80,60,40,0.10)', zIndex: 200, padding: '0.5rem 0', maxHeight: 320, overflowY: 'auto' }}>
                  {suggestions.length > 0 ? (
                    suggestions.map(perfume => (
                      <div
                        key={perfume.id}
                        className="search-suggestion"
                        style={{ padding: '0.7rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #f3e5d7' }}
                        onMouseDown={() => handleSuggestionClick(perfume)}
                      >
                        <img src={perfume.image} alt={perfume.title} style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{perfume.title}</div>
                          <div style={{ fontSize: '0.95rem', color: '#8B2E2E' }}>{perfume.desc}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '1rem', textAlign: 'center', color: '#8B2E2E' }}>
                      No matches found.<br />
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                        {perfumes.map(perfume => (
                          <div key={perfume.id} className="perfume-card"
                            onMouseDown={() => handleSuggestionClick(perfume)}
                            style={{ width: 120, background: '#f7ece6', borderRadius: 10, padding: '0.7rem', boxShadow: '0 2px 8px rgba(80,60,40,0.07)', cursor: 'pointer', margin: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                          >
                            <img src={perfume.image} alt={perfume.title} style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 8 }} />
                            <div className="title" style={{ fontWeight: 600, marginTop: 6 }}>{perfume.title}</div>
                            <div className="desc" style={{ fontSize: '0.9rem', color: '#8B2E2E' }}>{perfume.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Mobile nav menu */}
        {isMobile && open && (
          <div className="mobile-nav-menu">
            <ul className="nav-links">
              <li><Link href='/' onClick={handleMobileMenuClick}>HOME</Link></li>
              <li><Link href='/shop' onClick={handleMobileMenuClick}>SHOP</Link></li>
              <li><Link href='/about' onClick={handleMobileMenuClick}>ABOUT</Link></li>
              <li><Link href='/contact' onClick={handleMobileMenuClick}>CONTACT US</Link></li>
              <li>
                {user ? (
                  <button className="account-navbar-btn" onClick={() => { router.push('/account'); handleMobileMenuClick(); }}>MY ACCOUNT</button>
                ) : (
                  <button className="account-navbar-btn" onClick={() => { router.push('/account'); handleMobileMenuClick(); }}>SIGN IN</button>
                )}
              </li>
              <li>
                <Link href='/checkout' className='cart-navbar-btn' aria-label='Go to Cart' style={{ position: 'relative' }} onClick={handleMobileMenuClick}>
                  <FaShoppingCart />
                  {cartCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: -6,
                      right: -10,
                      background: '#A62639',
                      color: '#fff',
                      borderRadius: '50%',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      minWidth: 22,
                      height: 22,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(80,60,40,0.10)'
                    }}>
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar
