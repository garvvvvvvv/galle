"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import countryCodes from './countryCodes.json'; // You need to create this file with all country codes
// import handleChange from './handleChange'; // Assuming you have a utility function for input changes    
const SignupModal = () => {
  // Add handleChange for form fields
  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    country_code: '',
    email: '',
    city: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Only show if not dismissed before
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('signupModalDismissed')) {
        const timer = setTimeout(() => setShow(true), 1500); // 1.5s delay
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('signupModalDismissed', 'true');
    }
  };

    // (Removed duplicate/invalid error declaration)
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 0. Check if email already exists in users or subscribers
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', form.email)
      .maybeSingle();
    if (existingUser) {
      alert('Email already exists. Please log in.');
      return;
    }
    const { data: existingSub } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', form.email)
      .maybeSingle();
    if (existingSub) {
      alert('Email already exists. Please log in.');
      return;
    }
    // 1. Sign up user with Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.phone || Math.random().toString(36).slice(-8), // fallback password if not provided
      options: {
        data: {
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
          country_code: form.country_code,
          city: form.city
        }
      }
    });
    if (signUpError) {
      alert('Signup failed: ' + signUpError.message);
      return;
    }
    // 2. Save user info to users table and subscribers table
    let userId = signUpData?.user?.id;
    if (!userId) {
      // Try to get user from session if not returned immediately
      const { data: sessionData } = await supabase.auth.getSession();
      userId = sessionData?.session?.user?.id;
    }
    if (userId) {
      // Save to users table
      const { error: userTableError } = await supabase.from('users').insert([
        {
          id: userId,
          email: form.email,
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
          country_code: form.country_code,
          city: form.city
        }
      ]);
      if (userTableError) {
        alert('User profile save failed: ' + userTableError.message);
        return;
      }
      // Save to subscribers table
      const { error: subTableError } = await supabase.from('subscribers').insert([
        {
          email: form.email,
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
          country_code: form.country_code,
          city: form.city
        }
      ]);
      if (subTableError) {
        alert('Subscriber save failed: ' + subTableError.message);
        return;
      }
    }
    setSubmitted(true);
    alert('Thank you! Please check your email to confirm your account.');
    handleClose();
            fontSize: '1.5rem',
            color: '#8B2E2E',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          ×
        </button>
        <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.5rem', color: '#8B2E2E' }}>Join Our Tribe</h2>
        <p style={{ fontSize: '1.08rem', color: '#412a1f', marginBottom: '1.2rem', fontWeight: 400 }}>
          Sign up to receive exclusive offers, tips, and product drops!
        </p>
        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', alignItems: 'center' }}>
            <input name="first_name" value={form.first_name} onChange={handleChange} required placeholder="First Name" style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #8B2E2E', fontSize: '1rem', width: '90%', outline: 'none' }} />
            <input name="last_name" value={form.last_name} onChange={handleChange} required placeholder="Last Name" style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #8B2E2E', fontSize: '1rem', width: '90%', outline: 'none' }} />
            <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone Number" style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #8B2E2E', fontSize: '1rem', width: '90%', outline: 'none' }} />
            <select name="country_code" value={form.country_code} onChange={handleChange} required style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #8B2E2E', fontSize: '1rem', width: '90%', outline: 'none', background: '#fff' }}>
              <option value="">Country Code</option>
              <option value="+91">India (+91)</option>
              <option value="+1">United States (+1)</option>
              <option value="+44">United Kingdom (+44)</option>
              <option value="+61">Australia (+61)</option>
              <option value="+81">Japan (+81)</option>
              <option value="+49">Germany (+49)</option>
              <option value="+33">France (+33)</option>
    handleClose();
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(40, 30, 20, 0.18)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'opacity 0.3s',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '18px',
        boxShadow: '0 8px 32px rgba(80, 60, 40, 0.18)',
        padding: '2.2rem 1.5rem 1.5rem 1.5rem',
        maxWidth: 340,
        width: '90vw',
        textAlign: 'center',
        position: 'relative',
        fontFamily: 'Inter, Arial, sans-serif',
      }}>
        <button
          onClick={handleClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: '#8B2E2E',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          ×
        </button>
        <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.5rem', color: '#8B2E2E' }}>Join Our Tribe</h2>
        <p style={{ fontSize: '1.08rem', color: '#412a1f', marginBottom: '1.2rem', fontWeight: 400 }}>
          Sign up to receive exclusive offers, tips, and product drops!
        </p>
        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', alignItems: 'center' }}>
            <input name="first_name" value={form.first_name} onChange={handleChange} required placeholder="First Name" style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #8B2E2E', fontSize: '1rem', width: '90%', outline: 'none' }} />
            <input name="last_name" value={form.last_name} onChange={handleChange} required placeholder="Last Name" style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #8B2E2E', fontSize: '1rem', width: '90%', outline: 'none' }} />
            <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone Number" style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #8B2E2E', fontSize: '1rem', width: '90%', outline: 'none' }} />
            <select name="country_code" value={form.country_code} onChange={handleChange} required style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #8B2E2E', fontSize: '1rem', width: '90%', outline: 'none', background: '#fff' }}>
              <option value="">Country Code</option>
              <option value="+91">India (+91)</option>
              <option value="+1">United States (+1)</option>
              <option value="+44">United Kingdom (+44)</option>
              <option value="+61">Australia (+61)</option>
              <option value="+81">Japan (+81)</option>
              <option value="+49">Germany (+49)</option>
              <option value="+33">France (+33)</option>
              <option value="+86">China (+86)</option>
              <option value="+971">UAE (+971)</option>
              <option value="+7">Russia (+7)</option>
              <option value="+39">Italy (+39)</option>
              <option value="+34">Spain (+34)</option>
              <option value="+55">Brazil (+55)</option>
              <option value="+27">South Africa (+27)</option>
              <option value="+82">South Korea (+82)</option>
              <option value="+65">Singapore (+65)</option>
              <option value="+62">Indonesia (+62)</option>
              <option value="+880">Bangladesh (+880)</option>
              <option value="+92">Pakistan (+92)</option>
              <option value="+20">Egypt (+20)</option>
              <option value="+966">Saudi Arabia (+966)</option>
              <option value="+63">Philippines (+63)</option>
              <option value="+60">Malaysia (+60)</option>
              <option value="+234">Nigeria (+234)</option>
              <option value="+212">Morocco (+212)</option>
              <option value="+351">Portugal (+351)</option>
              <option value="+90">Turkey (+90)</option>
              <option value="+380">Ukraine (+380)</option>
              <option value="+994">Azerbaijan (+994)</option>
              <option value="+998">Uzbekistan (+998)</option>
              <option value="+84">Vietnam (+84)</option>
              <option value="+66">Thailand (+66)</option>
              <option value="+64">New Zealand (+64)</option>
              <option value="+1-242">Bahamas (+1-242)</option>
              <option value="+1-246">Barbados (+1-246)</option>
              <option value="+1-441">Bermuda (+1-441)</option>
              <option value="+1-284">British Virgin Islands (+1-284)</option>
              <option value="+1-345">Cayman Islands (+1-345)</option>
              <option value="+1-767">Dominica (+1-767)</option>
              <option value="+1-809">Dominican Republic (+1-809)</option>
              <option value="+358">Finland (+358)</option>
              <option value="+995">Georgia (+995)</option>
              <option value="+30">Greece (+30)</option>
              <option value="+852">Hong Kong (+852)</option>
              <option value="+36">Hungary (+36)</option>
              <option value="+353">Ireland (+353)</option>
              <option value="+972">Israel (+972)</option>
              <option value="+254">Kenya (+254)</option>
              <option value="+370">Lithuania (+370)</option>
              <option value="+352">Luxembourg (+352)</option>
              <option value="+356">Malta (+356)</option>
              <option value="+52">Mexico (+52)</option>
              <option value="+31">Netherlands (+31)</option>
              <option value="+47">Norway (+47)</option>
              <option value="+48">Poland (+48)</option>
              <option value="+40">Romania (+40)</option>
              <option value="+65">Singapore (+65)</option>
              <option value="+46">Sweden (+46)</option>
              <option value="+41">Switzerland (+41)</option>
              <option value="+886">Taiwan (+886)</option>
              <option value="+971">UAE (+971)</option>
              <option value="+380">Ukraine (+380)</option>
              <option value="+44">United Kingdom (+44)</option>
              <option value="+1">United States (+1)</option>
            </select>
            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email" style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #8B2E2E', fontSize: '1rem', width: '90%', outline: 'none' }} />
            <input name="city" value={form.city} onChange={handleChange} required placeholder="City" style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #8B2E2E', fontSize: '1rem', width: '90%', outline: 'none' }} />
            <button type="submit" style={{ background: '#8B2E2E', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.7rem 1.5rem', fontWeight: 600, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(80, 60, 40, 0.08)' }}>Subscribe</button>
          </form>
        ) : (
          <div style={{ color: '#8B2E2E', fontWeight: 600, fontSize: '1.1rem', marginTop: '1.2rem' }}>
            Thank you for subscribing!
          </div>
        )}
      </div>
    </div>
  );
}

export default SignupModal;
