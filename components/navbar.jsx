"use client";
import Link from 'next/link';
import React from 'react';
import './navbar.css';
import { FaShoppingCart } from 'react-icons/fa';


const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const handleLinkClick = () => setOpen(false);
  return (
    <nav className='navbar'>
      <a href='/' className='logo'>
        <img src='/galle-logo.svg' alt='Galle Logo' width={55} height={55} />
      </a>
      <ul className={`nav-links${open ? ' active' : ''}`}>
        <li><Link href='/' onClick={handleLinkClick}>HOME</Link></li>
        <li><Link href='/shop' onClick={handleLinkClick}>SHOP</Link></li>
        <li><Link href='/about' onClick={handleLinkClick}>ABOUT</Link></li>
        <li><Link href='/contact' onClick={handleLinkClick}>CONTACT US</Link></li>
        <li><Link href='/auth' onClick={handleLinkClick}>SIGN IN</Link></li>
        <li><Link href='/account' onClick={handleLinkClick}>MY ACCOUNT</Link></li>
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link className='shop-now' href='/shop'>SHOP NOW</Link>
        <Link href='/checkout' className='cart-navbar-btn' aria-label='Go to Cart' style={{ display: 'flex', alignItems: 'center', color: '#241B19', fontSize: '1.7rem', marginLeft: '8px' }}>
          <FaShoppingCart />
        </Link>
      </div>
      <button
        className="hamburger"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        <img src="/hamburger.svg" alt="Menu" width={30} height={30} />
      </button>
    </nav>
  )
}

export default Navbar
