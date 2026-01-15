"use client"

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Assessment {
  id: string
  title: string
  type: 'QUIZ' | 'PRACTICE' | 'SCENARIO'
  course: {
    id: string
    title: string
  }
  lesson?: {
    id: string
    title: string
  }
  questions: Array<{
    id: string
    question: string
    type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER'
    options?: string[]
    explanation?: string
  }>
  alreadyCompleted?: boolean
  previousScore?: number
}

interface AssessmentResult {
  id: string
  score: number
  correctAnswers: number
  totalQuestions: number
  passed: boolean
  assessment: {
    id: string
    title: string
    type: string
  }
}

function AssessmentContent() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const assessmentId = params.id as string
  
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPlayer, setShowPlayer] = useState(false)
  const [result, setResult] = useState<AssessmentResult | null>(null)

  const isAuthenticated = status === 'authenticated'

  useEffect(() => {
    if (isAuthenticated) {
      fetchAssessment()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, assessmentId])

  const fetchAssessment = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/assessments/${assessmentId}`)
      const data = await response.json()

      if (data.success) {
        setAssessment(data.assessment)
      } else {
        setError(data.message || 'Failed to load assessment')
      }
    } catch (error) {
      console.error('Fetch assessment error:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleStartAssessment = () => {
    setShowPlayer(true)
    setResult(null)
  }

  const handleAssessmentComplete = (assessmentResult: AssessmentResult) => {
    setResult(assessmentResult)
    setShowPlayer(false)
  }

  const handleExit = () => {
    router.back()
  }

  const getAssessmentTypeColor = (type: string) => {
    switch (type) {
      case 'QUIZ':
        return { bg: '#dbeafe', color: '#1e40af' }
      case 'PRACTICE':
        return { bg: '#dcfce7', color: '#166534' }
      case 'SCENARIO':
        return { bg: '#f3e8ff', color: '#6b21a8' }
      default:
        return { bg: '#f3f4f6', color: '#374151' }
    }
  }

  const formatTime = (_minutes: number) => {
    return 'As needed'
  }

  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f9fafb',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{ maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>Login Required</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Please login to access assessments and track your progress.</p>
          <Link href="/courses" style={{
            display: 'inline-block',
            background: '#ea580c',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            Back to Courses
          </Link>
        </div>
      </div>
    )
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

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f9fafb',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{ maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>Error</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>{error}</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button
              onClick={fetchAssessment}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
            <Link href="/courses" style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: '#ea580c',
              color: 'white',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f9fafb',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>Assessment not found</h2>
          <Link href="/courses" style={{
            display: 'inline-block',
            background: '#ea580c',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  const typeColor = getAssessmentTypeColor(assessment.type)

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href={`/courses/${assessment.course.id}`}>
              <button
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  background: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.875rem'
                }}
              >
                ← Back
              </button>
            </Link>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{assessment.title}</h1>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                <span>📚 {assessment.course.title}</span>
                {assessment.lesson && <span>Lesson: {assessment.lesson.title}</span>}
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: '600',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  background: typeColor.bg,
                  color: typeColor.color
                }}>
                  {assessment.type}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        {result ? (
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: '#dcfce7', 
                display: 'flex',
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '2.5rem'
              }}>
                🏆
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>Assessment Complete</h2>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                {Math.round(result.score)}%
              </div>
              <span style={{ 
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600',
                background: result.passed ? '#dcfce7' : '#fee2e2',
                color: result.passed ? '#166534' : '#991b1b'
              }}>
                {result.passed ? 'PASSED' : 'FAILED'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>{result.correctAnswers}</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Correct Answers</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{result.totalQuestions}</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Questions</div>
              </div>
            </div>

            {result.passed && (
              <div style={{ 
                padding: '1rem', 
                background: '#dcfce7', 
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>✅</span>
                <span style={{ color: '#166534' }}>Congratulations! You have successfully completed the assessment.</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleStartAssessment}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  background: 'white',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Retake Assessment
              </button>
              <Link href={`/courses/${assessment.course.id}`} style={{ flex: 1 }}>
                <button
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    background: '#ea580c',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Continue Learning
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📋</span> Assessment Information
              </h3>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ textAlign: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
                    {assessment.questions.length}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Questions</div>
                </div>
                <div style={{ textAlign: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
                    {formatTime(assessment.questions.length)}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Time Limit</div>
                </div>
                <div style={{ textAlign: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
                    70%
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Passing Score</div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Assessment Type:</h4>
                <span style={{ 
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  background: typeColor.bg,
                  color: typeColor.color
                }}>
                  {assessment.type}
                </span>
              </div>

              <div>
                <h4 style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Instructions:</h4>
                <ul style={{ fontSize: '0.875rem', color: '#6b7280', paddingLeft: '1.25rem', lineHeight: '1.8' }}>
                  <li>Read each question carefully before answering</li>
                  <li>You can navigate between questions using the Previous/Next buttons</li>
                  <li>Your progress is saved automatically</li>
                  <li>You need 70% or higher to pass</li>
                  <li>Once submitted, you cannot change your answers</li>
                </ul>
              </div>
            </div>

            {assessment.alreadyCompleted && assessment.previousScore && (
              <div style={{ 
                padding: '1rem', 
                background: '#fef9c3', 
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>⏰</span>
                <span style={{ color: '#854d0e' }}>
                  You previously completed this assessment with a score of {Math.round(assessment.previousScore)}%. 
                  You can retake it to improve your score.
                </span>
              </div>
            )}

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleStartAssessment}
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1.125rem',
                  background: '#ea580c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Start Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function LoadingFallback() {
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

export default function AssessmentPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AssessmentContent />
    </Suspense>
  )
}
