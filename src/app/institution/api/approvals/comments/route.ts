import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'

// Get single approval request with all details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const includeComments = searchParams.get('includeComments') === 'true'

    if (!id) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      )
    }

    const db = createClient()

    const approvalRequest = await db.contentApprovalRequest.findUnique({
      where: { id },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
        ...(includeComments && {
          comments: {
            orderBy: { createdAt: 'asc' },
          },
        }),
      },
    })

    if (!approvalRequest) {
      return NextResponse.json(
        { error: 'Approval request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      request: approvalRequest,
    })
  } catch (error) {
    console.error('Get approval request error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch approval request' },
      { status: 500 }
    )
  }
}

// Add comment to approval request
export async function POST(request: NextRequest) {
  try {
    const { requestId, authorId, authorName, content, isInternal } = await request.json()

    if (!requestId || !authorId || !authorName || !content) {
      return NextResponse.json(
        { error: 'Request ID, author ID, author name, and content are required' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Verify request exists
    const existingRequest = await db.contentApprovalRequest.findUnique({
      where: { id: requestId },
    })

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Approval request not found' },
        { status: 404 }
      )
    }

    const comment = await db.contentComment.create({
      data: {
        requestId,
        authorId,
        authorName,
        content,
        isInternal: isInternal || false,
      },
    })

    // Update request status to IN_REVIEW if it was PENDING_REVIEW
    if (existingRequest.status === 'PENDING_REVIEW') {
      await db.contentApprovalRequest.update({
        where: { id: requestId },
        data: { status: 'IN_REVIEW' },
      })
    }

    return NextResponse.json({
      success: true,
      comment,
    })
  } catch (error) {
    console.error('Add comment error:', error)
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    )
  }
}

// Update or delete comment
export async function PATCH(request: NextRequest) {
  try {
    const { commentId, content, action } = await request.json()

    const db = createClient()

    if (action === 'delete' && commentId) {
      await db.contentComment.delete({
        where: { id: commentId },
      })
      return NextResponse.json({
        success: true,
        message: 'Comment deleted successfully',
      })
    }

    if (commentId && content) {
      const comment = await db.contentComment.update({
        where: { id: commentId },
        data: { content },
      })
      return NextResponse.json({
        success: true,
        comment,
      })
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Update comment error:', error)
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    )
  }
}
