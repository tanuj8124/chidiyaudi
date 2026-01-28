import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { generatePlayerId } from '@/lib/gameLogic';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username || username.trim().length === 0) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const playerId = generatePlayerId();

    const user = {
      playerId,
      username: username.trim(),
      createdAt: new Date(),
    };

    const result = await db.collection('players').insertOne(user);

    return NextResponse.json({ playerId, username }, { status: 200 });
  } catch (error) {
    console.error('Guest login error:', error);
    return NextResponse.json({ error: 'Failed to create guest session' }, { status: 500 });
  }
}
