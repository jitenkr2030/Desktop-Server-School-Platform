import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parentId')
    const studentId = searchParams.get('studentId')

    if (!parentId) {
      return NextResponse.json(
        { error: 'Parent ID is required' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Get parent with verified links
    const parent = await db.parentUser.findUnique({
      where: { id: parentId },
      include: {
        links: {
          where: { status: 'VERIFIED' },
          include: {
            student: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
                class: true,
              },
            },
          },
        },
      },
    })

    if (!parent) {
      return NextResponse.json(
        { error: 'Parent account not found' },
        { status: 404 }
      )
    }

    if (parent.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Parent account is not active' },
        { status: 403 }
      )
    }

    // Get progress for all linked students or specific student
    const whereClause = studentId
      ? {
          userId: {
            in: parent.links
              .filter((l) => l.student.user.id === studentId)
              .map((l) => l.student.user.id),
          },
        }
      : {
          userId: {
            in: parent.links.map((l) => l.student.user.id),
          },
        }

    const [progress, assessments, attendances] = await Promise.all([
      // Course progress
      db.courseProgress.findMany({
        where: whereClause,
        include: {
          course: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
            },
          },
          lesson: {
            select: {
              title: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 50,
      }),
      // Assessment results
      db.userAssessment.findMany({
        where: whereClause,
        include: {
          assessment: {
            include: {
              course: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
        orderBy: { completedAt: 'desc' },
        take: 50,
      }),
      // Attendance records
      db.attendance.findMany({
        where: {
          userId: {
            in: parent.links.map((l) => l.student.user.id),
          },
        },
        include: {
          session: {
            select: {
              title: true,
              scheduledAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
    ])

    // Group data by student
    const studentsData = parent.links.map((link) => {
      const studentId = link.student.user.id
      const studentProgress = progress.filter((p) => p.userId === studentId)
      const studentAssessments = assessments.filter((a) => a.userId === studentId)
      const studentAttendance = attendances.filter((a) => a.userId === studentId)

      // Calculate stats
      const totalCourses = studentProgress.length
      const completedCourses = studentProgress.filter((p) => p.completed).length
      const avgProgress =
        totalCourses > 0
          ? studentProgress.reduce((sum, p) => sum + p.progress, 0) / totalCourses
          : 0

      const totalAssessments = studentAssessments.length
      const avgScore =
        totalAssessments > 0
          ? studentAssessments.reduce((sum, a) => sum + a.score, 0) / totalAssessments
          : 0

      const presentCount = studentAttendance.filter(
        (a) => a.status === 'PRESENT' || a.status === 'LATE'
      ).length
      const totalSessions = studentAttendance.length
      const attendanceRate =
        totalSessions > 0 ? (presentCount / totalSessions) * 100 : 100

      // Recent activity
      const recentActivity = [
        ...studentProgress.slice(0, 3).map((p) => ({
          type: 'lesson' as const,
          title: `Completed lesson: ${p.lesson?.title || 'Unknown'}`,
          course: p.course.title,
          date: p.updatedAt,
        })),
        ...studentAssessments.slice(0, 3).map((a) => ({
          type: 'assessment' as const,
          title: `Scored ${a.score}% in ${a.assessment.title}`,
          course: a.assessment.course.title,
          date: a.completedAt,
        })),
      ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)

      return {
        id: studentId,
        name: link.student.user.name,
        email: link.student.user.email,
        className: link.student.class?.name,
        rollNumber: link.student.rollNumber,
        relationType: link.relationType,
        stats: {
          totalCourses,
          completedCourses,
          avgProgress: Math.round(avgProgress),
          totalAssessments,
          avgScore: Math.round(avgScore),
          attendanceRate: Math.round(attendanceRate),
        },
        recentActivity,
        courses: studentProgress.map((p) => ({
          id: p.course.id,
          title: p.course.title,
          thumbnail: p.course.thumbnail,
          progress: Math.round(p.progress),
          completed: p.completed,
          lastAccess: p.lastAccess,
        })),
      }
    })

    return NextResponse.json({
      success: true,
      parent: {
        id: parent.id,
        name: parent.name,
        email: parent.email,
      },
      students: studentsData,
    })
  } catch (error) {
    console.error('Parent dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to load dashboard data' },
      { status: 500 }
    )
  }
}
