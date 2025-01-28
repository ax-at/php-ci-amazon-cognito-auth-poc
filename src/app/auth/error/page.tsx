'use client';

import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="bg-red-50 p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-red-800 mb-2">Authentication Error</h1>
        <p className="text-red-600">{error || 'An error occurred during authentication'}</p>
      </div>
    </div>
  );
} 