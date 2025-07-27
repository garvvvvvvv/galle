"use client";
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import './navbar.css';
import { FaShoppingCart, FaSearch, FaBars } from 'react-icons/fa';
import { supabase } from '@/utils/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/components/CartContext';
import { IoMdSearch } from "react-icons/io";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { GoPerson } from "react-icons/go";
import products from '@/data/product';

// Use products from your actual product data
const perfumes = products.map((p, idx) => ({
  id: idx + 1,
  title: p.title,
  desc: p.description,
  image: p.image,
  slug: p.slug
}));

const slugify = (title) => title.toLowerCase().replace(/\s+/g, "-");

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
  const pathname = usePathname();
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

  // Hamburger menu close on any button click (mobile)
  const handleMobileMenuClick = () => setOpen(false);

  // Search logic (show only perfume products, not notes)
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    // Only match by perfume title (not notes or description)
    const matches = perfumes.filter(p =>
      p.title.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(matches);
    setShowSuggestions(matches.length > 0);
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
    router.push(`/shop/${perfume.slug}`);
    setSearchValue('');
    setShowSuggestions(false);
    setSearchActive(false);
  };

  return (
    <>
      <nav
        className='navbar-outer'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          zIndex: 1201,
          boxShadow: '0 2px 12px rgba(80,60,40,0.07)',
          background: '#ffeedc',
          // Remove height here, use CSS for responsive height
        }}
      >
        {/* Desktop/tablet */}
        <div className="navbar-single-row">
          <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <img src='/GALLE-WRITTENLOGO.png' alt='Galle Logo' width={160} height={34} />
          </Link>
          <ul className="nav-links" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '2.5rem', margin: 0 }}>
            <li><Link href='/' onClick={handleLinkClick}>HOME</Link></li>
            <li><Link href='/shop' onClick={handleLinkClick}>SHOP</Link></li>
            <li><Link href='/about' onClick={handleLinkClick}>ABOUT</Link></li>
            <li><Link href='/contact' onClick={handleLinkClick}>CONTACT US</Link></li>
            <li><Link href='/track-order' onClick={handleMobileMenuClick}>TRACK MY ORDER</Link></li>
          </ul>
          <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div className="search-bar-container">
              {!searchActive ? (
                <button className="search-btn" aria-label="Search" onClick={handleSearchButtonClick} style={{ color: '#241B19', background: 'none', border: 'none', padding: 0 }}>
                  <IoMdSearch style={{ width: 27, height: 27, color: '#241B19', strokeWidth: 1, marginTop: '4px' }} />
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
                  <button className="search-btn" aria-label="Close" onClick={() => { setSearchActive(false); setSearchValue(''); setShowSuggestions(false); }} style={{ marginLeft: 8, color: '#241B19', background: 'none', border: 'none' }}>
                    ✕
                  </button>
                  {showSuggestions && (
                    <div className="search-suggestions-dropdown">
                      {suggestions.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'flex-start', padding: '0.5rem' }}>
                          {suggestions.map(perfume => (
                            <Link
                              href={`/shop/${perfume.slug}`}
                              key={perfume.slug}
                              className="perfume-card"
                              style={{
                                width: 140,
                                background: '#f7ece6',
                                borderRadius: 10,
                                padding: '0.7rem',
                                boxShadow: '0 2px 8px rgba(80,60,40,0.07)',
                                cursor: 'pointer',
                                margin: '0.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textDecoration: 'none'
                              }}
                              onClick={() => {
                                setSearchValue('');
                                setShowSuggestions(false);
                                setSearchActive(false);
                              }}
                            >
                              <img src={perfume.image} alt={perfume.title} style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 8 }} />
                              <div className="title" style={{ fontWeight: 600, marginTop: 6 }}>{perfume.title}</div>
                              <div className="desc" style={{ fontSize: '0.9rem', color: '#8B2E2E' }}>{perfume.desc}</div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div style={{ padding: '1rem', textAlign: 'center', color: '#8B2E2E' }}>
                          No matches found.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
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
                padding: 0,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <GoPerson style={{ width: 28, height: 28, color: '#241B19' }} />
            </button>
            <Link href='/checkout' className='cart-navbar-btn desktop-cart-btn' aria-label='Go to Cart' style={{
              display: 'flex',
              alignItems: 'center',
              height: 48,
              position: 'relative',
              color: '#241B19',
              zIndex: 2 // ensure cart icon is above hamburger
            }}>
              <LiaShoppingBagSolid style={{ width: 28, height: 28, color: '#241B19' }} />
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
            {/* Hamburger hidden on desktop */}
            <button className="hamburger" aria-label="Menu" onClick={() => setOpen(!open)} style={{
              display: 'none'
            }}>
              <FaBars size={28} color="#241B19" />
            </button>
          </div>
        </div>
        {/* Mobile */}
        <div className="navbar-mobile-row">
          <div className="mobile-logo">
            <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <img src='/GALLE-WRITTENLOGO.png' alt='Galle Logo' width={134} height={34} />
            </Link>
          </div>
          <div className="mobile-actions" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            position: 'relative'
          }}>
            <button className="search-btn" aria-label="Search" onClick={handleSearchButtonClick} style={{ color: '#241B19', background: 'none', border: 'none', padding: 0 }}>
              <IoMdSearch style={{ width: 28, height: 28, color: '#241B19', strokeWidth: 1 }} />
            </button>
            <Link href='/checkout' className='cart-navbar-btn' aria-label='Go to Cart' style={{
              position: 'relative',
              color: '#241B19',
              zIndex: 2
            }}>
              <LiaShoppingBagSolid style={{ width: 28, height: 28, color: '#241B19', strokeWidth: 0.1 }} />
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
            <button className="hamburger" aria-label="Menu" onClick={() => setOpen(!open)} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              position: 'static', // not absolute
              marginLeft: '0.5rem',
              zIndex: 2
            }}>
              <FaBars size={28} color="#241B19" />
            </button>
          </div>
        </div>
        {/* Mobile nav menu */}
        {open && (
          <div className="mobile-nav-menu">
            <ul className="nav-links">
              <li><Link href='/' onClick={handleMobileMenuClick}>HOME</Link></li>
              <li><Link href='/shop' onClick={handleMobileMenuClick}>SHOP</Link></li>
              <li><Link href='/about' onClick={handleMobileMenuClick}>ABOUT</Link></li>
              <li><Link href='/contact' onClick={handleMobileMenuClick}>CONTACT US</Link></li>
              <li><Link href='/track-order' onClick={handleMobileMenuClick}>TRACK MY ORDER</Link></li>
              <li>
                <button className="account-navbar-btn" onClick={() => { router.push('/account'); handleMobileMenuClick(); }} style={{ background: 'transparent', border: 'none', padding: 0, textAlign: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GoPerson style={{ width: 28, height: 28, color: '#241B19', background: 'transparent' }} /><span>MY ACCOUNT</span>
                </button>
              </li>
            </ul>
          </div>
        )}
        {/* Mobile search expanded */}
        {searchActive && (
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
              <button className="search-btn" aria-label="Close" onClick={() => { setSearchActive(false); setSearchValue(''); setShowSuggestions(false); }} style={{ marginLeft: 8, color: '#241B19', background: 'none', border: 'none' }}>
                ✕
              </button>
              {showSuggestions && (
                <div className="search-suggestions-dropdown" style={{ position: 'absolute', top: '2.5rem', left: 0, width: '100%', background: '#fff', border: '1px solid #d2beab', borderRadius: 8, boxShadow: '0 4px 16px rgba(80,60,40,0.10)', zIndex: 200, padding: '0.5rem 0', maxHeight: 320, overflowY: 'auto' }}>
                  {suggestions.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'flex-start', padding: '0.5rem' }}>
                      {suggestions.map(perfume => (
                        <div
                          key={perfume.id}
                          className="perfume-card"
                          style={{
                            width: 140,
                            background: '#f7ece6',
                            borderRadius: 10,
                            padding: '0.7rem',
                            boxShadow: '0 2px 8px rgba(80,60,40,0.07)',
                            cursor: 'pointer',
                            margin: '0.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textDecoration: 'none'
                          }}
                          onMouseDown={() => handleSuggestionClick(perfume)}
                        >
                          <img src={perfume.image} alt={perfume.title} style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 8 }} />
                          <div className="title" style={{ fontWeight: 600, marginTop: 6 }}>{perfume.title}</div>
                          <div className="desc" style={{ fontSize: '0.9rem', color: '#8B2E2E' }}>{perfume.desc}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '1rem', textAlign: 'center', color: '#8B2E2E' }}>
                      No matches found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      {/* Add this utility class to your main layout/page container (e.g. in _app.js, layout.js, or your main page component): */}
      {/* <div className="navbar-offset"> ...your page content... </div> */}
    </>
  );
}

export default Navbar
