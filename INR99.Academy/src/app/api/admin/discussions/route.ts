import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user || user.id !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit
    const search = searchParams.get('search') || ''

    const whereClause = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } }
          ]
        }
      : {}

    const discussions = await db.discussion.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            mobileNumber: true
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
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: offset,
      take: limit
    })

    const total = await db.discussion.count({
      where: whereClause
    })

    return NextResponse.json({
      discussions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching discussions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user || user.id !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { discussionId, isActive, isPinned } = await request.json()

    if (!discussionId) {
      return NextResponse.json({ error: 'Discussion ID is required' }, { status: 400 })
    }

    const updateData: any = {}
    if (isActive !== undefined) updateData.isActive = isActive
    if (isPinned !== undefined) updateData.isPinned = isPinned

    const discussion = await db.discussion.update({
      where: { id: discussionId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            mobileNumber: true
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

    return NextResponse.json(discussion)
  } catch (error) {
    console.error('Error updating discussion:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user || user.id !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const discussionId = searchParams.get('discussionId')

    if (!discussionId) {
      return NextResponse.json({ error: 'Discussion ID is required' }, { status: 400 })
    }

    await db.discussion.delete({
      where: { id: discussionId }
    })

    return NextResponse.json({ message: 'Discussion deleted successfully' })
  } catch (error) {
    console.error('Error deleting discussion:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}