import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/enrollments - Get enrollments for a course (instructor view)
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

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    // Verify the course belongs to this instructor
    const course = await db.course.findFirst({
      where: {
        id: courseId,
        instructorId: user.id
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 })
    }

    // Get enrollments for the course
    const enrollments = await db.enrollment.findMany({
      where: {
        courseId
      },
      orderBy: {
        enrolledAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        payment: {
          select: {
            id: true,
            amount: true,
            status: true,
            method: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      enrollments,
      totalCount: enrollments.length,
      activeCount: enrollments.filter(e => e.status === 'ACTIVE').length
    })

  } catch (error) {
    console.error('Get enrollments error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/enrollments - Create an enrollment (with mock payment)
export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { courseId, paymentMethod, paymentAmount } = body

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    // Get the course
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        price: true
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Check if user is already enrolled
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId
        }
      }
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      )
    }

    // Check if course is free
    const isFreeCourse = course.price === 0 || course.price === null

    // Process mock payment for paid courses
    let payment = null
    if (!isFreeCourse) {
      // Create a mock payment record
      payment = await db.payment.create({
        data: {
          userId: user.id,
          courseId,
          amount: paymentAmount || course.price,
          currency: 'USD',
          status: 'COMPLETED',
          method: paymentMethod || 'CREDIT_CARD',
          transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }
      })
    }

    // Create the enrollment
    const enrollment = await db.enrollment.create({
      data: {
        userId: user.id,
        courseId,
        status: 'ACTIVE',
        enrollmentType: isFreeCourse ? 'FREE' : 'PAID'
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            price: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: isFreeCourse 
        ? 'Successfully enrolled in free course' 
        : 'Payment successful and enrolled in course',
      enrollment,
      payment
    })

  } catch (error) {
    console.error('Create enrollment error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
