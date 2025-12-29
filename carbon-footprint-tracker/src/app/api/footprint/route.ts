import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      userId,
      userName,
      totalFootprint,
      dietFootprint,
      transportFootprint,
      energyFootprint,
      digitalFootprint,
    } = body

    // Validate required fields
    if (!userName || totalFootprint === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get current week number and year
    const now = new Date()
    const weekNumber = getWeekNumber(now)
    const year = now.getFullYear()

    // Check if user already has a footprint for this week
    const existingFootprint = await db.carbonFootprint.findFirst({
      where: {
        userId: userId || null,
        userName,
        weekNumber,
        year,
      },
    })

    let footprint
    if (existingFootprint) {
      // Update existing footprint
      footprint = await db.carbonFootprint.update({
        where: { id: existingFootprint.id },
        data: {
          totalFootprint,
          dietFootprint,
          transportFootprint,
          energyFootprint,
          digitalFootprint,
          updatedAt: new Date(),
        },
      })
    } else {
      // Create new footprint entry
      footprint = await db.carbonFootprint.create({
        data: {
          userId,
          userName,
          totalFootprint,
          dietFootprint,
          transportFootprint,
          energyFootprint,
          digitalFootprint,
          weekNumber,
          year,
        },
      })
    }

    // Update leaderboard
    await updateLeaderboard(weekNumber, year)

    return NextResponse.json({
      success: true,
      footprint,
    })
  } catch (error) {
    console.error('Error saving footprint:', error)
    return NextResponse.json(
      { error: 'Failed to save footprint' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const userName = searchParams.get('userName')

    if (!userName) {
      return NextResponse.json(
        { error: 'userName parameter is required' },
        { status: 400 }
      )
    }

    // Get current week number and year
    const now = new Date()
    const weekNumber = getWeekNumber(now)
    const year = now.getFullYear()

    // Fetch user's footprints
    const footprints = await db.carbonFootprint.findMany({
      where: {
        OR: [
          { userId: userId || undefined },
          { userName },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 12, // Last 12 entries
    })

    return NextResponse.json({
      success: true,
      footprints,
      currentWeek: {
        footprints: footprints.filter(
          f => f.weekNumber === weekNumber && f.year === year
        ),
      },
    })
  } catch (error) {
    console.error('Error fetching footprints:', error)
    return NextResponse.json(
      { error: 'Failed to fetch footprints' },
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

// Helper function to update leaderboard
async function updateLeaderboard(weekNumber: number, year: number) {
  // Get all footprints for this week
  const footprints = await db.carbonFootprint.findMany({
    where: {
      weekNumber,
      year,
    },
    orderBy: {
      totalFootprint: 'asc',
    },
  })

  // Calculate baseline (average of all entries or fixed target)
  const baselineFootprint = 25 // Sustainable target in kg CO2e

  // Clear existing leaderboard entries for this week
  await db.leaderboardEntry.deleteMany({
    where: { weekNumber, year },
  })

  // Create new leaderboard entries
  const leaderboardEntries = footprints.map((footprint, index) => {
    const reduction = Math.max(0, ((baselineFootprint - footprint.totalFootprint) / baselineFootprint) * 100)

    return {
      userId: footprint.userId,
      userName: footprint.userName,
      avatar: getAvatarForUser(footprint.userName, index),
      reduction,
      totalFootprint: footprint.totalFootprint,
      position: index + 1,
      weekNumber,
      year,
    }
  })

  // Sort by reduction percentage
  leaderboardEntries.sort((a, b) => b.reduction - a.reduction)

  // Reassign positions
  leaderboardEntries.forEach((entry, index) => {
    entry.position = index + 1
  })

  // Create entries in database
  await db.leaderboardEntry.createMany({
    data: leaderboardEntries,
  })
}

// Helper function to assign avatars
function getAvatarForUser(userName: string, index: number): string {
  const avatars = ['🌱', '🌿', '🍃', '🌲', '🌍', '🌊', '☀️', '🌙']
  return avatars[index % avatars.length]
}