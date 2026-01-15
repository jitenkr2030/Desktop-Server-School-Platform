'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Users,
  DollarSign,
  Star,
  Plus,
  MoreVertical,
  TrendingUp,
  Clock,
  Award,
  CreditCard,
  Crown,
  Zap,
} from 'lucide-react'
import { getInstructorStats, type InstructorStats } from '@/lib/instructor-api'

// Mock data for fallback when API is not available
const mockStats: InstructorStats = {
  totalCourses: 12,
  publishedCourses: 8,
  pendingCourses: 4,
  totalStudents: 156,
  totalEarnings: 12500,
  averageRating: 4.5,
}

const mockRecentCourses = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    students: 45,
    rating: 4.8,
    status: 'published',
    thumbnail: '/images/courses/web-dev.jpg',
  },
  {
    id: '2',
    title: 'Python for Data Science',
    students: 32,
    rating: 4.6,
    status: 'published',
    thumbnail: '/images/courses/python.jpg',
  },
  {
    id: '3',
    title: 'React Native Mobile Apps',
    students: 18,
    rating: 0,
    status: 'draft',
    thumbnail: '/images/courses/react-native.jpg',
  },
]

const mockRecentActivity = [
  { id: '1', action: 'New enrollment', student: 'Rahul S.', course: 'Web Development Bootcamp', time: '2 hours ago' },
  { id: '2', action: 'Course completed', student: 'Priya M.', course: 'Python Basics', time: '5 hours ago' },
  { id: '3', action: 'Assessment submitted', student: 'Amit K.', course: 'React Fundamentals', time: '1 day ago' },
  { id: '4', action: 'New enrollment', student: 'Sneha R.', course: 'Data Science with Python', time: '1 day ago' },
]

// Quick Actions Configuration
const quickActions = [
  {
    label: 'Create Course',
    icon: Plus,
    href: '/dashboard/instructor/courses/new',
    bgColor: 'bg-indigo-600 hover:bg-indigo-700',
  },
  {
    label: 'View Analytics',
    icon: TrendingUp,
    href: '/dashboard/instructor/courses',
    bgColor: 'bg-green-600 hover:bg-green-700',
  },
  {
    label: 'Student Messages',
    icon: Users,
    href: '/dashboard/instructor/students',
    bgColor: 'bg-purple-600 hover:bg-purple-700',
  },
]

export default function InstructorDashboard() {
  const [stats, setStats] = useState<InstructorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subscriptionData, setSubscriptionData] = useState<any>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await getInstructorStats()
        if (response.success && response.stats) {
          setStats(response.stats)
        } else {
          // Use mock data if API returns no stats
          setStats(mockStats)
        }
      } catch (err) {
        console.error('Failed to fetch instructor stats:', err)
        // Use mock data on error
        setStats(mockStats)
        setError('Using demo data')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    fetchSubscriptionStatus()
  }, [])

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/instructor/subscription/status?userId=instructor1')
      const data = await response.json()
      if (data.success) {
        setSubscriptionData(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch subscription status:', err)
    }
  }

  const statsData = stats || mockStats

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back! Here&apos;s your teaching overview.</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Subscription Status */}
              {subscriptionData?.currentPlan && subscriptionData.currentPlan.id !== 'PRO' && (
                <Link
                  href="/instructor/pricing"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors border border-amber-300"
                >
                  <Crown className="w-4 h-4" />
                  <span className="font-medium">{subscriptionData.currentPlan.name} Plan</span>
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-semibold">Upgrade</span>
                </Link>
              )}
              <Link
                href="/dashboard/instructor/courses/new"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Course
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Courses"
            value={statsData.totalCourses.toString()}
            icon={BookOpen}
            color="bg-blue-500"
            trend="+2 this month"
          />
          <StatCard
            title="Published"
            value={statsData.publishedCourses.toString()}
            icon={TrendingUp}
            color="bg-green-500"
            trend={`${statsData.pendingCourses} pending`}
          />
          <StatCard
            title="Total Students"
            value={statsData.totalStudents.toString()}
            icon={Users}
            color="bg-purple-500"
            trend="+12% vs last month"
          />
          <StatCard
            title="Average Rating"
            value={statsData.averageRating.toFixed(1)}
            icon={Star}
            color="bg-yellow-500"
            trend="Based on 234 reviews"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className={`flex items-center justify-center gap-2 px-6 py-4 ${action.bgColor} text-white rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg`}
              >
                <action.icon className="w-5 h-5" />
                <span className="font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Subscription Banner */}
        {subscriptionData?.currentPlan && subscriptionData.currentPlan.id !== 'PRO' && (
          <div className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 rounded-full p-3">
                  <Crown className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{subscriptionData.currentPlan.name} Plan</h3>
                  <p className="text-purple-100">
                    {subscriptionData.usage ? `${subscriptionData.usage.courseCount} courses created` : '1 course created'} •
                    {subscriptionData.usage ? ` ${subscriptionData.usage.liveSessionCount} live sessions` : ' 0 live sessions'}
                  </p>
                </div>
              </div>
              <Link
                href="/instructor/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                <CreditCard className="w-5 h-5" />
                Upgrade to Pro
              </Link>
            </div>
          </div>
        )}

        {/* Earnings Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 mb-1">Total Earnings</p>
              <p className="text-4xl font-bold">₹{statsData.totalEarnings.toLocaleString()}</p>
              <p className="text-sm text-indigo-200 mt-2">From {statsData.totalStudents} enrolled students</p>
            </div>
            <div className="bg-white/20 rounded-full p-4">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Recent Activity & Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Courses */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Courses</h2>
              <Link
                href="/dashboard/instructor/courses"
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {mockRecentCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-16 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{course.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {course.students}
                      </span>
                      {course.rating > 0 && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {course.rating}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      course.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {course.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.student}</span>{' '}
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{activity.course}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
}: {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  trend: string
}) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} bg-opacity-10 p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xs text-gray-400 mt-2">{trend}</p>
    </div>
  )
}
