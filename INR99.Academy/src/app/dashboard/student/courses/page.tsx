"use client"

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { useSession } from 'next-auth/react'
import { useLearningProgress } from '@/contexts/learning-progress-context'
import { useRouter } from 'next/navigation'

interface EnrolledCourse {
  id: string
  title: string
  description: string
  thumbnail?: string
  difficulty: string
  duration: number
  instructor: {
    id: string
    name: string
    avatar?: string
  }
  lessonCount: number
  enrolledCount: number
  enrolledAt: string
  status: string
  progress?: {
    progress: number
    completed: boolean
    lastAccess: string
  }
}

export default function StudentCourses() {
  const { data: session } = useSession()
  const { progressData } = useLearningProgress()
  const router = useRouter()
  
  const [courses, setCourses] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEnrolledCourses()
  }, [session])

  const fetchEnrolledCourses = async () => {
    if (!session?.user) {
      // Use demo data for non-logged in users
      setCourses(getDemoCourses())
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/user/enrollments')
      const data = await res.json()
      
      if (data.success && Array.isArray(data.enrollments)) {
        // Transform enrollment data to match interface
        const enrolledCourses = data.enrollments.map((enrollment: any) => ({
          id: enrollment.course.id,
          title: enrollment.course.title,
          description: enrollment.course.description || '',
          thumbnail: enrollment.course.thumbnail,
          difficulty: 'BEGINNER', // Default, would come from API
          duration: 600, // Default, would come from API
          instructor: enrollment.course.instructor,
          lessonCount: enrollment.course.lessonCount || 10,
          enrolledCount: enrollment.course.enrolledCount || 0,
          enrolledAt: enrollment.enrolledAt,
          status: enrollment.status,
          progress: {
            progress: 0, // Will be calculated from progress context
            completed: false,
            lastAccess: enrollment.enrolledAt
          }
        }))
        setCourses(enrolledCourses)
      } else {
        // Fallback to empty array if no enrolled courses
        setCourses([])
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error)
      setCourses(getDemoCourses())
    } finally {
      setLoading(false)
    }
  }

  const getDemoCourses = () => [
    { 
      id: 'demo1', 
      title: 'Complete React Course', 
      instructor: { name: 'John Instructor', avatar: '' }, 
      duration: 1200,
      difficulty: 'INTERMEDIATE',
      _count: { lessons: 24 },
      description: 'Learn React from scratch',
      progress: { progress: 65, completed: false, lastAccess: new Date().toISOString() }
    },
    { 
      id: 'demo2', 
      title: 'Advanced JavaScript', 
      instructor: { name: 'Jane Instructor', avatar: '' }, 
      duration: 900,
      difficulty: 'ADVANCED',
      _count: { lessons: 18 },
      description: 'Master JavaScript concepts',
      progress: { progress: 30, completed: false, lastAccess: new Date().toISOString() }
    },
    { 
      id: 'demo3', 
      title: 'Web Development Basics', 
      instructor: { name: 'Bob Instructor', avatar: '' }, 
      duration: 600,
      difficulty: 'BEGINNER',
      _count: { lessons: 12 },
      description: 'Learn web fundamentals',
      progress: { progress: 100, completed: true, lastAccess: new Date().toISOString() }
    },
    { 
      id: 'demo4', 
      title: 'Python for Beginners', 
      instructor: { name: 'Alice Instructor', avatar: '' }, 
      duration: 1080,
      difficulty: 'BEGINNER',
      _count: { lessons: 20 },
      description: 'Start your Python journey',
      progress: { progress: 0, completed: false, lastAccess: new Date().toISOString() }
    }
  ]

  const userName = session?.user?.name || 'Demo Student'
  const userEmail = session?.user?.email || 'student@inr99.com'

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    return hours > 0 ? `${hours} hours` : `${minutes} min`
  }

  const getProgressColor = (progress: number) => {
    if (progress === 100) return '#16a34a'
    if (progress > 0) return '#eab308'
    return '#6b7280'
  }

  const getProgressStatus = (progress: number) => {
    if (progress === 100) return 'Completed'
    if (progress > 0) return 'In Progress'
    return 'Not Started'
  }

  const getButtonText = (progress: number) => {
    if (progress === 0) return 'Start Course'
    if (progress === 100) return 'Review'
    return 'Continue'
  }

  // Merge API progress data with courses
  const getCourseProgress = (courseId: string) => {
    const apiProgress = progressData.find(p => p.courseId === courseId)
    return apiProgress?.progress || 0
  }

  if (loading) {
    return (
      <DashboardLayout userRole="student" userInfo={{ name: userName, email: userEmail }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading your courses...</p>
        </div>
      </DashboardLayout>
    )
  }

  const completedCourses = courses.filter(c => (c.progress?.progress || getCourseProgress(c.id)) === 100)
  const inProgressCourses = courses.filter(c => {
    const prog = c.progress?.progress || getCourseProgress(c.id)
    return prog > 0 && prog < 100
  })

  return (
    <DashboardLayout userRole="student" userInfo={{ name: userName, email: userEmail }}>
      <div>
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: '700', 
          color: '#1f2937', 
          marginBottom: '2rem' 
        }}>
          📚 My Courses
        </h1>

        {/* Course Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ea580c' }}>{courses.length}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Enrolled</div>
          </div>
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#16a34a' }}>
              {completedCourses.length}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Completed</div>
          </div>
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#eab308' }}>
              {inProgressCourses.length}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>In Progress</div>
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '3rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              No courses yet
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Start learning by enrolling in a course!
            </p>
            <button
              onClick={() => router.push('/courses')}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#ea580c',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gap: '1.5rem' 
          }}>
            {courses.map(course => {
              const progressValue = course.progress?.progress ?? getCourseProgress(course.id)
              
              return (
                <div 
                  key={course.id}
                  style={{
                    background: 'white',
                    borderRadius: '0.75rem',
                    padding: '2rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ 
                        fontWeight: '700', 
                        fontSize: '1.25rem', 
                        color: '#1f2937', 
                        marginBottom: '0.5rem' 
                      }}>
                        {course.title}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        👨‍🏫 {course.instructor.name}
                      </p>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        ⏱️ {formatDuration(course.duration)} • 📚 {course.lessonCount} lessons
                      </p>
                      {course.enrolledAt && (
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          📅 Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        background: getProgressColor(progressValue),
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '1.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        marginBottom: '0.5rem'
                      }}>
                        {progressValue}% Complete
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {getProgressStatus(progressValue)}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ 
                      width: '100%', 
                      height: '8px', 
                      background: '#f3f4f6', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${progressValue}%`,
                        height: '100%',
                        background: getProgressColor(progressValue),
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => router.push(`/courses/${course.id}`)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: '#ea580c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      {getButtonText(progressValue)}
                    </button>
                    <button
                      onClick={() => router.push(`/courses/${course.id}`)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: 'white',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Login Prompt */}
        {!session?.user && (
          <div style={{ 
            marginTop: '2rem',
            background: '#fff7ed', 
            border: '1px solid #fed7aa',
            borderRadius: '0.75rem', 
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#9a3412', marginBottom: '0.5rem' }}>
              Sign in to track your real progress!
            </h3>
            <p style={{ color: '#9a3412', marginBottom: '1rem' }}>
              Create an account to save your course progress and earn certificates.
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#ea580c',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
