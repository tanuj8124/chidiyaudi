import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ROUND_DURATION } from '@/lib/gameLogic';
import { getRandomItem } from '@/lib/gameData';

export async function GET(request: NextRequest) {
  try {
    const roomId = request.nextUrl.searchParams.get('roomId');
    const playerId = request.nextUrl.searchParams.get('playerId');

    const db = await getDatabase();

    if (!roomId) {
      const rooms = await db.collection('rooms')
        .find({ status: { $ne: 'finished' } })
        .sort({ createdAt: -1 })
        .limit(20)
        .toArray();
      return NextResponse.json({ rooms }, { status: 200 });
    }

    // Update player heartbeat
    if (playerId) {
      await db.collection('players').updateOne(
        { roomId, playerId },
        { $set: { lastActive: new Date() } }
      );
    }

    let room = await db.collection('rooms').findOne({ roomId });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // --- LAZY TIMEOUT CHECK ---
    // If we are playing, check if the round duration has exceeded significantly
    // Logic: roundStartTime + duration + 2s buffer (to allow latencies and animations)
    // If passed, we force-advance the round.
    if (room.status === 'playing' && room.roundStartTime) {
      const now = new Date();
      const roundStart = new Date(room.roundStartTime);
      const elapsed = now.getTime() - roundStart.getTime();
      const TIMEOUT_BUFFER = 2000; // 2 seconds extra before server forces it

      if (elapsed > (ROUND_DURATION + TIMEOUT_BUFFER)) {
        // Round timed out! Force advance.

        if (room.currentRound >= 10) {
          // End Game
          await db.collection('rooms').updateOne({ roomId }, {
            $set: { status: 'finished', updatedAt: new Date() },
          });
          room.status = 'finished'; // Update local object for return
        } else {
          // Next Round
          const nextItem = getRandomItem();
          await db.collection('rooms').updateOne({ roomId }, {
            $set: {
              currentItemId: nextItem.id,
              currentRound: (room.currentRound || 0) + 1,
              roundStartTime: new Date(),
              updatedAt: new Date()
            }
          });

          // Update local object for return
          room.currentItemId = nextItem.id;
          room.currentRound = (room.currentRound || 0) + 1;
          room.roundStartTime = new Date();
        }
      }
    }

    const players = await db.collection('players').find({ roomId }).toArray();

    return NextResponse.json({ room, players }, { status: 200 });
  } catch (error) {
    console.error('Get room error:', error);
    return NextResponse.json({ error: 'Failed to fetch room' }, { status: 500 });
  }
}
