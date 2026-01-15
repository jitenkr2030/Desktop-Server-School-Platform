'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Appeal {
  id: string
  tenantId: string
  tenantName: string
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
}

interface TenantInfo {
  id: string
  name: string
  studentCount: number | null
  eligibilityStatus: string
  rejectionReason: string | null
}

export default function TenantAppealPage() {
  const router = useRouter()
  const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null)
  const [appealReason, setAppealReason] = useState('')
  const [supportingDocuments, setSupportingDocuments] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [existingAppeal, setExistingAppeal] = useState<Appeal | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchTenantInfo()
    fetchExistingAppeal()
  }, [])

  const fetchTenantInfo = async () => {
    try {
      const response = await fetch('/api/tenant/verification/status')
      const data = await response.json()
      if (data.success && data.status) {
        setTenantInfo({
          id: 'current-tenant', // Would come from actual tenant context
          name: data.status.tenantName || 'Your Institution',
          studentCount: data.status.studentCount,
          eligibilityStatus: data.status.eligibilityStatus,
          rejectionReason: data.status.rejectionReason || null
        })
      }
    } catch (err) {
      setError('Failed to load institution information')
    }
  }

  const fetchExistingAppeal = async () => {
    try {
      const response = await fetch('/api/tenant/verification/appeal')
      const data = await response.json()
      if (data.success && data.appeal) {
        setExistingAppeal(data.appeal)
      }
    } catch (err) {
      // No existing appeal is fine
    }
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    const uploadedDocs: File[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError(`File "${file.name}" exceeds 10MB limit`)
        continue
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setError(`File "${file.name}" type not allowed`)
        continue
      }

      uploadedDocs.push(file)
    }

    setSupportingDocuments(prev => [...prev, ...uploadedDocs])
    setUploading(false)
  }

  const removeDocument = (index: number) => {
    setSupportingDocuments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmitAppeal = async () => {
    if (!appealReason.trim()) {
      setError('Please provide a reason for your appeal')
      return
    }

    if (appealReason.length < 50) {
      setError('Please provide a detailed explanation (at least 50 characters)')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('appealReason', appealReason)
      
      supportingDocuments.forEach((file, index) => {
        formData.append(`document_${index}`, file)
      })

      const response = await fetch('/api/tenant/verification/appeal', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit appeal')
      }

      setSuccess('Your appeal has been submitted successfully. Our team will review it within 5 business days.')
      setAppealReason('')
      setSupportingDocuments([])
      fetchExistingAppeal()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Under Review' },
      APPROVED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Not Approved' },
      MORE_INFO_REQUESTED: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'More Information Needed' }
    }
    return badges[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (existingAppeal) {
    const statusBadge = getStatusBadge(existingAppeal.status)

    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Appeal Status
            </h1>
            <button
              onClick={() => router.push('/dashboard')}
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

          {/* Status Card */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Your Appeal</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                  {statusBadge.label}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-500 mb-1">Submitted on</p>
                <p className="text-base font-medium text-gray-900">{formatDate(existingAppeal.submittedAt)}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Original Decision</p>
                <p className="text-base font-medium text-gray-900">{existingAppeal.originalDecision}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Your Appeal Reason</p>
                <p className="text-base text-gray-900">{existingAppeal.appealReason}</p>
              </div>

              {existingAppeal.supportingDocuments.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Supporting Documents</p>
                  <ul className="space-y-2">
                    {existingAppeal.supportingDocuments.map((doc) => (
                      <li key={doc.id} className="flex items-center p-2 bg-gray-50 rounded">
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm text-gray-900">{doc.fileName}</span>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {existingAppeal.status === 'APPROVED' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">✓ Your appeal has been approved!</p>
                  <p className="text-green-700 text-sm mt-1">Your institution's verification status has been updated.</p>
                </div>
              )}

              {existingAppeal.status === 'REJECTED' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">Unfortunately, your appeal was not approved.</p>
                  {existingAppeal.reviewNotes && (
                    <p className="text-red-700 text-sm mt-1">Reason: {existingAppeal.reviewNotes}</p>
                  )}
                </div>
              )}

              {existingAppeal.status === 'MORE_INFO_REQUESTED' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-800 font-medium">Additional information is requested</p>
                  <p className="text-orange-700 text-sm mt-1">{existingAppeal.reviewNotes}</p>
                </div>
              )}
            </div>
          </div>

          {existingAppeal.status === 'REJECTED' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Submit a New Appeal</h3>
              <p className="text-sm text-gray-500 mb-4">
                You may submit a new appeal with additional information or documentation.
              </p>
              <button
                onClick={() => setExistingAppeal(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
              >
                Submit New Appeal
              </button>
            </div>
          )}

          {/* Contact Section */}
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Questions about your appeal?</h3>
            <p className="text-sm text-gray-500">
              Contact our support team at <a href="mailto:support@inr99.academy" className="text-blue-600 hover:text-blue-800">support@inr99.academy</a> for assistance.
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Submit Appeal
          </h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-green-600">{success}</p>
              <button onClick={() => setSuccess('')} className="text-green-600 hover:text-green-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-red-600">{error}</p>
              <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-blue-900 mb-3">Appeal Guidelines</h2>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-2">
            <li>Appeals are typically reviewed within 5 business days</li>
            <li>Provide as much detail as possible to support your case</li>
            <li>Include any additional documentation that may help your appeal</li>
            <li>Ensure all information is accurate and complete</li>
            <li>Frivolous or repeated appeals may not be considered</li>
          </ul>
        </div>

        {/* Appeal Form */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Appeal Details</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Appeal Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Appeal <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Please explain why you believe your institution's verification should be reconsidered. 
                Include any relevant details, corrections to previous information, or additional context.
              </p>
              <textarea
                value={appealReason}
                onChange={(e) => setAppealReason(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Please provide a detailed explanation for your appeal..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {appealReason.length}/2000 characters (minimum 50)
              </p>
            </div>

            {/* Supporting Documents */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supporting Documents (Optional)
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Upload any additional documents that support your appeal, such as updated official letters, 
                revised enrollment data, or other relevant evidence.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop files here, or click to browse
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="mt-4 mx-auto block"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Maximum 10MB per file. PDF, JPEG, PNG, WebP formats only.
                </p>
              </div>

              {/* Uploaded Documents List */}
              {supportingDocuments.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {supportingDocuments.map((file, index) => (
                    <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm text-gray-900">{file.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        onClick={() => removeDocument(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                onClick={handleSubmitAppeal}
                disabled={submitting || !appealReason.trim()}
                className={`px-6 py-2 rounded-md font-medium ${
                  submitting || !appealReason.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {submitting ? 'Submitting...' : 'Submit Appeal'}
              </button>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-500">
            If you have questions about the appeal process or need assistance, please contact our support team at 
            <a href="mailto:support@inr99.academy" className="text-blue-600 hover:text-blue-800"> support@inr99.academy</a>.
          </p>
        </div>
      </main>
    </div>
  )
}
