'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Analytics {
  overview: {
    totalInstitutions: number
    byStatus: Record<string, number>
    conversionRate: number
  }
  today: {
    pending: number
    approved: number
    rejected: number
  }
  trends: {
    weekSubmissions: number
    monthSubmissions: number
    avgProcessingDays: number
  }
  documents: Record<string, number>
  submissionsByDay: Array<{ date: string; count: number }>
  approvalsByDay: Array<{ date: string; count: number }>
  studentDistribution: Array<{ count: number; institutions: number }>
  recentActivity: Array<{
    id: string
    name: string
    studentCount: number | null
    status: string
    lastActivity: string
    createdAt: string
  }>
}

export default function AdminVerificationAnalytics() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [error, setError] = useState('')
  const [dateRange, setDateRange] = useState('7d')

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/verification/analytics')
      const data = await response.json()
      
      if (data.success) {
        setAnalytics(data.analytics)
      } else {
        setError(data.error || 'Failed to fetch analytics')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      UNDER_REVIEW: 'bg-blue-100 text-blue-800',
      ELIGIBLE: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      EXPIRED: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Verification Analytics
          </h1>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <button
              onClick={() => router.push('/dashboard/admin')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Overview Cards */}
        {analytics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Total Institutions</div>
                <div className="mt-2 text-3xl font-bold text-gray-900">
                  {analytics.overview.totalInstitutions}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {analytics.trends.weekSubmissions} this week
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Conversion Rate</div>
                <div className="mt-2 text-3xl font-bold text-green-600">
                  {analytics.overview.conversionRate}%
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Approved vs. Total
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Avg Processing Time</div>
                <div className="mt-2 text-3xl font-bold text-blue-600">
                  {analytics.trends.avgProcessingDays} days
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  From signup to approval
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Documents Reviewed</div>
                <div className="mt-2 text-3xl font-bold text-purple-600">
                  {Object.values(analytics.documents).reduce((a, b) => a + b, 0)}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {analytics.documents.APPROVED || 0} approved
                </div>
              </div>
            </div>

            {/* Status Distribution */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {Object.entries(analytics.overview.byStatus).map(([status, count]) => (
                <div key={status} className="bg-white rounded-lg shadow p-4 text-center">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    {status.replace(/_/g, ' ')}
                  </div>
                  <div className="mt-2 text-2xl font-bold text-gray-900">{count}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Activity */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Today's Activity</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">New Pending</span>
                      <span className="font-medium text-yellow-600">+{analytics.today.pending}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Approved</span>
                      <span className="font-medium text-green-600">+{analytics.today.approved}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Rejected</span>
                      <span className="font-medium text-red-600">+{analytics.today.rejected}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Stats */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Document Status</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {Object.entries(analytics.documents).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(status)}`}>
                            {status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow lg:col-span-1">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <ul className="divide-y divide-gray-200">
                    {analytics.recentActivity.slice(0, 10).map((activity) => (
                      <li key={activity.id} className="px-6 py-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{activity.name}</p>
                            <p className="text-xs text-gray-500">
                              {activity.studentCount?.toLocaleString() || 0} students
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(activity.status)}`}>
                              {activity.status.replace(/_/g, ' ')}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(activity.lastActivity)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Submissions Chart */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Submissions (Last 7 Days)</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-2">
                    {analytics.submissionsByDay.map((day, index) => (
                      <div key={day.date} className="flex items-center">
                        <span className="w-24 text-sm text-gray-500">
                          {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })}
                        </span>
                        <div className="flex-1 mx-4">
                          <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ 
                                width: `${Math.min(100, (day.count / Math.max(...analytics.submissionsByDay.map(d => d.count), 1)) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        <span className="w-8 text-sm font-medium text-gray-900 text-right">{day.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Approvals Chart */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Approvals (Last 7 Days)</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-2">
                    {analytics.approvalsByDay.map((day, index) => (
                      <div key={day.date || 'unknown'} className="flex items-center">
                        <span className="w-24 text-sm text-gray-500">
                          {day.date 
                            ? new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })
                            : 'N/A'}
                        </span>
                        <div className="flex-1 mx-4">
                          <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full"
                              style={{ 
                                width: `${Math.min(100, (day.count / Math.max(...analytics.approvalsByDay.map(d => d.count), 1)) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        <span className="w-8 text-sm font-medium text-gray-900 text-right">{day.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => router.push('/dashboard/admin/verification')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Review Pending Verifications
                </button>
                <button
                  onClick={() => fetchAnalytics()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700"
                >
                  Refresh Analytics
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                >
                  Export Report
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
