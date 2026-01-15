import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Fetch all college degrees with their subjects
    const degrees = await db.collegeDegree.findMany({
      where: {
        isActive: true
      },
      include: {
        subjects: {
          where: {
            isActive: true
          },
          include: {
            _count: {
              select: {
                courses: true
              }
            }
          },
          orderBy: [
            { semester: 'asc' },
            { sortOrder: 'asc' }
          ]
        }
      },
      orderBy: {
        sortOrder: 'asc'
      }
    })

    // Transform the data to match the expected format
    const transformedDegrees = degrees.map(degree => ({
      id: degree.id,
      name: degree.name,
      shortCode: degree.shortCode,
      level: degree.level,
      duration: degree.duration,
      subjects: degree.subjects.map(subject => ({
        id: subject.id,
        name: subject.name,
        code: subject.code,
        semester: subject.semester,
        courseCount: subject._count.courses
      }))
    }))

    return NextResponse.json({
      success: true,
      degrees: transformedDegrees
    })

  } catch (error) {
    console.error('Error fetching college degrees:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch college degrees'
      },
      { status: 500 }
    )
  }
}