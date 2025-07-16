import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
const API_BASE = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api`;
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUser({ token, isAdmin: decoded.user.isAdmin });
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) return false;
    const { token } = await res.json();
    setToken(token);
    localStorage.setItem('token', token);
    setUser({ token });
    return true;
  };

  const register = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) return false;
    const { token } = await res.json();
    setToken(token);
    localStorage.setItem('token', token);
    setUser({ token });
    return true;
  };

  const forgotPassword = async (email) => {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.ok;
  };

  const resetPassword = async (token, password) => {
    const res = await fetch(`${API_BASE}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    return res.ok;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}; 