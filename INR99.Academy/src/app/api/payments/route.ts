import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const payments = await db.paymentRecord.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit
    })

    const total = await db.paymentRecord.count({
      where: { userId: user.id }
    })

    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, amount, paymentMethod, paymentId } = await request.json()

    if (!type || !amount || !paymentMethod) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 })
    }

    // Create payment record
    const payment = await db.paymentRecord.create({
      data: {
        userId: user.id,
        type,
        amount,
        currency: 'INR',
        status: 'COMPLETED',
        paymentId,
        metadata: JSON.stringify({
          paymentMethod,
          processedAt: new Date().toISOString()
        })
      }
    })

    // If it's a subscription payment, create or update subscription
    if (type === 'SUBSCRIPTION') {
      const startDate = new Date()
      let endDate = new Date()
      
      // Set end date based on amount (assuming ₹99 = 1 month)
      if (amount >= 99 && amount < 297) {
        endDate.setMonth(endDate.getMonth() + 1)
      } else if (amount >= 297 && amount < 1188) {
        endDate.setMonth(endDate.getMonth() + 3)
      } else if (amount >= 1188) {
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

    return NextResponse.json(payment)
  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}