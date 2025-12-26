"use client"

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
  role: string
}

function getDashboardLink(role: string): string {
  switch (role) {
    case 'ADMIN':
    case 'SUPER_ADMIN':
      return '/admin'
    case 'INSTRUCTOR':
      return '/instructor'
    default:
      return '/dashboard'
  }
}

export function NewNavigation() {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    await signOut({
      redirect: false,
      callbackUrl: '/'
    })
    window.location.reload()
  }

  const navLinks = [
    { href: '/courses', label: 'Courses' },
    { href: '/learning-paths', label: 'Learning Paths' },
    { href: '/community', label: 'Community' },
    { href: '/subscription', label: 'Pricing' },
    { href: '/about', label: 'About' }
  ]

  // Show minimal nav while mounting
  if (!mounted) {
    return (
      <nav style={{
        background: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ width: '140px', height: '32px', background: '#f3f4f6', borderRadius: '4px' }}></div>
        </div>
      </nav>
    )
  }

  const user = session?.user as User | undefined
  const dashboardLink = user ? getDashboardLink(user.role) : '/dashboard'

  return (
    <nav style={{
      background: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      position: 'fixed',
      width: '100%',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          textDecoration: 'none'
        }}>
          <div style={{
            background: '#ea580c',
            color: 'white',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#1f2937'
          }}>INR99.Academy</span>
        </Link>

        {/* Navigation Links - Show only when logged out */}
        {!user && (
          <div style={{
            display: 'none',
            gap: '1.5rem'
          }} className="nav-links">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                style={{
                  color: '#4b5563',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Login Button (when not logged in) or User Menu (when logged in) */}
        {user ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#f3f4f6',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#ea580c',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>
                {user.name}
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Simplified Dropdown - Only Dashboard and Logout */}
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                background: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                minWidth: '180px',
                overflow: 'hidden',
                zIndex: 200
              }}>
                {/* User info */}
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                  <p style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>{user.name}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>{user.email}</p>
                </div>

                {/* Only Dashboard and Logout */}
                <a href={dashboardLink} style={{ display: 'block', padding: '0.75rem 1rem', color: '#374151', textDecoration: 'none', fontSize: '0.875rem' }}>
                  📊 Dashboard
                </a>

                <div style={{ borderTop: '1px solid #e5e7eb', padding: '0.5rem' }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      background: '#fef2f2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      textAlign: 'left'
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link href="/auth/login" style={{
            background: '#ea580c',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Login
          </Link>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .nav-links {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  )
}
