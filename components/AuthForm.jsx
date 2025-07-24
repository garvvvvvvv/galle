"use client";
import React, { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function AuthForm({ onAuth }) {
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '', phone: '', country_code: '', city: '' });
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isSignUp) {
        // Sign up user
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
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
        if (signUpError) throw signUpError;
        // Save user info to users and subscribers tables
        if (data.user) {
          await supabase.from('users').insert([
            {
              id: data.user.id,
              email: form.email,
              first_name: form.first_name,
              last_name: form.last_name,
              phone: form.phone,
              country_code: form.country_code,
              city: form.city
            }
          ]);
          await supabase.from('subscribers').insert([
            {
              email: form.email,
              first_name: form.first_name,
              last_name: form.last_name,
              phone: form.phone,
              country_code: form.country_code,
              city: form.city
            }
          ]);
        }
        if (onAuth) onAuth(data.user);
      } else {
        // Sign in user
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password
        });
        if (signInError) throw signInError;
        if (onAuth) onAuth(data.user);
      }
    } catch (err) {
      setError(err.message || 'Auth failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 600 }}>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {isSignUp && (
          <>
            <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} required />
            <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} required />
            <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
            <input name="country_code" placeholder="Country Code" value={form.country_code} onChange={handleChange} required />
            <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
          </>
        )}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit" disabled={loading}>{loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}</button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </form>
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <button type="button" style={{ background: 'none', border: 'none', color: '#8B2E2E', cursor: 'pointer', fontWeight: 500 }} onClick={() => setIsSignUp(s => !s)}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}
