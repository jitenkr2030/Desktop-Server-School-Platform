"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface LearningStats {
  totalCoursesEnrolled: number
  completedCourses: number
  totalTimeSpent: number
  averageScore: number
  totalBadges: number
}

interface Badge {
  id: string
  badge: {
    id: string
    name: string
    description: string
    icon?: string
    color?: string
  }
  earnedAt: string
}

interface TimelineEvent {
  id: string
  type: 'course_completed' | 'course_progress' | 'assessment_completed' | 'badge_earned'
  title: string
  description: string
  timestamp: string
  data: any
}

interface RecentActivity {
  id: string
  course: {
    id: string
    title: string
    thumbnail?: string
    difficulty: string
    learningPath?: {
      id: string
      title: string
      color: string
    }
  }
  progress: number
  timeSpent: number
  completed: boolean
  lastAccess: string
}

interface LearningLedger {
  stats: LearningStats
  recentActivity: RecentActivity[]
  badges: Badge[]
  timeline: TimelineEvent[]
}

export default function LearningLedgerPage() {
  const { data: session, status } = useSession()
  const [ledgerData, setLedgerData] = useState<LearningLedger | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'courses' | 'assessments' | 'badges'>('all')

  const user = session?.user
  const isAuthenticated = status === 'authenticated'

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchLearningLedger()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  const fetchLearningLedger = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await fetch(`/api/learning-ledger`)
      const data = await response.json()

      if (data.success) {
        setLedgerData(data.learningLedger)
      }
    } catch (error) {
      console.log('Failed to fetch learning ledger')
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'course_completed':
        return '✅'
      case 'course_progress':
        return '📚'
      case 'assessment_completed':
        return '🎯'
      case 'badge_earned':
        return '🏆'
      default:
        return '⭐'
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'course_completed':
        return { bg: '#dcfce7', border: '#86efac' }
      case 'course_progress':
        return { bg: '#dbeafe', border: '#93c5fd' }
      case 'assessment_completed':
        return { bg: '#f3e8ff', border: '#c4b5fd' }
      case 'badge_earned':
        return { bg: '#fef9c3', border: '#fde047' }
      default:
        return { bg: '#f3f4f6', border: '#d1d5db' }
    }
  }

  const filteredTimeline = ledgerData?.timeline.filter(event => {
    if (filter === 'all') return true
    if (filter === 'courses') return event.type.includes('course')
    if (filter === 'assessments') return event.type === 'assessment_completed'
    if (filter === 'badges') return event.type === 'badge_earned'
    return true
  }) || []

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f9fafb',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          border: '4px solid #f97316', 
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f9fafb',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: '#f3f4f6', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2.5rem'
          }}>
            📊
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            Authentication Required
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Please log in to view your learning ledger
          </p>
          <Link href="/auth/login" style={{
            display: 'inline-block',
            background: '#ea580c',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  if (!ledgerData) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f9fafb',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: '#f3f4f6', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2.5rem'
          }}>
            📊
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            No learning data found
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Start learning to build your skill history
          </p>
          <Link href="/courses" style={{
            display: 'inline-block',
            background: '#ea580c',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            Browse Courses
          </Link>
        </div>
      </div>
    )
  }

  const { stats, recentActivity, badges, timeline } = ledgerData

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '2rem' }}>📊</span>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>
                Learning Ledger
              </h1>
            </div>
            <p style={{ fontSize: '1rem', color: '#6b7280' }}>
              Your complete skill history and learning journey timeline
            </p>
          </div>

          {/* Stats Overview */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📚</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{stats.totalCoursesEnrolled}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Courses</div>
            </div>

            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>✅</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{stats.completedCourses}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Completed</div>
            </div>

            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>⏱️</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{formatDuration(stats.totalTimeSpent)}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Time Spent</div>
            </div>

            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🎯</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{stats.averageScore}%</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Avg Score</div>
            </div>

            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center', gridColumn: 'span 2' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🏆</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{stats.totalBadges}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Badges</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Filter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>Learning Timeline</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                background: 'white'
              }}
            >
              <option value="all">All Events</option>
              <option value="courses">Courses</option>
              <option value="assessments">Assessments</option>
              <option value="badges">Badges</option>
            </select>
          </div>
        </div>

        {/* Timeline */}
        {filteredTimeline.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredTimeline.map((event, index) => {
              const eventColor = getEventColor(event.type)
              return (
                <div key={event.id} style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: eventColor.bg,
                      border: `2px solid ${eventColor.border}`,
                      fontSize: '1.25rem'
                    }}>
                      {getEventIcon(event.type)}
                    </div>
                    {index < filteredTimeline.length - 1 && (
                      <div style={{ width: '2px', flex: 1, background: '#e5e7eb', marginTop: '0.5rem' }}></div>
                    )}
                  </div>
                  
                  <div style={{ 
                    flex: 1, 
                    background: 'white', 
                    borderRadius: '0.5rem', 
                    border: `1px solid ${eventColor.border}`,
                    padding: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>{event.title}</h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem', lineHeight: '1.5' }}>{event.description}</p>
                        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                          <span>{formatDate(event.timestamp)}</span>
                          <span>•</span>
                          <span>{formatRelativeTime(event.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'white', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>No events found</h3>
            <p style={{ color: '#6b7280' }}>Try adjusting your filter or start learning to see your timeline.</p>
          </div>
        )}

        {/* Badges Section */}
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>Skill Badges</h2>
          
          {badges.length > 0 ? (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              {badges.map((badge) => (
                <div 
                  key={badge.id}
                  style={{ 
                    background: 'white',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
                >
                  <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%', 
                    background: badge.badge.color || '#fef9c3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    fontSize: '2rem'
                  }}>
                    {badge.badge.icon || '🏅'}
                  </div>
                  <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>{badge.badge.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem', lineHeight: '1.4' }}>{badge.badge.description}</p>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    Earned on {formatDate(badge.earnedAt)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'white', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>No badges earned yet</h3>
              <p style={{ color: '#6b7280' }}>Complete courses and assessments to earn skill badges.</p>
            </div>
          )}
        </div>

        {/* Recent Activity Section */}
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>Recent Activity</h2>
          
          {recentActivity.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id}
                  style={{ 
                    background: 'white',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    background: '#f3f4f6',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0
                  }}>
                    📚
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>{activity.course.title}</h3>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <span>⏱️ {formatDuration(activity.timeSpent)}</span>
                      <span>{activity.completed ? '✅ Completed' : `📖 ${Math.round(activity.progress)}%`}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      Last accessed: {formatDate(activity.lastAccess)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'white', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>No recent activity</h3>
              <p style={{ color: '#6b7280' }}>Start learning to see your activity history.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
