import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/categories - Fetch all categories with their subcategories and course counts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'
    const includeSubcategories = searchParams.get('includeSubcategories') !== 'false'

    // Fetch categories from database
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        ...(featured && { isFeatured: true }),
      },
      orderBy: {
        sortOrder: 'asc',
      },
      include: {
        subcategories: includeSubcategories
          ? {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
            }
          : false,
        categoryStats: true,
        _count: {
          select: { courses: { where: { isActive: true } } },
        },
      },
    })

    // Format the response to match the expected frontend structure
    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      color: category.color || getColorForCategory(category.slug),
      isFeatured: category.isFeatured,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      subcategories: includeSubcategories
        ? category.subcategories.map((sub) => ({
            id: sub.id,
            name: sub.name,
            slug: sub.slug,
            description: sub.description,
            icon: sub.icon,
            color: sub.color || getColorForSubCategory(sub.slug),
          }))
        : [],
      courseCount: category._count.courses,
      ...(category.categoryStats && {
        stats: {
          studentCount: category.categoryStats.studentCount,
          avgRating: category.categoryStats.avgRating,
          totalDuration: category.categoryStats.totalDuration,
        },
      }),
    }))

    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch categories',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Helper function to get color based on category slug
function getColorForCategory(slug: string): string {
  const colors: Record<string, string> = {
    'school-learning': 'bg-blue-100',
    'college-foundation': 'bg-green-100',
    'career-skills': 'bg-purple-100',
    'money-business': 'bg-orange-100',
    'competitive-exams': 'bg-red-100',
    'professional-courses': 'bg-indigo-100',
    'life-skills': 'bg-pink-100',
  }
  return colors[slug] || 'bg-gray-100'
}

// Helper function to get color based on subcategory slug
function getColorForSubCategory(slug: string): string {
  const colors: Record<string, string> = {
    primary: 'bg-blue-200',
    middle: 'bg-blue-300',
    secondary: 'bg-blue-400',
    senior: 'bg-blue-500',
    commerce: 'bg-green-200',
    cs: 'bg-green-300',
    science: 'bg-green-400',
    engineering: 'bg-green-500',
    professional: 'bg-purple-200',
    technical: 'bg-purple-300',
    soft: 'bg-purple-400',
    digital: 'bg-purple-500',
    financial: 'bg-orange-200',
    business: 'bg-orange-300',
    investment: 'bg-orange-400',
    ecommerce: 'bg-orange-500',
    upsc: 'bg-red-200',
    ssc: 'bg-red-300',
    banking: 'bg-red-400',
    railway: 'bg-red-500',
    defense: 'bg-indigo-200',
    'state-government': 'bg-indigo-300',
  }
  return colors[slug] || 'bg-gray-200'
}
