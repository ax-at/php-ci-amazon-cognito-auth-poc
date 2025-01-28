'use client';

import { signOut } from "@/lib/auth";
import { useAuth } from "./Providers";
import { useRouter } from "next/navigation";

export default function AuthStatus() {
  const { isAuthenticated, tokens, setTokens } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p>Not signed in</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => router.push('/auth/signin')}
        >
          Sign in
        </button>
      </div>
    );
  }

  const handleSignOut = async () => {
    if (tokens.accessToken) {
      await signOut(tokens.accessToken);
      setTokens({});
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p>Signed in</p>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSignOut}
      >
        Sign out
      </button>
    </div>
  );
} 