import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const updateProgressSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
  lessonId: z.string().optional(),
  progress: z.number().min(0).max(100),
  timeSpent: z.number().min(0).optional(),
  completed: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const courseId = searchParams.get('courseId')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      )
    }

    if (courseId) {
      // Get progress for a specific course
      const progress = await db.courseProgress.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
              difficulty: true,
              duration: true,
              instructor: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            }
          },
          lesson: {
            select: {
              id: true,
              title: true,
              duration: true,
              order: true
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        progress
      })
    } else {
      // Get all progress for the user
      const progressList = await db.courseProgress.findMany({
        where: {
          userId
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
              difficulty: true,
              duration: true,
              instructor: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            }
          }
        },
        orderBy: {
          lastAccess: 'desc'
        }
      })

      return NextResponse.json({
        success: true,
        progress: progressList
      })
    }

  } catch (error) {
    console.error('Get progress error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, courseId, lessonId, progress, timeSpent, completed } = updateProgressSchema.parse(body)

    // Check if progress record exists
    let existingProgress = await db.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    })

    let updatedProgress

    if (existingProgress) {
      // Update existing progress
      updatedProgress = await db.courseProgress.update({
        where: {
          id: existingProgress.id
        },
        data: {
          progress: Math.max(existingProgress.progress, progress),
          timeSpent: (existingProgress.timeSpent || 0) + (timeSpent || 0),
          completed: completed || existingProgress.completed,
          lessonId: lessonId || existingProgress.lessonId,
          lastAccess: new Date()
        }
      })
    } else {
      // Create new progress record
      updatedProgress = await db.courseProgress.create({
        data: {
          userId,
          courseId,
          lessonId,
          progress,
          timeSpent: timeSpent || 0,
          completed: completed || false,
          lastAccess: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Progress updated successfully',
      progress: updatedProgress
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid input data' },
        { status: 400 }
      )
    }

    console.error('Update progress error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}