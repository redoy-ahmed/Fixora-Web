import React, { createContext, useContext, useState, useEffect } from 'react';
import { StaffUser } from '../types';

interface AuthContextType {
  user: StaffUser | null;
  token: string | null;
  login: (token: string, user: StaffUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StaffUser | null>(() => {
    const saved = localStorage.getItem('fixora_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('fixora_token');
  });

  const login = (newToken: string, newUser: StaffUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('fixora_token', newToken);
    localStorage.setItem('fixora_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('fixora_token');
    localStorage.removeItem('fixora_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
