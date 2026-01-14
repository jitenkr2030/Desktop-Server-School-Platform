import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      tenantId,
      title,
      description,
      categoryId,
      difficulty,
      courseType,
      classId,
      schoolSubjectId,
      collegeSubjectId,
      degreeId,
      semester,
      chapters,
    } = body

    if (!tenantId || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Verify tenant exists and is active
    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
    })

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }

    if (tenant.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Tenant subscription is not active' },
        { status: 403 }
      )
    }

    // Create the course
    const course = await db.course.create({
      data: {
        title,
        description,
        courseType: courseType || 'GENERAL',
        difficulty: difficulty || 'BEGINNER',
        isActive: true,
        isPublished: false, // Starts as draft
        instructorId: 'system', // Would use actual instructor ID in production
        categoryId,
        classId,
        schoolSubjectId,
        collegeSubjectId,
        degreeId,
        semester,
        // Custom tenant course - in production would have tenant_id field
        // For now, we use metadata or a separate table for tenant courses
      },
    })

    // If chapters are provided, create modules and lessons
    if (chapters && Array.isArray(chapters)) {
      for (const chapter of chapters) {
        const module = await db.module.create({
          data: {
            title: chapter.title,
            description: chapter.description || '',
            order: chapter.order || 0,
            courseId: course.id,
          },
        })

        if (chapter.lessons && Array.isArray(chapter.lessons)) {
          for (const lesson of chapter.lessons) {
            await db.lesson.create({
              data: {
                title: lesson.title,
                content: lesson.content || '',
                type: lesson.type || 'VIDEO',
                videoUrl: lesson.videoUrl,
                duration: lesson.duration || 0,
                order: lesson.order || 0,
                isActive: true,
                isPublished: false,
                courseId: course.id,
                moduleId: module.id,
              },
            })
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      course: {
        id: course.id,
        title: course.title,
        status: 'draft',
      },
    })
  } catch (error) {
    console.error('Create course error:', error)
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId')
    const status = searchParams.get('status') // draft, published, all

    const db = createClient()

    // Build filter
    const where: any = {
      // In production, filter by tenant_id
    }

    if (status && status !== 'all') {
      where.isPublished = status === 'published'
    }

    const courses = await db.course.findMany({
      where,
      include: {
        category: true,
        class: true,
        _count: {
          select: {
            modules: true,
            lessons: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      courses,
    })
  } catch (error) {
    console.error('Get courses error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
