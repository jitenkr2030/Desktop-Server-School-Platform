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
      }
    })

    // Calculate stats
    const totalCourses = courses.length
    const publishedCourses = courses.filter(c => c.isActive).length
    const pendingCourses = courses.filter(c => !c.isActive).length
    const totalStudents = courses.reduce((sum, course) => sum + course._count.progress, 0)
    
    // Mock earnings and rating (would be calculated from actual data)
    const totalEarnings = totalStudents * 25 // Mock: ₹25 per student
    const averageRating = 4.2 // Mock rating

    const stats = {
      totalCourses,
      publishedCourses,
      pendingCourses,
      totalStudents,
      totalEarnings,
      averageRating
    }

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Get instructor stats error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}