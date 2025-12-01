"use client";

import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  role?: string; // adjust as needed
};

type AuthContextType = {
  user: User | null;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  refreshUser: async () => {},
});

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${base}/auth/me`, { credentials: "include" });
      const data = await res.json();
      setUser(data?.user ?? null);
    } catch {
      setUser(null);
    }
  };

  // Load user once on mount
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}