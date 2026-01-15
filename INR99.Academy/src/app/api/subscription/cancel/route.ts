import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const cancelSubscriptionSchema = z.object({
  subscriptionId: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subscriptionId } = cancelSubscriptionSchema.parse(body)

    // Find the subscription
    const subscription = await db.subscription.findUnique({
      where: { id: subscriptionId }
    })

    if (!subscription) {
      return NextResponse.json(
        { success: false, message: 'Subscription not found' },
        { status: 404 }
      )
    }

    if (subscription.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, message: 'Subscription is not active' },
        { status: 400 }
      )
    }

    // Cancel the subscription by disabling auto-renew and setting end date
    const updatedSubscription = await db.subscription.update({
      where: { id: subscriptionId },
      data: {
        autoRenew: false,
        endDate: new Date() // End subscription immediately
      }
    })

    // Update status to cancelled
    await db.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'CANCELLED' }
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription: {
        id: updatedSubscription.id,
        status: 'CANCELLED',
        endDate: updatedSubscription.endDate
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid input data' },
        { status: 400 }
      )
    }

    console.error('Cancel subscription error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}