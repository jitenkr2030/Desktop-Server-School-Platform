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

    // Basic counts
    const [
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
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.course.count(),
      prisma.course.count({ where: { isActive: true } }),
      prisma.discussion.count(),
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.certificate.count(),
      prisma.paymentRecord.count({ where: { status: "COMPLETED" } })
    ])

    // Revenue data
    const payments = await prisma.paymentRecord.findMany({
      where: { 
        status: "COMPLETED",
        createdAt: { gte: startDate }
      },
      select: {
        amount: true,
        createdAt: true,
        type: true
      },
      orderBy: { createdAt: "asc" }
    })

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
    
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

    // User growth by month
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const userGrowth = await prisma.user.groupBy({
      by: ["createdAt"],
      where: { createdAt: { gte: sixMonthsAgo } },
      _count: { id: true },
      orderBy: { createdAt: "asc" }
    })

    // Group user growth by month
    const usersByMonth: Record<string, number> = {}
    userGrowth.forEach(record => {
      const month = new Date(record.createdAt).toISOString().slice(0, 7) // YYYY-MM
      usersByMonth[month] = (usersByMonth[month] || 0) + record._count.id
    })

    // Course distribution by difficulty
    const coursesByDifficulty = await prisma.course.groupBy({
      by: ["difficulty"],
      _count: { id: true }
    })

    // Course distribution by category
    const coursesByCategory = await prisma.category.findMany({
      include: {
        courses: {
          where: { isActive: true },
          select: { id: true }
        }
      },
      orderBy: { name: "asc" }
    })

    // Top courses by enrollment
    const topCourses = await prisma.courseProgress.groupBy({
      by: ["courseId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10
    })

    const courseIds = topCourses.map(c => c.courseId)
    const courseDetails = await prisma.course.findMany({
      where: { id: { in: courseIds } },
      select: { id: true, title: true }
    })

    const topCoursesData = topCourses.map(tc => ({
      courseId: tc.courseId,
      title: courseDetails.find(c => c.id === tc.courseId)?.title || "Unknown",
      enrollments: tc._count.id
    }))

    // Top instructors by courses
    const instructorStats = await prisma.instructor.findMany({
      include: {
        courses: {
          where: { isActive: true },
          select: { id: true }
        }
      },
      orderBy: { name: "asc" }
    })

    const instructorData = instructorStats.map(inst => ({
      id: inst.id,
      name: inst.name,
      courseCount: inst.courses.length
    }))

    // Subscription stats
    const subscriptionStats = await prisma.subscription.groupBy({
      by: ["status"],
      _count: { id: true }
    })

    // Recent activity (last 10 discussions)
    const recentDiscussions = await prisma.discussion.findMany({
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
        _count: { select: { replies: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 10
    })

    // Daily active users (approximation based on last login)
    const dailyActiveUsers = await prisma.user.findMany({
      where: { lastLogin: { gte: startDate } },
      select: { lastLogin: true, name: true, email: true },
      orderBy: { lastLogin: "desc" },
      take: 50
    })

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
      revenueChart: Object.values(revenueByDate),
      usersChart: Object.entries(usersByMonth).map(([month, count]) => ({ month, count })),
      coursesByDifficulty: coursesByDifficulty.map(c => ({ difficulty: c.difficulty, count: c._count.id })),
      coursesByCategory: coursesByCategory.map(c => ({ 
        name: c.name, 
        count: c.courses.length 
      })),
      topCourses: topCoursesData,
      instructors: instructorData,
      subscriptionStats: subscriptionStats.map(s => ({ status: s.status, count: s._count.id })),
      recentDiscussions,
      dailyActiveUsers: dailyActiveUsers.slice(0, 20)
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
