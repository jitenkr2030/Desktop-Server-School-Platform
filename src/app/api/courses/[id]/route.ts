import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id

    // Fetch course from database with all related data
    const course = await db.course.findFirst({
      where: {
        id: courseId,
        isActive: true,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            bio: true,
            avatar: true,
            expertise: true,
          },
        },
        learningPath: {
          select: {
            id: true,
            title: true,
            description: true,
            color: true,
            icon: true,
          },
        },
        lessons: {
          where: {
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
            videoUrl: true,
            content: true,
          },
        },
        _count: {
          select: {
            lessons: true,
            assessments: true,
            progress: true,
          },
        },
      },
    })

    if (!course) {
      return NextResponse.json(
        { success: false, message: 'Course not found' },
        { status: 404 }
      )
    }

    // Group lessons into modules based on course type and lesson structure
    
    const isEnglishCourse = course.id === 'cr_english_mastery'
    const isConstitutionCourse = course.id === 'cr_indian_constitution'
    
    const englishModuleNames: Record<string, string> = {
      '1': 'Foundation Building',
      '2': 'Grammar Mastery',
      '3': 'Speaking Confidence',
      '4': 'Vocabulary Building',
      '5': 'Professional Writing',
      '6': 'Interview Skills',
      '7': 'Presentation Skills',
      '8': 'Conversation Skills',
      '9': 'Business Communication',
      '10': 'Advanced Communication',
    }

    const constitutionModuleNames: Record<string, string> = {
      '1': 'Introduction to Indian Constitution',
      '2': 'Parts and Schedules',
      '3': 'Fundamental Rights',
      '4': 'Directive Principles & Fundamental Duties',
      '5': 'Union Government',
      '6': 'State Government',
      '7': 'Local Governance',
      '8': 'Elections & Voting',
      '9': 'Citizenship & Identity',
      '10': 'Rights, Duties & Civic Engagement',
    }

    const moduleLessons: Record<string, typeof course.lessons> = {}
    
    for (const lesson of course.lessons) {
      let moduleNum = '1'
      
      if (isEnglishCourse) {
        // English Communication Mastery: use lesson ID pattern cr_ecm_XXX
        if (lesson.id.startsWith('cr_ecm_')) {
          const numericPart = lesson.id.replace('cr_ecm_', '')
          if (numericPart.length >= 4 && numericPart.startsWith('10')) {
            moduleNum = '10'
          } else if (numericPart.length >= 3 && numericPart.length < 4) {
            const firstDigit = numericPart.charAt(0)
            if (firstDigit !== '0') {
              moduleNum = firstDigit
            }
          } else {
            const match = numericPart.match(/^(\d+)/)
            if (match) {
              const num = parseInt(match[1])
              if (num >= 1000) {
                moduleNum = '10'
              } else if (num >= 100) {
                moduleNum = Math.floor(num / 100).toString()
              }
            }
          }
        }
      } else if (isConstitutionCourse) {
        // Indian Constitution course: use lesson order ranges
        // Module 1: orders 1-5, Module 2: orders 6-10, etc.
        if (lesson.order >= 1 && lesson.order <= 5) {
          moduleNum = '1'
        } else if (lesson.order >= 6 && lesson.order <= 10) {
          moduleNum = '2'
        } else if (lesson.order >= 11 && lesson.order <= 16) {
          moduleNum = '3'
        } else if (lesson.order >= 17 && lesson.order <= 22) {
          moduleNum = '4'
        } else if (lesson.order >= 23 && lesson.order <= 28) {
          moduleNum = '5'
        } else if (lesson.order >= 29 && lesson.order <= 34) {
          moduleNum = '6'
        } else if (lesson.order >= 35 && lesson.order <= 39) {
          moduleNum = '7'
        } else if (lesson.order >= 40 && lesson.order <= 44) {
          moduleNum = '8'
        } else if (lesson.order >= 45 && lesson.order <= 50) {
          moduleNum = '9'
        } else if (lesson.order >= 51) {
          moduleNum = '10'
        }
      }
      
      if (!moduleLessons[moduleNum]) {
        moduleLessons[moduleNum] = []
      }
      moduleLessons[moduleNum].push(lesson)
    }
    
    // Build modules array
    const modules = Object.entries(moduleLessons).map(([moduleNum, lessons]) => ({
      id: `module-${moduleNum}`,
      title: `Module ${moduleNum}: ${isEnglishCourse ? englishModuleNames[moduleNum] : constitutionModuleNames[moduleNum] || 'Module ' + moduleNum}`,
      order: parseInt(moduleNum),
      lessons: lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        duration: lesson.duration,
        order: lesson.order,
        type: 'video' as const,
        isFree: false,
        videoUrl: lesson.videoUrl,
        content: lesson.content,
      })).sort((a, b) => a.order - b.order),
    })).sort((a, b) => a.order - b.order)

    // Generate assessments based on lessons
    const assessments = course.lessons.length > 0 ? [
      {
        id: `assess-${courseId}-1`,
        title: 'Chapter Quiz',
        type: 'QUIZ',
        lessonId: course.lessons[0]?.id
      },
      {
        id: `assess-${courseId}-2`,
        title: 'Final Assessment',
        type: 'PRACTICE'
      }
    ] : []

    return NextResponse.json({
      success: true,
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        longDescription: course.description, // Using description as longDescription for now
        thumbnail: course.thumbnail,
        difficulty: course.difficulty,
        duration: course.duration,
        price: 0, // Default to free for now
        originalPrice: 0,
        rating: 4.5, // Default rating
        reviewCount: 100, // Default review count
        tagline: `Master ${course.title} with our comprehensive course`,
        language: 'Hinglish',
        instructor: course.instructor,
        learningPath: course.learningPath,
        modules: modules,
        lessons: course.lessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
          order: lesson.order,
          type: 'video' as const,
          isFree: false,
          videoUrl: lesson.videoUrl,
          content: lesson.content,
        })),
        lessonCount: course._count.lessons,
        moduleCount: modules.length,
        assessments: assessments,
        totalLessons: course._count.lessons,
        totalAssessments: assessments.length,
        enrollmentCount: course._count.progress || 0,
        outcomes: [
          `Understand ${course.title} fundamentals`,
          `Build real-world projects`,
          `Apply concepts in practical scenarios`,
          `Gain confidence in ${course.title}`,
        ],
        requirements: [
          'Basic understanding of the subject',
          'A computer with internet access',
          'Willingness to learn',
        ],
        createdAt: course.createdAt,
        updatedAt: new Date().toISOString(),
      }
    })

  } catch (error) {
    console.error('Get course error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}