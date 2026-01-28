import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function initializeSocket(): Socket {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('[Socket] Disconnected');
  });

  socket.on('error', (error) => {
    console.error('[Socket] Error:', error);
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// Socket event types
export const SOCKET_EVENTS = {
  // Room events
  ROOM_JOINED: 'room:joined',
  ROOM_LEFT: 'room:left',
  PLAYERS_UPDATED: 'players:updated',
  ROOM_STATUS_CHANGED: 'room:status_changed',

  // Game events
  ROUND_STARTED: 'game:round_started',
  ITEM_SHOWN: 'game:item_shown',
  PLAYER_ANSWERED: 'game:player_answered',
  PLAYER_ELIMINATED: 'game:player_eliminated',
  ROUND_ENDED: 'game:round_ended',
  GAME_ENDED: 'game:game_ended',

  // Game control
  START_GAME: 'game:start',
  SUBMIT_ANSWER: 'game:submit_answer',
};
