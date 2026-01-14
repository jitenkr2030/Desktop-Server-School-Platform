import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'
import { hash } from 'bcryptjs'

// Get all teachers for tenant
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantSlug = searchParams.get('tenantSlug')
    const search = searchParams.get('search') || ''
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

    // Get teachers (users with INSTRUCTOR role in tenant)
    const teachers = await db.tenantUser.findMany({
      where: {
        tenantId: tenant.id,
        role: 'INSTRUCTOR',
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
        ...(status && status !== 'all' && { status }),
      },
      orderBy: { createdAt: 'desc' },
    })

    // Get additional stats for each teacher
    const teachersWithStats = await Promise.all(
      teachers.map(async (teacher) => {
        const [coursesCount, studentsCount, sessionsCount] = await Promise.all([
          db.course.count({
            where: {
              instructorId: teacher.userId || '',
            },
          }),
          db.courseProgress.count({
            where: {
              course: {
                instructorId: teacher.userId || '',
              },
            },
          }),
          db.liveSession.count({
            where: {
              hostId: teacher.userId || '',
            },
          }),
        ])

        return {
          ...teacher,
          stats: {
            coursesCount,
            studentsCount,
            sessionsCount,
          },
        }
      })
    )

    return NextResponse.json({
      success: true,
      teachers: teachersWithStats,
    })
  } catch (error) {
    console.error('Get teachers error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teachers' },
      { status: 500 }
    )
  }
}

// Invite new teacher
export async function POST(request: NextRequest) {
  try {
    const { email, name, tenantSlug } = await request.json()

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
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

    // Check if user already exists in tenant
    const existingUser = await db.tenantUser.findFirst({
      where: {
        tenantId: tenant.id,
        email,
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists in this institution' },
        { status: 409 }
      )
    }

    // Create invitation
    const invitation = await db.tenantUser.create({
      data: {
        tenantId: tenant.id,
        email,
        name,
        role: 'INSTRUCTOR',
        status: 'PENDING',
        invitedAt: new Date(),
      },
    })

    // In production, send invitation email here

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        name: invitation.name,
        role: invitation.role,
        status: invitation.status,
      },
    })
  } catch (error) {
    console.error('Invite teacher error:', error)
    return NextResponse.json(
      { error: 'Failed to invite teacher' },
      { status: 500 }
    )
  }
}

// Update teacher
export async function PATCH(request: NextRequest) {
  try {
    const { id, name, status, role } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Teacher ID is required' },
        { status: 400 }
      )
    }

    const db = createClient()

    const teacher = await db.tenantUser.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(status && { status }),
        ...(role && { role }),
      },
    })

    return NextResponse.json({
      success: true,
      teacher,
    })
  } catch (error) {
    console.error('Update teacher error:', error)
    return NextResponse.json(
      { error: 'Failed to update teacher' },
      { status: 500 }
    )
  }
}

// Remove teacher from tenant
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Teacher ID is required' },
        { status: 400 }
      )
    }

    const db = createClient()

    await db.tenantUser.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Teacher removed successfully',
    })
  } catch (error) {
    console.error('Remove teacher error:', error)
    return NextResponse.json(
      { error: 'Failed to remove teacher' },
      { status: 500 }
    )
  }
}
