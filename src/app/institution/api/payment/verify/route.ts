import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'

// Cashfree configuration
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || 'YOUR_SECRET_KEY'
const CASHFREE_ENV = process.env.CASHFREE_ENV || 'sandbox'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, paymentId, orderAmount } = body

    if (!orderId || !paymentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Find the payment record
    const payment = await db.tenantPayment.findFirst({
      where: { paymentId: orderId },
      include: {
        subscription: {
          include: { tenant: true },
        },
      },
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    // In sandbox mode, automatically verify
    if (CASHFREE_ENV === 'sandbox' || CASHFREE_SECRET_KEY === 'YOUR_SECRET_KEY') {
      // Update payment status
      await db.tenantPayment.update({
        where: { id: payment.id },
        data: { status: 'COMPLETED' },
      })

      // Update tenant subscription
      if (payment.subscription) {
        const startDate = new Date()
        const endDate = new Date()
        endDate.setMonth(endDate.getMonth() + 1)

        await db.tenantSubscription.update({
          where: { id: payment.subscription.id },
          data: {
            status: 'ACTIVE',
            currentPeriodStart: startDate,
            currentPeriodEnd: endDate,
          },
        })

        // Activate tenant if pending
        await db.tenant.update({
          where: { id: payment.subscription.tenantId },
          data: { status: 'ACTIVE' },
        })
      }

      return NextResponse.json({
        success: true,
        verified: true,
        message: 'Payment verified successfully (sandbox mode)',
      })
    }

    // Production: Verify with Cashfree API
    const cashfreeResponse = await fetch(
      `https://api.cashfree.com/pg/v1/orders/${orderId}/payments/${paymentId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-version': '2022-09-01',
          'x-client-id': process.env.CASHFREE_APP_ID,
          'x-client-secret': CASHFREE_SECRET_KEY,
        },
      }
    )

    if (!cashfreeResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to verify payment' },
        { status: 500 }
      )
    }

    const paymentData = await cashfreeResponse.json()

    // Check payment status
    if (paymentData.payment_status === 'SUCCESS') {
      // Update payment status
      await db.tenantPayment.update({
        where: { id: payment.id },
        data: { status: 'COMPLETED' },
      })

      // Update tenant subscription
      if (payment.subscription) {
        const startDate = new Date()
        const endDate = new Date()
        endDate.setMonth(endDate.getMonth() + 1)

        await db.tenantSubscription.update({
          where: { id: payment.subscription.id },
          data: {
            status: 'ACTIVE',
            currentPeriodStart: startDate,
            currentPeriodEnd: endDate,
          },
        })

        // Activate tenant if pending
        await db.tenant.update({
          where: { id: payment.subscription.tenantId },
          data: { status: 'ACTIVE' },
        })
      }

      return NextResponse.json({
        success: true,
        verified: true,
        message: 'Payment verified successfully',
      })
    }

    return NextResponse.json({
      success: false,
      verified: false,
      message: 'Payment not successful',
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
