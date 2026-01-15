import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const lessonId = (await params).id
  
  try {
    // Fetch lesson from database
    const lesson = await db.lesson.findFirst({
      where: {
        id: lessonId,
        isActive: true,
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    if (!lesson) {
      return NextResponse.json(
        { success: false, message: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Fetch all lessons for navigation
    const allLessons = await db.lesson.findMany({
      where: {
        courseId: lesson.courseId,
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        title: true,
        duration: true,
        order: true,
      },
    })

    const currentIndex = allLessons.findIndex(l => l.id === lessonId)
    const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

    // Generate assessments
    const assessments = [
      {
        id: `assess-${lessonId}-1`,
        title: 'Lesson Quiz',
        type: 'QUIZ'
      }
    ]

    return NextResponse.json({
      success: true,
      lesson: {
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        audioUrl: lesson.audioUrl,
        pdfUrl: lesson.pdfUrl,
        duration: lesson.duration,
        order: lesson.order,
        course: {
          id: lesson.course.id,
          title: lesson.course.title,
          instructor: lesson.course.instructor ? {
            id: lesson.course.instructor.id,
            name: lesson.course.instructor.name,
            avatar: lesson.course.instructor.avatar
          } : null
        },
        assessments: assessments,
        navigation: {
          previous: previousLesson,
          next: nextLesson,
          currentIndex: currentIndex + 1,
          totalLessons: allLessons.length
        }
      }
    })

  } catch (error) {
    console.error('Get lesson error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
