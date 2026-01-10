"use client"

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export function NewNavigation() {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

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
          <div style={{ width: '100px', height: '32px', background: '#f3f4f6', borderRadius: '4px' }}></div>
        </div>
      </nav>
    )
  }

  const user = session?.user

  const navLinks = [
    { href: '/courses', label: 'Courses' },
    { href: '/learning-paths', label: 'Learning Paths' },
    { href: '/instructors', label: 'Instructors' },
    { href: '/community', label: 'Community' },
    { href: '/blog', label: 'Blog' },
    { href: '/subscription', label: 'Pricing' },
  ]

  return (
    <>
      <nav style={{
        background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'white',
        boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.1)',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease'
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
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ 
              background: '#ea580c', 
              color: 'white', 
              padding: '0.5rem 0.75rem', 
              borderRadius: '0.5rem', 
              fontWeight: 'bold',
              fontSize: '1rem'
            }}>
              INR99
            </div>
            <span style={{ 
              fontWeight: 'bold', 
              fontSize: '1.25rem', 
              color: '#1f2937',
              display: 'none',
              '@media (min-width: 768px)': { display: 'block' }
            }}>
              Academy
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div style={{ 
            display: 'none',
            alignItems: 'center', 
            gap: '1.5rem'
          }}>
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                style={{ 
                  color: '#374151', 
                  textDecoration: 'none', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ea580c'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side - Login or User Menu (Desktop) */}
          <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }}>
            {user ? (
              <>
                <Link 
                  href="/dashboard"
                  style={{ 
                    color: '#374151', 
                    textDecoration: 'none', 
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  Dashboard
                </Link>
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>{user.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  style={{
                    background: '#dc2626',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#b91c1c'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#dc2626'}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/auth/login" 
                style={{
                  background: '#ea580c',
                  color: 'white',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#c2410c'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#ea580c'}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '40px',
              height: '40px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{
              display: 'block',
              width: '24px',
              height: '2px',
              background: '#374151',
              marginBottom: '5px',
              transition: 'all 0.3s',
              transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
            }}></span>
            <span style={{
              display: 'block',
              width: '24px',
              height: '2px',
              background: '#374151',
              marginBottom: '5px',
              transition: 'all 0.3s',
              opacity: mobileMenuOpen ? 0 : 1
            }}></span>
            <span style={{
              display: 'block',
              width: '24px',
              height: '2px',
              background: '#374151',
              transition: 'all 0.3s',
              transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
            }}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'white',
          zIndex: 999,
          overflow: 'auto',
          animation: 'slideIn 0.3s ease'
        }}>
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>
          
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Search Bar (Mobile) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: '#f3f4f6',
              borderRadius: '0.5rem'
            }}>
              <svg style={{ width: '20px', height: '20px', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search courses..."
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Mobile Navigation Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  color: '#374151',
                  textDecoration: 'none',
                  borderRadius: '0.5rem',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
              
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    color: '#374151',
                    textDecoration: 'none',
                    borderRadius: '0.5rem',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: '#e5e7eb', margin: '0.5rem 0' }}></div>

            {/* Login/Account Section (Mobile) */}
            {user ? (
              <>
                <Link 
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    color: '#374151',
                    textDecoration: 'none',
                    borderRadius: '0.5rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Dashboard
                </Link>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  color: '#6b7280'
                }}>
                  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {user.name}
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    signOut({ callbackUrl: '/' })
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    width: '100%',
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    justifyContent: 'flex-start',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                >
                  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  width: '100%',
                  background: '#ea580c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#c2410c'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#ea580c'}
              >
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login to Your Account
              </Link>
            )}

            {/* Help Section */}
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Need help?</p>
              <Link 
                href="/contact"
                style={{
                  color: '#ea580c',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
            animation: 'fadeIn 0.3s ease'
          }}
        />
      )}
    </>
  )
}
