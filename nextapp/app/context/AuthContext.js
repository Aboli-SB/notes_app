"use client";
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const register = async (username, email, password) => {
    try {
      const response = await axios.post("http://localhost:8000/user/register", {
        username,
        email,
        password,
      });
      alert("Registration successful!");
      router.push("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed!");
      console.error("Registration error:", error.response?.data || error.message);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:8000/user/login", {
        email,
        password,
      });
      const { token, user } = response.data;
  
      localStorage.setItem("authToken", token);
      setUser(user);
      setIsAuthenticated(true);
  
      alert("Login successful!");
      router.push("/profile");
      return true; // ✅ Return success
    } catch (error) {
      alert(error.response?.data?.message || "Login failed!");
      console.error("Login error:", error.response?.data || error.message);
      return false; // ✅ Return failure
    }
  };
  

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
