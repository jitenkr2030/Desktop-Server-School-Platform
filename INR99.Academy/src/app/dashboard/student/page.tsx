"use client"

import { useState, useEffect } from 'react'

interface UserProfile {
  name: string
  email: string
  mobile: string
  location: string
  memberSince: string
  bio: string
}

interface UserStats {
  totalCourses: number
  completedCourses: number
  totalTimeSpent: number
  certificatesEarned: number
  currentStreak: number
  averageProgress: number
}

interface Enrollment {
  id: string
  status: string
  enrolledAt: string
  course: {
    id: string
    title: string
    description: string
    thumbnail: string | null
    instructor: {
      id: string
      name: string
      image: string | null
    }
    lessonCount: number
    enrolledCount: number
  }
}

interface Certificate {
  id: string
  number: string
  course: string
  issuedAt: string
}

export default function StudentDashboard() {
  const [tab, setTab] = useState('dashboard')
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [userRes, statsRes, enrollmentsRes] = await Promise.all([
          fetch('/api/user'),
          fetch('/api/user/stats'),
          fetch('/api/user/enrollments')
        ])

        const userData = await userRes.json()
        const statsData = await statsRes.json()
        const enrollmentsData = await enrollmentsRes.json()

        if (userData.success) {
          setUser(userData.user)
        }

        if (statsData.success) {
          setStats(statsData.stats)
        }

        if (enrollmentsData.success) {
          setEnrollments(enrollmentsData.enrollments)
        }

        // For certificates, we'll use a subset of stats data for now
        // In a real app, we'd have a dedicated certificates API
        if (statsData.stats?.certificatesEarned > 0) {
          setCertificates([
            { id: '1', number: 'CERT-2024-001', course: 'Introduction to Programming', issuedAt: '2024-03-15' },
            { id: '2', number: 'CERT-2024-002', course: 'Web Development Basics', issuedAt: '2024-02-20' }
          ])
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
        setMounted(true)
      }
    }

    fetchDashboardData()
  }, [])

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #ea580c', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #ea580c', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Error Loading Dashboard</h2>
          <p style={{ color: '#6b7280' }}>{error}</p>
        </div>
      </div>
    )
  }

  const userName = user?.name || 'Student'
  const userEmail = user?.email || 'student@example.com'
  const userMobile = user?.mobile || 'Not provided'
  const userLocation = user?.location || 'Not provided'
  const userMemberSince = user?.memberSince || 'Unknown'
  const userBio = user?.bio || 'No bio available'

  const totalCourses = stats?.totalCourses || enrollments.length
  const completedCourses = stats?.completedCourses || enrollments.filter(e => e.status === 'COMPLETED').length
  const avgProgress = stats?.averageProgress || 0
  const certificatesEarned = stats?.certificatesEarned || certificates.length

  const inProgressCourses = enrollments.filter(e => e.status === 'ACTIVE')
  const continueLearningCourse = inProgressCourses[0]

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'profile', label: 'Profile' },
    { id: 'courses', label: 'Courses' },
    { id: 'certificates', label: 'Certificates' }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      {/* Navigation Bar */}
      <div style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            {/* User Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>
                {userName.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#1f2937' }}>{userName}</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{userEmail}</div>
              </div>
            </div>

            {/* Tab Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {tabs.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setTab(t.id)
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    background: tab === t.id ? '#ea580c' : '#f3f4f6',
                    color: tab === t.id ? 'white' : '#374151',
                    transition: 'all 0.2s'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Logout */}
            <a href="/" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', background: 'white', color: '#374151', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
              Logout
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        
        {/* DASHBOARD TAB */}
        {tab === 'dashboard' && (
          <div>
            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Welcome back, {userName}!</h1>
              <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Continue your learning journey and track your progress</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total Courses', value: totalCourses, icon: '📚' },
                { label: 'Completed', value: completedCourses, icon: '✅' },
                { label: 'In Progress', value: inProgressCourses.length, icon: '📖' },
                { label: 'Avg Progress', value: `${Math.round(avgProgress)}%`, icon: '📊' }
              ].map(stat => (
                <div key={stat.label} style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{stat.label}</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginTop: '0.25rem' }}>{stat.value}</p>
                    </div>
                    <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            {continueLearningCourse && (
              <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #fed7aa' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#9a3412', marginBottom: '1rem' }}>Continue Learning</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ aspectRatio: '16/9', background: '#dbeafe', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>📚</div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>{continueLearningCourse.course.title}</h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>By {continueLearningCourse.course.instructor.name} • {continueLearningCourse.course.lessonCount} lessons</p>
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Progress</span>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{Math.round(avgProgress)}% complete</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px' }}>
                        <div style={{ width: `${avgProgress}%`, height: '100%', background: '#ea580c', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                    <a 
                      href={`/courses/${continueLearningCourse.course.id}`}
                      style={{ display: 'inline-block', marginTop: '1rem', background: '#ea580c', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', fontWeight: '600', cursor: 'pointer', textDecoration: 'none' }}
                    >
                      Continue Learning
                    </a>
                  </div>
                </div>
              </div>
            )}

            {enrollments.length === 0 && (
              <div style={{ background: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>No courses yet</h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Start your learning journey by enrolling in a course</p>
                <a 
                  href="/courses"
                  style={{ display: 'inline-block', background: '#ea580c', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: '600' }}
                >
                  Browse Courses
                </a>
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {tab === 'profile' && (
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>My Profile</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              <div style={{ textAlign: 'center', padding: '2rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>
                  {userName.charAt(0)}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>{userName}</h3>
                <p style={{ color: '#6b7280' }}>{userEmail}</p>
                <span style={{ display: 'inline-block', marginTop: '0.5rem', background: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '600' }}>Student</span>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  { label: 'Name', value: userName, icon: '👤' },
                  { label: 'Email', value: userEmail, icon: '📧' },
                  { label: 'Mobile', value: userMobile, icon: '📱' },
                  { label: 'Location', value: userLocation, icon: '📍' },
                  { label: 'Member Since', value: userMemberSince, icon: '📅' },
                  { label: 'Bio', value: userBio, icon: '✍️' }
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{item.label}</p>
                      <p style={{ fontWeight: '500', color: '#1f2937' }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {tab === 'courses' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>My Courses</h2>
            
            {enrollments.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>You haven&apos;t enrolled in any courses yet</p>
                <a 
                  href="/courses"
                  style={{ display: 'inline-block', background: '#ea580c', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: '600' }}
                >
                  Browse Courses
                </a>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {enrollments.map(enrollment => (
                  <div key={enrollment.id} style={{ background: 'white', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ aspectRatio: '16/9', background: enrollment.status === 'COMPLETED' ? '#dcfce7' : enrollment.status === 'ACTIVE' ? '#dbeafe' : '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                      {enrollment.status === 'COMPLETED' ? '🎉' : '📚'}
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>{enrollment.course.title}</h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>{enrollment.course.instructor.name} • {enrollment.course.lessonCount} lessons</p>
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#374151' }}>Progress</span>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{enrollment.status === 'COMPLETED' ? 100 : enrollment.status === 'ACTIVE' ? Math.round(avgProgress) : 0}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#e5e7eb', borderRadius: '3px' }}>
                          <div style={{ width: `${enrollment.status === 'COMPLETED' ? 100 : enrollment.status === 'ACTIVE' ? Math.round(avgProgress) : 0}%`, height: '100%', background: enrollment.status === 'COMPLETED' ? '#22c55e' : '#ea580c', borderRadius: '3px' }}></div>
                        </div>
                      </div>
                      <a 
                        href={`/courses/${enrollment.course.id}`}
                        style={{ display: 'block', width: '100%', padding: '0.5rem', textAlign: 'center', background: enrollment.status === 'COMPLETED' ? '#22c55e' : '#ea580c', color: 'white', borderRadius: '0.375rem', border: 'none', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', textDecoration: 'none' }}
                      >
                        {enrollment.status === 'COMPLETED' ? 'Review Course' : 'Continue Learning'}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CERTIFICATES TAB */}
        {tab === 'certificates' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>My Certificates</h2>
            
            {certificates.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Complete courses to earn certificates</p>
                <a 
                  href="/courses"
                  style={{ display: 'inline-block', background: '#ea580c', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: '600' }}
                >
                  Browse Courses
                </a>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {certificates.map(cert => (
                  <div key={cert.id} style={{ background: 'white', borderRadius: '0.75rem', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: '#dcfce7', color: '#166534' }}>VERIFIED</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#6b7280' }}>✓ Verified</span>
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>{cert.course}</h3>
                    <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ color: '#6b7280' }}>Certificate:</span>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#374151' }}>{cert.number}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#6b7280' }}>Issued:</span>
                        <span style={{ color: '#374151' }}>{cert.issuedAt}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="button" style={{ flex: 1, padding: '0.5rem', background: 'white', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', cursor: 'pointer' }}>Download</button>
                      <button type="button" style={{ flex: 1, padding: '0.5rem', background: 'white', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', cursor: 'pointer' }}>Verify</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
