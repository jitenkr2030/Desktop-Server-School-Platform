import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/instructor/assessments/[id] - Get a specific assessment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is an instructor
    const currentUser = await db.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (!currentUser || (currentUser.role !== 'INSTRUCTOR' && currentUser.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const assessmentId = params.id

    // Get the assessment with questions
    const assessment = await db.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        questions: {
          orderBy: { order: 'asc' }
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
        },
        _count: {
          select: {
            userResults: true
          }
        }
      }
    })

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    // Verify the assessment belongs to this instructor's course
    if (assessment.course.instructorId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      assessment
    })

  } catch (error) {
    console.error('Get instructor assessment error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/instructor/assessments/[id] - Update an assessment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is an instructor
    const currentUser = await db.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (!currentUser || (currentUser.role !== 'INSTRUCTOR' && currentUser.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const assessmentId = params.id
    const body = await request.json()
    const {
      title,
      description,
      type,
      passingScore,
      timeLimit,
      isActive,
      questions
    } = body

    // Get the existing assessment
    const existingAssessment = await db.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        course: {
          select: { instructorId: true }
        }
      }
    })

    if (!existingAssessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    // Verify the assessment belongs to this instructor
    if (existingAssessment.course.instructorId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Update the assessment
    const updatedAssessment = await db.assessment.update({
      where: { id: assessmentId },
      data: {
        title: title || existingAssessment.title,
        description: description !== undefined ? description : existingAssessment.description,
        type: type || existingAssessment.type,
        passingScore: passingScore !== undefined ? passingScore : existingAssessment.passingScore,
        timeLimit: timeLimit !== undefined ? timeLimit : existingAssessment.timeLimit,
        isActive: isActive !== undefined ? isActive : existingAssessment.isActive
      },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    })

    // If questions are provided, update them
    if (questions && Array.isArray(questions)) {
      // Delete existing questions
      await db.question.deleteMany({
        where: { assessmentId }
      })

      // Create new questions
      await db.question.createMany({
        data: questions.map((q: any, index: number) => ({
          assessmentId,
          question: q.question,
          type: q.type || 'MULTIPLE_CHOICE',
          options: q.options ? JSON.stringify(q.options) : null,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || null,
          order: index + 1,
          points: q.points || 1,
          isActive: true
        }))
      })

      // Refetch to include new questions
      const assessmentWithQuestions = await db.assessment.findUnique({
        where: { id: assessmentId },
        include: {
          questions: {
            orderBy: { order: 'asc' }
          }
        }
      })

      if (assessmentWithQuestions) {
        updatedAssessment.questions = assessmentWithQuestions.questions
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Assessment updated successfully',
      assessment: updatedAssessment
    })

  } catch (error) {
    console.error('Update instructor assessment error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/instructor/assessments/[id] - Delete an assessment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is an instructor
    const currentUser = await db.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (!currentUser || (currentUser.role !== 'INSTRUCTOR' && currentUser.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const assessmentId = params.id

    // Get the existing assessment
    const existingAssessment = await db.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        course: {
          select: { instructorId: true }
        }
      }
    })

    if (!existingAssessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    // Verify the assessment belongs to this instructor
    if (existingAssessment.course.instructorId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Delete the assessment (cascade will delete questions and results)
    await db.assessment.delete({
      where: { id: assessmentId }
    })

    return NextResponse.json({
      success: true,
      message: 'Assessment deleted successfully'
    })

  } catch (error) {
    console.error('Delete instructor assessment error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
