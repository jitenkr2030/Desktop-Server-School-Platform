import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get basic counts - with fallback for missing tables
    let totalUsers = 0, activeUsers = 0, totalCourses = 0
    let totalDiscussions = 0, totalSubscriptions = 0, activeSubscriptions = 0
    let totalCertificates = 0, totalPayments = 0

    try {
      ;[
        totalUsers,
        activeUsers,
        totalCourses,
        totalDiscussions,
        totalSubscriptions,
        activeSubscriptions,
        totalCertificates,
        totalPayments
      ] = await Promise.all([
        prisma.user.count().catch(() => 0),
        prisma.user.count({ where: { isActive: true } }).catch(() => 0),
        prisma.course.count({ where: { isActive: true } }).catch(() => 0),
        prisma.discussion.count({ where: { isActive: true } }).catch(() => 0),
        prisma.subscription.count().catch(() => 0),
        prisma.subscription.count({ where: { status: "ACTIVE" } }).catch(() => 0),
        prisma.certificate.count().catch(() => 0),
        prisma.paymentRecord.count({ where: { status: "COMPLETED" } }).catch(() => 0)
      ])
    } catch (countError) {
      console.warn("Some count queries failed, continuing with zeros:", countError)
    }

    // Get revenue data safely
    let totalRevenue = 0
    let monthlyRevenue = 0
    
    try {
      const payments = await prisma.paymentRecord.findMany({
        where: { status: "COMPLETED" },
        select: { amount: true, createdAt: true }
      }).catch(() => [])

      totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0)
      
      // Calculate monthly revenue (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const monthlyPayments = payments.filter(payment => 
        new Date(payment.createdAt) >= thirtyDaysAgo
      )
      monthlyRevenue = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0)
    } catch (revenueError) {
      console.warn("Revenue calculation failed:", revenueError)
    }

    // Get user growth data (last 6 months) - aggregate manually
    let userGrowth: { month: string; count: number }[] = []
    try {
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      
      const users = await prisma.user.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true }
      }).catch(() => [])

      // Group by month manually
      const growthMap: Record<string, number> = {}
      users.forEach(user => {
        const month = new Date(user.createdAt).toISOString().slice(0, 7) // YYYY-MM
        growthMap[month] = (growthMap[month] || 0) + 1
      })
      
      userGrowth = Object.entries(growthMap)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => a.month.localeCompare(b.month))
    } catch (growthError) {
      console.warn("User growth calculation failed:", growthError)
    }

    // Get course stats safely
    let courseStats: { courseId: string; title: string; enrollments: number }[] = []
    try {
      const courseProgress = await prisma.courseProgress.groupBy({
        by: ["courseId"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10
      }).catch(() => [])

      if (courseProgress.length > 0) {
        const courseIds = courseProgress.map(cp => cp.courseId)
        const courses = await prisma.course.findMany({
          where: { id: { in: courseIds } },
          select: { id: true, title: true }
        }).catch(() => [])

        courseStats = courseProgress.map(cp => ({
          courseId: cp.courseId,
          title: courses.find(c => c.id === cp.courseId)?.title || "Unknown Course",
          enrollments: cp._count.id
        }))
      }
    } catch (courseError) {
      console.warn("Course stats calculation failed:", courseError)
    }

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        totalCourses,
        totalDiscussions,
        totalSubscriptions,
        activeSubscriptions,
        totalCertificates,
        totalPayments,
        totalRevenue,
        monthlyRevenue
      },
      userGrowth,
      courseStats
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
