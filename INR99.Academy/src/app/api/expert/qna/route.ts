import { NextRequest, NextResponse } from 'next/server'
import { getExpertQnAByLessonId, getDiscussionsByCourseId } from '@/lib/simple-db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lessonId = searchParams.get('lessonId')

  if (!lessonId) {
    return NextResponse.json(
      { error: 'Lesson ID is required' },
      { status: 400 }
    )
  }

  try {
    // Get expert Q&A info for this lesson
    const expertQnA = getExpertQnAByLessonId(lessonId)

    if (!expertQnA) {
      // Return default response if no expert assigned
      return NextResponse.json({
        success: true,
        data: {
          expert: {
            id: 'inst6',
            name: 'Arun Patel',
            expertise: 'Finance & Digital Payments Expert'
          },
          questionCount: 0,
          threadId: null,
          message: 'No expert assigned yet. Submit a question to start a discussion.'
        }
      })
    }

    // Get question count from discussions
    const discussions = getDiscussionsByCourseId(expertQnA.courseId)
    const relatedDiscussions = discussions.filter(d =>
      d.tags?.includes('Confusion Remover') ||
      d.tags?.some(tag => tag.includes(lessonId))
    )

    return NextResponse.json({
      success: true,
      data: {
        expert: {
          id: expertQnA.expertId,
          name: expertQnA.expertName
        },
        questionCount: relatedDiscussions.length,
        threadId: expertQnA.discussionThreadId,
        lastActivity: expertQnA.lastActivityAt
      }
    })
  } catch (error) {
    console.error('Error fetching expert Q&A:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expert Q&A information' },
      { status: 500 }
    )
  }
}
