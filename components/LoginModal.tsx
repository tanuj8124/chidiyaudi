'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username.trim()) return;

    setIsLoading(true);
    setError('');
    try {
      await login(username);
      setUsername('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <img
              src="/chidiyalogo.webp"
              alt="Chidiya Ud Logo"
              className="w-24 h-24 object-contain drop-shadow-md"
            />
          </div>
          <DialogTitle>Welcome to Chidiya Ud</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-100">
              {error}
            </div>
          )}
          <Input
            placeholder="Enter your username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            autoFocus
          />
          <Button
            onClick={handleLogin}
            disabled={!username.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? 'Logging in...' : 'Play as Guest'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
