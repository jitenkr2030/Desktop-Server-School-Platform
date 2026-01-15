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

    const db = createClient()

    // Get date ranges for comparison
    const now = new Date()
    const todayStart = new Date(now)
    todayStart.setHours(0, 0, 0, 0)
    
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const monthAgo = new Date(now)
    monthAgo.setDate(monthAgo.getDate() - 30)

    // Overall statistics
    const [
      totalInstitutions,
      pendingCount,
      underReviewCount,
      eligibleCount,
      rejectedCount,
      expiredCount,
      todayPending,
      todayApproved,
      todayRejected,
      weekSubmissions,
      monthSubmissions,
    ] = await Promise.all([
      db.tenant.count({
        where: { studentCount: { gte: 1500 } },
      }),
      db.tenant.count({
        where: { eligibilityStatus: 'PENDING' },
      }),
      db.tenant.count({
        where: { eligibilityStatus: 'UNDER_REVIEW' },
      }),
      db.tenant.count({
        where: { eligibilityStatus: 'ELIGIBLE' },
      }),
      db.tenant.count({
        where: { eligibilityStatus: 'REJECTED' },
      }),
      db.tenant.count({
        where: { eligibilityStatus: 'EXPIRED' },
      }),
      db.tenant.count({
        where: {
          eligibilityStatus: 'PENDING',
          createdAt: { gte: todayStart },
        },
      }),
      db.tenant.count({
        where: {
          eligibilityStatus: 'ELIGIBLE',
          verifiedAt: { gte: todayStart },
        },
      }),
      db.tenant.count({
        where: {
          eligibilityStatus: 'REJECTED',
          updatedAt: { gte: todayStart },
        },
      }),
      db.tenant.count({
        where: {
          createdAt: { gte: weekAgo },
        },
      }),
      db.tenant.count({
        where: {
          createdAt: { gte: monthAgo },
        },
      }),
    ])

    // Calculate average processing time (last 30 days)
    const recentApproved = await db.tenant.findMany({
      where: {
        eligibilityStatus: 'ELIGIBLE',
        verifiedAt: { gte: monthAgo },
      },
      select: {
        createdAt: true,
        verifiedAt: true,
      },
      take: 100,
    })

    let avgProcessingDays = 0
    if (recentApproved.length > 0) {
      const totalDays = recentApproved.reduce((sum, inst) => {
        const days = (inst.verifiedAt!.getTime() - inst.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        return sum + days
      }, 0)
      avgProcessingDays = Math.round(totalDays / recentApproved.length * 10) / 10
    }

    // Document statistics
    const documentStats = await db.verificationDocument.groupBy({
      by: ['status'],
      _count: true,
    })

    // Submissions by day (last 14 days)
    const submissionsByDay = await db.tenant.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: weekAgo },
      },
      _count: true,
    })

    // Approvals by day (last 14 days)
    const approvalsByDay = await db.tenant.groupBy({
      by: ['verifiedAt'],
      where: {
        verifiedAt: { gte: weekAgo },
      },
      _count: true,
    })

    // Student distribution
    const studentDistribution = await db.tenant.groupBy({
      by: ['studentCount'],
      where: {
        studentCount: { gte: 1500 },
      },
      _count: true,
      orderBy: { studentCount: 'asc' },
    })

    // Recent activity
    const recentActivity = await db.tenant.findMany({
      where: {
        OR: [
          { updatedAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } },
          { createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } },
        ],
      },
      take: 10,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        studentCount: true,
        eligibilityStatus: true,
        updatedAt: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      analytics: {
        overview: {
          totalInstitutions,
          byStatus: {
            PENDING: pendingCount,
            UNDER_REVIEW: underReviewCount,
            ELIGIBLE: eligibleCount,
            REJECTED: rejectedCount,
            EXPIRED: expiredCount,
          },
          conversionRate: totalInstitutions > 0 
            ? Math.round((eligibleCount / totalInstitutions) * 100) 
            : 0,
        },
        today: {
          pending: todayPending,
          approved: todayApproved,
          rejected: todayRejected,
        },
        trends: {
          weekSubmissions,
          monthSubmissions,
          avgProcessingDays,
        },
        documents: documentStats.reduce((acc, doc) => {
          acc[doc.status] = doc._count
          return acc
        }, {} as Record<string, number>),
        submissionsByDay: submissionsByDay.map(d => ({
          date: d.createdAt.toISOString().split('T')[0],
          count: d._count,
        })),
        approvalsByDay: approvalsByDay.map(d => ({
          date: d.verifiedAt?.toISOString().split('T')[0],
          count: d._count,
        })),
        studentDistribution: studentDistribution.map(d => ({
          count: d.studentCount,
          institutions: d._count,
        })),
        recentActivity: recentActivity.map(inst => ({
          id: inst.id,
          name: inst.name,
          studentCount: inst.studentCount,
          status: inst.eligibilityStatus,
          lastActivity: inst.updatedAt,
          createdAt: inst.createdAt,
        })),
      },
    })
  } catch (error) {
    console.error('Get analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to get analytics' },
      { status: 500 }
    )
  }
}
