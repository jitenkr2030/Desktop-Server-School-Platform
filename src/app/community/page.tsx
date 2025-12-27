"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
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
  Loader2
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
      
      if (data.success && data.courses) {
        setCourses(data.courses)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const fetchDiscussions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', pagination.page.toString())
      params.set('limit', '10')
      
      if (courseId) {
        params.set('courseId', courseId)
      }
      
      if (searchQuery) {
        params.set('search', searchQuery)
      }
      
      if (selectedTag) {
        params.set('tag', selectedTag)
      }

      const response = await fetch(`/api/discussions?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setDiscussions(data.discussions)
        setTags(data.tags || [])
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages
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

  return (
    <DashboardLayout userRole="student" userInfo={{ name: userName, email: userEmail }}>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Community Discussions
            </h1>
            <p className="text-gray-600 mt-1">
              Connect with other learners, ask questions, and share knowledge
            </p>
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
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="What's your question or topic?"
                    value={newDiscussion.title}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="course">Course *</Label>
                  <Select
                    value={newDiscussion.courseId}
                    onValueChange={(value) => setNewDiscussion({ ...newDiscussion, courseId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Describe your question or topic in detail..."
                    rows={5}
                    value={newDiscussion.content}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select
                      value={newDiscussion.difficultyLevel}
                      onValueChange={(value) => setNewDiscussion({ ...newDiscussion, difficultyLevel: value })}
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
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newDiscussion.subjectCategory}
                      onValueChange={(value) => setNewDiscussion({ ...newDiscussion, subjectCategory: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Web Development">Web Development</SelectItem>
                        <SelectItem value="Programming">Programming</SelectItem>
                        <SelectItem value="Data Science">Data Science</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="react, hooks, state"
                    value={newDiscussion.tags}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, tags: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={handleCreateDiscussion}
                    disabled={creating}
                  >
                    {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Create Discussion
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">{pagination.total}</div>
                      <div className="text-sm text-gray-600">Total Discussions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">{tags.length}</div>
                      <div className="text-sm text-gray-600">Unique Tags</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">{pagination.totalPages}</div>
                      <div className="text-sm text-gray-600">Pages</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search discussions..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedTag === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedTag(null)
                    fetchDiscussions()
                  }}
                >
                  All
                </Button>
                {tags.slice(0, 5).map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedTag(tag)
                      fetchDiscussions()
                    }}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            {/* Discussions List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              </div>
            ) : discussions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery ? 'Try adjusting your search terms' : 'Be the first to start a discussion!'}
                  </p>
                  <Button 
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => setShowCreateDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Start a Discussion
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <Card key={discussion.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-700 font-semibold flex-shrink-0">
                          {discussion.user.name?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {discussion.isPinned && (
                                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                                    📌 PINNED
                                  </span>
                                )}
                                <h3 className="text-lg font-semibold text-gray-900 hover:text-orange-600">
                                  <Link href={`/community/${discussion.id}`}>
                                    {discussion.title}
                                  </Link>
                                </h3>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                {discussion.difficultyLevel && (
                                  <Badge className={getDifficultyColor(discussion.difficultyLevel)}>
                                    {discussion.difficultyLevel}
                                  </Badge>
                                )}
                                {discussion.tags?.slice(0, 3).map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <span>{discussion.user.name}</span>
                                <span>📚 {discussion.course.title}</span>
                                <span>{formatDate(discussion.createdAt)}</span>
                              </div>
                            </div>
                            <Link href={`/community/${discussion.id}`}>
                              <Button variant="ghost" size="sm">
                                View →
                              </Button>
                            </Link>
                          </div>
                          <p className="text-gray-600 line-clamp-2 mb-4">
                            {discussion.content.length > 200 
                              ? discussion.content.substring(0, 200) + '...' 
                              : discussion.content}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>💬 {discussion._count.replies} replies</span>
                              {discussion.viewCount && (
                                <span>👁️ {discussion.viewCount} views</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      disabled={pagination.page === 1}
                      onClick={() => {
                        setPagination(prev => ({ ...prev, page: prev.page - 1 }))
                        fetchDiscussions()
                      }}
                    >
                      Previous
                    </Button>
                    <span className="text-gray-600">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => {
                        setPagination(prev => ({ ...prev, page: prev.page + 1 }))
                        fetchDiscussions()
                      }}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedTag(selectedTag === tag ? null : tag)
                        fetchDiscussions()
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Discussions</span>
                  <span className="font-semibold">{pagination.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Tags</span>
                  <span className="font-semibold">{tags.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
