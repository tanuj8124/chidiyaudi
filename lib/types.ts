import { ObjectId } from 'mongodb';

// User
export interface User {
  _id?: ObjectId;
  username: string;
  email?: string;
  passwordHash?: string;
  createdAt: Date;
}

// Room
export interface Room {
  _id?: ObjectId;
  roomId: string;
  hostId: string;
  hostName: string;
  status: 'lobby' | 'playing' | 'finished';
  currentRound: number;
  currentItemId?: string;
  maxPlayers: number;
  createdAt: Date;
  updatedAt: Date;
}

// Player in a room
export interface Player {
  _id?: ObjectId;
  roomId: string;
  playerId: string;
  name: string;
  alive: boolean;
  score: number;
  lastAnswer?: 'up' | 'down';
  lastAnswerCorrect?: boolean;
  joinedAt: Date;
}

// Game settings
export interface GameSettings {
  roundDuration: number; // milliseconds
  minPlayers: number;
  maxPlayers: number;
}
