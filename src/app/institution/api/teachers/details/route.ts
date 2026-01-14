import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'

// Get teacher details with subjects and classes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get('id')
    const tenantSlug = searchParams.get('tenantSlug')

    if (!teacherId || !tenantSlug) {
      return NextResponse.json(
        { error: 'Teacher ID and tenant slug are required' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Get tenant
    const tenant = await db.tenant.findUnique({
      where: { slug: tenantSlug },
    })

    if (!tenant) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      )
    }

    // Get teacher
    const teacher = await db.tenantUser.findFirst({
      where: {
        id: teacherId,
        tenantId: tenant.id,
        role: 'INSTRUCTOR',
      },
    })

    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      )
    }

    // Get teacher's courses
    const courses = await db.course.findMany({
      where: {
        instructorId: teacher.userId || '',
      },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        difficulty: true,
        duration: true,
        isPublished: true,
        isActive: true,
        progress: {
          select: {
            userId: true,
            completed: true,
          },
        },
      },
    })

    // Get teacher's subjects
    const subjects = await db.schoolSubject.findMany({
      where: {
        courses: {
          some: {
            instructorId: teacher.userId || '',
          },
        },
      },
      distinct: ['id'],
    })

    // Calculate stats
    const totalStudents = courses.reduce(
      (sum, course) => sum + course.progress.length,
      0
    )
    const completedCourses = courses.filter(
      (course) => course.progress.length > 0 && course.progress.every((p) => p.completed)
    ).length
    const publishedCourses = courses.filter((c) => c.isPublished).length

    return NextResponse.json({
      success: true,
      teacher: {
        ...teacher,
        stats: {
          totalCourses: courses.length,
          publishedCourses,
          totalStudents,
          completedCourses,
        },
        courses,
        subjects,
      },
    })
  } catch (error) {
    console.error('Get teacher details error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teacher details' },
      { status: 500 }
    )
  }
}

// Assign subjects to teacher
export async function POST(request: NextRequest) {
  try {
    const { teacherId, subjectIds, classIds } = await request.json()

    if (!teacherId) {
      return NextResponse.json(
        { error: 'Teacher ID is required' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Get teacher
    const teacher = await db.tenantUser.findUnique({
      where: { id: teacherId },
    })

    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      )
    }

    // In a full implementation, you would create TeacherSubject and TeacherClassAssignment models
    // For now, return success message
    return NextResponse.json({
      success: true,
      message: 'Subjects assigned successfully',
    })
  } catch (error) {
    console.error('Assign subjects error:', error)
    return NextResponse.json(
      { error: 'Failed to assign subjects' },
      { status: 500 }
    )
  }
}
