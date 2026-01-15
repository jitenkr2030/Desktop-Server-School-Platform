import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createSubscriptionSchema = z.object({
  userId: z.string(),
  type: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY']),
  paymentId: z.string().optional(),
})

const getSubscriptionPrices = () => {
  return {
    MONTHLY: {
      amount: 99,
      currency: 'INR',
      description: 'Monthly subscription'
    },
    QUARTERLY: {
      amount: 267,
      currency: 'INR',
      description: 'Quarterly subscription (10% off)'
    },
    YEARLY: {
      amount: 950,
      currency: 'INR',
      description: 'Yearly subscription (20% off)'
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, paymentId } = createSubscriptionSchema.parse(body)

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Get pricing
    const prices = getSubscriptionPrices()
    const price = prices[type]

    // Calculate end date based on subscription type
    const startDate = new Date()
    let endDate = new Date()
    
    switch (type) {
      case 'MONTHLY':
        endDate.setMonth(endDate.getMonth() + 1)
        break
      case 'QUARTERLY':
        endDate.setMonth(endDate.getMonth() + 3)
        break
      case 'YEARLY':
        endDate.setFullYear(endDate.getFullYear() + 1)
        break
    }

    // Cancel any existing active subscriptions
    await db.subscription.updateMany({
      where: {
        userId,
        status: 'ACTIVE'
      },
      data: {
        status: 'CANCELLED',
        endDate: new Date()
      }
    })

    // Create new subscription
    const subscription = await db.subscription.create({
      data: {
        userId,
        type,
        status: 'ACTIVE',
        startDate,
        endDate,
        autoRenew: true,
        paymentId
      }
    })

    // Create payment record
    await db.paymentRecord.create({
      data: {
        userId,
        type: 'SUBSCRIPTION',
        amount: price.amount,
        currency: price.currency,
        status: 'COMPLETED',
        paymentId: paymentId || `sub_${Date.now()}`,
        metadata: JSON.stringify({
          subscriptionId: subscription.id,
          subscriptionType: type
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription created successfully',
      subscription: {
        id: subscription.id,
        type: subscription.type,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        amount: price.amount,
        currency: price.currency
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid input data' },
        { status: 400 }
      )
    }

    console.error('Create subscription error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user's active subscription
    const subscription = await db.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE'
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!subscription) {
      return NextResponse.json({
        success: true,
        hasActiveSubscription: false,
        subscription: null
      })
    }

    // Check if subscription is expired
    const now = new Date()
    if (subscription.endDate && subscription.endDate < now) {
      // Update subscription status to expired
      await db.subscription.update({
        where: { id: subscription.id },
        data: { status: 'EXPIRED' }
      })

      return NextResponse.json({
        success: true,
        hasActiveSubscription: false,
        subscription: null
      })
    }

    const prices = getSubscriptionPrices()
    const price = prices[subscription.type]

    return NextResponse.json({
      success: true,
      hasActiveSubscription: true,
      subscription: {
        id: subscription.id,
        type: subscription.type,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        amount: price.amount,
        currency: price.currency,
        autoRenew: subscription.autoRenew
      }
    })

  } catch (error) {
    console.error('Get subscription error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}