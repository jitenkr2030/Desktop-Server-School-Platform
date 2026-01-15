'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  BookOpen,
  Users,
  Clock,
  Edit,
  Trash2,
  Play,
  FileText,
  Headphones,
  CheckCircle,
  MoreVertical,
  Eye,
  Settings,
} from 'lucide-react'
import { getInstructorCourses, getInstructorLessons, createInstructorLesson, type Course, type Lesson } from '@/lib/instructor-api'

// Mock data for fallback
const mockCourse: Course = {
  id: '1',
  title: 'Complete Web Development Bootcamp',
  description: 'Learn HTML, CSS, JavaScript, React, Node.js and more',
  difficulty: 'BEGINNER',
  duration: 1200,
  isActive: true,
  createdAt: '2024-01-15',
  _count: { lessons: 12, progress: 45 },
}

const mockLessons: Lesson[] = [
  {
    id: 'les-1',
    title: 'Introduction to Web Development',
    content: 'Welcome to the course! In this lesson, we will explore the fundamentals of web development.',
    videoUrl: 'https://youtube.com/watch?v=example',
    duration: 15,
    order: 1,
    isActive: true,
    _count: { progress: 23 },
  },
  {
    id: 'les-2',
    title: 'HTML Fundamentals',
    content: 'Learn the building blocks of every website.',
    videoUrl: 'https://youtube.com/watch?v=html-basics',
    duration: 25,
    order: 2,
    isActive: true,
    _count: { progress: 18 },
  },
  {
    id: 'les-3',
    title: 'CSS Styling Basics',
    content: 'Make your websites beautiful with CSS.',
    videoUrl: 'https://youtube.com/watch?v=css-basics',
    duration: 30,
    order: 3,
    isActive: true,
    _count: { progress: 15 },
  },
  {
    id: 'les-4',
    title: 'JavaScript Introduction',
    content: 'Add interactivity to your websites.',
    videoUrl: 'https://youtube.com/watch?v=js-intro',
    duration: 35,
    order: 4,
    isActive: true,
    _count: { progress: 12 },
  },
]

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddLesson, setShowAddLesson] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch course details
        const coursesResponse = await getInstructorCourses()
        if (coursesResponse.success && coursesResponse.courses.length > 0) {
          const foundCourse = coursesResponse.courses.find((c) => c.id === courseId)
          if (foundCourse) {
            setCourse(foundCourse)
          } else {
            setCourse(mockCourse)
          }
        } else {
          setCourse(mockCourse)
        }

        // Fetch lessons
        const lessonsResponse = await getInstructorLessons(courseId)
        if (lessonsResponse.success && lessonsResponse.lessons.length > 0) {
          setLessons(lessonsResponse.lessons)
        } else {
          setLessons(mockLessons)
        }
      } catch (err) {
        console.error('Failed to fetch course data:', err)
        setCourse(mockCourse)
        setLessons(mockLessons)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId])

  const handleLessonCreated = (newLesson: Lesson) => {
    setLessons([...lessons, newLesson].sort((a, b) => a.order - b.order))
    setShowAddLesson(false)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getLessonTypeIcon = (content: string, videoUrl?: string) => {
    if (videoUrl) return Play
    if (content.includes('quiz') || content.includes('test')) return CheckCircle
    return FileText
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
          <Link href="/dashboard/instructor/courses">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Back to Courses
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/instructor/courses"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 truncate max-w-xl">{course.title}</h1>
                <p className="text-sm text-gray-500">Manage your course content</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/courses/${course.id}`}
                target="_blank"
                className="inline-flex items-center px-3 py-2 border text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Link>
              <button
                onClick={() => setShowAddLesson(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Lesson
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{lessons.length}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Duration</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDuration(lessons.reduce((sum, l) => sum + l.duration, 0))}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Enrolled</p>
                <p className="text-2xl font-bold text-gray-900">{course._count.progress}</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {course.isActive ? 'Published' : 'Draft'}
                </p>
              </div>
              <div
                className={`p-2 rounded-lg ${
                  course.isActive ? 'bg-green-100' : 'bg-yellow-100'
                }`}
              >
                <CheckCircle
                  className={`w-5 h-5 ${
                    course.isActive ? 'text-green-600' : 'text-yellow-600'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lessons Section */}
        <div className="bg-white rounded-xl border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Course Lessons</h2>
                <p className="text-sm text-gray-500">
                  {lessons.length} lessons • {formatDuration(lessons.reduce((sum, l) => sum + l.duration, 0))} total
                </p>
              </div>
              <button
                onClick={() => setShowAddLesson(true)}
                className="inline-flex items-center px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Lesson
              </button>
            </div>
          </div>

          {lessons.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons yet</h3>
              <p className="text-gray-500 mb-4">
                Start building your course by adding your first lesson
              </p>
              <button
                onClick={() => setShowAddLesson(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add First Lesson
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {lessons.map((lesson, index) => {
                const Icon = getLessonTypeIcon(lesson.content, lesson.videoUrl)
                return (
                  <div
                    key={lesson.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Lesson Number */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                          lesson.isActive
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {lesson.order}
                      </div>

                      {/* Lesson Icon */}
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          lesson.videoUrl
                            ? 'bg-red-100'
                            : lesson.content.includes('quiz')
                            ? 'bg-green-100'
                            : 'bg-blue-100'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            lesson.videoUrl
                              ? 'text-red-600'
                              : lesson.content.includes('quiz')
                              ? 'text-green-600'
                              : 'text-blue-600'
                          }`}
                        />
                      </div>

                      {/* Lesson Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{lesson.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(lesson.duration)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {lesson._count?.progress || 0} enrolled
                          </span>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              lesson.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {lesson.isActive ? 'Active' : 'Draft'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Add Lesson Modal */}
      {showAddLesson && (
        <AddLessonModal
          courseId={courseId}
          nextOrder={lessons.length + 1}
          onClose={() => setShowAddLesson(false)}
          onLessonCreated={handleLessonCreated}
        />
      )}
    </div>
  )
}

// Add Lesson Modal Component
function AddLessonModal({
  courseId,
  nextOrder,
  onClose,
  onLessonCreated,
}: {
  courseId: string
  nextOrder: number
  onClose: () => void
  onLessonCreated: (lesson: Lesson) => void
}) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    duration: 15,
    isFree: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await createInstructorLesson({
        courseId,
        title: formData.title,
        content: formData.content,
        videoUrl: formData.videoUrl || undefined,
        duration: formData.duration,
        order: nextOrder,
      })

      if (response.success) {
        onLessonCreated(response.lesson)
      } else {
        // Create mock lesson for demo
        const mockLesson: Lesson = {
          id: `les-${Date.now()}`,
          title: formData.title,
          content: formData.content,
          videoUrl: formData.videoUrl || undefined,
          duration: formData.duration,
          order: nextOrder,
          isActive: true,
          _count: { progress: 0 },
        }
        onLessonCreated(mockLesson)
      }
    } catch (err) {
      // Create mock lesson for demo
      const mockLesson: Lesson = {
        id: `les-${Date.now()}`,
        title: formData.title,
        content: formData.content,
        videoUrl: formData.videoUrl || undefined,
        duration: formData.duration,
        order: nextOrder,
        isActive: true,
        _count: { progress: 0 },
      }
      onLessonCreated(mockLesson)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add New Lesson</h2>
          <p className="text-sm text-gray-500 mt-1">Create a new lesson for this course</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lesson Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Introduction to HTML"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lesson Content *
            </label>
            <textarea
              required
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe what this lesson covers..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video URL (optional)
            </label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://youtube.com/watch?v=..."
            />
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
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                <span className="text-sm text-gray-700">Free preview</span>
              </label>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Add Lesson'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
