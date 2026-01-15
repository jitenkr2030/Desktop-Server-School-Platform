"use client"

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Clock, MessageCircle, Eye, Trash2 } from "lucide-react"

interface Reply {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  likeCount: number
  isEdited: boolean
  user: {
    id: string
    name: string
    avatar?: string
  }
  _count: {
    replies: number
  }
  replies?: Reply[]
}

interface Discussion {
  id: string
  title: string
  content: string
  isPinned: boolean
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  course: {
    id: string
    title: string
  }
  tags?: string[]
  difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced'
  subjectCategory?: string
  viewCount: number
  likeCount: number
  _count: {
    replies: number
  }
}

function DiscussionContent() {
  const params = useParams()
  const router = useRouter()
  const discussionId = params.id as string
  
  const [discussion, setDiscussion] = useState<Discussion | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [loading, setLoading] = useState(true)
  const [replyContent, setReplyContent] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (discussionId) {
      fetchDiscussion()
    }
  }, [discussionId])

  const fetchDiscussion = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/discussions/${discussionId}`)
      const data = await response.json()

      if (data.success) {
        setDiscussion(data.discussion)
        setReplies(data.replies || [])
      } else {
        router.push('/community')
      }
    } catch (error) {
      console.error('Error fetching discussion:', error)
      router.push('/community')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReply = async () => {
    if (!session?.user) {
      router.push('/auth/login')
      return
    }

    if (!replyContent.trim()) {
      alert('Please enter a reply')
      return
    }

    setSubmittingReply(true)
    try {
      const response = await fetch(`/api/discussions/${discussionId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent.trim() })
      })

      if (response.ok) {
        setReplyContent('')
        fetchDiscussion()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to post reply')
      }
    } catch (error) {
      alert('Failed to post reply')
    } finally {
      setSubmittingReply(false)
    }
  }

  const handleDeleteDiscussion = async () => {
    if (!session?.user) return

    if (!confirm('Are you sure you want to delete this discussion? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/discussions/${discussionId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Discussion deleted successfully')
        router.push('/community')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete discussion')
      }
    } catch (error) {
      alert('Failed to delete discussion')
    }
  }

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

  const renderReply = (reply: Reply, depth: number = 0) => (
    <div 
      key={reply.id} 
      className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}
    >
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-orange-100 text-orange-700">
                {reply.user.name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{reply.user.name}</span>
                  <span className="text-sm text-gray-500">{formatDate(reply.createdAt)}</span>
                  {reply.isEdited && (
                    <span className="text-xs text-gray-400">(edited)</span>
                  )}
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Render nested replies */}
      {reply.replies && reply.replies.length > 0 && (
        <div className="mt-2">
          {reply.replies.map(nestedReply => renderReply(nestedReply, depth + 1))}
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!discussion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="py-12 text-center">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Discussion Not Found</h2>
            <p className="text-gray-600 mb-4">
              This discussion may have been deleted or doesn't exist.
            </p>
            <Link href="/community">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Back to Community
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isOwner = session?.user?.id === discussion.user.id

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link 
          href="/community"
          className="inline-flex items-center text-gray-600 hover:text-orange-600 mb-6"
        >
          ← Back to Community
        </Link>

        {/* Discussion Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  {discussion.isPinned && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      📌 Pinned
                    </Badge>
                  )}
                  {discussion.difficultyLevel && (
                    <Badge className={getDifficultyColor(discussion.difficultyLevel)}>
                      {discussion.difficultyLevel}
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  {discussion.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-orange-100 text-orange-700">
                        {discussion.user.name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{discussion.user.name}</span>
                  </div>
                  <span>📚 {discussion.course.title}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDate(discussion.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {discussion.viewCount} views
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {discussion._count.replies} replies
                  </span>
                </div>
                {discussion.tags && discussion.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {discussion.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteDiscussion}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed border-t pt-4">
              {discussion.content}
            </div>
          </CardContent>
        </Card>

        {/* Reply Form */}
        {session?.user ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Post a Reply</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Share your thoughts or answer..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={4}
                className="mb-4"
              />
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setReplyContent('')}
                  disabled={!replyContent.trim()}
                >
                  Clear
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={handleSubmitReply}
                  disabled={submittingReply || !replyContent.trim()}
                >
                  {submittingReply && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Post Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 bg-orange-50 border-orange-200">
            <CardContent className="py-6 text-center">
              <p className="text-gray-700 mb-4">
                Sign in to join the discussion and post replies.
              </p>
              <Link href="/auth/login">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Sign In to Reply
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Replies */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Replies ({discussion._count.replies})
          </h2>
          
          {replies.length > 0 ? (
            <div className="space-y-4">
              {replies.map(reply => renderReply(reply))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No replies yet</h3>
                <p className="text-gray-600">
                  Be the first to share your thoughts on this discussion!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
    </div>
  )
}

export default function DiscussionDetailPage() {
  const { data: session } = useSession()
  
  const userName = session?.user?.name || 'Guest'
  const userEmail = session?.user?.email || 'guest@example.com'

  return (
    <Suspense fallback={<LoadingFallback />}>
      <DashboardLayout userRole="student" userInfo={{ name: userName, email: userEmail }}>
        <DiscussionContent />
      </DashboardLayout>
    </Suspense>
  )
}
