import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/db'
import { s3Client, S3_BUCKET_NAME } from '@/lib/aws'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const documentType = formData.get('documentType') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!documentType) {
      return NextResponse.json({ error: 'Document type is required' }, { status: 400 })
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only PDF, JPEG, PNG, and WebP files are allowed' },
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

    // Check if verification is still pending
    if (!['PENDING', 'REQUIRES_MORE_INFO', 'UNDER_REVIEW'].includes(tenant.eligibilityStatus)) {
      return NextResponse.json(
        { error: 'Cannot upload documents at this time' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique file name
    const fileExtension = file.name.split('.').pop()
    const uniqueFileName = `${tenant.id}/${documentType}/${uuidv4()}.${fileExtension}`

    // Upload to S3
    const uploadParams = {
      Bucket: S3_BUCKET_NAME,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        tenantId: tenant.id,
        documentType,
        originalFileName: file.name
      }
    }

    await s3Client.send(new PutObjectCommand(uploadParams))

    // Generate file URL
    const fileUrl = `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${uniqueFileName}`

    // Save to database
    const verificationDoc = await prisma.verificationDocument.create({
      data: {
        tenantId: tenant.id,
        documentType,
        fileName: file.name,
        fileUrl,
        status: 'PENDING'
      }
    })

    // Create audit log
    await prisma.verificationAuditLog.create({
      data: {
        tenantId: tenant.id,
        action: 'DOCUMENT_UPLOADED',
        details: {
          documentId: verificationDoc.id,
          documentType,
          fileName: file.name,
          fileSize: file.size
        },
        performedBy: userId
      }
    })

    // Update tenant status to UNDER_REVIEW if it was PENDING
    if (tenant.eligibilityStatus === 'PENDING') {
      await prisma.tenant.update({
        where: { id: tenant.id },
        data: { eligibilityStatus: 'UNDER_REVIEW' }
      })
    }

    return NextResponse.json({
      success: true,
      document: {
        id: verificationDoc.id,
        documentType: verificationDoc.documentType,
        fileName: verificationDoc.fileName,
        fileUrl: verificationDoc.fileUrl,
        status: verificationDoc.status,
        uploadedAt: verificationDoc.createdAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Error uploading document:', error)
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    )
  }
}
