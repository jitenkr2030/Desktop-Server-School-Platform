import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user stats
    const [progress, certificates, discussions] = await Promise.all([
      // Course progress
      db.courseProgress.findMany({
        where: { userId: user.id },
        include: {
          course: {
            select: { id: true, title: true }
          }
        }
      }),
      // Certificates
      db.certificate.findMany({
        where: { userId: user.id },
        select: { id: true }
      }),
      // Discussions
      db.discussion.findMany({
        where: { userId: user.id },
        select: { id: true }
      })
    ])

    // Calculate stats
    const totalCourses = progress.length
    const completedCourses = progress.filter(p => p.completed).length
    const totalTimeSpent = progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0)
    const certificatesEarned = certificates.length
    const currentStreak = 5 // Mock data - would need to calculate from activity logs
    const averageProgress = totalCourses > 0 
      ? progress.reduce((sum, p) => sum + p.progress, 0) / totalCourses 
      : 0

    const stats = {
      totalCourses,
      completedCourses,
      totalTimeSpent,
      certificatesEarned,
      currentStreak,
      averageProgress
    }

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Get user stats error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}