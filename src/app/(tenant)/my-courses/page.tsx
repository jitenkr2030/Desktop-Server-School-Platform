'use client'

import { useState, useEffect } from 'react'

interface AssignedCourse {
  id: string
  courseId: string
  status: string
  isMandatory: boolean
  startDate: string | null
  endDate: string | null
  course: {
    id: string
    title: string
    description: string
    thumbnail: string | null
    difficulty: string
    duration: number
  }
  class: {
    id: string
    name: string
  }
}

export default function StudentAssignedCoursesPage() {
  const [courses, setCourses] = useState<AssignedCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'mandatory' | 'optional'>('all')

  useEffect(() => {
    // In a real app, get userId from auth context
    const userId = 'demo-user'
    loadAssignedCourses(userId)
  }, [])

  const loadAssignedCourses = async (userId: string) => {
    try {
      // Get user's class from their profile
      const profileRes = await fetch(`/api/institution/api/student/parent-links?userId=${userId}`)
      // For demo, just load mock data
      
      // Mock data for demonstration
      setCourses([
        {
          id: '1',
          courseId: 'c1',
          status: 'ACTIVE',
          isMandatory: true,
          startDate: null,
          endDate: null,
          course: {
            id: 'c1',
            title: 'Mathematics Class 10',
            description: 'Complete mathematics course covering algebra, geometry, and statistics',
            thumbnail: null,
            difficulty: 'INTERMEDIATE',
            duration: 1200,
          },
          class: { id: 'cls1', name: 'Class 10-A' },
        },
        {
          id: '2',
          courseId: 'c2',
          status: 'ACTIVE',
          isMandatory: true,
          startDate: null,
          endDate: null,
          course: {
            id: 'c2',
            title: 'Physics Fundamentals',
            description: 'Introduction to physics concepts for high school students',
            thumbnail: null,
            difficulty: 'BEGINNER',
            duration: 900,
          },
          class: { id: 'cls1', name: 'Class 10-A' },
        },
        {
          id: '3',
          courseId: 'c3',
          status: 'ACTIVE',
          isMandatory: false,
          startDate: null,
          endDate: null,
          course: {
            id: 'c3',
            title: 'Computer Programming',
            description: 'Learn programming basics with Python',
            thumbnail: null,
            difficulty: 'BEGINNER',
            duration: 600,
          },
          class: { id: 'cls1', name: 'Class 10-A' },
        },
      ])
    } catch (error) {
      console.error('Failed to load courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter((course) => {
    if (filter === 'mandatory') return course.isMandatory
    if (filter === 'optional') return !course.isMandatory
    return true
  })

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      BEGINNER: 'text-green-600 bg-green-50',
      INTERMEDIATE: 'text-yellow-600 bg-yellow-50',
      ADVANCED: 'text-red-600 bg-red-50',
    }
    return colors[difficulty] || 'text-gray-600 bg-gray-50'
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600">Courses assigned to your class</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Total Courses</p>
          <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Mandatory</p>
          <p className="text-2xl font-bold text-red-600">
            {courses.filter((c) => c.isMandatory).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Optional</p>
          <p className="text-2xl font-bold text-green-600">
            {courses.filter((c) => !c.isMandatory).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {(['all', 'mandatory', 'optional'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-blue-100 text-blue-700'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-gray-600">No courses assigned to your class yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
              {/* Course Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                {assignment.course.thumbnail ? (
                  <img
                    src={assignment.course.thumbnail}
                    alt={assignment.course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )}
                {assignment.isMandatory && (
                  <div className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                    Mandatory
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${getDifficultyColor(assignment.course.difficulty)}`}>
                    {assignment.course.difficulty}
                  </span>
                  <span className="text-xs text-gray-500">{formatDuration(assignment.course.duration)}</span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-1">{assignment.course.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{assignment.course.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Class: {assignment.class.name}
                  </span>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Start Learning
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
