import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/auth'

// GET /api/live-sessions/[id] - Get a specific live session
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const liveSession = await db.liveSession.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            instructor: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        attendances: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: {
            joinedAt: 'desc'
          }
        },
        _count: {
          select: {
            attendances: true
          }
        }
      }
    })

    if (!liveSession) {
      return NextResponse.json(
        { success: false, message: 'Live session not found' },
        { status: 404 }
      )
    }

    // Get current attendee count
    const currentAttendees = await db.attendance.count({
      where: {
        sessionId: id,
        status: { in: ['PRESENT', 'LATE'] }
      }
    })

    // Get user's attendance if logged in
    const session = await auth()
    let userAttendance = null

    if (session?.user) {
      userAttendance = await db.attendance.findUnique({
        where: {
          userId_sessionId: {
            userId: session.user.id,
            sessionId: id
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      session: {
        ...liveSession,
        currentAttendees,
        userAttendance
      }
    })

  } catch (error) {
    console.error('Get live session error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/live-sessions/[id] - Update a live session
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
    const body = await request.json()
    const {
      title,
      description,
      scheduledAt,
      duration,
      status,
      maxParticipants,
      isRecorded,
      metadata
    } = body

    // Check if session exists
    const existingSession = await db.liveSession.findUnique({
      where: { id }
    })

    if (!existingSession) {
      return NextResponse.json(
        { success: false, message: 'Live session not found' },
        { status: 404 }
      )
    }

    // Check if user is the host or admin
    const userRole = (session.user as any).role
    if (existingSession.hostId !== session.user.id && !['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      return NextResponse.json(
        { success: false, message: 'You can only update your own sessions' },
        { status: 403 }
      )
    }

    // Don't allow updates to completed or cancelled sessions
    if (['COMPLETED', 'CANCELLED'].includes(existingSession.status)) {
      return NextResponse.json(
        { success: false, message: 'Cannot update a completed or cancelled session' },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {}

    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (scheduledAt) updateData.scheduledAt = new Date(scheduledAt)
    if (duration) updateData.duration = parseInt(duration)
    if (status && ['SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED'].includes(status)) {
      updateData.status = status
      if (status === 'LIVE' && !existingSession.startedAt) {
        updateData.startedAt = new Date()
      }
      if (status === 'COMPLETED') {
        updateData.endedAt = new Date()
      }
    }
    if (maxParticipants !== undefined) updateData.maxParticipants = parseInt(maxParticipants) || null
    if (isRecorded !== undefined) updateData.isRecorded = isRecorded
    if (metadata) updateData.metadata = JSON.stringify(metadata)

    const updatedSession = await db.liveSession.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({
      success: true,
      message: 'Live session updated successfully',
      session: updatedSession
    })

  } catch (error) {
    console.error('Update live session error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/live-sessions/[id] - Delete a live session
export async function DELETE(
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

    // Check if session exists
    const existingSession = await db.liveSession.findUnique({
      where: { id }
    })

    if (!existingSession) {
      return NextResponse.json(
        { success: false, message: 'Live session not found' },
        { status: 404 }
      )
    }

    // Check if user is the host or admin
    const userRole = (session.user as any).role
    if (existingSession.hostId !== session.user.id && !['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      return NextResponse.json(
        { success: false, message: 'You can only delete your own sessions' },
        { status: 403 }
      )
    }

    // Delete the session (cascade will delete attendances)
    await db.liveSession.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Live session deleted successfully'
    })

  } catch (error) {
    console.error('Delete live session error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}
