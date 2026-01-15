import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Fetch all school classes with their subjects
    const classes = await db.schoolClass.findMany({
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
          orderBy: {
            sortOrder: 'asc'
          }
        }
      },
      orderBy: {
        sortOrder: 'asc'
      }
    })

    // Transform the data to match the expected format
    const transformedClasses = classes.map(cls => ({
      id: cls.id,
      name: cls.name,
      level: cls.level,
      subjects: cls.subjects.map(subject => ({
        id: subject.id,
        name: subject.name,
        courseCount: subject._count.courses
      }))
    }))

    return NextResponse.json({
      success: true,
      classes: transformedClasses
    })

  } catch (error) {
    console.error('Error fetching school classes:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch school classes'
      },
      { status: 500 }
    )
  }
}