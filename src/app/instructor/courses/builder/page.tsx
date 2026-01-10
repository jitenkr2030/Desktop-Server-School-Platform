'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { NewNavigation } from '@/components/new-navigation'
import { Lock, CreditCard, Loader2, Crown, Check, ChevronRight } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  type: string
  videoUrl?: string
  audioUrl?: string
  order: number
  isFree: boolean
  isPublished: boolean
  conversionJob?: {
    id: string
    status: string
    progress: number
    outputVideoUrl?: string
    outputAudioUrl?: string
    errorMessage?: string
  }
}

interface Module {
  id: string
  title: string
  description?: string
  order: number
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  isPublished: boolean
  modules: Module[]
  lessons: Lesson[]
}

export default function CourseBuilderPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'structure' | 'settings'>('structure')
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [showPPTXModal, setShowPPTXModal] = useState(false)
  const [selectedLessonForPPTX, setSelectedLessonForPPTX] = useState<Lesson | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [converting, setConverting] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  const [courseLimit, setCourseLimit] = useState<{ allowed: boolean; reason?: string; currentCount: number; maxAllowed: number } | null>(null)

  useEffect(() => {
    setMounted(true)
    checkSubscriptionAndLoad()
  }, [])

  const checkSubscriptionAndLoad = async () => {
    try {
      // Check subscription status
      const response = await fetch('/api/instructor/subscription/status?userId=instructor1')
      const data = await response.json()

      if (data.success) {
        setSubscriptionData(data.data)
        setCourseLimit(data.data.permissions.canCreateCourse)

        if (!data.data.permissions.canCreateCourse.allowed) {
          // Show upgrade modal if limit reached
          setShowUpgradeModal(true)
        }
      }

      // Load course data
      loadCourse()
    } catch (error) {
      console.error('Failed to check subscription:', error)
      loadCourse()
    }
  }

  const loadCourse = async () => {
    try {
      // In production, fetch from API
      setCourse({
        id: 'demo-course-1',
        title: 'Complete Physics Course - Class 11',
        description: 'Master Physics concepts with comprehensive video lessons',
        isPublished: false,
        modules: [
          {
            id: 'module-1',
            title: 'Unit 1: Physical World',
            description: 'Understanding the fundamentals of physics',
            order: 1,
            lessons: [
              { id: 'lesson-1', title: 'What is Physics?', type: 'VIDEO', order: 1, isFree: true, isPublished: false },
              { id: 'lesson-2', title: 'Chapter 1 PPTX', type: 'PPTX', order: 2, isFree: false, isPublished: false, conversionJob: { id: 'job-1', status: 'COMPLETED', progress: 100, outputVideoUrl: '/demo-video.mp4' } },
            ]
          },
          {
            id: 'module-2',
            title: 'Unit 2: Units and Measurements',
            description: 'Learn about units and measurement systems',
            order: 2,
            lessons: [
              { id: 'lesson-3', title: 'Introduction to Units', type: 'VIDEO', order: 1, isFree: false, isPublished: false },
              { id: 'lesson-4', title: 'SI Units', type: 'AUDIO', order: 2, isFree: false, isPublished: false },
            ]
          }
        ],
        lessons: []
      })
    } catch (error) {
      console.error('Failed to load course:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId)
      } else {
        newSet.add(moduleId)
      }
      return newSet
    })
  }

  const addModule = async () => {
    if (!course) return

    // Check subscription limit
    if (courseLimit && !courseLimit.allowed) {
      setShowUpgradeModal(true)
      return
    }

    const title = prompt('Enter module title:')
    if (!title) return

    const newModule: Module = {
      id: `module-${Date.now()}`,
      title,
      order: course.modules.length + 1,
      lessons: []
    }

    setCourse(prev => prev ? { ...prev, modules: [...prev.modules, newModule] } : null)
  }

  const addLesson = (moduleId: string | null) => {
    const title = prompt('Enter lesson title:')
    if (!title) return

    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title,
      type: 'VIDEO',
      order: 1,
      isFree: false,
      isPublished: false
    }

    if (moduleId) {
      // Add to module
      setCourse(prev => prev ? {
        ...prev,
        modules: prev.modules.map(m => 
          m.id === moduleId 
            ? { ...m, lessons: [...m.lessons, { ...newLesson, order: m.lessons.length + 1 }] }
            : m
        )
      } : null)
    } else {
      // Add to course (standalone lesson)
      setCourse(prev => prev ? {
        ...prev,
        lessons: [...prev.lessons, { ...newLesson, order: prev.lessons.length + 1 }]
      } : null)
    }
  }

  const handlePPTXUpload = async (lessonId: string, file: File) => {
    setUploadProgress(0)
    
    try {
      // Step 1: Get upload URL
      setUploadProgress(10)
      const uploadResponse = await fetch('/api/course-builder/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type
        })
      })
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to get upload URL')
      }
      
      const { uploadUrl, fileUrl } = await uploadResponse.json()
      setUploadProgress(30)

      // Step 2: Upload file (mock for demo)
      // In production, upload to S3/UploadThing
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUploadProgress(60)

      // Step 3: Create conversion job
      setConverting(true)
      const convertResponse = await fetch('/api/course-builder/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          targetFormat: 'BOTH'
        })
      })

      if (!convertResponse.ok) {
        throw new Error('Failed to start conversion')
      }

      setUploadProgress(100)
      setConverting(false)
      setShowPPTXModal(false)
      
      // Update lesson with conversion job
      setCourse(prev => prev ? {
        ...prev,
        modules: prev.modules.map(m => ({
          ...m,
          lessons: m.lessons.map(l => 
            l.id === lessonId 
              ? { ...l, type: 'PPTX', conversionJob: { id: 'new-job', status: 'PENDING', progress: 0 } }
              : l
          )
        }))
      } : null)

      alert('PPTX uploaded successfully! Conversion will start shortly.')
      
    } catch (error: any) {
      console.error('PPTX upload error:', error)
      setConverting(false)
      setUploadProgress(0)
      alert('Failed to upload PPTX: ' + error.message)
    }
  }

  const deleteLesson = (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return
    
    setCourse(prev => prev ? {
      ...prev,
      modules: prev.modules.map(m => ({
        ...m,
        lessons: m.lessons.filter(l => l.id !== lessonId)
      })),
      lessons: prev.lessons.filter(l => l.id !== lessonId)
    } : null)
  }

  const deleteModule = (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module and all its lessons?')) return
    
    setCourse(prev => prev ? {
      ...prev,
      modules: prev.modules.filter(m => m.id !== moduleId)
    } : null)
  }

  const getStatusBadge = (lesson: Lesson) => {
    if (lesson.type !== 'PPTX') return null
    
    const job = lesson.conversionJob
    if (!job) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1 animate-pulse"></span>
          Pending
        </span>
      )
    }

    switch (job.status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1 animate-pulse"></span>
            Queued
          </span>
        )
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"></span>
            Converting {job.progress}%
          </span>
        )
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="mr-1">✓</span>
            Ready
          </span>
        )
      case 'FAILED':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <span className="mr-1">✕</span>
            Failed
          </span>
        )
      default:
        return null
    }
  }

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <div style={{ paddingTop: '64px' }}></div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course builder...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NewNavigation />

      <div style={{ minHeight: '100vh', background: '#f9fafb', paddingTop: '64px' }}>
        {/* Header */}
        <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1.5rem 2rem' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <button
                  onClick={() => router.push('/instructor/courses')}
                  style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ← Back to Courses
                </button>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                  {course?.title || 'Course Builder'}
                </h1>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {course?.modules.length || 0} Modules • {course?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 0} Lessons
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {subscriptionData?.currentPlan && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: subscriptionData.currentPlan.id === 'PRO' ? '#fef3c7' : '#f3f4f6',
                    borderRadius: '9999px',
                    border: `1px solid ${subscriptionData.currentPlan.id === 'PRO' ? '#d97706' : '#e5e7eb'}`
                  }}>
                    <Crown size={16} color={subscriptionData.currentPlan.id === 'PRO' ? '#d97706' : '#6b7280'} />
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: subscriptionData.currentPlan.id === 'PRO' ? '#92400e' : '#374151'
                    }}>
                      {subscriptionData.currentPlan.name} Plan
                    </span>
                  </div>
                )}
                <button
                  onClick={() => router.push('/instructor/pricing')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    background: 'white',
                    color: '#4f46e5',
                    border: '1px solid #4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <CreditCard size={16} />
                  Manage Subscription
                </button>
                <button
                  onClick={() => setActiveTab('structure')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    background: activeTab === 'structure' ? '#ea580c' : '#f3f4f6',
                    color: activeTab === 'structure' ? 'white' : '#374151',
                    border: 'none'
                  }}
                >
                  📚 Structure
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    background: activeTab === 'settings' ? '#ea580c' : '#f3f4f6',
                    color: activeTab === 'settings' ? 'white' : '#374151',
                    border: 'none'
                  }}
                >
                  ⚙️ Settings
                </button>
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    background: '#16a34a',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  {course?.isPublished ? '✓ Published' : '🚀 Publish Course'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
            
            {/* Left: Course Structure */}
            <div>
              {/* Modules List */}
              {course?.modules.map((module) => (
                <div
                  key={module.id}
                  style={{
                    background: 'white',
                    borderRadius: '1rem',
                    marginBottom: '1rem',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  {/* Module Header */}
                  <div
                    style={{
                      padding: '1rem 1.5rem',
                      background: expandedModules.has(module.id) ? '#fef3c7' : '#f9fafb',
                      borderBottom: expandedModules.has(module.id) ? '1px solid #e5e7eb' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => toggleModule(module.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>
                        {expandedModules.has(module.id) ? '📂' : '📁'}
                      </span>
                      <div>
                        <h3 style={{ fontWeight: '600', color: '#111827' }}>{module.title}</h3>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {module.lessons.length} lessons
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteModule(module.id); }}
                        style={{
                          padding: '0.375rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          color: '#dc2626',
                          background: 'none',
                          border: '1px solid #fecaca',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                      <span style={{ color: '#9ca3af', fontSize: '1rem' }}>
                        {expandedModules.has(module.id) ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Lessons */}
                  {expandedModules.has(module.id) && (
                    <div style={{ padding: '0.5rem' }}>
                      {module.lessons.map((lesson, index) => (
                        <div
                          key={lesson.id}
                          style={{
                            padding: '0.75rem 1rem',
                            margin: '0.25rem 0.5rem',
                            borderRadius: '0.5rem',
                            background: '#f9fafb',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                          }}
                        >
                          <span style={{ color: '#9ca3af', fontSize: '0.875rem', width: '1.5rem' }}>
                            {index + 1}
                          </span>
                          <span style={{ fontSize: '1.25rem' }}>
                            {lesson.type === 'VIDEO' ? '🎬' : lesson.type === 'AUDIO' ? '🎵' : lesson.type === 'PPTX' ? '📊' : '📄'}
                          </span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: '500', color: '#111827' }}>{lesson.title}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                              <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'capitalize' }}>
                                {lesson.type.toLowerCase()}
                              </span>
                              {getStatusBadge(lesson)}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button
                              onClick={() => setEditingLesson(lesson)}
                              style={{
                                padding: '0.375rem 0.5rem',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
                                background: '#dbeafe',
                                color: '#1d4ed8',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              Edit
                            </button>
                            {lesson.type === 'TEXT' && (
                              <button
                                onClick={() => {
                                  setSelectedLessonForPPTX(lesson)
                                  setShowPPTXModal(true)
                                }}
                                style={{
                                  padding: '0.375rem 0.5rem',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.75rem',
                                  background: '#fef3c7',
                                  color: '#b45309',
                                  border: 'none',
                                  cursor: 'pointer'
                                }}
                              >
                                📊 PPTX
                              </button>
                            )}
                            <button
                              onClick={() => deleteLesson(lesson.id)}
                              style={{
                                padding: '0.375rem 0.5rem',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
                                background: '#fee2e2',
                                color: '#dc2626',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add Lesson Button */}
                      <button
                        onClick={() => addLesson(module.id)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          marginTop: '0.5rem',
                          border: '2px dashed #d1d5db',
                          borderRadius: '0.5rem',
                          background: 'none',
                          color: '#6b7280',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        ➕ Add Lesson
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Module Button */}
              <button
                onClick={addModule}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px dashed #d1d5db',
                  borderRadius: '1rem',
                  background: 'none',
                  color: '#6b7280',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                📁 Create New Module
              </button>
            </div>

            {/* Right: Course Info */}
            <div>
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                  Course Details
                </h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#374151', marginBottom: '0.25rem' }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={course?.title || ''}
                    onChange={(e) => setCourse(prev => prev ? { ...prev, title: e.target.value } : null)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#374151', marginBottom: '0.25rem' }}>
                    Description
                  </label>
                  <textarea
                    value={course?.description || ''}
                    onChange={(e) => setCourse(prev => prev ? { ...prev, description: e.target.value } : null)}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#374151', marginBottom: '0.25rem' }}>
                    Thumbnail
                  </label>
                  <div style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}>
                    <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>🖼️</span>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Click to upload thumbnail
                    </span>
                  </div>
                </div>

                <div style={{
                  padding: '1rem',
                  background: '#f0fdf4',
                  borderRadius: '0.5rem',
                  border: '1px solid #bbf7d0'
                }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#166534', marginBottom: '0.5rem' }}>
                    💡 Quick Tips
                  </h4>
                  <ul style={{ fontSize: '0.75rem', color: '#15803d', paddingLeft: '1rem' }}>
                    <li>Create modules to organize lessons</li>
                    <li>Upload PPTX files for auto-conversion</li>
                    <li>Set lessons as "Free Preview"</li>
                    <li>Publish when ready to launch</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PPTX Upload Modal */}
      {showPPTXModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            width: '100%',
            maxWidth: '500px'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              📊 Upload PPTX for Conversion
            </h2>
            
            <div style={{
              border: '2px dashed #d1d5db',
              borderRadius: '0.75rem',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '1rem',
              cursor: 'pointer'
            }}>
              <input
                type="file"
                accept=".pptx"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file && selectedLessonForPPTX) {
                    handlePPTXUpload(selectedLessonForPPTX.id, file)
                  }
                }}
                style={{ display: 'none' }}
                id="pptx-upload"
              />
              <label htmlFor="pptx-upload" style={{ cursor: 'pointer' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem' }}>📊</span>
                <span style={{ fontSize: '1rem', color: '#374151' }}>
                  Click to upload PPTX file
                </span>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  Maximum file size: 50MB
                </p>
              </label>
            </div>

            {(uploadProgress > 0 || converting) && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                    {converting ? 'Converting to Video & Audio...' : 'Uploading...'}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                    {uploadProgress}%
                  </span>
                </div>
                <div style={{
                  height: '8px',
                  background: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${uploadProgress}%`,
                    background: converting ? '#3b82f6' : '#16a34a',
                    transition: 'width 0.3s'
                  }}></div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowPPTXModal(false)
                  setSelectedLessonForPPTX(null)
                  setUploadProgress(0)
                }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            width: '100%',
            maxWidth: '450px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              background: '#fef3c7',
              marginBottom: '1.5rem'
            }}>
              <Lock size={32} color="#d97706" />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '0.75rem' }}>
              Course Limit Reached
            </h2>

            <p style={{ color: '#6b7280', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
              {courseLimit?.reason || 'You have reached your course limit. Upgrade your plan to create more courses.'}
            </p>

            {subscriptionData?.usage && (
              <div style={{
                background: '#f9fafb',
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Courses used</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>
                    {subscriptionData.usage.courseCount} / {courseLimit?.maxAllowed || 1}
                  </span>
                </div>
                <div style={{
                  height: '8px',
                  background: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, ((subscriptionData.usage.courseCount || 0) / (courseLimit?.maxAllowed || 1)) * 100)}%`,
                    background: '#ef4444',
                    transition: 'width 0.3s'
                  }}></div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => setShowUpgradeModal(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  setShowUpgradeModal(false)
                  router.push('/instructor/pricing')
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  background: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <CreditCard size={16} />
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Banner */}
      {subscriptionData && subscriptionData.currentPlan && subscriptionData.currentPlan.id !== 'PRO' && (
        <div style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1rem 1.25rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e5e7eb',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.5rem',
            background: '#fef3c7'
          }}>
            <Crown size={20} color="#d97706" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Current Plan</div>
            <div style={{ fontWeight: '600', color: '#111827' }}>{subscriptionData.currentPlan.name}</div>
          </div>
          <button
            onClick={() => router.push('/instructor/pricing')}
            style={{
              padding: '0.5rem',
              borderRadius: '0.375rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#4f46e5'
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  )
}
