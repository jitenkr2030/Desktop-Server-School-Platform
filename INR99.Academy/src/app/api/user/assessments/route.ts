import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/user/assessments - Get all assessments for the current user
export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all assessment results for this user
    const userAssessments = await db.userAssessment.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        completedAt: 'desc'
      },
      include: {
        assessment: {
          include: {
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
            },
            questions: {
              select: {
                id: true
              }
            }
          }
        }
      }
    })

    // Transform the results
    const results = userAssessments.map(ua => ({
      id: ua.id,
      score: ua.score,
      completedAt: ua.completedAt,
      assessment: {
        id: ua.assessment.id,
        title: ua.assessment.title,
        type: ua.assessment.type,
        course: ua.assessment.course,
        lesson: ua.assessment.lesson,
        questionCount: ua.assessment.questions.length,
        passingScore: ua.assessment.passingScore
      }
    }))

    // Calculate statistics
    const totalAttempts = userAssessments.length
    const passedAssessments = userAssessments.filter(ua => ua.score >= (ua.assessment.passingScore || 70)).length
    const averageScore = totalAttempts > 0 
      ? userAssessments.reduce((sum, ua) => sum + ua.score, 0) / totalAttempts 
      : 0

    return NextResponse.json({
      success: true,
      assessments: results,
      stats: {
        totalAttempts,
        passedAssessments,
        averageScore: Math.round(averageScore * 10) / 10
      }
    })

  } catch (error) {
    console.error('Get user assessments error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
