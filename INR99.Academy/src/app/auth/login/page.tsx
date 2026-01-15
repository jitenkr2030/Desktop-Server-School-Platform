"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check for error in URL (from NextAuth redirect)
  const authError = searchParams.get('error')
  if (authError && !error) {
    setError(getAuthErrorMessage(authError))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/dashboard',
      })

      if (result?.error) {
        setError(result.error || 'Invalid email or password')
      } else if (result?.url) {
        // Redirect to dashboard or the returned URL
        router.push(result.url)
        router.refresh()
      } else {
        // Default redirect
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function getAuthErrorMessage(error: string): string {
    switch (error) {
      case 'CredentialsSignin':
        return 'Invalid email or password'
      case 'OAuthSigninError':
        return 'Error starting OAuth sign in'
      default:
        return 'An error occurred during sign in'
    }
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
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <div style={{ background: '#ea580c', color: 'white', padding: '0.5rem', borderRadius: '0.5rem', fontWeight: 'bold' }}>INR99</div>
          <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#1f2937' }}>Academy</span>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem' }}>
            Welcome Back
          </h1>
          <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            Sign in to continue learning
          </p>

          {error && (
            <div style={{ padding: '0.75rem', background: '#fef2f2', color: '#dc2626', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
                marginTop: '0.5rem'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '6px', marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Demo:</p>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              <p>Student: student1@inr99.com</p>
              <p>Password: demo123</p>
            </div>
          </div>

          {/* Registration Link */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Don't have an account?{' '}
              <a
                href="/auth/register"
                style={{ color: '#ea580c', fontWeight: '600', textDecoration: 'none' }}
              >
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
