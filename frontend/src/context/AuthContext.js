'use client';
import { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función login memorizada
  const login = useCallback((token, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    setIsAuthenticated(true);
    setUserEmail(email);
  }, []);

  // Función logout memorizada
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserEmail(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    setIsAuthenticated(!!token);
    if (email) setUserEmail(email);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        userEmail,
        loading,
        login, // ✅ Añade login aquí
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}