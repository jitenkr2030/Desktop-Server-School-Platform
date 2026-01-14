'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

interface Question {
  id: string
  question: string
  type: string
  options: string[] | null
  explanation: string | null
  order: number
  points: number
}

interface Assessment {
  id: string
  title: string
  type: string
  courseId: string
  course: { id: string; title: string }
  lessonId: string | null
  timeLimit: number | null
  passingScore: number
  shuffleQuestions: boolean
  showResults: boolean
  questions: Question[]
}

interface Result {
  score: number
  passed: boolean
  totalPoints: number
  earnedPoints: number
  totalQuestions: number
  correctAnswers: number
  showResults: boolean
  results?: Array<{
    questionId: string
    correct: boolean
    points: number
    userAnswer: string
    correctAnswer: string
  }>
}

export default function TakeAssessmentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const assessmentId = searchParams.get('id') || 'demo-assessment'
  const userId = 'demo-user' // In production, get from auth context

  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [startTime] = useState(Date.now())
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadAssessment()
  }, [assessmentId])

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
    } else if (timeRemaining === 0) {
      handleSubmit()
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [timeRemaining])

  const loadAssessment = async () => {
    try {
      const response = await fetch(
        `/api/institution/api/assessments/questions?id=${assessmentId}&userId=${userId}`
      )
      const data = await response.json()

      if (data.success) {
        const assessmentData = data.assessment
        // Shuffle questions if enabled
        if (assessmentData.shuffleQuestions) {
          assessmentData.questions = shuffleArray(assessmentData.questions)
        }
        setAssessment(assessmentData)
        if (assessmentData.timeLimit) {
          setTimeRemaining(assessmentData.timeLimit * 60)
        }
      }
    } catch (error) {
      console.error('Failed to load assessment:', error)
      // Mock data for demonstration
      setAssessment({
        id: 'demo',
        title: 'Mathematics Quiz 1',
        type: 'QUIZ',
        courseId: 'c1',
        course: { id: 'c1', title: 'Mathematics Class 10' },
        lessonId: null,
        timeLimit: 15,
        passingScore: 70,
        shuffleQuestions: false,
        showResults: true,
        questions: [
          {
            id: 'q1',
            question: 'What is the value of π (pi) approximately?',
            type: 'MULTIPLE_CHOICE',
            options: ['3.14', '3.15', '3.16', '3.17'],
            explanation: 'Pi is approximately 3.14159, so 3.14 is the closest answer.',
            order: 0,
            points: 1,
          },
          {
            id: 'q2',
            question: 'The square root of 144 is 12.',
            type: 'TRUE_FALSE',
            options: null,
            explanation: '12 × 12 = 144, so this statement is true.',
            order: 1,
            points: 1,
          },
          {
            id: 'q3',
            question: 'What is 15% of 200?',
            type: 'MULTIPLE_CHOICE',
            options: ['25', '30', '35', '40'],
            explanation: '15% of 200 = 0.15 × 200 = 30',
            order: 2,
            points: 1,
          },
          {
            id: 'q4',
            question: 'A triangle has 3 sides.',
            type: 'TRUE_FALSE',
            options: null,
            explanation: 'By definition, a triangle has three sides.',
            order: 3,
            points: 1,
          },
          {
            id: 'q5',
            question: 'What is 7 × 8?',
            type: 'MULTIPLE_CHOICE',
            options: ['54', '55', '56', '57'],
            explanation: '7 × 8 = 56',
            order: 4,
            points: 1,
          },
        ],
      })
      setTimeRemaining(15 * 60)
    } finally {
      setLoading(false)
    }
  }

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const goToNextQuestion = () => {
    if (assessment && currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const handleSubmit = async () => {
    if (!assessment) return

    setSubmitting(true)
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)

    try {
      const response = await fetch('/api/institution/api/assessments/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          assessmentId: assessment.id,
          answers,
          timeSpent,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.result)
      }
    } catch (error) {
      console.error('Failed to submit assessment:', error)
      // Calculate result locally for demo
      let correct = 0
      const results = assessment.questions.map((q) => {
        const userAnswer = answers[q.id] || ''
        const isCorrect = userAnswer.toLowerCase() === q.correctAnswer.toLowerCase()
        if (isCorrect) correct++
        return {
          questionId: q.id,
          correct: isCorrect,
          points: isCorrect ? q.points : 0,
          userAnswer,
          correctAnswer: q.correctAnswer,
        }
      })
      const score = (correct / assessment.questions.length) * 100
      setResult({
        score: Math.round(score * 10) / 10,
        passed: score >= assessment.passingScore,
        totalPoints: assessment.questions.reduce((sum, q) => sum + q.points, 0),
        earnedPoints: correct,
        totalQuestions: assessment.questions.length,
        correctAnswers: correct,
        showResults: assessment.showResults,
        results,
      })
    } finally {
      setSubmitting(false)
      setShowConfirmSubmit(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const answeredCount = Object.keys(answers).length
  const currentQuestion = assessment?.questions[currentQuestionIndex]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-4 text-gray-600">Loading assessment...</p>
        </div>
      </div>
    )
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Result Header */}
            <div className="text-center mb-8">
              <div
                className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                  result.passed ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {result.passed ? (
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mt-4">
                {result.passed ? 'Congratulations!' : 'Keep Practicing!'}
              </h1>
              <p className="text-gray-600 mt-2">
                {result.passed
                  ? 'You have passed this assessment.'
                  : `You need ${assessment?.passingScore || 70}% to pass.`}
              </p>
            </div>

            {/* Score Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-gray-900">{result.score}%</p>
                <p className="text-sm text-gray-600">Your Score</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-gray-900">
                  {result.correctAnswers}/{result.totalQuestions}
                </p>
                <p className="text-sm text-gray-600">Correct Answers</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-gray-900">
                  {result.passed ? 'PASS' : 'FAIL'}
                </p>
                <p className="text-sm text-gray-600">Result</p>
              </div>
            </div>

            {/* Question Review */}
            {result.showResults && result.results && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Review Your Answers</h2>
                <div className="space-y-4">
                  {assessment?.questions.map((q, index) => {
                    const questionResult = result.results?.find((r) => r.questionId === q.id)
                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-lg border ${
                          questionResult?.correct
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-start">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                              questionResult?.correct ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          >
                            {questionResult?.correct ? (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {index + 1}. {q.question}
                            </p>
                            <p className="text-sm mt-1">
                              <span className="text-gray-600">Your answer: </span>
                              <span
                                className={
                                  questionResult?.correct ? 'text-green-600' : 'text-red-600'
                                }
                              >
                                {questionResult?.userAnswer || 'Not answered'}
                              </span>
                            </p>
                            {!questionResult?.correct && (
                              <p className="text-sm mt-1">
                                <span className="text-gray-600">Correct answer: </span>
                                <span className="text-green-600">{questionResult?.correctAnswer}</span>
                              </p>
                            )}
                            {q.explanation && (
                              <p className="text-sm text-gray-600 mt-2 italic">{q.explanation}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => {
                  setResult(null)
                  setAnswers({})
                  setCurrentQuestionIndex(0)
                  loadAssessment()
                }}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Retry Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Assessment not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{assessment.title}</h1>
              <p className="text-sm text-gray-500">{assessment.course.title}</p>
            </div>
            <div className="flex items-center space-x-4">
              {timeRemaining !== null && (
                <div
                  className={`px-4 py-2 rounded-lg font-mono font-medium ${
                    timeRemaining < 60
                      ? 'bg-red-100 text-red-700'
                      : timeRemaining < 300
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {formatTime(timeRemaining)}
                </div>
              )}
              <span className="text-sm text-gray-600">
                {answeredCount}/{assessment.questions.length} answered
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-4 sticky top-24">
              <h3 className="font-medium text-gray-900 mb-3">Questions</h3>
              <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
                {assessment.questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(index)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      index === currentQuestionIndex
                        ? 'bg-blue-600 text-white'
                        : answers[q.id]
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={() => setShowConfirmSubmit(true)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Submit Assessment
                </button>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {assessment.questions.length}
                </span>
                <span className="text-sm text-gray-500">{currentQuestion?.points} point(s)</span>
              </div>

              {currentQuestion && (
                <div>
                  <h2 className="text-xl font-medium text-gray-900 mb-6">
                    {currentQuestion.question}
                  </h2>

                  {currentQuestion.type === 'MULTIPLE_CHOICE' && currentQuestion.options && (
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => {
                        const optionLetter = String.fromCharCode(65 + index)
                        return (
                          <label
                            key={option}
                            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                              answers[currentQuestion.id] === optionLetter
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${currentQuestion.id}`}
                              value={optionLetter}
                              checked={answers[currentQuestion.id] === optionLetter}
                              onChange={() => handleAnswerChange(currentQuestion.id, optionLetter)}
                              className="w-5 h-5 text-blue-600"
                            />
                            <span className="ml-3 w-8 text-gray-500 font-medium">{optionLetter})</span>
                            <span className="text-gray-900">{option}</span>
                          </label>
                        )
                      })}
                    </div>
                  )}

                  {currentQuestion.type === 'TRUE_FALSE' && (
                    <div className="flex space-x-4">
                      {['True', 'False'].map((option) => (
                        <label
                          key={option}
                          className={`flex-1 flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                            answers[currentQuestion.id] === option
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion.id}`}
                            value={option}
                            checked={answers[currentQuestion.id] === option}
                            onChange={() => handleAnswerChange(currentQuestion.id, option)}
                            className="sr-only"
                          />
                          <span className="font-medium text-gray-900">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === 'SHORT_ANSWER' && (
                    <input
                      type="text"
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    />
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    currentQuestionIndex === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === assessment.questions.length - 1}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    currentQuestionIndex === assessment.questions.length - 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Assessment?</h3>
            <p className="text-gray-600 mb-6">
              You have answered {answeredCount} out of {assessment.questions.length} questions.
              {answeredCount < assessment.questions.length && (
                <span className="text-yellow-600">
                  {' '}
                  There are unanswered questions.
                </span>
              )}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 px-4 py-2 border rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Review Answers
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
