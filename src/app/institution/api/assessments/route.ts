import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'

// Get assessments for tenant
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantSlug = searchParams.get('tenantSlug')
    const courseId = searchParams.get('courseId')
    const type = searchParams.get('type')
    const search = searchParams.get('search') || ''

    if (!tenantSlug) {
      return NextResponse.json(
        { error: 'Tenant slug is required' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Get tenant
    const tenant = await db.tenant.findUnique({
      where: { slug: tenantSlug },
    })

    if (!tenant) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      )
    }

    // Build where clause
    const where: any = {
      course: {
        instructor: {
          tenantUsers: {
            some: {
              tenantId: tenant.id,
            },
          },
        },
      },
    }

    if (courseId) {
      where.courseId = courseId
    }

    if (type && type !== 'all') {
      where.type = type
    }

    if (search) {
      where.title = { contains: search, mode: 'insensitive' }
    }

    const assessments = await db.assessment.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        lesson: {
          select: {
            id: true,
            title: true,
          },
        },
        questions: {
          select: {
            id: true,
            type: true,
          },
        },
        userResults: {
          select: {
            id: true,
            score: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calculate stats for each assessment
    const assessmentsWithStats = assessments.map((assessment) => {
      const totalAttempts = assessment.userResults.length
      const avgScore =
        totalAttempts > 0
          ? assessment.userResults.reduce((sum, r) => sum + r.score, 0) / totalAttempts
          : 0
      const passedCount = assessment.userResults.filter((r) => r.score >= 70).length

      return {
        ...assessment,
        questionCount: assessment.questions.length,
        totalAttempts,
        avgScore: Math.round(avgScore * 10) / 10,
        passedCount,
      }
    })

    return NextResponse.json({
      success: true,
      assessments: assessmentsWithStats,
    })
  } catch (error) {
    console.error('Get assessments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    )
  }
}

// Create new assessment
export async function POST(request: NextRequest) {
  try {
    const { courseId, lessonId, title, type, questions, settings } = await request.json()

    if (!courseId || !title || !type) {
      return NextResponse.json(
        { error: 'Course ID, title, and type are required' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Create assessment with questions
    const assessment = await db.assessment.create({
      data: {
        courseId,
        lessonId: lessonId || null,
        title,
        type,
        timeLimit: settings?.timeLimit || null,
        passingScore: settings?.passingScore || 70,
        shuffleQuestions: settings?.shuffleQuestions || false,
        showResults: settings?.showResults || true,
        questions: questions
          ? {
              create: questions.map((q: any, index: number) => ({
                question: q.question,
                type: q.type,
                options: q.options ? JSON.stringify(q.options) : null,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation || null,
                order: index,
                points: q.points || 1,
              })),
            }
          : undefined,
      },
      include: {
        questions: true,
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      assessment,
    })
  } catch (error) {
    console.error('Create assessment error:', error)
    return NextResponse.json(
      { error: 'Failed to create assessment' },
      { status: 500 }
    )
  }
}

// Update assessment
export async function PATCH(request: NextRequest) {
  try {
    const { id, title, type, settings, isActive } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      )
    }

    const db = createClient()

    const assessment = await db.assessment.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(type && { type }),
        ...(isActive !== undefined && { isActive }),
        ...(settings && {
          timeLimit: settings.timeLimit ?? undefined,
          passingScore: settings.passingScore ?? undefined,
          shuffleQuestions: settings.shuffleQuestions ?? undefined,
          showResults: settings.showResults ?? undefined,
        }),
      },
      include: {
        questions: true,
      },
    })

    return NextResponse.json({
      success: true,
      assessment,
    })
  } catch (error) {
    console.error('Update assessment error:', error)
    return NextResponse.json(
      { error: 'Failed to update assessment' },
      { status: 500 }
    )
  }
}

// Delete assessment
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      )
    }

    const db = createClient()

    await db.assessment.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Assessment deleted successfully',
    })
  } catch (error) {
    console.error('Delete assessment error:', error)
    return NextResponse.json(
      { error: 'Failed to delete assessment' },
      { status: 500 }
    )
  }
}
