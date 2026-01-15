"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, Volume2, FileText, Download, BookOpen, Clock, ChevronLeft, ChevronRight } from "lucide-react"

interface Lesson {
  id: string
  title: string
  content: string
  videoUrl?: string
  audioUrl?: string
  pdfUrl?: string
  duration: number
  order: number
  course: {
    id: string
    title: string
    instructor: {
      id: string
      name: string
    }
  }
}

interface LessonPlayerProps {
  lesson: Lesson
  onComplete?: () => void
  onNext?: () => void
  onPrevious?: () => void
  hasNext?: boolean
  hasPrevious?: boolean
  userId?: string
}

export function LessonPlayer({ 
  lesson, 
  onComplete, 
  onNext, 
  onPrevious, 
  hasNext = false, 
  hasPrevious = false,
  userId 
}: LessonPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTab, setCurrentTab] = useState('content')

  useEffect(() => {
    // Reset state when lesson changes
    setIsPlaying(false)
    setProgress(0)
    setCurrentTab('content')
  }, [lesson.id])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleProgressComplete = async () => {
    setProgress(100)
    
    // Track progress in backend
    if (userId) {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            courseId: lesson.course.id,
            lessonId: lesson.id,
            progress: 100,
            timeSpent: lesson.duration, // Assume full duration spent
            completed: true
          }),
        })
      } catch (error) {
        console.error('Track progress error:', error)
      }
    }
    
    if (onComplete) {
      onComplete()
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const handleDownloadPDF = () => {
    if (lesson.pdfUrl) {
      window.open(lesson.pdfUrl, '_blank')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Lesson Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">
                  Lesson {lesson.order}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(lesson.duration)}</span>
                </div>
              </div>
              <CardTitle className="text-2xl">{lesson.title}</CardTitle>
              <p className="text-gray-600">
                {lesson.course.title} • {lesson.course.instructor.name}
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
      </Card>

      {/* Content Tabs */}
      <Card>
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-3">
            {lesson.videoUrl && (
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Video
              </TabsTrigger>
            )}
            {lesson.audioUrl && (
              <TabsTrigger value="audio" className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Audio
              </TabsTrigger>
            )}
            <TabsTrigger value="content" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Content
            </TabsTrigger>
          </TabsList>

          {/* Video Content */}
          {lesson.videoUrl && (
            <TabsContent value="video" className="p-6">
              <div className="space-y-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  {/* Video Player Placeholder */}
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <div className="text-center">
                      <Play className="h-16 w-16 text-white mx-auto mb-4" />
                      <p className="text-white">Video Player</p>
                      <p className="text-gray-400 text-sm">Video content would be loaded here</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    onClick={handlePlayPause}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  <Button onClick={handleProgressComplete} className="bg-green-500 hover:bg-green-600">
                    Mark as Complete
                  </Button>
                </div>
              </div>
            </TabsContent>
          )}

          {/* Audio Content */}
          {lesson.audioUrl && (
            <TabsContent value="audio" className="p-6">
              <div className="space-y-4">
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Volume2 className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Audio Lesson</h3>
                      <p className="text-gray-600 mb-4">
                        Listen to this lesson in audio format - perfect for learning on the go
                      </p>
                      <Button
                        onClick={handlePlayPause}
                        className="flex items-center gap-2"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        {isPlaying ? 'Pause Audio' : 'Play Audio'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Audio Player Placeholder */}
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={handlePlayPause}
                      size="lg"
                      variant="outline"
                      className="rounded-full"
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>{formatDuration(Math.floor(lesson.duration * progress / 100))}</span>
                        <span>{formatDuration(lesson.duration)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleProgressComplete} className="w-full bg-green-500 hover:bg-green-600">
                  Mark as Complete
                </Button>
              </div>
            </TabsContent>
          )}

          {/* Text Content */}
          <TabsContent value="content" className="p-6">
            <div className="space-y-6">
              <div className="prose max-w-none">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Lesson Content</h3>
                  <div className="text-gray-700 leading-relaxed">
                    {lesson.content || (
                      <div className="space-y-4">
                        <p>
                          This is where the lesson content would appear. The content includes detailed explanations, 
                          examples, and key learning points to help you master the topic.
                        </p>
                        <p>
                          Each lesson is carefully structured to build your knowledge step by step, with 
                          practical examples and exercises to reinforce your learning.
                        </p>
                        <h4>Key Learning Objectives:</h4>
                        <ul>
                          <li>Understand the core concepts and principles</li>
                          <li>Apply knowledge in practical scenarios</li>
                          <li>Develop skills through hands-on practice</li>
                          <li>Build confidence in the subject matter</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* PDF Download */}
              {lesson.pdfUrl && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-red-500" />
                        <div>
                          <h4 className="font-semibold">Lesson PDF</h4>
                          <p className="text-sm text-gray-600">
                            Download and read offline
                          </p>
                        </div>
                      </div>
                      <Button onClick={handleDownloadPDF} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button onClick={handleProgressComplete} className="w-full bg-green-500 hover:bg-green-600">
                Mark as Complete
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={onPrevious}
              disabled={!hasPrevious}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous Lesson
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Lesson {lesson.order} • {formatDuration(lesson.duration)}
              </p>
            </div>
            
            <Button
              onClick={onNext}
              disabled={!hasNext}
              className="flex items-center gap-2"
            >
              Next Lesson
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}