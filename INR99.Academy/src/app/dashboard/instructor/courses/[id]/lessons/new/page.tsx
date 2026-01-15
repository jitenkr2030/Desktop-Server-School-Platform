'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  Video,
  FileText,
  Headphones,
  Play,
  CheckCircle,
  Clock,
  ChevronRight,
  Save,
} from 'lucide-react'

export default function CreateLessonPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    audioUrl: '',
    pdfUrl: '',
    duration: 15,
    order: 1,
    isFree: false,
    lessonType: 'video' as 'video' | 'text' | 'audio',
  })

  const lessonTypes = [
    { id: 'video', name: 'Video Lesson', icon: Video, description: 'Embed a video from YouTube or Vimeo' },
    { id: 'text', name: 'Text Lesson', icon: FileText, description: 'Write rich text content' },
    { id: 'audio', name: 'Audio Lesson', icon: Headphones, description: 'Add an audio file or podcast' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push(`/dashboard/instructor/courses/${courseId}`)
    } catch (err) {
      setError('Failed to create lesson. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isStep1Valid = formData.title.length >= 3 && formData.content.length >= 10
  const isStep2Valid = formData.videoUrl || formData.lessonType === 'text'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/dashboard/instructor/courses/${courseId}`}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Add New Lesson</h1>
              <p className="text-sm text-gray-500">Create a new lesson for your course</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-xl">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
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
                2
              </div>
              <span className={`text-sm ${step >= 2 ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                Media
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
                <p className="text-sm text-gray-500">Define the lesson details</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Introduction to HTML Basics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lesson Content *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe what students will learn in this lesson. You can use this space to provide detailed notes, explanations, or additional context..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  Minimum 10 characters. Be descriptive about the lesson content.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFree}
                      onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Free preview available</span>
                  </label>
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

          {/* Step 2: Media */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Lesson Media</h2>
                <p className="text-sm text-gray-500">Add video, audio, or other content</p>
              </div>

              {/* Lesson Type Selection */}
              <div className="grid grid-cols-3 gap-4">
                {lessonTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, lessonType: type.id as 'video' | 'text' | 'audio' })
                      }
                      className={`p-4 border rounded-xl text-left transition-all ${
                        formData.lessonType === type.id
                          ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 mb-3 ${
                          formData.lessonType === type.id ? 'text-indigo-600' : 'text-gray-400'
                        }`}
                      />
                      <h3 className="font-medium text-gray-900">{type.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                    </button>
                  )
                })}
              </div>

              {/* Video URL Input */}
              {(formData.lessonType === 'video' || formData.lessonType === 'audio') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.lessonType === 'video' ? 'Video URL' : 'Audio URL'} *
                  </label>
                  <input
                    type="url"
                    value={formData.lessonType === 'video' ? formData.videoUrl : formData.audioUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [formData.lessonType === 'video' ? 'videoUrl' : 'audioUrl']: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={
                      formData.lessonType === 'video'
                        ? 'https://youtube.com/watch?v=...'
                        : 'https://audio-url.com/lesson.mp3'
                    }
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.lessonType === 'video'
                      ? 'Supports YouTube, Vimeo, or direct video URLs'
                      : 'Supports direct audio file URLs (MP3, WAV)'}
                  </p>
                </div>
              )}

              {/* PDF URL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PDF Resources URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.pdfUrl}
                  onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://pdf-url.com/resources.pdf"
                />
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
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Review Your Lesson</h2>
                <p className="text-sm text-gray-500">Check the details before creating the lesson</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Lesson Title</h3>
                  <p className="text-lg font-semibold text-gray-900">{formData.title}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Content Preview</h3>
                  <p className="text-gray-700 line-clamp-3">{formData.content}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Lesson Type</h3>
                    <div className="flex items-center gap-2">
                      {formData.lessonType === 'video' && <Play className="w-4 h-4 text-red-600" />}
                      {formData.lessonType === 'text' && <FileText className="w-4 h-4 text-blue-600" />}
                      {formData.lessonType === 'audio' && <Headphones className="w-4 h-4 text-purple-600" />}
                      <span className="font-medium text-gray-900 capitalize">{formData.lessonType}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
                    <p className="font-medium text-gray-900">{formData.duration} minutes</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Access</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        formData.isFree ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {formData.isFree ? 'Free Preview' : 'Full Access'}
                    </span>
                  </div>
                </div>

                {(formData.videoUrl || formData.audioUrl || formData.pdfUrl) && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Media URLs</h3>
                    <div className="space-y-2">
                      {formData.videoUrl && (
                        <p className="text-sm text-gray-700 flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          {formData.videoUrl}
                        </p>
                      )}
                      {formData.audioUrl && (
                        <p className="text-sm text-gray-700 flex items-center gap-2">
                          <Headphones className="w-4 h-4" />
                          {formData.audioUrl}
                        </p>
                      )}
                      {formData.pdfUrl && (
                        <p className="text-sm text-gray-700 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {formData.pdfUrl}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> The lesson will be created as a draft. You can publish it once you
                  have reviewed the content.
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
                      <Save className="w-4 h-4" />
                      Create Lesson
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
