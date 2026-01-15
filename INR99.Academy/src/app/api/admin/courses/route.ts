import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user || user.id !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit
    const search = searchParams.get('search') || ''

    const whereClause = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        }
      : {}

    const courses = await db.course.findMany({
      where: whereClause,
      include: {
        instructor: {
          select: {
            id: true,
            name: true
          }
        },
        learningPath: {
          select: {
            id: true,
            title: true
          }
        },
        _count: {
          select: {
            lessons: true,
            progress: true,
            assessments: true,
            discussions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit
    })

    const total = await db.course.count({
      where: whereClause
    })

    return NextResponse.json({
      courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user || user.id !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, difficulty, duration, instructorId, learningPathId, thumbnail } = await request.json()

    if (!title || !description || !difficulty || !duration || !instructorId) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 })
    }

    // Verify instructor exists
    const instructor = await db.instructor.findUnique({
      where: { id: instructorId }
    })

    if (!instructor) {
      return NextResponse.json({ error: 'Instructor not found' }, { status: 404 })
    }

    const course = await db.course.create({
      data: {
        title,
        description,
        difficulty,
        duration,
        instructorId,
        learningPathId,
        thumbnail
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true
          }
        },
        learningPath: {
          select: {
            id: true,
            title: true
          }
        },
        _count: {
          select: {
            lessons: true,
            progress: true,
            assessments: true,
            discussions: true
          }
        }
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user || user.id !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId, title, description, difficulty, duration, isActive, learningPathId, thumbnail } = await request.json()

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (difficulty !== undefined) updateData.difficulty = difficulty
    if (duration !== undefined) updateData.duration = duration
    if (isActive !== undefined) updateData.isActive = isActive
    if (learningPathId !== undefined) updateData.learningPathId = learningPathId
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail

    const course = await db.course.update({
      where: { id: courseId },
      data: updateData,
      include: {
        instructor: {
          select: {
            id: true,
            name: true
          }
        },
        learningPath: {
          select: {
            id: true,
            title: true
          }
        },
        _count: {
          select: {
            lessons: true,
            progress: true,
            assessments: true,
            discussions: true
          }
        }
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user || user.id !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    await db.course.delete({
      where: { id: courseId }
    })

    return NextResponse.json({ message: 'Course deleted successfully' })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
