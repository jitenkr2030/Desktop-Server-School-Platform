'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AnalyticsExportPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [exportStatus, setExportStatus] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: ''
  })

  const handleExport = async (format: 'csv' | 'json' | 'xlsx') => {
    setLoading(true)
    setExportStatus('')

    try {
      const params = new URLSearchParams()
      params.append('format', format)
      if (filters.status) params.append('status', filters.status)
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
      if (filters.dateTo) params.append('dateTo', filters.dateTo)

      const response = await fetch(`/api/admin/verification/export?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const contentDisposition = response.headers.get('Content-Disposition')
      const fileName = contentDisposition?.match(/filename="(.+)"/)?.[1] || `verification-export.${format}`
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setExportStatus(`Successfully exported to ${format.toUpperCase()}`)
    } catch (error) {
      setExportStatus('Export failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Export
          </h1>
          <button
            onClick={() => router.push('/dashboard/admin/verification')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Verification Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Export Filters</h2>
            <p className="mt-1 text-sm text-gray-500">
              Configure the data range and filters before exporting
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="REQUIRES_MORE_INFO">Requires More Info</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date From
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date To
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Export Data</h2>
            <p className="mt-1 text-sm text-gray-500">
              Download verification data in your preferred format
            </p>
          </div>

          <div className="p-6">
            {exportStatus && (
              <div className={`mb-6 p-4 rounded-lg ${exportStatus.includes('Successfully') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className={exportStatus.includes('Successfully') ? 'text-green-600' : 'text-red-600'}>
                  {exportStatus}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* CSV Export */}
              <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                <div className="flex items-center mb-4">
                  <svg className="w-10 h-10 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">CSV</h3>
                    <p className="text-sm text-gray-500">Comma Separated Values</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Best for spreadsheet applications like Microsoft Excel, Google Sheets, or other data analysis tools.
                </p>
                <button
                  onClick={() => handleExport('csv')}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Exporting...' : 'Download CSV'}
                </button>
              </div>

              {/* JSON Export */}
              <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                <div className="flex items-center mb-4">
                  <svg className="w-10 h-10 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">JSON</h3>
                    <p className="text-sm text-gray-500">JavaScript Object Notation</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Best for programmatic access, APIs, and developers who need structured data.
                </p>
                <button
                  onClick={() => handleExport('json')}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md font-medium hover:bg-yellow-700 disabled:opacity-50"
                >
                  {loading ? 'Exporting...' : 'Download JSON'}
                </button>
              </div>

              {/* Excel Export */}
              <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                <div className="flex items-center mb-4">
                  <svg className="w-10 h-10 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">TSV</h3>
                    <p className="text-sm text-gray-500">Tab Separated Values</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Best for direct import into Microsoft Excel with proper column alignment.
                </p>
                <button
                  onClick={() => handleExport('xlsx')}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Exporting...' : 'Download TSV'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Export History */}
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Export Information</h2>
          </div>

          <div className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Exported Data Includes</h3>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li>Tenant ID and institution name</li>
                <li>Verification status and deadline</li>
                <li>Student count and submitted documents</li>
                <li>Review history and notes</li>
                <li>Timestamps for all activities</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
