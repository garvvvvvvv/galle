"use client";
import React, { useState } from 'react';
import countryCodes from './countryCodes.json';
import { supabase } from '@/utils/supabaseClient';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useUser } from '../components/AccountPage';
import { upsertUserProfile } from './CartContext';

export default function AuthForm({ onAuth }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const { setUser } = useUser();

  // Password reset state
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // react-hook-form for validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      phone: '',
      country_code: '+91',
      city: ''
    }
  });

  // Submit handler
  const onSubmit = async (form) => {
    setLoading(true);
    try {
      if (isSignUp) {
        // Sign Up
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
          setError('email', { message: signUpError.message });
          toast.error(signUpError.message);
          setLoading(false);
          return;
        }
        // Profile upsert
        const userId = signUpData?.user?.id;
        if (userId) {
          await supabase
            .from('users')
            .upsert([{
              id: userId, // Use Auth user id!
              email: form.email,
              first_name: form.first_name,
              last_name: form.last_name,
              phone: form.phone,
              country_code: form.country_code,
              city: form.city
            }], { onConflict: 'id' });
          await supabase.from('subscribers').upsert([{
            email: form.email,
            first_name: form.first_name,
            last_name: form.last_name,
            phone: form.phone,
            country_code: form.country_code,
            city: form.city
          }], { onConflict: 'email' });
          toast.success('Sign up successful! Please check your email to confirm your account.');
          if (onAuth) onAuth(signUpData.user);
          reset();
        } else {
          setError('email', { message: 'User registration incomplete. Please check your email.' });
          toast.error('User registration incomplete. Please check your email.');
        }
      } else {
        // Sign In
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password
        });
        if (signInError) {
          setError('email', { message: signInError.message });
          toast.error(signInError.message);
          setLoading(false);
          return;
        }
        toast.success('Signed in successfully!');
        setUser(data.user); // Set user in global state
        if (onAuth) onAuth(data.user);
        reset();
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Password reset handler
  const handlePasswordReset = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
      if (error) throw error;
      setResetSent(true);
      toast.success('Password reset email sent!');
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main aria-label="Authentication" style={{ maxWidth: 420, margin: '2.5rem auto', padding: 32, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(80,60,40,0.10)' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '2rem', color: '#8B2E2E', marginBottom: 18 }}>
        {isSignUp ? 'Create Account' : 'Sign In'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }} aria-label={isSignUp ? "Sign up form" : "Sign in form"}>
        {isSignUp && (
          <>
            <input
              {...register("first_name", { required: "First name is required" })}
              placeholder="First Name"
              aria-label="First Name"
              style={{ padding: 12, borderRadius: 8, border: '1px solid #d2beab', fontSize: '1rem' }}
            />
            {errors.first_name && <span style={{ color: 'red' }}>{errors.first_name.message}</span>}
            <input
              {...register("last_name", { required: "Last name is required" })}
              placeholder="Last Name"
              aria-label="Last Name"
              style={{ padding: 12, borderRadius: 8, border: '1px solid #d2beab', fontSize: '1rem' }}
            />
            {errors.last_name && <span style={{ color: 'red' }}>{errors.last_name.message}</span>}
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                {...register("country_code", { required: true })}
                aria-label="Country Code"
                style={{ padding: 12, borderRadius: 8, border: '1px solid #d2beab', minWidth: 110, fontSize: '1rem' }}
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.dial_code}>{c.name} ({c.dial_code})</option>
                ))}
              </select>
              <input
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: { value: /^[0-9]{7,15}$/, message: "Enter a valid phone number" }
                })}
                placeholder="Phone Number"
                aria-label="Phone Number"
                style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #d2beab', fontSize: '1rem' }}
              />
            </div>
            {errors.phone && <span style={{ color: 'red' }}>{errors.phone.message}</span>}
            <input
              {...register("city", { required: "City is required" })}
              placeholder="City"
              aria-label="City"
              style={{ padding: 12, borderRadius: 8, border: '1px solid #d2beab', fontSize: '1rem' }}
            />
            {errors.city && <span style={{ color: 'red' }}>{errors.city.message}</span>}
          </>
        )}
        <input
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" }
          })}
          type="email"
          placeholder="Email"
          aria-label="Email"
          style={{ padding: 12, borderRadius: 8, border: '1px solid #d2beab', fontSize: '1rem' }}
        />
        {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}
        <input
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" }
          })}
          type="password"
          placeholder="Password"
          aria-label="Password"
          style={{ padding: 12, borderRadius: 8, border: '1px solid #d2beab', fontSize: '1rem' }}
        />
        {errors.password && <span style={{ color: 'red' }}>{errors.password.message}</span>}
        <button
          type="submit"
          disabled={loading}
          style={{ background: '#8B2E2E', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 600, fontSize: '1.08rem', cursor: 'pointer', marginTop: 8 }}
          aria-busy={loading}
        >
          {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        <button
          type="button"
          onClick={() => setShowReset(true)}
          style={{ background: 'none', border: 'none', color: '#8B2E2E', cursor: 'pointer', fontWeight: 600, fontSize: '1rem', marginTop: 8 }}
          aria-label="Forgot Password"
        >
          Forgot Password?
        </button>
      </form>
      {showReset && (
        <div style={{ marginTop: 16 }}>
          <input
            value={resetEmail}
            onChange={e => setResetEmail(e.target.value)}
            placeholder="Enter your email"
            aria-label="Reset Email"
            style={{ padding: 12, borderRadius: 8, border: '1px solid #d2beab', fontSize: '1rem', width: '100%', marginBottom: 8 }}
          />
          <button
            onClick={handlePasswordReset}
            style={{ background: '#8B2E2E', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>
          {resetSent && <div style={{ color: 'green', marginTop: 8 }}>Check your email for reset instructions.</div>}
        </div>
      )}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button
          type="button"
          style={{ background: 'none', border: 'none', color: '#8B2E2E', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}
          onClick={() => setIsSignUp(s => !s)}
          aria-label={isSignUp ? "Switch to sign in" : "Switch to sign up"}
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create Account"}
        </button>
      </div>
    </main>
  );
}