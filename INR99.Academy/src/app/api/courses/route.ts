import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { courses } from '@/lib/course-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const learningPathId = searchParams.get('learningPathId')
    const difficulty = searchParams.get('difficulty')
    const categoryId = searchParams.get('categoryId')
    const vertical = searchParams.get('vertical') // school, college, pg, professional
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
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

    // Try to fetch from database, but fallback gracefully if it fails
    let dbCourses: typeof courses = []
    let total = 0
    
    try {
      // Fetch courses with Prisma including related data
      const [dbCoursesResult, totalResult] = await Promise.all([
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
            class: {
              select: {
                id: true,
                name: true,
                level: true,
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
      
      dbCourses = dbCoursesResult
      total = totalResult
    } catch (dbError) {
      console.warn('Database connection failed, using static courses only:', dbError)
      // Continue with empty dbCourses - will use only static courses
    }

    // Map database courses to include lessonCount and assessmentCount dynamically
    const dbCoursesWithDetails = dbCourses.map(course => ({
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
      source: 'database' as const,
      classId: course.classId,
      className: course.class?.name || null,
      classLevel: course.class?.level || null,
    }))

    // Get static courses from course-data.ts
    let staticCourses = courses

    // Filter by vertical if specified
    if (vertical) {
      staticCourses = staticCourses.filter(course => course.vertical === vertical)
    }

    // Add source property to static courses
    const staticCoursesWithDetails = staticCourses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      difficulty: course.difficulty.toUpperCase(),
      duration: course.totalDuration,
      instructor: course.instructor,
      learningPath: null, // Static courses don't have learning path in the same way
      lessonCount: course.lessonCount,
      assessmentCount: 0,
      createdAt: course.createdAt,
      pricing: {
        type: course.price === 0 ? 'free' : 'paid',
        price: course.price,
        currency: course.currency,
        period: 'one-time',
        description: course.price === 0 ? 'Free course' : `Course available at INR ${course.price}`,
      },
      source: 'static' as const,
      vertical: course.vertical,
      category: course.category,
      tags: course.tags,
    }))

    // Combine database and static courses
    // If database has courses, prioritize those and append static ones
    // If no database courses, return all static courses matching the filter
    let allCourses = [...dbCoursesWithDetails]
    
    // Add static courses that don't already exist in database
    const dbCourseIds = new Set(dbCoursesWithDetails.map(c => c.id))
    const uniqueStaticCourses = staticCoursesWithDetails.filter(c => !dbCourseIds.has(c.id))
    
    allCourses = [...allCourses, ...uniqueStaticCourses]

    // Apply difficulty filter to combined results
    if (difficulty && ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(difficulty)) {
      allCourses = allCourses.filter(course => course.difficulty === difficulty)
    }

    return NextResponse.json({
      success: true,
      courses: allCourses,
      pagination: {
        page,
        limit,
        total: allCourses.length,
        totalPages: Math.ceil(allCourses.length / limit),
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
