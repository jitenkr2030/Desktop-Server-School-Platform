"use client"

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { NewNavigation } from '@/components/new-navigation'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  isFeatured: boolean
  subcategories?: Array<{
    id: string
    name: string
    slug: string
  }>
}

interface Instructor {
  id: string
  name: string
  title: string | null
  avatar: string | null
  expertise: string
}

interface LearningPath {
  id: string
  title: string
  color: string
  icon: string
}

interface Pricing {
  type: string
  price: number
  currency: string
  period: string
  description: string
}

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string | null
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  duration: number
  instructor: Instructor
  learningPath: LearningPath | null
  lessonCount: number
  assessmentCount: number
  createdAt: string
  pricing: Pricing
}

interface CoursesResponse {
  success: boolean
  courses: Course[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    }
    fetchCategories()
  }, [])

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (selectedCategory) params.set('categoryId', selectedCategory)
        if (selectedDifficulty) params.set('difficulty', selectedDifficulty)
        params.set('limit', '100')

        const response = await fetch(`/api/courses?${params.toString()}`)
        if (response.ok) {
          const data: CoursesResponse = await response.json()
          setCourses(data.courses)
        } else {
          setError('Failed to load courses')
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err)
        setError('Failed to load courses')
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [selectedCategory, selectedDifficulty])

  const filteredCourses = useMemo(() => {
    let result = courses

    // Filter by search term (client-side search)
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(course =>
        course.title.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term) ||
        (course.instructor.name && course.instructor.name.toLowerCase().includes(term))
      )
    }

    return result
  }, [courses, searchTerm])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case 'BEGINNER': return { bg: '#dcfce7', text: '#16a34a' }
      case 'INTERMEDIATE': return { bg: '#fef3c7', text: '#d97706' }
      case 'ADVANCED': return { bg: '#fee2e2', text: '#dc2626' }
      default: return { bg: '#f3f4f6', text: '#6b7280' }
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  // Get thumbnail path - maps course ID to thumbnail file
  const getThumbnailPath = (courseId: string, currentThumbnail: string | null) => {
    // If thumbnail already has full path and file exists, use it
    if (currentThumbnail && (currentThumbnail.startsWith('/assets/') || currentThumbnail.startsWith('/images/'))) {
      return currentThumbnail
    }
    
    // Map course IDs to their thumbnail files
    const thumbnailMap: Record<string, string> = {
      // Confusion Removers courses
      'cr_english_mastery': '/assets/courses/english-communication.svg',
      'cr_indian_constitution': '/assets/courses/indian-constitution.svg',
      'cr_upi': '/assets/courses/cr_upi.svg',
      'cr_digital': '/assets/courses/cr_digital.svg',
      'cr_fraud': '/assets/courses/cr_fraud.svg',
      'cr_bulk': '/assets/courses/cr_bulk.svg',
      'cr_community': '/assets/courses/cr_community.svg',
      'cr_foodwork': '/assets/courses/cr_foodwork.svg',
      'cr_money': '/assets/courses/cr_money.svg',
      'cr_gov': '/assets/courses/cr_gov.svg',
      'cr_english': '/assets/courses/cr_english.svg',
      
      // Additional courses
      'python-masterclass': '/assets/courses/python-masterclass.svg',
      'data-science-python': '/assets/courses/data-science-python.svg',
      'web-development-bootcamp': '/assets/courses/web-development-bootcamp.svg',
      'ui-ux-design-masterclass': '/assets/courses/ui-ux-design-masterclass.svg',
      'digital-marketing-complete': '/assets/courses/digital-marketing-complete.svg',
      'personal-finance-mastery': '/assets/courses/personal-finance-mastery.svg',
      'stock-market-fundamentals': '/assets/courses/stock-market-fundamentals.svg',
      'indian-constitution-citizenship': '/assets/courses/indian-constitution-citizenship.svg',
      'excel-mastery': '/assets/courses/excel-mastery.svg',
      'cyber-safety-awareness': '/assets/courses/cyber-safety-awareness.svg',
      'job-prep-complete': '/assets/courses/job-prep-complete.svg',
      'startup-foundation': '/assets/courses/startup-foundation.svg',
      'meditation-mindfulness': '/assets/courses/meditation-mindfulness.svg',
      'bcom-financial-accounting': '/assets/courses/bcom-financial-accounting.svg',
      'class10-mathematics': '/assets/courses/class10-mathematics.svg',
      'course_public_speaking': '/assets/courses/public-speaking.svg',
      'career14': '/assets/courses/public-speaking.svg',
    }
    
    // Check if we have a direct mapping
    if (thumbnailMap[courseId]) {
      return thumbnailMap[courseId]
    }
    
    // Try to find a matching thumbnail based on partial ID match
    const availableThumbnails = Object.values(thumbnailMap)
    for (const thumb of availableThumbnails) {
      const thumbName = thumb.split('/').pop()?.replace('.svg', '')
      if (thumbName && courseId.includes(thumbName)) {
        return thumb
      }
    }
    
    // Return original thumbnail path if nothing matches
    return currentThumbnail
  }

  // Calculate stats from actual data
  const totalCourses = courses.length
  const totalLessons = courses.reduce((sum, c) => sum + c.lessonCount, 0)
  const uniqueInstructors = new Set(courses.map(c => c.instructor.id)).size

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
                  Search
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
                  All Courses
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
                  Learning Paths
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
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '0.75rem' }}>
              <div style={{ color: '#6b7280', fontSize: '1.125rem' }}>Loading courses...</div>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '0.75rem' }}>
              <p style={{ color: '#dc2626', fontSize: '1.125rem' }}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  background: '#ea580c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
            </div>
          ) : filteredCourses.length === 0 ? (
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
                const learningPathInfo = course.learningPath

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
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {(() => {
                        const thumbnailPath = getThumbnailPath(course.id, course.thumbnail)
                        if (thumbnailPath) {
                          return (
                            <img 
                              src={thumbnailPath} 
                              alt={course.title}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                opacity: 0.9
                              }}
                              onError={(e) => {
                                // If image fails, show emoji
                                e.currentTarget.style.display = 'none'
                                e.currentTarget.parentElement!.innerHTML = '<span style="font-size: 4rem;">📚</span>'
                              }}
                            />
                          )
                        }
                        return <span style={{ fontSize: '4rem' }}>📚</span>
                      })()}
                    </div>

                    {/* Content */}
                    <div style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                        {learningPathInfo && (
                          <span style={{
                            background: '#e0e7ff',
                            color: '#4f46e5',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {learningPathInfo.icon} {learningPathInfo.title}
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
                            {formatDuration(course.duration)} • {course.lessonCount} lessons
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
                { icon: 'Book', number: totalCourses.toString(), label: 'Expert Courses', color: '#ea580c' },
                { icon: 'Target', number: '10+', label: 'Learning Categories', color: '#16a34a' },
                { icon: 'Clock', number: `${totalLessons}+`, label: 'Video Lessons', color: '#2563eb' },
                { icon: 'Teacher', number: uniqueInstructors.toString(), label: 'Expert Instructors', color: '#9333ea' }
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
            © 2026 INR99.Academy - India's Learning Infrastructure
          </p>
        </div>
      </footer>
    </div>
  )
}
