import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/auth'

// GET /api/live-sessions - Get all live sessions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const hostId = searchParams.get('hostId')
    const courseId = searchParams.get('courseId')
    const upcoming = searchParams.get('upcoming') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (status && ['SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED'].includes(status)) {
      where.status = status
    }

    if (hostId) {
      where.hostId = hostId
    }

    if (courseId) {
      where.courseId = courseId
    }

    if (upcoming) {
      where.scheduledAt = { gte: new Date() }
      where.status = 'SCHEDULED'
    }

    // Get total count
    const total = await db.liveSession.count({ where })

    // Get sessions with host and attendance info
    const sessions = await db.liveSession.findMany({
      where,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true
          }
        },
        _count: {
          select: {
            attendances: true
          }
        }
      },
      orderBy: {
        scheduledAt: upcoming ? 'asc' : 'desc'
      },
      skip: offset,
      take: limit
    })

    // Add current participant count to each session
    const sessionsWithAttendance = await Promise.all(
      sessions.map(async (session) => {
        const currentAttendees = await db.attendance.count({
          where: {
            sessionId: session.id,
            status: { in: ['PRESENT', 'LATE'] }
          }
        })

        return {
          ...session,
          currentAttendees
        }
      })
    )

    return NextResponse.json({
      success: true,
      sessions: sessionsWithAttendance,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get live sessions error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/live-sessions - Create a new live session
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is an instructor or admin
    const userRole = (session.user as any).role
    if (!['INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      return NextResponse.json(
        { success: false, message: 'Only instructors can create live sessions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      scheduledAt,
      duration,
      courseId,
      maxParticipants,
      isRecorded,
      metadata
    } = body

    // Validate required fields
    if (!title || !scheduledAt || !duration) {
      return NextResponse.json(
        { success: false, message: 'Title, scheduled date, and duration are required' },
        { status: 400 }
      )
    }

    // Generate a unique room ID
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create the live session
    const liveSession = await db.liveSession.create({
      data: {
        title,
        description,
        scheduledAt: new Date(scheduledAt),
        duration: parseInt(duration),
        status: 'SCHEDULED',
        hostId: session.user.id,
        courseId,
        roomId,
        roomUrl: `/live/${roomId}`,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        isRecorded: isRecorded || false,
        metadata: metadata ? JSON.stringify(metadata) : null
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true
          }
        }
      }
    })

    // Log activity
    await db.userActivityLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE_DISCUSSION', // Using existing action until new one is used
        resourceType: 'live_session',
        resourceId: liveSession.id,
        details: JSON.stringify({ title: liveSession.title })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Live session created successfully',
      session: liveSession
    })

  } catch (error) {
    console.error('Create live session error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}
