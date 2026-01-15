'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Appeal {
  id: string
  tenantId: string
  tenantName: string
  studentCount: number | null
  originalDecision: string
  appealReason: string
  supportingDocuments: Array<{
    id: string
    fileName: string
    fileUrl: string
  }>
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MORE_INFO_REQUESTED'
  submittedAt: string
  reviewedAt: string | null
  reviewNotes: string | null
  reviewedBy: string | null
  rejectionReason?: string | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function AdminAppealsPage() {
  const router = useRouter()
  const [appeals, setAppeals] = useState<Appeal[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [processing, setProcessing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filter, setFilter] = useState('PENDING')

  useEffect(() => {
    fetchAppeals()
  }, [pagination.page, filter])

  const fetchAppeals = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/admin/verification/appeals?status=${filter}&page=${pagination.page}&limit=${pagination.limit}`
      )
      const data = await response.json()
      
      if (data.success) {
        setAppeals(data.appeals)
        setPagination(data.pagination)
      } else {
        setError(data.error || 'Failed to fetch appeals')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (decision: 'APPROVED' | 'REJECTED' | 'MORE_INFO_REQUESTED') => {
    if (!selectedAppeal) return

    if (decision !== 'APPROVED' && !reviewNotes.trim()) {
      setError('Please provide review notes for non-approval decisions')
      return
    }

    setProcessing(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/admin/verification/appeals/${selectedAppeal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          reviewNotes
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process appeal')
      }

      setSuccess(`Appeal ${decision === 'APPROVED' ? 'approved' : decision === 'REJECTED' ? 'rejected' : 'returned for more info'}`)
      setSelectedAppeal(null)
      setReviewNotes('')
      fetchAppeals()
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      APPROVED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      MORE_INFO_REQUESTED: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'More Info Needed' }
    }
    return badges[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Appeal Review
          </h1>
          <button
            onClick={() => router.push('/dashboard/admin')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Pending Appeals</div>
            <div className="mt-2 text-3xl font-bold text-yellow-600">
              {appeals.filter(a => a.status === 'PENDING').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Approved This Week</div>
            <div className="mt-2 text-3xl font-bold text-green-600">-</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Rejected This Week</div>
            <div className="mt-2 text-3xl font-bold text-red-600">-</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Appeals</div>
            <div className="mt-2 text-3xl font-bold text-gray-600">
              {pagination.total}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appeal List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Appeals</h2>
                <select
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value)
                    setPagination(prev => ({ ...prev, page: 1 }))
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="MORE_INFO_REQUESTED">More Info</option>
                  <option value="ALL">All Statuses</option>
                </select>
              </div>

              {loading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading...</p>
                </div>
              ) : appeals.length === 0 ? (
                <div className="p-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-2 text-gray-500">No appeals found</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {appeals.map((appeal) => {
                    const statusBadge = getStatusBadge(appeal.status)
                    return (
                      <li 
                        key={appeal.id}
                        className={`px-6 py-4 cursor-pointer hover:bg-gray-50 ${
                          selectedAppeal?.id === appeal.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedAppeal(appeal)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{appeal.tenantName}</h3>
                            <p className="text-sm text-gray-500">
                              {appeal.studentCount?.toLocaleString() || 0} students
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                              {statusBadge.label}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(appeal.submittedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            Original: {appeal.originalDecision} → Reason: {appeal.appealReason.substring(0, 100)}...
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Review Panel */}
          <div>
            {selectedAppeal ? (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Review Appeal
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  {/* Tenant Info */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Institution</h3>
                    <p className="text-base font-medium text-gray-900">{selectedAppeal.tenantName}</p>
                    <p className="text-sm text-gray-500">
                      {selectedAppeal.studentCount?.toLocaleString() || 0} students
                    </p>
                  </div>

                  {/* Original Decision */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Original Decision</h3>
                    <p className="text-base font-medium text-red-600">
                      {selectedAppeal.originalDecision.replace(/_/g, ' ')}
                    </p>
                  </div>

                  {/* Appeal Reason */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Appeal Reason</h3>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">
                        {selectedAppeal.appealReason}
                      </p>
                    </div>
                  </div>

                  {/* Supporting Documents */}
                  {selectedAppeal.supportingDocuments.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Supporting Documents</h3>
                      <ul className="space-y-2">
                        {selectedAppeal.supportingDocuments.map((doc) => (
                          <li key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-sm text-gray-900">{doc.fileName}</span>
                            </div>
                            <a 
                              href={doc.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              View
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Review Notes */}
                  {selectedAppeal.status === 'PENDING' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Review Notes {selectedAppeal.status !== 'APPROVED' && <span className="text-red-500">*</span>}
                        </label>
                        <textarea
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Add notes about your decision (required for rejection/return)"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleReview('APPROVED')}
                          disabled={processing}
                          className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:opacity-50"
                        >
                          {processing ? 'Processing...' : 'Approve Appeal'}
                        </button>
                        <button
                          onClick={() => handleReview('MORE_INFO_REQUESTED')}
                          disabled={processing}
                          className="px-4 py-2 bg-orange-600 text-white rounded-md font-medium hover:bg-orange-700 disabled:opacity-50"
                        >
                          Request More Info
                        </button>
                        <button
                          onClick={() => handleReview('REJECTED')}
                          disabled={processing}
                          className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject Appeal
                        </button>
                      </div>
                    </>
                  )}

                  {/* Show review result if already processed */}
                  {selectedAppeal.status !== 'PENDING' && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Decision Made</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedAppeal.status.replace(/_/g, ' ')}
                      </p>
                      {selectedAppeal.reviewNotes && (
                        <p className="text-sm text-gray-600 mt-2">
                          Notes: {selectedAppeal.reviewNotes}
                        </p>
                      )}
                      {selectedAppeal.reviewedBy && (
                        <p className="text-xs text-gray-500 mt-2">
                          Reviewed by: {selectedAppeal.reviewedBy}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="mt-2 text-gray-500">
                  Select an appeal from the list to review
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
