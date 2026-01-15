import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { db } from '@/lib/db'

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

    // Get instructor courses
    const courses = await db.course.findMany({
      where: { instructorId: user.id },
      include: {
        _count: {
          select: {
            lessons: true,
            progress: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      courses
    })

  } catch (error) {
    console.error('Get instructor courses error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
      title,
      description,
      thumbnail,
      difficulty,
      duration,
      categoryId,
      subCategoryId,
      learningPathId
    } = body

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' }, 
        { status: 400 }
      )
    }

    // Create new course
    const newCourse = await db.course.create({
      data: {
        title,
        description,
        thumbnail,
        difficulty: difficulty || 'BEGINNER',
        duration: duration || 0,
        categoryId,
        subCategoryId,
        learningPathId,
        instructorId: user.id,
        isActive: false // New courses start as drafts
      },
      include: {
        _count: {
          select: {
            lessons: true,
            progress: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Course created successfully',
      course: newCourse
    })

  } catch (error) {
    console.error('Create instructor course error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}