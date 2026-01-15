import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const lessonId = searchParams.get('lessonId')
    const type = searchParams.get('type')

    // Build where clause based on filters
    const where: any = {
      isActive: true
    }

    if (courseId) {
      where.courseId = courseId
    }

    if (lessonId) {
      where.lessonId = lessonId
    }

    if (type) {
      where.type = type
    }

    // Fetch assessments with questions
    const assessments = await db.assessment.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        },
        lesson: {
          select: {
            id: true,
            title: true,
            order: true
          }
        },
        questions: {
          where: {
            isActive: true
          },
          orderBy: {
            order: 'asc'
          }
        },
        _count: {
          select: {
            questions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the response
    const transformedAssessments = assessments.map(assessment => ({
      id: assessment.id,
      title: assessment.title,
      type: assessment.type,
      course: assessment.course,
      lesson: assessment.lesson,
      questionCount: assessment._count.questions,
      createdAt: assessment.createdAt
    }))

    return NextResponse.json({
      success: true,
      assessments: transformedAssessments
    })

  } catch (error) {
    console.error('Get assessments error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}