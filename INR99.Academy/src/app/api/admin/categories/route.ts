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
    const isActive = searchParams.get('isActive')

    const whereClause: any = {}
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (isActive !== null) {
      whereClause.isActive = isActive === 'true'
    }

    const categories = await db.category.findMany({
      where: whereClause,
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        },
        courses: {
          where: { isActive: true },
          select: { id: true }
        },
        categoryStats: true
      },
      orderBy: [
        { isFeatured: 'desc' },
        { sortOrder: 'asc' },
        { name: 'asc' }
      ],
      skip: offset,
      take: limit
    })

    const total = await db.category.count({
      where: whereClause
    })

    return NextResponse.json({
      categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user || user.id !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description, icon, color, sortOrder, isFeatured, metadata } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Check if category with same name or slug already exists
    const existingCategory = await db.category.findFirst({
      where: {
        OR: [
          { name },
          { slug }
        ]
      }
    })

    if (existingCategory) {
      return NextResponse.json({ error: 'Category with this name or slug already exists' }, { status: 400 })
    }

    const category = await db.category.create({
      data: {
        name,
        slug,
        description,
        icon,
        color,
        sortOrder: sortOrder || 0,
        isFeatured: isFeatured || false,
        metadata: metadata ? JSON.stringify(metadata) : null
      },
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        },
        courses: {
          where: { isActive: true },
          select: { id: true }
        },
        categoryStats: true
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user || user.id !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, name, description, icon, color, sortOrder, isActive, isFeatured, metadata } = await request.json()

    if (!id || !name) {
      return NextResponse.json({ error: 'Category ID and name are required' }, { status: 400 })
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Check if category with same name or slug already exists (excluding current category)
    const existingCategory = await db.category.findFirst({
      where: {
        OR: [
          { name, id: { not: id } },
          { slug, id: { not: id } }
        ]
      }
    })

    if (existingCategory) {
      return NextResponse.json({ error: 'Category with this name or slug already exists' }, { status: 400 })
    }

    const category = await db.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        icon,
        color,
        sortOrder: sortOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured !== undefined ? isFeatured : false,
        metadata: metadata ? JSON.stringify(metadata) : null
      },
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        },
        courses: {
          where: { isActive: true },
          select: { id: true }
        },
        categoryStats: true
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
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
    const categoryId = searchParams.get('id')

    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    // Check if category has courses or subcategories
    const categoryWithRelations = await db.category.findUnique({
      where: { id: categoryId },
      include: {
        courses: { select: { id: true } },
        subcategories: { select: { id: true } }
      }
    })

    if (!categoryWithRelations) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    if (categoryWithRelations.courses.length > 0 || categoryWithRelations.subcategories.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete category with existing courses or subcategories' 
      }, { status: 400 })
    }

    await db.category.delete({
      where: { id: categoryId }
    })

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}