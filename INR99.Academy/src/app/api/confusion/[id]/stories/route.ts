import { NextRequest, NextResponse } from 'next/server'
import {
  getSuccessStoriesByLessonId,
  getRecentSuccessStories,
  getFeaturedSuccessStories
} from '@/lib/simple-db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const lessonId = (await params).id
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'lesson'

  try {
    let stories

    switch (type) {
      case 'recent':
        const recentLimit = parseInt(searchParams.get('limit') || '3')
        stories = getRecentSuccessStories(recentLimit)
        break
      case 'featured':
        stories = getFeaturedSuccessStories()
        break
      default:
        stories = getSuccessStoriesByLessonId(lessonId)
        break
    }

    return NextResponse.json({
      success: true,
      count: stories.length,
      data: stories,
      type,
      lessonId: type === 'lesson' ? lessonId : null
    })
  } catch (error) {
    console.error('Error fetching success stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch success stories' },
      { status: 500 }
    )
  }
}
