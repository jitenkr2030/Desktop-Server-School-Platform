import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'
import { s3Client, S3_BUCKET_NAME } from '@/lib/aws'
import { PutObjectCommand } from '@aws-sdk/client-s3'

// GET - Fetch existing appeal for tenant
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the tenant for this user
    const tenant = await prisma.tenant.findFirst({
      where: {
        users: {
          some: { clerkId: userId }
        }
      }
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    // Find existing appeal
    const appeal = await prisma.verificationAppeal.findFirst({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: 'desc' }
    })

    if (!appeal) {
      return NextResponse.json({ success: true, appeal: null })
    }

    return NextResponse.json({
      success: true,
      appeal: {
        id: appeal.id,
        tenantId: appeal.tenantId,
        tenantName: tenant.name,
        originalDecision: appeal.originalDecision,
        appealReason: appeal.appealReason,
        supportingDocuments: appeal.supportingDocuments as any[],
        status: appeal.status,
        submittedAt: appeal.createdAt.toISOString(),
        reviewedAt: appeal.reviewedAt?.toISOString() || null,
        reviewNotes: appeal.reviewNotes,
        reviewedBy: appeal.reviewedBy
      }
    })
  } catch (error) {
    console.error('Error fetching appeal:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appeal' },
      { status: 500 }
    )
  }
}

// POST - Submit new appeal
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const appealReason = formData.get('appealReason') as string

    if (!appealReason || appealReason.length < 50) {
      return NextResponse.json(
        { error: 'Appeal reason must be at least 50 characters' },
        { status: 400 }
      )
    }

    // Get the tenant for this user
    const tenant = await prisma.tenant.findFirst({
      where: {
        users: {
          some: { clerkId: userId }
        }
      }
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    // Check if tenant can submit appeal
    if (!['REJECTED', 'REQUIRES_MORE_INFO'].includes(tenant.eligibilityStatus)) {
      return NextResponse.json(
        { error: 'You can only appeal if your verification was rejected or requires more information' },
        { status: 400 }
      )
    }

    // Check for existing pending appeal
    const existingAppeal = await prisma.verificationAppeal.findFirst({
      where: {
        tenantId: tenant.id,
        status: { in: ['PENDING', 'MORE_INFO_REQUESTED'] }
      }
    })

    if (existingAppeal) {
      return NextResponse.json(
        { error: 'You already have a pending appeal. Please wait for it to be reviewed.' },
        { status: 400 }
      )
    }

    // Handle file uploads
    const supportingDocuments: Array<{ id: string; fileName: string; fileUrl: string }> = []

    for (const [key, value] of formData.entries()) {
      if (key.startsWith('document_') && value instanceof File && value.size > 0) {
        const file = value as File
        
        // Generate unique file name
        const fileExtension = file.name.split('.').pop()
        const uniqueFileName = `${tenant.id}/appeals/${uuidv4()}.${fileExtension}`

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to S3
        await s3Client.send(new PutObjectCommand({
          Bucket: S3_BUCKET_NAME,
          Key: uniqueFileName,
          Body: buffer,
          ContentType: file.type
        }))

        const fileUrl = `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${uniqueFileName}`

        supportingDocuments.push({
          id: uuidv4(),
          fileName: file.name,
          fileUrl
        })
      }
    }

    // Create appeal
    const appeal = await prisma.verificationAppeal.create({
      data: {
        tenantId: tenant.id,
        originalDecision: tenant.eligibilityStatus,
        appealReason,
        supportingDocuments: supportingDocuments as any,
        status: 'PENDING'
      }
    })

    // Create audit log
    await prisma.verificationAuditLog.create({
      data: {
        tenantId: tenant.id,
        action: 'APPEAL_SUBMITTED',
        details: {
          appealId: appeal.id,
          originalDecision: tenant.eligibilityStatus,
          documentCount: supportingDocuments.length
        },
        performedBy: userId
      }
    })

    // Notify admins (in production, this would send email/push notification)
    console.log(`New appeal submitted by ${tenant.name}`)

    return NextResponse.json({
      success: true,
      appeal: {
        id: appeal.id,
        submittedAt: appeal.createdAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Error submitting appeal:', error)
    return NextResponse.json(
      { error: 'Failed to submit appeal' },
      { status: 500 }
    )
  }
}
