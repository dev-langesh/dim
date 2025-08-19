"use client";
import { api } from "@/api/axios";
import React from "react";

export const AuthContext = React.createContext();

export default function AuthProvider({children}) {
  const [auth, setAuth] = React.useState({
    user: null,
    isAuthenticated: false,
  });

  async function fetchUser() {
    try {
      const res = await api.get("/auth/status");
      setAuth({
        user: res.data.user,
        isAuthenticated: true,
      });
    } catch (error) {
      if (error.response?.data.rotateTokens) {
        await api.post("/auth/rotate-tokens");

        const res = await api.get("/auth/status");
        setAuth({
          user: res.data.user,
          isAuthenticated: true,
        });
      }
    }
  }

  React.useEffect(() => {
    fetchUser();
  }, []);

  React.useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
