import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { s3Client, S3_BUCKET_NAME } from '@/lib/aws'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { documentId } = params

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

    // Find the document
    const document = await prisma.verificationDocument.findFirst({
      where: {
        id: documentId,
        tenantId: tenant.id
      }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Delete from S3
    try {
      const fileKey = document.fileUrl.split('.s3.amazonaws.com/')[1]
      await s3Client.send(new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: fileKey
      }))
    } catch (s3Error) {
      console.error('Error deleting from S3:', s3Error)
      // Continue with database deletion even if S3 deletion fails
    }

    // Delete from database
    await prisma.verificationDocument.delete({
      where: { id: documentId }
    })

    // Create audit log
    await prisma.verificationAuditLog.create({
      data: {
        tenantId: tenant.id,
        action: 'DOCUMENT_DELETED',
        details: {
          documentId,
          documentType: document.documentType,
          fileName: document.fileName
        },
        performedBy: userId
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    )
  }
}
