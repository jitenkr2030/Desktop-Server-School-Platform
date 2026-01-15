'use client'

import { useState, useEffect, useRef } from 'react'

interface SuccessStory {
  id: string
  userName: string
  userAvatar?: string
  story: string
  relatedLessonId?: string
  isAnonymous: boolean
  isFeatured: boolean
  createdAt: string
}

interface SuccessStoryCarouselProps {
  lessonId?: string
  onShareClick: () => void
}

export default function SuccessStoryCarousel({
  lessonId,
  onShareClick
}: SuccessStoryCarouselProps) {
  const [stories, setStories] = useState<SuccessStory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    fetchStories()
  }, [lessonId])

  useEffect(() => {
    if (isAutoPlaying && stories.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % stories.length)
      }, 5000)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying, stories.length])

  const fetchStories = async () => {
    setIsLoading(true)
    try {
      const url = lessonId
        ? `/api/confusion/${lessonId}/stories?type=lesson&limit=10`
        : '/api/confusion/featured/stories?type=featured&limit=10'

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setStories(data.data)
      }
    } catch (error) {
      console.error('Error fetching stories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? stories.length - 1 : prev - 1))
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % stories.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  if (isLoading) {
    return (
      <div className="w-full py-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Success Stories</h3>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-shrink-0 w-full md:w-96 h-48 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (stories.length === 0) {
    return (
      <div className="w-full py-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Success Stories</h3>
          <button
            onClick={onShareClick}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Share Your Story
          </button>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Be the First to Share!</h4>
          <p className="text-gray-600 mb-4">
            Have a success story about how Confusion Remover helped you? Share it with the community!
          </p>
          <button
            onClick={onShareClick}
            className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Share Your Story
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Success Stories</h3>
        </div>
        <button
          onClick={onShareClick}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Share Your Story
        </button>
      </div>

      <div className="relative" ref={carouselRef}>
        {/* Navigation buttons */}
        {stories.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors -ml-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors -mr-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Story cards */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {stories.map(story => (
              <div key={story.id} className="flex-shrink-0 w-full px-2">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-semibold text-green-700">
                        {story.userAvatar || story.userName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-800">
                          {story.isAnonymous ? 'Anonymous' : story.userName}
                        </span>
                        {story.isFeatured && (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 leading-relaxed italic">
                        "{story.story}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots navigation */}
        {stories.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-green-600 w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
