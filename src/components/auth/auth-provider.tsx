"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("taskmaster_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("taskmaster_user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    (username: string) => {
      const newUser = { username };
      localStorage.setItem("taskmaster_user", JSON.stringify(newUser));
      setUser(newUser);
      router.push("/tasks");
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("taskmaster_user");
    setUser(null);
    router.push("/");
  }, [router]);

  const value = { user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
