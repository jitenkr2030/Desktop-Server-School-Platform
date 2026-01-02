import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const learningPathId = searchParams.get('learningPathId')
    const difficulty = searchParams.get('difficulty')
    const categoryId = searchParams.get('categoryId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    // Build where clause for filtering
    const where: Record<string, unknown> = {
      isActive: true,
    }

    if (learningPathId) {
      where.learningPathId = learningPathId
    }

    if (difficulty && ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(difficulty)) {
      where.difficulty = difficulty
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    // Fetch courses with Prisma including related data
    const [courses, total] = await Promise.all([
      db.course.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              // title field removed - not available in current Prisma schema
              avatar: true,
              expertise: true,
            },
          },
          learningPath: {
            select: {
              id: true,
              title: true,
              color: true,
              icon: true,
            },
          },
          _count: {
            select: {
              lessons: true,
              assessments: true,
            },
          },
        },
      }),
      db.course.count({ where }),
    ])

    // Map courses to include lessonCount and assessmentCount dynamically
    const coursesWithDetails = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      difficulty: course.difficulty,
      duration: course.duration,
      instructor: course.instructor,
      learningPath: course.learningPath,
      lessonCount: course._count.lessons,
      assessmentCount: course._count.assessments,
      createdAt: course.createdAt,
      pricing: {
        type: 'subscription',
        price: 99,
        currency: 'INR',
        period: 'month',
        description: 'Subscribe at INR 99/month to access all courses',
      },
    }))

    return NextResponse.json({
      success: true,
      courses: coursesWithDetails,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })

  } catch (error) {
    console.error('Get courses error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : ''
    console.error('Error stack:', errorStack)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: errorMessage, details: errorStack },
      { status: 500 }
    )
  }
}