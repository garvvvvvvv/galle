"use client";
import React, { useState } from 'react';
import countryCodes from './countryCodes.json';
import { supabase } from '@/utils/supabaseClient';

export default function AuthForm({ onAuth }) {
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '', phone: '', country_code: '+91', city: '' });
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isSignUp) {
        // 1. Sign Up with Supabase Auth
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
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

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }

        // 2. Ensure user profile exists
        if (signUpData.user) {
          try {
            // First, insert basic profile
            await supabase.rpc('insert_user_profile');

            // Then update with additional details
            const { error: updateError } = await supabase
              .from('users')
              .update({
                first_name: form.first_name,
                last_name: form.last_name,
                phone: form.phone,
                country_code: form.country_code,
                city: form.city
              })
              .eq('id', signUpData.user.id);

            if (updateError) {
              console.error('Profile update error:', updateError);
              setError(`Profile update failed: ${updateError.message}`);
              setLoading(false);
              return;
            }

            // Optional: Insert to subscribers
            await supabase.from('subscribers').upsert([
              {
                email: form.email,
                first_name: form.first_name,
                last_name: form.last_name,
                phone: form.phone,
                country_code: form.country_code,
                city: form.city
              }
            ], { onConflict: 'email' });

          // Trigger onAuth callback
            if (onAuth) onAuth(signUpData.user);
          } catch (profileError) {
            setError(`Profile save failed: ${profileError.message}`);
            setLoading(false);
            return;
          }
        } else {
          setError('User registration incomplete. Please check your email.');
          setLoading(false);
          return;
        }
      } else {
        // Sign In logic
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password
        });
        
        if (signInError) {
          setError(signInError.message);
          setLoading(false);
          return;
        }

        // Ensure user profile exists
        try {
          await supabase.rpc('insert_user_profile');
          
          // Optionally update profile if new details provided
          if (form.first_name || form.last_name) {
            await supabase
              .from('users')
              .update({
                first_name: form.first_name,
                last_name: form.last_name,
                phone: form.phone,
                country_code: form.country_code,
                city: form.city
              })
              .eq('id', data.user.id);
          }

          if (onAuth) onAuth(data.user);
        } catch (profileError) {
          console.warn('Profile sync failed:', profileError);
          if (onAuth) onAuth(data.user);
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '2.5rem auto', padding: 32, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(80,60,40,0.10)' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '2rem', color: '#8B2E2E', marginBottom: 18 }}>{isSignUp ? 'Create Account' : 'Sign In'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {isSignUp && (
          <>
            <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} required style={{ padding: 12, borderRadius: 8, border: '1px solid #d2beab', fontSize: '1rem' }} />
            <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} required style={{ padding: 12, borderRadius: 8, border: '1px solid #d2beab', fontSize: '1rem' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <select name="country_code" value={form.country_code} onChange={handleChange} required style={{ padding: 12, borderRadius: 8, border: '1px solid #d2beab', minWidth: 110, fontSize: '1rem' }}>
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.dial_code}>{c.name} ({c.dial_code})</option>
                ))}
              </select>
              <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #d2beab', fontSize: '1rem' }} />
            </div>
            <input name="city" placeholder="City" value={form.city} onChange={handleChange} required style={{ padding: 12, borderRadius: 8, border: '1px solid #d2beab', fontSize: '1rem' }} />
          </>
        )}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ padding: 12, borderRadius: 8, border: '1px solid #d2beab', fontSize: '1rem' }} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={{ padding: 12, borderRadius: 8, border: '1px solid #d2beab', fontSize: '1rem' }} />
        <button type="submit" disabled={loading} style={{ background: '#8B2E2E', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 600, fontSize: '1.08rem', cursor: 'pointer', marginTop: 8 }}>{loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}</button>
        {error && <div style={{ color: 'red', marginTop: 8, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
      </form>
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button type="button" style={{ background: 'none', border: 'none', color: '#8B2E2E', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }} onClick={() => setIsSignUp(s => !s)}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create Account"}
        </button>
      </div>
    </div>
  );
}