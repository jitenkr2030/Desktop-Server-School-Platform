"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

interface ProgressData {
  id: string
  userId: string
  courseId: string
  lessonId?: string
  progress: number
  timeSpent: number
  completed: boolean
  lastAccess: string
}

interface LearningProgressContextType {
  progressData: ProgressData[]
  updateProgress: (data: {
    courseId: string
    lessonId?: string
    progress: number
    timeSpent?: number
    completed?: boolean
  }) => Promise<void>
  markLessonComplete: (courseId: string, lessonId: string) => Promise<void>
  getCourseProgress: (courseId: string) => ProgressData | null
  getLessonProgress: (courseId: string, lessonId: string) => ProgressData | null
  isLoading: boolean
}

const LearningProgressContext = createContext<LearningProgressContextType | undefined>(undefined)

export function LearningProgressProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [progressData, setProgressData] = useState<ProgressData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const fetchProgressData = async () => {
    if (!session?.user?.id || status === 'loading') {
      return
    }

    try {
      const response = await fetch(`/api/progress?userId=${session.user.id}`)
      const data = await response.json()
      
      if (data.success && Array.isArray(data.progress)) {
        setProgressData(data.progress)
      }
    } catch (error) {
      console.error('Fetch progress error:', error)
    } finally {
      setIsInitialized(true)
    }
  }

  const updateProgress = async (data: {
    courseId: string
    lessonId?: string
    progress: number
    timeSpent?: number
    completed?: boolean
  }) => {
    if (!session?.user?.id) {
      console.warn('Cannot update progress: User not authenticated')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          ...data
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Update local state
        setProgressData(prev => {
          const existingIndex = prev.findIndex(p => p.courseId === data.courseId)
          
          if (existingIndex >= 0) {
            const updated = [...prev]
            updated[existingIndex] = {
              ...updated[existingIndex],
              progress: Math.max(updated[existingIndex].progress, data.progress),
              timeSpent: (updated[existingIndex].timeSpent || 0) + (data.timeSpent || 0),
              completed: data.completed || updated[existingIndex].completed,
              lessonId: data.lessonId || updated[existingIndex].lessonId,
              lastAccess: new Date().toISOString()
            }
            return updated
          } else {
            return [
              ...prev,
              {
                id: result.progress?.id || `temp-${Date.now()}`,
                userId: session.user.id,
                courseId: data.courseId,
                lessonId: data.lessonId,
                progress: data.progress,
                timeSpent: data.timeSpent || 0,
                completed: data.completed || false,
                lastAccess: new Date().toISOString()
              }
            ]
          }
        })
      }
    } catch (error) {
      console.error('Update progress error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markLessonComplete = async (courseId: string, lessonId: string) => {
    // Calculate progress based on total lessons in course
    // For now, we'll use a simple increment approach
    // In a real app, you'd fetch the total lesson count and calculate properly
    
    const currentProgress = progressData.find(p => p.courseId === courseId)
    const currentPercent = currentProgress?.progress || 0
    const newPercent = Math.min(currentPercent + 10, 100) // Increment by 10% per lesson
    
    await updateProgress({
      courseId,
      lessonId,
      progress: newPercent,
      timeSpent: 0,
      completed: newPercent >= 100
    })
  }

  const getCourseProgress = (courseId: string) => {
    return progressData.find(p => p.courseId === courseId) || null
  }

  const getLessonProgress = (courseId: string, lessonId: string) => {
    return progressData.find(p => p.courseId === courseId && p.lessonId === lessonId) || null
  }

  // Fetch progress data when user is authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetchProgressData()
    } else if (status === 'unauthenticated') {
      setIsInitialized(true)
    }
  }, [status])

  const value: LearningProgressContextType = {
    progressData,
    updateProgress,
    markLessonComplete,
    getCourseProgress,
    getLessonProgress,
    isLoading: isLoading || (!isInitialized && status === 'loading')
  }

  return (
    <LearningProgressContext.Provider value={value}>
      {children}
    </LearningProgressContext.Provider>
  )
}

export function useLearningProgress() {
  const context = useContext(LearningProgressContext)
  // Return safe defaults instead of throwing an error
  // This allows components to work even without being wrapped in a provider
  if (context === undefined) {
    return {
      progressData: [],
      updateProgress: async () => {},
      markLessonComplete: async () => {},
      getCourseProgress: () => null,
      getLessonProgress: () => null,
      isLoading: false
    }
  }
  return context
}
