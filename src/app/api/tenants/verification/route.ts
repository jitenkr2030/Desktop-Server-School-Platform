import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024

// Allowed file types
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
]

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const tenantId = formData.get('tenantId') as string
    const documentType = formData.get('documentType') as string
    const file = formData.get('file') as File

    // Validate required fields
    if (!tenantId || !documentType || !file) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: PDF, JPEG, PNG' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Verify user has access to this tenant
    const db = createClient()
    const tenantUser = await db.tenantUser.findFirst({
      where: {
        tenantId,
        userId: session.user.id,
        role: { in: ['OWNER', 'ADMIN'] },
        status: 'ACTIVE',
      },
    })

    if (!tenantUser) {
      return NextResponse.json(
        { error: 'You do not have permission to upload documents for this institution' },
        { status: 403 }
      )
    }

    // Check tenant eligibility status
    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
    })

    if (!tenant) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      )
    }

    if (tenant.eligibilityStatus === 'ELIGIBLE') {
      return NextResponse.json(
        { error: 'Your institution is already verified' },
        { status: 400 }
      )
    }

    if (tenant.eligibilityStatus === 'EXPIRED' && tenant.studentCount && tenant.studentCount < 1500) {
      return NextResponse.json(
        { error: 'Your institution does not meet the minimum student requirement (1500 students)' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split('.').pop()
    const fileName = `${tenantId}-${documentType}-${timestamp}-${randomString}.${fileExtension}`

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'verification')
    await mkdir(uploadDir, { recursive: true })

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = path.join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    // Create document record
    const document = await db.verificationDocument.create({
      data: {
        tenantId,
        documentType: documentType as any,
        fileName: file.name,
        fileUrl: `/uploads/verification/${fileName}`,
        fileSize: file.size,
        mimeType: file.type,
        status: 'PENDING',
      },
    })

    // Update tenant status to UNDER_REVIEW if it was PENDING
    if (tenant.eligibilityStatus === 'PENDING') {
      await db.tenant.update({
        where: { id: tenantId },
        data: {
          eligibilityStatus: 'UNDER_REVIEW',
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Document uploaded successfully',
      document: {
        id: document.id,
        documentType: document.documentType,
        fileName: document.fileName,
        createdAt: document.createdAt,
      },
    })
  } catch (error) {
    console.error('Document upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId')

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      )
    }

    const db = createClient()
    
    // Verify user has access to this tenant
    const tenantUser = await db.tenantUser.findFirst({
      where: {
        tenantId,
        userId: session.user.id,
        status: 'ACTIVE',
      },
    })

    if (!tenantUser) {
      return NextResponse.json(
        { error: 'You do not have permission to view documents for this institution' },
        { status: 403 }
      )
    }

    const documents = await db.verificationDocument.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      documents,
    })
  } catch (error) {
    console.error('Get documents error:', error)
    return NextResponse.json(
      { error: 'Failed to get documents' },
      { status: 500 }
    )
  }
}
