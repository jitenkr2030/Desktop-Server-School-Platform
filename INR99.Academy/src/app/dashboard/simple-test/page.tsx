"use client"

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function SimpleDashboardTest() {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f9fafb', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #ea580c', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f9fafb', 
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Debug Info */}
        <div style={{ 
          background: status === 'authenticated' ? '#dcfce7' : '#fef3c7', 
          padding: '1rem', 
          borderRadius: '0.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>Debug Info</h2>
          <p style={{ margin: '0.25rem 0' }}><strong>Status:</strong> {status}</p>
          <p style={{ margin: '0.25rem 0' }}><strong>Mounted:</strong> {mounted ? 'Yes' : 'No'}</p>
          <p style={{ margin: '0.25rem 0' }}><strong>Has Session:</strong> {session ? 'Yes' : 'No'}</p>
          {session?.user && (
            <>
              <p style={{ margin: '0.25rem 0' }}><strong>Name:</strong> {session.user.name}</p>
              <p style={{ margin: '0.25rem 0' }}><strong>Email:</strong> {session.user.email}</p>
            </>
          )}
        </div>

        {/* Content */}
        {status === 'authenticated' && session?.user ? (
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Welcome back, {session.user.name}! 🎉
            </h1>
            <p style={{ color: '#6b7280' }}>
              Your dashboard is working! Now we can add more features.
            </p>
          </div>
        ) : status === 'loading' ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              border: '4px solid #ea580c', 
              borderTop: '4px solid transparent', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading session...</p>
          </div>
        ) : (
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Not Logged In
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Please log in to view your dashboard.
            </p>
            <a 
              href="/auth/login"
              style={{
                display: 'inline-block',
                background: '#ea580c',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Go to Login
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
