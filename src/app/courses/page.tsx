"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { NewNavigation } from '@/components/new-navigation'
import { 
  courses, 
  getCoursesByCategory, 
  getAllCategories, 
  getFeaturedCourses,
  searchCourses,
  type Course 
} from '@/lib/course-data'

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const categories = getAllCategories()
  
  // Use static data - no loading state needed
  const allCourses = useMemo(() => 
    courses.filter(c => c.isActive), 
    []
  )
  
  const featuredCourses = useMemo(() => 
    getFeaturedCourses(), 
    []
  )

  const filteredCourses = useMemo(() => {
    let result = allCourses

    // Filter by search term
    if (searchTerm) {
      result = searchCourses(searchTerm)
    }

    // Filter by difficulty
    if (selectedDifficulty) {
      const difficultyMap: Record<string, string[]> = {
        'BEGINNER': ['beginner'],
        'INTERMEDIATE': ['intermediate'],
        'ADVANCED': ['advanced']
      }
      const targetDifficulties = difficultyMap[selectedDifficulty] || []
      result = result.filter(course => 
        targetDifficulties.includes(course.difficulty)
      )
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter(course => course.category === selectedCategory)
    }

    return result
  }, [allCourses, searchTerm, selectedDifficulty, selectedCategory])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return { bg: '#dcfce7', text: '#16a34a' }
      case 'intermediate': return { bg: '#fef3c7', text: '#d97706' }
      case 'advanced': return { bg: '#fee2e2', text: '#dc2626' }
      default: return { bg: '#f3f4f6', text: '#6b7280' }
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  // Calculate stats from actual data
  const totalCourses = allCourses.length
  const totalLessons = allCourses.reduce((sum, c) => sum + c.lessonCount, 0)
  const uniqueInstructors = new Set(allCourses.map(c => c.instructor.id)).size

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NewNavigation />

      <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#f9fafb' }}>
        {/* Header */}
        <div style={{ background: 'white', padding: '3rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.75rem' }}>
                Explore Our Course Library
              </h1>
              <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
                Discover courses designed for Indian learners with practical skills and real-world applications.
              </p>
            </div>

            {/* Search Bar */}
            <div style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search courses, instructors, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 3rem',
                    fontSize: '1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                background: '#f3f4f6',
                padding: '0.25rem',
                borderRadius: '0.5rem',
                display: 'inline-flex'
              }}>
                <button
                  style={{
                    padding: '0.625rem 1.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    border: 'none',
                    background: 'white',
                    color: '#111827',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s'
                  }}
                >
                  📚 All Courses
                </button>
                <Link
                  href="/learning-paths"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 1.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    border: 'none',
                    background: 'transparent',
                    color: '#6b7280',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  🎯 Learning Paths
                  <span style={{
                    background: '#ea580c',
                    color: 'white',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.625rem',
                    fontWeight: '600'
                  }}>
                    NEW
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          {/* Filters */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>
              Filters:
            </span>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                background: 'white',
                cursor: 'pointer',
                minWidth: '150px'
              }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>

            {(selectedDifficulty || searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSelectedDifficulty('')
                  setSearchTerm('')
                  setSelectedCategory('')
                }}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                Clear Filters
              </button>
            )}

            <div style={{ marginLeft: 'auto', color: '#6b7280', fontSize: '0.875rem' }}>
              {filteredCourses.length} courses found
            </div>
          </div>

          {/* Content */}
          {filteredCourses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '0.75rem' }}>
              <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>No courses found matching your criteria.</p>
              <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}>
              {filteredCourses.map((course) => {
                const diffColors = getDifficultyColor(course.difficulty)
                const categoryInfo = categories.find(c => c.id === course.category)
                
                return (
                  <div
                    key={course.id}
                    style={{
                      background: 'white',
                      borderRadius: '0.75rem',
                      overflow: 'hidden',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      aspectRatio: '16/9',
                      background: '#dbeafe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem',
                      position: 'relative'
                    }}>
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '4rem' }}>📚</span>
                      )}
                      {/* Price Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        background: course.price === 0 ? '#16a34a' : '#ea580c',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        {course.price === 0 ? 'FREE' : `₹${course.price}`}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                        {categoryInfo && (
                          <span style={{
                            background: '#e0e7ff',
                            color: '#4f46e5',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {categoryInfo.icon} {categoryInfo.name}
                          </span>
                        )}
                        <span style={{
                          background: diffColors.bg,
                          color: diffColors.text,
                          padding: '0.25rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                        </span>
                      </div>
                      
                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '0.5rem'
                      }}>
                        {course.title}
                      </h3>
                      
                      <p style={{
                        color: '#6b7280',
                        fontSize: '0.875rem',
                        marginBottom: '1rem',
                        lineHeight: '1.5',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {course.description}
                      </p>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '1rem',
                        borderTop: '1px solid #f3f4f6'
                      }}>
                        <div>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            By {course.instructor.name}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            {formatDuration(course.totalDuration)} • {course.lessonCount} lessons
                          </p>
                        </div>
                        <Link href={`/courses/${course.id}`} style={{
                          display: 'inline-block',
                          background: '#ea580c',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          textDecoration: 'none',
                          fontWeight: '600',
                          fontSize: '0.875rem'
                        }}>
                          View Course
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div style={{ background: 'white', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              textAlign: 'center'
            }}>
              {[
                { icon: '📚', number: totalCourses.toString(), label: 'Expert Courses', color: '#ea580c' },
                { icon: '🎯', number: '10+', label: 'Learning Categories', color: '#16a34a' },
                { icon: '⏱️', number: `${totalLessons}+`, label: 'Video Lessons', color: '#2563eb' },
                { icon: '👨‍🏫', number: uniqueInstructors.toString(), label: 'Expert Instructors', color: '#9333ea' }
              ].map((stat, index) => (
                <div key={index}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: stat.color, marginBottom: '0.25rem' }}>
                    {stat.number}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#111827',
        color: 'white',
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            © 2024 INR99.Academy - India's Learning Infrastructure
          </p>
        </div>
      </footer>
    </div>
  )
}
