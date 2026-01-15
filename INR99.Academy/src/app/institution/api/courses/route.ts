import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const db = createClient()

    // Build filter for INR99 Academy content
    // In production, courses would have a source field to identify INR99 content
    const where: any = {
      isActive: true,
      isPublished: true,
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category) {
      where.category = { slug: category }
    }

    if (level) {
      where.difficulty = level.toUpperCase()
    }

    const [courses, total] = await Promise.all([
      db.course.findMany({
        where,
        include: {
          category: true,
          subCategory: true,
          instructor: true,
          _count: {
            select: {
              lessons: true,
              progress: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.course.count({ where }),
    ])

    // Group courses by type for organization
    const coursesByType = courses.reduce((acc, course) => {
      const type = course.courseType || 'GENERAL'
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(course)
      return acc
    }, {} as Record<string, typeof courses>)

    return NextResponse.json({
      success: true,
      courses,
      coursesByType,
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
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
