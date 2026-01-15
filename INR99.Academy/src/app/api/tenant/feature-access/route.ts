import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'
import { getAccessStatus } from '@/lib/verification/feature-access'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the tenant for this user
    const tenant = await prisma.tenant.findFirst({
      where: {
        users: {
          some: { clerkId: userId }
        }
      }
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    // Get access status using the existing utility
    const accessStatus = getAccessStatus({
      eligibilityStatus: tenant.eligibilityStatus,
      createdAt: tenant.createdAt,
      eligibilityDeadline: tenant.eligibilityDeadline
    })

    return NextResponse.json({
      success: true,
      access: {
        status: accessStatus.accessLevel,
        daysRemaining: accessStatus.daysRemaining,
        deadline: tenant.eligibilityDeadline?.toISOString() || null,
        accessLevel: accessStatus.accessLevel,
        warnings: accessStatus.warnings
      }
    })
  } catch (error) {
    console.error('Error checking feature access:', error)
    return NextResponse.json(
      { error: 'Failed to check feature access' },
      { status: 500 }
    )
  }
}
