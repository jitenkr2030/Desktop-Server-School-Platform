'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Tenant {
  id: string
  name: string
  slug: string
  studentCount: number | null
  eligibilityStatus: string
  eligibilityDeadline: string | null
  createdAt: string
  domains: Array<{
    domain: string
    status: string
  }>
  verificationDocs: Array<{
    id: string
    documentType: string
    fileName: string
    fileUrl: string
    status: string
    createdAt: string
  }>
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function AdminVerificationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [selectedTenants, setSelectedTenants] = useState<Set<string>>(new Set())
  const [reviewAction, setReviewAction] = useState('')
  const [reviewNotes, setReviewNotes] = useState('')
  const [bulkNotes, setBulkNotes] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchTenants()
  }, [pagination.page])

  const fetchTenants = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/admin/verification?status=UNDER_REVIEW&page=${pagination.page}&limit=${pagination.limit}`
      )
      const data = await response.json()
      
      if (data.success) {
        setTenants(data.tenants)
        setPagination(data.pagination)
      } else {
        setError(data.error || 'Failed to fetch verifications')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const handleBulkAction = async (action: 'APPROVE' | 'REQUIRES_MORE_INFO' | 'REJECT') => {
    if (selectedTenants.size === 0) {
      setError('Please select at least one institution')
      return
    }

    if (action === 'REJECT' && !bulkNotes.trim()) {
      setError('Please provide a reason for bulk rejection')
      return
    }

    setProcessing(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/verification/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantIds: Array.from(selectedTenants),
          action,
          reviewNotes: bulkNotes || 'Bulk action',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process bulk action')
      }

      setSuccess(`Successfully processed ${data.count} institutions`)
      setSelectedTenants(new Set())
      setBulkNotes('')
      fetchTenants()
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  const toggleSelectAll = () => {
    if (selectedTenants.size === tenants.length) {
      setSelectedTenants(new Set())
    } else {
      setSelectedTenants(new Set(tenants.map(t => t.id)))
    }
  }

  const toggleTenant = (id: string) => {
    const newSelected = new Set(selectedTenants)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedTenants(newSelected)
  }

  const handleReview = async () => {
    if (!selectedTenant || !reviewAction) return

    setProcessing(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/verification', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: selectedTenant.id,
          action: reviewAction,
          reviewNotes,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process verification')
      }

      setSuccess(data.message)
      setSelectedTenant(null)
      setReviewAction('')
      setReviewNotes('')
      fetchTenants()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      AICTE_APPROVAL: 'AICTE Approval Certificate',
      NCTE_RECOGNITION: 'NCTE Recognition Letter',
      STATE_GOVERNMENT_APPROVAL: 'State Government Approval',
      UNIVERSITY_AFFILIATION: 'University Affiliation Document',
      ENROLLMENT_DATA: 'Enrollment Data (Audited)',
      STUDENT_ID_SAMPLE: 'Student ID Samples',
      INSTITUTION_REGISTRATION: 'Institution Registration',
      OTHER: 'Other Document',
    }
    return labels[type] || type
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Verification Review
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
        {/* Success/Error Messages */}
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
            <div className="text-sm font-medium text-gray-500">Under Review</div>
            <div className="mt-2 text-3xl font-bold text-yellow-600">
              {tenants.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Approved Today</div>
            <div className="mt-2 text-3xl font-bold text-green-600">-</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Rejected Today</div>
            <div className="mt-2 text-3xl font-bold text-red-600">-</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Pending</div>
            <div className="mt-2 text-3xl font-bold text-gray-600">
              {pagination.total}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tenant List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Institutions Awaiting Verification
                </h2>
              </div>

              {loading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading...</p>
                </div>
              ) : tenants.length === 0 ? (
                <div className="p-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-2 text-gray-500">No institutions pending verification</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {tenants.map((tenant) => (
                    <li 
                      key={tenant.id}
                      className={`px-6 py-4 cursor-pointer hover:bg-gray-50 ${
                        selectedTenant?.id === tenant.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={(e) => {
                        // Don't select tenant if clicking checkbox
                        if ((e.target as HTMLElement).closest('.tenant-checkbox')) return
                        setSelectedTenant(tenant)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="tenant-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-4"
                            checked={selectedTenants.has(tenant.id)}
                            onChange={(e) => {
                              e.stopPropagation()
                              toggleTenant(tenant.id)
                            }}
                          />
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{tenant.name}</h3>
                            <p className="text-sm text-gray-500">
                              {tenant.domains[0]?.domain || `${tenant.slug}.inr99.academy`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {tenant.studentCount?.toLocaleString() || 0} students
                          </p>
                          <p className="text-xs text-gray-500">
                            Applied {formatDate(tenant.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {tenant.verificationDocs.length} document(s)
                        </span>
                        <span className="text-xs text-gray-500">
                          Deadline: {tenant.eligibilityDeadline 
                            ? formatDate(tenant.eligibilityDeadline)
                            : 'N/A'}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Bulk Actions Bar */}
                {selectedTenants.size > 0 && (
                  <div className="px-6 py-3 bg-blue-50 border-t border-blue-200 flex items-center justify-between">
                    <span className="text-sm text-blue-700 font-medium">
                      {selectedTenants.size} institution(s) selected
                    </span>
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={bulkNotes}
                        onChange={(e) => setBulkNotes(e.target.value)}
                        placeholder="Notes (required for rejection)"
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md w-64"
                      />
                      <button
                        onClick={() => handleBulkAction('APPROVE')}
                        disabled={processing}
                        className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md font-medium hover:bg-green-700 disabled:opacity-50"
                      >
                        Approve All ({selectedTenants.size})
                      </button>
                      <button
                        onClick={() => handleBulkAction('REQUIRES_MORE_INFO')}
                        disabled={processing}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
                      >
                        Request More Info
                      </button>
                      <button
                        onClick={() => handleBulkAction('REJECT')}
                        disabled={processing || !bulkNotes.trim()}
                        className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md font-medium hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject All ({selectedTenants.size})
                      </button>
                    </div>
                  </div>
                )}

                {/* Select All Header */}
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                    checked={tenants.length > 0 && selectedTenants.size === tenants.length}
                    onChange={toggleSelectAll}
                  />
                  <span className="text-sm text-gray-700">Select All</span>
                </div>
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
            {selectedTenant ? (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Review Application
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  {/* Tenant Info */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Institution</h3>
                    <p className="text-base font-medium text-gray-900">{selectedTenant.name}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Students</h3>
                    <p className="text-base font-medium text-gray-900">
                      {selectedTenant.studentCount?.toLocaleString() || 0}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Subdomain</h3>
                    <p className="text-base font-medium text-gray-900">
                      {selectedTenant.domains[0]?.domain || `${selectedTenant.slug}.inr99.academy`}
                    </p>
                  </div>

                  {/* Documents */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Documents</h3>
                    <ul className="space-y-2">
                      {selectedTenant.verificationDocs.map((doc) => (
                        <li key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                              <p className="text-sm text-gray-900">{getDocumentTypeLabel(doc.documentType)}</p>
                              <p className="text-xs text-gray-500">{doc.fileName}</p>
                            </div>
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

                  {/* Review Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Review Notes
                    </label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add notes about your decision (optional for approval, required for rejection)"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setReviewAction('APPROVE')
                        handleReview()
                      }}
                      disabled={processing}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:opacity-50"
                    >
                      {processing ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => {
                        setReviewAction('REQUIRES_MORE_INFO')
                        handleReview()
                      }}
                      disabled={processing}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      Request More
                    </button>
                    <button
                      onClick={() => {
                        if (!reviewNotes.trim()) {
                          setError('Please provide a reason for rejection')
                          return
                        }
                        setReviewAction('REJECT')
                        handleReview()
                      }}
                      disabled={processing}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="mt-2 text-gray-500">
                  Select an institution from the list to review
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
