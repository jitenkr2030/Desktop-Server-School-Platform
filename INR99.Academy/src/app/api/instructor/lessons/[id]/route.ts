import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/instructor/lessons/[id] - Get single lesson
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is an instructor
    const currentUser = await db.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (!currentUser || (currentUser.role !== 'INSTRUCTOR' && currentUser.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const lessonId = (await params).id

    // Get the lesson and verify ownership
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructorId: true
          }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Verify the course belongs to this instructor
    if (lesson.course.instructorId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      lesson
    })

  } catch (error) {
    console.error('Get instructor lesson error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/instructor/lessons/[id] - Update a lesson
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is an instructor
    const currentUser = await db.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (!currentUser || (currentUser.role !== 'INSTRUCTOR' && currentUser.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const lessonId = (await params).id

    // Get the lesson and verify ownership
    const existingLesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: {
            id: true,
            instructorId: true
          }
        }
      }
    })

    if (!existingLesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Verify the course belongs to this instructor
    if (existingLesson.course.instructorId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      content,
      videoUrl,
      audioUrl,
      pdfUrl,
      duration,
      order,
      isActive
    } = body

    // Update the lesson
    const updatedLesson = await db.lesson.update({
      where: { id: lessonId },
      data: {
        title: title || existingLesson.title,
        content: content || existingLesson.content,
        videoUrl: videoUrl !== undefined ? videoUrl : existingLesson.videoUrl,
        audioUrl: audioUrl !== undefined ? audioUrl : existingLesson.audioUrl,
        pdfUrl: pdfUrl !== undefined ? pdfUrl : existingLesson.pdfUrl,
        duration: duration || existingLesson.duration,
        order: order || existingLesson.order,
        isActive: isActive !== undefined ? isActive : existingLesson.isActive
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Lesson updated successfully',
      lesson: updatedLesson
    })

  } catch (error) {
    console.error('Update instructor lesson error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/instructor/lessons/[id] - Delete a lesson
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is an instructor
    const currentUser = await db.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (!currentUser || (currentUser.role !== 'INSTRUCTOR' && currentUser.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const lessonId = (await params).id

    // Get the lesson and verify ownership
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: {
            id: true,
            instructorId: true
          }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Verify the course belongs to this instructor
    if (lesson.course.instructorId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Delete the lesson (cascades to related records)
    await db.lesson.delete({
      where: { id: lessonId }
    })

    return NextResponse.json({
      success: true,
      message: 'Lesson deleted successfully'
    })

  } catch (error) {
    console.error('Delete instructor lesson error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
