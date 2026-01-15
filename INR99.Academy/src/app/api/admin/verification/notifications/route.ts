import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email/verification'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin permissions
    const admin = await prisma.user.findFirst({
      where: {
        clerkId: userId,
        role: 'ADMIN'
      }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { tenantId, notificationType } = body

    if (!tenantId || !notificationType) {
      return NextResponse.json(
        { error: 'tenantId and notificationType are required' },
        { status: 400 }
      )
    }

    // Get tenant with user info
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        users: true
      }
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    // Get admin info for the notification
    const adminUser = await prisma.user.findFirst({
      where: { clerkId: userId }
    })

    // Send email notification
    const emailResult = await sendVerificationEmail({
      tenantId: tenant.id,
      tenantName: tenant.name,
      recipientEmail: tenant.users[0]?.email || '',
      notificationType,
      adminName: adminUser?.name || 'Administrator',
      reviewNotes: body.reviewNotes || null
    })

    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.error || 'Failed to send notification' },
        { status: 500 }
      )
    }

    // Create notification record
    await prisma.verificationNotification.create({
      data: {
        tenantId: tenant.id,
        type: notificationType,
        channel: 'EMAIL',
        status: 'SENT',
        sentAt: new Date(),
        metadata: {
          sentBy: userId,
          reviewNotes: body.reviewNotes
        }
      }
    })

    // Create audit log
    await prisma.verificationAuditLog.create({
      data: {
        tenantId: tenant.id,
        action: 'NOTIFICATION_SENT',
        details: {
          notificationType,
          channel: 'EMAIL',
          recipientEmail: tenant.users[0]?.email
        },
        performedBy: userId
      }
    })

    return NextResponse.json({
      success: true,
      message: `Notification sent to ${tenant.name}`
    })
  } catch (error) {
    console.error('Error sending notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin permissions
    const admin = await prisma.user.findFirst({
      where: {
        clerkId: userId,
        role: 'ADMIN'
      }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId')

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId is required' },
        { status: 400 }
      )
    }

    // Get notification history
    const notifications = await prisma.verificationNotification.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      notifications
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}
