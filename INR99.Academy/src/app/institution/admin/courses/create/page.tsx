'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Lesson {
  title: string
  type: string
  content: string
  videoUrl: string
  duration: number
  order: number
}

interface Chapter {
  title: string
  description: string
  order: number
  lessons: Lesson[]
}

export default function CreateCoursePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [course, setCourse] = useState({
    title: '',
    description: '',
    courseType: 'GENERAL',
    difficulty: 'BEGINNER',
    categoryId: '',
    classId: '',
  })

  const [chapters, setChapters] = useState<Chapter[]>([
    {
      title: '',
      description: '',
      order: 1,
      lessons: [
        { title: '', type: 'VIDEO', content: '', videoUrl: '', duration: 0, order: 1 },
      ],
    },
  ])

  const handleCourseChange = (field: string, value: string) => {
    setCourse((prev) => ({ ...prev, [field]: value }))
  }

  const addChapter = () => {
    setChapters((prev) => [
      ...prev,
      {
        title: '',
        description: '',
        order: prev.length + 1,
        lessons: [
          { title: '', type: 'VIDEO', content: '', videoUrl: '', duration: 0, order: 1 },
        ],
      },
    ])
  }

  const addLesson = (chapterIndex: number) => {
    const newChapters = [...chapters]
    const chapter = newChapters[chapterIndex]
    chapter.lessons.push({
      title: '',
      type: 'VIDEO',
      content: '',
      videoUrl: '',
      duration: 0,
      order: chapter.lessons.length + 1,
    })
    setChapters(newChapters)
  }

  const updateChapter = (index: number, field: string, value: string | number) => {
    const newChapters = [...chapters]
    newChapters[index] = { ...newChapters[index], [field]: value }
    setChapters(newChapters)
  }

  const updateLesson = (chapterIndex: number, lessonIndex: number, field: string, value: string | number) => {
    const newChapters = [...chapters]
    newChapters[chapterIndex].lessons[lessonIndex] = {
      ...newChapters[chapterIndex].lessons[lessonIndex],
      [field]: value,
    }
    setChapters(newChapters)
  }

  const removeChapter = (index: number) => {
    if (chapters.length > 1) {
      setChapters((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      // In production, get actual tenant ID from session
      const tenantId = 'demo-tenant-id'

      const response = await fetch('/institution/api/courses/custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId,
          ...course,
          chapters,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create course')
      }

      router.push('/institution/admin/courses')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-600">Add custom content for your institution</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex items-center justify-between">
          {['Course Details', 'Course Content', 'Review'].map((label, index) => (
            <div key={label} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step > index + 1
                    ? 'bg-green-500 text-white'
                    : step === index + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > index + 1 ? '✓' : index + 1}
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700 hidden sm:block">
                {label}
              </span>
              {index < 2 && (
                <div className="w-12 sm:w-24 h-1 bg-gray-200 mx-4 hidden sm:block">
                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: step > index + 1 ? '100%' : '0%' }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Course Details */}
      {step === 1 && (
        <div className="bg-white rounded-xl border p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Course Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Title *
            </label>
            <input
              type="text"
              value={course.title}
              onChange={(e) => handleCourseChange('title', e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Introduction to Computer Science"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={course.description}
              onChange={(e) => handleCourseChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe what students will learn in this course..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Type
              </label>
              <select
                value={course.courseType}
                onChange={(e) => handleCourseChange('courseType', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="GENERAL">General</option>
                <option value="SCHOOL_CONCEPT">School Concept</option>
                <option value="COLLEGE_FOUNDATION">College Foundation</option>
                <option value="SKILL_BASED">Skill Based</option>
                <option value="EXAM_SUPPORT">Exam Support</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level
              </label>
              <select
                value={course.difficulty}
                onChange={(e) => handleCourseChange('difficulty', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={course.categoryId}
                onChange={(e) => handleCourseChange('categoryId', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Category</option>
                <option value="programming">Programming</option>
                <option value="data-science">Data Science</option>
                <option value="business">Business</option>
                <option value="design">Design</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class/Grade (Optional)
              </label>
              <select
                value={course.classId}
                onChange={(e) => handleCourseChange('classId', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Class</option>
                <option value="class-6">Class 6</option>
                <option value="class-7">Class 7</option>
                <option value="class-8">Class 8</option>
                <option value="class-9">Class 9</option>
                <option value="class-10">Class 10</option>
                <option value="class-11">Class 11</option>
                <option value="class-12">Class 12</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Course Content */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Course Content</h2>
              <button
                onClick={addChapter}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Add Chapter
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Organize your course into chapters and lessons. Students will progress through the content sequentially.
            </p>

            <div className="space-y-6">
              {chapters.map((chapter, chapterIndex) => (
                <div key={chapterIndex} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">
                      Chapter {chapterIndex + 1}
                    </h3>
                    {chapters.length > 1 && (
                      <button
                        onClick={() => removeChapter(chapterIndex)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      value={chapter.title}
                      onChange={(e) => updateChapter(chapterIndex, 'title', e.target.value)}
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Chapter title"
                    />
                    <input
                      type="text"
                      value={chapter.description}
                      onChange={(e) => updateChapter(chapterIndex, 'description', e.target.value)}
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Chapter description (optional)"
                    />
                  </div>

                  {/* Lessons */}
                  <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                    {chapter.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) =>
                                updateLesson(chapterIndex, lessonIndex, 'title', e.target.value)
                              }
                              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Lesson title"
                            />
                            <select
                              value={lesson.type}
                              onChange={(e) =>
                                updateLesson(chapterIndex, lessonIndex, 'type', e.target.value)
                              }
                              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="VIDEO">Video</option>
                              <option value="TEXT">Text</option>
                              <option value="AUDIO">Audio</option>
                              <option value="QUIZ">Quiz</option>
                            </select>
                            <input
                              type="number"
                              value={lesson.duration}
                              onChange={(e) =>
                                updateLesson(chapterIndex, lessonIndex, 'duration', parseInt(e.target.value))
                              }
                              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Duration (min)"
                            />
                          </div>
                        </div>
                        {lesson.type === 'VIDEO' && (
                          <div className="mt-3">
                            <input
                              type="url"
                              value={lesson.videoUrl}
                              onChange={(e) =>
                                updateLesson(chapterIndex, lessonIndex, 'videoUrl', e.target.value)
                              }
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Video URL (YouTube, Vimeo, or direct link)"
                            />
                          </div>
                        )}
                        {lesson.type === 'TEXT' && (
                          <div className="mt-3">
                            <textarea
                              value={lesson.content}
                              onChange={(e) =>
                                updateLesson(chapterIndex, lessonIndex, 'content', e.target.value)
                              }
                              rows={3}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Lesson content (text, HTML, or Markdown)"
                            />
                          </div>
                        )}
                      </div>
                    ))}

                    <button
                      onClick={() => addLesson(chapterIndex)}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Add Lesson
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="bg-white rounded-xl border p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Review Your Course</h2>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">{course.title || 'Untitled Course'}</h3>
            <p className="text-sm text-gray-600 mb-4">{course.description || 'No description'}</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                {course.courseType}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                {course.difficulty}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Chapters & Lessons</h3>
            <div className="space-y-3">
              {chapters.map((chapter, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <p className="font-medium text-gray-900">
                    Chapter {index + 1}: {chapter.title || 'Untitled'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {chapter.lessons.length} lesson(s)
                  </p>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
        ) : (
          <div></div>
        )}

        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating Course...' : 'Create Course'}
          </button>
        )}
      </div>
    </div>
  )
}
