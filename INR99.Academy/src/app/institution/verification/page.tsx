'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface VerificationDocument {
  id: string
  documentType: string
  fileName: string
  status: string
  createdAt: string
  reviewedAt?: string
  reviewNotes?: string
}

export default function VerificationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [tenantData, setTenantData] = useState<any>(null)
  const [documents, setDocuments] = useState<VerificationDocument[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedType, setSelectedType] = useState('')

  const documentTypes = [
    { value: 'AICTE_APPROVAL', label: 'AICTE Approval Certificate' },
    { value: 'NCTE_RECOGNITION', label: 'NCTE Recognition Letter' },
    { value: 'STATE_GOVERNMENT_APPROVAL', label: 'State Government Approval' },
    { value: 'UNIVERSITY_AFFILIATION', label: 'University Affiliation Document' },
    { value: 'ENROLLMENT_DATA', label: 'Enrollment Data (Audited)' },
    { value: 'STUDENT_ID_SAMPLE', label: 'Student ID Samples' },
    { value: 'INSTITUTION_REGISTRATION', label: 'Institution Registration' },
    { value: 'OTHER', label: 'Other Document' },
  ]

  useEffect(() => {
    // Check for tenant info from localStorage (set during signup)
    const storedTenant = localStorage.getItem('registeredTenant')
    if (storedTenant) {
      const tenant = JSON.parse(storedTenant)
      setTenantData(tenant)
      fetchDocuments(tenant.id)
    } else {
      // Redirect to login if no tenant data
      router.push('/auth/login')
    }
  }, [])

  const fetchDocuments = async (tenantId: string) => {
    try {
      const response = await fetch(`/api/tenants/verification?tenantId=${tenantId}`)
      const data = await response.json()
      if (data.success) {
        setDocuments(data.documents)
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Allowed: PDF, JPEG, PNG')
        setSelectedFile(null)
        return
      }
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit')
        setSelectedFile(null)
        return
      }
      
      setError('')
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedType || !tenantData) {
      setError('Please select a document type and file')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('tenantId', tenantData.id)
      formData.append('documentType', selectedType)
      formData.append('file', selectedFile)

      const response = await fetch('/api/tenants/verification', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setSuccess('Document uploaded successfully!')
      setSelectedFile(null)
      setSelectedType('')
      fetchDocuments(tenantData.id)
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      REQUIRES_MORE_INFO: 'bg-blue-100 text-blue-800',
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace(/_/g, ' ')}
      </span>
    )
  }

  if (!tenantData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const isEligible = tenantData.isEligible
  const daysRemaining = tenantData.eligibilityDeadline 
    ? Math.max(0, Math.ceil((new Date(tenantData.eligibilityDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gray-900">INR99 Academy</h1>
          </Link>
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">
            Verification Documents
          </h2>
          <p className="mt-2 text-gray-600">
            Complete your eligibility verification to access full white-label features
          </p>
        </div>

        {/* Eligibility Status Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{tenantData.name}</h3>
              <p className="text-sm text-gray-500">Student Count: {tenantData.studentCount}</p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isEligible 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isEligible ? '✓ Eligible' : '✗ Not Eligible'}
              </div>
            </div>
          </div>

          {/* Progress */}
          {isEligible && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Verification Progress</span>
                <span className="font-medium text-gray-900">
                  {documents.length > 0 ? 'Under Review' : 'Pending Document Upload'}
                </span>
              </div>
              {documents.length === 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: '0%' }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Upload verification documents to complete your verification process
                  </p>
                </div>
              )}
              {documents.length > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: '50%' }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Your documents are being reviewed. This typically takes 2-3 business days.
                  </p>
                </div>
              )}
            </div>
          )}

          {!isEligible && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center text-red-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium">
                  Your institution does not meet the minimum requirement of 1500 students.
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Institutions with 1500+ students qualify for free white-label access.
                Current: {tenantData.studentCount} students, Required: 1500 students.
              </p>
            </div>
          )}
        </div>

        {/* Upload Section - Only show if eligible */}
        {isEligible && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upload Verification Documents
            </h3>

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type *
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select document type</option>
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document *
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Accepted formats: PDF, JPEG, PNG (Max 10MB)
                </p>
              </div>

              {selectedFile && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-gray-700">{selectedFile.name}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!selectedFile || !selectedType || uploading}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading...
                  </>
                ) : (
                  'Upload Document'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Document List */}
        {documents.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Uploaded Documents
            </h3>

            <div className="space-y-3">
              {documents.map((doc) => (
                <div 
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {documentTypes.find(t => t.value === doc.documentType)?.label || doc.documentType}
                      </p>
                      <p className="text-xs text-gray-500">
                        {doc.fileName} • Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(doc.status)}
                    {doc.status === 'REJECTED' && doc.reviewNotes && (
                      <span className="text-xs text-red-600" title={doc.reviewNotes}>
                        View rejection reason
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link 
            href={`/institution/auth/login?email=${tenantData?.email || ''}`}
            className="text-blue-600 hover:underline"
          >
            Go to Institution Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
