import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { userId, linkId, action } = await request.json()

    if (!userId || !linkId || !action) {
      return NextResponse.json(
        { error: 'User ID, link ID, and action are required' },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be approve or reject' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Verify the student owns this link
    const studentProfile = await db.studentProfile.findUnique({
      where: { userId },
      include: {
        parentLinks: {
          where: { id: linkId },
          include: {
            parent: true,
          },
        },
      },
    })

    if (!studentProfile) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    const link = studentProfile.parentLinks[0]

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      )
    }

    if (link.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'This link has already been processed' },
        { status: 400 }
      )
    }

    // Update link status
    const newStatus = action === 'approve' ? 'VERIFIED' : 'REJECTED'

    await db.parentStudentLink.update({
      where: { id: linkId },
      data: {
        status: newStatus,
        verifiedAt: action === 'approve' ? new Date() : null,
      },
    })

    return NextResponse.json({
      success: true,
      message: action === 'approve' 
        ? 'Parent link approved successfully' 
        : 'Parent link rejected',
      status: newStatus,
    })
  } catch (error) {
    console.error('Verify parent link error:', error)
    return NextResponse.json(
      { error: 'Failed to verify parent link' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const linkId = searchParams.get('linkId')

    if (!userId || !linkId) {
      return NextResponse.json(
        { error: 'User ID and link ID are required' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Verify the student owns this link
    const studentProfile = await db.studentProfile.findUnique({
      where: { userId },
      include: {
        parentLinks: {
          where: { id: linkId },
        },
      },
    })

    if (!studentProfile) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    const link = studentProfile.parentLinks[0]

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      )
    }

    await db.parentStudentLink.delete({
      where: { id: linkId },
    })

    return NextResponse.json({
      success: true,
      message: 'Parent link removed successfully',
    })
  } catch (error) {
    console.error('Remove parent link error:', error)
    return NextResponse.json(
      { error: 'Failed to remove parent link' },
      { status: 500 }
    )
  }
}
