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
            // title field removed - not available in current Prisma client
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
    const isPublicSpeakingIntermediate = course.id === 'career14'
    const isPublicSpeakingAdvanced = course.id === 'course_public_speaking'
    const isWebDevBootcamp = course.id === 'career1'
    
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

    const publicSpeakingAdvancedModuleNames: Record<string, string> = {
      '1': 'The Psychology of Performance',
      '2': 'Advanced Presentation Structure',
      '3': 'Visual Rhetoric and Slide Design',
      '4': 'Vocal Mastery and Delivery',
      '5': 'Body Language and Presence',
      '6': 'Audience Engagement and Dynamics',
      '7': 'The Art of Persuasion',
      '8': 'Handling the Unexpected',
      '9': 'Virtual and Hybrid Presentations',
      '10': 'Professional Application and Capstone',
    }

    const publicSpeakingIntermediateModuleNames: Record<string, string> = {
      '1': 'Foundation of Public Speaking',
      '2': 'Structuring Your Message',
      '3': 'Voice and Delivery',
      '4': 'Body Language',
      '5': 'Audience Connection',
      '6': 'Practical Application',
    }

    const webDevBootcampModuleNames: Record<string, string> = {
      '1': 'Web Development Introduction',
      '2': 'HTML Fundamentals',
      '3': 'CSS Styling',
      '4': 'JavaScript Basics',
      '5': 'JavaScript Advanced',
      '6': 'Version Control with Git',
      '7': 'UI/UX Design Principles',
      '8': 'React.js Fundamentals',
      '9': 'Backend Development',
      '10': 'Database Management',
      '11': 'Authentication & Security',
      '12': 'API Development',
      '13': 'Testing & Best Practices',
      '14': 'Performance Optimization',
      '15': 'Deployment & DevOps',
      '16': 'Capstone Project',
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
      } else if (isPublicSpeakingIntermediate) {
        // Public Speaking INTERMEDIATE course: use order ranges (101-105, 201-205, etc.)
        // Only 6 modules: Module 1: orders 101-105, Module 2: orders 201-205, etc.
        if (lesson.order >= 101 && lesson.order <= 105) {
          moduleNum = '1'
        } else if (lesson.order >= 201 && lesson.order <= 205) {
          moduleNum = '2'
        } else if (lesson.order >= 301 && lesson.order <= 305) {
          moduleNum = '3'
        } else if (lesson.order >= 401 && lesson.order <= 405) {
          moduleNum = '4'
        } else if (lesson.order >= 501 && lesson.order <= 505) {
          moduleNum = '5'
        } else if (lesson.order >= 601 && lesson.order <= 605) {
          moduleNum = '6'
        }
      } else if (isPublicSpeakingAdvanced) {
        // Public Speaking ADVANCED course: use order ranges (101-105, 201-205, etc.)
        // 10 modules: Module 1: orders 101-105, Module 2: orders 201-205, etc.
        if (lesson.order >= 101 && lesson.order <= 105) {
          moduleNum = '1'
        } else if (lesson.order >= 201 && lesson.order <= 205) {
          moduleNum = '2'
        } else if (lesson.order >= 301 && lesson.order <= 305) {
          moduleNum = '3'
        } else if (lesson.order >= 401 && lesson.order <= 405) {
          moduleNum = '4'
        } else if (lesson.order >= 501 && lesson.order <= 505) {
          moduleNum = '5'
        } else if (lesson.order >= 601 && lesson.order <= 605) {
          moduleNum = '6'
        } else if (lesson.order >= 701 && lesson.order <= 705) {
          moduleNum = '7'
        } else if (lesson.order >= 801 && lesson.order <= 805) {
          moduleNum = '8'
        } else if (lesson.order >= 901 && lesson.order <= 905) {
          moduleNum = '9'
        } else if (lesson.order >= 1001 && lesson.order <= 1005) {
          moduleNum = '10'
        }
      } else if (isWebDevBootcamp) {
        // Web Development Bootcamp: use order ranges based on hundreds
        // Module 1: orders 1-99 (Intro)
        // Module 2: orders 100-199 (HTML)
        // Module 3: orders 200-299 (CSS)
        // Module 4: orders 300-399 (JavaScript)
        // Module 5: orders 400-499 (JavaScript Advanced)
        // Module 6: orders 500-599 (Git)
        // Module 7: orders 600-699 (UI/UX)
        // Module 8: orders 700-799 (React)
        // Module 9: orders 800-899 (Backend)
        // Module 10: orders 900-999 (Database)
        // Module 11: orders 1000-1099 (Authentication)
        // Module 12: orders 1100-1199 (API Development)
        // Module 13: orders 1200-1299 (Testing)
        // Module 14: orders 1300-1399 (Performance)
        // Module 15: orders 1400-1499 (Deployment)
        // Module 16: orders 1500-1599 (Capstone)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        } else if (lesson.order >= 700 && lesson.order <= 799) {
          moduleNum = '8'
        } else if (lesson.order >= 800 && lesson.order <= 899) {
          moduleNum = '9'
        } else if (lesson.order >= 900 && lesson.order <= 999) {
          moduleNum = '10'
        } else if (lesson.order >= 1000 && lesson.order <= 1099) {
          moduleNum = '11'
        } else if (lesson.order >= 1100 && lesson.order <= 1199) {
          moduleNum = '12'
        } else if (lesson.order >= 1200 && lesson.order <= 1299) {
          moduleNum = '13'
        } else if (lesson.order >= 1300 && lesson.order <= 1399) {
          moduleNum = '14'
        } else if (lesson.order >= 1400 && lesson.order <= 1499) {
          moduleNum = '15'
        } else if (lesson.order >= 1500 && lesson.order <= 1599) {
          moduleNum = '16'
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
      title: `Module ${moduleNum}: ${
        isEnglishCourse ? englishModuleNames[moduleNum] : 
        isConstitutionCourse ? constitutionModuleNames[moduleNum] : 
        isPublicSpeakingIntermediate ? publicSpeakingIntermediateModuleNames[moduleNum] :
        isPublicSpeakingAdvanced ? publicSpeakingAdvancedModuleNames[moduleNum] :
        isWebDevBootcamp ? webDevBootcampModuleNames[moduleNum] :
        'Module ' + moduleNum
      }`,
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
        pricing: {
          type: 'subscription',
          price: 99,
          currency: 'INR',
          period: 'month',
          description: 'Subscribe at INR 99/month to access all courses',
        },
        rating: 4.5, // Default rating
        reviewCount: 100, // Default review count
        tagline: `Master ${course.title} with our comprehensive course`,
        language: 'Hindi',
        instructor: course.instructor,
        learningPath: course.learningPath,
        modules: modules,
        lessons: course.lessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
          order: lesson.order,
          type: 'video' as const,
          isLocked: true, // All lessons require subscription
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