import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContextObject";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user once on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Invalid user data in localStorage");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  // LOGIN
  const login = (userData) => {
    setUser(userData);

    // optional persistence
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");

    // IMPORTANT if you're using cookies
    // you should also call backend logout API
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading user...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};