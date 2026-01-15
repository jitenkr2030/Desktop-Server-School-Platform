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

    // Get instructor courses first
    const instructorCourses = await db.course.findMany({
      where: { instructorId: user.id },
      select: { id: true }
    })

    const courseIds = instructorCourses.map(c => c.id)

    if (courseIds.length === 0) {
      return NextResponse.json({
        success: true,
        students: []
      })
    }

    // Get students enrolled in instructor's courses
    const students = await db.courseProgress.findMany({
      where: {
        courseId: {
          in: courseIds
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        course: {
          select: {
            id: true,
            title: true
          }
        }
      },
      distinct: ['userId'] // Get unique students
    })

    // Transform data for response
    const studentsData = students.map(progress => ({
      id: progress.user.id,
      name: progress.user.name || 'Student',
      email: progress.user.email || '',
      avatar: progress.user.avatar,
      enrolledCourses: 1, // This student is enrolled in at least this course
      lastActive: progress.lastAccess || progress.createdAt
    }))

    // Group by student and count total courses
    const studentMap = new Map()
    studentsData.forEach(student => {
      if (studentMap.has(student.id)) {
        const existing = studentMap.get(student.id)
        existing.enrolledCourses++
      } else {
        studentMap.set(student.id, student)
      }
    })

    const uniqueStudents = Array.from(studentMap.values())

    return NextResponse.json({
      success: true,
      students: uniqueStudents
    })

  } catch (error) {
    console.error('Get instructor students error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}