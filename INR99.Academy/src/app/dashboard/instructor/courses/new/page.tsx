'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Tag,
  FileText,
  Check,
  ChevronRight,
} from 'lucide-react'
import { createInstructorCourse, type Course } from '@/lib/instructor-api'

const courseCategories = [
  { id: 'programming', name: 'Programming & Development', icon: '💻' },
  { id: 'data-science', name: 'Data Science & AI', icon: '📊' },
  { id: 'web-dev', name: 'Web Development', icon: '🌐' },
  { id: 'mobile', name: 'Mobile Development', icon: '📱' },
  { id: 'cloud', name: 'Cloud & DevOps', icon: '☁️' },
  { id: 'design', name: 'Design & UX', icon: '🎨' },
  { id: 'business', name: 'Business & Marketing', icon: '📈' },
  { id: 'other', name: 'Other', icon: '📚' },
]

export default function CreateCoursePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    difficulty: 'BEGINNER' as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
    duration: 60,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await createInstructorCourse(formData)
      if (response.success) {
        router.push('/dashboard/instructor/courses')
      } else {
        setError(response.message || 'Failed to create course')
      }
    } catch (err) {
      setError('Failed to create course. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isStep1Valid = formData.title.length >= 5 && formData.description.length >= 20
  const isStep2Valid = formData.categoryId !== ''

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/instructor/courses"
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Create New Course</h1>
              <p className="text-sm text-gray-500">Set up your course details</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <span className={`text-sm ${step >= 1 ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                Basic Info
              </span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200 rounded">
              <div
                className="h-full bg-indigo-600 rounded transition-all"
                style={{ width: step >= 2 ? '100%' : '0%' }}
              ></div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > 2 ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <span className={`text-sm ${step >= 2 ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                Category
              </span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200 rounded">
              <div
                className="h-full bg-indigo-600 rounded transition-all"
                style={{ width: step >= 3 ? '100%' : '0%' }}
              ></div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                3
              </div>
              <span className={`text-sm ${step >= 3 ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                Review
              </span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl border p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Basic Information</h2>
                <p className="text-sm text-gray-500">Tell students what your course is about</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Complete Web Development Bootcamp"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Choose a clear, descriptive title (at least 5 characters)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe what students will learn, what prerequisites they need, and what they'll be able to do after completing the course..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  Minimum 20 characters. Be specific about course outcomes.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficulty: e.target.value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
                      })
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="60"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!isStep1Valid}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Category */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Course Category</h2>
                <p className="text-sm text-gray-500">Choose a category that best fits your course</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {courseCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, categoryId: category.id })}
                    className={`p-4 border rounded-xl text-left transition-all ${
                      formData.categoryId === category.id
                        ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{category.icon}</span>
                    <span className="text-sm font-medium text-gray-900">{category.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!isStep2Valid}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Review Your Course</h2>
                <p className="text-sm text-gray-500">Review the details before creating your course</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Course Title</h3>
                  <p className="text-lg font-semibold text-gray-900">{formData.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                  <p className="text-gray-700">{formData.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Difficulty</h3>
                    <p className="font-medium text-gray-900">
                      {formData.difficulty.charAt(0) + formData.difficulty.slice(1).toLowerCase()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
                    <p className="font-medium text-gray-900">{formData.duration} minutes</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                    <p className="font-medium text-gray-900">
                      {courseCategories.find((c) => c.id === formData.categoryId)?.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Your course will be created as a draft. You can add lessons and
                  publish it when ready from the course management page.
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      Create Course
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
