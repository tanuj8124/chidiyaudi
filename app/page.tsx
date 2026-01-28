'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { LoginModal } from '@/components/LoginModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const router = useRouter();
  const { playerId, playerName, isLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  // If authenticated, show game options
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!playerId || !playerName) {
    return (
      <>
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
          <div className="max-w-md w-full space-y-6">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-6">
                <img
                  src="/chidiyalogo.webp"
                  alt="Chidiya Ud"
                  className="w-80 h-auto object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h1 className="sr-only">Chidiya Ud</h1>
              <p className="text-lg text-gray-600 font-medium">Test your reflexes in this multiplayer game!</p>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setShowLogin(true)}
                  size="lg"
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  Play Now
                </Button>
              </CardContent>
            </Card>

            <div className="text-sm text-gray-600 text-center">
              <p>How to play:</p>
              <ul className="mt-2 space-y-1 text-left">
                <li>See a bird/object on screen</li>
                <li>Press UP if it can fly, DOWN if it cannot</li>
                <li>Wrong answer = eliminated</li>
                <li>Last player wins!</li>
              </ul>
            </div>
          </div>
        </div>
        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      </>
    );
  }

  const handleCreateRoom = async () => {
    setIsCreating(true);
    setError('');
    try {
      const response = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, playerName }),
      });

      if (!response.ok) throw new Error('Failed to create room');
      const { roomId } = await response.json();
      router.push(`/lobby/${roomId}`);
    } catch (err) {
      setError('Failed to create room');
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    setIsJoining(true);
    setError('');
    try {
      const response = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: roomCode.toUpperCase(), playerId, playerName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to join room');
      }

      router.push(`/lobby/${roomCode.toUpperCase()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join room');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <img
              src="/chidiyalogo.webp"
              alt="Chidiya Ud"
              className="w-48 h-auto object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h1 className="text-4xl font-bold text-indigo-900 sr-only">Chidiya Ud</h1>
          <p className="text-gray-600">Welcome, {playerName}!</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Create or Join Game</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleCreateRoom}
              disabled={isCreating}
              size="lg"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {isCreating ? 'Creating...' : 'Create Room'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <div className="space-y-2">
              <Input
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                disabled={isJoining}
              />
              <Button
                onClick={handleJoinRoom}
                disabled={isJoining}
                variant="outline"
                size="lg"
                className="w-full bg-transparent"
              >
                {isJoining ? 'Joining...' : 'Join Room'}
              </Button>
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
