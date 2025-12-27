"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LearningPathCard } from "@/components/learning-path-card"
import { BookOpen, Users, Clock, Target, TrendingUp } from "lucide-react"

interface LearningPath {
  id: string
  title: string
  description: string
  icon?: string
  color?: string
  courseCount: number
  previewCourses: Array<{
    id: string
    title: string
    description?: string
    thumbnail?: string
    difficulty: string
    duration: number
    lessonCount?: number
    instructor: {
      id: string
      name: string
      avatar?: string | null
    }
  }>
  totalDuration?: number
  totalLessons?: number
}

interface PathStats {
  totalPaths: number
  totalCourses: number
  totalDuration: number
  popularPath: string
}

export default function LearningPathsPage() {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLearningPaths()
  }, [])

  const fetchLearningPaths = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/learning-paths')
      const data = await response.json()

      if (data.success) {
        setLearningPaths(data.learningPaths)
      }
    } catch (error) {
      console.error('Fetch learning paths error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPathStats = (): PathStats => {
    const totalPaths = learningPaths.length
    const totalCourses = learningPaths.reduce((sum, path) => sum + path.courseCount, 0)
    const totalDuration = learningPaths.reduce((sum, path) => {
      return sum + (path.previewCourses || []).reduce((courseSum, course) => courseSum + course.duration, 0)
    }, 0)
    
    const popularPath = learningPaths.length > 0 
      ? learningPaths.reduce((prev, current) => 
          prev.courseCount > current.courseCount ? prev : current
        ).title
      : ''

    return {
      totalPaths,
      totalCourses,
      totalDuration,
      popularPath
    }
  }

  const stats = getPathStats()

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const getPathIcon = (title: string) => {
    if (title.toLowerCase().includes('career')) return '🎯'
    if (title.toLowerCase().includes('tech')) return '💻'
    if (title.toLowerCase().includes('money') || title.toLowerCase().includes('finance')) return '💰'
    if (title.toLowerCase().includes('business')) return '📈'
    return '📚'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Learning Paths
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Follow curated learning journeys designed by industry experts. 
            Each path combines multiple courses to take you from beginner to job-ready.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">{stats.totalPaths}</CardTitle>
              <CardDescription>Learning Paths</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">{stats.totalCourses}</CardTitle>
              <CardDescription>Total Courses</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">{formatDuration(stats.totalDuration)}</CardTitle>
              <CardDescription>Total Content</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">{stats.popularPath}</CardTitle>
              <CardDescription>Most Popular</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Learning Paths Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {learningPaths.map((path) => (
              <LearningPathCard key={path.id} path={path} />
            ))}
          </div>
        )}

        {/* How It Works */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Learning Paths Work
            </h2>
            <p className="text-lg text-gray-600">
              Structured learning for guaranteed success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Path</h3>
              <p className="text-gray-600">
                Select a learning path that matches your career goals and interests
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn Step-by-Step</h3>
              <p className="text-gray-600">
                Progress through carefully curated courses in the recommended order
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Achieve Your Goals</h3>
              <p className="text-gray-600">
                Complete the path and earn certificates to showcase your skills
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}