"use client";

import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

export const AuthContext = createContext({
  user: null,
  refreshUser: () => {},
});

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${base}/auth/me`, { credentials: "include" });
      const data = await res.json();
      setUser(data?.user || null);
    } catch {
      setUser(null);
    }
  };

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