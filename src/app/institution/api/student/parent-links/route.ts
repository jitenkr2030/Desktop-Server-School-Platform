import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const db = createClient()

    const studentProfile = await db.studentProfile.findUnique({
      where: { userId },
      include: {
        parentLinks: {
          include: {
            parent: {
              select: {
                id: true,
                name: true,
                email: true,
                mobileNumber: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!studentProfile) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      parentCode: studentProfile.parentCode,
      codeExpiresAt: studentProfile.codeExpiresAt,
      links: studentProfile.parentLinks.map((link) => ({
        id: link.id,
        parentName: link.parent.name,
        parentEmail: link.parent.email,
        mobileNumber: link.parent.mobileNumber,
        relationType: link.relationType,
        status: link.status,
        createdAt: link.createdAt,
        verifiedAt: link.verifiedAt,
      })),
    })
  } catch (error) {
    console.error('Get parent links error:', error)
    return NextResponse.json(
      { error: 'Failed to get parent links' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Find or create student profile
    let studentProfile = await db.studentProfile.findUnique({
      where: { userId },
    })

    if (!studentProfile) {
      // Create new student profile
      studentProfile = await db.studentProfile.create({
        data: {
          userId,
        },
      })
    }

    // Generate unique parent code if not exists or expired
    if (!studentProfile.parentCode || !studentProfile.codeExpiresAt || studentProfile.codeExpiresAt < new Date()) {
      // Generate a random alphanumeric code (8 characters)
      const newCode = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30) // Code expires in 30 days

      studentProfile = await db.studentProfile.update({
        where: { id: studentProfile.id },
        data: {
          parentCode: newCode,
          codeExpiresAt: expiresAt,
        },
      })
    }

    // Get any pending links
    const pendingLinks = await db.parentStudentLink.findMany({
      where: {
        studentId: studentProfile.id,
        status: 'PENDING',
      },
      include: {
        parent: {
          select: {
            name: true,
            email: true,
            mobileNumber: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      parentCode: studentProfile.parentCode,
      expiresAt: studentProfile.codeExpiresAt,
      pendingLinks: pendingLinks.map((link) => ({
        id: link.id,
        parentName: link.parent.name,
        parentEmail: link.parent.email,
        mobileNumber: link.parent.mobileNumber,
        relationType: link.relationType,
        createdAt: link.createdAt,
      })),
    })
  } catch (error) {
    console.error('Generate parent code error:', error)
    return NextResponse.json(
      { error: 'Failed to generate parent code' },
      { status: 500 }
    )
  }
}
