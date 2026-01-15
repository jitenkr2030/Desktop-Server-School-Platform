'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import LanguageSelector from '@/components/confusion/LanguageSelector'
import SubmissionModal from '@/components/confusion/SubmissionModal'
import SuccessStoryCarousel from '@/components/confusion/SuccessStoryCarousel'
import ExpertQnASection from '@/components/confusion/ExpertQnASection'

interface Lesson {
  id: string
  courseId: string
  title: string
  content: string
  duration: number
  order: number
}

interface Course {
  id: string
  title: string
  description: string
}

export default function ConfusionDetailPage() {
  const params = useParams()
  const lessonId = params.id as string

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [translatedContent, setTranslatedContent] = useState<{ title: string; content: string } | null>(null)
  const [isTranslationLoading, setIsTranslationLoading] = useState(false)
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)
  const [showStoryModal, setShowStoryModal] = useState(false)

  useEffect(() => {
    fetchLessonData()
  }, [lessonId])

  useEffect(() => {
    if (selectedLanguage !== 'en' && lesson) {
      fetchTranslation()
    } else {
      setTranslatedContent(null)
    }
  }, [selectedLanguage, lesson])

  const fetchLessonData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/lessons/${lessonId}`)
      const data = await response.json()

      if (data.success) {
        setLesson(data.lesson)
        setCourse(data.lesson.course)
      }
    } catch (error) {
      console.error('Error fetching lesson:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTranslation = async () => {
    setIsTranslationLoading(true)
    try {
      const response = await fetch(`/api/confusion/${lessonId}/translations?language=${selectedLanguage}`)
      const data = await response.json()

      if (data.success) {
        setTranslatedContent({
          title: data.data.title,
          content: data.data.content
        })
      }
    } catch (error) {
      console.error('Error fetching translation:', error)
    } finally {
      setIsTranslationLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Lesson Not Found</h1>
          <p className="text-gray-600">The lesson you are looking for does not exist.</p>
        </div>
      </div>
    )
  }

  const displayTitle = translatedContent?.title || lesson.title
  const displayContent = translatedContent?.content || lesson.content

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{course?.title}</p>
              <h1 className="text-xl font-bold text-gray-800">{displayTitle}</h1>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector
                currentLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {selectedLanguage !== 'en' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-blue-700">
                  {isTranslationLoading ? 'Loading translation...' : 'Showing content in selected language'}
                </span>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: displayContent.replace(/\n/g, '<br/>') }}
              />
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Still have doubts?</h3>
                  <p className="text-sm text-gray-600">Submit your confusion and our experts will help!</p>
                </div>
                <button
                  onClick={() => setShowSubmissionModal(true)}
                  className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Submit Your Confusion
                </button>
              </div>
            </div>

            <ExpertQnASection
              lessonId={lesson.id}
              courseId={lesson.courseId}
              lessonTitle={lesson.title}
            />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowSubmissionModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Submit Confusion
                </button>
                <button
                  onClick={() => setShowStoryModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Share Success Story
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">About This Lesson</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium text-gray-800">{lesson.duration} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-gray-800">{course?.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Language</span>
                  <span className="font-medium text-gray-800">
                    {selectedLanguage === 'en' ? 'English' : 'हिंदी'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <SuccessStoryCarousel
            lessonId={lesson.id}
            onShareClick={() => setShowStoryModal(true)}
          />
        </div>
      </div>

      <SubmissionModal
        isOpen={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
        lessonId={lesson.id}
        lessonTitle={lesson.title}
      />

      {showStoryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setShowStoryModal(false)}
            />
            <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
              <button
                onClick={() => setShowStoryModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h2 className="text-xl font-bold text-gray-800 mb-4">Share Your Success Story</h2>
              <p className="text-gray-600 mb-4">
                Tell us how this lesson helped you! Your story can inspire others.
              </p>

              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  const form = e.target as HTMLFormElement
                  const story = (form.elements.namedItem('story') as HTMLTextAreaElement).value

                  await fetch('/api/confusion/story', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      story,
                      relatedLessonId: lesson.id,
                      language: selectedLanguage,
                      userId: 'demo_user'
                    })
                  })

                  setShowStoryModal(false)
                  alert('Thank you for sharing your story! It will be featured after review.')
                }}
                className="space-y-4"
              >
                <textarea
                  name="story"
                  required
                  placeholder="Share how this lesson helped you..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Submit Story
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}