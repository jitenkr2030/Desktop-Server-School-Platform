import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantSlug = searchParams.get('tenantSlug')
    const search = searchParams.get('search') || ''

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

    // Get courses for this tenant's users
    const courses = await db.course.findMany({
      where: {
        instructor: {
          tenantUsers: {
            some: {
              tenantId: tenant.id,
            },
          },
        },
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        difficulty: true,
        duration: true,
        isPublished: true,
        isActive: true,
        instructor: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { title: 'asc' },
      take: 50,
    })

    return NextResponse.json({
      success: true,
      courses,
    })
  } catch (error) {
    console.error('Get available courses error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
