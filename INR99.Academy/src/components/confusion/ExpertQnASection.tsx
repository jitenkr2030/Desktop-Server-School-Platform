'use client'

import { useState, useEffect } from 'react'

interface ExpertQnASectionProps {
  lessonId: string
  courseId: string
  lessonTitle: string
}

interface ExpertInfo {
  id: string
  name: string
  avatar?: string
  expertise?: string
}

export default function ExpertQnASection({
  lessonId,
  courseId,
  lessonTitle
}: ExpertQnASectionProps) {
  const [expertInfo, setExpertInfo] = useState<ExpertInfo | null>(null)
  const [questionCount, setQuestionCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [newQuestion, setNewQuestion] = useState('')

  useEffect(() => {
    fetchExpertInfo()
  }, [lessonId])

  const fetchExpertInfo = async () => {
    setIsLoading(true)
    try {
      // Fetch expert Q&A info
      const response = await fetch(`/api/expert/qna?lessonId=${lessonId}`)
      const data = await response.json()

      if (data.success) {
        setExpertInfo(data.data.expert)
        setQuestionCount(data.data.questionCount || 0)
      } else {
        // Use default expert info
        setExpertInfo({
          id: 'inst6',
          name: 'Arun Patel',
          expertise: 'Finance & Digital Payments Expert'
        })
      }
    } catch (error) {
      // Use default expert info on error
      setExpertInfo({
        id: 'inst6',
        name: 'Arun Patel',
        expertise: 'Finance & Digital Payments Expert'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAskQuestion = async () => {
    if (!newQuestion.trim()) return

    try {
      // Create new discussion thread for this lesson
      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: `Question about: ${lessonTitle}`,
          content: newQuestion,
          courseId,
          tags: ['Confusion Remover', 'Expert Q&A', lessonId],
          difficultyLevel: 'Beginner'
        })
      })

      if (response.ok) {
        setShowQuestionForm(false)
        setNewQuestion('')
        fetchExpertInfo() // Refresh question count
      }
    } catch (error) {
      console.error('Error asking question:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Ask an Expert</h3>
            <p className="text-sm text-gray-500">
              Get answers from {expertInfo?.name || 'our experts'}
            </p>
          </div>
        </div>
        <a
          href="/community"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View All Discussions →
        </a>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Expert info */}
          <div className="flex items-center gap-4 md:w-1/3">
            <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-blue-700">
                {expertInfo?.avatar || expertInfo?.name?.charAt(0) || 'E'}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">
                {expertInfo?.name || 'Expert Panel'}
              </h4>
              <p className="text-sm text-gray-600">
                {expertInfo?.expertise || 'Community Expert'}
              </p>
              <div className="flex items-center gap-1 mt-1 text-sm text-green-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Verified Expert</span>
              </div>
            </div>
          </div>

          {/* Q&A section */}
          <div className="flex-1">
            {showQuestionForm ? (
              <div className="space-y-4">
                <textarea
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                  placeholder="Type your question here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleAskQuestion}
                    disabled={!newQuestion.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Question
                  </button>
                  <button
                    onClick={() => setShowQuestionForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{questionCount} questions answered</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Average response: 24 hours</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <p className="text-gray-700 mb-4">
                    Have a question about this topic? Our experts are here to help you understand better.
                  </p>
                  <button
                    onClick={() => setShowQuestionForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Ask a Question
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Questions are answered by verified experts within 24 hours</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
