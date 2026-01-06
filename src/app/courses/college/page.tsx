"use client"

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { NewNavigation } from '@/components/new-navigation'

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string | null
  difficulty: string
  duration: number
  lessonCount: number
  instructor: {
    name: string
  }
}

interface ApiResponse {
  success: boolean
  course: Course
}

// List of major Indian universities grouped by region
const UNIVERSITY_REGIONS = [
  {
    region: 'North India',
    universities: [
      { id: 'du', name: 'Delhi University (DU)', state: 'Delhi' },
      { id: 'jnu', name: 'Jawaharlal Nehru University (JNU)', state: 'Delhi' },
      { id: 'bhu', name: 'Banaras Hindu University (BHU)', state: 'Uttar Pradesh' },
      { id: 'aligarh', name: 'Aligarh Muslim University (AMU)', state: 'Uttar Pradesh' },
      { id: 'lucknow', name: 'Lucknow University', state: 'Uttar Pradesh' },
      { id: 'pu', name: 'Punjab University', state: 'Punjab' },
      { id: 'hpu', name: 'Himachal Pradesh University', state: 'Himachal Pradesh' },
      { id: 'ku', name: 'Kurukshetra University', state: 'Haryana' },
    ]
  },
  {
    region: 'South India',
    universities: [
      { id: 'bangalore', name: 'Bangalore University', state: 'Karnataka' },
      { id: 'manipal', name: 'Manipal University', state: 'Karnataka' },
      { id: 'anna', name: 'Anna University', state: 'Tamil Nadu' },
      { id: 'vit', name: 'VIT University', state: 'Tamil Nadu' },
      { id: 'srm', name: 'SRM University', state: 'Tamil Nadu' },
      { id: 'osmania', name: 'Osmania University', state: 'Telangana' },
      { id: 'hydrabad', name: 'University of Hyderabad', state: 'Telangana' },
      { id: 'kerala', name: 'University of Kerala', state: 'Kerala' },
    ]
  },
  {
    region: 'East India',
    universities: [
      { id: 'cu', name: 'Calcutta University', state: 'West Bengal' },
      { id: 'jadavpur', name: 'Jadavpur University', state: 'West Bengal' },
      { id: 'bhu_bihar', name: 'Bihar University', state: 'Bihar' },
      { id: 'patna', name: 'Patna University', state: 'Bihar' },
      { id: 'rrc', name: 'Ranchi University', state: 'Jharkhand' },
      { id: 'ouat', name: 'Odisha University', state: 'Odisha' },
    ]
  },
  {
    region: 'West India',
    universities: [
      { id: 'mdu', name: 'Mumbai University (MU)', state: 'Maharashtra' },
      { id: 'pune', name: 'Savitribai Phule Pune University', state: 'Maharashtra' },
      { id: 'gu', name: 'Gujarat University', state: 'Gujarat' },
      { id: 'msu', name: 'M.S. University', state: 'Gujarat' },
      { id: 'rajasthan', name: 'Rajasthan University', state: 'Rajasthan' },
      { id: 'jodhpur', name: 'Jodhpur University', state: 'Rajasthan' },
    ]
  },
  {
    region: 'Central India',
    universities: [
      { id: 'bu', name: 'Barkatullah University', state: 'Madhya Pradesh' },
      { id: 'du_indore', name: 'Devi Ahilya University', state: 'Madhya Pradesh' },
      { id: 'rgtu', name: 'RGPV University', state: 'Madhya Pradesh' },
    ]
  }
]

// College course categories
const COLLEGE_CATEGORIES = [
  { id: 'bsc', name: 'B.Sc Courses', icon: '🔬', courses: ['college_bsc_pcm', 'college_bsc_pcb', 'college_bsc_cs', 'college_bsc_bio', 'college_bsc_stats'] },
  { id: 'commerce', name: 'B.Com & Commerce', icon: '📊', courses: ['college_bcom'] },
  { id: 'management', name: 'B.B.A. Management', icon: '💼', courses: ['college_bba'] },
  { id: 'arts', name: 'B.A. Arts', icon: '📚', courses: ['college_ba_history', 'college_ba_polsc', 'college_ba_psychology'] },
  { id: 'engineering', name: 'B.Tech Engineering', icon: '⚙️', courses: ['college_btech_cs'] },
  { id: 'law', name: 'LL.B. Law', icon: '⚖️', courses: ['college_llb'] },
  { id: 'support', name: 'Support Courses', icon: '🎯', courses: ['college_semester_support', 'college_exam_prep', 'college_career_skills'] },
]

// Thumbnail mapping for college courses
const COLLEGE_COURSE_THUMBNAILS: Record<string, string> = {
  'college_bsc_pcm': '/assets/courses/college-bsc-pcm.svg',
  'college_bsc_pcb': '/assets/courses/college-bsc-pcb.svg',
  'college_bsc_cs': '/assets/courses/college-bsc-cs.svg',
  'college_bsc_bio': '/assets/courses/college-bsc-biotech.svg',
  'college_bsc_stats': '/assets/courses/college-bsc-stats.svg',
  'college_bcom': '/assets/courses/college-bcom.svg',
  'college_bba': '/assets/courses/college-bba.svg',
  'college_ba_history': '/assets/courses/college-ba-history.svg',
  'college_ba_polsc': '/assets/courses/college-ba-polsc.svg',
  'college_ba_psychology': '/assets/courses/college-ba-psychology.svg',
  'college_btech_cs': '/assets/courses/college-btech-cs.svg',
  'college_llb': '/assets/courses/college-llb.svg',
  'college_semester_support': '/assets/courses/college-semester-support.svg',
  'college_exam_prep': '/assets/courses/college-exam-prep.svg',
  'college_career_skills': '/assets/courses/college-career-skills.svg',
}

export default function CollegeCoursesPage() {
  const router = useRouter()
  const [selectedUniversity, setSelectedUniversity] = useState<{id: string, name: string, state: string} | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedRegion, setExpandedRegion] = useState<string>('North India')

  // Fetch all college courses
  useEffect(() => {
    const fetchCollegeCourses = async () => {
      setLoading(true)
      try {
        const collegeCourseIds = COLLEGE_CATEGORIES.flatMap(cat => cat.courses)
        const allCourses: Course[] = []
        
        for (const courseId of collegeCourseIds) {
          const response = await fetch(`/api/courses/${courseId}`)
          if (response.ok) {
            const data: ApiResponse = await response.json()
            if (data.success) {
              allCourses.push(data.course)
            }
          }
        }
        
        setCourses(allCourses)
      } catch (err) {
        console.error('Failed to fetch college courses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCollegeCourses()
  }, [])

  // Filter courses based on selections
  const filteredCourses = useMemo(() => {
    let result = courses

    if (selectedCategory) {
      const category = COLLEGE_CATEGORIES.find(cat => cat.id === selectedCategory)
      if (category) {
        result = result.filter(course => category.courses.includes(course.id))
      }
    }

    return result
  }, [courses, selectedCategory])

  // Get course thumbnail
  const getCourseThumbnail = (courseId: string) => {
    return COLLEGE_COURSE_THUMBNAILS[courseId] || '/assets/courses/college-bcom.svg'
  }

  // Format duration
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NewNavigation />

      <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#f9fafb' }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          padding: '3rem 1rem',
          color: 'white'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎓</div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                College Education
              </h1>
              <p style={{ fontSize: '1.125rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
                Degree-specific courses designed for Indian university students. 
                Select your university to get started!
              </p>
            </div>

            {/* University Selector */}
            <div style={{ 
              background: 'white', 
              borderRadius: '1rem', 
              padding: '1.5rem',
              maxWidth: '800px',
              margin: '0 auto',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
            }}>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#111827', 
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                Select Your University
              </h2>
              
              <p style={{ 
                color: '#6b7280', 
                fontSize: '0.875rem', 
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                Choose from 100+ universities across India
              </p>

              {/* University List by Region */}
              <div style={{ 
                maxHeight: '400px', 
                overflowY: 'auto',
                padding: '0.5rem'
              }}>
                {UNIVERSITY_REGIONS.map(region => (
                  <div key={region.region} style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setExpandedRegion(expandedRegion === region.region ? '' : region.region)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: expandedRegion === region.region ? '#fef3c7' : '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontWeight: '600',
                        color: '#92400e',
                        fontSize: '0.9rem'
                      }}
                    >
                      <span>{region.region}</span>
                      <span style={{ 
                        transform: expandedRegion === region.region ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }}>▼</span>
                    </button>
                    
                    {expandedRegion === region.region && (
                      <div style={{ 
                        padding: '0.5rem 0 0.5rem 1rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '0.5rem'
                      }}>
                        {region.universities.map(uni => (
                          <button
                            key={uni.id}
                            onClick={() => setSelectedUniversity(uni)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              background: selectedUniversity?.id === uni.id ? '#ea580c' : 'white',
                              color: selectedUniversity?.id === uni.id ? 'white' : '#374151',
                              border: `1px solid ${selectedUniversity?.id === uni.id ? '#ea580c' : '#d1d5db'}`,
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              textAlign: 'left',
                              transition: 'all 0.2s'
                            }}
                          >
                            {uni.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Selected University Info */}
              {selectedUniversity && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  background: '#ecfdf5', 
                  borderRadius: '0.5rem',
                  border: '1px solid #10b981',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    background: '#10b981', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    ✓
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', color: '#065f46' }}>
                      Selected: {selectedUniversity.name}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#047857' }}>
                      Showing courses aligned with your university curriculum
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedUniversity(null)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'white',
                      border: '1px solid #10b981',
                      borderRadius: '0.375rem',
                      color: '#10b981',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Categories */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          {/* Category Tabs */}
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            marginBottom: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => setSelectedCategory(null)}
              style={{
                padding: '0.75rem 1.25rem',
                background: selectedCategory === null ? '#ea580c' : 'white',
                color: selectedCategory === null ? 'white' : '#374151',
                border: '1px solid #e5e7eb',
                borderRadius: '2rem',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.875rem',
                transition: 'all 0.2s'
              }}
            >
              All Courses
            </button>
            {COLLEGE_CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  padding: '0.75rem 1.25rem',
                  background: selectedCategory === category.id ? '#ea580c' : 'white',
                  color: selectedCategory === category.id ? 'white' : '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '2rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Course Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '0.75rem' }}>
              <div style={{ fontSize: '1.25rem', color: '#6b7280' }}>Loading courses...</div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '0.75rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
                {selectedCategory 
                  ? `No courses found in ${COLLEGE_CATEGORIES.find(c => c.id === selectedCategory)?.name}`
                  : 'No college courses available yet'}
              </p>
              <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
                Check back soon for more courses!
              </p>
            </div>
          ) : (
            <>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>
                  {selectedCategory 
                    ? COLLEGE_CATEGORIES.find(c => c.id === selectedCategory)?.name 
                    : 'All College Courses'}
                </h2>
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  {filteredCourses.length} courses
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '1.5rem'
              }}>
                {filteredCourses.map(course => (
                  <div
                    key={course.id}
                    style={{
                      background: 'white',
                      borderRadius: '0.75rem',
                      overflow: 'hidden',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                    onClick={() => router.push(`/courses/${course.id}`)}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      aspectRatio: '16/9',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '4rem',
                      position: 'relative'
                    }}>
                      <img
                        src={getCourseThumbnail(course.id)}
                        alt={course.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement!.innerHTML = '<span style="font-size: 4rem;">📚</span>'
                        }}
                      />
                      {/* Duration Badge */}
                      <div style={{
                        position: 'absolute',
                        bottom: '0.5rem',
                        right: '0.5rem',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem'
                      }}>
                        {formatDuration(course.duration)}
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '1.25rem' }}>
                      <span style={{
                        display: 'inline-block',
                        background: '#fef3c7',
                        color: '#92400e',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        marginBottom: '0.75rem'
                      }}>
                        🎓 Degree Course
                      </span>

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
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          By {course.instructor.name}
                        </p>
                        <span style={{
                          display: 'inline-block',
                          background: '#ea580c',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          fontWeight: '600',
                          fontSize: '0.875rem'
                        }}>
                          View Course
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* University CTA Section */}
        <div style={{ 
          background: 'white', 
          borderTop: '1px solid #e5e7eb',
          padding: '3rem 1rem'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
              Don't See Your University?
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
              Our courses are designed following common university curricula across India. 
              Most B.Sc, B.Com, B.B.A., and B.A. programs follow similar syllabi.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button style={{
                padding: '0.75rem 1.5rem',
                background: '#ea580c',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Browse All Courses
              </button>
              <button style={{
                padding: '0.75rem 1.5rem',
                background: 'white',
                color: '#ea580c',
                border: '1px solid #ea580c',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Request Your University
              </button>
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
