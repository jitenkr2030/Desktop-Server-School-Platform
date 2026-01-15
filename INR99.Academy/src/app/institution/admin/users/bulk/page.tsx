'use client'

import { useState, useRef } from 'react'

interface UploadResult {
  total: number
  successful: number
  failed: number
  errors: Array<{ row: number; email: string; error: string }>
  created: Array<{ email: string; name: string; tempPassword: string }>
}

export default function BulkStudentUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [classId, setClassId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile)
      } else {
        alert('Please upload a CSV file')
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a CSV file')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('tenantId', 'demo')
      if (classId) {
        formData.append('classId', classId)
      }

      const response = await fetch('/institution/api/users/bulk', {
        method: 'PUT',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data.results)
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload file')
    } finally {
      setLoading(false)
    }
  }

  const downloadTemplate = () => {
    const template = 'name,email,phone,roll_number\nJohn Doe,john@example.com,9876543210,001\nJane Smith,jane@example.com,9876543211,002'
    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'student_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadCredentials = () => {
    if (!result?.created.length) return

    const csv = 'Name,Email,Temporary Password\n' +
      result.created.map((s) => `${s.name},${s.email},${s.tempPassword}`).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'student_credentials.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bulk Student Upload</h1>
        <p className="text-gray-600">Upload multiple students at once using CSV</p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">How to Use</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-medium text-blue-900">Download Template</h3>
              <p className="text-sm text-blue-700 mt-1">
                Get the CSV template with the correct column headers
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-medium text-blue-900">Fill in Data</h3>
              <p className="text-sm text-blue-700 mt-1">
                Add student names, emails, and optional phone numbers
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-medium text-blue-900">Upload & Verify</h3>
              <p className="text-sm text-blue-700 mt-1">
                Upload the file and review the upload results
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSV Template */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">CSV Template</h2>
          <button
            onClick={downloadTemplate}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Template
          </button>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-gray-100 text-sm font-mono">
name,email,phone,roll_number
John Doe,john@example.com,9876543210,001
Jane Smith,jane@example.com,9876543211,002
          </pre>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <span className="flex items-center">
            <span className="text-red-500 mr-1">*</span> Required
          </span>
          <span>Max 100 students per upload</span>
          <span>Supported format: .csv</span>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Students</h2>

        {/* Class Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assign to Class (Optional)
          </label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a class</option>
            <option value="class-6-a">Class 6 - A</option>
            <option value="class-7-a">Class 7 - A</option>
            <option value="class-8-a">Class 8 - A</option>
            <option value="class-9-a">Class 9 - A</option>
            <option value="class-10-a">Class 10 - A</option>
          </select>
        </div>

        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : file
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {file ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setFile(null)
                }}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Remove file
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Drag and drop your CSV file here
                </p>
                <p className="text-sm text-gray-500">or click to browse</p>
              </div>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="mt-6">
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Students
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Upload Results</h2>
            {result.created.length > 0 && (
              <button
                onClick={downloadCredentials}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Credentials
              </button>
            )}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{result.successful}</p>
              <p className="text-sm text-green-700">Successful</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-red-600">{result.failed}</p>
              <p className="text-sm text-red-700">Failed</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{result.total}</p>
              <p className="text-sm text-blue-700">Total</p>
            </div>
          </div>

          {/* Success List */}
          {result.created.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Successfully Created ({result.created.length})</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Email</th>
                      <th className="pb-2">Temp Password</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.created.slice(0, 10).map((student, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="py-2">{student.name}</td>
                        <td className="py-2">{student.email}</td>
                        <td className="py-2 font-mono">{student.tempPassword}</td>
                      </tr>
                    ))}
                    {result.created.length > 10 && (
                      <tr>
                        <td colSpan={3} className="py-2 text-center text-gray-500">
                          ...and {result.created.length - 10} more
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Error List */}
          {result.errors.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Errors ({result.errors.length})</h3>
              <div className="bg-red-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="pb-2">Row</th>
                      <th className="pb-2">Email</th>
                      <th className="pb-2">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.errors.map((error, index) => (
                      <tr key={index} className="border-t border-red-200">
                        <td className="py-2">{error.row}</td>
                        <td className="py-2">{error.email}</td>
                        <td className="py-2 text-red-600">{error.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
