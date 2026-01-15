import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantSlug = searchParams.get('tenantSlug')
    const classId = searchParams.get('classId')

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

    // Get classes for this tenant
    const classes = await db.schoolClass.findMany({
      where: {
        studentProfiles: {
          some: {
            user: {
              tenantUsers: {
                some: {
                  tenantId: tenant.id,
                },
              },
            },
          },
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    })

    return NextResponse.json({
      success: true,
      classes,
    })
  } catch (error) {
    console.error('Get class students error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch class students' },
      { status: 500 }
    )
  }
}
