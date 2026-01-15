import { NextResponse } from 'next/server'
import { getFeaturedSuccessStories } from '@/lib/simple-db'

export async function GET() {
  try {
    const stories = getFeaturedSuccessStories()

    return NextResponse.json({
      success: true,
      count: stories.length,
      data: stories
    })
  } catch (error) {
    console.error('Error fetching featured stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured stories' },
      { status: 500 }
    )
  }
}