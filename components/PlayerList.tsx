'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

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

interface PlayerListProps {
  players: Player[];
  currentPlayerId?: string;
}

export function PlayerList({ players, currentPlayerId }: PlayerListProps) {
  const alivePlayers = players.filter(p => p.alive).sort((a, b) => b.score - a.score);
  const eliminatedPlayers = players.filter(p => !p.alive);

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Players ({alivePlayers.length}/{players.length})</h2>

      <div className="space-y-2">
        {alivePlayers.map((player) => (
          <div
            key={player.playerId}
            className={`flex items-center justify-between p-3 rounded-lg ${currentPlayerId === player.playerId
                ? 'bg-indigo-100'
                : 'bg-gray-50'
              }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="font-medium">{player.name}</span>
              {currentPlayerId === player.playerId && (
                <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">You</span>
              )}
            </div>
            <span className="text-sm font-semibold text-indigo-600">{player.score} pts</span>
          </div>
        ))}

        {eliminatedPlayers.length > 0 && (
          <>
            <div className="my-2 border-t border-gray-200"></div>
            {eliminatedPlayers.map((player) => (
              <div key={player.playerId} className="flex items-center justify-between p-3 rounded-lg bg-red-50 opacity-60">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="font-medium text-gray-600">
                    {player.name} <span className="text-xs">(Eliminated)</span>
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-600">{player.score} pts</span>
              </div>
            ))}
          </>
        )}
      </div>
    </Card>
  );
}
