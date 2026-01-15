"use client"

import { useState } from 'react'
import Link from 'next/link'
import { NewNavigation } from '@/components/new-navigation'

interface LearningPath {
  id: string
  title: string
  description: string
  icon: string
  color: string
  bgColor: string
  courses: number
  duration: string
  difficulty: string
  stages: Array<{
    name: string
    duration: string
    courses: number
  }>
}

interface PathCategory {
  id: string
  name: string
  icon: string
  description: string
  color: string
  bgColor: string
  paths: LearningPath[]
}

const learningPathCategories: PathCategory[] = [
  {
    id: 'school',
    name: 'School Learning',
    icon: '🏫',
    description: 'Academic excellence from Class 1-12 with CBSE/ICSE curriculum coverage',
    color: '#2563eb',
    bgColor: '#dbeafe',
    paths: [
      {
        id: 'primary-school',
        title: 'Primary School (Class 1-5)',
        description: 'Building strong foundations in Mathematics, English, Hindi, and Science',
        icon: '🧒',
        color: '#2563eb',
        bgColor: '#dbeafe',
        courses: 12,
        duration: '1-5 years',
        difficulty: 'Beginner',
        stages: [
          { name: 'Class 1-2', duration: 'Year 1', courses: 4 },
          { name: 'Class 3-5', duration: 'Year 2-4', courses: 8 }
        ]
      },
      {
        id: 'middle-school',
        title: 'Middle School (Class 6-8)',
        description: 'Strengthening core concepts and introducing advanced topics',
        icon: '📖',
        color: '#3b82f6',
        bgColor: '#eff6ff',
        courses: 15,
        duration: '3 years',
        difficulty: 'Beginner-Intermediate',
        stages: [
          { name: 'Class 6', duration: 'Year 1', courses: 5 },
          { name: 'Class 7', duration: 'Year 2', courses: 5 },
          { name: 'Class 8', duration: 'Year 3', courses: 5 }
        ]
      },
      {
        id: 'high-school',
        title: 'High School (Class 9-10)',
        description: 'Board exam preparation with comprehensive subject coverage',
        icon: '📐',
        color: '#60a5fa',
        bgColor: '#f0f9ff',
        courses: 20,
        duration: '2 years',
        difficulty: 'Intermediate',
        stages: [
          { name: 'Class 9', duration: 'Year 1', courses: 10 },
          { name: 'Class 10 Board', duration: 'Year 2', courses: 10 }
        ]
      },
      {
        id: 'senior-secondary',
        title: 'Senior Secondary (Class 11-12)',
        description: 'Science, Commerce, and Arts streams with competitive exam foundation',
        icon: '🎯',
        color: '#1d4ed8',
        bgColor: '#bfdbfe',
        courses: 25,
        duration: '2 years',
        difficulty: 'Advanced',
        stages: [
          { name: 'Class 11', duration: 'Year 1', courses: 12 },
          { name: 'Class 12 Board + JEE/NEET', duration: 'Year 2', courses: 13 }
        ]
      }
    ]
  },
  {
    id: 'college',
    name: 'College (UG)',
    icon: '🎓',
    description: 'Undergraduate degree programs and professional courses',
    color: '#ea580c',
    bgColor: '#ffedd5',
    paths: [
      {
        id: 'engineering-cs',
        title: 'B.Tech Computer Science',
        description: 'Complete CS engineering preparation with coding and core subjects',
        icon: '💻',
        color: '#ea580c',
        bgColor: '#ffedd5',
        courses: 30,
        duration: '4 years',
        difficulty: 'Advanced',
        stages: [
          { name: '1st Year (基础)', duration: 'Year 1', courses: 8 },
          { name: '2nd Year (Core)', duration: 'Year 2', courses: 8 },
          { name: '3rd Year (Specialization)', duration: 'Year 3', courses: 8 },
          { name: '4th Year (Projects)', duration: 'Year 4', courses: 6 }
        ]
      },
      {
        id: 'bsc-pcm',
        title: 'B.Sc PCM',
        description: 'Physics, Chemistry, Mathematics with lab work and research',
        icon: '🔬',
        color: '#f97316',
        bgColor: '#ffedd5',
        courses: 24,
        duration: '3 years',
        difficulty: 'Intermediate-Advanced',
        stages: [
          { name: '1st Year', duration: 'Year 1', courses: 8 },
          { name: '2nd Year', duration: 'Year 2', courses: 8 },
          { name: '3rd Year', duration: 'Year 3', courses: 8 }
        ]
      },
      {
        id: 'bcom',
        title: 'B.Com (General/Hons)',
        description: 'Commerce fundamentals, accounting, and business studies',
        icon: '📊',
        color: '#fb923c',
        bgColor: '#fff7ed',
        courses: 20,
        duration: '3 years',
        difficulty: 'Intermediate',
        stages: [
          { name: '1st Year', duration: 'Year 1', courses: 6 },
          { name: '2nd Year', duration: 'Year 2', courses: 7 },
          { name: '3rd Year', duration: 'Year 3', courses: 7 }
        ]
      },
      {
        id: 'bba',
        title: 'BBA (Business Administration)',
        description: 'Management fundamentals, marketing, finance, and operations',
        icon: '💼',
        color: '#fdba74',
        bgColor: '#fff7ed',
        courses: 22,
        duration: '3 years',
        difficulty: 'Intermediate',
        stages: [
          { name: '1st Year (Foundation)', duration: 'Year 1', courses: 7 },
          { name: '2nd Year (Core)', duration: 'Year 2', courses: 8 },
          { name: '3rd Year (Specialization)', duration: 'Year 3', courses: 7 }
        ]
      }
    ]
  },
  {
    id: 'pg',
    name: 'Post-Graduate',
    icon: '🎓',
    description: "Master's degrees and professional postgraduate programs",
    color: '#7c3aed',
    bgColor: '#ede9fe',
    paths: [
      {
        id: 'mba',
        title: 'MBA (Master of Business Administration)',
        description: 'Comprehensive business management with specializations',
        icon: '💼',
        color: '#7c3aed',
        bgColor: '#ede9fe',
        courses: 24,
        duration: '2 years',
        difficulty: 'Advanced',
        stages: [
          { name: 'Term 1 (Foundation)', duration: 'Months 1-6', courses: 8 },
          { name: 'Term 2 (Core)', duration: 'Months 7-12', courses: 8 },
          { name: 'Term 3-4 (Specialization)', duration: 'Months 13-24', courses: 8 }
        ]
      },
      {
        id: 'mcom',
        title: 'M.Com (Master of Commerce)',
        description: 'Advanced accounting, finance, and business studies',
        icon: '📈',
        color: '#8b5cf6',
        bgColor: '#f5f3ff',
        courses: 18,
        duration: '2 years',
        difficulty: 'Advanced',
        stages: [
          { name: '1st Year', duration: 'Year 1', courses: 9 },
          { name: '2nd Year', duration: 'Year 2', courses: 9 }
        ]
      },
      {
        id: 'msc-data-science',
        title: 'M.Sc Data Science',
        description: 'Python, Machine Learning, AI, and advanced analytics',
        icon: '📉',
        color: '#a78bfa',
        bgColor: '#f5f3ff',
        courses: 20,
        duration: '2 years',
        difficulty: 'Advanced',
        stages: [
          { name: '1st Year (Foundation)', duration: 'Year 1', courses: 10 },
          { name: '2nd Year (Specialization)', duration: 'Year 2', courses: 10 }
        ]
      },
      {
        id: 'mca',
        title: 'MCA (Master of Computer Applications)',
        description: 'Advanced computer applications, cloud computing, and software development',
        icon: '💻',
        color: '#c4b5fd',
        bgColor: '#f5f3ff',
        courses: 22,
        duration: '3 years',
        difficulty: 'Advanced',
        stages: [
          { name: '1st Year', duration: 'Year 1', courses: 7 },
          { name: '2nd Year', duration: 'Year 2', courses: 8 },
          { name: '3rd Year', duration: 'Year 3', courses: 7 }
        ]
      }
    ]
  },
  {
    id: 'professional',
    name: 'Professional Skills',
    icon: '💼',
    description: 'Career-focused courses for skill development and upskilling',
    color: '#15803d',
    bgColor: '#dcfce7',
    paths: [
      {
        id: 'web-development',
        title: 'Full Stack Web Development',
        description: 'HTML, CSS, JavaScript, React, Node.js, and databases',
        icon: '🌐',
        color: '#15803d',
        bgColor: '#dcfce7',
        courses: 8,
        duration: '3-6 months',
        difficulty: 'Intermediate',
        stages: [
          { name: 'Frontend', duration: 'Month 1-2', courses: 3 },
          { name: 'Backend', duration: 'Month 3-4', courses: 3 },
          { name: 'Full Stack Project', duration: 'Month 5-6', courses: 2 }
        ]
      },
      {
        id: 'data-science',
        title: 'Data Science & Machine Learning',
        description: 'Python, Pandas, ML algorithms, and real-world projects',
        icon: '📊',
        color: '#16a34a',
        bgColor: '#dcfce7',
        courses: 10,
        duration: '4-6 months',
        difficulty: 'Intermediate-Advanced',
        stages: [
          { name: 'Python & Stats', duration: 'Month 1-2', courses: 3 },
          { name: 'Machine Learning', duration: 'Month 3-4', courses: 4 },
          { name: 'Deep Learning & Projects', duration: 'Month 5-6', courses: 3 }
        ]
      },
      {
        id: 'digital-marketing',
        title: 'Digital Marketing Mastery',
        description: 'SEO, Social Media, Google Ads, and Analytics',
        icon: '📢',
        color: '#22c55e',
        bgColor: '#f0fdf4',
        courses: 7,
        duration: '2-3 months',
        difficulty: 'Beginner-Intermediate',
        stages: [
          { name: 'SEO & Content', duration: 'Month 1', courses: 3 },
          { name: 'Social & Ads', duration: 'Month 2', courses: 3 },
          { name: 'Analytics & Strategy', duration: 'Month 3', courses: 1 }
        ]
      },
      {
        id: 'ui-ux-design',
        title: 'UI/UX Design',
        description: 'Figma, design principles, user research, and prototyping',
        icon: '🎨',
        color: '#4ade80',
        bgColor: '#f0fdf4',
        courses: 6,
        duration: '2-4 months',
        difficulty: 'Beginner-Intermediate',
        stages: [
          { name: 'Design Fundamentals', duration: 'Month 1', courses: 2 },
          { name: 'Figma Mastery', duration: 'Month 2', courses: 2 },
          { name: 'Portfolio Projects', duration: 'Month 3-4', courses: 2 }
        ]
      }
    ]
  },
  {
    id: 'competitive',
    name: 'Competitive Exams',
    icon: '📋',
    description: 'Government job preparation and professional certifications',
    color: '#b91c1c',
    bgColor: '#fee2e2',
    paths: [
      {
        id: 'upsc',
        title: 'UPSC Civil Services',
        description: 'Complete preparation for IAS, IPS, and other civil services',
        icon: '🏛️',
        color: '#b91c1c',
        bgColor: '#fee2e2',
        courses: 15,
        duration: '2-3 years',
        difficulty: 'Advanced',
        stages: [
          { name: 'Foundation', duration: 'Year 1', courses: 5 },
          { name: 'Prelims', duration: 'Months 12-18', courses: 5 },
          { name: 'Mains', duration: 'Months 18-30', courses: 5 }
        ]
      },
      {
        id: 'ssc',
        title: 'SSC CGL/CHSL',
        description: 'Staff Selection Commission exam preparation',
        icon: '📝',
        color: '#dc2626',
        bgColor: '#fee2e2',
        courses: 12,
        duration: '1-2 years',
        difficulty: 'Intermediate',
        stages: [
          { name: 'Tier 1 Preparation', duration: 'Months 1-6', courses: 6 },
          { name: 'Tier 2 Preparation', duration: 'Months 7-12', courses: 6 }
        ]
      },
      {
        id: 'banking',
        title: 'Banking & Insurance (IBPS/SBI)',
        description: 'Bank PO, Clerk, and insurance exam preparation',
        icon: '🏦',
        color: '#ef4444',
        bgColor: '#fee2e2',
        courses: 10,
        duration: '6-12 months',
        difficulty: 'Intermediate',
        stages: [
          { name: 'Prelims', duration: 'Months 1-4', courses: 5 },
          { name: 'Mains', duration: 'Months 5-8', courses: 5 }
        ]
      },
      {
        id: 'defense',
        title: 'Defense Services (NDA/CDS)',
        description: 'National Defence Academy and Combined Defense Services',
        icon: '🛡️',
        color: '#f87171',
        bgColor: '#fef2f2',
        courses: 8,
        duration: '1-2 years',
        difficulty: 'Intermediate',
        stages: [
          { name: 'Written Exam Prep', duration: 'Months 1-6', courses: 5 },
          { name: 'SSB Interview Prep', duration: 'Months 7-12', courses: 3 }
        ]
      }
    ]
  }
]

export default function LearningPathPage() {
  const [activeCategory, setActiveCategory] = useState('school')
  const [expandedPath, setExpandedPath] = useState<string | null>(null)

  const currentCategory = learningPathCategories.find(c => c.id === activeCategory)

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NewNavigation />

      <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#f9fafb' }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '4rem 1rem',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Learning Paths
            </h1>
            <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
              Structured learning journeys designed to take you from beginner to expert. 
              Choose your path and start building skills that matter.
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{ 
          background: 'white', 
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: '64px',
          zIndex: 100
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              padding: '1rem 0',
              overflowX: 'auto'
            }}>
              {learningPathCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    border: 'none',
                    background: activeCategory === category.id ? category.color : '#f3f4f6',
                    color: activeCategory === category.id ? 'white' : '#374151',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Info */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          {currentCategory && (
            <div style={{ 
              background: currentCategory.bgColor,
              borderRadius: '1rem',
              padding: '2rem',
              marginBottom: '2rem',
              border: `1px solid ${currentCategory.color}20`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '3rem' }}>{currentCategory.icon}</span>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: currentCategory.color }}>
                    {currentCategory.name}
                  </h2>
                  <p style={{ color: '#4b5563', marginTop: '0.25rem' }}>
                    {currentCategory.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Learning Paths Grid */}
          <div style={{ 
            display: 'grid', 
            gap: '1.5rem'
          }}>
            {currentCategory?.paths.map((path) => (
              <div
                key={path.id}
                style={{
                  background: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s'
                }}
              >
                {/* Path Header */}
                <div 
                  style={{
                    padding: '1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onClick={() => setExpandedPath(expandedPath === path.id ? null : path.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '0.75rem',
                      background: path.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem'
                    }}>
                      {path.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                        {path.title}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        {path.description}
                      </p>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <span style={{ 
                          background: path.bgColor, 
                          color: path.color,
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {path.courses} courses
                        </span>
                        <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                          ⏱️ {path.duration}
                        </span>
                        <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                          📊 {path.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    transform: expandedPath === path.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    color: '#6b7280'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>

                {/* Expanded Stages */}
                {expandedPath === path.id && (
                  <div style={{ 
                    borderTop: '1px solid #e5e7eb',
                    background: '#f9fafb',
                    padding: '1.5rem'
                  }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                      Learning Stages
                    </h4>
                    
                    {/* Visual Roadmap */}
                    <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                      {/* Vertical Line */}
                      <div style={{
                        position: 'absolute',
                        left: '0.5rem',
                        top: '0',
                        bottom: '0',
                        width: '2px',
                        background: path.color
                      }}></div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {path.stages.map((stage, index) => (
                          <div key={index} style={{ position: 'relative' }}>
                            {/* Dot on the line */}
                            <div style={{
                              position: 'absolute',
                              left: '-1.75rem',
                              top: '0.25rem',
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              background: path.color,
                              border: '3px solid white',
                              boxShadow: `0 0 0 2px ${path.color}`
                            }}></div>
                            
                            <div style={{
                              background: 'white',
                              padding: '1rem',
                              borderRadius: '0.5rem',
                              border: '1px solid #e5e7eb'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <h5 style={{ fontWeight: '600', color: '#111827' }}>{stage.name}</h5>
                                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{stage.duration}</p>
                                </div>
                                <div style={{ 
                                  background: path.bgColor, 
                                  color: path.color,
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '9999px',
                                  fontSize: '0.75rem',
                                  fontWeight: '500'
                                }}>
                                  {stage.courses} courses
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                      <Link 
                        href={`/courses?filter=${currentCategory.id}`}
                        style={{
                          display: 'inline-block',
                          background: path.color,
                          color: 'white',
                          padding: '0.75rem 2rem',
                          borderRadius: '0.5rem',
                          textDecoration: 'none',
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        Start This Path →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ background: 'white', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              textAlign: 'center'
            }}>
              {[
                { icon: '📚', number: '150+', label: 'Structured Courses', color: '#7c3aed' },
                { icon: '🎯', number: '20+', label: 'Learning Paths', color: '#ea580c' },
                { icon: '⏱️', number: '5000+', label: 'Learning Hours', color: '#15803d' },
                { icon: '👨‍🏫', number: '50+', label: 'Expert Instructors', color: '#2563eb' }
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

        {/* CTA Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          padding: '4rem 1rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Ready to Start Learning?
            </h2>
            <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
              Explore our comprehensive course library and find the perfect learning path for your goals.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                href="/courses"
                style={{
                  background: '#7c3aed',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                Browse All Courses
              </Link>
              <Link 
                href="/"
                style={{
                  background: 'transparent',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255,255,255,0.3)',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                Back to Home
              </Link>
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
    </div>
  )
}
