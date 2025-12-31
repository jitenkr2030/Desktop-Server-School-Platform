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

    // Get basic counts
    const [
      totalUsers,
      activeUsers,
      totalCourses,
      totalDiscussions,
      totalSubscriptions,
      activeSubscriptions,
      totalCertificates,
      totalPayments
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.course.count({ where: { isActive: true } }),
      prisma.discussion.count({ where: { isActive: true } }),
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.certificate.count(),
      prisma.paymentRecord.count({ where: { status: "COMPLETED" } })
    ])

    // Get revenue data
    const payments = await prisma.paymentRecord.findMany({
      where: { status: "COMPLETED" },
      select: {
        amount: true,
        createdAt: true
      }
    })

    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0)
    
    // Calculate monthly revenue (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const monthlyPayments = payments.filter(payment => 
      new Date(payment.createdAt) >= thirtyDaysAgo
    )
    const monthlyRevenue = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0)

    // Get user growth data (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const userGrowth = await prisma.user.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        createdAt: "asc"
      }
    })

    // Get course popularity
    const coursePopularity = await prisma.courseProgress.groupBy({
      by: ["courseId"],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: "desc"
        }
      },
      take: 10
    })

    // Get course details for popularity
    const courseIds = coursePopularity.map(cp => cp.courseId)
    const courses = await prisma.course.findMany({
      where: {
        id: {
          in: courseIds
        }
      },
      select: {
        id: true,
        title: true
      }
    })

    const courseStats = coursePopularity.map(cp => {
      const course = courses.find(c => c.id === cp.courseId)
      return {
        courseId: cp.courseId,
        title: course?.title || "Unknown Course",
        enrollments: cp._count.id
      }
    })

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
