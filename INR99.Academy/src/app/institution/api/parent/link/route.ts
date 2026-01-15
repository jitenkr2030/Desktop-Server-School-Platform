import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { parentId, studentCode, relationType = 'PARENT' } = await request.json()

    if (!parentId || !studentCode) {
      return NextResponse.json(
        { error: 'Parent ID and student code are required' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Find the parent
    const parent = await db.parentUser.findUnique({
      where: { id: parentId },
    })

    if (!parent) {
      return NextResponse.json(
        { error: 'Parent account not found' },
        { status: 404 }
      )
    }

    if (parent.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Parent account is not active' },
        { status: 403 }
      )
    }

    // Find student by parent code
    const studentProfile = await db.studentProfile.findFirst({
      where: {
        parentCode: studentCode,
        codeExpiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        class: true,
        parentLinks: {
          where: {
            parentId: parentId,
          },
        },
      },
    })

    if (!studentProfile) {
      return NextResponse.json(
        { error: 'Invalid or expired student code. Please check the code and try again.' },
        { status: 404 }
      )
    }

    // Check if already linked
    if (studentProfile.parentLinks.length > 0) {
      const existingLink = studentProfile.parentLinks[0]
      
      if (existingLink.status === 'VERIFIED') {
        return NextResponse.json(
          { error: 'You are already linked to this student' },
          { status: 409 }
        )
      }
      
      if (existingLink.status === 'PENDING') {
        return NextResponse.json(
          { error: 'A pending link request already exists for this student' },
          { status: 409 }
        )
      }
    }

    // Check if parent has too many linked students (limit to 5)
    const existingLinks = await db.parentStudentLink.count({
      where: {
        parentId: parentId,
        status: { in: ['PENDING', 'VERIFIED'] },
      },
    })

    if (existingLinks >= 5) {
      return NextResponse.json(
        { error: 'You can link to a maximum of 5 students' },
        { status: 400 }
      )
    }

    // Create or update the link
    if (studentProfile.parentLinks.length > 0) {
      await db.parentStudentLink.update({
        where: { id: studentProfile.parentLinks[0].id },
        data: {
          relationType,
          status: 'PENDING',
          verifiedAt: null,
        },
      })
    } else {
      await db.parentStudentLink.create({
        data: {
          parentId,
          studentId: studentProfile.id,
          relationType,
          status: 'PENDING',
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Link request submitted. Waiting for student verification.',
      student: {
        id: studentProfile.user.id,
        name: studentProfile.user.name,
        admissionNumber: studentProfile.admissionNumber,
        className: studentProfile.class?.name,
        rollNumber: studentProfile.rollNumber,
      },
    })
  } catch (error) {
    console.error('Link student error:', error)
    return NextResponse.json(
      { error: 'Failed to link student. Please try again.' },
      { status: 500 }
    )
  }
}
