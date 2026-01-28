'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Copy, Check } from 'lucide-react'

interface Room {
  _id: string
  code: string
  hostName: string
  players: number
  maxPlayers: number
  status: string
}

interface RoomListProps {
  rooms: Room[]
  onJoinRoom: (roomId: string) => void
  onCreateRoom: () => void
  copiedCode: string | null
}

export function RoomList({
  rooms,
  onJoinRoom,
  onCreateRoom,
  copiedCode,
}: RoomListProps) {
  const [copied, setCopied] = useState(copiedCode)

  useEffect(() => {
    if (copiedCode) {
      setCopied(copiedCode)
      const timer = setTimeout(() => setCopied(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [copiedCode])

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No games available yet</p>
        <Button onClick={onCreateRoom} className="bg-green-600 hover:bg-green-700">
          Create Game
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Available Games</h2>
        <Button onClick={onCreateRoom} className="bg-green-600 hover:bg-green-700">
          Create Game
        </Button>
      </div>

      <div className="grid gap-4">
        {rooms.map((room) => (
          <Card key={room._id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold mb-2">{room.hostName}&apos;s Game</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {room.players}/{room.maxPlayers} players
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                        {room.code}
                      </span>
                      <button
                        onClick={() => copyToClipboard(room.code)}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Copy code"
                      >
                        {copied === room.code ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => onJoinRoom(room._id)}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={room.players >= room.maxPlayers}
                >
                  {room.players >= room.maxPlayers ? 'Full' : 'Join'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
