import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'

// Submit assessment attempt
export async function POST(request: NextRequest) {
  try {
    const { userId, assessmentId, answers, timeSpent } = await request.json()

    if (!userId || !assessmentId || !answers) {
      return NextResponse.json(
        { error: 'User ID, assessment ID, and answers are required' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Get assessment with questions
    const assessment = await db.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        questions: true,
      },
    })

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
    }

    if (!assessment.isActive) {
      return NextResponse.json(
        { error: 'This assessment is not currently available' },
        { status: 403 }
      )
    }

    // Calculate score
    let totalPoints = 0
    let earnedPoints = 0
    const results: Array<{
      questionId: string
      correct: boolean
      points: number
      userAnswer: string
      correctAnswer: string
    }> = []

    for (const question of assessment.questions) {
      const userAnswer = answers[question.id]
      const questionPoints = question.points || 1
      totalPoints += questionPoints

      let isCorrect = false

      switch (question.type) {
        case 'MULTIPLE_CHOICE':
        case 'TRUE_FALSE':
          isCorrect = userAnswer?.toLowerCase() === question.correctAnswer.toLowerCase()
          break
        case 'SHORT_ANSWER':
          // For short answers, we'll mark for manual review
          isCorrect = false
          break
      }

      if (isCorrect) {
        earnedPoints += questionPoints
      }

      results.push({
        questionId: question.id,
        correct: isCorrect,
        points: isCorrect ? questionPoints : 0,
        userAnswer: userAnswer || '',
        correctAnswer: question.correctAnswer,
      })
    }

    // Calculate percentage
    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0
    const passed = score >= (assessment.passingScore || 70)

    // Check if already passed (allow retakes)
    const existingAttempt = await db.userAssessment.findUnique({
      where: {
        userId_assessmentId: {
          userId,
          assessmentId,
        },
      },
    })

    // Save attempt
    const attempt = await db.userAssessment.upsert({
      where: {
        userId_assessmentId: {
          userId,
          assessmentId,
        },
      },
      update: {
        score,
        answers: JSON.stringify(answers),
        completedAt: new Date(),
        timeSpent: timeSpent || null,
        attempts: existingAttempt ? { increment: 1 } : undefined,
      },
      create: {
        userId,
        assessmentId,
        score,
        answers: JSON.stringify(answers),
        completedAt: new Date(),
        timeSpent: timeSpent || null,
        attempts: 1,
      },
    })

    return NextResponse.json({
      success: true,
      result: {
        attemptId: attempt.id,
        score: Math.round(score * 10) / 10,
        passed,
        totalPoints,
        earnedPoints,
        totalQuestions: assessment.questions.length,
        correctAnswers: results.filter((r) => r.correct).length,
        showResults: assessment.showResults,
        results: assessment.showResults ? results : undefined,
      },
    })
  } catch (error) {
    console.error('Submit assessment error:', error)
    return NextResponse.json(
      { error: 'Failed to submit assessment' },
      { status: 500 }
    )
  }
}

// Get user's assessment history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const courseId = searchParams.get('courseId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const db = createClient()

    const where: any = { userId }
    if (courseId) {
      where.assessment = { courseId }
    }

    const attempts = await db.userAssessment.findMany({
      where,
      include: {
        assessment: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      attempts,
    })
  } catch (error) {
    console.error('Get assessment history error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessment history' },
      { status: 500 }
    )
  }
}
