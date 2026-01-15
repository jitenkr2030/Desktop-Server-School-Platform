import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import Link from 'next/link'
import { BookOpen, Clock, CheckCircle, BarChart3, PlayCircle, TrendingUp } from 'lucide-react'

// Demo data for dashboard
const demoCourses = [
  {
    id: 'course_1',
    title: 'Complete React Course - From Zero to Hero',
    instructor: 'John Instructor',
    progress: 65,
    timeSpent: 320,
    completed: false,
    thumbnail: undefined
  },
  {
    id: 'course_2',
    title: 'Advanced JavaScript Mastery',
    instructor: 'Jane Instructor',
    progress: 30,
    timeSpent: 180,
    completed: false,
    thumbnail: undefined
  },
  {
    id: 'course_3',
    title: 'Web Development Basics',
    instructor: 'Bob Instructor',
    progress: 100,
    timeSpent: 600,
    completed: true,
    thumbnail: undefined
  }
]

export default async function DashboardPage() {
  const session = await auth()
  
  // If not authenticated, redirect to login
  if (!session?.user) {
    redirect('/auth/login')
  }
  
  const user = session.user
  const userName = (user as any).name || user.name || 'Learner'
  const userEmail = user.email || ''
  
  // Calculate stats
  const totalCourses = demoCourses.length
  const completedCourses = demoCourses.filter(c => c.completed).length
  const totalTimeSpent = demoCourses.reduce((sum, c) => sum + c.timeSpent, 0)
  const averageProgress = Math.round(demoCourses.reduce((sum, c) => sum + c.progress, 0) / totalCourses)
  const currentStreak = Math.floor(Math.random() * 7) + 1
  
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }
  
  const continueCourse = demoCourses.find(c => !c.completed && c.progress > 0)

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
            Welcome back, {userName}! 👋
          </h1>
          <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '1.125rem' }}>
            Continue your learning journey and track your progress
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Streak Card */}
        <div style={{ 
          background: 'white', 
          borderRadius: '0.75rem', 
          padding: '1.5rem', 
          marginBottom: '2rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #fed7aa'
        }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '50%', 
            background: '#fef3c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp style={{ width: '24px', height: '24px', color: '#ea580c' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Current Streak</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ea580c' }}>
              {currentStreak} days
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          {/* Total Courses */}
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Total Courses</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', margin: '0.5rem 0 0 0' }}>{totalCourses}</p>
              </div>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '0.5rem', 
                background: '#dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BookOpen style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Completed</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', margin: '0.5rem 0 0 0' }}>{completedCourses}</p>
              </div>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '0.5rem', 
                background: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle style={{ width: '24px', height: '24px', color: '#22c55e' }} />
              </div>
            </div>
          </div>

          {/* Time Spent */}
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Time Spent</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', margin: '0.5rem 0 0 0' }}>{formatDuration(totalTimeSpent)}</p>
              </div>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '0.5rem', 
                background: '#f3e8ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock style={{ width: '24px', height: '24px', color: '#a855f7' }} />
              </div>
            </div>
          </div>

          {/* Average Progress */}
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Avg Progress</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', margin: '0.5rem 0 0 0' }}>{averageProgress}%</p>
              </div>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '0.5rem', 
                background: '#ffedd5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BarChart3 style={{ width: '24px', height: '24px', color: '#ea580c' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Continue Learning */}
        {continueCourse && (
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            border: '1px solid #fed7aa'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#9a3412', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlayCircle style={{ width: '24px', height: '24px' }} />
              Continue Learning
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ 
                aspectRatio: '16/9', 
                background: '#dbeafe', 
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem'
              }}>
                📚
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  {continueCourse.title}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  By {continueCourse.instructor}
                </p>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Progress</span>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{continueCourse.progress}% complete</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px' }}>
                    <div style={{ width: `${continueCourse.progress}%`, height: '100%', background: '#ea580c', borderRadius: '4px' }}></div>
                  </div>
                </div>
                <Link 
                  href={`/courses/${continueCourse.id}`}
                  style={{
                    display: 'inline-block',
                    background: '#ea580c',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.875rem'
                  }}
                >
                  Continue Learning
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* My Courses Section */}
        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
            My Courses
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {demoCourses.map((course) => (
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
                    <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                      {course.title}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      by {course.instructor}
                    </p>
                  </div>
                  <span style={{
                    background: course.completed ? '#22c55e' : course.progress > 0 ? '#eab308' : '#6b7280',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
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
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
