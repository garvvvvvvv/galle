"use client";
import AuthForm from '../../components/AuthForm';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AuthPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  return (
    <div style={{ minHeight: '100vh', background: '#f7f2ed' }}>
      <AuthForm onAuth={u => { setUser(u); router.push('/account'); }} />
    </div>
  );
}
