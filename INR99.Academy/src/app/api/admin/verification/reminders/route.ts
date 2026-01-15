import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const daysRemaining = parseInt(searchParams.get('days') || '0')

    const db = createClient()
    
    // Calculate deadline based on days remaining
    const deadline = new Date()
    deadline.setDate(deadline.getDate() + daysRemaining)

    // Find institutions with specific deadline
    const startOfDay = new Date(deadline)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(deadline)
    endOfDay.setHours(23, 59, 59, 999)

    const institutions = await db.tenant.findMany({
      where: {
        eligibilityStatus: 'PENDING',
        eligibilityDeadline: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        id: true,
        name: true,
        eligibilityDeadline: true,
        users: {
          where: {
            role: 'OWNER',
            status: 'ACTIVE',
          },
          select: {
            email: true,
            name: true,
          },
          take: 1,
        },
      },
    })

    return NextResponse.json({
      success: true,
      count: institutions.length,
      institutions: institutions.map(inst => ({
        id: inst.id,
        name: inst.name,
        deadline: inst.eligibilityDeadline,
        adminEmail: inst.users[0]?.email,
        adminName: inst.users[0]?.name,
      })),
    })
  } catch (error) {
    console.error('Get reminders error:', error)
    return NextResponse.json(
      { error: 'Failed to get reminder list' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { daysRemaining, testMode } = body

    if (!daysRemaining || daysRemaining < 0) {
      return NextResponse.json(
        { error: 'Valid days remaining required' },
        { status: 400 }
      )
    }

    const db = createClient()
    
    // Calculate deadline range
    const deadline = new Date()
    deadline.setDate(deadline.getDate() + daysRemaining)

    const startOfDay = new Date(deadline)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(deadline)
    endOfDay.setHours(23, 59, 59, 999)

    // Find institutions needing reminder
    const institutions = await db.tenant.findMany({
      where: {
        eligibilityStatus: 'PENDING',
        eligibilityDeadline: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        users: {
          where: {
            role: 'OWNER',
            status: 'ACTIVE',
          },
          take: 1,
        },
      },
    })

    const results = {
      totalFound: institutions.length,
      remindersSent: 0,
      failed: 0,
      testMode,
      institutions: [] as any[],
    }

    for (const institution of institutions) {
      const admin = institution.users[0]
      if (!admin) continue

      try {
        if (!testMode) {
          // In production, send actual email
          // await sendEmail({
          //   to: admin.email,
          //   subject: `Reminder: Complete verification for ${institution.name}`,
          //   template: 'verification-reminder',
          //   data: {
          //     institutionName: institution.name,
          //     daysRemaining,
          //     verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/institution/verification`,
          //   },
          // })
          
          // Log for now
          console.log(`[EMAIL] Would send reminder to ${admin.email} for ${institution.name} (${daysRemaining} days remaining)`)
        }

        results.remindersSent++
        results.institutions.push({
          id: institution.id,
          name: institution.name,
          email: admin.email,
          status: 'sent',
        })
      } catch (err) {
        results.failed++
        results.institutions.push({
          id: institution.id,
          name: institution.name,
          email: admin.email,
          status: 'failed',
          error: err instanceof Error ? err.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: testMode 
        ? `Test mode: Found ${results.totalFound} institutions` 
        : `Sent ${results.remindersSent} reminders, ${results.failed} failed`,
      results,
    })
  } catch (error) {
    console.error('Send reminders error:', error)
    return NextResponse.json(
      { error: 'Failed to send reminders' },
      { status: 500 }
    )
  }
}
