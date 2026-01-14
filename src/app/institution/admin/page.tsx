'use client'

import { useState } from 'react'

// Mock data for demonstration - in production, this would come from API calls
const mockStats = {
  totalUsers: 245,
  activeUsers: 189,
  totalCourses: 12,
  totalClasses: 5,
  storageUsed: '2.4 GB',
  subscriptionStatus: 'active',
  nextBillingDate: '2026-02-14',
}

const mockRecentActivity = [
  { id: 1, type: 'user_registered', user: 'John Doe', time: '2 hours ago' },
  { id: 2, type: 'course_completed', user: 'Jane Smith', time: '5 hours ago' },
  { id: 3, type: 'teacher_added', user: 'Mr. Sharma', time: '1 day ago' },
  { id: 4, type: 'class_created', user: 'Admin', time: '2 days ago' },
]

const mockQuickActions = [
  {
    title: 'Invite Teacher',
    description: 'Send invitation to new teacher',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
    href: '/institution/admin/users?action=invite',
  },
  {
    title: 'Add Student',
    description: 'Add students individually or bulk upload',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
    href: '/institution/admin/users?action=add-student',
  },
  {
    title: 'Create Class',
    description: 'Set up new class or grade',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    href: '/institution/admin/users?action=create-class',
  },
  {
    title: 'Customize Branding',
    description: 'Update logo, colors, and theme',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    href: '/institution/admin/branding',
  },
]

export default function InstitutionAdminPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your institution admin panel</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">Last updated: Just now</span>
          <button className="p-2 bg-white border rounded-lg hover:bg-gray-50">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Subscription Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 bg-white/20 rounded text-sm font-medium">
                Professional Plan
              </span>
              <span className="px-2 py-1 bg-green-400/30 rounded text-sm font-medium">
                Active
              </span>
            </div>
            <h2 className="text-xl font-semibold mb-1">Your platform is live!</h2>
            <p className="text-blue-100">
              Next billing date: February 14, 2026 • ₹99/month
            </p>
          </div>
          <div className="hidden md:block">
            <a
              href="/institution/admin/billing"
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50"
            >
              Manage Subscription
            </a>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{mockStats.totalUsers}</p>
              <p className="text-sm text-green-600 mt-1">+12 this week</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{mockStats.activeUsers}</p>
              <p className="text-sm text-gray-500 mt-1">77% engagement</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Courses */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Courses Available</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{mockStats.totalCourses}</p>
              <p className="text-sm text-blue-600 mt-1">All INR99 Content</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        {/* Classes */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Classes</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{mockStats.totalClasses}</p>
              <p className="text-sm text-gray-500 mt-1">5 active classes</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {mockQuickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="flex flex-col p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-3">
                  {action.icon}
                </div>
                <h3 className="font-medium text-gray-900">{action.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{action.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <a href="#" className="text-sm text-blue-600 hover:underline">View all</a>
          </div>
          <div className="space-y-4">
            {mockRecentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {activity.type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Preview */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Platform</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">your-school.inr99.academy</span>
            <button className="p-1 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="border rounded-lg p-8 bg-gray-50 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-xl">Y</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Institution Name</h3>
          <p className="text-gray-600 mb-4">Your custom branded learning platform</p>
          <div className="flex justify-center space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              Open Platform
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700">
              Customize
            </button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">Need help?</h3>
            <p className="text-sm text-blue-700 mt-1">
              Check our documentation for guides on setting up classes, inviting teachers, and managing your institution.
            </p>
            <a href="#" className="inline-block mt-2 text-sm font-medium text-blue-600 hover:underline">
              View Documentation →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
