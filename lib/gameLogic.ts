import { GAME_ITEMS } from './gameData';

export const ROUND_DURATION = 3000; // 3 seconds
export const COUNTDOWN_DURATION = 2000; // 2 seconds before round starts

export function validateAnswer(itemId: string, answer: 'up' | 'down'): boolean {
  const item = GAME_ITEMS.find(i => i.id === itemId);
  if (!item) return false;
  
  const expectedAnswer = item.canFly ? 'up' : 'down';
  return answer === expectedAnswer;
}

export function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function generatePlayerId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
