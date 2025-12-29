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
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}