import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'

// Get approval statistics for dashboard
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

    // Get counts by status
    const statusCounts = await db.contentApprovalRequest.groupBy({
      by: ['status'],
      _count: { status: true },
    })

    // Get counts by content type
    const typeCounts = await db.contentApprovalRequest.groupBy({
      by: ['contentType'],
      _count: { contentType: true },
    })

    // Get recent activity
    const recentRequests = await db.contentApprovalRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        contentType: true,
        status: true,
        priority: true,
        createdAt: true,
      },
    })

    // Get overdue requests
    const now = new Date()
    const overdueRequests = await db.contentApprovalRequest.findMany({
      where: {
        dueDate: { lt: now },
        status: { notIn: ['APPROVED', 'REJECTED', 'ARCHIVED'] },
      },
      orderBy: { dueDate: 'asc' },
      take: 5,
      select: {
        id: true,
        title: true,
        dueDate: true,
        priority: true,
      },
    })

    // Calculate summary stats
    const totalPending = statusCounts
      .filter((s) => ['PENDING_REVIEW', 'IN_REVIEW'].includes(s.status))
      .reduce((sum, s) => sum + s._count.status, 0)

    const totalProcessed = statusCounts
      .filter((s) => ['APPROVED', 'REJECTED'].includes(s.status))
      .reduce((sum, s) => sum + s._count.status, 0)

    const approvalRate =
      totalProcessed > 0
        ? Math.round(
            (statusCounts
              .filter((s) => s.status === 'APPROVED')
              .reduce((sum, s) => sum + s._count.status, 0) /
              totalProcessed) *
              100
          )
        : 0

    return NextResponse.json({
      success: true,
      stats: {
        total: statusCounts.reduce((sum, s) => sum + s._count.status, 0),
        byStatus: statusCounts.reduce(
          (acc, s) => ({ ...acc, [s.status]: s._count.status }),
          {}
        ),
        byType: typeCounts.reduce(
          (acc, t) => ({ ...acc, [t.contentType]: t._count.contentType }),
          {}
        ),
        totalPending,
        totalProcessed,
        approvalRate,
      },
      recentRequests,
      overdueRequests,
    })
  } catch (error) {
    console.error('Get approval stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch approval statistics' },
      { status: 500 }
    )
  }
}
