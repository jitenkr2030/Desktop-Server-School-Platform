import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'
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

    // Fetch unacknowledged anomalies
    const anomalies = await prisma.verificationAnomaly.findMany({
      where: { acknowledged: false },
      orderBy: { detectedAt: 'desc' },
      take: 50
    })

    return NextResponse.json({
      success: true,
      anomalies: anomalies.map(a => ({
        id: a.id,
        type: a.type,
        severity: a.severity,
        description: a.description,
        metric: a.metric,
        currentValue: a.currentValue,
        expectedValue: a.expectedValue,
        deviation: a.deviation,
        detectedAt: a.detectedAt.toISOString(),
        acknowledged: a.acknowledged
      }))
    })
  } catch (error) {
    console.error('Error fetching anomalies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch anomalies' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    // Trigger anomaly detection
    const newAnomalies = await advancedAnalyticsService.detectAnomalies()

    return NextResponse.json({
      success: true,
      detected: newAnomalies.length,
      anomalies: newAnomalies
    })
  } catch (error) {
    console.error('Error detecting anomalies:', error)
    return NextResponse.json(
      { error: 'Failed to detect anomalies' },
      { status: 500 }
    )
  }
}
