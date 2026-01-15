import { NextRequest, NextResponse } from 'next/server'

// Simple static data for stats - no file system dependencies
export async function GET(request: NextRequest) {
  try {
    // Return static fallback data that works in any environment
    const stats = {
      courses: 150,
      learningPaths: 14,
      lessons: 1250,
      instructors: 25,
      users: 5000,
      totalDurationHours: 500,
      totalDurationMinutes: 30000
    }

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error', 
        error: error.message 
      },
      { status: 500 }
    )
  }
}