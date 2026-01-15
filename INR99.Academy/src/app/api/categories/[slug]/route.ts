import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const category = await db.category.findUnique({
      where: { slug: params.slug },
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            courses: {
              where: { isActive: true },
              select: {
                id: true,
                title: true,
                difficulty: true,
                duration: true,
                thumbnail: true
              }
            },
            subCategoryStats: true
          }
        },
        courses: {
          where: { isActive: true },
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            },
            progress: {
              select: {
                id: true
              }
            },
            _count: {
              select: {
                lessons: true,
                assessments: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        categoryStats: true
      }
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}