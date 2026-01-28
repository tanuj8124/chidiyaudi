'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { PlayerList } from '@/components/PlayerList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Player {
  _id?: string;
  roomId: string;
  playerId: string;
  name: string;
  alive: boolean;
  score: number;
}

interface Room {
  _id?: string;
  roomId: string;
  hostId: string;
  status: 'lobby' | 'playing' | 'finished';
  currentRound: number;
}

export default function LobbyPage() {
  const params = useParams();
  const router = useRouter();
  const { playerId, playerName } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState('');

  const roomId = params.roomId as string;
  const isHost = room?.hostId === playerId;

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await fetch(`/api/rooms/get?roomId=${roomId}`);
        if (!response.ok) throw new Error('Failed to fetch room');
        const data = await response.json();
        setRoom(data.room);
        setPlayers(data.players);

        // If game started, redirect to game page
        if (data.room.status === 'playing') {
          router.push(`/game/${roomId}`);
        }
      } catch (err) {
        setError('Failed to load room');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomData();
    const interval = setInterval(fetchRoomData, 1000);
    return () => clearInterval(interval);
  }, [roomId, router]);

  const handleStartGame = async () => {
    setIsStarting(true);
    setError('');
    try {
      const response = await fetch('/api/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, playerId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      // Show countdown or simply wait 5 seconds before redirecting
      setTimeout(() => {
        router.push(`/game/${roomId}`);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start game');
    } finally {
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading lobby...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Room Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">The room you're trying to join doesn't exist.</p>
            <Button onClick={() => router.push('/')} className="w-full">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <img
              src="/chidiyalogo.webp"
              alt="Chidiya Ud Logo"
              className="w-24 h-24 object-contain drop-shadow-md"
            />
          </div>
          <h1 className="text-3xl font-bold text-indigo-900">Lobby</h1>
          <p className="text-gray-600">Room Code: <span className="font-mono font-bold text-lg">{roomId}</span></p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Waiting for Players...</CardTitle>
          </CardHeader>
          <CardContent>
            <PlayerList players={players} currentPlayerId={playerId || undefined} />

            {error && (
              <p className="text-red-600 text-sm mt-4 text-center">{error}</p>
            )}

            {isHost && (
              <div className="mt-6 space-y-2">
                <Button
                  onClick={handleStartGame}
                  disabled={isStarting || players.length < 2}
                  size="lg"
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {isStarting ? 'Starting...' : `Start Game (${players.length} players)`}
                </Button>
                {players.length < 2 && (
                  <p className="text-xs text-gray-600 text-center">Need at least 2 players to start</p>
                )}
              </div>
            )}

            {!isHost && (
              <p className="text-center text-gray-600 mt-4 text-sm">
                Waiting for {room.hostId === players[0]?.playerId ? players[0]?.name : 'host'} to start the game...
              </p>
            )}
          </CardContent>
        </Card>

        <Button
          onClick={() => router.push('/')}
          variant="outline"
          className="w-full"
        >
          Leave Room
        </Button>
      </div>
    </div>
  );
}
