import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/user/progress/courses - Get enrolled courses with progress
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user's course progress records
    const progressRecords = await db.courseProgress.findMany({
      where: { userId },
      select: {
        courseId: true,
        progress: true,
        completed: true,
        lastAccess: true
      }
    })

    if (progressRecords.length === 0) {
      // Return empty array if no progress records
      return NextResponse.json({
        success: true,
        courses: []
      })
    }

    // Get course details for enrolled courses
    const courseIds = progressRecords.map(p => p.courseId)
    const courses = await db.course.findMany({
      where: {
        id: { in: courseIds }
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        _count: {
          select: {
            lessons: true
          }
        }
      }
    })

    // Merge course data with progress data
    const enrichedCourses = courses.map(course => {
      const progress = progressRecords.find(p => p.courseId === course.id)
      return {
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        difficulty: course.difficulty,
        duration: course.duration,
        instructor: course.instructor,
        _count: course._count,
        progress: progress ? {
          progress: progress.progress,
          completed: progress.completed,
          lastAccess: progress.lastAccess.toISOString()
        } : undefined
      }
    })

    return NextResponse.json({
      success: true,
      courses: enrichedCourses
    })

  } catch (error) {
    console.error('Get enrolled courses error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
