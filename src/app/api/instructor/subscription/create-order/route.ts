import { NextRequest, NextResponse } from 'next/server'
import { INSTRUCTOR_PLANS } from '@/lib/simple-db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, planId, billingCycle } = body

    if (!userId || !planId) {
      return NextResponse.json(
        { success: false, message: 'User ID and Plan ID are required' },
        { status: 400 }
      )
    }

    // Validate plan exists
    const plan = INSTRUCTOR_PLANS.find(p => p.id === planId)
    if (!plan) {
      return NextResponse.json(
        { success: false, message: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    // Calculate price based on billing cycle
    const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice

    // In production, this would create a Razorpay order
    // For demo, we return a mock order
    const orderId = `order_${Date.now()}`

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        planId,
        planName: plan.name,
        billingCycle,
        amount: price,
        currency: 'INR',
        // In production, these would come from Razorpay
        razorpayOrderId: `razorpay_${orderId}`,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo',
        checkoutUrl: `/instructor/subscription/checkout?orderId=${orderId}&planId=${planId}&billingCycle=${billingCycle}`
      }
    })

  } catch (error) {
    console.error('Error creating subscription order:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create subscription order' },
      { status: 500 }
    )
  }
}
