import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import Link from 'next/link'
import { BookOpen, Clock, CheckCircle, BarChart3, PlayCircle, TrendingUp } from 'lucide-react'

// Demo data for dashboard (used when no database is available)
const demoCourses = [
  {
    id: 'course_1',
    title: 'Complete React Course - From Zero to Hero',
    instructor: 'John Instructor',
    progress: 65,
    timeSpent: 320,
    completed: false,
  },
  {
    id: 'course_2',
    title: 'Advanced JavaScript Mastery',
    instructor: 'Jane Instructor',
    progress: 30,
    timeSpent: 180,
    completed: false,
  },
  {
    id: 'course_3',
    title: 'Web Development Basics',
    instructor: 'Bob Instructor',
    progress: 100,
    timeSpent: 600,
    completed: true,
  },
]

export default async function DashboardPage() {
  const session = await auth()

  // Server-side authentication check
  if (!session?.user) {
    redirect('/auth/login')
  }

  const user = session.user
  const userName = (user as { name?: string }).name || user.name || 'Learner'

  // Calculate learning statistics
  const totalCourses = demoCourses.length
  const completedCourses = demoCourses.filter(c => c.completed).length
  const totalTimeSpent = demoCourses.reduce((sum, c) => sum + c.timeSpent, 0)
  const averageProgress = Math.round(demoCourses.reduce((sum, c) => sum + c.progress, 0) / totalCourses)
  // Use deterministic streak based on user ID hash (no Math.random to avoid hydration mismatch)
  const userIdHash = userEmail.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const currentStreak = (userIdHash % 7) + 1

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const continueCourse = demoCourses.find(c => !c.completed && c.progress > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userName}!
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Continue your learning journey and track your progress
          </p>

          {/* Streak Card */}
          <div className="mt-6 inline-flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-lg px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-xl font-bold text-orange-700">{currentStreak} days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Courses */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalCourses}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{completedCourses}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Time Spent */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Time Spent</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{formatDuration(totalTimeSpent)}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Average Progress */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Progress</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{averageProgress}%</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Continue Learning */}
        {continueCourse && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-orange-200">
            <h2 className="text-xl font-semibold text-orange-800 mb-4 flex items-center gap-2">
              <PlayCircle className="w-5 h-5" />
              Continue Learning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-green-100 rounded-lg flex items-center justify-center text-4xl">
                📚
              </div>
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {continueCourse.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  By {continueCourse.instructor}
                </p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Progress</span>
                    <span className="text-gray-600">{continueCourse.progress}% complete</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-300"
                      style={{ width: `${continueCourse.progress}%` }}
                    />
                  </div>
                </div>
                <Link
                  href={`/courses/${continueCourse.id}`}
                  className="inline-block bg-orange-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors"
                >
                  Continue Learning
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* My Courses Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">My Courses</h2>
          <div className="space-y-4">
            {demoCourses.map((course) => (
              <div
                key={course.id}
                className={`rounded-lg p-4 border ${
                  course.completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600">by {course.instructor}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      course.completed
                        ? 'bg-green-500 text-white'
                        : course.progress > 0
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    {course.progress}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      course.completed ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
