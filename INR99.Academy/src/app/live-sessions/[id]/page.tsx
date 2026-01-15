'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  MessageSquare,
  Users,
  Phone,
  Settings,
  Maximize,
  Send,
  Clock,
  Calendar,
  AlertCircle,
  Play
} from 'lucide-react'

interface SessionParticipant {
  id: string
  name: string
  avatar: string | null
  isHost: boolean
  isMuted: boolean
  hasVideo: boolean
}

interface ChatMessage {
  id: string
  userId: string
  userName: string
  userAvatar: string | null
  message: string
  timestamp: string
}

interface LiveSessionData {
  id: string
  title: string
  description: string | null
  scheduledAt: string
  duration: number
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED'
  roomId: string | null
  currentAttendees: number
  host: {
    id: string
    name: string | null
    avatar: string | null
  }
  course: {
    id: string
    title: string
    thumbnail: string | null
  } | null
}

export default function LiveSessionPage({ params }: { params: { id: string } }) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const [sessionData, setSessionData] = useState<LiveSessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isJoined, setIsJoined] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [hasVideo, setHasVideo] = useState(false)
  const [showChat, setShowChat] = useState(true)
  const [showParticipants, setShowParticipants] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [participants, setParticipants] = useState<SessionParticipant[]>([])
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Get session safely - store result first before destructuring
  const sessionResult = useSession()
  const session = mounted ? sessionResult.data : null

  useEffect(() => {
    setMounted(true)
    fetchSession()
  }, [params.id])

  const fetchSession = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/live-sessions/${params.id}`)
      const data = await response.json()

      if (data.success) {
        setSessionData(data.session)
        // Auto-join if session is live
        if (data.session.status === 'LIVE') {
          joinSession()
        }
      } else {
        setError(data.message || 'Failed to fetch session')
      }
    } catch (err) {
      setError('Failed to fetch session')
    } finally {
      setLoading(false)
    }
  }

  const joinSession = async () => {
    if (!session?.user) {
      router.push('/auth/login?callbackUrl=/live-sessions/' + params.id)
      return
    }

    try {
      const response = await fetch(`/api/live-sessions/${params.id}/attendance`, {
        method: 'POST'
      })
      const data = await response.json()

      if (data.success) {
        setIsJoined(true)
        // Add initial system message
        setChatMessages([{
          id: 'system-1',
          userId: 'system',
          userName: 'System',
          userAvatar: null,
          message: 'Welcome to the live session! Please be respectful and follow the guidelines.',
          timestamp: new Date().toISOString()
        }])
      } else {
        setError(data.message || 'Failed to join session')
      }
    } catch (err) {
      setError('Failed to join session')
    }
  }

  const leaveSession = async () => {
    try {
      await fetch(`/api/live-sessions/${params.id}/attendance`, {
        method: 'PUT'
      })
      setIsJoined(false)
      router.push('/live-sessions')
    } catch (err) {
      console.error('Failed to leave session:', err)
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !session?.user) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: session.user.id,
      userName: session.user.name || 'User',
      userAvatar: session.user.image,
      message: newMessage.trim(),
      timestamp: new Date().toISOString()
    }

    setChatMessages(prev => [...prev, message])
    setNewMessage('')

    // Scroll to bottom
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
      }
    }, 100)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    // In a real implementation, this would control the WebRTC audio track
  }

  const toggleVideo = () => {
    setHasVideo(!hasVideo)
    // In a real implementation, this would control the WebRTC video track
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error && !sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/live-sessions" className="text-indigo-600 hover:text-indigo-500">
            Back to Sessions
          </Link>
        </div>
      </div>
    )
  }

  if (!sessionData) return null

  const isHost = mounted && session?.user?.id === sessionData?.host?.id
  const isLive = sessionData.status === 'LIVE'
  const isScheduled = sessionData.status === 'SCHEDULED'

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/live-sessions" className="text-gray-400 hover:text-white">
            ← Back
          </Link>
          <div>
            <h1 className="text-white font-semibold">{sessionData.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className={isLive ? 'text-green-400' : 'text-gray-400'}>
                {isLive ? '● LIVE' : isScheduled ? 'Scheduled' : sessionData.status}
              </span>
              <span>•</span>
              <span>{sessionData.currentAttendees} watching</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded-lg ${showChat ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className={`p-2 rounded-lg ${showParticipants ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            <Users className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600">
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className={`flex-1 flex flex-col ${showChat || showParticipants ? 'mr-80' : ''}`}>
          {/* Video Container */}
          <div className="flex-1 relative bg-black">
            {/* Main Video (Host) */}
            <div className="absolute inset-0 flex items-center justify-center">
              {hasVideo ? (
                <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
                  <video
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    {sessionData.host.avatar ? (
                      <img
                        src={sessionData.host.avatar}
                        alt={sessionData.host.name || ''}
                        className="w-28 h-28 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl text-white font-bold">
                        {sessionData.host.name?.charAt(0) || 'H'}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white text-xl font-semibold">{sessionData.host.name}</h3>
                  <p className="text-gray-400">Host</p>
                </div>
              )}
            </div>

            {/* Live Badge */}
            {isLive && (
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full">
                  <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                  LIVE
                </span>
              </div>
            )}

            {/* Session Timer */}
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded-full">
                <Clock className="w-4 h-4 mr-2" />
                {isLive ? '00:00:00' : `${sessionData.duration} min`}
              </span>
            </div>

            {/* Self Video (if video enabled) */}
            {hasVideo && (
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
                <video
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="bg-gray-800 border-t border-gray-700 px-4 py-4">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={toggleMute}
                className={`p-4 rounded-full ${isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'} text-white transition-colors`}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              <button
                onClick={toggleVideo}
                className={`p-4 rounded-full ${!hasVideo ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'} text-white transition-colors`}
              >
                {hasVideo ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </button>

              {isJoined ? (
                <button
                  onClick={leaveSession}
                  className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  <Phone className="w-6 h-6 transform rotate-135" />
                </button>
              ) : (
                <button
                  onClick={joinSession}
                  disabled={!isLive && !isScheduled}
                  className="px-8 py-4 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {isLive ? 'Join Now' : isScheduled ? 'Join When Live' : 'Session Ended'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar (Chat/Participants) */}
        {(showChat || showParticipants) && (
          <div className="fixed right-0 top-16 bottom-0 w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => { setShowChat(true); setShowParticipants(false); }}
                className={`flex-1 py-3 text-sm font-medium ${showChat ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400'}`}
              >
                Chat
              </button>
              <button
                onClick={() => { setShowChat(false); setShowParticipants(true); }}
                className={`flex-1 py-3 text-sm font-medium ${showParticipants ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400'}`}
              >
                Participants ({sessionData.currentAttendees})
              </button>
            </div>

            {/* Chat Content */}
            {showChat && (
              <>
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="flex gap-3">
                      <div className="flex-shrink-0">
                        {msg.userAvatar ? (
                          <img
                            src={msg.userAvatar}
                            alt={msg.userName}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {msg.userName.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-medium text-white">
                            {msg.userName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(msg.timestamp), 'h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                {isJoined && (
                  <div className="p-4 border-t border-gray-700">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={sendMessage}
                        className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Participants Content */}
            {showParticipants && (
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {/* Host */}
                <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {sessionData.host.name?.charAt(0) || 'H'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{sessionData.host.name}</p>
                    <p className="text-gray-400 text-sm">Host</p>
                  </div>
                </div>

                {/* Placeholder participants */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-700/50 rounded-lg">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-gray-300 font-medium">P{i}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">Participant {i}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Session Info Panel */}
      <div className="fixed bottom-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 max-w-md">
        <h3 className="text-white font-semibold mb-2">About This Session</h3>
        <p className="text-gray-300 text-sm mb-3">
          {sessionData.description || 'No description provided'}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {format(new Date(sessionData.scheduledAt), 'MMM d, yyyy')}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {sessionData.duration} min
          </div>
        </div>
      </div>
    </div>
  )
}
