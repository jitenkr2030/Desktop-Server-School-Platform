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

    // Get time period from query params (default: last 30 days)
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get("days") || "30")

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Basic counts with error handling
    let totalUsers = 0, activeUsers = 0, totalCourses = 0
    let activeCourses = 0, totalDiscussions = 0
    let totalSubscriptions = 0, activeSubscriptions = 0
    let totalCertificates = 0, totalPayments = 0

    try {
      ;[
        totalUsers,
        activeUsers,
        totalCourses,
        activeCourses,
        totalDiscussions,
        totalSubscriptions,
        activeSubscriptions,
        totalCertificates,
        totalPayments
      ] = await Promise.all([
        prisma.user.count().catch(() => 0),
        prisma.user.count({ where: { isActive: true } }).catch(() => 0),
        prisma.course.count().catch(() => 0),
        prisma.course.count({ where: { isActive: true } }).catch(() => 0),
        prisma.discussion.count().catch(() => 0),
        prisma.subscription.count().catch(() => 0),
        prisma.subscription.count({ where: { status: "ACTIVE" } }).catch(() => 0),
        prisma.certificate.count().catch(() => 0),
        prisma.paymentRecord.count({ where: { status: "COMPLETED" } }).catch(() => 0)
      ])
    } catch (countError) {
      console.warn("Count queries failed:", countError)
    }

    // Revenue data with error handling
    let totalRevenue = 0
    let revenueChart: { date: string; revenue: number; subscriptions: number; certificates: number }[] = []

    try {
      const payments = await prisma.paymentRecord.findMany({
        where: { 
          status: "COMPLETED",
          createdAt: { gte: startDate }
        },
        select: { amount: true, createdAt: true, type: true },
        orderBy: { createdAt: "asc" }
      }).catch(() => [])

      totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
      
      // Group revenue by date for chart
      const revenueByDate: Record<string, { date: string; revenue: number; subscriptions: number; certificates: number }> = {}
      payments.forEach(payment => {
        const date = new Date(payment.createdAt).toISOString().split("T")[0]
        if (!revenueByDate[date]) {
          revenueByDate[date] = { date, revenue: 0, subscriptions: 0, certificates: 0 }
        }
        revenueByDate[date].revenue += payment.amount
        if (payment.type === "SUBSCRIPTION") {
          revenueByDate[date].subscriptions += 1
        } else {
          revenueByDate[date].certificates += 1
        }
      })
      
      revenueChart = Object.values(revenueByDate)
    } catch (revenueError) {
      console.warn("Revenue calculation failed:", revenueError)
    }

    // User growth by month - aggregate manually
    let usersChart: { month: string; count: number }[] = []
    try {
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      const users = await prisma.user.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true }
      }).catch(() => [])

      // Group user growth by month
      const usersByMonth: Record<string, number> = {}
      users.forEach(record => {
        const month = new Date(record.createdAt).toISOString().slice(0, 7) // YYYY-MM
        usersByMonth[month] = (usersByMonth[month] || 0) + 1
      })
      
      usersChart = Object.entries(usersByMonth)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => a.month.localeCompare(b.month))
    } catch (usersError) {
      console.warn("User growth calculation failed:", usersError)
    }

    // Course distribution by difficulty
    let coursesByDifficulty: { difficulty: string; count: number }[] = []
    try {
      const difficultyData = await prisma.course.groupBy({
        by: ["difficulty"],
        _count: { id: true }
      }).catch(() => [])
      
      coursesByDifficulty = difficultyData.map(c => ({ difficulty: c.difficulty, count: c._count.id }))
    } catch (diffError) {
      console.warn("Difficulty calculation failed:", diffError)
    }

    // Course distribution by category
    let coursesByCategory: { name: string; count: number }[] = []
    try {
      const categories = await prisma.category.findMany({
        include: {
          courses: {
            where: { isActive: true },
            select: { id: true }
          }
        },
        orderBy: { name: "asc" }
      }).catch(() => [])
      
      coursesByCategory = categories.map(c => ({ 
        name: c.name, 
        count: c.courses.length 
      }))
    } catch (catError) {
      console.warn("Category calculation failed:", catError)
    }

    // Top courses by enrollment
    let topCourses: { courseId: string; title: string; enrollments: number }[] = []
    try {
      const courseProgress = await prisma.courseProgress.groupBy({
        by: ["courseId"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10
      }).catch(() => [])

      if (courseProgress.length > 0) {
        const courseIds = courseProgress.map(c => c.courseId)
        const courseDetails = await prisma.course.findMany({
          where: { id: { in: courseIds } },
          select: { id: true, title: true }
        }).catch(() => [])

        topCourses = courseProgress.map(tc => ({
          courseId: tc.courseId,
          title: courseDetails.find(c => c.id === tc.courseId)?.title || "Unknown",
          enrollments: tc._count.id
        }))
      }
    } catch (topError) {
      console.warn("Top courses calculation failed:", topError)
    }

    // Top instructors by courses
    let instructors: { id: string; name: string; courseCount: number }[] = []
    try {
      const instructorStats = await prisma.instructor.findMany({
        include: {
          courses: {
            where: { isActive: true },
            select: { id: true }
          }
        },
        orderBy: { name: "asc" }
      }).catch(() => [])

      instructors = instructorStats.map(inst => ({
        id: inst.id,
        name: inst.name,
        courseCount: inst.courses.length
      }))
    } catch (instError) {
      console.warn("Instructor stats calculation failed:", instError)
    }

    // Subscription stats
    let subscriptionStats: { status: string; count: number }[] = []
    try {
      const subData = await prisma.subscription.groupBy({
        by: ["status"],
        _count: { id: true }
      }).catch(() => [])
      
      subscriptionStats = subData.map(s => ({ status: s.status, count: s._count.id }))
    } catch (subStatError) {
      console.warn("Subscription stats calculation failed:", subStatError)
    }

    // Recent activity (last 10 discussions)
    let recentDiscussions: any[] = []
    try {
      recentDiscussions = await prisma.discussion.findMany({
        include: {
          user: { select: { name: true, email: true } },
          course: { select: { title: true } },
          _count: { select: { replies: true } }
        },
        orderBy: { createdAt: "desc" },
        take: 10
      }).catch(() => [])
    } catch (discError) {
      console.warn("Recent discussions calculation failed:", discError)
    }

    // Daily active users (approximation based on last login)
    let dailyActiveUsers: { lastLogin: Date; name: string | null; email: string }[] = []
    try {
      dailyActiveUsers = await prisma.user.findMany({
        where: { lastLogin: { gte: startDate } },
        select: { lastLogin: true, name: true, email: true },
        orderBy: { lastLogin: "desc" },
        take: 50
      }).catch(() => [])
    } catch (dauError) {
      console.warn("DAU calculation failed:", dauError)
    }

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers,
        totalCourses,
        activeCourses,
        totalDiscussions,
        totalSubscriptions,
        activeSubscriptions,
        totalCertificates,
        totalPayments,
        totalRevenue
      },
      revenueChart,
      usersChart,
      coursesByDifficulty,
      coursesByCategory,
      topCourses,
      instructors,
      subscriptionStats,
      recentDiscussions,
      dailyActiveUsers: dailyActiveUsers.slice(0, 20)
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
