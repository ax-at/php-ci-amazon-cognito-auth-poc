'use client';

import { createContext, useContext, useState } from 'react';

interface Tokens {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  tokens: Tokens;
  setTokens: (tokens: Tokens) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  tokens: {},
  setTokens: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [tokens, setTokens] = useState<Tokens>({});
  const isAuthenticated = !!tokens.accessToken;

  return (
    <AuthContext.Provider value={{ isAuthenticated, tokens, setTokens }}>
      {children}
    </AuthContext.Provider>
  );
} 