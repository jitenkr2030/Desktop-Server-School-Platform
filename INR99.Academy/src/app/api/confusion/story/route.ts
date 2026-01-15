import { NextRequest, NextResponse } from 'next/server'

// Mock story storage (in production, use database)
const stories: Map<string, any> = new Map()

// Seed with some initial stories
const initialStories = [
  {
    id: 'story_init_1',
    userId: 'user1',
    userName: 'Geeta Kumari',
    story: 'Before learning about UPI, I was so scared of digital payments. I used to go to the bank for everything. After reading the "What is UPI" lesson, I understood how it works and now I use UPI daily!',
    relatedLessonId: 'cr_upi_01',
    language: 'en',
    isAnonymous: false,
    isFeatured: true,
    isApproved: true,
    createdAt: '2025-01-20T14:30:00Z'
  },
  {
    id: 'story_init_2',
    userId: 'user2',
    userName: 'Vikram Singh',
    story: 'I almost lost ₹50,000 to an OTP scam. The caller said he was from the bank and asked for OTP. I remembered the lesson about OTP fraud and immediately disconnected. That lesson saved my money!',
    relatedLessonId: 'cr_fraud_01',
    language: 'en',
    isAnonymous: false,
    isFeatured: true,
    isApproved: true,
    createdAt: '2025-01-19T09:15:00Z'
  }
]

initialStories.forEach(story => stories.set(story.id, story))

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { story, relatedLessonId, language, isAnonymous, userId, userName } = body

    // Validate required fields
    if (!story || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: story and userId are required' },
        { status: 400 }
      )
    }

    // Create new story
    const newStory = {
      id: `story_${Date.now()}`,
      userId,
      userName: isAnonymous ? 'Anonymous' : (userName || 'User'),
      story,
      relatedLessonId: relatedLessonId || null,
      language: language || 'en',
      isAnonymous: isAnonymous || false,
      isFeatured: false,
      isApproved: false, // Requires approval
      createdAt: new Date().toISOString()
    }

    // Store story
    stories.set(newStory.id, newStory)

    return NextResponse.json(
      {
        success: true,
        message: 'Success story submitted! It will be featured after review.',
        data: newStory
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting success story:', error)
    return NextResponse.json(
      { error: 'Failed to submit success story' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lessonId = searchParams.get('lessonId')
  const featured = searchParams.get('featured')
  const limit = parseInt(searchParams.get('limit') || '10')

  let filteredStories = Array.from(stories.values())
    .filter(s => s.isApproved)

  // Filter by lesson
  if (lessonId) {
    filteredStories = filteredStories.filter(s => s.relatedLessonId === lessonId)
  }

  // Filter featured
  if (featured === 'true') {
    filteredStories = filteredStories.filter(s => s.isFeatured)
  }

  // Sort by date
  filteredStories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Limit results
  filteredStories = filteredStories.slice(0, limit)

  return NextResponse.json({
    success: true,
    count: filteredStories.length,
    data: filteredStories
  })
}
