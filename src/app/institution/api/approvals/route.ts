import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'

// Get approval requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantSlug = searchParams.get('tenantSlug')
    const status = searchParams.get('status')
    const contentType = searchParams.get('contentType')
    const reviewerId = searchParams.get('reviewerId')
    const submittedBy = searchParams.get('submittedBy')
    const search = searchParams.get('search') || ''

    if (!tenantSlug) {
      return NextResponse.json(
        { error: 'Tenant slug is required' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Get tenant
    const tenant = await db.tenant.findUnique({
      where: { slug: tenantSlug },
    })

    if (!tenant) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      )
    }

    // Build where clause
    const where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (contentType && contentType !== 'all') {
      where.contentType = contentType
    }

    if (reviewerId) {
      where.reviewedBy = reviewerId
    }

    if (submittedBy) {
      where.submittedBy = submittedBy
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const requests = await db.contentApprovalRequest.findMany({
      where,
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
        _count: {
          select: {
            reviews: true,
            comments: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' },
      ],
    })

    return NextResponse.json({
      success: true,
      requests,
    })
  } catch (error) {
    console.error('Get approval requests error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch approval requests' },
      { status: 500 }
    )
  }
}

// Create approval request
export async function POST(request: NextRequest) {
  try {
    const {
      contentType,
      contentId,
      title,
      description,
      submittedBy,
      submittedByName,
      priority,
      dueDate,
    } = await request.json()

    if (!contentType || !contentId || !title || !submittedBy) {
      return NextResponse.json(
        { error: 'Content type, content ID, title, and submitter are required' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Create approval request
    const approvalRequest = await db.contentApprovalRequest.create({
      data: {
        contentType,
        contentId,
        title,
        description,
        submittedBy,
        status: 'DRAFT',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    })

    // Add initial review action
    await db.contentReview.create({
      data: {
        requestId: approvalRequest.id,
        reviewerId: submittedBy,
        action: 'SUBMIT_FOR_REVIEW',
        notes: 'Content submitted for review',
      },
    })

    return NextResponse.json({
      success: true,
      request: approvalRequest,
    })
  } catch (error) {
    console.error('Create approval request error:', error)
    return NextResponse.json(
      { error: 'Failed to create approval request' },
      { status: 500 }
    )
  }
}

// Update approval request status
export async function PATCH(request: NextRequest) {
  try {
    const {
      id,
      status,
      reviewerId,
      reviewNotes,
      action,
      priority,
      dueDate,
    } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Get current request
    const currentRequest = await db.contentApprovalRequest.findUnique({
      where: { id },
    })

    if (!currentRequest) {
      return NextResponse.json(
        { error: 'Approval request not found' },
        { status: 404 }
      )
    }

    // Determine new status based on action
    let newStatus = status
    if (action) {
      switch (action) {
        case 'SUBMIT_FOR_REVIEW':
          newStatus = 'PENDING_REVIEW'
          break
        case 'START_REVIEW':
          newStatus = 'IN_REVIEW'
          break
        case 'APPROVE':
          newStatus = 'APPROVED'
          break
        case 'REJECT':
          newStatus = 'REJECTED'
          break
        case 'REQUEST_REVISION':
          newStatus = 'REVISION_REQUESTED'
          break
        case 'PUBLISH':
          newStatus = 'PUBLISHED'
          break
        case 'ARCHIVE':
          newStatus = 'ARCHIVED'
          break
      }
    }

    // Update request
    const updatedRequest = await db.contentApprovalRequest.update({
      where: { id },
      data: {
        ...(newStatus && { status: newStatus }),
        ...(reviewerId && { reviewedBy: reviewerId }),
        ...(reviewNotes && { reviewNotes }),
        ...(newStatus && newStatus !== currentRequest.status && { reviewedAt: new Date() }),
        ...(priority && { priority }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
      },
    })

    // Create review record if action was provided
    if (action && reviewerId) {
      await db.contentReview.create({
        data: {
          requestId: id,
          reviewerId,
          action,
          notes: reviewNotes,
        },
      })
    }

    return NextResponse.json({
      success: true,
      request: updatedRequest,
    })
  } catch (error) {
    console.error('Update approval request error:', error)
    return NextResponse.json(
      { error: 'Failed to update approval request' },
      { status: 500 }
    )
  }
}

// Delete approval request
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      )
    }

    const db = createClient()

    await db.contentApprovalRequest.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Approval request deleted successfully',
    })
  } catch (error) {
    console.error('Delete approval request error:', error)
    return NextResponse.json(
      { error: 'Failed to delete approval request' },
      { status: 500 }
    )
  }
}
