"use client"

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { useSession } from 'next-auth/react'

interface Course {
  id: string
  title: string
  description: string
  isActive: boolean
  _count: {
    lessons: number
    progress: number
  }
}

interface Student {
  id: string
  name: string
  email: string
  enrolledCourses: number
  lastActive: string
}

interface Stats {
  totalCourses: number
  publishedCourses: number
  pendingCourses: number
  totalStudents: number
  totalEarnings: number
  averageRating: number
}

export default function InstructorOverview() {
  const { data: session } = useSession()
  const [courses, setCourses] = useState<Course[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  
  // Form state
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: ''
  })

  useEffect(() => {
    fetchInstructorData()
  }, [])

  const fetchInstructorData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch('/api/instructor/stats')
      const statsData = await statsRes.json()
      if (statsData.success) {
        setStats(statsData.stats)
      }

      // Fetch courses
      const coursesRes = await fetch('/api/instructor/courses')
      const coursesData = await coursesRes.json()
      if (coursesData.success) {
        setCourses(coursesData.courses)
      }

      // Fetch students
      const studentsRes = await fetch('/api/instructor/students')
      const studentsData = await studentsRes.json()
      if (studentsData.success) {
        setStudents(studentsData.students)
      }
    } catch (error) {
      console.error('Error fetching instructor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const res = await fetch('/api/instructor/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      })

      const data = await res.json()

      if (data.success) {
        setShowCreateModal(false)
        setNewCourse({ title: '', description: '' })
        fetchInstructorData() // Refresh data
      } else {
        alert(data.error || 'Failed to create course')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setCreating(false)
    }
  }

  const userName = session?.user?.name || 'Instructor'
  const userEmail = session?.user?.email || ''

  if (loading) {
    return (
      <DashboardLayout userRole="instructor" userInfo={{ name: userName, email: userEmail }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  const avgStudentsPerCourse = stats?.totalCourses 
    ? Math.round(stats.totalStudents / stats.totalCourses) 
    : 0

  return (
    <DashboardLayout userRole="instructor" userInfo={{ name: userName, email: userEmail }}>
      <div>
        {/* Welcome Section */}
        <div style={{ 
          background: 'white', 
          borderRadius: '0.75rem', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '1.875rem', 
              fontWeight: '700', 
              color: '#1f2937', 
              marginBottom: '0.5rem' 
            }}>
              Welcome back, {userName.split(' ')[0]}! 👨‍🏫
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              Here's your teaching overview and student progress
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#9333ea',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            + Create New Course
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #9333ea' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Courses</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{stats?.totalCourses || 0}</div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a' }}>{stats?.publishedCourses || 0} published</div>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #16a34a' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Students</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{stats?.totalStudents || 0}</div>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #3b82f6' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Avg Students/Course</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{avgStudentsPerCourse}</div>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #ea580c' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Earnings</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>₹{stats?.totalEarnings?.toLocaleString() || 0}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>
          {/* My Courses */}
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '2rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#1f2937', 
              marginBottom: '1.5rem' 
            }}>
              My Courses ({courses.length})
            </h2>
            {courses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <p>No courses yet. Create your first course!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {courses.map(course => (
                  <div 
                    key={course.id}
                    style={{
                      background: '#f8fafc',
                      borderRadius: '0.5rem',
                      padding: '1.5rem',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ fontWeight: '600', fontSize: '1.125rem', color: '#1f2937', marginBottom: '0.25rem' }}>
                          {course.title}
                        </h3>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          👥 {course._count.progress} students • 📚 {course._count.lessons} lessons
                        </p>
                      </div>
                      <span style={{
                        background: course.isActive ? '#16a34a' : '#eab308',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {course.isActive ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{
                        padding: '0.5rem 1rem',
                        background: '#9333ea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}>
                        View Details
                      </button>
                      <button style={{
                        padding: '0.5rem 1rem',
                        background: 'white',
                        color: '#6b7280',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}>
                        Edit Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Student Activity */}
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '2rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#1f2937', 
              marginBottom: '1.5rem' 
            }}>
              Recent Students ({students.length})
            </h2>
            {students.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <p>No students enrolled yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {students.slice(0, 5).map((student, index) => (
                  <div 
                    key={student.id || index}
                    style={{
                      background: '#f8fafc',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                          {student.name}
                        </h3>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          📚 {student.enrolledCourses} course(s) enrolled
                        </p>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        {new Date(student.lastActive).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
              Create New Course
            </h2>
            <form onSubmit={handleCreateCourse}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Course Title
                </label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Description
                </label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#9333ea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontWeight: '500',
                    cursor: creating ? 'not-allowed' : 'pointer',
                    opacity: creating ? 0.7 : 1
                  }}
                >
                  {creating ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
