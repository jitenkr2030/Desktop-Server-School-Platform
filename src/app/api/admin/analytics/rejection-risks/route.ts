import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/db'
import { advancedAnalyticsService } from '@/lib/analytics/advanced-analytics'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin permissions
    const admin = await prisma.user.findFirst({
      where: {
        clerkId: userId,
        role: 'ADMIN'
      }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get all tenants with pending or under review status
    const tenants = await prisma.tenant.findMany({
      where: {
        eligibilityStatus: {
          in: ['PENDING', 'UNDER_REVIEW', 'REQUIRES_MORE_INFO']
        }
      },
      select: { id: true }
    })

    // Generate risk assessments for all pending tenants
    const risks = await Promise.all(
      tenants.map(async (tenant) => {
        const assessment = await advancedAnalyticsService.predictRejectionRisk(tenant.id)
        return assessment
      })
    )

    // Sort by risk level (highest first)
    const sortedRisks = risks.sort((a, b) => b.riskScore - a.riskScore)

    return NextResponse.json({
      success: true,
      risks: sortedRisks
    })
  } catch (error) {
    console.error('Error fetching rejection risks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rejection risks' },
      { status: 500 }
    )
  }
}
