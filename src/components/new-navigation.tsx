"use client"

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export function NewNavigation() {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ background: '#ea580c', color: 'white', padding: '0.5rem', borderRadius: '0.5rem', fontWeight: 'bold' }}>INR99</div>
          <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#1f2937' }}>Academy</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/courses" style={{ color: '#374151', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
            Courses
          </Link>
          <Link href="/learning-paths" style={{ color: '#374151', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
            Learning Paths
          </Link>
          <Link href="/instructors" style={{ color: '#374151', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
            Instructors
          </Link>
          <Link href="/community" style={{ color: '#374151', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
            Community
          </Link>
          <Link href="/blog" style={{ color: '#374151', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
            Blog
          </Link>
          <Link href="/subscription" style={{ color: '#374151', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
            Pricing
          </Link>
          
          {/* More Dropdown */}
          <div style={{ position: 'relative' }} 
            onMouseEnter={() => setMoreMenuOpen(true)}
            onMouseLeave={() => setMoreMenuOpen(false)}
          >
            <button style={{ 
              color: '#374151', 
              textDecoration: 'none', 
              fontSize: '0.875rem', 
              fontWeight: '500',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              More
              <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {moreMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                marginTop: '0.5rem',
                background: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                minWidth: '200px',
                padding: '0.5rem 0',
                zIndex: 50
              }}>
                <Link href="/about" style={{ display: 'block', padding: '0.5rem 1rem', color: '#374151', textDecoration: 'none', fontSize: '0.875rem' }}>
                  About Us
                </Link>
                <Link href="/faq" style={{ display: 'block', padding: '0.5rem 1rem', color: '#374151', textDecoration: 'none', fontSize: '0.875rem' }}>
                  FAQ
                </Link>
                <Link href="/career" style={{ display: 'block', padding: '0.5rem 1rem', color: '#374151', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Careers
                </Link>
                <Link href="/contact" style={{ display: 'block', padding: '0.5rem 1rem', color: '#374151', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Contact
                </Link>
                <Link href="/terms" style={{ display: 'block', padding: '0.5rem 1rem', color: '#374151', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Terms of Service
                </Link>
                <Link href="/privacy" style={{ display: 'block', padding: '0.5rem 1rem', color: '#374151', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Privacy Policy
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Login or Logout or User Menu */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#374151', fontSize: '0.875rem' }}>{user.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              style={{
                background: '#dc2626',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/auth/login" style={{
            background: '#ea580c',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '0.875rem'
          }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}
