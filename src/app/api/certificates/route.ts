import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUser } from '@/lib/auth'

// GET /api/certificates - Get certificates for the current user
export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const certificates = await db.certificate.findMany({
      where: {
        userId: user.id
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            difficulty: true,
            thumbnail: true,
            instructor: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        issuedAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      certificates
    })

  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/certificates - Generate a certificate for a completed course
export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      )
    }

    // Check if user has completed the course
    const courseProgress = await db.courseProgress.findFirst({
      where: {
        userId: user.id,
        courseId: courseId,
        completed: true
      }
    })

    if (!courseProgress) {
      return NextResponse.json(
        { error: 'Course not completed. You must complete all lessons to earn a certificate.' },
        { status: 400 }
      )
    }

    // Check if certificate already exists
    const existingCertificate = await db.certificate.findFirst({
      where: {
        userId: user.id,
        courseId: courseId
      }
    })

    if (existingCertificate) {
      return NextResponse.json(
        { error: 'Certificate already issued for this course' },
        { status: 400 }
      )
    }

    // Generate certificate number
    const certificateNumber = `INR99-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-certificate/${certificateNumber}`

    // Create certificate
    const certificate = await db.certificate.create({
      data: {
        userId: user.id,
        courseId: courseId,
        certificateNumber: certificateNumber,
        verificationUrl: verificationUrl,
        verified: false
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            difficulty: true,
            thumbnail: true,
            instructor: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Certificate generated successfully',
      certificate
    })

  } catch (error) {
    console.error('Error creating certificate:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
