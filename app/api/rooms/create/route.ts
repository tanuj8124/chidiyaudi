import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { generateRoomCode } from '@/lib/gameLogic';

export async function POST(request: NextRequest) {
  try {
    const { playerId, playerName } = await request.json();

    if (!playerId || !playerName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDatabase();
    const roomId = generateRoomCode();

    const room = {
      roomId,
      hostId: playerId,
      hostName: playerName,
      status: 'lobby',
      currentRound: 0,
      maxPlayers: 8,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('rooms').insertOne(room);

    // Auto-join host as player so they can play
    await db.collection('players').insertOne({
      roomId,
      playerId,
      name: playerName,
      alive: true,
      score: 0,
      joinedAt: new Date(),
    });

    return NextResponse.json({ roomId }, { status: 201 });
  } catch (error) {
    console.error('Create room error:', error);
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}
