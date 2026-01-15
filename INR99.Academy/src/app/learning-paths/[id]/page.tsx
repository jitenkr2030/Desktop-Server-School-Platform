"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  BookOpen, 
  Clock, 
  Users, 
  ArrowLeft, 
  PlayCircle, 
  CheckCircle,
  Target,
  TrendingUp,
  Award,
  Lightbulb,
  Loader2
} from "lucide-react"
import Link from "next/link"

interface Course {
  id: string
  title: string
  description: string
  difficulty: string
  duration: number
  thumbnail?: string
  isActive: boolean
  instructor: {
    id: string
    name: string
    avatar?: string
  }
  _count: {
    lessons: number
  }
}

interface LearningPath {
  id: string
  title: string
  description: string
  icon?: string
  color: string
  isActive: boolean
  sortOrder: number
  courses: Course[]
  courseCount: number
  totalDuration: number
  totalLessons: number
}

export default function LearningPathDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  
  const pathId = params.id as string

  useEffect(() => {
    if (pathId) {
      fetchLearningPath()
    }
  }, [pathId])

  const fetchLearningPath = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/learning-paths?id=${pathId}`)
      const data = await response.json()

      if (data.success && data.learningPath) {
        setLearningPath(data.learningPath)
      } else {
        setLearningPath(null)
      }
    } catch (error) {
      console.error('Error fetching learning path:', error)
      setLearningPath(null)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!session?.user) {
      router.push('/auth/login')
      return
    }

    // Enroll in the first course of the path
    if (learningPath && learningPath.courses.length > 0) {
      setEnrolling(true)
      try {
        const response = await fetch('/api/enrollments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId: learningPath.courses[0].id })
        })

        const data = await response.json()

        if (data.success) {
          // Navigate to the first course
          router.push(`/courses/${learningPath.courses[0].id}`)
        } else {
          alert(data.error || 'Failed to enroll')
        }
      } catch (error) {
        console.error('Enrollment error:', error)
        alert('Failed to enroll. Please try again.')
      } finally {
        setEnrolling(false)
      }
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
    }
    return `${mins}m`
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

  const userName = session?.user?.name || 'Guest'
  const userEmail = session?.user?.email || 'guest@example.com'

  if (loading) {
    return (
      <DashboardLayout userRole="student" userInfo={{ name: userName, email: userEmail }}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      </DashboardLayout>
    )
  }

  if (!learningPath) {
    return (
      <DashboardLayout userRole="student" userInfo={{ name: userName, email: userEmail }}>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Learning Path Not Found</h1>
              <p className="text-gray-600 mb-6">
                The learning path you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/learning-paths">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Learning Paths
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="student" userInfo={{ name: userName, email: userEmail }}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/learning-paths">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Learning Paths
                </Button>
              </Link>
            </div>
            
            <div className="flex items-start gap-6">
              <div className={`w-16 h-16 rounded-lg ${learningPath.color} flex items-center justify-center flex-shrink-0`}>
                {learningPath.icon ? (
                  <span className="text-2xl">{learningPath.icon}</span>
                ) : (
                  <Target className="h-8 w-8 text-white" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{learningPath.title}</h1>
                  <Badge className={`${learningPath.color} text-white`}>
                    {learningPath.courseCount} courses
                  </Badge>
                </div>
                <p className="text-lg text-gray-600 mb-4">{learningPath.description}</p>
                
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(learningPath.totalDuration)} total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{learningPath.totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Beginner to Advanced</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Action Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Ready to Start Your Journey?</h2>
                  <p className="text-gray-600">
                    Follow this curated learning path and master {learningPath.title.toLowerCase()}.
                  </p>
                </div>
                <Button 
                  onClick={handleEnroll}
                  disabled={enrolling || learningPath.courses.length === 0}
                  className={`px-8 bg-orange-500 hover:bg-orange-600 text-white`}
                >
                  {enrolling ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <PlayCircle className="h-4 w-4 mr-2" />
                  )}
                  {enrolling ? 'Enrolling...' : 'Start Learning'}
                </Button>
              </div>
            </div>

            {/* Learning Path Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      What You'll Learn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Lightbulb className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Comprehensive Curriculum</h3>
                          <p className="text-sm text-gray-600">
                            Master all essential concepts with carefully structured courses
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Award className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Practical Skills</h3>
                          <p className="text-sm text-gray-600">
                            Build real-world projects and hands-on experience
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Industry Recognition</h3>
                          <p className="text-sm text-gray-600">
                            Earn certificates recognized by employers in the industry
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Path Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {learningPath.courseCount}
                      </div>
                      <div className="text-sm text-gray-600">Courses</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {formatDuration(learningPath.totalDuration)}
                      </div>
                      <div className="text-sm text-gray-600">Total Duration</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {learningPath.totalLessons}
                      </div>
                      <div className="text-sm text-gray-600">Lessons</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Courses in this Path */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Courses in This Path</h2>
              
              {learningPath.courses && learningPath.courses.length > 0 ? (
                <div className="space-y-4">
                  {learningPath.courses.map((course, index) => (
                    <Card key={course.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                              <span className="text-lg font-bold text-orange-600">{index + 1}</span>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                                <p className="text-gray-600 text-sm">{course.description}</p>
                              </div>
                              <Badge className={getDifficultyColor(course.difficulty)}>
                                {course.difficulty}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatDuration(course.duration)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                <span>{course._count.lessons} lessons</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={course.instructor.avatar} />
                                  <AvatarFallback>
                                    {course.instructor.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-gray-600">{course.instructor.name}</span>
                              </div>
                              
                              <Link href={`/courses/${course.id}`}>
                                <Button variant="outline" size="sm">
                                  View Course
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Available</h3>
                    <p className="text-gray-600">
                      This learning path doesn't have any courses yet. Check back later for updates.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
