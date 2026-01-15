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

interface Lesson {
  id: string
  title: string
  duration: number
  order: number
  type: string
  isFree: boolean
  videoUrl?: string | null
  content?: string | null
}

interface Module {
  id: string
  title: string
  order: number
  lessons: Lesson[]
}

interface Instructor {
  id: string
  name: string
  bio?: string | null
  avatar?: string | null
  expertise?: string[]
  title?: string
}

interface Course {
  id: string
  title: string
  description: string
  longDescription: string
  thumbnail: string | null
  difficulty: string
  duration: number
  pricing?: {
    type: string
    price: number
    currency: string
    period: string
    description: string
  } | null
  rating: number
  reviewCount: number
  tagline?: string
  language: string
  instructor: Instructor
  learningPath?: {
    id: string
    title: string
    description: string
    color: string
    icon: string
  } | null
  modules: Module[]
  lessons: Lesson[]
  lessonCount: number
  moduleCount: number
  enrollmentCount: number
  outcomes: string[]
  requirements: string[]
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  success: boolean
  course: Course
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { getCourseProgress, markLessonComplete } = useLearningProgress()

  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle')
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptData, setReceiptData] = useState<any>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`)
        if (response.ok) {
          const data: ApiResponse = await response.json()
          setCourse(data.course)
          
          // Check subscription status if user is logged in
          if (session?.user) {
            const subResponse = await fetch('/api/user/subscription')
            if (subResponse.ok) {
              const subData = await subResponse.json()
              setIsSubscribed(subData.isActive)
            }
          }
        } else {
          setError('Course not found')
        }
      } catch (err) {
        console.error('Failed to fetch course:', err)
        setError('Failed to load course')
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [courseId, session])

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
    switch (difficulty.toUpperCase()) {
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

  // Get thumbnail path - maps course ID to thumbnail file
  const getThumbnailPath = (courseId: string, currentThumbnail: string | null) => {
    if (currentThumbnail && (currentThumbnail.startsWith('/assets/') || currentThumbnail.startsWith('/images/'))) {
      return currentThumbnail
    }
    
    const thumbnailMap: Record<string, string> = {
      'cr_english_mastery': '/assets/courses/english-communication.svg',
      'cr_indian_constitution': '/assets/courses/indian-constitution.svg',
      'cr_upi': '/assets/courses/cr_upi.svg',
      'cr_digital': '/assets/courses/cr_digital.svg',
      'cr_fraud': '/assets/courses/cr_fraud.svg',
      'cr_bulk': '/assets/courses/cr_bulk.svg',
      'cr_community': '/assets/courses/cr_community.svg',
      'cr_foodwork': '/assets/courses/cr_foodwork.svg',
      'cr_money': '/assets/courses/cr_money.svg',
      'cr_gov': '/assets/courses/cr_gov.svg',
      'cr_english': '/assets/courses/cr_english.svg',
      'python-masterclass': '/assets/courses/python-masterclass.svg',
      'data-science-python': '/assets/courses/data-science-python.svg',
      'web-development-bootcamp': '/assets/courses/web-development-bootcamp.svg',
      'ui-ux-design-masterclass': '/assets/courses/ui-ux-design-masterclass.svg',
      'digital-marketing-complete': '/assets/courses/digital-marketing-complete.svg',
      'personal-finance-mastery': '/assets/courses/personal-finance-mastery.svg',
      'stock-market-fundamentals': '/assets/courses/stock-market-fundamentals.svg',
      'indian-constitution-citizenship': '/assets/courses/indian-constitution-citizenship.svg',
      'excel-mastery': '/assets/courses/excel-mastery.svg',
      'cyber-safety-awareness': '/assets/courses/cyber-safety-awareness.svg',
      'job-prep-complete': '/assets/courses/job-prep-complete.svg',
      'startup-foundation': '/assets/courses/startup-foundation.svg',
      'meditation-mindfulness': '/assets/courses/meditation-mindfulness.svg',
      'bcom-financial-accounting': '/assets/courses/bcom-financial-accounting.svg',
      'class10-mathematics': '/assets/courses/class10-mathematics.svg',
      'course_public_speaking': '/assets/courses/public-speaking.svg',
      'career14': '/assets/courses/public-speaking.svg',
      'course-commerce-basics': '/assets/courses/commerce-basics.svg',
      'course-ca-foundation': '/assets/courses/ca-foundation.svg',
      'course-ca-intermediate': '/assets/courses/ca-intermediate.svg',
      'course-ca-final': '/assets/courses/ca-final.svg',
      'cs_executive': '/assets/courses/cs-executive.svg',
      'cs_foundation': '/assets/courses/cs-foundation.svg',
      'cs_professional': '/assets/courses/cs-professional.svg',
      'cma_foundation': '/assets/courses/cma-foundation.svg',
      'cma_intermediate': '/assets/courses/cma-intermediate.svg',
      'cma_final': '/assets/courses/cma-final.svg',
      'cfa_level1': '/assets/courses/cfa-level1.svg',
      'cfa_level2': '/assets/courses/cfa-level2.svg',
      'cfa_level3': '/assets/courses/cfa-level3.svg',
      'frm_part1': '/assets/courses/frm-part1.svg',
      'frm_part2': '/assets/courses/frm-part2.svg',
      'us_cma_part1': '/assets/courses/us-cma-part1.svg',
      'us_cma_part2': '/assets/courses/us-cma-part2.svg',
      'us_cpa': '/assets/courses/us-cpa.svg',
      'acca_level1': '/assets/courses/acca-level1.svg',
      'acca_level2': '/assets/courses/acca-level2.svg',
      'acca_level3': '/assets/courses/acca-level3.svg',
      'school_primary_1_5': '/assets/courses/school-primary-1-5.svg',
      'school_primary_6_8': '/assets/courses/school-primary-6-8.svg',
      'school_secondary_9_10': '/assets/courses/school-secondary-9-10.svg',
      'school_senior_science': '/assets/courses/school-senior-science.svg',
      'school_senior_commerce': '/assets/courses/school-senior-commerce.svg',
      'school_senior_arts': '/assets/courses/school-senior-arts.svg',
      'school_exam_prep': '/assets/courses/school-exam-prep.svg',
      'school_skills': '/assets/courses/school-skills.svg',
      'college_bsc_pcm': '/assets/courses/college-bsc-pcm.svg',
      'college_bsc_pcb': '/assets/courses/college-bsc-pcb.svg',
      'college_bsc_cs': '/assets/courses/college-bsc-cs.svg',
      'college_bsc_bio': '/assets/courses/college-bsc-biotech.svg',
      'college_bsc_stats': '/assets/courses/college-bsc-stats.svg',
      'college_bcom': '/assets/courses/college-bcom.svg',
      'college_bba': '/assets/courses/college-bba.svg',
      'college_ba_history': '/assets/courses/college-ba-history.svg',
      'college_ba_polsc': '/assets/courses/college-ba-polsc.svg',
      'college_ba_psychology': '/assets/courses/college-ba-psychology.svg',
      'college_btech_cs': '/assets/courses/college-btech-cs.svg',
      'college_llb': '/assets/courses/college-llb.svg',
      'college_semester_support': '/assets/courses/college-semester-support.svg',
      'college_exam_prep': '/assets/courses/college-exam-prep.svg',
      'college_career_skills': '/assets/courses/college-career-skills.svg',
      'course-actuarial-science': '/assets/courses/actuarial-science.svg',
      'advanced-excel-pro': '/assets/courses/advanced-excel.svg',
      'stock-market-basics': '/assets/courses/stock-market-basics.svg',
      'stock-market-advanced-trading': '/assets/courses/advanced-trading.svg',
      'options-trading-mastery': '/assets/courses/options-trading-mastery.svg',
      'technical-analysis-master': '/assets/courses/technical-analysis-master.svg',
      'price-action-trading': '/assets/courses/price-action-trading.svg',
      'risk-management-masterclass': '/assets/courses/risk-management-masterclass.svg',
      'no-code-algo-trading': '/assets/courses/no-code-algo-trading.svg',
      'mutual-funds-sip-mastery': '/assets/courses/mutual-funds-sip-mastery.svg',
      'upsc_prelims': '/assets/courses/upsc_prelims.svg',
      'upsc_mains': '/assets/courses/upsc_mains.svg',
      'upsc_interview': '/assets/courses/upsc_interview.svg',
      'advanced-answer-writing-mastery': '/assets/courses/advanced-answer-writing-mastery.svg',
      'ssc_chsl': '/assets/courses/ssc_chsl.svg',
      'ssc_cgl': '/assets/courses/ssc_cgl.svg',
      'ssc_mts': '/assets/courses/ssc_mts.svg',
      'state_police': '/assets/courses/state_police.svg',
      'state_tet': '/assets/courses/state_tet.svg',
    }
    
    if (thumbnailMap[courseId]) {
      return thumbnailMap[courseId]
    }
    
    const availableThumbnails = Object.values(thumbnailMap)
    for (const thumb of availableThumbnails) {
      const thumbName = thumb.split('/').pop()?.replace('.svg', '')
      if (thumbName && courseId.includes(thumbName)) {
        return thumb
      }
    }
    
    return currentThumbnail
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

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
          <p className="text-gray-600 mb-4">{error || "The course you're looking for doesn't exist or has been removed."}</p>
          <Link href="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Course Thumbnail */}
            <div className="lg:w-1/3">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                {(() => {
                  const thumbnailPath = getThumbnailPath(course.id, course.thumbnail)
                  if (thumbnailPath) {
                    return (
                      <img 
                        src={thumbnailPath} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement!.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-green-100">
                              <svg class="h-16 w-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                          `
                        }}
                      />
                    )
                  }
                  return (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-green-100">
                      <BookOpen className="h-16 w-16 text-orange-500" />
                    </div>
                  )
                })()}
                {/* Price Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  background: '#ea580c',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  fontSize: '1.125rem'
                }}>
                  INR 99/month
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
                  ⏱️ {formatDuration(course.duration)}
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
                  <p className="text-sm text-gray-600">{course.instructor.title || 'Instructor'}</p>
                </div>
              </div>

              {/* Course Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(course.duration)}</span>
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
                ) : (
                  <Button 
                    size="lg" 
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => {
                      if (!session?.user) {
                        router.push('/auth/login')
                        return
                      }
                      setShowPaymentModal(true)
                      setPaymentStatus('idle')
                    }}
                  >
                    Enroll Now - INR 99/month
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
                          <span className="ml-2 font-medium">{formatDuration(course.duration)}</span>
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
                      {course.moduleCount} modules • {course.lessonCount} lessons • {formatDuration(course.duration)} total
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

            {/* Quick Actions - Only show when NOT subscribed */}
            {!isSubscribed && (
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
            )}

            {/* Login Prompt for Progress Tracking - Only show when NOT subscribed */}
            {!isSubscribed && (
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

      {/* Footer Branding */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-8 mt-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">INR99.Academy</h2>
          <p className="text-lg opacity-90">
            Empowering learners worldwide with affordable, high-quality education.
          </p>
        </div>
      </div>

      {/* UPI Payment Modal */}
      {showPaymentModal && course && session?.user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {paymentStatus === 'success' && showReceipt ? (
              // Payment Receipt
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Payment Successful!</h2>
                  <p className="text-gray-600">Your enrollment has been confirmed</p>
                </div>
                
                <div className="border rounded-lg p-4 mb-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <span className="text-sm text-gray-600">Receipt Number</span>
                    <span className="font-mono font-medium">{receiptData?.receiptNumber}</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Course</span>
                      <span className="font-medium">{course.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Student</span>
                      <span className="font-medium">{session.user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email</span>
                      <span className="font-medium">{session.user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid</span>
                      <span className="font-bold text-green-600">₹{course.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">{new Date().toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium">UPI</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID</span>
                      <span className="font-mono text-xs">{receiptData?.transactionId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setShowPaymentModal(false)
                      setShowReceipt(false)
                      setIsEnrolled(true)
                    }}
                  >
                    Close
                  </Button>
                  <Button 
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                    onClick={() => {
                      // Start learning after successful payment
                      setShowPaymentModal(false)
                      setShowReceipt(false)
                      setIsEnrolled(true)
                      handleStartLearning()
                    }}
                  >
                    Start Learning
                  </Button>
                </div>
              </div>
            ) : paymentStatus === 'success' ? (
              // Processing success state
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Processing your enrollment...</p>
              </div>
            ) : (
              // Payment Modal with QR Code
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Complete Payment</h2>
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-center mb-4">
                  <p className="text-gray-600 mb-3">Scan QR Code to Pay</p>
                  <div className="border-2 border-orange-200 rounded-lg p-4 inline-block bg-white">
                    <img 
                      src="/images/qrcode.jpeg" 
                      alt="UPI QR Code" 
                      className="w-48 h-48 object-contain"
                      onError={(e) => {
                        // If image fails to load, show placeholder
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                    <div className="hidden text-center py-4">
                      <p className="text-gray-500 text-sm mb-2">QR Code</p>
                      <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                        <span className="text-4xl">📱</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Scan with any UPI app (PhonePe, GPay, Paytm, etc.)
                  </p>
                </div>

                {/* Direct UPI Link */}
                <div className="mb-6">
                  <a 
                    href={`upi://pay?pa=9871087168@kotak&pn=INR99%20Academy&am=${course.price}&cu=INR&tn=Course%20Enrollment%20${course.id}`}
                    className="block w-full py-3 bg-green-500 hover:bg-green-600 text-white text-center rounded-lg font-medium transition-colors"
                    style={{
                      display: 'inline-block',
                      textDecoration: 'none'
                    }}
                  >
                    📲 Click to Open UPI App
                  </a>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Tap above to open your UPI app directly (mobile devices)
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Course</span>
                    <span className="font-medium">{course.title}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Amount</span>
                    <span className="text-xl font-bold text-orange-600">INR 99/month</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-gray-600">UPI ID</span>
                    <span className="font-mono text-sm">9871087168@kotak</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    After payment, enter transaction ID to confirm:
                  </p>
                  <input
                    type="text"
                    id="transactionId"
                    placeholder="Enter UPI Transaction ID"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                    onClick={async () => {
                      const transactionId = (document.getElementById('transactionId') as HTMLInputElement)?.value
                      
                      if (!transactionId || transactionId.trim() === '') {
                        alert('Please enter your UPI Transaction ID after making the payment')
                        return
                      }

                      setPaymentStatus('success')

                      // Generate receipt data
                      const receipt = {
                        receiptNumber: 'RCP-' + Date.now().toString(36).toUpperCase(),
                        transactionId: transactionId,
                        courseId: course.id,
                        courseTitle: course.title,
                        studentName: session.user?.name,
                        studentEmail: session.user?.email,
                        amount: course.price,
                        paymentMethod: 'UPI',
                        paymentDate: new Date().toISOString()
                      }
                      setReceiptData(receipt)

                      // Simulate processing delay
                      setTimeout(() => {
                        setShowReceipt(true)
                      }, 1500)
                    }}
                  >
                    Confirm Payment
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By confirming, you agree that you have completed the payment via UPI
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
