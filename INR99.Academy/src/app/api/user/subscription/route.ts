import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ isActive: false })
    }

    // Check for active subscription
    const subscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
        endDate: {
          gte: new Date(),
        }
      },
      select: {
        id: true,
        type: true,
        startDate: true,
        endDate: true,
        status: true,
      }
    })

    return NextResponse.json({
      isActive: !!subscription,
      subscription: subscription ? {
        id: subscription.id,
        type: subscription.type,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        status: subscription.status,
      } : null
    })
  } catch (error) {
    console.error('Subscription check error:', error)
    // Return false for any errors (user doesn't have active subscription)
    return NextResponse.json({ isActive: false })
  }
}
