import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/institution/analytics/revenue - Get revenue analytics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, 1y, all
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Calculate date range
    const now = new Date();
    let start: Date;

    switch (period) {
      case '7d':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        start = new Date(0); // Beginning of time
        break;
      default:
        if (startDate && endDate) {
          start = new Date(startDate);
        } else {
          start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
    }

    // In production, query actual payment records
    // For now, generate mock data based on the schema
    const mockRevenueData = generateMockRevenueData(start, now, period);
    const mockTopCourses = generateMockTopCourses();
    const mockRecentTransactions = generateMockRecentTransactions();

    return NextResponse.json({
      period,
      dateRange: {
        start: start.toISOString(),
        end: now.toISOString(),
      },
      summary: {
        totalRevenue: mockRevenueData.reduce((sum, d) => sum + d.revenue, 0),
        totalOrders: mockRevenueData.reduce((sum, d) => sum + d.orders, 0),
        averageOrderValue: mockRevenueData.length > 0
          ? mockRevenueData.reduce((sum, d) => sum + d.revenue, 0) / mockRevenueData.reduce((sum, d) => sum + d.orders, 0)
          : 0,
        revenueGrowth: calculateGrowth(mockRevenueData),
      },
      revenueByDay: mockRevenueData,
      topCourses: mockTopCourses,
      recentTransactions: mockRecentTransactions,
      revenueByMethod: [
        { method: 'Credit Card', amount: 45000, percentage: 45 },
        { method: 'Debit Card', amount: 30000, percentage: 30 },
        { method: 'UPI', amount: 20000, percentage: 20 },
        { method: 'Net Banking', amount: 5000, percentage: 5 },
      ],
    });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue analytics' },
      { status: 500 }
    );
  }
}

function generateMockRevenueData(start: Date, end: Date, period: string): Array<{
  date: string;
  revenue: number;
  orders: number;
}> {
  const data: Array<{ date: string; revenue: number; orders: number }> = [];
  const current = new Date(start);
  const days = Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));

  // Adjust data points based on period
  let groupByDays = 1;
  if (period === '1y') groupByDays = 7;
  else if (period === '90d') groupByDays = 3;

  let runningDate = new Date(start);

  while (runningDate <= end) {
    const baseRevenue = 1500 + Math.random() * 1000;
    const orders = Math.floor(5 + Math.random() * 10);

    data.push({
      date: runningDate.toISOString().split('T')[0],
      revenue: Math.round(baseRevenue * (1 + (data.length * 0.02))), // Gradual growth
      orders: orders,
    });

    // Advance by groupByDays
    runningDate.setDate(runningDate.getDate() + groupByDays);
  }

  return data;
}

function generateMockTopCourses(): Array<{
  id: string;
  title: string;
  revenue: number;
  sales: number;
  thumbnail?: string;
}> {
  return [
    {
      id: '1',
      title: 'Complete Mathematics Mastery',
      revenue: 125000,
      sales: 125,
    },
    {
      id: '2',
      title: 'Physics for Class 10',
      revenue: 98000,
      sales: 98,
    },
    {
      id: '3',
      title: 'Chemistry Fundamentals',
      revenue: 87000,
      sales: 87,
    },
    {
      id: '4',
      title: 'Biology Complete Course',
      revenue: 76000,
      sales: 76,
    },
    {
      id: '5',
      title: 'English Literature Guide',
      revenue: 65000,
      sales: 65,
    },
  ];
}

function generateMockRecentTransactions(): Array<{
  id: string;
  user: string;
  email: string;
  course: string;
  amount: number;
  method: string;
  status: string;
  date: string;
}> {
  return [
    {
      id: 'txn_001',
      user: 'Rahul Sharma',
      email: 'rahul@example.com',
      course: 'Complete Mathematics Mastery',
      amount: 999,
      method: 'Credit Card',
      status: 'COMPLETED',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'txn_002',
      user: 'Priya Patel',
      email: 'priya@example.com',
      course: 'Physics for Class 10',
      amount: 899,
      method: 'UPI',
      status: 'COMPLETED',
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'txn_003',
      user: 'Amit Kumar',
      email: 'amit@example.com',
      course: 'Chemistry Fundamentals',
      amount: 799,
      method: 'Debit Card',
      status: 'COMPLETED',
      date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'txn_004',
      user: 'Sneha Reddy',
      email: 'sneha@example.com',
      course: 'Biology Complete Course',
      amount: 899,
      method: 'Net Banking',
      status: 'PENDING',
      date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'txn_005',
      user: 'Vikram Singh',
      email: 'vikram@example.com',
      course: 'English Literature Guide',
      amount: 699,
      method: 'Credit Card',
      status: 'COMPLETED',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

function calculateGrowth(data: Array<{ revenue: number; orders: number }>): number {
  if (data.length < 2) return 0;

  const midpoint = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, midpoint).reduce((sum, d) => sum + d.revenue, 0);
  const secondHalf = data.slice(midpoint).reduce((sum, d) => sum + d.revenue, 0);

  if (firstHalf === 0) return 100;

  return Math.round(((secondHalf - firstHalf) / firstHalf) * 100);
}
