import React, { createContext, useContext, useState } from "react";

// 1. Create context
const UserContext = createContext();

// 2. Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // initially no user

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// 3. Custom hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};