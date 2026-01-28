import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getRandomItem } from '@/lib/gameData';

export async function POST(request: NextRequest) {
  try {
    const { roomId } = await request.json();

    if (!roomId) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const room = await db.collection('rooms').findOne({ roomId });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // Get new random item
    const item = getRandomItem();

    // Update room with new round
    await db.collection('rooms').updateOne({ roomId }, {
      $inc: { currentRound: 1 },
      $set: {
        currentItemId: item.id,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ itemId: item.id }, { status: 200 });
  } catch (error) {
    console.error('Next round error:', error);
    return NextResponse.json({ error: 'Failed to start next round' }, { status: 500 });
  }
}
