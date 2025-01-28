'use client';

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center gap-4">
        <p>Not signed in</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => signIn("cognito")}
        >
          Sign in with Cognito
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p>Signed in as {session?.user?.email}</p>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    </div>
  );
} 