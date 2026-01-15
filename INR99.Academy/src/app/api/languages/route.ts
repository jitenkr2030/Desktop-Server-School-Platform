import { NextResponse } from 'next/server'
import { getSupportedLanguages } from '@/lib/simple-db'

export async function GET() {
  try {
    const languages = getSupportedLanguages()

    return NextResponse.json({
      success: true,
      data: languages
    })
  } catch (error) {
    console.error('Error fetching languages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch languages' },
      { status: 500 }
    )
  }
}
