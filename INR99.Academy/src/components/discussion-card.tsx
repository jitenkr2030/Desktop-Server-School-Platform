"use client"

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Pin, 
  Clock, 
  User,
  BookOpen,
  MessageCircle,
  Heart,
  Eye,
  ArrowRight,
  Tag,
  TrendingUp,
  Users,
  ThumbsUp
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Discussion {
  id: string
  title: string
  content: string
  isPinned: boolean
  createdAt: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  course: {
    id: string
    title: string
  }
  _count: {
    replies: number
  }
  tags?: string[]
  difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced'
  subjectCategory?: string
  viewCount?: number
  likeCount?: number
}

interface DiscussionCardProps {
  discussion: Discussion
  showCourse?: boolean
  className?: string
  onLike?: (discussionId: string) => void
}

export function DiscussionCard({ 
  discussion, 
  showCourse = true, 
  className,
  onLike 
}: DiscussionCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(discussion.likeCount || 0)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  const getDifficultyColor = (level?: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'Advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSubjectColor = (category?: string) => {
    switch (category) {
      case 'Web Development':
        return 'bg-blue-100 text-blue-800'
      case 'Programming':
        return 'bg-purple-100 text-purple-800'
      case 'Design':
        return 'bg-pink-100 text-pink-800'
      case 'Finance':
        return 'bg-emerald-100 text-emerald-800'
      case 'Data Science':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    onLike?.(discussion.id)
  }

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <Card className={cn(
      "hover:shadow-md transition-all duration-200 group cursor-pointer",
      discussion.isPinned && "ring-2 ring-orange-200 bg-orange-50/30",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={discussion.user.avatar} alt={discussion.user.name} />
            <AvatarFallback className="bg-orange-100 text-orange-700">
              {discussion.user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            {/* Header with metadata */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {discussion.isPinned && (
                    <Pin className="h-4 w-4 text-orange-500" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    <Link href={`/community/${discussion.id}`}>
                      {discussion.title}
                    </Link>
                  </h3>
                </div>
                
                {/* Tags and metadata */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {discussion.difficultyLevel && (
                    <Badge 
                      variant="secondary" 
                      className={cn("text-xs", getDifficultyColor(discussion.difficultyLevel))}
                    >
                      {discussion.difficultyLevel}
                    </Badge>
                  )}
                  
                  {discussion.subjectCategory && (
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getSubjectColor(discussion.subjectCategory))}
                    >
                      {discussion.subjectCategory}
                    </Badge>
                  )}
                  
                  {discussion.tags?.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs text-gray-600">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                  
                  {discussion.tags && discussion.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs text-gray-500">
                      +{discussion.tags.length - 3} more
                    </Badge>
                  )}
                </div>
                
                {/* User and course info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span className="font-medium">{discussion.user.name}</span>
                  </div>
                  
                  {showCourse && (
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span>{discussion.course.title}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(discussion.createdAt)}</span>
                  </div>
                  
                  {discussion.viewCount && (
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{discussion.viewCount} views</span>
                    </div>
                  )}
                </div>
              </div>
              
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Content preview */}
            <p className="text-gray-600 line-clamp-3 mb-4">
              {truncateContent(discussion.content)}
            </p>
            
            {/* Footer with actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{discussion._count.replies} replies</span>
                </div>
                
                {discussion.likeCount !== undefined && (
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{likeCount}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={cn(
                    "h-8 px-3",
                    isLiked && "text-red-500 hover:text-red-600"
                  )}
                >
                  <ThumbsUp className={cn("h-4 w-4 mr-1", isLiked && "fill-current")} />
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
                
                <Link href={`/community/${discussion.id}`}>
                  <Button variant="outline" size="sm" className="h-8">
                    View Discussion
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Trending discussions component
interface TrendingDiscussionsProps {
  discussions: Discussion[]
  className?: string
}

export function TrendingDiscussions({ discussions, className }: TrendingDiscussionsProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold">Trending Discussions</h3>
        </div>
        
        <div className="space-y-3">
          {discussions.slice(0, 5).map((discussion, index) => (
            <div key={discussion.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <Link 
                  href={`/community/${discussion.id}`}
                  className="block font-medium text-gray-900 hover:text-orange-600 transition-colors line-clamp-1"
                >
                  {discussion.title}
                </Link>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span>{discussion._count.replies} replies</span>
                  <span>•</span>
                  <span>{discussion.likeCount || 0} likes</span>
                  <span>•</span>
                  <span>{discussion.viewCount || 0} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Link href="/community?trending=true">
            <Button variant="outline" size="sm" className="w-full">
              View All Trending Discussions
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}