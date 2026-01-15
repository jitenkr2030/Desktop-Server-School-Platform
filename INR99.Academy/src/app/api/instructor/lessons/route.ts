import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/instructor/lessons?courseId=xxx - List lessons for a course
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    // Verify the course belongs to this instructor
    const course = await db.course.findFirst({
      where: {
        id: courseId,
        instructorId: user.id
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 })
    }

    // Get lessons for the course
    const lessons = await db.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            progress: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      lessons
    })

  } catch (error) {
    console.error('Get instructor lessons error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/instructor/lessons - Create a new lesson
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const {
      courseId,
      title,
      content,
      videoUrl,
      audioUrl,
      pdfUrl,
      duration,
      order
    } = body

    // Validate required fields
    if (!courseId || !title || !content) {
      return NextResponse.json(
        { error: 'Course ID, title, and content are required' },
        { status: 400 }
      )
    }

    // Verify the course belongs to this instructor
    const course = await db.course.findFirst({
      where: {
        id: courseId,
        instructorId: user.id
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 })
    }

    // Get the next lesson order
    const lastLesson = await db.lesson.findFirst({
      where: { courseId },
      orderBy: { order: 'desc' }
    })

    const nextOrder = lastLesson ? lastLesson.order + 1 : 1

    // Create the lesson
    const newLesson = await db.lesson.create({
      data: {
        courseId,
        title,
        content,
        videoUrl,
        audioUrl,
        pdfUrl,
        duration: duration || 10,
        order: order || nextOrder,
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Lesson created successfully',
      lesson: newLesson
    })

  } catch (error) {
    console.error('Create instructor lesson error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
