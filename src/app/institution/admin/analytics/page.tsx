'use client'

import { useState, useEffect } from 'react'

interface RevenueData {
  mrr: number
  mrrGrowth: number
  totalSubscriptions: number
  activeSubscriptions: number
  churnedThisMonth: number
  newThisMonth: number
  avgRevenuePerTenant: number
}

interface MonthlyRevenue {
  month: string
  revenue: number
  subscriptions: number
}

interface Transaction {
  id: string
  tenantName: string
  tenantSlug: string
  amount: number
  status: string
  date: string
  type: string
}

interface TenantType {
  type: string
  count: number
  percentage: number
}

interface GeoData {
  region: string
  count: number
  revenue: number
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null)
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([])
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [tenantDistribution, setTenantDistribution] = useState<TenantType[]>([])
  const [geoDistribution, setGeoDistribution] = useState<GeoData[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'tenants' | 'geography'>('overview')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch('/institution/api/analytics')
      const data = await response.json()

      if (response.ok) {
        setRevenueData(data.revenue)
        setMonthlyRevenue(data.monthlyRevenue)
        setRecentTransactions(data.recentTransactions)
        setTenantDistribution(data.tenantDistribution)
        setGeoDistribution(data.geoDistribution)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Revenue</h1>
          <p className="text-gray-600">Track your subscription revenue and growth</p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="px-4 py-2 border rounded-lg text-sm">
            <option value="month">Last 30 days</option>
            <option value="quarter">Last 3 months</option>
            <option value="year">Last 12 months</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border p-1 inline-flex">
        {(['overview', 'revenue', 'tenants', 'geography'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && revenueData && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">Monthly Recurring Revenue</p>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      +{revenueData.mrrGrowth}%
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(revenueData.mrr)}</p>
                  <p className="text-sm text-gray-500 mt-1">This month</p>
                </div>

                <div className="bg-white rounded-xl border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">Active Subscriptions</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{revenueData.activeSubscriptions}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    of {revenueData.totalSubscriptions} total
                  </p>
                </div>

                <div className="bg-white rounded-xl border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">New This Month</p>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      +{revenueData.newThisMonth}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{revenueData.newThisMonth}</p>
                  <p className="text-sm text-gray-500 mt-1">New institutions</p>
                </div>

                <div className="bg-white rounded-xl border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">Churned</p>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                      -{revenueData.churnedThisMonth}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{revenueData.churnedThisMonth}</p>
                  <p className="text-sm text-gray-500 mt-1">This month</p>
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h2>
                <div className="h-64 flex items-end space-x-2">
                  {monthlyRevenue.map((month, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-blue-600 rounded-t transition-all hover:bg-blue-700"
                        style={{
                          height: `${(month.revenue / maxRevenue) * 200}px`,
                          minHeight: '4px',
                        }}
                        title={`${month.month}: ${formatCurrency(month.revenue)}`}
                      ></div>
                      <span className="text-xs text-gray-500 mt-2 truncate w-full text-center">
                        {month.month.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Institution</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {recentTransactions.map((txn) => (
                        <tr key={txn.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900">{txn.tenantName}</p>
                            <p className="text-sm text-gray-500">{txn.tenantSlug}.inr99.academy</p>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {formatCurrency(txn.amount)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                txn.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : txn.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {txn.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {formatDate(txn.date)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Revenue Tab */}
          {activeTab === 'revenue' && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Revenue Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscriptions</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg per Tenant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {monthlyRevenue.slice().reverse().map((month, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{month.month}</td>
                        <td className="px-4 py-3 text-gray-600">{month.subscriptions}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{formatCurrency(month.revenue)}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {formatCurrency(month.subscriptions > 0 ? month.revenue / month.subscriptions : 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tenants Tab */}
          {activeTab === 'tenants' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Tenants by Type</h2>
                <div className="space-y-4">
                  {tenantDistribution.map((type, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{type.type}</span>
                        <span className="text-sm text-gray-500">{type.count} ({type.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${type.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Status</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {revenueData?.activeSubscriptions || 0}
                    </p>
                    <p className="text-sm text-green-700">Active</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-yellow-600">
                      {(revenueData?.totalSubscriptions || 0) - (revenueData?.activeSubscriptions || 0)}
                    </p>
                    <p className="text-sm text-yellow-700">Pending/Expired</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Geography Tab */}
          {activeTab === 'geography' && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Region</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenants</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {geoDistribution.map((region, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{region.region}</td>
                        <td className="px-4 py-3 text-gray-600">{region.count}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{formatCurrency(region.revenue)}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {((region.revenue / (revenueData?.mrr || 1)) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
