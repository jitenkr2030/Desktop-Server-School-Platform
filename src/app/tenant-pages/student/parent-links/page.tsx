'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface ParentLink {
  id: string
  parentName: string
  parentEmail: string
  mobileNumber: string | null
  relationType: string
  status: string
  createdAt: string
  verifiedAt: string | null
}

interface PendingLink {
  id: string
  parentName: string
  parentEmail: string
  mobileNumber: string | null
  relationType: string
  createdAt: string
}

export default function StudentParentLinksPage() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId') || 'demo-user'
  const [parentCode, setParentCode] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [links, setLinks] = useState<ParentLink[]>([])
  const [pendingLinks, setPendingLinks] = useState<PendingLink[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadParentLinks()
  }, [userId])

  const loadParentLinks = async () => {
    try {
      const response = await fetch(
        `/api/institution/api/student/parent-links?userId=${userId}`
      )
      const data = await response.json()

      if (response.ok) {
        setParentCode(data.parentCode)
        setExpiresAt(data.expiresAt)
        setLinks(data.links)
        setPendingLinks(data.pendingLinks)
      }
    } catch (error) {
      console.error('Failed to load parent links:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateNewCode = async () => {
    setGenerating(true)
    try {
      const response = await fetch('/api/institution/api/student/parent-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (response.ok) {
        setParentCode(data.parentCode)
        setExpiresAt(data.expiresAt)
        setPendingLinks(data.pendingLinks)
      }
    } catch (error) {
      console.error('Failed to generate code:', error)
    } finally {
      setGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (parentCode) {
      navigator.clipboard.writeText(parentCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleAction = async (linkId: string, action: 'approve' | 'reject') => {
    setActionLoading(linkId)
    try {
      const response = await fetch('/api/institution/api/student/verify-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, linkId, action }),
      })

      const data = await response.json()

      if (response.ok) {
        loadParentLinks()
      } else {
        alert(data.error || 'Failed to process request')
      }
    } catch (error) {
      console.error('Failed to process action:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const removeLink = async (linkId: string) => {
    if (!confirm('Are you sure you want to remove this parent link?')) return

    try {
      const response = await fetch(
        `/api/institution/api/student/verify-link?userId=${userId}&linkId=${linkId}`,
        { method: 'DELETE' }
      )

      const data = await response.json()

      if (response.ok) {
        loadParentLinks()
      } else {
        alert(data.error || 'Failed to remove link')
      }
    } catch (error) {
      console.error('Failed to remove link:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parent Access</h1>
          <p className="text-gray-600">Share your code with parents to let them monitor your progress</p>
        </div>
      </div>

      {/* Parent Code Card */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Parent Linking Code</h2>
            <p className="text-sm text-gray-600 mb-4">
              Share this code with your parents. They can use it to link to your account and view your progress.
            </p>
          </div>
          <button
            onClick={generateNewCode}
            disabled={generating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {generating ? 'Generating...' : 'Generate New Code'}
          </button>
        </div>

        {parentCode ? (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Your Code</p>
                <p className="text-3xl font-mono font-bold text-gray-900 tracking-wider">{parentCode}</p>
              </div>
              <button
                onClick={copyToClipboard}
                className="flex items-center px-4 py-2 bg-white border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Code
                  </>
                )}
              </button>
            </div>
            {expiresAt && (
              <p className="mt-3 text-xs text-gray-500">
                Expires on: {new Date(expiresAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-4 p-8 text-center bg-gray-50 rounded-lg">
            <p className="text-gray-600">No code generated yet</p>
            <button
              onClick={generateNewCode}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Generate Your Code
            </button>
          </div>
        )}

        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Important</h3>
              <p className="mt-1 text-sm text-yellow-700">
                Only share this code with people you trust. Parents who link to your account will be able to see your progress, attendance, and assignment scores.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingLinks.length > 0 && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Link Requests</h2>
          <div className="space-y-4">
            {pendingLinks.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{link.parentName}</p>
                  <p className="text-sm text-gray-600">{link.parentEmail}</p>
                  {link.mobileNumber && (
                    <p className="text-sm text-gray-500">{link.mobileNumber}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Relation: {link.relationType.toLowerCase()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAction(link.id, 'reject')}
                    disabled={actionLoading === link.id}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction(link.id, 'approve')}
                    disabled={actionLoading === link.id}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50"
                  >
                    {actionLoading === link.id ? 'Approving...' : 'Approve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Linked Parents */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Linked Parents</h2>
        {links.filter(l => l.status === 'VERIFIED').length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No parents linked to your account yet
          </p>
        ) : (
          <div className="space-y-3">
            {links.filter(l => l.status === 'VERIFIED').map((link) => (
              <div key={link.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{link.parentName}</p>
                    <p className="text-sm text-gray-600">{link.parentEmail}</p>
                    <p className="text-xs text-gray-500">
                      {link.relationType.toLowerCase()} • Linked {new Date(link.verifiedAt!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeLink(link.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  title="Remove parent link"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
