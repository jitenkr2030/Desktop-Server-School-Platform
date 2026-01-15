"use client"

import { useState, useEffect } from 'react'
import { NewNavigation } from "@/components/new-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Loader2,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Trash2,
  Reply,
  Mail,
  Clock,
  AlertCircle,
  Eye,
  Send,
} from "lucide-react"

interface ContactMessage {
  id: string
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
  status: 'PENDING' | 'REPLIED' | 'CLOSED'
  replyMessage: string | null
  repliedAt: string | null
  createdAt: string
  updatedAt: string
}

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showReplyDialog, setShowReplyDialog] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')
  const [replyLoading, setReplyLoading] = useState(false)
  const [replyError, setReplyError] = useState('')
  const [actionStatus, setActionStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [actionMessage, setActionMessage] = useState('')

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      if (statusFilter !== 'ALL') {
        params.append('status', statusFilter)
      }

      if (search) {
        params.append('search', search)
      }

      const response = await fetch(`/api/admin/messages?${params}`)
      const data = await response.json()

      if (data.success) {
        setMessages(data.data.messages)
        setPagination(data.data.pagination)
      }
    } catch (error) {
      console.error('Fetch messages error:', error)
      setActionStatus('error')
      setActionMessage('Failed to fetch messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [pagination.page, statusFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchMessages()
  }

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message)
    setShowDetailDialog(true)
  }

  const handleOpenReplyDialog = () => {
    setShowDetailDialog(false)
    setShowReplyDialog(true)
    setReplyMessage('')
    setReplyError('')
  }

  const handleSendReply = async () => {
    if (!selectedMessage || !replyMessage.trim()) {
      setReplyError('Please enter a reply message')
      return
    }

    if (replyMessage.trim().length < 5) {
      setReplyError('Reply must be at least 5 characters')
      return
    }

    setReplyLoading(true)
    setReplyError('')

    try {
      const response = await fetch(`/api/admin/messages/${selectedMessage.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reply',
          replyMessage: replyMessage.trim(),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setActionStatus('success')
        setActionMessage('Reply sent successfully!')
        setShowReplyDialog(false)
        fetchMessages()
        
        // Show temporary success message
        setTimeout(() => {
          setActionStatus('idle')
          setActionMessage('')
        }, 3000)
      } else {
        setReplyError(data.message || 'Failed to send reply')
      }
    } catch (error) {
      setReplyError('Something went wrong. Please try again.')
    } finally {
      setReplyLoading(false)
    }
  }

  const handleUpdateStatus = async (messageId: string, status: 'PENDING' | 'REPLIED' | 'CLOSED') => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateStatus',
          status,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setActionStatus('success')
        setActionMessage(`Message marked as ${status.toLowerCase()}`)
        fetchMessages()
        
        setTimeout(() => {
          setActionStatus('idle')
          setActionMessage('')
        }, 3000)
      }
    } catch (error) {
      setActionStatus('error')
      setActionMessage('Failed to update status')
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setActionStatus('success')
        setActionMessage('Message deleted successfully')
        fetchMessages()
        
        setTimeout(() => {
          setActionStatus('idle')
          setActionMessage('')
        }, 3000)
      }
    } catch (error) {
      setActionStatus('error')
      setActionMessage('Failed to delete message')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'REPLIED':
        return <Badge className="bg-green-100 text-green-800">Replied</Badge>
      case 'CLOSED':
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
            <p className="text-gray-600 mt-1">Manage inquiries from users</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={fetchMessages}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Status Message */}
        {actionStatus === 'success' && actionMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-green-800">{actionMessage}</AlertDescription>
          </Alert>
        )}

        {actionStatus === 'error' && actionMessage && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-800">{actionMessage}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search messages..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Messages</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="REPLIED">Replied</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Messages Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Messages
              <Badge variant="secondary">{pagination.total}</Badge>
            </CardTitle>
            <CardDescription>
              Showing {messages.length} of {pagination.total} messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages found</h3>
                <p className="text-gray-600">
                  {search ? 'Try a different search term' : 'No contact messages yet'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Subject</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((message) => (
                      <tr key={message.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            {formatDate(message.createdAt)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {message.firstName} {message.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{message.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-900 max-w-xs truncate">{message.subject}</p>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(message.status)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewMessage(message)}
                              title="View Message"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {message.status === 'PENDING' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedMessage(message)
                                  handleOpenReplyDialog()
                                }}
                                title="Reply"
                              >
                                <Reply className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                            {message.status !== 'CLOSED' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateStatus(message.id, 'CLOSED')}
                                title="Close"
                              >
                                <XCircle className="h-4 w-4 text-gray-400" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMessage(message.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Message Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              Full conversation thread
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-semibold">{selectedMessage.firstName} {selectedMessage.lastName}</p>
                  <p className="text-sm text-gray-600">{selectedMessage.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold">{formatDate(selectedMessage.createdAt)}</p>
                  <p className="text-sm text-gray-600">{getStatusBadge(selectedMessage.status)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Subject</p>
                <p className="font-semibold text-lg">{selectedMessage.subject}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Message</p>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              {selectedMessage.replyMessage && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Your Reply</p>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="whitespace-pre-wrap">{selectedMessage.replyMessage}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Sent on {selectedMessage.repliedAt ? formatDate(selectedMessage.repliedAt) : 'N/A'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Close
            </Button>
            {selectedMessage?.status === 'PENDING' && (
              <Button onClick={handleOpenReplyDialog} className="bg-green-600 hover:bg-green-700">
                <Reply className="h-4 w-4 mr-2" />
                Reply
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Message</DialogTitle>
            <DialogDescription>
              Send a response to {selectedMessage?.firstName} {selectedMessage?.lastName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Original Message:</p>
                <p className="text-sm mt-1">{selectedMessage.message}</p>
              </div>
              
              {replyError && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <AlertDescription className="text-red-800">{replyError}</AlertDescription>
                </Alert>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reply <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Type your reply here..."
                  disabled={replyLoading}
                />
                <p className={`text-sm mt-1 ${replyMessage.length > 2000 ? 'text-red-600' : 'text-gray-500'}`}>
                  {replyMessage.length}/2000 characters
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReplyDialog(false)} disabled={replyLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendReply} 
              className="bg-green-600 hover:bg-green-700"
              disabled={replyLoading}
            >
              {replyLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Reply
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
