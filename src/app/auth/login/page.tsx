"use client"

import { useState, useEffect, Suspense } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Inner component that uses useSearchParams
function LoginForm() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'error' | 'success' | ''>('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // Callback URL - where to redirect after login
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (mounted && status === 'authenticated' && session?.user) {
      // Use router for client-side navigation (smoother than window.location)
      router.push(callbackUrl)
    }
  }, [mounted, status, session, callbackUrl, router])

  // Show minimal loading state only for initial mount
  // Don't show loading spinner for session status to avoid blink
  if (!mounted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #fef7f0, #ffffff, #f0fdf4)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '1rem'
      }}>
        {/* Minimal placeholder - no loading spinner */}
        <div style={{ width: '100%', maxWidth: '400px' }}></div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setMessageType('')

    try {
      // Use NextAuth's signIn function
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      console.log('SignIn result:', result)

      if (result?.error) {
        // Handle specific error messages
        if (result.error.includes('Too many login attempts')) {
          setMessage('Too many login attempts. Please wait 15 minutes before trying again.')
        } else if (result.error.includes('Account locked')) {
          setMessage('Your account has been locked due to too many failed login attempts. Please try again later.')
        } else {
          // Generic error message to prevent user enumeration
          setMessage('Invalid email or password')
        }
        setMessageType('error')
      } else if (result?.ok) {
        // Login successful - use router for smooth navigation
        router.push(callbackUrl)
      } else {
        setMessage('An error occurred. Please try again.')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Login error:', error)
      setMessage('An error occurred. Please try again.')
      setMessageType('error')
    }

    setLoading(false)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fef7f0, #ffffff, #f0fdf4)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Back to Home */}
        <Link href="/" style={{ 
          display: 'inline-flex', 
          alignItems: 'center',
          color: '#6b7280', 
          textDecoration: 'none',
          marginBottom: '1.5rem',
          fontSize: '0.875rem'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#ea580c'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
        >
          <span style={{ marginRight: '0.5rem' }}>←</span>
          Back to Home
        </Link>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid #f3f4f6'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              background: 'linear-gradient(135deg, #ea580c, #16a34a)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.5rem'
            }}>
              📚
            </div>
            <h1 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#1f2937',
              margin: 0
            }}>
              Welcome Back
            </h1>
            <p style={{ 
              color: '#6b7280', 
              marginTop: '0.5rem',
              fontSize: '0.875rem'
            }}>
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <div style={{
              padding: '0.75rem',
              borderRadius: '6px',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              backgroundColor: messageType === 'error' ? '#fef2f2' : '#f0fdf4',
              color: messageType === 'error' ? '#dc2626' : '#16a34a',
              border: `1px solid ${messageType === 'error' ? '#fecaca' : '#bbf7d0'}`
            }}>
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                autoComplete="email"
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                autoComplete="current-password"
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '44px',
                backgroundColor: loading ? '#9ca3af' : '#ea580c',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '0.5rem',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#c2410c'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#ea580c'
                }
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Accounts Info */}
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '1rem',
            borderRadius: '6px',
            marginTop: '1.5rem'
          }}>
            <p style={{ 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#374151',
              margin: '0 0 0.5rem 0'
            }}>
              Demo Accounts:
            </p>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.6' }}>
              <p style={{ margin: '0 0 0.25rem 0' }}><strong>Student:</strong> student1@inr99.com</p>
              <p style={{ margin: '0 0 0.25rem 0' }}><strong>Instructor:</strong> instructor1@inr99.com</p>
              <p style={{ margin: '0 0 0.25rem 0' }}><strong>Admin:</strong> admin1@inr99.com</p>
              <p style={{ margin: '0 0 0.25rem 0' }}><strong>Super Admin:</strong> superadmin1@inr99.com</p>
              <p style={{ marginTop: '0.5rem', color: '#ea580c', fontWeight: '500' }}>
                Password for all: demo123
              </p>
            </div>
          </div>

          {/* Register Link */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '1.5rem',
            fontSize: '0.875rem'
          }}>
            <span style={{ color: '#6b7280' }}>Don't have an account? </span>
            <Link href="/auth/register" style={{ 
              fontWeight: '600', 
              color: '#ea580c',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading fallback for Suspense
function LoginLoading() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fef7f0, #ffffff, #f0fdf4)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          border: '3px solid #f97316', 
          borderTop: '3px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  )
}