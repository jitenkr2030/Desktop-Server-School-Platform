import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assessmentId = params.id

    // Get the authenticated user
    const user = await getAuthenticatedUser()
    const userId = user.id

    // Get assessment with questions
    const assessment = await db.assessment.findUnique({
      where: {
        id: assessmentId,
        isActive: true
      },
      include: {
        questions: {
          orderBy: {
            order: 'asc'
          }
        },
        course: {
          select: {
            id: true,
            title: true
          }
        },
        lesson: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    if (!assessment) {
      return NextResponse.json(
        { success: false, message: 'Assessment not found' },
        { status: 404 }
      )
    }

    // Check if user has already completed this assessment
    const existingResult = await db.userAssessment.findUnique({
      where: {
        userId_assessmentId: {
          userId,
          assessmentId
        }
      }
    })

    return NextResponse.json({
      success: true,
      assessment: {
        id: assessment.id,
        title: assessment.title,
        type: assessment.type,
        course: assessment.course,
        lesson: assessment.lesson,
        questions: assessment.questions.map(q => ({
          id: q.id,
          question: q.question,
          type: q.type,
          options: q.options ? JSON.parse(q.options) : [],
          explanation: q.explanation
        })),
        alreadyCompleted: !!existingResult,
        previousScore: existingResult?.score || null
      }
    })

  } catch (error) {
    console.error('Get assessment error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assessmentId = params.id
    const body = await request.json()
    const { answers } = body

    // Get the authenticated user
    const user = await getAuthenticatedUser()
    const userId = user.id

    if (!answers) {
      return NextResponse.json(
        { success: false, message: 'Answers are required' },
        { status: 400 }
      )
    }

    // Get assessment with questions to calculate score
    const assessment = await db.assessment.findUnique({
      where: {
        id: assessmentId,
        isActive: true
      },
      include: {
        questions: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!assessment) {
      return NextResponse.json(
        { success: false, message: 'Assessment not found' },
        { status: 404 }
      )
    }

    // Calculate score
    let correctAnswers = 0
    const totalQuestions = assessment.questions.length

    assessment.questions.forEach((question, index) => {
      const userAnswer = answers[index]
      if (userAnswer === question.correctAnswer) {
        correctAnswers++
      }
    })

    const score = (correctAnswers / totalQuestions) * 100

    // Check if user already has a result for this assessment
    const existingResult = await db.userAssessment.findUnique({
      where: {
        userId_assessmentId: {
          userId,
          assessmentId
        }
      }
    })

    let userAssessment

    if (existingResult) {
      // Update existing result
      userAssessment = await db.userAssessment.update({
        where: {
          id: existingResult.id
        },
        data: {
          score,
          answers: JSON.stringify(answers),
          completedAt: new Date()
        }
      })
    } else {
      // Create new result
      userAssessment = await db.userAssessment.create({
        data: {
          userId,
          assessmentId,
          score,
          answers: JSON.stringify(answers),
          completedAt: new Date()
        }
      })
    }

    // Determine if user passed (70% or higher)
    const passed = score >= 70

    // If passed, check if user should earn a badge
    if (passed && score >= 90) {
      // Check if user already has the "High Scorer" badge
      const existingBadge = await db.userBadge.findFirst({
        where: {
          userId,
          badge: {
            name: 'High Scorer'
          }
        }
      })

      if (!existingBadge) {
        // Find or create the badge
        let badge = await db.skillBadge.findFirst({
          where: {
            name: 'High Scorer'
          }
        })

        if (!badge) {
          badge = await db.skillBadge.create({
            data: {
              name: 'High Scorer',
              description: 'Scored 90% or higher on an assessment',
              icon: '🏆',
              color: 'bg-yellow-100'
            }
          })
        }

        // Award the badge to user
        await db.userBadge.create({
          data: {
            userId,
            badgeId: badge.id
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Assessment submitted successfully',
      result: {
        id: userAssessment.id,
        score,
        correctAnswers,
        totalQuestions,
        passed,
        assessment: {
          id: assessment.id,
          title: assessment.title,
          type: assessment.type
        }
      }
    })

  } catch (error) {
    console.error('Submit assessment error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
