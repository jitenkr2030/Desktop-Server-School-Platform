'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export const HeroSectionSimple: React.FC = () => {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState<{ learningPaths: number } | null>(null)

  useEffect(() => {
    setMounted(true)
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()

      if (data.success) {
        setStats({
          learningPaths: data.stats.learningPaths
        })
      }
    } catch (error) {
      console.error('Fetch stats error:', error)
      setStats({
        learningPaths: 14
      })
    }
  }

  if (!mounted) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%)',
        color: 'white',
        padding: '8rem 1rem 4rem',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(255,255,255,0.3)',
          borderTopColor: '#facc15',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%)',
      color: 'white',
      padding: '6rem 1rem 4rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          alignItems: 'center'
        }}>
          {/* Left Content */}
          <div style={{ space: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{
                display: 'inline-block',
                background: 'rgba(250, 204, 21, 0.2)',
                border: '1px solid rgba(250, 204, 21, 0.3)',
                borderRadius: '9999px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.875rem',
                marginRight: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                🚀 Learning Utility Model
              </span>
              <span style={{
                display: 'inline-block',
                background: 'rgba(74, 222, 128, 0.2)',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                borderRadius: '9999px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.875rem'
              }}>
                🎥 New: Live Learning
              </span>
            </div>

            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              lineHeight: '1.2',
              marginBottom: '1rem'
            }}>
              From Class 1 to Career — <br />
              <span style={{ color: '#facc15' }}>Learning for Every Indian</span>
            </h1>

            <p style={{
              fontSize: '1.25rem',
              color: '#bfdbfe',
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              A learning utility, just like UPI — for every Indian student
            </p>

            {/* Key Features */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ color: '#facc15' }}>✓</span>
                <span style={{ fontSize: '1rem' }}>Concept clarity, not exam coaching</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ color: '#facc15' }}>✓</span>
                <span style={{ fontSize: '1rem' }}>Foundation strengthening for long-term success</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#facc15' }}>✓</span>
                <span style={{ fontSize: '1rem' }}>School + College + Skills in one platform</span>
              </div>
            </div>

            {/* Pricing Card */}
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              maxWidth: '320px',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ fontSize: '1.5rem', color: '#facc15' }}>₹</span>
                    <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>99</span>
                    <span style={{ color: '#bfdbfe' }}>/month</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#bfdbfe', marginTop: '0.25rem' }}>Everything included</p>
                </div>
                <span style={{
                  background: '#facc15',
                  color: '#1e40af',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  BEST VALUE
                </span>
              </div>
              <Link href="/auth/login" style={{
                display: 'block',
                background: '#facc15',
                color: '#1e40af',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                textAlign: 'center',
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                Start Learning Today →
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#facc15' }}>1-12</div>
                <div style={{ fontSize: '0.875rem', color: '#bfdbfe' }}>School Classes</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#facc15' }}>
                  {stats ? `${stats.learningPaths}+` : '14+'}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#bfdbfe' }}>Learning Paths</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#facc15' }}>₹99</div>
                <div style={{ fontSize: '0.875rem', color: '#bfdbfe' }}>Monthly</div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { icon: '📚', title: 'School Learning', desc: 'Class 1-12 with all boards' },
                { icon: '🎓', title: 'College Foundation', desc: 'UG degrees and subjects' },
                { icon: '💼', title: 'Career Skills', desc: 'Professional development' },
                { icon: '💰', title: 'Money & Business', desc: 'Financial literacy' }
              ].map((item, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '0.75rem',
                  padding: '1.5rem'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                  <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#bfdbfe' }}>{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Floating Badge */}
            <div style={{
              position: 'absolute',
              top: '-1rem',
              right: '-1rem',
              background: '#facc15',
              color: '#1e40af',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontWeight: '600',
              fontSize: '0.875rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              Trusted by 50,000+ Students
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
