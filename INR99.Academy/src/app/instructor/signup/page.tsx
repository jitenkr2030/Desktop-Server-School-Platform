'use client'

import { useState } from 'react'
import Link from 'next/link'
import { NewNavigation } from '@/components/new-navigation'

export default function InstructorSignupPage() {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register')

  const benefits = [
    {
      icon: '💰',
      title: 'Earn While Teaching',
      description: 'Get paid for sharing your knowledge with thousands of students across India'
    },
    {
      icon: '📊',
      title: 'PPTX to Video Converter',
      description: 'Automatically convert your PowerPoint presentations into engaging video lessons'
    },
    {
      icon: '🎓',
      title: 'Course Builder Tool',
      description: 'Easy-to-use drag-and-drop interface to create structured courses'
    },
    {
      icon: '📈',
      title: 'Analytics Dashboard',
      description: 'Track student progress, engagement, and your earnings in real-time'
    },
    {
      icon: '🎥',
      title: 'Live Sessions',
      description: 'Host live classes and interact with students in real-time'
    },
    {
      icon: '🌟',
      title: 'Build Your Brand',
      description: 'Establish yourself as an expert educator and grow your audience'
    }
  ]

  const stats = [
    { value: '10,000+', label: 'Active Students' },
    { value: '500+', label: 'Instructors' },
    { value: '₹50L+', label: 'Paid to Instructors' },
    { value: '4.8★', label: 'Average Rating' }
  ]

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NewNavigation />

      <div style={{ paddingTop: '80px' }}>
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #059669 0%, #7c3aed 100%)',
          color: 'white',
          padding: '4rem 1rem',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Become an INR99 Instructor
            </h1>
            <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Share your knowledge, inspire students, and earn money teaching what you love
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {stats.map((stat, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Auth Section */}
        <section style={{
          background: 'white',
          padding: '4rem 1rem',
          marginTop: '-2rem'
        }}>
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', justifyContent: 'center' }}>
              <button
                onClick={() => setActiveTab('register')}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  background: activeTab === 'register' ? '#059669' : '#f3f4f6',
                  color: activeTab === 'register' ? 'white' : '#374151',
                  transition: 'all 0.2s'
                }}
              >
                Register as Instructor
              </button>
              <button
                onClick={() => setActiveTab('login')}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  background: activeTab === 'login' ? '#059669' : '#f3f4f6',
                  color: activeTab === 'login' ? 'white' : '#374151',
                  transition: 'all 0.2s'
                }}
              >
                Instructor Login
              </button>
            </div>

            {/* Register Form */}
            {activeTab === 'register' && (
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', textAlign: 'center' }}>
                  Create Instructor Account
                </h2>
                <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '2rem' }}>
                  Join thousands of educators teaching on INR99 Academy
                </p>

                <form style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Create a strong password"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Subject/Expertise
                    </label>
                    <select style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      background: 'white'
                    }}>
                      <option value="">Select your expertise</option>
                      <option value="school">School Subjects (Class 1-12)</option>
                      <option value="college">College/University Subjects</option>
                      <option value="programming">Programming & Tech</option>
                      <option value="business">Business & Finance</option>
                      <option value="design">Design & Creative</option>
                      <option value="marketing">Marketing & Sales</option>
                      <option value="language">Languages</option>
                      <option value="skills">Life Skills</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      background: '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginTop: '0.5rem'
                    }}
                  >
                    Create Account
                  </button>
                </form>

                <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', marginTop: '1.5rem' }}>
                  Already have an account?{' '}
                  <button
                    onClick={() => setActiveTab('login')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#059669',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Login here
                  </button>
                </p>
              </div>
            )}

            {/* Login Form */}
            {activeTab === 'login' && (
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', textAlign: 'center' }}>
                  Instructor Login
                </h2>
                <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '2rem' }}>
                  Access your instructor dashboard
                </p>

                <form style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                      <input type="checkbox" />
                      Remember me
                    </label>
                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#059669',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      background: '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginTop: '0.5rem'
                    }}
                  >
                    Login to Dashboard
                  </button>
                </form>

                <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', marginTop: '1.5rem' }}>
                  Don&apos;t have an instructor account?{' '}
                  <button
                    onClick={() => setActiveTab('register')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#059669',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Register here
                  </button>
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Benefits Section */}
        <section style={{ padding: '4rem 1rem', background: '#f9fafb' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.75rem' }}>
                Why Teach on INR99 Academy?
              </h2>
              <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                Join India&apos;s most affordable learning platform and reach millions of eager learners
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}>
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '1rem',
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
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '0.75rem',
                    background: '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.75rem',
                    marginBottom: '1rem'
                  }}>
                    {benefit.icon}
                  </div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '0.5rem'
                  }}>
                    {benefit.title}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.9375rem', lineHeight: '1.6' }}>
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
          color: 'white',
          padding: '4rem 1rem',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
              Ready to Start Teaching?
            </h2>
            <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '2rem' }}>
              Join thousands of instructors who are building their teaching career on INR99 Academy
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                display: 'inline-block',
                background: '#059669',
                color: 'white',
                padding: '0.875rem 2.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Get Started Now
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          background: '#111827',
          color: 'white',
          padding: '2rem 1rem',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              © 2026 INR99.Academy - India&apos;s Learning Infrastructure
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
