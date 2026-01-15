"use client"

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LowBandwidthMediaPlayer } from "@/components/low-bandwidth-media-player"
import { useLearningProgress } from '@/contexts/learning-progress-context'
import { useSession } from 'next-auth/react'
import { 
  ChevronLeft, 
  ChevronRight,
  Clock,
  BookOpen,
  CheckCircle,
  Play,
  Headphones,
  FileText
} from "lucide-react"
import Link from "next/link"
import { courses, type Course, type Lesson, type Module } from '@/lib/course-data'

// Helper function to find a lesson across all courses
function findLessonById(lessonId: string): { 
  lesson: Lesson; 
  course: Course; 
  module: Module;
  lessonIndex: number;
  moduleIndex: number;
} | null {
  for (const course of courses) {
    if (!course.isActive) continue
    
    for (const module of course.modules) {
      const lessonIndex = module.lessons.findIndex(l => l.id === lessonId)
      if (lessonIndex !== -1) {
        return {
          lesson: module.lessons[lessonIndex],
          course,
          module,
          lessonIndex,
          moduleIndex: course.modules.indexOf(module)
        }
      }
    }
  }
  return null
}

// Helper function to get all lessons for navigation
function getLessonNavigation(lessonId: string, course: Course): {
  previous: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
  currentIndex: number;
  totalLessons: number;
} {
  const allLessons: Array<{ id: string; title: string }> = []
  
  course.modules.forEach(module => {
    module.lessons.forEach(lesson => {
      allLessons.push({ id: lesson.id, title: lesson.title })
    })
  })
  
  const currentIndex = allLessons.findIndex(l => l.id === lessonId)
  
  return {
    previous: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
    next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null,
    currentIndex: currentIndex + 1,
    totalLessons: allLessons.length
  }
}

export default function LessonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { markLessonComplete, getCourseProgress, updateProgress } = useLearningProgress()
  
  const lessonId = params.id as string
  
  const [lessonData, setLessonData] = useState<{ 
    lesson: Lesson; 
    course: Course; 
    module: Module;
    moduleIndex: number;
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCompletionToast, setShowCompletionToast] = useState(false)
  
  useEffect(() => {
    // Load lesson from static data
    const data = findLessonById(lessonId)
    
    if (data) {
      setLessonData(data)
      
      // Check if this lesson was already completed
      const progress = getCourseProgress(data.course.id)
      if (progress?.completed) {
        setIsCompleted(true)
      }
    }
    
    setLoading(false)
  }, [lessonId, getCourseProgress])

  const navigation = useMemo(() => {
    if (!lessonData) return null
    return getLessonNavigation(lessonId, lessonData.course)
  }, [lessonData, lessonId])

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const navigateToLesson = (id: string) => {
    router.push(`/lessons/${id}`)
  }

  const handleComplete = async () => {
    if (!lessonData) return
    
    if (!session?.user) {
      // If not logged in, just show completion locally
      setIsCompleted(true)
      setShowCompletionToast(true)
      setTimeout(() => setShowCompletionToast(false), 3000)
      return
    }

    try {
      await markLessonComplete(lessonData.course.id, lessonId)
      setIsCompleted(true)
      setShowCompletionToast(true)
      setTimeout(() => setShowCompletionToast(false), 3000)
      
      // Update progress
      await updateProgress({
        courseId: lessonData.course.id,
        lessonId: lessonId,
        progress: 100,
        timeSpent: 0,
        completed: true
      })
    } catch (error) {
      console.error('Complete lesson error:', error)
    }
  }

  // Calculate overall course progress for the progress bar
  const getCourseProgressValue = () => {
    if (!lessonData || !navigation) return 0
    const progress = getCourseProgress(lessonData.course.id)
    return progress?.progress || ((navigation.currentIndex / navigation.totalLessons) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!lessonData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lesson not found</h2>
          <p className="text-gray-600 mb-4">The lesson you're looking for doesn't exist or has been removed.</p>
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  const { lesson, course, module } = lessonData

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Completion Toast */}
      {showCompletionToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle className="h-5 w-5" />
          <span>Lesson completed! Great job! 🎉</span>
        </div>
      )}

      {/* Lesson Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/courses/${course.id}`}>
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Course
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{lesson.title}</h1>
                <p className="text-sm text-gray-600">
                  {course.title} • Module {lessonData.moduleIndex + 1}: {module.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isCompleted && (
                <Badge className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Course Progress - Lesson {navigation?.currentIndex} of {navigation?.totalLessons}</span>
            <span>{Math.round(getCourseProgressValue())}%</span>
          </div>
          <Progress 
            value={getCourseProgressValue()} 
            className="h-2"
          />
        </div>
      </div>

      {/* Lesson Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Media Player */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {lesson.type === 'video' && <Play className="h-5 w-5" />}
                  {lesson.type === 'audio' && <Headphones className="h-5 w-5" />}
                  {lesson.type === 'text' && <FileText className="h-5 w-5" />}
                  {lesson.type === 'quiz' && <BookOpen className="h-5 w-5" />}
                  {lesson.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  {lesson.type === 'video' && lesson.content ? (
                    <iframe
                      src={lesson.content}
                      title={lesson.title}
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : lesson.type === 'text' ? (
                    <div className="w-full h-full p-8">
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                          {lesson.content || 'This is a text-based lesson. The content will be displayed here. In a real application, this would contain the full lesson text, explanations, and learning materials.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <Play className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <p>Video content for: {lesson.title}</p>
                      <p className="text-sm mt-2">Content URL: {lesson.content || 'Not available'}</p>
                    </div>
                  )}
                </div>
                
                {/* Lesson Info */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDuration(lesson.duration)}
                    </span>
                    <span className="capitalize flex items-center gap-1">
                      {lesson.type === 'video' && <Play className="h-4 w-4" />}
                      {lesson.type === 'text' && <FileText className="h-4 w-4" />}
                      {lesson.type}
                    </span>
                    {lesson.isFree && (
                      <Badge variant="secondary" className="text-xs">
                        FREE PREVIEW
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lesson Content Text */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Lesson Notes & Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {lesson.content ? lesson.content.split('\n').map((paragraph, index) => {
                      if (paragraph.startsWith('## ')) {
                        return <h2 key={index} className="text-xl font-semibold mt-6 mb-3">{paragraph.replace('## ', '')}</h2>
                      } else if (paragraph.startsWith('### ')) {
                        return <h3 key={index} className="text-lg font-medium mt-4 mb-2">{paragraph.replace('### ', '')}</h3>
                      } else if (paragraph.startsWith('- ')) {
                        return <li key={index} className="ml-4">{paragraph.replace('- ', '')}</li>
                      } else if (paragraph.trim() === '') {
                        return <br key={index} />
                      } else {
                        return <p key={index} className="text-gray-700 leading-relaxed my-2">{paragraph}</p>
                      }
                    }) : (
                      <>
                        <p className="text-gray-700 leading-relaxed my-4">
                          Welcome to this lesson on <strong>{lesson.title}</strong>. This is part of the <strong>{course.title}</strong> course.
                        </p>
                        <p className="text-gray-700 leading-relaxed my-4">
                          In this lesson, you will learn key concepts that will help you build a strong foundation in this subject.
                          Take your time to go through the content, and don't forget to complete the practice exercises at the end.
                        </p>
                        <h3 className="text-lg font-medium mt-6 mb-3">Key Points</h3>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                          <li>Understanding the fundamental concepts</li>
                          <li>Practical applications and examples</li>
                          <li>Best practices and common pitfalls to avoid</li>
                          <li>How to apply what you've learned in real scenarios</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed my-4 mt-6">
                          If you have any questions about this lesson, feel free to use the Confusion/Q&A section to ask for clarification.
                        </p>
                      </>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lesson Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {navigation?.previous && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigateToLesson(navigation.previous!.id)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous: {navigation.previous.title}
                  </Button>
                )}
                
                {navigation?.next && (
                  <Button 
                    className="w-full justify-start bg-orange-500 hover:bg-orange-600"
                    onClick={() => navigateToLesson(navigation.next!.id)}
                  >
                    Next: {navigation.next.title}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
                
                <div className="border-t pt-4">
                  {!isCompleted ? (
                    <Button 
                      variant="default"
                      className="w-full justify-start bg-green-600 hover:bg-green-700"
                      onClick={handleComplete}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setIsCompleted(false)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed (Click to undo)
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Lesson Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lesson Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="text-sm font-medium">{formatDuration(lesson.duration)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Format</span>
                  <div className="flex gap-1">
                    {lesson.type === 'video' && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Play className="h-3 w-3" /> Video
                      </Badge>
                    )}
                    {lesson.type === 'audio' && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Headphones className="h-3 w-3" /> Audio
                      </Badge>
                    )}
                    {lesson.type === 'text' && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <FileText className="h-3 w-3" /> Text
                      </Badge>
                    )}
                    {lesson.type === 'quiz' && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <BookOpen className="h-3 w-3" /> Quiz
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Lesson Type</span>
                  <span className="text-sm font-medium capitalize">{lesson.type}</span>
                </div>
                {lesson.isFree && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Access</span>
                    <Badge variant="secondary" className="text-xs">Free Preview</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Lessons Completed</span>
                  <span className="font-medium">
                    {isCompleted ? navigation?.currentIndex : (navigation?.currentIndex || 1) - 1} of {navigation?.totalLessons}
                  </span>
                </div>
                <Progress 
                  value={getCourseProgressValue()} 
                  className="h-2" 
                />
                <p className="text-xs text-gray-500">
                  {Math.round(getCourseProgressValue())}% complete
                </p>
              </CardContent>
            </Card>

            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instructor</CardTitle>
              </CardHeader>
              <CardContent>
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
                <Link href={`/courses/${course.id}`}>
                  <Button variant="outline" className="w-full mt-4">
                    View Course Details
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Login Prompt for Progress Tracking */}
            {!session?.user && (
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-700 mb-3">
                      Sign in to save your progress and track your learning journey!
                    </p>
                    <Button 
                      size="sm" 
                      className="bg-orange-500 hover:bg-orange-600"
                      onClick={() => router.push('/auth/login')}
                    >
                      Sign In
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
