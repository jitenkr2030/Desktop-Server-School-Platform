'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface VerificationStatus {
  status: string
  eligibilityStatus: string
  eligibilityDeadline: string | null
  documentsRequired: DocumentType[]
  submittedDocuments: UploadedDocument[]
  reviewNotes: ReviewNote[]
}

interface DocumentType {
  type: string
  label: string
  description: string
  required: boolean
}

interface UploadedDocument {
  id: string
  documentType: string
  fileName: string
  fileUrl: string
  status: string
  uploadedAt: string
  reviewedAt: string | null
  reviewNotes: string | null
}

interface ReviewNote {
  id: string
  note: string
  createdAt: string
  type: 'REVIEW' | 'SYSTEM' | 'REMINDER'
}

export default function TenantVerificationPortal() {
  const router = useRouter()
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const documentTypes: DocumentType[] = [
    {
      type: 'AICTE_APPROVAL',
      label: 'AICTE Approval Certificate',
      description: 'Valid approval certificate from All India Council for Technical Education',
      required: true
    },
    {
      type: 'NCTE_RECOGNITION',
      label: 'NCTE Recognition Letter',
      description: 'Recognition letter from National Council for Teacher Education (for teacher education institutions)',
      required: true
    },
    {
      type: 'STATE_GOVERNMENT_APPROVAL',
      label: 'State Government Approval',
      description: 'Approval/affiliation from relevant State Government authority',
      required: true
    },
    {
      type: 'UNIVERSITY_AFFILIATION',
      label: 'University Affiliation Document',
      description: 'Affiliation agreement with recognized university (if applicable)',
      required: false
    },
    {
      type: 'ENROLLMENT_DATA',
      label: 'Enrollment Data (Audited)',
      description: 'Audited enrollment data for current academic year showing 1500+ students',
      required: true
    },
    {
      type: 'STUDENT_ID_SAMPLE',
      label: 'Student ID Samples',
      description: 'Sample student ID cards (5-10 samples) to verify enrollment authenticity',
      required: true
    },
    {
      type: 'INSTITUTION_REGISTRATION',
      label: 'Institution Registration',
      description: 'Valid institution registration/society trust deed',
      required: true
    },
    {
      type: 'OTHER',
      label: 'Other Supporting Documents',
      description: 'Additional documents supporting your verification application',
      required: false
    }
  ]

  const fetchVerificationStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/tenant/verification/status')
      const data = await response.json()
      if (data.success) {
        setVerificationStatus(data.status)
      }
    } catch (err) {
      setError('Failed to fetch verification status')
    } finally {
      setLoading(false)
    }
  }, [])

  useState(() => {
    fetchVerificationStatus()
  })

  const handleFileUpload = async (documentType: string, files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, JPEG, PNG, and WebP files are allowed')
      return
    }

    setUploading(true)
    setUploadProgress(prev => ({ ...prev, [documentType]: 0 }))

    const formData = new FormData()
    formData.append('file', file)
    formData.append('documentType', documentType)

    try {
      const xhr = new XMLHttpRequest()
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(prev => ({ ...prev, [documentType]: progress }))
        }
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          setSuccess('Document uploaded successfully')
          fetchVerificationStatus()
        } else {
          const response = JSON.parse(xhr.responseText)
          setError(response.error || 'Upload failed')
        }
        setUploading(false)
        setUploadProgress(prev => ({ ...prev, [documentType]: 0 }))
      }

      xhr.onerror = () => {
        setError('Upload failed. Please try again.')
        setUploading(false)
        setUploadProgress(prev => ({ ...prev, [documentType]: 0 }))
      }

      xhr.open('POST', '/api/tenant/verification/documents')
      xhr.send(formData)
    } catch (err) {
      setError('Upload failed. Please try again.')
      setUploading(false)
    }
  }

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const response = await fetch(`/api/tenant/verification/documents/${documentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSuccess('Document deleted successfully')
        fetchVerificationStatus()
      } else {
        setError('Failed to delete document')
      }
    } catch (err) {
      setError('Failed to delete document')
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Review' },
      UNDER_REVIEW: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Under Review' },
      APPROVED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      REQUIRES_MORE_INFO: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'More Information Needed' }
    }
    return badges[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getDaysRemaining = () => {
    if (!verificationStatus?.eligibilityDeadline) return null
    const deadline = new Date(verificationStatus.eligibilityDeadline)
    const now = new Date()
    const diff = deadline.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const daysRemaining = getDaysRemaining()
  const statusBadge = verificationStatus ? getStatusBadge(verificationStatus.eligibilityStatus) : null

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Verification Portal
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
        {/* Success/Error Messages */}
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

        {/* Status Overview */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Verification Status</h2>
              {statusBadge && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                  {statusBadge.label}
                </span>
              )}
            </div>

            {/* Deadline Warning */}
            {daysRemaining !== null && verificationStatus?.eligibilityStatus !== 'APPROVED' && (
              <div className={`rounded-lg p-4 mb-4 ${daysRemaining <= 7 ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <div className="flex items-center">
                  <svg className={`w-5 h-5 mr-2 ${daysRemaining <= 7 ? 'text-red-500' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={daysRemaining <= 7 ? 'text-red-700' : 'text-yellow-700'}>
                    {daysRemaining === 0 ? (
                      <strong>Your verification deadline has passed. Please complete your verification immediately to avoid feature restrictions.</strong>
                    ) : (
                      <strong>{daysRemaining} days remaining</strong> to complete your verification requirements.
                    )}
                  </span>
                </div>
                {verificationStatus?.eligibilityDeadline && (
                  <p className={`mt-2 text-sm ${daysRemaining <= 7 ? 'text-red-600' : 'text-yellow-600'}`}>
                    Deadline: {formatDate(verificationStatus.eligibilityDeadline)}
                  </p>
                )}
              </div>
            )}

            {/* Review Notes */}
            {verificationStatus?.reviewNotes && verificationStatus.reviewNotes.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Updates from Review Team</h3>
                <ul className="space-y-2">
                  {verificationStatus.reviewNotes.map((note) => (
                    <li key={note.id} className="text-sm text-blue-700">
                      • {note.note}
                      <span className="text-blue-500 ml-2">({formatDate(note.createdAt)})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Required Documents</h2>
            <p className="mt-1 text-sm text-gray-500">
              Upload all required documents to complete your verification. Maximum file size: 10MB. Accepted formats: PDF, JPEG, PNG, WebP.
            </p>
          </div>

          <div className="p-6 space-y-6">
            {documentTypes.map((docType) => {
              const uploadedDoc = verificationStatus?.submittedDocuments?.find(
                doc => doc.documentType === docType.type && doc.status !== 'REJECTED'
              )
              const isUploading = uploading && uploadProgress[docType.type] !== undefined

              return (
                <div key={docType.type} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900">{docType.label}</h3>
                        {docType.required && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{docType.description}</p>
                    </div>
                    <div className="ml-4">
                      {uploadedDoc ? (
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            uploadedDoc.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            uploadedDoc.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {uploadedDoc.status === 'APPROVED' ? 'Approved' :
                             uploadedDoc.status === 'UNDER_REVIEW' ? 'Under Review' :
                             'Pending'}
                          </span>
                          <button
                            onClick={() => handleDeleteDocument(uploadedDoc.id)}
                            className="ml-2 text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <label className={`cursor-pointer px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          {isUploading ? `Uploading ${uploadProgress[docType.type]}%` : 'Upload'}
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            onChange={(e) => handleFileUpload(docType.type, e.target.files)}
                            disabled={isUploading}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress[docType.type]}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Uploaded Document Info */}
                  {uploadedDoc && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{uploadedDoc.fileName}</p>
                          <p className="text-xs text-gray-500">Uploaded {formatDate(uploadedDoc.uploadedAt)}</p>
                        </div>
                        <a
                          href={uploadedDoc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </a>
                      </div>
                      {uploadedDoc.reviewNotes && (
                        <p className="mt-2 text-sm text-orange-600">
                          Review feedback: {uploadedDoc.reviewNotes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900">Document Requirements</h3>
              <p className="mt-1 text-sm text-gray-500">
                All documents must be clear, legible, and contain valid official stamps or signatures.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900">Contact Support</h3>
              <p className="mt-1 text-sm text-gray-500">
                Email us at verification@inr99.academy for assistance with your application.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
