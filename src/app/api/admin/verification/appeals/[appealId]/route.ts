import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email/verification'

// PATCH - Review an appeal
export async function PATCH(
  request: NextRequest,
  { params }: { params: { appealId: string } }
) {
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

    const { appealId } = params
    const body = await request.json()
    const { decision, reviewNotes } = body

    if (!decision || !['APPROVED', 'REJECTED', 'MORE_INFO_REQUESTED'].includes(decision)) {
      return NextResponse.json(
        { error: 'Invalid decision. Must be APPROVED, REJECTED, or MORE_INFO_REQUESTED' },
        { status: 400 }
      )
    }

    if (decision !== 'APPROVED' && !reviewNotes?.trim()) {
      return NextResponse.json(
        { error: 'Review notes are required for non-approval decisions' },
        { status: 400 }
      )
    }

    // Find the appeal
    const appeal = await prisma.verificationAppeal.findUnique({
      where: { id: appealId },
      include: {
        tenant: {
          include: {
            users: true
          }
        }
      }
    })

    if (!appeal) {
      return NextResponse.json({ error: 'Appeal not found' }, { status: 404 })
    }

    if (appeal.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'This appeal has already been reviewed' },
        { status: 400 }
      )
    }

    // Update the appeal
    const updatedAppeal = await prisma.verificationAppeal.update({
      where: { id: appealId },
      data: {
        status: decision,
        reviewNotes: reviewNotes || null,
        reviewedAt: new Date(),
        reviewedBy: userId
      }
    })

    // Handle tenant status based on decision
    if (decision === 'APPROVED') {
      // Approve the tenant's verification
      await prisma.tenant.update({
        where: { id: appeal.tenantId },
        data: {
          eligibilityStatus: 'APPROVED',
          verifiedAt: new Date()
        }
      })

      // Send approval notification
      const recipientEmail = appeal.tenant.users[0]?.email
      if (recipientEmail) {
        await sendVerificationEmail({
          tenantId: appeal.tenantId,
          tenantName: appeal.tenant.name,
          recipientEmail,
          notificationType: 'APPROVED',
          adminName: admin.name || 'Administrator',
          reviewNotes: `Your appeal has been approved. ${reviewNotes || ''}`
        })
      }
    } else if (decision === 'REJECTED') {
      // Keep the tenant rejected but update appeal status
      await prisma.tenant.update({
        where: { id: appeal.tenantId },
        data: {
          eligibilityStatus: 'REJECTED'
        }
      })

      // Send rejection notification
      const recipientEmail = appeal.tenant.users[0]?.email
      if (recipientEmail) {
        await sendVerificationEmail({
          tenantId: appeal.tenantId,
          tenantName: appeal.tenant.name,
          recipientEmail,
          notificationType: 'REJECTED',
          adminName: admin.name || 'Administrator',
          reviewNotes: `Your appeal has been reviewed and not approved. ${reviewNotes || ''}`
        })
      }
    } else if (decision === 'MORE_INFO_REQUESTED') {
      // Update tenant status to require more info
      await prisma.tenant.update({
        where: { id: appeal.tenantId },
        data: {
          eligibilityStatus: 'REQUIRES_MORE_INFO'
        }
      })

      // Send notification
      const recipientEmail = appeal.tenant.users[0]?.email
      if (recipientEmail) {
        await sendVerificationEmail({
          tenantId: appeal.tenantId,
          tenantName: appeal.tenant.name,
          recipientEmail,
          notificationType: 'REQUIRES_MORE_INFO',
          adminName: admin.name || 'Administrator',
          reviewNotes: reviewNotes || 'Please provide additional information.'
        })
      }
    }

    // Create audit log
    await prisma.verificationAuditLog.create({
      data: {
        tenantId: appeal.tenantId,
        action: 'APPEAL_REVIEWED',
        details: {
          appealId,
          decision,
          reviewNotes
        },
        performedBy: userId
      }
    })

    return NextResponse.json({
      success: true,
      appeal: {
        id: updatedAppeal.id,
        status: updatedAppeal.status,
        reviewedAt: updatedAppeal.reviewedAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Error reviewing appeal:', error)
    return NextResponse.json(
      { error: 'Failed to review appeal' },
      { status: 500 }
    )
  }
}
