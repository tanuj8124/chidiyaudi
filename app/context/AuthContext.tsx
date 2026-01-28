'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  playerId: string | null;
  playerName: string | null;
  isLoading: boolean;
  login: (username: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('chidiya_auth');
    if (stored) {
      try {
        const { playerId: id, playerName: name } = JSON.parse(stored);
        setPlayerId(id);
        setPlayerName(name);
      } catch (error) {
        console.error('Failed to load auth:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const { playerId: id } = await response.json();
      setPlayerId(id);
      setPlayerName(username);

      // Store in localStorage
      localStorage.setItem('chidiya_auth', JSON.stringify({ playerId: id, playerName: username }));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setPlayerId(null);
    setPlayerName(null);
    localStorage.removeItem('chidiya_auth');
  };

  return (
    <AuthContext.Provider value={{ playerId, playerName, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
