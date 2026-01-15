import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'UNDER_REVIEW'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const db = createClient()
    const skip = (page - 1) * limit

    // Get tenants requiring verification
    const [tenants, total] = await Promise.all([
      db.tenant.findMany({
        where: {
          eligibilityStatus: status as any,
          studentCount: { gte: 1500 }, // Only show eligible institutions
        },
        include: {
          domains: true,
          verificationDocs: {
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.tenant.count({
        where: {
          eligibilityStatus: status as any,
          studentCount: { gte: 1500 },
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      tenants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get verification queue error:', error)
    return NextResponse.json(
      { error: 'Failed to get verification queue' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { tenantId, action, reviewNotes } = body

    if (!tenantId || !action) {
      return NextResponse.json(
        { error: 'Tenant ID and action are required' },
        { status: 400 }
      )
    }

    if (!['APPROVE', 'REJECT', 'REQUIRES_MORE_INFO'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Get tenant with verification documents
    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
      include: { verificationDocs: true },
    })

    if (!tenant) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      )
    }

    // Update tenant eligibility status
    const newStatus = action === 'APPROVE' 
      ? 'ELIGIBLE' 
      : action === 'REJECT' 
      ? 'REJECTED' 
      : 'UNDER_REVIEW'

    await db.tenant.update({
      where: { id: tenantId },
      data: {
        eligibilityStatus: newStatus,
        verifiedAt: action === 'APPROVE' ? new Date() : undefined,
      },
    })

    // Update all pending documents with the same status
    if (tenant.verificationDocs.length > 0) {
      const docStatus = action === 'APPROVE'
        ? 'APPROVED'
        : action === 'REJECT'
        ? 'REJECTED'
        : 'REQUIRES_MORE_INFO'

      await db.verificationDocument.updateMany({
        where: {
          tenantId,
          status: 'PENDING',
        },
        data: {
          status: docStatus,
          reviewedBy: session.user.id,
          reviewedAt: new Date(),
          reviewNotes: reviewNotes || null,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: `Institution ${action.toLowerCase().replace('_', ' ')} successfully`,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        eligibilityStatus: newStatus,
      },
    })
  } catch (error) {
    console.error('Review verification error:', error)
    return NextResponse.json(
      { error: 'Failed to process verification' },
      { status: 500 }
    )
  }
}
