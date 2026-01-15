import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { paymentId, paymentMethod, transactionId } = await request.json()

    if (!paymentId || !paymentMethod) {
      return NextResponse.json({ error: 'Payment ID and method are required' }, { status: 400 })
    }

    // In a real implementation, this would verify the payment with the payment gateway
    // For now, we'll simulate a successful verification
    
    // Find the payment record
    const payment = await db.paymentRecord.findFirst({
      where: {
        userId: user.id,
        paymentId: paymentId,
        status: 'PENDING'
      }
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found or already processed' }, { status: 404 })
    }

    // Update payment status
    const updatedPayment = await db.paymentRecord.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
        metadata: JSON.stringify({
          ...JSON.parse(payment.metadata || '{}'),
          transactionId,
          verifiedAt: new Date().toISOString(),
          paymentMethod
        })
      }
    })

    // If it's a subscription payment, activate the subscription
    if (payment.type === 'SUBSCRIPTION') {
      const startDate = new Date()
      let endDate = new Date()
      
      // Set end date based on amount
      if (payment.amount >= 99 && payment.amount < 297) {
        endDate.setMonth(endDate.getMonth() + 1)
      } else if (payment.amount >= 297 && payment.amount < 1188) {
        endDate.setMonth(endDate.getMonth() + 3)
      } else if (payment.amount >= 1188) {
        endDate.setFullYear(endDate.getFullYear() + 1)
      }

      await db.subscription.upsert({
        where: {
          userId_type: {
            userId: user.id,
            type: 'MONTHLY'
          }
        },
        update: {
          status: 'ACTIVE',
          startDate,
          endDate,
          paymentId: payment.id
        },
        create: {
          userId: user.id,
          type: 'MONTHLY',
          status: 'ACTIVE',
          startDate,
          endDate,
          paymentId: payment.id
        }
      })
    }

    return NextResponse.json({
      success: true,
      payment: updatedPayment
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}