"use client";
import AuthForm from '../../components/AuthForm';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@/components/AccountPage';

export default function AuthPage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to intended destination or /account
  useEffect(() => {
    if (user) {
      setLoading(true);
      const dest = sessionStorage.getItem('redirectAfterLogin') || '/account';
      router.push(dest);
}
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f7f2ed' }}>
      <AuthForm onAuth={u => {
        setLoading(true);
        // Set user in context handled by AuthForm
        // Redirect handled by effect above
      }} />
    </div>
  );
}
