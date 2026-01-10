'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  Calendar,
  Clock,
  Users,
  Video,
  FileText,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  BookOpen,
  Lock,
  CreditCard,
  Crown,
  ChevronRight
} from 'lucide-react'

interface Course {
  id: string
  title: string
  thumbnail: string | null
}

export default function CreateSessionPage() {
  const [mounted, setMounted] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  const [sessionLimit, setSessionLimit] = useState<{ allowed: boolean; reason?: string; currentCount: number; maxAllowed: number } | null>(null)

  const router = useRouter()
  const sessionResult = useSession()
  const session = mounted ? sessionResult.data : null

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: '60',
    courseId: '',
    maxParticipants: '',
    isRecorded: false
  })

  useEffect(() => {
    setMounted(true)
    checkSubscriptionAndFetchCourses()
  }, [])

  const checkSubscriptionAndFetchCourses = async () => {
    try {
      // Check subscription status first
      const subResponse = await fetch('/api/instructor/subscription/status?userId=instructor1')
      const subData = await subResponse.json()

      if (subData.success) {
        setSubscriptionData(subData.data)
        setSessionLimit(subData.data.permissions.canCreateLiveSession)

        if (!subData.data.permissions.canCreateLiveSession.allowed) {
          setShowUpgradeModal(true)
          setCoursesLoading(false)
          return
        }
      }

      // Then fetch courses
      fetchCourses()
    } catch (err) {
      console.error('Failed to check subscription:', err)
      // Continue without subscription check
      fetchCourses()
    }
  }

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true)
      const response = await fetch('/api/instructor/courses')
      const data = await response.json()

      if (data.success) {
        setCourses(data.courses || [])
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err)
    } finally {
      setCoursesLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validation
    if (!formData.title.trim()) {
      setError('Please enter a session title')
      return
    }

    if (!formData.scheduledDate || !formData.scheduledTime) {
      setError('Please select both date and time for the session')
      return
    }

    if (!formData.duration || parseInt(formData.duration) <= 0) {
      setError('Please enter a valid duration')
      return
    }

    try {
      setSubmitting(true)

      // Combine date and time
      const scheduledAt = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`)

      const response = await fetch('/api/live-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          scheduledAt: scheduledAt.toISOString(),
          duration: parseInt(formData.duration),
          courseId: formData.courseId || null,
          maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
          isRecorded: formData.isRecorded
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Live session created successfully!')
        setFormData({
          title: '',
          description: '',
          scheduledDate: '',
          scheduledTime: '',
          duration: '60',
          courseId: '',
          maxParticipants: '',
          isRecorded: false
        })

        // Redirect to the session after a brief delay
        setTimeout(() => {
          router.push(`/live-sessions/${data.session.id}`)
        }, 1500)
      } else {
        setError(data.message || 'Failed to create session')
      }
    } catch (err) {
      setError('Failed to create session. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const isInstructor = mounted && (session?.user?.role === 'INSTRUCTOR' || 
    session?.user?.role === 'ADMIN' || 
    session?.user?.role === 'SUPER_ADMIN')

  // Redirect if not an instructor
  useEffect(() => {
    if (mounted && !session?.user) {
      router.push('/auth/login?callbackUrl=/live-sessions/create')
    }
  }, [mounted, session, router])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/live-sessions"
            className="inline-flex items-center text-indigo-100 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Live Sessions
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Create Live Session</h1>
              <p className="text-indigo-100 mt-1">Schedule an interactive learning session for your students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Basic Information
            </h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Session Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Introduction to React Hooks"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe what will be covered in this session..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Schedule & Duration */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Schedule & Duration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="scheduledDate"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="scheduledTime"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                  <option value="180">3 hours</option>
                </select>
              </div>

              <div>
                <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Participants
                </label>
                <input
                  type="number"
                  id="maxParticipants"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  min="1"
                  max="1000"
                  placeholder="Leave empty for unlimited"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Course Association */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Course Association
            </h2>

            <div>
              <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-2">
                Associate with Course (Optional)
              </label>
              {coursesLoading ? (
                <div className="flex items-center gap-2 text-gray-500 py-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading courses...
                </div>
              ) : courses.length > 0 ? (
                <select
                  id="courseId"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="">No course association</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-gray-500 py-4">
                  No courses found. Create a course first to associate it with a live session.
                </div>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Link this session to an existing course to help students find it easily.
              </p>
            </div>
          </div>

          {/* Session Options */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Video className="w-5 h-5 text-indigo-600" />
              Session Options
            </h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isRecorded"
                  checked={formData.isRecorded}
                  onChange={handleChange}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Record Session</span>
                  <p className="text-sm text-gray-500">Automatically record the session for later viewing</p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/live-sessions"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Video className="w-5 h-5 mr-2" />
                  Create Session
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-amber-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Live Sessions Not Available
            </h2>

            <p className="text-gray-600 mb-6">
              {sessionLimit?.reason || 'Live sessions require a Basic or Pro plan. Upgrade now to host unlimited live sessions!'}
            </p>

            {subscriptionData?.usage && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Live sessions used</span>
                  <span className="font-semibold text-gray-900">
                    {subscriptionData.usage.liveSessionCount} / {sessionLimit?.maxAllowed || 0}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 transition-all duration-300"
                    style={{
                      width: `${Math.min(100, ((subscriptionData.usage.liveSessionCount || 0) / Math.max(1, sessionLimit?.maxAllowed || 1)) * 100)}%`
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.push('/live-sessions')}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  setShowUpgradeModal(false)
                  router.push('/instructor/pricing')
                }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Banner */}
      {subscriptionData && subscriptionData.currentPlan && subscriptionData.currentPlan.id !== 'PRO' && (
        <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-40 flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Crown className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Current Plan</div>
            <div className="font-semibold text-gray-900">{subscriptionData.currentPlan.name}</div>
          </div>
          <button
            onClick={() => router.push('/instructor/pricing')}
            className="p-2 hover:bg-gray-100 rounded-lg text-indigo-600"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
