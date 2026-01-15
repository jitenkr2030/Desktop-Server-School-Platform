import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUser } from '@/lib/auth'

// GET /api/discussions/[id]/replies - Get replies for a discussion
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const discussionId = params.id

    // Check if discussion exists
    const discussion = await db.discussion.findUnique({
      where: { id: discussionId }
    })

    if (!discussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 })
    }

    // Get all replies for this discussion
    const replies = await db.discussionReply.findMany({
      where: {
        discussionId,
        isActive: true,
        parentReplyId: null // Only get top-level replies
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

    // Build nested replies for each top-level reply
    const getNestedReplies = async (parentId: string) => {
      const nestedReplies = await db.discussionReply.findMany({
        where: {
          discussionId,
          isActive: true,
          parentReplyId: parentId
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

      // Recursively get nested replies
      const repliesWithChildren = await Promise.all(
        nestedReplies.map(async (reply) => {
          const children = await getNestedReplies(reply.id)
          return {
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
            replies: children
          }
        })
      )

      return repliesWithChildren
    }

    const repliesWithNested = await Promise.all(
      replies.map(async (reply) => {
        const children = await getNestedReplies(reply.id)
        return {
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
          replies: children
        }
      })
    )

    return NextResponse.json({
      success: true,
      replies: repliesWithNested
    })

  } catch (error) {
    console.error('Error fetching replies:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/discussions/[id]/replies - Create a reply
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const discussionId = params.id
    const { content, parentReplyId } = await request.json()

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Check if discussion exists
    const discussion = await db.discussion.findUnique({
      where: { id: discussionId }
    })

    if (!discussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 })
    }

    // If parentReplyId is provided, verify it exists and belongs to this discussion
    if (parentReplyId) {
      const parentReply = await db.discussionReply.findFirst({
        where: {
          id: parentReplyId,
          discussionId
        }
      })

      if (!parentReply) {
        return NextResponse.json({ error: 'Parent reply not found' }, { status: 404 })
      }
    }

    // Create the reply
    const newReply = await db.discussionReply.create({
      data: {
        content: content.trim(),
        discussionId,
        userId: user.id,
        parentReplyId: parentReplyId || null,
        isActive: true,
        likeCount: 0,
        isEdited: false
      },
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

    return NextResponse.json({
      success: true,
      reply: {
        id: newReply.id,
        content: newReply.content,
        createdAt: newReply.createdAt,
        updatedAt: newReply.updatedAt,
        likeCount: newReply.likeCount,
        isEdited: newReply.isEdited,
        user: newReply.user,
        _count: {
          replies: 0
        },
        replies: []
      }
    })

  } catch (error) {
    console.error('Error creating reply:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
