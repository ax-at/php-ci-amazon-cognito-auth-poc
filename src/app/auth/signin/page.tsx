'use client';

import { signIn } from '@/lib/auth';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await signIn(phoneNumber, password);
    console.log(result);
    if (result.success) {
      router.push(callbackUrl);
    } else {
      setError(result.message || 'Sign in failed');
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number"
          className="p-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="p-2 border rounded"
        />
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Sign In
        </button>
      </form>
    </div>
  );
} 