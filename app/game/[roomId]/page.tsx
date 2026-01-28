'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { GAME_ITEMS } from '@/lib/gameData';
import { ROUND_DURATION, COUNTDOWN_DURATION, validateAnswer } from '@/lib/gameLogic';
import { GameControls } from '@/components/GameControls';
import { Timer } from '@/components/Timer';
import { PlayerList } from '@/components/PlayerList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Player {
  _id?: string;
  roomId: string;
  playerId: string;
  name: string;
  alive: boolean;
  score: number;
  lastAnswer?: 'up' | 'down';
  lastAnswerCorrect?: boolean;
}

interface Room {
  _id?: string;
  roomId: string;
  hostId: string;
  status: 'lobby' | 'playing' | 'finished';
  currentRound: number;
  currentItemId?: string;
}

type GameState = 'countdown' | 'showing' | 'waiting' | 'eliminated' | 'finished';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const { playerId, playerName } = useAuth();

  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>('countdown');
  const [timerKey, setTimerKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);

  const roomId = params.roomId as string;
  const currentItem = room?.currentItemId ? GAME_ITEMS.find(i => i.id === room.currentItemId) : null;
  const currentPlayer = players.find(p => p.playerId === playerId);
  const isPlayerAlive = currentPlayer?.alive ?? false;

  // Fetch room and players data
  // Fetch room and players data
  const fetchData = async () => {
    try {
      const response = await fetch(`/api/rooms/get?roomId=${roomId}`);
      if (!response.ok) throw new Error('Failed to fetch room');
      const data = await response.json();
      setRoom(data.room);
      setPlayers(data.players);

      // If game finished, show results
      if (data.room.status === 'finished') {
        const sortedPlayers = [...data.players].sort((a: Player, b: Player) => b.score - a.score);
        setWinner(sortedPlayers[0]);
        setGameState('finished');
      }
    } catch (err) {
      console.error('Failed to fetch game data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 500);
    return () => clearInterval(interval);
  }, [roomId]);

  // Handle countdown
  useEffect(() => {
    if (gameState !== 'countdown' || !isPlayerAlive) return;

    const timer = setTimeout(() => {
      setGameState('showing');
      setHasAnswered(false);
      setTimerKey(prev => prev + 1);
    }, COUNTDOWN_DURATION);

    return () => clearTimeout(timer);
  }, [gameState, isPlayerAlive]);

  // Handle round timeout
  useEffect(() => {
    if (gameState !== 'showing' || hasAnswered) return;

    const timer = setTimeout(async () => {
      setHasAnswered(true);
      setGameState('waiting');

      // Submit wrong answer (timeout = wrong)
      try {
        const response = await fetch('/api/game/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId, playerId, answer: 'up' }), // timeout counts as wrong
        });
        const data = await response.json();

        if (data.gameEnded) {
          await fetchData(); // Refresh data to get final scores
          setWinner(data.winner);
          setGameState('finished');
        } else {
          setTimeout(() => {
            setGameState('showing');
            setHasAnswered(false);
            setTimerKey(prev => prev + 1);
          }, 1000);
        }
      } catch (err) {
        console.error('Failed to submit timeout:', err);
      }
    }, ROUND_DURATION);

    return () => clearTimeout(timer);
  }, [gameState, hasAnswered, roomId, playerId]);

  const handleAnswer = async (answer: 'up' | 'down') => {
    if (hasAnswered || gameState !== 'showing' || !isPlayerAlive) return;

    setHasAnswered(true);
    setGameState('waiting');

    try {
      const response = await fetch('/api/game/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, playerId, answer }),
      });

      if (!response.ok) throw new Error('Failed to submit answer');
      const data = await response.json();

      if (data.gameEnded) {
        await fetchData(); // Refresh data to get final scores
        setWinner(data.winner);
        setGameState('finished');
      } else {
        // Wait a bit before showing next item
        setTimeout(() => {
          setGameState('showing');
          setHasAnswered(false);
          setTimerKey(prev => prev + 1);
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  if (!isPlayerAlive && gameState !== 'finished') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-red-600">You've Been Eliminated!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700 mb-2">{currentPlayer?.score || 0} Points</p>
              <p className="text-gray-600">Final Score</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Leaderboard</h3>
              <div className="space-y-2">
                {players
                  .sort((a, b) => b.score - a.score)
                  .map((p, idx) => (
                    <div key={p.playerId} className="flex justify-between text-sm">
                      <span>#{idx + 1} {p.name}</span>
                      <span className="font-semibold">{p.score}</span>
                    </div>
                  ))}
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Return Home
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'finished' && winner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 p-4">
        <audio autoPlay src="/loser.mp3" className="hidden" />
        <Card className="max-w-md w-full shadow-lg border-yellow-200">
          <CardHeader>
            <CardTitle className="text-center text-yellow-600">Game Over!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <div className="bg-red-50 p-6 rounded-2xl border-4 border-red-200 shadow-inner">
                <div className="flex justify-center mb-4">
                  <img
                    src="/looser.gif"
                    alt="Loser"
                    className="w-48 h-48 object-cover rounded-full border-4 border-red-400 shadow-lg animate-bounce"
                  />
                </div>
                <p className="text-xl font-bold text-red-600 uppercase tracking-widest">Ultimate Loser</p>

                <div className="py-4">
                  <p className="text-4xl font-extrabold text-gray-900">
                    {players.sort((a, b) => a.score - b.score)[0].name}
                  </p>
                  <p className="text-lg text-red-500 font-medium">
                    (Only {players.sort((a, b) => a.score - b.score)[0].score} points? 😂)
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-red-100 text-sm text-gray-600 italic">
                  "Maybe try opening your eyes next time?"
                </div>
              </div>

              <div className="py-2">
                <p className="text-2xl font-black text-indigo-900 animate-pulse">
                  🚨 PORT THIS NOOB! 🚨
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Final Leaderboard</h3>
              <div className="space-y-2">
                {players
                  .sort((a, b) => b.score - a.score)
                  .map((p, idx) => (
                    <div
                      key={p.playerId}
                      className={`flex justify-between text-sm ${idx === 0 ? 'font-bold text-yellow-600' : ''}`}
                    >
                      <span>#{idx + 1} {p.name}</span>
                      <span>{p.score}</span>
                    </div>
                  ))}
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Play Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Round Info */}
        <div className="text-center text-sm text-gray-600">
          Round {room?.currentRound || 0}
        </div>

        {/* Main Game Card */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            {/* Countdown */}
            {gameState === 'countdown' && (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-gray-600 mb-4">Get Ready!</p>
                <p className="text-6xl font-bold text-indigo-600">3</p>
              </div>
            )}

            {/* Game Playing */}
            {gameState === 'showing' && currentItem && (
              <div className="space-y-4">
                {/* Image */}
                <div className="bg-white border-2 border-indigo-100 rounded-xl h-48 flex items-center justify-center shadow-sm">
                  <span className="text-5xl font-bold text-indigo-900 tracking-wide">
                    {currentItem.name}
                  </span>
                </div>

                {/* Audio Auto-play */}
                <audio autoPlay src="/chidiyaudi.mp3" className="hidden" />

                {/* Item Name */}


                {/* Timer */}
                <Timer
                  key={timerKey}
                  duration={ROUND_DURATION}
                  onTimeUp={() => {
                    if (!hasAnswered) handleAnswer('up');
                  }}
                  isRunning={true}
                />

                {/* Controls */}
                <GameControls
                  onUp={() => handleAnswer('up')}
                  onDown={() => handleAnswer('down')}
                  disabled={hasAnswered}
                />
              </div>
            )}

            {/* Waiting for next round */}
            {gameState === 'waiting' && (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-gray-600">Next round starting...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Player List */}
        <PlayerList players={players} currentPlayerId={playerId || undefined} />
      </div>
    </div>
  );
}
