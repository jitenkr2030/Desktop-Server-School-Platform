import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUser } from '@/lib/auth'

// GET /api/discussions/[id] - Get a specific discussion with replies
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const discussionId = params.id

    // Get the discussion
    const discussion = await db.discussion.findUnique({
      where: { id: discussionId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        course: {
          select: {
            id: true,
            title: true
          }
        },
        _count: {
          select: {
            replies: true
          }
        }
      }
    })

    if (!discussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 })
    }

    // Increment view count
    await db.discussion.update({
      where: { id: discussionId },
      data: { viewCount: { increment: 1 } }
    })

    // Get replies for this discussion
    const replies = await db.discussionReply.findMany({
      where: {
        discussionId,
        isActive: true
      },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            replies: true
          }
        }
      }
    })

    // Transform the discussion
    const transformedDiscussion = {
      id: discussion.id,
      title: discussion.title,
      content: discussion.content,
      isPinned: discussion.isPinned,
      createdAt: discussion.createdAt,
      updatedAt: discussion.updatedAt,
      user: discussion.user,
      course: discussion.course,
      tags: discussion.tags,
      difficultyLevel: discussion.difficultyLevel,
      subjectCategory: discussion.subjectCategory,
      viewCount: discussion.viewCount,
      likeCount: discussion.likeCount,
      _count: {
        replies: discussion._count.replies
      }
    }

    // Transform replies (including nested replies)
    const buildReplyTree = (repliesList: any[], parentId: string | null = null): any[] => {
      return repliesList
        .filter(reply => reply.parentReplyId === parentId)
        .map(reply => ({
          id: reply.id,
          content: reply.content,
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
          likeCount: reply.likeCount,
          isEdited: reply.isEdited,
          user: reply.user,
          _count: {
            replies: reply._count.replies
          },
          replies: buildReplyTree(repliesList, reply.id)
        }))
    }

    return NextResponse.json({
      success: true,
      discussion: transformedDiscussion,
      replies: buildReplyTree(replies)
    })

  } catch (error) {
    console.error('Error fetching discussion:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/discussions/[id] - Update a discussion
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const discussionId = params.id
    const { title, content, isPinned } = await request.json()

    // Get the existing discussion
    const existingDiscussion = await db.discussion.findUnique({
      where: { id: discussionId },
      include: {
        user: { select: { id: true } }
      }
    })

    if (!existingDiscussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 })
    }

    // Check if user is the owner or an admin
    const currentUser = await db.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    const isOwner = existingDiscussion.userId === user.id
    const isAdmin = currentUser?.role === 'ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update the discussion
    const updatedDiscussion = await db.discussion.update({
      where: { id: discussionId },
      data: {
        title: title !== undefined ? title : existingDiscussion.title,
        content: content !== undefined ? content : existingDiscussion.content,
        isPinned: isPinned !== undefined ? isPinned : existingDiscussion.isPinned,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        course: {
          select: {
            id: true,
            title: true
          }
        },
        _count: {
          select: {
            replies: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      discussion: {
        ...updatedDiscussion,
        _count: {
          replies: updatedDiscussion._count.replies
        }
      }
    })

  } catch (error) {
    console.error('Error updating discussion:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/discussions/[id] - Delete a discussion
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const discussionId = params.id

    // Get the existing discussion
    const existingDiscussion = await db.discussion.findUnique({
      where: { id: discussionId },
      include: {
        user: { select: { id: true } }
      }
    })

    if (!existingDiscussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 })
    }

    // Check if user is the owner or an admin
    const currentUser = await db.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    const isOwner = existingDiscussion.userId === user.id
    const isAdmin = currentUser?.role === 'ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Soft delete the discussion
    await db.discussion.update({
      where: { id: discussionId },
      data: { isActive: false }
    })

    return NextResponse.json({
      success: true,
      message: 'Discussion deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting discussion:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
