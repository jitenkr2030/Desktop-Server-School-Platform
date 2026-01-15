import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user || user.id !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('categoryId')
    const isActive = searchParams.get('isActive')

    const whereClause: any = {}
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (categoryId) {
      whereClause.categoryId = categoryId
    }
    
    if (isActive !== null) {
      whereClause.isActive = isActive === 'true'
    }

    const subcategories = await db.subCategory.findMany({
      where: whereClause,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        courses: {
          where: { isActive: true },
          select: { id: true }
        },
        subCategoryStats: true
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ],
      skip: offset,
      take: limit
    })

    const total = await db.subCategory.count({
      where: whereClause
    })

    return NextResponse.json({
      subcategories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching subcategories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user || user.id !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description, icon, color, sortOrder, categoryId, metadata } = await request.json()

    if (!name || !categoryId) {
      return NextResponse.json({ error: 'Subcategory name and category ID are required' }, { status: 400 })
    }

    // Verify category exists
    const category = await db.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Check if subcategory with same name or slug already exists in this category
    const existingSubCategory = await db.subCategory.findFirst({
      where: {
        categoryId,
        OR: [
          { name },
          { slug }
        ]
      }
    })

    if (existingSubCategory) {
      return NextResponse.json({ error: 'Subcategory with this name or slug already exists in this category' }, { status: 400 })
    }

    const subcategory = await db.subCategory.create({
      data: {
        name,
        slug,
        description,
        icon,
        color,
        sortOrder: sortOrder || 0,
        categoryId,
        metadata: metadata ? JSON.stringify(metadata) : null
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        courses: {
          where: { isActive: true },
          select: { id: true }
        },
        subCategoryStats: true
      }
    })

    return NextResponse.json(subcategory)
  } catch (error) {
    console.error('Error creating subcategory:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user || user.id !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, name, description, icon, color, sortOrder, isActive, categoryId, metadata } = await request.json()

    if (!id || !name || !categoryId) {
      return NextResponse.json({ error: 'Subcategory ID, name, and category ID are required' }, { status: 400 })
    }

    // Verify category exists
    const category = await db.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Check if subcategory with same name or slug already exists in this category (excluding current subcategory)
    const existingSubCategory = await db.subCategory.findFirst({
      where: {
        categoryId,
        OR: [
          { name, id: { not: id } },
          { slug, id: { not: id } }
        ]
      }
    })

    if (existingSubCategory) {
      return NextResponse.json({ error: 'Subcategory with this name or slug already exists in this category' }, { status: 400 })
    }

    const subcategory = await db.subCategory.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        icon,
        color,
        sortOrder: sortOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
        categoryId,
        metadata: metadata ? JSON.stringify(metadata) : null
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        courses: {
          where: { isActive: true },
          select: { id: true }
        },
        subCategoryStats: true
      }
    })

    return NextResponse.json(subcategory)
  } catch (error) {
    console.error('Error updating subcategory:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user || user.id !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const subCategoryId = searchParams.get('id')

    if (!subCategoryId) {
      return NextResponse.json({ error: 'Subcategory ID is required' }, { status: 400 })
    }

    // Check if subcategory has courses
    const subcategoryWithCourses = await db.subCategory.findUnique({
      where: { id: subCategoryId },
      include: {
        courses: { select: { id: true } }
      }
    })

    if (!subcategoryWithCourses) {
      return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 })
    }

    if (subcategoryWithCourses.courses.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete subcategory with existing courses' 
      }, { status: 400 })
    }

    await db.subCategory.delete({
      where: { id: subCategoryId }
    })

    return NextResponse.json({ message: 'Subcategory deleted successfully' })
  } catch (error) {
    console.error('Error deleting subcategory:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}