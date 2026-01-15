import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'
import crypto from 'crypto'

const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || 'YOUR_SECRET_KEY'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    // Verify webhook signature (for production)
    const signature = request.headers.get('x-cashfree-signature')
    if (signature && CASHFREE_SECRET_KEY !== 'YOUR_SECRET_KEY') {
      const computedSignature = crypto
        .createHmac('sha256', CASHFREE_SECRET_KEY)
        .update(JSON.stringify(body))
        .digest('hex')

      if (signature !== computedSignature) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    const db = createClient()

    switch (type) {
      case 'PAYMENT_SUCCESS':
        await handlePaymentSuccess(db, data)
        break

      case 'PAYMENT_FAILED':
        await handlePaymentFailed(db, data)
        break

      case 'ORDER_EXPIRED':
        await handleOrderExpired(db, data)
        break

      default:
        console.log(`Unhandled webhook type: ${type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(db: any, data: any) {
  const { order_id, payment_id } = data

  // Find and update payment
  const payment = await db.tenantPayment.findFirst({
    where: { paymentId: order_id },
    include: { subscription: true },
  })

  if (payment) {
    await db.tenantPayment.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
        paymentId: payment_id,
      },
    })

    // Update subscription
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

      // Activate tenant
      await db.tenant.update({
        where: { id: payment.subscription.tenantId },
        data: { status: 'ACTIVE' },
      })

      console.log(`Tenant ${payment.subscription.tenantId} subscription activated`)
    }
  }
}

async function handlePaymentFailed(db: any, data: any) {
  const { order_id } = data

  const payment = await db.tenantPayment.findFirst({
    where: { paymentId: order_id },
  })

  if (payment) {
    await db.tenantPayment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' },
    })

    console.log(`Payment ${order_id} marked as failed`)
  }
}

async function handleOrderExpired(db: any, data: any) {
  const { order_id } = data

  const payment = await db.tenantPayment.findFirst({
    where: { paymentId: order_id },
  })

  if (payment) {
    await db.tenantPayment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' },
    })

    console.log(`Order ${order_id} expired`)
  }
}
