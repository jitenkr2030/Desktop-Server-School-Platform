"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { NewNavigation } from '@/components/new-navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Plus, 
  MessageCircle, 
  TrendingUp, 
  Clock,
  Loader2,
  User
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export default function CommunityPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    courseId: '',
    tags: '',
    difficultyLevel: 'Beginner',
    subjectCategory: 'General'
  })
  const [courses, setCourses] = useState<any[]>([])
  const [creating, setCreating] = useState(false)

  const courseId = searchParams.get('courseId')

  useEffect(() => {
    fetchDiscussions()
    fetchCourses()
  }, [courseId])

  useEffect(() => {
    // Debounced search
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchDiscussions()
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      const data = await response.json()
      
      if (data.courses) {
        setCourses(data.courses)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const fetchDiscussions = async () => {
    try {
      const params = new URLSearchParams()
      params.set('page', String(pagination.page))
      params.set('limit', String(pagination.limit))
      
      if (searchQuery) {
        params.set('search', searchQuery)
      }
      
      if (selectedTag) {
        params.set('tag', selectedTag)
      }
      
      if (courseId) {
        params.set('courseId', courseId)
      }

      const response = await fetch(`/api/discussions?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setDiscussions(data.discussions || [])
        setTags(data.tags || [])
        setPagination(prev => ({
          ...prev,
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.totalPages || 1
        }))
      }
    } catch (error) {
      console.error('Error fetching discussions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDiscussion = async () => {
    if (!session?.user) {
      router.push('/auth/login')
      return
    }

    if (!newDiscussion.title || !newDiscussion.content || !newDiscussion.courseId) {
      alert('Please fill in all required fields')
      return
    }

    setCreating(true)
    try {
      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDiscussion,
          tags: newDiscussion.tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      })

      const data = await response.json()

      if (data.success) {
        setShowCreateDialog(false)
        setNewDiscussion({
          title: '',
          content: '',
          courseId: '',
          tags: '',
          difficultyLevel: 'Beginner',
          subjectCategory: 'General'
        })
        fetchDiscussions()
      } else {
        alert(data.error || 'Failed to create discussion')
      }
    } catch (error) {
      console.error('Error creating discussion:', error)
      alert('Failed to create discussion')
    } finally {
      setCreating(false)
    }
  }

  const userName = session?.user?.name || 'Guest'
  const userEmail = session?.user?.email || 'guest@example.com'

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NewNavigation />
        <div className="pt-24 container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-orange-500" />
              <p className="mt-4 text-gray-600">Loading discussions...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Community Discussions</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Connect with other learners, ask questions, and share knowledge
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                New Discussion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Start a New Discussion</DialogTitle>
                <DialogDescription>
                  Share your question or topic with the community
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="What's your question or topic?"
                    value={newDiscussion.title}
                    onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Provide details about your question or topic..."
                    rows={5}
                    value={newDiscussion.content}
                    onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="course">Course</Label>
                    <Select
                      value={newDiscussion.courseId}
                      onValueChange={(value) => setNewDiscussion(prev => ({ ...prev, courseId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course: any) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={newDiscussion.difficultyLevel}
                      onValueChange={(value) => setNewDiscussion(prev => ({ ...prev, difficultyLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="e.g., javascript, react, beginner"
                    value={newDiscussion.tags}
                    onChange={(e) => setNewDiscussion(prev => ({ ...prev, tags: e.target.value }))}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateDiscussion} 
                    disabled={creating}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Discussion'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pagination.total}</p>
                  <p className="text-gray-600">Total Discussions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{tags.length}</p>
                  <p className="text-gray-600">Active Tags</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{discussions.filter(d => d._count.replies > 0).length}</p>
                  <p className="text-gray-600">Active Discussions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Discussions List */}
        <div className="space-y-6">
          {discussions.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No discussions found</h3>
                <p className="text-gray-600 mb-4">Be the first to start a discussion!</p>
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Start a Discussion
                </Button>
              </CardContent>
            </Card>
          ) : (
            discussions.map((discussion) => (
              <Card key={discussion.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-orange-600 font-medium">
                          {discussion.user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link 
                            href={`/community/${discussion.id}`}
                            className="text-lg font-semibold hover:text-orange-500 transition-colors"
                          >
                            {discussion.title}
                          </Link>
                          <p className="text-gray-600 mt-1 line-clamp-2">
                            {discussion.content.substring(0, 150)}...
                          </p>
                        </div>
                        
                        {discussion.isPinned && (
                          <Badge className="bg-orange-100 text-orange-700 flex-shrink-0">
                            📌 Pinned
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span>{discussion.user?.name || 'Unknown User'}</span>
                        <span>•</span>
                        <span>{formatDate(discussion.createdAt)}</span>
                        {discussion.course && (
                          <>
                            <span>•</span>
                            <span>{discussion.course.title}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{discussion._count?.replies || 0} replies</span>
                      </div>
                      
                      {(discussion.tags && discussion.tags.length > 0) && (
                        <div className="flex gap-2 mt-3">
                          {discussion.tags.slice(0, 3).map((tag, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary"
                              className="cursor-pointer hover:bg-orange-100"
                              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Popular Tags */}
        {tags.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className={`cursor-pointer px-3 py-1 ${
                    selectedTag === tag 
                      ? 'bg-orange-100 border-orange-300 text-orange-700' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
