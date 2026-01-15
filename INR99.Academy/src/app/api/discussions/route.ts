import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUser } from '@/lib/auth'

// GET /api/discussions - List discussions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Build where clause
    const where: any = {
      isActive: true
    }

    if (courseId) {
      where.courseId = courseId
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } }
      ]
    }

    if (tag) {
      where.tags = { has: tag }
    }

    // Fetch discussions
    const discussions = await db.discussion.findMany({
      where,
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: offset,
      take: limit,
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

    // Transform the response
    const transformedDiscussions = discussions.map(discussion => ({
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
    }))

    // Get total count for pagination
    const total = await db.discussion.count({ where })

    // Get unique tags from all discussions
    const allTags = await db.discussion.findMany({
      where: { isActive: true },
      select: { tags: true }
    })

    const tagsSet = new Set<string>()
    allTags.forEach(d => d.tags.forEach(t => tagsSet.add(t)))
    const tags = Array.from(tagsSet).sort()

    return NextResponse.json({
      success: true,
      discussions: transformedDiscussions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      tags
    })

  } catch (error) {
    console.error('Error fetching discussions:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/discussions - Create a new discussion
export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, content, courseId, tags, difficultyLevel, subjectCategory } = await request.json()

    if (!title || !content || !courseId) {
      return NextResponse.json(
        { error: 'Title, content, and course ID are required' },
        { status: 400 }
      )
    }

    // Verify course exists
    const course = await db.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Create the discussion
    const newDiscussion = await db.discussion.create({
      data: {
        title,
        content,
        courseId,
        userId: user.id,
        tags: tags || [],
        difficultyLevel: difficultyLevel || 'Beginner',
        subjectCategory: subjectCategory || 'General',
        isActive: true,
        isPinned: false,
        viewCount: 0,
        likeCount: 0
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
        ...newDiscussion,
        _count: {
          replies: 0
        }
      }
    })

  } catch (error) {
    console.error('Error creating discussion:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
