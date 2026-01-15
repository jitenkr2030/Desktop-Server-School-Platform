"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface CertificateData {
  id: string
  certificateNumber: string
  issuedAt: string
  verified: boolean
  verificationUrl: string
  course: {
    title: string
    description: string
    difficulty: string
  }
  user: {
    name: string
    email: string
  }
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateData[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session, status } = useSession()

  const user = session?.user
  const isAuthenticated = status === 'authenticated'

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCertificates()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  const fetchCertificates = async () => {
    if (!user) return

    try {
      const response = await fetch('/api/certificates', {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setCertificates(data)
      } else {
        // Silently handle error for demo
        console.log('No certificates found')
      }
    } catch (error) {
      console.log('Failed to fetch certificates')
    } finally {
      setLoading(false)
    }
  }

  const downloadCertificate = (certificate: CertificateData) => {
    const certificateData = {
      certificateNumber: certificate.certificateNumber,
      studentName: certificate.user.name,
      courseName: certificate.course.title,
      issueDate: new Date(certificate.issuedAt).toLocaleDateString(),
      verificationUrl: certificate.verificationUrl
    }

    const blob = new Blob([JSON.stringify(certificateData, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `certificate-${certificate.certificateNumber}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return { background: '#dcfce7', color: '#166534' }
      case 'INTERMEDIATE':
        return { background: '#fef9c3', color: '#854d0e' }
      case 'ADVANCED':
        return { background: '#fee2e2', color: '#991b1b' }
      default:
        return { background: '#f3f4f6', color: '#374151' }
    }
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f9fafb',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          border: '4px solid #f97316', 
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f9fafb',
        padding: '2rem 1rem'
      }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: '#f3f4f6', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2.5rem'
          }}>
            🏆
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            Authentication Required
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Please log in to view your certificates
          </p>
          <Link href="/auth/login" style={{
            display: 'inline-block',
            background: '#ea580c',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f9fafb',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>🏆</span>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>My Certificates</h1>
          </div>
          <p style={{ fontSize: '1rem', color: '#6b7280' }}>
            View and download your course completion certificates
          </p>
        </div>

        {/* Certificates Grid */}
        {certificates.length > 0 ? (
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {certificates.map((certificate) => {
              const difficultyColor = getDifficultyColor(certificate.course.difficulty)
              return (
                <div 
                  key={certificate.id}
                  style={{ 
                    background: 'white',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
                >
                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        background: difficultyColor.background,
                        color: difficultyColor.color
                      }}>
                        {certificate.course.difficulty}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ fontSize: '1rem' }}>
                          {certificate.verified ? '✅' : '🏅'}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {certificate.verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                      {certificate.course.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem', lineHeight: '1.5' }}>
                      {certificate.course.description}
                    </p>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        <span style={{ color: '#6b7280' }}>Certificate Number:</span>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#374151' }}>{certificate.certificateNumber}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        <span style={{ color: '#6b7280' }}>Issued Date:</span>
                        <span style={{ color: '#374151' }}>{new Date(certificate.issuedAt).toLocaleDateString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <span style={{ color: '#6b7280' }}>Student:</span>
                        <span style={{ color: '#374151' }}>{certificate.user.name}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => downloadCertificate(certificate)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          background: 'white',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        ⬇️ Download
                      </button>
                      <button
                        onClick={() => window.open(certificate.verificationUrl, '_blank')}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          background: 'white',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        🔗 Verify
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              background: '#f3f4f6', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '3rem'
            }}>
              🏆
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
              No certificates yet
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Complete courses to earn your certificates
            </p>
            <Link href="/courses" style={{
              display: 'inline-block',
              background: '#ea580c',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
