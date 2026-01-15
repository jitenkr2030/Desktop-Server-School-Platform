import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/db'

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
      },
      include: {
        verificationDocs: {
          orderBy: { createdAt: 'desc' }
        },
        verificationReviews: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    // Calculate days remaining if deadline exists
    const eligibilityDeadline = tenant.eligibilityDeadline
    const now = new Date()
    let daysRemaining: number | null = null

    if (eligibilityDeadline) {
      const deadline = new Date(eligibilityDeadline)
      const diff = deadline.getTime() - now.getTime()
      daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
    }

    // Transform data for frontend
    const submittedDocuments = tenant.verificationDocs.map(doc => ({
      id: doc.id,
      documentType: doc.documentType,
      fileName: doc.fileName,
      fileUrl: doc.fileUrl,
      status: doc.status,
      uploadedAt: doc.createdAt.toISOString(),
      reviewedAt: doc.reviewedAt?.toISOString() || null,
      reviewNotes: doc.reviewNotes
    }))

    const reviewNotes = tenant.verificationReviews.map(review => ({
      id: review.id,
      note: review.notes,
      createdAt: review.createdAt.toISOString(),
      type: review.type
    }))

    // Determine what documents are still required
    const requiredDocumentTypes = [
      'AICTE_APPROVAL',
      'NCTE_RECOGNITION',
      'STATE_GOVERNMENT_APPROVAL',
      'ENROLLMENT_DATA',
      'STUDENT_ID_SAMPLE',
      'INSTITUTION_REGISTRATION'
    ]

    const submittedTypes = submittedDocuments
      .filter(doc => doc.status !== 'REJECTED')
      .map(doc => doc.documentType)

    const documentsRequired = requiredDocumentTypes
      .filter(type => !submittedTypes.includes(type))
      .map(type => ({
        type,
        label: getDocumentTypeLabel(type),
        description: getDocumentTypeDescription(type),
        required: true
      }))

    return NextResponse.json({
      success: true,
      status: {
        status: tenant.eligibilityStatus,
        eligibilityStatus: tenant.eligibilityStatus,
        eligibilityDeadline: eligibilityDeadline?.toISOString() || null,
        daysRemaining,
        documentsRequired,
        submittedDocuments,
        reviewNotes
      }
    })
  } catch (error) {
    console.error('Error fetching verification status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch verification status' },
      { status: 500 }
    )
  }
}

function getDocumentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    AICTE_APPROVAL: 'AICTE Approval Certificate',
    NCTE_RECOGNITION: 'NCTE Recognition Letter',
    STATE_GOVERNMENT_APPROVAL: 'State Government Approval',
    ENROLLMENT_DATA: 'Enrollment Data (Audited)',
    STUDENT_ID_SAMPLE: 'Student ID Samples',
    INSTITUTION_REGISTRATION: 'Institution Registration',
    UNIVERSITY_AFFILIATION: 'University Affiliation Document',
    OTHER: 'Other Document'
  }
  return labels[type] || type
}

function getDocumentTypeDescription(type: string): string {
  const descriptions: Record<string, string> = {
    AICTE_APPROVAL: 'Valid approval certificate from All India Council for Technical Education',
    NCTE_RECOGNITION: 'Recognition letter from National Council for Teacher Education',
    STATE_GOVERNMENT_APPROVAL: 'Approval from relevant State Government authority',
    ENROLLMENT_DATA: 'Audited enrollment data for current academic year showing 1500+ students',
    STUDENT_ID_SAMPLE: 'Sample student ID cards (5-10 samples) to verify enrollment authenticity',
    INSTITUTION_REGISTRATION: 'Valid institution registration/society trust deed',
    UNIVERSITY_AFFILIATION: 'Affiliation agreement with recognized university',
    OTHER: 'Additional supporting documents'
  }
  return descriptions[type] || ''
}
