'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Student {
  id: string
  name: string
  email: string
  className: string | null
  rollNumber: string | null
  relationType: string
  stats: {
    totalCourses: number
    completedCourses: number
    avgProgress: number
    totalAssessments: number
    avgScore: number
    attendanceRate: number
  }
  recentActivity: Array<{
    type: string
    title: string
    course: string
    date: string
  }>
  courses: Array<{
    id: string
    title: string
    thumbnail: string | null
    progress: number
    completed: boolean
    lastAccess: string | null
  }>
}

interface ParentData {
  parent: {
    id: string
    name: string
    email: string
  }
  students: Student[]
}

export default function ParentDashboardPage() {
  const router = useRouter()
  const [parentData, setParentData] = useState<ParentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkCode, setLinkCode] = useState('')
  const [linking, setLinking] = useState(false)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = () => {
    const stored = localStorage.getItem('parentData')
    if (!stored) {
      router.push('/parent/login')
      return
    }

    const data = JSON.parse(stored) as ParentData
    setParentData(data)
    if (data.students.length > 0) {
      setSelectedStudent(data.students[0].id)
    }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('parentData')
    router.push('/parent/login')
  }

  const handleLinkStudent = async () => {
    if (!linkCode.trim()) return

    setLinking(true)
    try {
      const response = await fetch('/api/institution/api/parent/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parentId: parentData?.parent.id,
          studentCode: linkCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to link student')
      }

      setShowLinkModal(false)
      setLinkCode('')
      alert(`Link request sent for ${data.student.name}. Your child needs to approve the connection.`)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLinking(false)
    }
  }

  const currentStudent = parentData?.students.find((s) => s.id === selectedStudent)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!parentData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Parent Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{parentData.parent.name}</p>
                <p className="text-xs text-gray-500">{parentData.parent.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome and Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome, {parentData.parent.name.split(' ')[0]}
            </h2>
            <p className="text-gray-600">
              {parentData.students.length > 0
                ? `Monitoring ${parentData.students.length} student(s)`
                : 'No students linked yet'}
            </p>
          </div>
          <button
            onClick={() => setShowLinkModal(true)}
            className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Link New Student
          </button>
        </div>

        {parentData.students.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Linked</h3>
            <p className="text-gray-600 mb-4">
              Get your child&apos;s unique linking code from their school and add them here.
            </p>
            <button
              onClick={() => setShowLinkModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Link Your First Student
            </button>
          </div>
        ) : (
          <>
            {/* Student Tabs */}
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
              {parentData.students.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedStudent === student.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {student.name}
                  {student.className && (
                    <span className="ml-2 text-xs text-gray-500">({student.className})</span>
                  )}
                </button>
              ))}
            </div>

            {currentStudent && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow">
                    <p className="text-sm text-gray-500">Course Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{currentStudent.stats.avgProgress}%</p>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: `${currentStudent.stats.avgProgress}%` }}
                      />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow">
                    <p className="text-sm text-gray-500">Assessment Score</p>
                    <p className="text-2xl font-bold text-gray-900">{currentStudent.stats.avgScore}%</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {currentStudent.stats.totalAssessments} assessments
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow">
                    <p className="text-sm text-gray-500">Attendance</p>
                    <p className="text-2xl font-bold text-gray-900">{currentStudent.stats.attendanceRate}%</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {currentStudent.stats.attendanceRate >= 90
                        ? 'Excellent'
                        : currentStudent.stats.attendanceRate >= 75
                        ? 'Good'
                        : 'Needs attention'}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow">
                    <p className="text-sm text-gray-500">Courses</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {currentStudent.stats.completedCourses}/{currentStudent.stats.totalCourses}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Completed</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Course Progress */}
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Progress</h3>
                    {currentStudent.courses.length === 0 ? (
                      <p className="text-gray-500">No courses yet</p>
                    ) : (
                      <div className="space-y-4">
                        {currentStudent.courses.map((course) => (
                          <div key={course.id} className="flex items-center space-x-4">
                            {course.thumbnail ? (
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                              <div className="mt-1 h-2 bg-gray-200 rounded-full">
                                <div
                                  className={`h-2 rounded-full ${
                                    course.completed ? 'bg-green-500' : 'bg-blue-600'
                                  }`}
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-sm font-medium text-gray-600">{course.progress}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    {currentStudent.recentActivity.length === 0 ? (
                      <p className="text-gray-500">No recent activity</p>
                    ) : (
                      <div className="space-y-4">
                        {currentStudent.recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              activity.type === 'lesson' ? 'bg-blue-100' : 'bg-green-100'
                            }`}>
                              {activity.type === 'lesson' ? (
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900">{activity.title}</p>
                              <p className="text-xs text-gray-500">{activity.course}</p>
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(activity.date).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Link Student Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Link New Student</h3>
              <button
                onClick={() => setShowLinkModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Linking Code
                </label>
                <input
                  type="text"
                  value={linkCode}
                  onChange={(e) => setLinkCode(e.target.value.toUpperCase())}
                  placeholder="Enter code from your child"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono uppercase"
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <strong>How to get the code:</strong> Ask your child to go to their dashboard and generate a parent linking code. Enter that code above.
                </p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-700">
                  <strong>Note:</strong> Your child must approve the connection from their side after you submit the request.
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLinkStudent}
                  disabled={!linkCode.trim() || linking}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {linking ? 'Linking...' : 'Send Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
