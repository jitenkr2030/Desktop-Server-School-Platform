"use client"

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLearningProgress } from '@/contexts/learning-progress-context'
import { 
  Clock, 
  BookOpen, 
  Play, 
  FileText, 
  Headphones, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  User,
  Target,
  CheckCircle,
  Star,
  Users
} from "lucide-react"
import Link from "next/link"
import { getCourseById, type Course } from '@/lib/course-data'
import { LearningProgressProvider } from '@/contexts/learning-progress-context'

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { getCourseProgress, markLessonComplete } = useLearningProgress()
  
  const courseId = params.id as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false)

  useEffect(() => {
    // Load course from static data
    const courseData = getCourseById(courseId)
    
    if (courseData) {
      setCourse(courseData)
    }
    
    setLoading(false)
  }, [courseId])

  // Sync with progress context when course loads
  useEffect(() => {
    if (course && session?.user) {
      const progress = getCourseProgress(course.id)
      if (progress) {
        const completedCount = Math.floor((progress.progress / 100) * course.lessonCount)
        const completed = new Set<string>()
        
        // Get all lesson IDs from modules
        const allLessonIds: string[] = []
        course.modules.forEach(module => {
          module.lessons.forEach(lesson => {
            allLessonIds.push(lesson.id)
          })
        })
        
        for (let i = 0; i < completedCount && i < allLessonIds.length; i++) {
          completed.add(allLessonIds[i])
        }
        setCompletedLessons(completed)
      }
    }
  }, [course, session, getCourseProgress])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
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

  const getAllLessons = useMemo(() => {
    if (!course) return []
    const lessons: Array<{
      id: string
      title: string
      duration: number
      order: number
      type: string
      isFree: boolean
    }> = []
    
    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        lessons.push({
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
          order: lesson.order,
          type: lesson.type,
          isFree: lesson.isFree
        })
      })
    })
    
    return lessons
  }, [course])

  const markLessonCompleteHandler = async (lessonId: string) => {
    if (!session?.user || !course) return
    
    const newCompleted = new Set(completedLessons)
    newCompleted.add(lessonId)
    setCompletedLessons(newCompleted)
    
    await markLessonComplete(course.id, lessonId)
  }

  const handleStartLearning = () => {
    if (course && getAllLessons.length > 0) {
      // Find first free lesson or first lesson
      const firstLesson = getAllLessons.find(l => l.isFree) || getAllLessons[0]
      router.push(`/lessons/${firstLesson.id}`)
    } else {
      console.error('No lessons available for this course')
      alert('No lessons available for this course yet. Please check back later.')
    }
  }

  const handleContinueLearning = () => {
    if (course && getAllLessons.length > 0) {
      // Find the first incomplete lesson
      const nextLessonIndex = getAllLessons.findIndex(lesson => !completedLessons.has(lesson.id))
      const lessonIndex = nextLessonIndex !== -1 ? nextLessonIndex : 0
      router.push(`/lessons/${getAllLessons[lessonIndex].id}`)
    } else {
      console.error('No lessons available for this course')
      alert('No lessons available for this course yet. Please check back later.')
    }
  }

  const getProgressPercentage = () => {
    if (!course || getAllLessons.length === 0) return completedLessons.size > 0 ? 100 : 0
    return (completedLessons.size / getAllLessons.length) * 100
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist or has been removed.</p>
          <Link href="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <LearningProgressProvider>
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Course Thumbnail */}
            <div className="lg:w-1/3">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                {course.thumbnail && course.thumbnail !== '/courses/python-masterclass/thumbnail.jpg' ? (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-green-100">
                    <BookOpen className="h-16 w-16 text-orange-500" />
                  </div>
                )}
                {/* Price Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  background: course.price === 0 ? '#16a34a' : '#ea580c',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  fontSize: '1.125rem'
                }}>
                  {course.price === 0 ? 'FREE' : `₹${course.price}`}
                  {course.originalPrice > course.price && (
                    <span style={{
                      textDecoration: 'line-through',
                      fontSize: '0.875rem',
                      marginLeft: '0.5rem',
                      opacity: 0.8
                    }}>
                      ₹{course.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Course Info */}
            <div className="lg:w-2/3 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getDifficultyColor(course.difficulty)}>
                  {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                </Badge>
                <Badge variant="outline">
                  ⏱️ {formatDuration(course.totalDuration)}
                </Badge>
                <Badge variant="outline">
                  📚 {course.lessonCount} lessons
                </Badge>
                {course.rating > 0 && (
                  <Badge variant="outline" className="bg-yellow-50">
                    ⭐ {course.rating} ({course.reviewCount} reviews)
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900">
                {course.title}
              </h1>

              <p className="text-lg text-gray-600">
                {course.description}
              </p>

              {/* Tagline */}
              {course.tagline && (
                <p className="text-orange-600 font-medium">
                  {course.tagline}
                </p>
              )}

              {/* Instructor Info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                  <AvatarFallback>
                    {course.instructor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{course.instructor.name}</p>
                  <p className="text-sm text-gray-600">{course.instructor.title}</p>
                </div>
              </div>

              {/* Course Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(course.totalDuration)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.lessonCount} lessons</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>{course.moduleCount} modules</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.enrollmentCount.toLocaleString()} enrolled</span>
                </div>
              </div>

              {/* Progress - Only show if logged in */}
              {session?.user && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Your Progress</span>
                    <span className="text-sm text-gray-600">
                      {completedLessons.size} of {getAllLessons.length} completed
                    </span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-2" />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 flex-wrap">
                {isEnrolled ? (
                  <Button 
                    size="lg" 
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={completedLessons.size > 0 ? handleContinueLearning : handleStartLearning}
                    disabled={getAllLessons.length === 0}
                  >
                    {completedLessons.size > 0 ? 'Continue Learning' : 'Start Learning'}
                  </Button>
                ) : course.price === 0 ? (
                  <Button 
                    size="lg" 
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => setIsEnrolled(true)}
                  >
                    Enroll for Free
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => setShowEnrollmentModal(true)}
                  >
                    Enroll Now - ₹{course.price}
                  </Button>
                )}
                <Button size="lg" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Resources
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="lessons">Curriculum</TabsTrigger>
                <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Course</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-gray-600 whitespace-pre-line">
                        {course.longDescription}
                      </p>
                    </div>
                    
                    {course.instructor.bio && (
                      <div>
                        <h3 className="font-semibold mb-2">About the Instructor</h3>
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                            <AvatarFallback>
                              {course.instructor.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{course.instructor.name}</p>
                            <p className="text-sm text-gray-600">{course.instructor.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{course.instructor.bio}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold mb-2">Course Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Language:</span>
                          <span className="ml-2 font-medium">{course.language}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Difficulty:</span>
                          <span className="ml-2 font-medium capitalize">{course.difficulty}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Duration:</span>
                          <span className="ml-2 font-medium">{formatDuration(course.totalDuration)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Last Updated:</span>
                          <span className="ml-2 font-medium">{new Date(course.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="lessons" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Curriculum</CardTitle>
                    <CardDescription>
                      {course.moduleCount} modules • {course.lessonCount} lessons • {formatDuration(course.totalDuration)} total
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {course.modules.map((module, moduleIndex) => (
                      <div key={module.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">
                              Module {moduleIndex + 1}: {module.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {module.lessons.length} lessons
                            </p>
                          </div>
                        </div>
                        <div className="divide-y">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div 
                              key={lesson.id} 
                              className="flex items-center justify-between p-4 hover:bg-gray-50"
                            >
                              <div className="flex items-center gap-4">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${
                                  completedLessons.has(lesson.id)
                                    ? 'bg-green-500 text-white'
                                    : 'bg-orange-100 text-orange-600'
                                }`}>
                                  {completedLessons.has(lesson.id) ? (
                                    <CheckCircle className="h-5 w-5" />
                                  ) : (
                                    lessonIndex + 1
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {formatDuration(lesson.duration)}
                                    </span>
                                    <span className="capitalize flex items-center gap-1">
                                      {lesson.type === 'video' && <Play className="h-3 w-3" />}
                                      {lesson.type === 'text' && <FileText className="h-3 w-3" />}
                                      {lesson.type === 'quiz' && <Target className="h-3 w-3" />}
                                      {lesson.type}
                                    </span>
                                    {lesson.isFree && (
                                      <Badge variant="secondary" className="text-xs">
                                        FREE PREVIEW
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {completedLessons.has(lesson.id) ? (
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    onClick={() => router.push(`/lessons/${lesson.id}`)}
                                  >
                                    Review
                                  </Button>
                                ) : (
                                  <Button 
                                    size="sm"
                                    className="bg-orange-500 hover:bg-orange-600"
                                    onClick={() => router.push(`/lessons/${lesson.id}`)}
                                  >
                                    Start
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="outcomes" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What You'll Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {course.outcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{outcome}</span>
                        </li>
                      ))}
                    </ul>

                    {course.requirements.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-3">Requirements</h3>
                        <ul className="space-y-2">
                          {course.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-gray-600 text-sm">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                        <span className="text-4xl font-bold">{course.rating}</span>
                        <span className="text-gray-500">/5</span>
                      </div>
                      <p className="text-gray-600">
                        Based on {course.reviewCount.toLocaleString()} student reviews
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Module {moduleIndex + 1}: {module.title}
                    </h4>
                    <div className="space-y-1">
                      {module.lessons.slice(0, 3).map((lesson) => (
                        <button
                          key={lesson.id}
                          className={`w-full text-left p-2 rounded text-sm transition-colors ${
                            completedLessons.has(lesson.id)
                              ? 'bg-green-50 hover:bg-green-100'
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => router.push(`/lessons/${lesson.id}`)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{lesson.title}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              {formatDuration(lesson.duration)}
                            </span>
                          </div>
                        </button>
                      ))}
                      {module.lessons.length > 3 && (
                        <button
                          className="w-full text-left p-2 text-sm text-orange-600 hover:bg-orange-50 rounded"
                          onClick={() => {
                            // Scroll to curriculum tab
                            document.querySelector('[value="lessons"]')?.parentElement?.click()
                          }}
                        >
                          +{module.lessons.length - 3} more lessons
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download All Resources
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Certificate
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Contact Instructor
                </Button>
              </CardContent>
            </Card>

            {/* Login Prompt for Progress Tracking */}
            {!session?.user && (
              <Card className="bg-orange-50 border-orange-200">
                <CardHeader>
                  <CardTitle className="text-lg text-orange-800">Track Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-4">
                    Sign in to save your progress, earn certificates, and track your learning journey!
                  </p>
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={() => router.push('/auth/login')}
                  >
                    Sign In to Track Progress
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {showEnrollmentModal && course && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Enroll in {course.title}</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Course Price</span>
                <span className="text-xl font-bold">₹{course.price}</span>
              </div>
              <div className="text-sm text-gray-500">
                This is a demo enrollment. In a real application, you would be redirected to a payment processor.
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowEnrollmentModal(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                onClick={() => {
                  setIsEnrolled(true)
                  setShowEnrollmentModal(false)
                }}
              >
                Confirm & Enroll
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </LearningProgressProvider>
  )
}
