import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam) : 10

    // Get current week number and year
    const now = new Date()
    const weekNumber = getWeekNumber(now)
    const year = now.getFullYear()

    // Fetch leaderboard entries for current week
    const leaderboard = await db.leaderboardEntry.findMany({
      where: {
        weekNumber,
        year,
      },
      orderBy: [
        { position: 'asc' },
        { reduction: 'desc' },
      ],
      take: limit,
    })

    return NextResponse.json({
      success: true,
      leaderboard,
      weekInfo: {
        weekNumber,
        year,
      },
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}

// Helper function to get week number
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}