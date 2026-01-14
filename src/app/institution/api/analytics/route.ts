import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'month'

    // In production, these would be real database queries
    // For now, return mock data

    const revenueData = {
      mrr: 4950, // Monthly Recurring Revenue
      mrrGrowth: 12.5,
      totalSubscriptions: 50,
      activeSubscriptions: 45,
      churnedThisMonth: 2,
      newThisMonth: 8,
      avgRevenuePerTenant: 99,
    }

    // Revenue by month (last 12 months)
    const monthlyRevenue = [
      { month: 'Feb 2025', revenue: 990, subscriptions: 10 },
      { month: 'Mar 2025', revenue: 1386, subscriptions: 14 },
      { month: 'Apr 2025', revenue: 1782, subscriptions: 18 },
      { month: 'May 2025', revenue: 2178, subscriptions: 22 },
      { month: 'Jun 2025', revenue: 2475, subscriptions: 25 },
      { month: 'Jul 2025', revenue: 2772, subscriptions: 28 },
      { month: 'Aug 2025', revenue: 3069, subscriptions: 31 },
      { month: 'Sep 2025', revenue: 3267, subscriptions: 33 },
      { month: 'Oct 2025', revenue: 3564, subscriptions: 36 },
      { month: 'Nov 2025', revenue: 3861, subscriptions: 39 },
      { month: 'Dec 2025', revenue: 4158, subscriptions: 42 },
      { month: 'Jan 2026', revenue: 4950, subscriptions: 50 },
    ]

    // Recent transactions
    const recentTransactions = [
      {
        id: 'txn_1',
        tenantName: 'Delhi Public School',
        tenantSlug: 'dps',
        amount: 99,
        status: 'completed',
        date: '2026-01-14T10:30:00Z',
        type: 'subscription',
      },
      {
        id: 'txn_2',
        tenantName: 'Bangalore International School',
        tenantSlug: 'bis',
        amount: 99,
        status: 'completed',
        date: '2026-01-14T09:15:00Z',
        type: 'subscription',
      },
      {
        id: 'txn_3',
        tenantName: 'Mumbai Coaching Center',
        tenantSlug: 'mumbai-coaching',
        amount: 99,
        status: 'completed',
        date: '2026-01-13T14:45:00Z',
        type: 'subscription',
      },
      {
        id: 'txn_4',
        tenantName: 'Chennai Engineering College',
        tenantSlug: 'cec',
        amount: 99,
        status: 'pending',
        date: '2026-01-13T11:20:00Z',
        type: 'subscription',
      },
      {
        id: 'txn_5',
        tenantName: 'Pune Management Institute',
        tenantSlug: 'pmi',
        amount: 99,
        status: 'completed',
        date: '2026-01-12T16:00:00Z',
        type: 'subscription',
      },
    ]

    // Tenant distribution by type
    const tenantDistribution = [
      { type: 'School', count: 25, percentage: 50 },
      { type: 'College', count: 10, percentage: 20 },
      { type: 'Coaching', count: 10, percentage: 20 },
      { type: 'Corporate', count: 5, percentage: 10 },
    ]

    // Top performing tenants
    const topTenants = [
      { name: 'Delhi Public School', students: 500, revenue: 990 },
      { name: 'Bangalore International', students: 350, revenue: 693 },
      { name: 'Mumbai Coaching Center', students: 280, revenue: 554 },
      { name: 'Chennai Engineering', students: 200, revenue: 396 },
      { name: 'Pune Management', students: 180, revenue: 356 },
    ]

    // Geographic distribution
    const geoDistribution = [
      { region: 'Maharashtra', count: 12, revenue: 1188 },
      { region: 'Karnataka', count: 8, revenue: 792 },
      { region: 'Tamil Nadu', count: 7, revenue: 693 },
      { region: 'Delhi NCR', count: 6, revenue: 594 },
      { region: 'Telangana', count: 5, revenue: 495 },
      { region: 'Other', count: 12, revenue: 1188 },
    ]

    return NextResponse.json({
      success: true,
      revenue: revenueData,
      monthlyRevenue,
      recentTransactions,
      tenantDistribution,
      topTenants,
      geoDistribution,
    })
  } catch (error) {
    console.error('Get analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
