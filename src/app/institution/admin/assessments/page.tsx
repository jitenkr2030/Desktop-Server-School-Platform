'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface Assessment {
  id: string
  title: string
  type: string
  isActive: boolean
  createdAt: string
  course: {
    id: string
    title: string
  }
  questionCount: number
  totalAttempts: number
  avgScore: number
  passedCount: number
}

interface Question {
  id: string
  question: string
  type: string
  options: string[] | null
  correctAnswer: string
  explanation: string | null
  order: number
  points: number
}

export default function AssessmentBuilderPage() {
  const searchParams = useSearchParams()
  const tenantSlug = searchParams.get('tenant') || 'demo'
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showQuestionsModal, setShowQuestionsModal] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    type: 'QUIZ',
    timeLimit: '',
    passingScore: '70',
    shuffleQuestions: false,
    showResults: true,
  })
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: 'MULTIPLE_CHOICE',
    points: 1,
    options: ['', '', '', ''],
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [tenantSlug, typeFilter])

  const loadData = async () => {
    try {
      const [assessmentsRes, coursesRes] = await Promise.all([
        fetch(`/api/institution/api/assessments?tenantSlug=${tenantSlug}&type=${typeFilter}`),
        fetch(`/api/institution/api/courses/available?tenantSlug=${tenantSlug}`),
      ])

      const assessmentsData = await assessmentsRes.json()
      const coursesData = await coursesRes.json()

      if (assessmentsData.success) setAssessments(assessmentsData.assessments)
      if (coursesData.success) setCourses(coursesData.courses)
    } catch (error) {
      console.error('Failed to load data:', error)
      // Mock data for demonstration
      setAssessments([
        {
          id: '1',
          title: 'Mathematics Quiz 1',
          type: 'QUIZ',
          isActive: true,
          createdAt: '2026-01-10',
          course: { id: 'c1', title: 'Mathematics Class 10' },
          questionCount: 10,
          totalAttempts: 45,
          avgScore: 78.5,
          passedCount: 38,
        },
        {
          id: '2',
          title: 'Physics Final Exam',
          type: 'EXAM',
          isActive: true,
          createdAt: '2026-01-08',
          course: { id: 'c2', title: 'Physics Fundamentals' },
          questionCount: 25,
          totalAttempts: 30,
          avgScore: 72.3,
          passedCount: 22,
        },
        {
          id: '3',
          title: 'Chemistry Practice',
          type: 'PRACTICE',
          isActive: false,
          createdAt: '2026-01-05',
          course: { id: 'c3', title: 'Chemistry Basics' },
          questionCount: 15,
          totalAttempts: 12,
          avgScore: 85.0,
          passedCount: 10,
        },
      ])
      setCourses([
        { id: 'c1', title: 'Mathematics Class 10' },
        { id: 'c2', title: 'Physics Fundamentals' },
        { id: 'c3', title: 'Chemistry Basics' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/institution/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timeLimit: formData.timeLimit ? parseInt(formData.timeLimit) : null,
          passingScore: parseFloat(formData.passingScore),
          questions: questions.length > 0 ? questions : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create assessment')
      }

      setShowCreateModal(false)
      setFormData({
        courseId: '',
        title: '',
        type: 'QUIZ',
        timeLimit: '',
        passingScore: '70',
        shuffleQuestions: false,
        showResults: true,
      })
      setQuestions([])
      loadData()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const addQuestion = () => {
    if (!currentQuestion.question || !currentQuestion.correctAnswer) {
      alert('Please fill in the question and correct answer')
      return
    }

    setQuestions([
      ...questions,
      {
        id: `temp-${questions.length + 1}`,
        question: currentQuestion.question,
        type: currentQuestion.type || 'MULTIPLE_CHOICE',
        options: currentQuestion.options || null,
        correctAnswer: currentQuestion.correctAnswer,
        explanation: currentQuestion.explanation || null,
        order: questions.length,
        points: currentQuestion.points || 1,
      },
    ])

    setCurrentQuestion({
      type: 'MULTIPLE_CHOICE',
      points: 1,
      options: ['', '', '', ''],
    })
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || [])]
    newOptions[index] = value
    setCurrentQuestion({ ...currentQuestion, options: newOptions })
  }

  const handleDelete = async (assessmentId: string) => {
    if (!confirm('Are you sure you want to delete this assessment?')) return

    try {
      const response = await fetch(
        `/api/institution/api/assessments?id=${assessmentId}`,
        { method: 'DELETE' }
      )

      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Failed to delete assessment:', error)
    }
  }

  const handleToggleActive = async (assessmentId: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/institution/api/assessments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: assessmentId,
          isActive: !currentStatus,
        }),
      })

      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Failed to toggle status:', error)
    }
  }

  const filteredAssessments = assessments.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.course.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      QUIZ: 'bg-blue-100 text-blue-700',
      PRACTICE: 'bg-green-100 text-green-700',
      EXAM: 'bg-purple-100 text-purple-700',
      SCENARIO: 'bg-yellow-100 text-yellow-700',
    }
    return styles[type] || 'bg-gray-100 text-gray-700'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assessment Builder</h1>
          <p className="text-gray-600">Create and manage quizzes, exams, and assessments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Assessment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Total Assessments</p>
          <p className="text-2xl font-bold text-gray-900">{assessments.length}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {assessments.filter((a) => a.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Total Attempts</p>
          <p className="text-2xl font-bold text-blue-600">
            {assessments.reduce((sum, a) => sum + a.totalAttempts, 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Avg Score</p>
          <p className="text-2xl font-bold text-purple-600">
            {assessments.length > 0
              ? Math.round(
                  assessments.reduce((sum, a) => sum + a.avgScore, 0) / assessments.length
                )
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search assessments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
          <div className="flex space-x-2">
            {['all', 'QUIZ', 'PRACTICE', 'EXAM'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  typeFilter === type
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
              >
                {type === 'all' ? 'All Types' : type.charAt(0) + type.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Assessments Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Assessment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Questions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Avg Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Attempts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAssessments.map((assessment) => (
                <tr key={assessment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{assessment.title}</p>
                      <p className="text-sm text-gray-500">{assessment.course.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadge(assessment.type)}`}>
                      {assessment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {assessment.questionCount}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            assessment.avgScore >= 70 ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${Math.min(assessment.avgScore, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{assessment.avgScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {assessment.totalAttempts}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(assessment.id, assessment.isActive)}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        assessment.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {assessment.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedAssessment(assessment)
                          setShowQuestionsModal(true)
                        }}
                        className="p-2 hover:bg-gray-100 rounded text-gray-600"
                        title="View Questions"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded text-gray-600"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(assessment.id)}
                        className="p-2 hover:bg-red-100 rounded text-red-600"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAssessments.length === 0 && (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-600">No assessments found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Create First Assessment
            </button>
          </div>
        )}
      </div>

      {/* Create Assessment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Create New Assessment</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateAssessment} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course
                  </label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assessment Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="QUIZ">Quiz</option>
                    <option value="PRACTICE">Practice</option>
                    <option value="EXAM">Exam</option>
                    <option value="SCENARIO">Scenario</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assessment Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Chapter 1 Quiz"
                />
              </div>

              {/* Settings */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="No limit"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                    defaultValue="70"
                  />
                </div>
                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    id="shuffleQuestions"
                    checked={formData.shuffleQuestions}
                    onChange={(e) => setFormData({ ...formData, shuffleQuestions: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="shuffleQuestions" className="ml-2 text-sm text-gray-700">
                    Shuffle questions
                  </label>
                </div>
              </div>

              {/* Questions Section */}
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Add Questions</h4>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question Type
                      </label>
                      <select
                        value={currentQuestion.type}
                        onChange={(e) =>
                          setCurrentQuestion({
                            ...currentQuestion,
                            type: e.target.value,
                            options: e.target.value === 'MULTIPLE_CHOICE' ? ['', '', '', ''] : null,
                          })
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                        <option value="TRUE_FALSE">True/False</option>
                        <option value="SHORT_ANSWER">Short Answer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Points
                      </label>
                      <input
                        type="number"
                        value={currentQuestion.points}
                        onChange={(e) =>
                          setCurrentQuestion({ ...currentQuestion, points: parseInt(e.target.value) || 1 })
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="1"
                        defaultValue="1"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question
                    </label>
                    <textarea
                      value={currentQuestion.question || ''}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your question..."
                    />
                  </div>

                  {currentQuestion.type === 'MULTIPLE_CHOICE' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Options (select correct answer)
                      </label>
                      <div className="space-y-2">
                        {['A', 'B', 'C', 'D'].map((letter, index) => (
                          <div key={letter} className="flex items-center">
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={currentQuestion.correctAnswer === letter}
                              onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: letter })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="ml-2 w-6 text-gray-500">{letter})</span>
                            <input
                              type="text"
                              value={(currentQuestion.options as string[])?.[index] || ''}
                              onChange={(e) => updateOption(index, e.target.value)}
                              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder={`Option ${letter}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentQuestion.type === 'TRUE_FALSE' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correct Answer
                      </label>
                      <div className="flex space-x-4">
                        {['True', 'False'].map((option) => (
                          <label key={option} className="flex items-center">
                            <input
                              type="radio"
                              name="tfAnswer"
                              checked={currentQuestion.correctAnswer === option}
                              onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: option })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="ml-2">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentQuestion.type === 'SHORT_ANSWER' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correct Answer (for reference)
                      </label>
                      <input
                        type="text"
                        value={currentQuestion.correctAnswer || ''}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Expected answer"
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Explanation (optional)
                    </label>
                    <textarea
                      value={currentQuestion.explanation || ''}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Explain the correct answer..."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addQuestion}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                  >
                    Add Question
                  </button>
                </div>

                {/* Added Questions List */}
                {questions.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Questions Added ({questions.length})
                    </h5>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {questions.map((q, index) => (
                        <div
                          key={q.id}
                          className="flex items-center justify-between p-3 bg-white border rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {index + 1}. {q.question}
                            </p>
                            <p className="text-xs text-gray-500">
                              {q.type} • {q.points} point(s) • Answer: {q.correctAnswer}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.courseId || !formData.title}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Assessment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
