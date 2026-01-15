"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NewNavigation } from '@/components/new-navigation'

export default function AboutPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: 'white' }}>
        <div style={{ paddingTop: '64px' }}></div>
      </div>
    )
  }

  const coreValues = [
    {
      icon: '💡',
      title: "Concept Clarity",
      description: "We prioritize deep understanding over rote memorization, building strong conceptual foundations that last a lifetime."
    },
    {
      icon: '❤️',
      title: "Student-Centric",
      description: "Every feature, course, and interaction is designed with the Indian student's needs and learning style in mind."
    },
    {
      icon: '💵',
      title: "Affordable Education",
      description: "Quality education should be accessible to everyone. Our ₹99/month model makes learning affordable for all."
    },
    {
      icon: '🌍',
      title: "India-First Approach",
      description: "Built specifically for Indian learners, with local context, relevant examples, and cultural understanding."
    }
  ]

  const learningApproach = [
    {
      icon: '📚',
      title: "Foundation Building",
      description: "Strong conceptual understanding that serves as the bedrock for advanced learning"
    },
    {
      icon: '👥',
      title: "Micro-Learning",
      description: "Bite-sized lessons that fit into busy schedules and promote consistent learning"
    },
    {
      icon: '🎯',
      title: "Practical Application",
      description: "Real-world examples and applications that make learning relevant and meaningful"
    },
    {
      icon: '📈',
      title: "Progressive Structure",
      description: "Well-organized curriculum that builds knowledge systematically and logically"
    }
  ]

  const teamMembers = [
    {
      name: "Dr. Ananya Sharma",
      role: "Founder & Chief Education Officer",
      bio: "Former IIT professor with 15+ years in education technology and curriculum design"
    },
    {
      name: "Rajesh Kumar",
      role: "Head of Learning Design",
      bio: "Educational psychologist specializing in effective learning methodologies"
    },
    {
      name: "Priya Patel",
      role: "Chief Technology Officer",
      bio: "Former Google engineer passionate about building scalable educational platforms"
    },
    {
      name: "Arun Singh",
      role: "Head of Content",
      bio: "Experienced educator and content creator with expertise in Indian curriculum"
    }
  ]

  const achievements = [
    { number: "50,000+", label: "Students Served" },
    { number: "500+", label: "Courses Created" },
    { number: "95%", label: "Student Satisfaction" },
    { number: "4.8/5", label: "Average Rating" }
  ]

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NewNavigation />

      {/* Hero Section */}
      <section style={{
        background: 'white',
        padding: '5rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: '#f3f4f6',
            borderRadius: '9999px',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            marginBottom: '1.5rem'
          }}>
            🎓 About INR99.Academy
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#111827',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            Democratizing Quality Education for Every Indian
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            lineHeight: '1.7',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            We're not just another online learning platform. We're a learning utility 
            built to make quality education accessible, affordable, and effective for 
            every Indian student, regardless of their background or location.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section style={{ padding: '5rem 1rem', background: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <div style={{ padding: '1rem' }}>
              <div style={{
                display: 'inline-block',
                border: '2px solid #ea580c',
                color: '#ea580c',
                borderRadius: '9999px',
                padding: '0.375rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                Our Mission
              </div>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Breaking Barriers to Quality Education
              </h2>
              <p style={{
                fontSize: '1rem',
                color: '#6b7280',
                lineHeight: '1.7',
                marginBottom: '1rem'
              }}>
                In a country where education costs are rising exponentially and quality 
                education remains a privilege for many, we believe learning should be 
                as simple and accessible as checking your UPI balance.
              </p>
              <p style={{
                fontSize: '1rem',
                color: '#6b7280',
                lineHeight: '1.7',
                marginBottom: '1.5rem'
              }}>
                INR99.Academy was born from the vision of creating a learning utility 
                that serves every Indian student - from a Class 1 child in rural Bihar 
                to a working professional in Mumbai wanting to upskill.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/courses" style={{
                  display: 'inline-block',
                  background: '#ea580c',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}>
                  Explore Courses
                </Link>
                <Link href="/subscription" style={{
                  display: 'inline-block',
                  border: '2px solid #d1d5db',
                  color: '#374151',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}>
                  View Pricing
                </Link>
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              padding: '1rem'
            }}>
              {[
                { price: '₹99', label: 'Monthly Subscription', color: '#ea580c' },
                { price: '∞', label: 'Unlimited Learning', color: '#16a34a' },
                { price: '1', label: 'Single Platform', color: '#2563eb' },
                { price: 'All', label: 'Educational Levels', color: '#9333ea' }
              ].map((item, index) => (
                <div key={index} style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  textAlign: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: item.color, marginBottom: '0.5rem' }}>
                    {item.price}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ background: 'white', padding: '5rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-block',
              background: '#f3f4f6',
              borderRadius: '9999px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              💡 Our Core Values
            </div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '0.75rem'
            }}>
              What Drives Us Every Day
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              These principles guide every decision we make and every feature we build
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {coreValues.map((value, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '0.75rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center',
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
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {value.icon}
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '0.75rem'
                }}>
                  {value.title}
                </h3>
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  lineHeight: '1.6'
                }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Approach */}
      <section style={{ padding: '5rem 1rem', background: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-block',
              border: '2px solid #9333ea',
              color: '#9333ea',
              borderRadius: '9999px',
              padding: '0.375rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              Our Approach
            </div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '0.75rem'
            }}>
              How We Make Learning Effective
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Our methodology is built on proven educational principles adapted for the Indian context
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {learningApproach.map((approach, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '0.5rem',
                  background: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0
                }}>
                  {approach.icon}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    {approach.title}
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    lineHeight: '1.6'
                  }}>
                    {approach.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section style={{ background: 'white', padding: '5rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-block',
              background: '#f3f4f6',
              borderRadius: '9999px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              📊 Our Impact
            </div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '0.75rem'
            }}>
              Numbers That Matter
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              Real impact, real numbers, real results
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem'
          }}>
            {achievements.map((achievement, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  padding: '2rem 1rem',
                  borderRadius: '0.75rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
                  {index === 0 ? '👥' : index === 1 ? '📚' : index === 2 ? '⭐' : '🎯'}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                  {achievement.number}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{ padding: '5rem 1rem', background: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-block',
              border: '2px solid #4f46e5',
              color: '#4f46e5',
              borderRadius: '9999px',
              padding: '0.375rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              Our Team
            </div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '0.75rem'
            }}>
              Meet the Educators Behind INR99.Academy
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              A diverse team of educators, technologists, and visionaries united by a common mission
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {teamMembers.map((member, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '0.75rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  background: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '2.5rem'
                }}>
                  👤
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  {member.name}
                </h3>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#ea580c',
                  fontWeight: '500',
                  marginBottom: '0.75rem'
                }}>
                  {member.role}
                </div>
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  lineHeight: '1.5'
                }}>
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ padding: '5rem 1rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Ready to Start Your Learning Journey?
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Join thousands of students who have discovered the power of concept-based, 
            affordable learning with INR99.Academy.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/courses" style={{
              display: 'inline-block',
              background: '#ea580c',
              color: 'white',
              padding: '0.875rem 2rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem'
            }}>
              📚 Browse Courses
            </Link>
            <Link href="/subscription" style={{
              display: 'inline-block',
              border: '2px solid #d1d5db',
              color: '#374151',
              padding: '0.875rem 2rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem'
            }}>
              💵 View Pricing
            </Link>
          </div>
          <p style={{
            color: '#9ca3af',
            fontSize: '0.875rem',
            marginTop: '1.5rem'
          }}>
            Start with just ₹99/month • Cancel anytime • Full access to all courses
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#111827',
        color: 'white',
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{
            color: '#9ca3af',
            fontSize: '0.875rem'
          }}>
            © 2026 INR99.Academy - India's Learning Infrastructure
          </p>
        </div>
      </footer>
    </div>
  )
}
