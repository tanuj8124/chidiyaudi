import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { validateAnswer, getRandomItem } from '@/lib/gameData';

export async function POST(request: NextRequest) {
  try {
    const { roomId, playerId, answer } = await request.json();

    if (!roomId || !playerId || !answer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDatabase();
    const room = await db.collection('rooms').findOne({ roomId });

    if (!room || !room.currentItemId) {
      return NextResponse.json({ error: 'Game not found or not in progress' }, { status: 400 });
    }

    const isCorrect = validateAnswer(room.currentItemId, answer);

    // Update player - DO NOT eliminate on wrong answer
    await db.collection('players').updateOne(
      { roomId, playerId },
      {
        $set: {
          lastAnswer: answer,
          lastAnswerCorrect: isCorrect,
          lastAnsweredItemId: room.currentItemId,
          updatedAt: new Date()
        },
        $inc: { score: isCorrect ? 10 : -5 }
      }
    );

    // Get current state
    const allPlayers = await db.collection('players').find({ roomId }).toArray();
    // In this mode, everyone stays "alive" until the end
    const alivePlayers = allPlayers;

    // Check if ALL players have answered the current item
    const currentItemAnsweredCount = allPlayers.filter(p =>
      p.lastAnsweredItemId === room.currentItemId
    ).length;

    if (currentItemAnsweredCount === allPlayers.length) {
      // Check if we reached the round limit (10 rounds)
      if (room.currentRound >= 10) {
        await db.collection('rooms').updateOne({ roomId }, {
          $set: { status: 'finished', updatedAt: new Date() },
        });

        const sortedPlayers = allPlayers.sort((a, b) => b.score - a.score);
        return NextResponse.json({
          isCorrect,
          gameEnded: true,
          winner: sortedPlayers[0],
        }, { status: 200 });
      }

      // Advance to next round
      const nextItem = getRandomItem();
      await db.collection('rooms').updateOne({ roomId }, {
        $set: {
          currentItemId: nextItem.id,
          currentRound: (room.currentRound || 0) + 1,
          updatedAt: new Date()
        }
      });
    }

    return NextResponse.json({
      isCorrect,
      gameEnded: false,
    }, { status: 200 });
  } catch (error) {
    console.error('Submit answer error:', error);
    return NextResponse.json({ error: 'Failed to submit answer' }, { status: 500 });
  }
}
