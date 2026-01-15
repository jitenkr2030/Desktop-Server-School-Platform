import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payment = await db.paymentRecord.findFirst({
      where: {
        paymentId: params.paymentId,
        userId: user.id
      }
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    return NextResponse.json({
      paymentId: payment.paymentId,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      type: payment.type,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt
    })

  } catch (error) {
    console.error('Error checking payment status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}