import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantSlug = searchParams.get('tenantSlug')

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

    // Get all classes
    const classes = await db.schoolClass.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    })

    // Get all subjects
    const subjects = await db.schoolSubject.findMany({
      where: {
        courses: {
          some: {
            instructor: {
              tenantUsers: {
                some: {
                  tenantId: tenant.id,
                },
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      success: true,
      classes,
      subjects,
    })
  } catch (error) {
    console.error('Get teaching assignments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teaching assignments' },
      { status: 500 }
    )
  }
}
