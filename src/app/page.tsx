"use client"

import { useState, useEffect } from 'react'
import { NewNavigation } from '@/components/new-navigation'

export default function NewLandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: 'white' }}>
        <div style={{ paddingTop: '64px' }}>
          <div style={{ height: '600px', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%)' }}></div>
        </div>
      </div>
    )
  }

  const learningPaths = [
    {
      icon: '📚',
      title: 'School Learning',
      description: 'Class 1-12 with all boards - Math, Science, English, and more',
      color: '#dbeafe'
    },
    {
      icon: '🎓',
      title: 'College Foundation',
      description: 'UG degrees - Commerce, Science, Engineering prep',
      color: '#f3e8ff'
    },
    {
      icon: '🏆',
      title: 'Competitive Exams',
      description: 'UPSC, SSC, Banking, Railways, and entrance exams',
      color: '#fee2e2'
    },
    {
      icon: '💼',
      title: 'Professional Courses',
      description: 'SAP, Excel, Tally, Python, and career skills',
      color: '#dcfce7'
    },
    {
      icon: '🌱',
      title: 'Life Skills',
      description: 'Financial literacy, communication, and personal growth',
      color: '#fef3c7'
    },
    {
      icon: '💰',
      title: 'Money & Business',
      description: 'Financial literacy - Investment, Business basics',
      color: '#fef3c7'
    },
    {
      icon: '⚖️',
      title: 'Citizen & Law',
      description: 'Constitution, Citizen Law, RTI, Consumer Rights, Cyber Law',
      color: '#e0e7ff'
    }
  ]

  // Updated features with new Course Builder
  const features = [
    {
      icon: '🎯',
      title: 'Concept Clarity',
      description: 'Understanding concepts, not just exam shortcuts',
      bgColor: '#eff6ff'
    },
    {
      icon: '💵',
      title: '₹99/Month',
      description: 'Affordable like UPI - accessible to every Indian',
      bgColor: '#f0fdf4'
    },
    {
      icon: '🏫',
      title: 'Complete Ecosystem',
      description: 'School + College + Skills + Career in one platform',
      bgColor: '#faf5ff'
    },
    {
      icon: '📱',
      title: 'India-First Design',
      description: 'Built for Indian students with local context',
      bgColor: '#fffbeb'
    }
  ]

  const instructorFeatures = [
    {
      icon: '📊',
      title: 'PPTX to Video/Audio',
      description: 'Upload your PowerPoint presentations and automatically convert them to professional video lessons and audio content',
      bgColor: '#ecfdf5',
      accentColor: '#059669'
    },
    {
      icon: '📚',
      title: 'Course Builder',
      description: 'Create structured courses with modules and lessons. Organize content intuitively with drag-and-drop simplicity',
      bgColor: '#f0f9ff',
      accentColor: '#0284c7'
    },
    {
      icon: '🎬',
      title: 'Auto Video Generation',
      description: 'Transform static presentations into engaging video content with animations and professional transitions',
      bgColor: '#fef3c7',
      accentColor: '#d97706'
    },
    {
      icon: '🎵',
      title: 'Audio Version',
      description: 'Generate audio versions of your lessons for offline learning on-the-go',
      bgColor: '#fdf2f8',
      accentColor: '#db2777'
    }
  ]

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NewNavigation />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%)',
        color: 'white',
        padding: '8rem 1rem 5rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Badges */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(250, 204, 21, 0.2)',
              border: '1px solid rgba(250, 204, 21, 0.3)',
              borderRadius: '9999px',
              padding: '0.375rem 1rem',
              fontSize: '0.875rem'
            }}>
              🚀 Learning Utility Model
            </span>
            <span style={{
              background: 'rgba(74, 222, 128, 0.2)',
              border: '1px solid rgba(74, 222, 128, 0.3)',
              borderRadius: '9999px',
              padding: '0.375rem 1rem',
              fontSize: '0.875rem'
            }}>
              ✨ PPTX to Video Converter
            </span>
            <span style={{
              background: 'rgba(251, 146, 60, 0.2)',
              border: '1px solid rgba(251, 146, 60, 0.3)',
              borderRadius: '9999px',
              padding: '0.375rem 1rem',
              fontSize: '0.875rem'
            }}>
              🎥 Live Learning Sessions
            </span>
            <span style={{
              background: 'rgba(168, 85, 247, 0.2)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '9999px',
              padding: '0.375rem 1rem',
              fontSize: '0.875rem'
            }}>
              🏢 White Label Solution
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            lineHeight: '1.2',
            marginBottom: '1.5rem'
          }}>
            From Class 1 to Career — <br />
            <span style={{ color: '#facc15' }}>Learning for Every Indian</span>
          </h1>

          {/* Description */}
          <p style={{
            fontSize: '1.25rem',
            color: '#bfdbfe',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem',
            lineHeight: '1.6'
          }}>
            A learning utility, just like UPI — for every Indian student
          </p>

          {/* CTA Button */}
          <a href="/auth/login" style={{
            display: 'inline-block',
            background: 'white',
            color: '#2563eb',
            padding: '0.875rem 2rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1rem',
            marginBottom: '3rem',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          >
            Start Learning Today
          </a>

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#facc15' }}>1-12</div>
              <div style={{ fontSize: '0.875rem', color: '#bfdbfe' }}>School Classes</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#facc15' }}>18+</div>
              <div style={{ fontSize: '0.875rem', color: '#bfdbfe' }}>Learning Paths</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#facc15' }}>₹99</div>
              <div style={{ fontSize: '0.875rem', color: '#bfdbfe' }}>Monthly</div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section style={{
        padding: '5rem 1rem',
        background: '#f9fafb'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.75rem'
            }}>
              Seven Learning Paths
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Comprehensive learning structure for every stage of your educational and professional journey
            </p>
          </div>

          {/* Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {learningPaths.map((path, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '0.75rem',
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
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '0.75rem',
                  background: path.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  marginBottom: '1rem'
                }}>
                  {path.icon}
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.5rem'
                }}>
                  {path.title}
                </h3>
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  lineHeight: '1.5'
                }}>
                  {path.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship ₹99 Courses Section */}
      <section style={{
        padding: '5rem 1rem',
        background: 'linear-gradient(180deg, #fef3c7 0%, #fef9c3 50%, #fef3c7 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#fde68a',
              color: '#b45309',
              borderRadius: '9999px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              ⭐ Most Popular
            </div>
            <h2 style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.75rem'
            }}>
              Flagship ₹99 Courses
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1.125rem',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Build Skills. Build Confidence. Know Your Rights.
            </p>
          </div>

          {/* Courses Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* English Speaking */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e5e7eb',
              transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              e.currentTarget.style.borderColor = '#3b82f6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '0.75rem',
                background: '#dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                marginBottom: '1rem'
              }}>
                🗣️
              </div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>
                English Speaking
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                marginBottom: '1rem'
              }}>
                Practical English for Daily Life. Speak confidently in office, interviews, and daily conversations.
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid #f3f4f6'
              }}>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#16a34a'
                }}>
                  ₹99
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>
                  One-time
                </span>
              </div>
            </div>

            {/* Public Speaking */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e5e7eb',
              transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              e.currentTarget.style.borderColor = '#8b5cf6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '0.75rem',
                background: '#ede9fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                marginBottom: '1rem'
              }}>
                🎤
              </div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>
                Public Speaking
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                marginBottom: '1rem'
              }}>
                Speak with Confidence Anywhere. Remove stage fear. Improve voice, clarity, and impact.
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid #f3f4f6'
              }}>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#16a34a'
                }}>
                  ₹99
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>
                  One-time
                </span>
              </div>
            </div>

            {/* Indian Constitution */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e5e7eb',
              transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              e.currentTarget.style.borderColor = '#f59e0b'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '0.75rem',
                background: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                marginBottom: '1rem'
              }}>
                📜
              </div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>
                Indian Constitution
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                marginBottom: '1rem'
              }}>
                Know Your Fundamental Rights. Understand Articles 14, 19, 21 in simple language. Become an aware citizen.
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid #f3f4f6'
              }}>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#16a34a'
                }}>
                  ₹99
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>
                  One-time
                </span>
              </div>
            </div>

            {/* Citizen Law */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e5e7eb',
              transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              e.currentTarget.style.borderColor = '#06b6d4'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '0.75rem',
                background: '#cffafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                marginBottom: '1rem'
              }}>
                ⚖️
              </div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>
                Citizen Law
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                marginBottom: '1rem'
              }}>
                Know Your Rights. Police, FIR, RTI, consumer rights, cyber safety — all in one.
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid #f3f4f6'
              }}>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#16a34a'
                }}>
                  ₹99
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>
                  One-time
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{
            textAlign: 'center',
            marginTop: '3rem',
            padding: '2rem',
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              marginBottom: '1.5rem',
              maxWidth: '600px',
              margin: '0 auto 1.5rem',
              lineHeight: '1.6'
            }}>
              Each Course Only ₹99 | Lifetime Access | Build Confidence & Rights Awareness
            </p>
            <a href="/courses" style={{
              display: 'inline-block',
              background: '#f59e0b',
              color: 'white',
              padding: '0.875rem 2.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'background 0.2s, transform 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#d97706'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f59e0b'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            >
              Explore All ₹99 Courses
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.75rem'
            }}>
              Why We're Different
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              We're not a coaching center. We're a learning utility focused on foundation building.
            </p>
          </div>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  padding: '2rem',
                  background: feature.bgColor,
                  borderRadius: '0.75rem'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.5rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  lineHeight: '1.5'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Course Builder Section */}
      <section style={{
        padding: '5rem 1rem',
        background: 'linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdf4 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#dcfce7',
              color: '#166534',
              borderRadius: '9999px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              ✨ New Feature
            </div>
            <h2 style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.75rem'
            }}>
              Create Courses in Minutes
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1.125rem',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Transform your PowerPoint presentations into engaging video and audio lessons automatically. 
              Our AI-powered Course Builder makes content creation effortless.
            </p>
          </div>

          {/* Instructor Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {instructorFeatures.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '1rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '1rem',
                  background: feature.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  marginBottom: '1.25rem'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.75rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.9375rem',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA for Instructors */}
          <div style={{
            textAlign: 'center',
            marginTop: '3rem',
            padding: '2rem',
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎓</div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.75rem'
            }}>
              Become an INR99 Instructor
            </h3>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              maxWidth: '500px',
              margin: '0 auto 1.5rem',
              lineHeight: '1.6'
            }}>
              Share your knowledge with thousands of learners across India. 
              Create engaging courses with our powerful tools.
            </p>
            <a href="/instructor/signup" style={{
              display: 'inline-block',
              background: '#059669',
              color: 'white',
              padding: '0.875rem 2rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'background 0.2s, transform 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#047857'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#059669'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            >
              Start Teaching Today
            </a>
          </div>
        </div>
      </section>

      {/* Live Learning Section */}
      <section style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #eff6ff 100%)',
        padding: '5rem 1rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#bfdbfe',
              color: '#1e40af',
              borderRadius: '9999px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              🎥 Live Learning
            </div>
            <h2 style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.75rem'
            }}>
              Learn Live with Expert Instructors
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1.125rem',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Join live learning sessions, interact with instructors in real-time, 
              and get your doubts cleared instantly. Learning is better together.
            </p>
          </div>

          {/* Live Session Features */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '0 auto 1.25rem'
              }}>
                🎯
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Real-Time Interaction
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.9375rem',
                lineHeight: '1.6'
              }}>
                Ask questions, participate in discussions, and learn actively during live sessions
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '0 auto 1.25rem'
              }}>
                👨‍🏫
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Expert Instructors
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.9375rem',
                lineHeight: '1.6'
              }}>
                Learn from qualified educators and industry experts in various subjects
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '0 auto 1.25rem'
              }}>
                📹
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Session Recordings
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.9375rem',
                lineHeight: '1.6'
              }}>
                Missed a session? Watch recordings anytime and learn at your own pace
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#fce7f3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '0 auto 1.25rem'
              }}>
                📅
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Scheduled Sessions
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.9375rem',
                lineHeight: '1.6'
              }}>
                Regular live sessions on various topics - check schedule and join live
              </p>
            </div>
          </div>

          {/* CTA */}
          <div style={{
            textAlign: 'center',
            marginTop: '3rem'
          }}>
            <a href="/live-sessions" style={{
              display: 'inline-block',
              background: '#2563eb',
              color: 'white',
              padding: '0.875rem 2.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'background 0.2s, transform 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1d4ed8'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#2563eb'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            >
              View Live Sessions Schedule
            </a>
          </div>
        </div>
      </section>

      {/* White-Label / Multi-Tenant Section */}
      <section style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%)',
        padding: '5rem 1rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#bbf7d0',
              color: '#166534',
              borderRadius: '9999px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              🏢 White-Label Platform
            </div>
            <h2 style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.75rem'
            }}>
              Launch Your Own Learning Platform
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1.125rem',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              A powerful, multi-tenant learning infrastructure that empowers institutions, businesses, and entrepreneurs to launch their own branded learning platforms in minutes.
            </p>
          </div>

          {/* White-Label Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '0 auto 1.25rem'
              }}>
                🎨
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Custom Branding
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.9375rem',
                lineHeight: '1.6'
              }}>
                Your logo, colors, and domain - create a fully branded learning experience that represents your organization
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '0 auto 1.25rem'
              }}>
                🔗
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Auto-Provisioned Subdomains
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.9375rem',
                lineHeight: '1.6'
              }}>
                Get instant subdomain access with automatic DNS configuration. Your platform, your subdomain, zero hassle
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#fce7f3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '0 auto 1.25rem'
              }}>
                🔒
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Secure Isolation
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.9375rem',
                lineHeight: '1.6'
              }}>
                Multi-tenant architecture with complete data isolation. Each institution's data stays completely separate
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#e0e7ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '0 auto 1.25rem'
              }}>
                ⚡
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Go Live in Minutes
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.9375rem',
                lineHeight: '1.6'
              }}>
                Set up your branded platform in minutes, not months. Focus on education, let us handle the infrastructure
              </p>
            </div>
          </div>

          {/* Schools/Colleges Statement */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2.5rem',
            marginBottom: '3rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '2px solid #16a34a'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#166534',
                marginBottom: '0.5rem'
              }}>
                🏫 Schools / Colleges
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                marginTop: '0.5rem'
              }}>
                For institutions with 1500+ students
              </p>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#16a34a', fontSize: '1.25rem' }}>✓</span>
                <span style={{ color: '#374151', fontSize: '1rem' }}>Pay NOTHING</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#16a34a', fontSize: '1.25rem' }}>✓</span>
                <span style={{ color: '#374151', fontSize: '1rem' }}>Get full platform access</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#16a34a', fontSize: '1.25rem' }}>✓</span>
                <span style={{ color: '#374151', fontSize: '1rem' }}>Get ready-made content</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#16a34a', fontSize: '1.25rem' }}>✓</span>
                <span style={{ color: '#374151', fontSize: '1rem' }}>Get live sessions</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#16a34a', fontSize: '1.25rem' }}>✓</span>
                <span style={{ color: '#374151', fontSize: '1rem' }}>Get course builder</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#16a34a', fontSize: '1.25rem' }}>✓</span>
                <span style={{ color: '#374151', fontSize: '1rem' }}>Get branding/subdomain</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#16a34a', fontSize: '1.25rem' }}>✓</span>
                <span style={{ color: '#374151', fontSize: '1rem' }}>Get student dashboards</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#16a34a', fontSize: '1.25rem' }}>✓</span>
                <span style={{ color: '#374151', fontSize: '1rem', fontWeight: '600' }}>Zero financial burden</span>
              </div>
            </div>
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#f0fdf4',
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              <p style={{ color: '#166534', fontSize: '0.875rem' }}>
                <strong>Eligibility:</strong> Institutions must have 1500+ students to qualify for free white-label access.
                Verification required within 30 days of signup.
              </p>
            </div>
          </div>

          {/* CTA for Schools and Colleges */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Schools Card */}
            <div style={{
              background: 'white',
              padding: '2.5rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              border: '2px solid #3b82f6'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏫</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                For Schools
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.9375rem',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                Create a branded learning platform for your school. Offer online classes, assignments, and assessments with your school's identity.
              </p>
              <a href="/institution/signup" style={{
                display: 'inline-block',
                background: '#3b82f6',
                color: 'white',
                padding: '0.875rem 2rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'background 0.2s, transform 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2563eb'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#3b82f6'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              >
                Start Your School Platform
              </a>
            </div>

            {/* Colleges Card */}
            <div style={{
              background: 'white',
              padding: '2.5rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              border: '2px solid #7c3aed'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                For Colleges
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.9375rem',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                Launch a professional learning platform for your college. Offer degree programs, certifications, and skill development courses.
              </p>
              <a href="/institution/signup" style={{
                display: 'inline-block',
                background: '#7c3aed',
                color: 'white',
                padding: '0.875rem 2rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'background 0.2s, transform 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#6d28d9'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#7c3aed'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              >
                Start Your College Platform
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        padding: '4rem 1rem'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
            <span style={{
              display: 'inline-block',
              background: '#fed7aa',
              color: '#c2410c',
              borderRadius: '9999px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              Our Philosophy
            </span>
            <blockquote style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1f2937',
              fontStyle: 'italic',
              lineHeight: '1.4',
              marginBottom: '1.5rem'
            }}>
              "INR99 Academy is a growing learning utility. Content is added continuously based on real user needs."
            </blockquote>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Unlike static coaching programs, we evolve based on what learners actually need. Every new course, tutorial, and resource is developed in response to genuine student requests and community feedback.
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              marginTop: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontSize: '0.875rem' }}>
                <span style={{ width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%' }}></span>
                Live & Growing
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                📝 User-Driven Content
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                🎯 Community Feedback
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        color: 'white',
        padding: '5rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '1rem'
          }}>
            Ready to Start Your Learning Journey?
          </h2>
          <p style={{
            fontSize: '1.125rem',
            opacity: 0.9,
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Join thousands of learners across India building their future with INR99.Academy
          </p>
          <a href="/subscription" style={{
            display: 'inline-block',
            background: 'white',
            color: '#2563eb',
            padding: '0.875rem 2rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1rem',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Start Learning at ₹99/month
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#111827',
        color: 'white',
        padding: '3rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '0.5rem'
          }}>
            INR99.Academy
          </h3>
          <p style={{
            color: '#9ca3af',
            fontSize: '0.875rem',
            marginBottom: '1rem'
          }}>
            India's Learning Infrastructure - As reliable as UPI
          </p>
          <p style={{
            color: '#6b7280',
            fontSize: '0.75rem',
            maxWidth: '600px',
            margin: '0 auto 1.5rem',
            lineHeight: '1.5'
          }}>
            This platform provides conceptual learning and academic support. It is not affiliated with any board, university, or examination authority.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            color: '#9ca3af',
            fontSize: '0.75rem'
          }}>
            <span>© 2026 INR99.Academy</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
