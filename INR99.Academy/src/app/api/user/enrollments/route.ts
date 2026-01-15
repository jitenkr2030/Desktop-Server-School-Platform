import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/user/enrollments - Get all enrollments for the current user
export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all enrollments for this user
    const enrollments = await db.enrollment.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        enrolledAt: 'desc'
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                image: true
              }
            },
            _count: {
              select: {
                lessons: true,
                enrollments: true
              }
            }
          }
        },
        payment: {
          select: {
            id: true,
            amount: true,
            method: true,
            completedAt: true
          }
        }
      }
    })

    // Transform the results to include additional metadata
    const results = enrollments.map(enrollment => ({
      id: enrollment.id,
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt,
      enrollmentType: enrollment.enrollmentType,
      course: {
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        thumbnail: enrollment.course.thumbnail,
        instructor: enrollment.course.instructor,
        lessonCount: enrollment.course._count.lessons,
        enrolledCount: enrollment.course._count.enrollments
      },
      payment: enrollment.payment ? {
        id: enrollment.payment.id,
        amount: enrollment.payment.amount,
        method: enrollment.payment.method,
        completedAt: enrollment.payment.completedAt
      } : null
    }))

    return NextResponse.json({
      success: true,
      enrollments: results,
      totalCount: enrollments.length,
      activeCount: enrollments.filter(e => e.status === 'ACTIVE').length
    })

  } catch (error) {
    console.error('Get user enrollments error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
