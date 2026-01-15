import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user || user.id !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { operation, data } = await request.json()

    if (!operation || !data) {
      return NextResponse.json({ error: 'Operation and data are required' }, { status: 400 })
    }

    let result

    switch (operation) {
      case 'create':
        result = await bulkCreateCategories(data)
        break
      case 'update':
        result = await bulkUpdateCategories(data)
        break
      case 'delete':
        result = await bulkDeleteCategories(data)
        break
      case 'reorder':
        result = await bulkReorderCategories(data)
        break
      default:
        return NextResponse.json({ error: 'Invalid operation' }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in bulk operation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function bulkCreateCategories(categories: Array<any>) {
  const createdCategories = []
  const errors = []

  for (const categoryData of categories) {
    try {
      const { name, description, icon, color, sortOrder, isFeatured, metadata } = categoryData
      
      if (!name) {
        errors.push({ error: 'Category name is required', data: categoryData })
        continue
      }

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

      const existingCategory = await db.category.findFirst({
        where: {
          OR: [
            { name },
            { slug }
          ]
        }
      })

      if (existingCategory) {
        errors.push({ error: 'Category with this name or slug already exists', data: categoryData })
        continue
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
        }
      })

      createdCategories.push(category)
    } catch (error) {
      errors.push({ error: error.message, data: categoryData })
    }
  }

  return {
    success: true,
    created: createdCategories.length,
    errors: errors.length,
    createdCategories,
    errors
  }
}

async function bulkUpdateCategories(categories: Array<any>) {
  const updatedCategories = []
  const errors = []

  for (const categoryData of categories) {
    try {
      const { id, name, description, icon, color, sortOrder, isActive, isFeatured, metadata } = categoryData
      
      if (!id || !name) {
        errors.push({ error: 'Category ID and name are required', data: categoryData })
        continue
      }

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

      const existingCategory = await db.category.findFirst({
        where: {
          OR: [
            { name, id: { not: id } },
            { slug, id: { not: id } }
          ]
        }
      })

      if (existingCategory) {
        errors.push({ error: 'Category with this name or slug already exists', data: categoryData })
        continue
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
        }
      })

      updatedCategories.push(category)
    } catch (error) {
      errors.push({ error: error.message, data: categoryData })
    }
  }

  return {
    success: true,
    updated: updatedCategories.length,
    errors: errors.length,
    updatedCategories,
    errors
  }
}

async function bulkDeleteCategories(categoryIds: Array<string>) {
  const deletedCategories = []
  const errors = []

  for (const categoryId of categoryIds) {
    try {
      // Check if category has courses or subcategories
      const categoryWithRelations = await db.category.findUnique({
        where: { id: categoryId },
        include: {
          courses: { select: { id: true } },
          subcategories: { select: { id: true } }
        }
      })

      if (!categoryWithRelations) {
        errors.push({ error: 'Category not found', id: categoryId })
        continue
      }

      if (categoryWithRelations.courses.length > 0 || categoryWithRelations.subcategories.length > 0) {
        errors.push({ 
          error: 'Cannot delete category with existing courses or subcategories', 
          id: categoryId 
        })
        continue
      }

      await db.category.delete({
        where: { id: categoryId }
      })

      deletedCategories.push(categoryId)
    } catch (error) {
      errors.push({ error: error.message, id: categoryId })
    }
  }

  return {
    success: true,
    deleted: deletedCategories.length,
    errors: errors.length,
    deletedCategories,
    errors
  }
}

async function bulkReorderCategories(orderData: Array<{ id: string; sortOrder: number }>) {
  const updatedCategories = []
  const errors = []

  for (const { id, sortOrder } of orderData) {
    try {
      const category = await db.category.update({
        where: { id },
        data: { sortOrder }
      })

      updatedCategories.push(category)
    } catch (error) {
      errors.push({ error: error.message, id })
    }
  }

  return {
    success: true,
    updated: updatedCategories.length,
    errors: errors.length,
    updatedCategories,
    errors
  }
}