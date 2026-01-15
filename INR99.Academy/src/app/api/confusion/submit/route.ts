import { NextRequest, NextResponse } from 'next/server'

// Mock submission storage (in production, use database)
const submissions: Map<string, any> = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, description, userId, userName, category } = body

    // Validate required fields
    if (!topic || !description || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, description, and userId are required' },
        { status: 400 }
      )
    }

    // Create new submission
    const submission = {
      id: `sub_${Date.now()}`,
      userId,
      userName: userName || 'Anonymous',
      topic,
      description,
      category: category || 'General',
      status: 'pending',
      priority: 'medium',
      upvotes: 0,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Store submission
    submissions.set(submission.id, submission)

    return NextResponse.json(
      {
        success: true,
        message: 'Confusion submitted successfully. Our experts will review it!',
        data: submission
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting confusion:', error)
    return NextResponse.json(
      { error: 'Failed to submit confusion' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Return pending submissions for admin view
  const pendingSubmissions = Array.from(submissions.values())
    .filter(s => s.status === 'pending')
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

  return NextResponse.json({
    success: true,
    count: pendingSubmissions.length,
    data: pendingSubmissions
  })
}
