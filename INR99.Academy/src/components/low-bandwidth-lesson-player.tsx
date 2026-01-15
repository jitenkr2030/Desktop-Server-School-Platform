"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useBandwidth } from "@/contexts/bandwidth-context"
import { 
  Play, 
  Pause, 
  Volume2, 
  FileText, 
  Download, 
  BookOpen, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Wifi,
  WifiOff,
  Headphones,
  FileDown
} from "lucide-react"

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

interface LowBandwidthLessonPlayerProps {
  lesson: Lesson
  onComplete?: () => void
  onNext?: () => void
  onPrevious?: () => void
  hasNext?: boolean
  hasPrevious?: boolean
  userId?: string
}

export function LowBandwidthLessonPlayer({ 
  lesson, 
  onComplete, 
  onNext, 
  onPrevious, 
  hasNext = false, 
  hasPrevious = false,
  userId 
}: LowBandwidthLessonPlayerProps) {
  const { isLowBandwidth } = useBandwidth()
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTab, setCurrentTab] = useState('audio')

  useEffect(() => {
    // Reset state when lesson changes
    setIsPlaying(false)
    setProgress(0)
    
    // Auto-select audio tab in low bandwidth mode
    if (isLowBandwidth && lesson.audioUrl) {
      setCurrentTab('audio')
    } else if (!isLowBandwidth && lesson.videoUrl) {
      setCurrentTab('video')
    } else {
      setCurrentTab('content')
    }
  }, [lesson.id, isLowBandwidth, lesson.audioUrl, lesson.videoUrl])

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
            timeSpent: lesson.duration,
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

  const getOptimizedImageUrl = (url?: string) => {
    if (!url || !isLowBandwidth) return url
    // In a real implementation, this would add compression parameters
    return url
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Low Bandwidth Indicator */}
      {isLowBandwidth && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-800">
              <WifiOff className="h-4 w-4" />
              <span className="font-medium">Low Bandwidth Mode Active</span>
              <Badge className="bg-orange-100 text-orange-800">
                Optimized for slow connections
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

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
                {isLowBandwidth && (
                  <Badge className="bg-orange-100 text-orange-800">
                    <WifiOff className="h-3 w-3 mr-1" />
                    Optimized
                  </Badge>
                )}
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

      {/* Content Tabs - Optimized for bandwidth */}
      <Card>
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-3">
            {/* Audio Tab - Always shown in low bandwidth mode */}
            {lesson.audioUrl && (
              <TabsTrigger value="audio" className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Audio
                {isLowBandwidth && <Badge className="ml-1 text-xs">Recommended</Badge>}
              </TabsTrigger>
            )}
            
            {/* Video Tab - Hidden in low bandwidth mode if not available */}
            {!isLowBandwidth && lesson.videoUrl && (
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Video
              </TabsTrigger>
            )}
            
            {/* Content Tab - Always available */}
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
          </TabsList>

          {/* Audio Content - Priority in low bandwidth */}
          {lesson.audioUrl && (
            <TabsContent value="audio" className="p-6">
              <div className="space-y-4">
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Headphones className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Audio Lesson</h3>
                      <p className="text-gray-600 mb-4">
                        Perfect for low bandwidth - listen and learn anywhere
                      </p>
                      <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Wifi className="h-4 w-4" />
                          <span>Low data usage</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileDown className="h-4 w-4" />
                          <span>Downloadable</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Audio Player */}
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
                
                {/* Download Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lesson.audioUrl && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Volume2 className="h-8 w-8 text-blue-500" />
                            <div>
                              <h4 className="font-semibold">Audio File</h4>
                              <p className="text-sm text-gray-600">
                                Download for offline listening
                              </p>
                            </div>
                          </div>
                          <Button onClick={() => window.open(lesson.audioUrl, '_blank')} variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {lesson.pdfUrl && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-red-500" />
                            <div>
                              <h4 className="font-semibold">PDF Notes</h4>
                              <p className="text-sm text-gray-600">
                                Text version for offline reading
                              </p>
                            </div>
                          </div>
                          <Button onClick={handleDownloadPDF} variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <Button onClick={handleProgressComplete} className="w-full bg-green-500 hover:bg-green-600">
                  Mark as Complete
                </Button>
              </div>
            </TabsContent>
          )}

          {/* Video Content - Only in high bandwidth mode */}
          {!isLowBandwidth && lesson.videoUrl && (
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

          {/* Text Content - Optimized for low bandwidth */}
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
                        
                        {isLowBandwidth && (
                          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 text-blue-800 mb-2">
                              <Wifi className="h-4 w-4" />
                              <span className="font-medium">Low Bandwidth Mode</span>
                            </div>
                            <p className="text-sm text-blue-700">
                              This content is optimized for your connection. Images are compressed and 
                              unnecessary media has been removed to ensure fast loading.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* PDF Download - Prominent in low bandwidth mode */}
              {lesson.pdfUrl && (
                <Card className={isLowBandwidth ? "border-blue-200 bg-blue-50" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-red-500" />
                        <div>
                          <h4 className="font-semibold">Lesson PDF</h4>
                          <p className="text-sm text-gray-600">
                            {isLowBandwidth 
                              ? "Download for offline reading - recommended for low bandwidth"
                              : "Download and read offline"
                            }
                          </p>
                          {isLowBandwidth && (
                            <Badge className="mt-1 bg-blue-100 text-blue-800">
                              Low data usage
                            </Badge>
                          )}
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