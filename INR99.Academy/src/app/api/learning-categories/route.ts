import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Fetch all learning path categories with their learning paths
    const categories = await db.learningPathCategory.findMany({
      where: {
        isActive: true
      },
      include: {
        learningPaths: {
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
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || 'BookOpen',
      color: category.color || 'bg-blue-100',
      learningPaths: category.learningPaths.map(path => ({
        id: path.id,
        title: path.title,
        description: path.description,
        courseCount: path._count.courses
      }))
    }))

    return NextResponse.json({
      success: true,
      categories: transformedCategories
    })

  } catch (error) {
    console.error('Error fetching learning categories:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch learning categories'
      },
      { status: 500 }
    )
  }
}