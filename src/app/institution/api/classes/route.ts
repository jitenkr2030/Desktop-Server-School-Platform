import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId')

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      )
    }

    const db = createClient()

    // For now, we'll return mock data since the actual tenant structure
    // needs to be integrated with the existing school classes
    // In production, this would query the tenant-specific classes

    const classes = [
      {
        id: 'class-6-a',
        name: 'Class 6 - A',
        grade: 6,
        section: 'A',
        studentCount: 35,
        teacherCount: 2,
        courseCount: 5,
      },
      {
        id: 'class-7-a',
        name: 'Class 7 - A',
        grade: 7,
        section: 'A',
        studentCount: 32,
        teacherCount: 2,
        courseCount: 5,
      },
      {
        id: 'class-8-a',
        name: 'Class 8 - A',
        grade: 8,
        section: 'A',
        studentCount: 30,
        teacherCount: 2,
        courseCount: 6,
      },
      {
        id: 'class-9-a',
        name: 'Class 9 - A',
        grade: 9,
        section: 'A',
        studentCount: 28,
        teacherCount: 3,
        courseCount: 6,
      },
      {
        id: 'class-10-a',
        name: 'Class 10 - A',
        grade: 10,
        section: 'A',
        studentCount: 25,
        teacherCount: 3,
        courseCount: 7,
      },
    ]

    return NextResponse.json({
      success: true,
      classes,
    })
  } catch (error) {
    console.error('Get classes error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenantId, name, grade, section, teacherIds } = body

    if (!tenantId || !name || !grade) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Verify tenant
    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
    })

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }

    // In production, create a class record linked to tenant
    // For now, return success with mock data
    const newClass = {
      id: `class-${Date.now()}`,
      name,
      grade,
      section: section || '',
      studentCount: 0,
      teacherCount: teacherIds?.length || 0,
      courseCount: 0,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      class: newClass,
    })
  } catch (error) {
    console.error('Create class error:', error)
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    )
  }
}
