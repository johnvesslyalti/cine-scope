'use client';

import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");

  if (
    storedUser && 
    storedUser !== "undefined" && 
    storedUser !== "null" &&
    storedToken &&
    storedToken !== "undefined" &&
    storedToken !== "null"
  ) {
    try {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      setUser(null);
      setToken(null);
    }
  }
}, []);


    const login = (userData, token) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        setUser(userData);
        setToken(token);
    }

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
    }

    return(
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);