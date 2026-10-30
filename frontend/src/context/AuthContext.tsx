import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
}

export interface PlayerProfile {
  id: number;
  full_name: string;
  photo?: string | null;
  playing_role?: string;
  jersey_number?: number | null;
  batting_style?: string;
  bowling_style?: string;
  bio?: string;
  team?: {
    id: number;
    name: string;
    short_name: string;
    slug: string;
    logo?: string | null;
    is_captain?: boolean;
  } | null;
}

interface AuthContextType {
  user: User | null;
  profile: PlayerProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, user: User, profile?: PlayerProfile | null) => void;
  logout: () => void;
  updateProfile: (profile: PlayerProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('mpl_token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mpl_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState<PlayerProfile | null>(() => {
    const saved = localStorage.getItem('mpl_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (newToken: string, newUser: User, newProfile?: PlayerProfile | null) => {
    setToken(newToken);
    setUser(newUser);
    setProfile(newProfile || null);
    localStorage.setItem('mpl_token', newToken);
    localStorage.setItem('mpl_user', JSON.stringify(newUser));
    if (newProfile) {
      localStorage.setItem('mpl_profile', JSON.stringify(newProfile));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setProfile(null);
    localStorage.removeItem('mpl_token');
    localStorage.removeItem('mpl_user');
    localStorage.removeItem('mpl_profile');
  };

  const updateProfile = (newProfile: PlayerProfile) => {
    setProfile(newProfile);
    localStorage.setItem('mpl_profile', JSON.stringify(newProfile));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isAuthenticated: !!token && !!user,
        isAdmin: !!user?.is_staff,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
