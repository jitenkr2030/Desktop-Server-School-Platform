"use client"

import { useBandwidth } from '@/contexts/bandwidth-context'
import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Download, 
  Maximize2,
  Headphones,
  FileText,
  Wifi,
  WifiOff
} from "lucide-react"

interface LowBandwidthMediaPlayerProps {
  title: string
  videoUrl?: string
  audioUrl?: string
  textContent?: string
  pdfUrl?: string
  duration: number
  thumbnail?: string
  onProgress?: (progress: number) => void
  onComplete?: () => void
}

export function LowBandwidthMediaPlayer({
  title,
  videoUrl,
  audioUrl,
  textContent,
  pdfUrl,
  duration,
  thumbnail,
  onProgress,
  onComplete
}: LowBandwidthMediaPlayerProps) {
  const { effectiveMode, isLowBandwidth } = useBandwidth()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [selectedMode, setSelectedMode] = useState<'video' | 'audio' | 'text'>(effectiveMode)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressInterval = useRef<NodeJS.Timeout>()

  // Auto-select best available mode based on bandwidth
  useEffect(() => {
    if (effectiveMode === 'video' && videoUrl) {
      setSelectedMode('video')
    } else if (effectiveMode === 'audio' && audioUrl) {
      setSelectedMode('audio')
    } else {
      setSelectedMode('text')
    }
  }, [effectiveMode, videoUrl, audioUrl])

  // Handle audio playback
  useEffect(() => {
    if (selectedMode === 'audio' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
        startProgressTracking()
      } else {
        audioRef.current.pause()
        stopProgressTracking()
      }
    } else {
      stopProgressTracking()
    }
  }, [isPlaying, selectedMode])

  const startProgressTracking = () => {
    stopProgressTracking()
    progressInterval.current = setInterval(() => {
      if (audioRef.current) {
        const progress = (audioRef.current.currentTime / duration) * 100
        setCurrentTime(audioRef.current.currentTime)
        onProgress?.(progress)
        
        if (progress >= 100) {
          setIsPlaying(false)
          onComplete?.()
          stopProgressTracking()
        }
      }
    }, 1000)
  }

  const stopProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }
  }

  const handlePlayPause = () => {
    if (selectedMode === 'audio') {
      setIsPlaying(!isPlaying)
    } else {
      // For video and text modes, simulate playback
      setIsPlaying(!isPlaying)
      if (!isPlaying) {
        startProgressTracking()
      } else {
        stopProgressTracking()
      }
    }
  }

  const handleSeek = (time: number) => {
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
    const progress = (time / duration) * 100
    onProgress?.(progress)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getAvailableModes = () => {
    const modes = []
    if (videoUrl) modes.push('video')
    if (audioUrl) modes.push('audio')
    if (textContent) modes.push('text')
    return modes
  }

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'video':
        return <Wifi className="h-4 w-4" />
      case 'audio':
        return <Headphones className="h-4 w-4" />
      case 'text':
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'video':
        return 'Video'
      case 'audio':
        return 'Audio'
      case 'text':
        return 'Text'
      default:
        return 'Text'
    }
  }

  const getModeDataSavings = (mode: string) => {
    switch (mode) {
      case 'video':
        return 'High data usage'
      case 'audio':
        return 'Medium data usage'
      case 'text':
        return 'Low data usage'
      default:
        return 'Low data usage'
    }
  }

  const progress = (currentTime / duration) * 100

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        {/* Media Player Area */}
        <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden">
          {selectedMode === 'video' && videoUrl ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-8 w-8 text-white" />
                </div>
                <p className="text-lg font-semibold mb-2">{title}</p>
                <p className="text-sm text-gray-300">Video Player</p>
                <p className="text-xs text-gray-400 mt-2">
                  Video content would play here
                </p>
              </div>
            </div>
          ) : selectedMode === 'audio' && audioUrl ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {isPlaying ? (
                    <Pause className="h-10 w-10 text-white" />
                  ) : (
                    <Play className="h-10 w-10 text-white" />
                  )}
                </div>
                <p className="text-xl font-semibold mb-2">{title}</p>
                <p className="text-sm text-gray-300">Audio Mode</p>
                <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/30">
                  {getModeDataSavings('audio')}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 overflow-y-auto">
              <div className="p-6 text-white max-w-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5" />
                  <span className="font-semibold">Text Mode</span>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {getModeDataSavings('text')}
                  </Badge>
                </div>
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-white">{title}</h3>
                  <div className="text-gray-300 leading-relaxed">
                    {textContent || (
                      <div className="space-y-4">
                        <p>
                          This is the text-only version of the lesson content. It's optimized for low bandwidth connections 
                          and provides all the essential information without loading heavy media files.
                        </p>
                        <h4>Key Points:</h4>
                        <ul>
                          <li>Essential concepts and principles</li>
                          <li>Step-by-step explanations</li>
                          <li>Practical examples and applications</li>
                          <li>Summary and key takeaways</li>
                        </ul>
                        <h4>Detailed Content:</h4>
                        <p>
                          This comprehensive text version covers all the material that would be presented in the video 
                          or audio formats. You can read through at your own pace, and the content is structured 
                          to be easily digestible and retainable.
                        </p>
                        <p>
                          The text mode is perfect for situations where you have limited internet connectivity, 
                          are trying to conserve data, or prefer reading over watching or listening to content.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bandwidth Indicator */}
          <div className="absolute top-2 right-2">
            <Badge 
              variant="secondary" 
              className={`${
                isLowBandwidth 
                  ? 'bg-red-100 text-red-800 border-red-200' 
                  : 'bg-green-100 text-green-800 border-green-200'
              }`}
            >
              {isLowBandwidth ? (
                <WifiOff className="h-3 w-3 mr-1" />
              ) : (
                <Wifi className="h-3 w-3 mr-1" />
              )}
              {effectiveMode.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Hidden audio element for audio mode */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => {
              setIsPlaying(false)
              onComplete?.()
              stopProgressTracking()
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={() => {
              if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime)
              }
            }}
          />
        )}

        {/* Controls */}
        <div className="p-4 border-t">
          {/* Mode Selection */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-gray-700">View Mode:</span>
            <div className="flex gap-2">
              {getAvailableModes().map((mode) => (
                <Button
                  key={mode}
                  variant={selectedMode === mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMode(mode as 'video' | 'audio' | 'text')}
                  className="gap-1"
                >
                  {getModeIcon(mode)}
                  {getModeLabel(mode)}
                </Button>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayPause}
                className="gap-1"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>

              {selectedMode === 'audio' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              )}

              {pdfUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(pdfUrl, '_blank')}
                  className="gap-1"
                >
                  <Download className="h-4 w-4" />
                  PDF
                </Button>
              )}
            </div>

            <div className="text-sm text-gray-600">
              {getModeDataSavings(selectedMode)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}