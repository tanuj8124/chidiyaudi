'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RoomList } from '@/components/RoomList'
import { Plus, LogOut } from 'lucide-react'

interface Room {
  _id: string
  code: string
  hostName: string
  players: number
  maxPlayers: number
  status: string
}

export default function RoomsPage() {
  const router = useRouter()
  const { playerId, playerName, logout } = useAuth()
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    if (!playerId) {
      router.push('/')
      return
    }
    fetchRooms()
  }, [playerId, router])

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms/get')
      const data = await response.json()
      setRooms(data.rooms || [])
    } catch (error) {
      console.error('Failed to fetch rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRoom = async () => {
    try {
      const response = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          playerName,
        }),
      })

      const data = await response.json()
      if (data.roomId) {
        router.push(`/lobby/${data.roomId}`)
      }
    } catch (error) {
      console.error('Failed to create room:', error)
    }
  }

  const handleJoinRoom = async (roomId: string) => {
    try {
      const response = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          playerId,
          playerName,
        }),
      })

      if (response.ok) {
        router.push(`/lobby/${roomId}`)
      }
    } catch (error) {
      console.error('Failed to join room:', error)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🐦</div>
          <p className="text-gray-600">Loading games...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Chidiya Ud</h1>
            <p className="text-gray-600">Welcome, {playerName}!</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2 bg-transparent"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <Card className="mb-8 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎮</span>
              Join or Create a Game
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RoomList
              rooms={rooms}
              onJoinRoom={handleJoinRoom}
              onCreateRoom={handleCreateRoom}
              copiedCode={copiedCode}
            />
          </CardContent>
        </Card>

        <Card className="bg-white bg-opacity-80">
          <CardHeader>
            <CardTitle className="text-lg">How to Play</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p>📋 <span className="font-medium">Rules:</span> A random sentence appears with one word replaced by a bird emoji. Guess the word as fast as possible to score points.</p>
            <p>⚡ <span className="font-medium">Scoring:</span> Correct answers give you 100 points minus 1 point per second taken.</p>
            <p>👥 <span className="font-medium">Multiplayer:</span> Compete with friends in real-time!</p>
            <p>🔄 <span className="font-medium">Rounds:</span> Best of 5 rounds. The player with the most points wins!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
