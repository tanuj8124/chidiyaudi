import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getRandomItem } from '@/lib/gameData';

export async function POST(request: NextRequest) {
  try {
    const { roomId, playerId } = await request.json();

    if (!roomId || !playerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDatabase();
    const room = await db.collection('rooms').findOne({ roomId });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // Only host can start game
    if (room.hostId !== playerId) {
      return NextResponse.json({ error: 'Only host can start game' }, { status: 403 });
    }



    // Get random item for first round
    const item = getRandomItem();

    // Update room status
    await db.collection('rooms').updateOne({ roomId }, {
      $set: {
        status: 'playing',
        currentRound: 1,
        currentItemId: item.id,
        roundStartTime: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ roomId, itemId: item.id }, { status: 200 });
  } catch (error) {
    console.error('Start game error:', error);
    return NextResponse.json({ error: 'Failed to start game' }, { status: 500 });
  }
}
