import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
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

    const summary = await advancedAnalyticsService.getPredictionSummary()

    return NextResponse.json({
      success: true,
      data: summary
    })
  } catch (error) {
    console.error('Error fetching predictions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch predictions' },
      { status: 500 }
    )
  }
}
