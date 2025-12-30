import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import DashboardLayout from '@/components/DashboardLayout'

// Courses data
const courses = [
  { id: 1, title: 'Complete React Course', instructor: 'John Instructor', duration: '20 hours', progress: 65, color: '#dbeafe' },
  { id: 2, title: 'Advanced JavaScript', instructor: 'Jane Instructor', duration: '15 hours', progress: 30, color: '#f3e8ff' },
  { id: 3, title: 'Web Development Basics', instructor: 'Bob Instructor', duration: '10 hours', progress: 100, color: '#dcfce7' },
  { id: 4, title: 'Python for Beginners', instructor: 'Alice Instructor', duration: '18 hours', progress: 0, color: '#fef3c7' }
]

export default async function StudentOverview() {
  let session = null

  try {
    session = await auth()
  } catch (error) {
    // Continue without session
  }

  if (!session?.user) {
    redirect('/auth/login')
  }

  // Get user data from session
  const userName = session.user.name || 'Student'
  const userEmail = session.user.email || 'student@example.com'

  const profile = {
    name: userName,
    email: userEmail
  }

  const totalCourses = courses.length
  const completedCourses = courses.filter(c => c.progress === 100).length
  const inProgressCourses = courses.filter(c => c.progress > 0 && c.progress < 100).length
  const avgProgress = Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / totalCourses)

  return (
    <DashboardLayout userRole="student" userInfo={profile}>
      <div>
        {/* Welcome Section */}
        <div style={{ 
          background: 'white', 
          borderRadius: '0.75rem', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            color: '#1f2937', 
            marginBottom: '0.5rem' 
          }}>
            Welcome back, {profile.name.split(' ')[0]}! 👋
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
            Here's your learning progress overview
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #ea580c' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Courses</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{totalCourses}</div>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #16a34a' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Completed</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{completedCourses}</div>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #eab308' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>In Progress</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{inProgressCourses}</div>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #3b82f6' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Average Progress</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{avgProgress}%</div>
          </div>
        </div>

        {/* Recent Courses */}
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
            Your Courses
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {courses.map(course => (
              <div 
                key={course.id}
                style={{
                  background: course.color,
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  border: '1px solid rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontWeight: '600', fontSize: '1.125rem', color: '#1f2937', marginBottom: '0.25rem' }}>
                      {course.title}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      by {course.instructor} • {course.duration}
                    </p>
                  </div>
                  <span style={{
                    background: course.progress === 100 ? '#16a34a' : course.progress > 0 ? '#eab308' : '#6b7280',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {course.progress}%
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '6px', 
                  background: 'rgba(0,0,0,0.1)', 
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${course.progress}%`,
                    height: '100%',
                    background: course.progress === 100 ? '#16a34a' : '#ea580c',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}