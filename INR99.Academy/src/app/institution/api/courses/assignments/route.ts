import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantSlug = searchParams.get('tenantSlug')
    const classId = searchParams.get('classId')
    const courseId = searchParams.get('courseId')
    const status = searchParams.get('status')

    if (!tenantSlug) {
      return NextResponse.json(
        { error: 'Tenant slug is required' },
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

    // Build where clause
    const where: any = {
      class: {
        tenant: {
          id: tenant.id,
        },
      },
    }

    if (classId) {
      where.classId = classId
    }

    if (courseId) {
      where.courseId = courseId
    }

    if (status) {
      where.status = status
    }

    const assignments = await db.courseClassAssignment.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            difficulty: true,
            duration: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      assignments,
    })
  } catch (error) {
    console.error('Get assignments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { courseId, classId, assignedBy, isMandatory, startDate, endDate, notes } =
      await request.json()

    if (!courseId || !classId) {
      return NextResponse.json(
        { error: 'Course ID and Class ID are required' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Check if assignment already exists
    const existing = await db.courseClassAssignment.findUnique({
      where: {
        courseId_classId: {
          courseId,
          classId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'This course is already assigned to this class' },
        { status: 409 }
      )
    }

    const assignment = await db.courseClassAssignment.create({
      data: {
        courseId,
        classId,
        assignedBy,
        isMandatory: isMandatory || false,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        notes,
        status: 'ACTIVE',
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      assignment,
    })
  } catch (error) {
    console.error('Create assignment error:', error)
    return NextResponse.json(
      { error: 'Failed to create assignment' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assignmentId = searchParams.get('id')

    if (!assignmentId) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      )
    }

    const db = createClient()

    await db.courseClassAssignment.delete({
      where: { id: assignmentId },
    })

    return NextResponse.json({
      success: true,
      message: 'Assignment removed successfully',
    })
  } catch (error) {
    console.error('Delete assignment error:', error)
    return NextResponse.json(
      { error: 'Failed to delete assignment' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status, isMandatory, startDate, endDate, notes } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      )
    }

    const db = createClient()

    const assignment = await db.courseClassAssignment.update({
      where: { id },
      data: {
        status: status || undefined,
        isMandatory: isMandatory ?? undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        notes: notes ?? undefined,
      },
    })

    return NextResponse.json({
      success: true,
      assignment,
    })
  } catch (error) {
    console.error('Update assignment error:', error)
    return NextResponse.json(
      { error: 'Failed to update assignment' },
      { status: 500 }
    )
  }
}
