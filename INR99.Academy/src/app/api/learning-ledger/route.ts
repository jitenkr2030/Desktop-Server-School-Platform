import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user's course progress with course details
    const courseProgress = await db.courseProgress.findMany({
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
            learningPath: {
              select: {
                id: true,
                title: true,
                color: true
              }
            }
          }
        }
      },
      orderBy: {
        lastAccess: 'desc'
      }
    })

    // Get user's assessment results
    const assessmentResults = await db.userAssessment.findMany({
      where: {
        userId
      },
      include: {
        assessment: {
          include: {
            course: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    })

    // Get user's badges
    const userBadges = await db.userBadge.findMany({
      where: {
        userId
      },
      include: {
        badge: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true,
            color: true
          }
        }
      },
      orderBy: {
        earnedAt: 'desc'
      }
    })

    // Calculate learning statistics
    const totalCoursesEnrolled = courseProgress.length
    const completedCourses = courseProgress.filter(p => p.completed).length
    const totalTimeSpent = courseProgress.reduce((sum, p) => sum + p.timeSpent, 0)
    const averageScore = assessmentResults.length > 0 
      ? assessmentResults.reduce((sum, r) => sum + r.score, 0) / assessmentResults.length 
      : 0
    const totalBadges = userBadges.length

    // Create timeline events
    const timelineEvents = []

    // Add course progress events
    courseProgress.forEach(progress => {
      if (progress.completed) {
        timelineEvents.push({
          id: `course-${progress.id}`,
          type: 'course_completed',
          title: `Completed: ${progress.course.title}`,
          description: `Finished ${progress.course.difficulty.toLowerCase()} level course`,
          timestamp: progress.lastAccess,
          data: {
            courseId: progress.courseId,
            courseTitle: progress.course.title,
            timeSpent: progress.timeSpent,
            difficulty: progress.course.difficulty,
            learningPath: progress.course.learningPath
          }
        })
      } else if (progress.progress > 0) {
        timelineEvents.push({
          id: `progress-${progress.id}`,
          type: 'course_progress',
          title: `Progress: ${progress.course.title}`,
          description: `${Math.round(progress.progress)}% complete`,
          timestamp: progress.lastAccess,
          data: {
            courseId: progress.courseId,
            courseTitle: progress.course.title,
            progress: progress.progress,
            timeSpent: progress.timeSpent
          }
        })
      }
    })

    // Add assessment events
    assessmentResults.forEach(result => {
      timelineEvents.push({
        id: `assessment-${result.id}`,
        type: 'assessment_completed',
        title: `Assessment: ${result.assessment.title}`,
        description: `Scored ${Math.round(result.score)}%`,
        timestamp: result.completedAt,
        data: {
          assessmentId: result.assessmentId,
          assessmentTitle: result.assessment.title,
          score: result.score,
          courseTitle: result.assessment.course.title
        }
      })
    })

    // Add badge events
    userBadges.forEach(badge => {
      timelineEvents.push({
        id: `badge-${badge.id}`,
        type: 'badge_earned',
        title: `Badge Earned: ${badge.badge.name}`,
        description: badge.badge.description,
        timestamp: badge.earnedAt,
        data: {
          badgeId: badge.badgeId,
          badgeName: badge.badge.name,
          badgeDescription: badge.badge.description,
          badgeIcon: badge.badge.icon,
          badgeColor: badge.badge.color
        }
      })
    })

    // Sort timeline events by timestamp
    timelineEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({
      success: true,
      learningLedger: {
        stats: {
          totalCoursesEnrolled,
          completedCourses,
          totalTimeSpent,
          averageScore: Math.round(averageScore),
          totalBadges
        },
        recentActivity: courseProgress.slice(0, 5),
        badges: userBadges,
        timeline: timelineEvents.slice(0, 20) // Last 20 events
      }
    })

  } catch (error) {
    console.error('Get learning ledger error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}