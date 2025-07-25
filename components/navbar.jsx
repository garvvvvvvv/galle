"use client";
import Link from 'next/link';
import React from 'react';
import './navbar.css';
import { FaShoppingCart } from 'react-icons/fa';
import { supabase } from '@/utils/supabaseClient';
import AuthForm from './AuthForm';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const [accountOpen, setAccountOpen] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

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

  return (
    <nav className='navbar'>
      <a href='/' className='logo' style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <img src='/galle-logo.svg' alt='Galle Logo' width={44} height={44} style={{ minWidth: 38, minHeight: 38 }} />
      </a>
      {/* Mobile: Show GALLE + tagline, hide SHOP NOW, move cart to hamburger */}
      <div className="mobile-brand" style={{ fontSize: '1.18rem', lineHeight: 1.1 }}>
        <span className="mobile-galle-title">GALLE</span>
        <span className="mobile-galle-tagline">Eau de Parfum</span>
      </div>
      <ul className={`nav-links${open ? ' active' : ''}`} style={{ fontSize: '1.13rem', minHeight: 74 }}>
        <li><Link href='/' onClick={handleLinkClick}>HOME</Link></li>
        <li><Link href='/shop' onClick={handleLinkClick}>SHOP</Link></li>
        <li><Link href='/about' onClick={handleLinkClick}>ABOUT</Link></li>
        <li><Link href='/contact' onClick={handleLinkClick}>CONTACT US</Link></li>
        {/* Show MY ACCOUNT if signed in, SIGN IN if not */}
        <li style={{ position: 'relative' }}>
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
                  fontSize: '1rem',
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
                fontSize: '1rem',
                cursor: 'pointer',
                padding: 0
              }}
            >
              SIGN IN
            </button>
          )}
        </li>
        {/* Cart button for mobile, inside hamburger menu */}
        <li className="mobile-cart-link">
          <Link
            href='/checkout'
            className='cart-navbar-btn'
            aria-label='Go to Cart'
            style={{ display: 'flex', alignItems: 'center', color: '#241B19', fontSize: '1.7rem', marginLeft: '8px' }}
            onClick={() => setOpen(false)}
          >
            <FaShoppingCart />
          </Link>
        </li>
      </ul>
      {/* Desktop: Shop Now and Cart */}
      <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Link className='shop-now' href='/shop' style={{ fontSize: '1.13rem', height: 44, display: 'flex', alignItems: 'center' }}>SHOP NOW</Link>
        <Link href='/checkout' className='cart-navbar-btn desktop-cart-btn' aria-label='Go to Cart' style={{ display: 'flex', alignItems: 'center', color: '#241B19', fontSize: '1.9rem', marginLeft: '12px', height: 44 }}>
          <FaShoppingCart />
        </Link>
      </div>
      <button
        className="hamburger"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: 54,
          width: 54,
          minHeight: 44,
          minWidth: 44,
          marginLeft: 8,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'absolute',
          right: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 110
        }}
      >
        <img src="/hamburger.svg" alt="Menu" width={34} height={34} />
      </button>
    </nav>
  )
}

export default Navbar
