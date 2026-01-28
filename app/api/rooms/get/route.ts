import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const roomId = request.nextUrl.searchParams.get('roomId');

    if (!roomId) {
      const db = await getDatabase();
      const rooms = await db.collection('rooms')
        .find({ status: { $ne: 'finished' } })
        .sort({ createdAt: -1 })
        .limit(20)
        .toArray();
      return NextResponse.json({ rooms }, { status: 200 });
    }

    const db = await getDatabase();
    const room = await db.collection('rooms').findOne({ roomId });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const players = await db.collection('players').find({ roomId }).toArray();

    return NextResponse.json({ room, players }, { status: 200 });
  } catch (error) {
    console.error('Get room error:', error);
    return NextResponse.json({ error: 'Failed to fetch room' }, { status: 500 });
  }
}
