import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import Link from 'next/link'

// Demo course data - no API calls needed
const demoCourses = [
  { id: '1', title: 'Complete React Course', instructor: 'John Instructor', progress: 65, completed: false },
  { id: '2', title: 'Advanced JavaScript', instructor: 'Jane Instructor', progress: 30, completed: false },
  { id: '3', title: 'Web Development Basics', instructor: 'Bob Instructor', progress: 100, completed: true },
]

export default async function StandaloneDashboard() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  const user = session.user
  const userName = (user as { name?: string }).name || user.name || 'Learner'
  const userEmail = user.email || ''

  // Deterministic streak based on email (no Math.random)
  const streak = userEmail.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 7 + 1

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      {/* Inline Navigation - No React components that could cause re-renders */}
      <nav style={{
        background: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{
              background: '#ea580c',
              color: 'white',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>INR99.Academy</span>
          </Link>

          {/* User info from server session - no client-side sync needed */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#ea580c',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>{userName}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{userEmail}</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ paddingTop: '64px' }}>
        {/* Header */}
        <div style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
              Welcome back, {userName}!
            </h1>
            <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '1.125rem' }}>
              Continue your learning journey
            </p>

            {/* Streak */}
            <div style={{
              marginTop: '1.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: '#fff7ed',
              border: '1px solid #fed7aa',
              borderRadius: '0.5rem',
              padding: '0.75rem 1rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#ffedd5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Current Streak</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ea580c' }}>{streak} days</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Total Courses</p>
                  <p style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', margin: '0.5rem 0 0 0' }}>{demoCourses.length}</p>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '0.5rem', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Completed</p>
                  <p style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', margin: '0.5rem 0 0 0' }}>{demoCourses.filter(c => c.completed).length}</p>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '0.5rem', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Avg Progress</p>
                  <p style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', margin: '0.5rem 0 0 0' }}>
                    {Math.round(demoCourses.reduce((sum, c) => sum + c.progress, 0) / demoCourses.length)}%
                  </p>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '0.5rem', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Courses */}
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>My Courses</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {demoCourses.map(course => (
                <div
                  key={course.id}
                  style={{
                    background: course.completed ? '#f0fdf4' : '#f9fafb',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    border: `1px solid ${course.completed ? '#bbf7d0' : '#e5e7eb'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>{course.title}</h3>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>by {course.instructor}</p>
                    </div>
                    <span style={{
                      background: course.completed ? '#22c55e' : '#f59e0b',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {course.progress}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${course.progress}%`,
                      height: '100%',
                      background: course.completed ? '#22c55e' : '#ea580c',
                      borderRadius: '3px'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
