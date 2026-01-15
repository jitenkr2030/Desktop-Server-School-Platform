"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Clock,
  Trophy,
  Target,
  TrendingUp,
  PlayCircle,
  CheckCircle,
  Calendar,
  BarChart3
} from "lucide-react"
import Link from "next/link"

interface CourseProgress {
  id: string
  userId: string
  courseId: string
  lessonId?: string
  progress: number
  timeSpent: number
  completed: boolean
  lastAccess: string
  course: {
    id: string
    title: string
    thumbnail?: string
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
    duration: number
    instructor: {
      id: string
      name: string
      avatar?: string
    }
  }
  lesson?: {
    id: string
    title: string
    duration: number
    order: number
  }
}

interface LearningStats {
  totalCourses: number
  completedCourses: number
  totalTimeSpent: number
  currentStreak: number
  averageProgress: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [progressData, setProgressData] = useState<CourseProgress[]>([])
  const [stats, setStats] = useState<LearningStats>({
    totalCourses: 0,
    completedCourses: 0,
    totalTimeSpent: 0,
    currentStreak: 0,
    averageProgress: 0
  })
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [mounted, status, router])

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetchProgressData()
    }
  }, [status, session])

  const fetchProgressData = async () => {
    if (!session?.user?.email) return

    setLoading(true)
    try {
      const response = await fetch(`/api/progress?email=${session.user.email}`)
      const data = await response.json()

      if (data.success) {
        setProgressData(data.progress || [])
        calculateStats(data.progress || [])
      } else {
        // If no progress data, use empty array
        calculateStats([])
      }
    } catch (error) {
      console.error('Fetch progress error:', error)
      // Use empty data on error
      calculateStats([])
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (progress: CourseProgress[]) => {
    const totalCourses = progress.length
    const completedCourses = progress.filter(p => p.completed).length
    const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpent, 0)
    const averageProgress = totalCourses > 0
      ? progress.reduce((sum, p) => sum + p.progress, 0) / totalCourses
      : 0

    // Calculate streak (simplified - in real app this would be more sophisticated)
    const currentStreak = Math.floor(Math.random() * 7) + 1 // Mock data

    setStats({
      totalCourses,
      completedCourses,
      totalTimeSpent,
      currentStreak,
      averageProgress
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getContinueLearningCourse = () => {
    return progressData
      .filter(p => !p.completed && p.progress > 0)
      .sort((a, b) => new Date(b.lastAccess).getTime() - new Date(a.lastAccess).getTime())[0]
  }

  // Show loading while checking session or redirecting
  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    return null // Will redirect via useEffect
  }

  const user = session?.user
  const continueCourse = getContinueLearningCourse()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || 'Learner'}!
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Continue your learning journey and track your progress
              </p>
            </div>
            
            {/* Streak Info */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-orange-600 mb-1">
                <TrendingUp className="h-5 w-5" />
                <span className="font-semibold">Current Streak</span>
              </div>
              <div className="text-2xl font-bold text-orange-700">
                {stats.currentStreak} days
              </div>
              <div className="text-sm text-orange-600">Keep it up! 🔥</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedCourses}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Time Spent</p>
                  <p className="text-2xl font-bold text-gray-900">{formatDuration(stats.totalTimeSpent)}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(stats.averageProgress)}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Learning */}
        {continueCourse && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <PlayCircle className="h-5 w-5" />
                Continue Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    {continueCourse.course.thumbnail ? (
                      <img 
                        src={continueCourse.course.thumbnail} 
                        alt={continueCourse.course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-green-100">
                        <BookOpen className="h-12 w-12 text-orange-500" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:w-2/3 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {continueCourse.course.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(continueCourse.course.duration)}</span>
                      </div>
                      <Badge className={getDifficultyColor(continueCourse.course.difficulty)}>
                        {continueCourse.course.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-600">
                        {Math.round(continueCourse.progress)}% complete
                      </span>
                    </div>
                    <Progress value={continueCourse.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Last accessed: {formatDate(continueCourse.lastAccess)}
                    </div>
                    <Link href={`/courses/${continueCourse.courseId}`}>
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        Continue Learning
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="my-courses" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-courses">My Courses</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="my-courses" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {progressData.map((progress) => (
                <Card key={progress.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                    {progress.course.thumbnail ? (
                      <img 
                        src={progress.course.thumbnail} 
                        alt={progress.course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-green-100">
                        <BookOpen className="h-12 w-12 text-orange-500" />
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {progress.course.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={progress.course.instructor.avatar} alt={progress.course.instructor.name} />
                            <AvatarFallback>
                              {progress.course.instructor.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600">{progress.course.instructor.name}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Progress</span>
                          <span className="text-sm text-gray-600">
                            {Math.round(progress.progress)}%
                          </span>
                        </div>
                        <Progress value={progress.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formatDuration(progress.timeSpent)}
                          </span>
                        </div>
                        {progress.completed && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>

                      <Link href={`/courses/${progress.courseId}`}>
                        <Button className="w-full" size="sm">
                          {progress.completed ? 'Review Course' : 'Continue Learning'}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {progressData
                .filter(p => p.completed)
                .map((progress) => (
                  <Card key={progress.id} className="border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <span className="text-sm font-medium text-green-700">Completed</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {progress.course.title}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Time spent: {formatDuration(progress.timeSpent)}</p>
                        <p>Completed: {formatDate(progress.lastAccess)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="in-progress" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {progressData
                .filter(p => !p.completed && p.progress > 0)
                .map((progress) => (
                  <Card key={progress.id}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {progress.course.title}
                      </h3>
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Progress</span>
                          <span className="text-sm text-gray-600">
                            {Math.round(progress.progress)}%
                          </span>
                        </div>
                        <Progress value={progress.progress} className="h-2" />
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        <p>Last accessed: {formatDate(progress.lastAccess)}</p>
                      </div>
                      <Link href={`/courses/${progress.courseId}`}>
                        <Button className="w-full" size="sm">
                          Continue Learning
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}