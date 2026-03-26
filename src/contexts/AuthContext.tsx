import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  email: string;
  name: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("resolve-x-user");
    if (stored) setUser(JSON.parse(stored));
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    if (!email || !password) return { success: false, error: "All fields are required" };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: "Invalid email format" };
    if (password.length < 4) return { success: false, error: "Password too short" };

    const role = email.toLowerCase() === "admin@gmail.com" ? "admin" as const : "user" as const;
    const name = role === "admin" ? "Admin" : email.split("@")[0];
    const u: User = { email, name, role };
    localStorage.setItem("resolve-x-user", JSON.stringify(u));
    setUser(u);
    return { success: true };
  };

  const register = (name: string, email: string, password: string) => {
    if (!name || !email || !password) return { success: false, error: "All fields are required" };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: "Invalid email format" };
    if (password.length < 6) return { success: false, error: "Password must be at least 6 characters" };

    const role = email.toLowerCase() === "admin@gmail.com" ? "admin" as const : "user" as const;
    const u: User = { email, name, role };
    localStorage.setItem("resolve-x-user", JSON.stringify(u));
    setUser(u);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("resolve-x-user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
