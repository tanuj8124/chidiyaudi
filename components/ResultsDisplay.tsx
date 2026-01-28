'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Users } from 'lucide-react'

interface ResultsDisplayProps {
  scores: Array<{
    playerId: string
    name: string
    score: number
  }>
  onNextRound: () => void
  onBackToLobby: () => void
}

export function ResultsDisplay({
  scores,
  onNextRound,
  onBackToLobby,
}: ResultsDisplayProps) {
  const sortedScores = [...scores].sort((a, b) => b.score - a.score)
  const winner = sortedScores[0]

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Trophy className="w-12 h-12 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">Round Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg mb-2">
            <span className="font-bold text-xl text-yellow-600">{winner.name}</span>
          </p>
          <p className="text-gray-600">wins with {winner.score} point{winner.score !== 1 ? 's' : ''}!</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Final Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedScores.map((score, index) => (
              <div
                key={score.playerId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg w-6">{index + 1}.</span>
                  <span className="font-medium">{score.name}</span>
                </div>
                <span className="font-bold text-lg text-blue-600">{score.score}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          onClick={onNextRound}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Next Round
        </Button>
        <Button
          onClick={onBackToLobby}
          variant="outline"
          className="flex-1 bg-transparent"
        >
          Back to Lobby
        </Button>
      </div>
    </div>
  )
}
