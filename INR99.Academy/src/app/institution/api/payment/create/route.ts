import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'
import crypto from 'crypto'

// Cashfree configuration - in production, use environment variables
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || 'YOUR_APP_ID'
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || 'YOUR_SECRET_KEY'
const CASHFREE_ENV = process.env.CASHFREE_ENV || 'sandbox'

interface CashfreePaymentRequest {
  tenantId: string
  amount: number
  customerId: string
  customerEmail: string
  customerPhone: string
}

interface CashfreePaymentResponse {
  payment_session_id: string
  order_id: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CashfreePaymentRequest = await request.json()
    const { tenantId, amount, customerId, customerEmail, customerPhone } = body

    if (!tenantId || !amount || !customerId || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Get tenant details
    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
      include: { subscription: true },
    })

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }

    // Generate order ID
    const orderId = `TNT_${tenantId}_${Date.now()}`

    // Create order payload for Cashfree
    const orderPayload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_id: customerId,
      customer_email: customerEmail,
      customer_phone: customerPhone || '9999999999',
      order_note: `Subscription for ${tenant.name}`,
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/institution/payment/success?order_id={order_id}`,
      },
    }

    // In production, call Cashfree API
    // For now, we'll create a mock response for development
    if (CASHFREE_ENV === 'sandbox' || CASHFREE_APP_ID === 'YOUR_APP_ID') {
      // Mock response for development
      const mockSessionId = `session_${orderId}_${Date.now()}`

      // Save payment order to database
      await db.tenantPayment.create({
        data: {
          subscriptionId: tenant.subscription?.id || '',
          amount,
          currency: 'INR',
          status: 'PENDING',
          paymentId: orderId,
        },
      })

      return NextResponse.json({
        success: true,
        payment_session_id: mockSessionId,
        order_id: orderId,
        environment: 'sandbox',
        message: 'Payment order created (sandbox mode)',
      })
    }

    // Production Cashfree API call
    const cashfreeResponse = await fetch(
      'https://api.cashfree.com/pg/v1/orders',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-version': '2022-09-01',
          'x-client-id': CASHFREE_APP_ID,
          'x-client-secret': CASHFREE_SECRET_KEY,
        },
        body: JSON.stringify(orderPayload),
      }
    )

    if (!cashfreeResponse.ok) {
      const errorData = await cashfreeResponse.json()
      console.error('Cashfree API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to create payment order' },
        { status: 500 }
      )
    }

    const cashfreeData: CashfreePaymentResponse = await cashfreeResponse.json()

    // Save payment order to database
    await db.tenantPayment.create({
      data: {
        subscriptionId: tenant.subscription?.id || '',
        amount,
        currency: 'INR',
        status: 'PENDING',
        paymentId: orderId,
      },
    })

    return NextResponse.json({
      success: true,
      payment_session_id: cashfreeData.payment_session_id,
      order_id: orderId,
      environment: 'production',
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}
