import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/auth'

// GET /api/live-sessions/[id]/attendance - Get attendance for a session
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // Build where clause
    const where: any = { sessionId: id }

    if (status && ['PRESENT', 'LATE', 'LEFT_EARLY', 'ABSENT'].includes(status)) {
      where.status = status
    }

    const attendances = await db.attendance.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true
          }
        }
      },
      orderBy: {
        joinedAt: 'desc'
      }
    })

    // Calculate statistics
    const stats = {
      total: attendances.length,
      present: attendances.filter(a => a.status === 'PRESENT').length,
      late: attendances.filter(a => a.status === 'LATE').length,
      leftEarly: attendances.filter(a => a.status === 'LEFT_EARLY').length,
      absent: attendances.filter(a => a.status === 'ABSENT').length,
      averageDuration: 0
    }

    // Calculate average duration (only for those who left)
    const durations = attendances
      .filter(a => a.duration !== null)
      .map(a => a.duration as number)

    if (durations.length > 0) {
      stats.averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length
    }

    return NextResponse.json({
      success: true,
      attendances,
      stats
    })

  } catch (error) {
    console.error('Get attendance error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/live-sessions/[id]/attendance - Join a live session
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { deviceInfo, ipAddress } = body

    // Check if session exists and is live
    const liveSession = await db.liveSession.findUnique({
      where: { id }
    })

    if (!liveSession) {
      return NextResponse.json(
        { success: false, message: 'Live session not found' },
        { status: 404 }
      )
    }

    if (liveSession.status !== 'LIVE' && liveSession.status !== 'SCHEDULED') {
      return NextResponse.json(
        { success: false, message: 'This session is not available for joining' },
        { status: 400 }
      )
    }

    // Check if session is full
    if (liveSession.maxParticipants) {
      const currentAttendees = await db.attendance.count({
        where: {
          sessionId: id,
          status: { in: ['PRESENT', 'LATE'] }
        }
      })

      if (currentAttendees >= liveSession.maxParticipants) {
        return NextResponse.json(
          { success: false, message: 'This session is full' },
          { status: 400 }
        )
      }
    }

    // Check if already joined
    const existingAttendance = await db.attendance.findUnique({
      where: {
        userId_sessionId: {
          userId: session.user.id,
          sessionId: id
        }
      }
    })

    if (existingAttendance && ['PRESENT', 'LATE'].includes(existingAttendance.status)) {
      return NextResponse.json({
        success: true,
        message: 'You have already joined this session',
        attendance: existingAttendance,
        isAlreadyJoined: true
      })
    }

    // Determine if late (if session started more than 10 minutes ago)
    const sessionStartTime = liveSession.startedAt || liveSession.scheduledAt
    const isLate = sessionStartTime && new Date() > new Date(sessionStartTime.getTime() + 10 * 60 * 1000)

    // Create or update attendance
    const attendance = await db.attendance.upsert({
      where: {
        userId_sessionId: {
          userId: session.user.id,
          sessionId: id
        }
      },
      create: {
        userId: session.user.id,
        sessionId: id,
        status: isLate ? 'LATE' : 'PRESENT',
        deviceInfo: deviceInfo ? JSON.stringify(deviceInfo) : null,
        ipAddress
      },
      update: {
        status: isLate ? 'LATE' : 'PRESENT',
        leftAt: null,
        duration: null,
        deviceInfo: deviceInfo ? JSON.stringify(deviceInfo) : null,
        ipAddress
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    // Update session status to LIVE if it was scheduled
    if (liveSession.status === 'SCHEDULED') {
      await db.liveSession.update({
        where: { id },
        data: {
          status: 'LIVE',
          startedAt: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the session',
      attendance
    })

  } catch (error) {
    console.error('Join session error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/live-sessions/[id]/attendance - Leave a live session
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    // Find existing attendance
    const existingAttendance = await db.attendance.findUnique({
      where: {
        userId_sessionId: {
          userId: session.user.id,
          sessionId: id
        }
      },
      include: {
        session: true
      }
    })

    if (!existingAttendance) {
      return NextResponse.json(
        { success: false, message: 'You have not joined this session' },
        { status: 404 }
      )
    }

    // Calculate duration
    const leftAt = new Date()
    const durationMs = leftAt.getTime() - existingAttendance.joinedAt.getTime()
    const durationMinutes = Math.round(durationMs / 60000)

    // Check if left early (session scheduled duration not complete)
    const sessionEndTime = new Date(
      (existingAttendance.session.startedAt || existingAttendance.session.scheduledAt).getTime() +
      existingAttendance.session.duration * 60000
    )
    const leftEarly = leftAt < sessionEndTime

    // Update attendance
    const updatedAttendance = await db.attendance.update({
      where: {
        userId_sessionId: {
          userId: session.user.id,
          sessionId: id
        }
      },
      data: {
        leftAt,
        duration: durationMinutes,
        status: leftEarly ? 'LEFT_EARLY' : 'PRESENT'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully left the session',
      attendance: updatedAttendance
    })

  } catch (error) {
    console.error('Leave session error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}
