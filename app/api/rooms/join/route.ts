import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { roomId, playerId, playerName } = await request.json();

    if (!roomId || !playerId || !playerName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDatabase();
    const room = await db.collection('rooms').findOne({ roomId });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (room.status !== 'lobby') {
      return NextResponse.json({ error: 'Game already in progress' }, { status: 400 });
    }

    const existingPlayer = await db
      .collection('players')
      .findOne({ roomId, playerId });

    if (!existingPlayer) {
      await db.collection('players').insertOne({
        roomId,
        playerId,
        name: playerName,
        alive: true,
        score: 0,
        joinedAt: new Date(),
      });
    }

    return NextResponse.json({ roomId }, { status: 200 });
  } catch (error) {
    console.error('Join room error:', error);
    return NextResponse.json({ error: 'Failed to join room' }, { status: 500 });
  }
}
