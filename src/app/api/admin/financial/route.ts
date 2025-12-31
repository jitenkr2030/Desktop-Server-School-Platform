import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface FinancialOverview {
  totalRevenue: number
  totalPayments: number
  averageOrderValue: number
  refundAmount: number
  netRevenue: number
}

interface RevenueData {
  date: string
  revenue: number
  orders: number
  refunds: number
}

interface PaymentMethodData {
  method: string
  count: number
  amount: number
  percentage: number
}

interface TopCourseRevenue {
  courseId: string
  title: string
  revenue: number
  sales: number
}

interface Transaction {
  id: string
  amount: number
  currency: string
  status: string
  paymentMethod: string
  createdAt: Date
  user: {
    name: string | null
    email: string
  }
  course: {
    title: string
  } | null
}

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

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30"
    const days = parseInt(period)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Calculate financial overview
    const [
      totalRevenue,
      totalPayments,
      paymentMethods,
      topCourses,
      recentTransactions
    ] = await Promise.all([
      // Total revenue
      prisma.payment.aggregate({
        where: {
          createdAt: { gte: startDate },
          status: "COMPLETED"
        },
        _sum: { amount: true }
      }),

      // Total payments count
      prisma.payment.count({
        where: {
          createdAt: { gte: startDate },
          status: "COMPLETED"
        }
      }),

      // Payments by method
      prisma.payment.groupBy({
        by: ["paymentMethod"],
        where: {
          createdAt: { gte: startDate },
          status: "COMPLETED"
        },
        _count: true,
        _sum: { amount: true }
      }),

      // Top courses by revenue
      prisma.payment.findMany({
        where: {
          createdAt: { gte: startDate },
          status: "COMPLETED",
          courseId: { not: null }
        },
        include: {
          course: {
            select: { id: true, title: true }
          }
        },
        orderBy: { amount: "desc" },
        take: 10
      }),

      // Recent transactions
      prisma.payment.findMany({
        where: {
          createdAt: { gte: startDate }
        },
        include: {
          user: {
            select: { name: true, email: true }
          },
          course: {
            select: { title: true }
          }
        },
        orderBy: { createdAt: "desc" },
        take: 20
      })
    ])

    // Calculate daily revenue for chart
    const dailyRevenue = await generateDailyRevenue(prisma, startDate)

    // Calculate revenue by course
    const courseRevenueMap = new Map<string, { title: string; revenue: number; sales: number }>()
    topCourses.forEach(payment => {
      if (payment.courseId) {
        const existing = courseRevenueMap.get(payment.courseId) || { 
          title: payment.course.title, 
          revenue: 0, 
          sales: 0 
        }
        existing.revenue += Number(payment.amount)
        existing.sales += 1
        courseRevenueMap.set(payment.courseId, existing)
      }
    })

    const topCoursesRevenue: TopCourseRevenue[] = Array.from(courseRevenueMap.entries())
      .map(([courseId, data]) => ({
        courseId,
        ...data
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // Calculate payment method breakdown
    const totalPaymentAmount = paymentMethods.reduce(
      (sum, pm) => sum + Number(pm._sum.amount || 0), 
      0
    )

    const paymentMethodData: PaymentMethodData[] = paymentMethods.map(pm => ({
      method: pm.paymentMethod || "Unknown",
      count: pm._count,
      amount: Number(pm._sum.amount || 0),
      percentage: totalPaymentAmount > 0 
        ? (Number(pm._sum.amount || 0) / totalPaymentAmount) * 100 
        : 0
    }))

    const overview: FinancialOverview = {
      totalRevenue: Number(totalRevenue._sum.amount || 0),
      totalPayments,
      averageOrderValue: totalPayments > 0 
        ? Number(totalRevenue._sum.amount || 0) / totalPayments 
        : 0,
      refundAmount: 0, // Would need refund table or field
      netRevenue: Number(totalRevenue._sum.amount || 0)
    }

    return NextResponse.json({
      overview,
      revenueChart: dailyRevenue,
      paymentMethods: paymentMethodData,
      topCourses: topCoursesRevenue,
      recentTransactions: recentTransactions.map(t => ({
        id: t.id,
        amount: Number(t.amount),
        currency: t.currency,
        status: t.status,
        paymentMethod: t.paymentMethod,
        createdAt: t.createdAt,
        user: t.user,
        course: t.course
      })),
      period: days
    })
  } catch (error) {
    console.error("Error fetching financial reports:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function generateDailyRevenue(prisma: PrismaClient, startDate: Date): Promise<RevenueData[]> {
  const revenueByDate = new Map<string, { revenue: number; orders: number; refunds: number }>()
  
  // Initialize all dates
  const today = new Date()
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0]
    revenueByDate.set(dateStr, { revenue: 0, orders: 0, refunds: 0 })
  }
  
  // Get payments grouped by date
  const payments = await prisma.payment.findMany({
    where: {
      createdAt: { gte: startDate },
      status: "COMPLETED"
    },
    select: {
      amount: true,
      createdAt: true
    }
  })
  
  payments.forEach(payment => {
    const dateStr = payment.createdAt.toISOString().split("T")[0]
    const existing = revenueByDate.get(dateStr) || { revenue: 0, orders: 0, refunds: 0 }
    existing.revenue += Number(payment.amount)
    existing.orders += 1
    revenueByDate.set(dateStr, existing)
  })
  
  return Array.from(revenueByDate.entries())
    .map(([date, data]) => ({
      date,
      ...data
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { action, exportFormat } = body

    switch (action) {
      case "export":
        // Generate export data
        const { searchParams } = new URL(request.url)
        const period = searchParams.get("period") || "30"
        
        const transactions = await prisma.payment.findMany({
          where: {
            createdAt: { 
              gte: new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000) 
            },
            status: "COMPLETED"
          },
          include: {
            user: { select: { name: true, email: true } },
            course: { select: { title: true } }
          },
          orderBy: { createdAt: "desc" }
        })

        if (exportFormat === "csv") {
          const csvHeader = "Date,Transaction ID,User,Email,Course,Amount,Payment Method,Status\n"
          const csvRows = transactions.map(t => 
            `${t.createdAt.toISOString().split("T")[0]},${t.id},${t.user.name || ""},${t.user.email},${t.course?.title || "N/A"},${t.amount},${t.paymentMethod},${t.status}`
          ).join("\n")
          
          return new NextResponse(csvHeader + csvRows, {
            headers: {
              "Content-Type": "text/csv",
              "Content-Disposition": `attachment; filename="financial-report-${Date.now()}.csv"`
            }
          })
        }

        return NextResponse.json({
          success: true,
          message: "Export generated",
          recordCount: transactions.length
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error performing action:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
