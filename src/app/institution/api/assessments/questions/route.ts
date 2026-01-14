import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'

// Get single assessment with questions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (!id) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      )
    }

    const db = createClient()

    const assessment = await db.assessment.findUnique({
      where: { id },
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
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
    }

    // Get user's previous attempt if userId provided
    let previousAttempt = null
    if (userId) {
      previousAttempt = await db.userAssessment.findFirst({
        where: {
          userId,
          assessmentId: id,
        },
        orderBy: { completedAt: 'desc' },
      })
    }

    // Get total attempts count
    const attemptsCount = await db.userAssessment.count({
      where: {
        assessmentId: id,
      },
    })

    return NextResponse.json({
      success: true,
      assessment: {
        ...assessment,
        questions: assessment.questions.map((q) => ({
          ...q,
          options: q.options ? JSON.parse(q.options) : null,
          // Don't send correct answer for student view
          correctAnswer: undefined,
        })),
      },
      previousAttempt,
      attemptsCount,
    })
  } catch (error) {
    console.error('Get assessment error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessment' },
      { status: 500 }
    )
  }
}

// Add questions to assessment
export async function POST(request: NextRequest) {
  try {
    const { assessmentId, questions } = await request.json()

    if (!assessmentId || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Assessment ID and questions array are required' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Get current max order
    const lastQuestion = await db.assessmentQuestion.findFirst({
      where: { assessmentId },
      orderBy: { order: 'desc' },
    })

    const startOrder = lastQuestion ? lastQuestion.order + 1 : 0

    // Add questions
    const createdQuestions = await Promise.all(
      questions.map((q: any, index: number) =>
        db.assessmentQuestion.create({
          data: {
            assessmentId,
            question: q.question,
            type: q.type,
            options: q.options ? JSON.stringify(q.options) : null,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || null,
            order: startOrder + index,
            points: q.points || 1,
          },
        })
      )
    )

    return NextResponse.json({
      success: true,
      questions: createdQuestions,
    })
  } catch (error) {
    console.error('Add questions error:', error)
    return NextResponse.json(
      { error: 'Failed to add questions' },
      { status: 500 }
    )
  }
}

// Update/delete questions
export async function PATCH(request: NextRequest) {
  try {
    const { questionId, data, action } = await request.json()

    const db = createClient()

    if (action === 'delete' && questionId) {
      await db.assessmentQuestion.delete({
        where: { id: questionId },
      })
      return NextResponse.json({
        success: true,
        message: 'Question deleted successfully',
      })
    }

    if (questionId && data) {
      const question = await db.assessmentQuestion.update({
        where: { id: questionId },
        data: {
          ...(data.question && { question: data.question }),
          ...(data.type && { type: data.type }),
          ...(data.options && { options: JSON.stringify(data.options) }),
          ...(data.correctAnswer !== undefined && { correctAnswer: data.correctAnswer }),
          ...(data.explanation !== undefined && { explanation: data.explanation }),
          ...(data.order !== undefined && { order: data.order }),
          ...(data.points !== undefined && { points: data.points }),
        },
      })
      return NextResponse.json({
        success: true,
        question,
      })
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Update question error:', error)
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    )
  }
}
