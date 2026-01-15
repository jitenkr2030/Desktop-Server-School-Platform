import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/instructor/assessments?courseId=xxx - List assessments for a course
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
    const lessonId = searchParams.get('lessonId')

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

    // Build where clause
    const where: any = {
      courseId
    }

    if (lessonId) {
      where.lessonId = lessonId
    }

    // Get assessments for the course
    const assessments = await db.assessment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        },
        lesson: {
          select: {
            id: true,
            title: true,
            order: true
          }
        },
        _count: {
          select: {
            questions: true,
            userResults: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      assessments
    })

  } catch (error) {
    console.error('Get instructor assessments error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/instructor/assessments - Create a new assessment
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
      lessonId,
      title,
      description,
      type,
      passingScore,
      timeLimit,
      questions
    } = body

    // Validate required fields
    if (!courseId || !title || !type) {
      return NextResponse.json(
        { error: 'Course ID, title, and type are required' },
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

    // If lessonId is provided, verify it belongs to the course
    if (lessonId) {
      const lesson = await db.lesson.findFirst({
        where: {
          id: lessonId,
          courseId
        }
      })

      if (!lesson) {
        return NextResponse.json({ error: 'Lesson not found or access denied' }, { status: 404 })
      }
    }

    // Create the assessment
    const newAssessment = await db.assessment.create({
      data: {
        courseId,
        lessonId: lessonId || null,
        title,
        description: description || '',
        type: type || 'QUIZ',
        passingScore: passingScore || 70,
        timeLimit: timeLimit || null,
        isActive: true,
        questions: questions ? {
          create: questions.map((q: any, index: number) => ({
            question: q.question,
            type: q.type || 'MULTIPLE_CHOICE',
            options: q.options ? JSON.stringify(q.options) : null,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || null,
            order: index + 1,
            points: q.points || 1,
            isActive: true
          }))
        } : undefined
      },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Assessment created successfully',
      assessment: newAssessment
    })

  } catch (error) {
    console.error('Create instructor assessment error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
