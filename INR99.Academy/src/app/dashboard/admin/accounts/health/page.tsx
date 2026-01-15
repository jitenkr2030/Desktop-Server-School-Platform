'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface InstitutionHealth {
  tenantId: string
  institutionName: string
  tier: string
  overallScore: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  factors: Array<{
    name: string
    score: number
    weight: number
    description: string
    recommendations?: string[]
  }>
  lastActivity: string
  verificationStatus: string
  paymentStatus: string
  supportTicketCount: number
}

interface HealthSummary {
  total: number
  byRisk: {
    critical: number
    high: number
    medium: number
    low: number
  }
  avgScore: number
  atRisk: number
}

export default function AdminAccountHealthPage() {
  const router = useRouter()
  const [healthData, setHealthData] = useState<{
    data: InstitutionHealth[]
    summary: HealthSummary
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all')
  const [selectedInstitution, setSelectedInstitution] = useState<InstitutionHealth | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHealthData()
  }, [filter])

  const fetchHealthData = async () => {
    try {
      const response = await fetch(`/api/admin/account-health${filter !== 'all' ? `?riskLevel=${filter}` : ''}`)
      const data = await response.json()

      if (data.success) {
        setHealthData(data.data)
      } else {
        setError(data.error || 'Failed to fetch health data')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRiskBadge = (risk: string) => {
    const badges: Record<string, { label: string; bg: string; text: string }> = {
      critical: { label: 'Critical', bg: 'bg-red-600', text: 'text-white' },
      high: { label: 'High Risk', bg: 'bg-orange-500', text: 'text-white' },
      medium: { label: 'Medium', bg: 'bg-yellow-500', text: 'text-white' },
      low: { label: 'Healthy', bg: 'bg-green-500', text: 'text-white' },
    }
    return badges[risk] || badges.low
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    if (score >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const handleOutreach = async (tenantId: string) => {
    // In production, this would trigger an outreach workflow
    alert(`Outreach initiated for ${tenantId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Account Health Dashboard
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
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Institutions</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {healthData?.summary.total || 0}
            </div>
          </div>

          <div className="bg-red-50 rounded-lg shadow p-6 border border-red-200">
            <div className="text-sm font-medium text-red-600">Critical Risk</div>
            <div className="mt-2 text-3xl font-bold text-red-700">
              {healthData?.summary.byRisk.critical || 0}
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg shadow p-6 border border-orange-200">
            <div className="text-sm font-medium text-orange-600">High Risk</div>
            <div className="mt-2 text-3xl font-bold text-orange-700">
              {healthData?.summary.byRisk.high || 0}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg shadow p-6 border border-yellow-200">
            <div className="text-sm font-medium text-yellow-600">Medium Risk</div>
            <div className="mt-2 text-3xl font-bold text-yellow-700">
              {healthData?.summary.byRisk.medium || 0}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg shadow p-6 border border-green-200">
            <div className="text-sm font-medium text-green-600">Healthy</div>
            <div className="mt-2 text-3xl font-bold text-green-700">
              {healthData?.summary.byRisk.low || 0}
            </div>
          </div>
        </div>

        {/* At Risk Alert */}
        {healthData && healthData.summary.atRisk > 0 && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <span className="font-medium text-red-800">
                    {healthData.summary.atRisk} institution(s) require immediate attention
                  </span>
                  <p className="text-sm text-red-600 mt-1">
                    These institutions have health scores below 40 and may be at risk of churn or non-compliance.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFilter('critical')}
                className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
              >
                View At-Risk
              </button>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex gap-2">
              {(['all', 'critical', 'high', 'medium', 'low'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === f
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              Average Score: <span className={`font-bold ${getScoreColor(healthData?.summary.avgScore || 0)}`}>
                {healthData?.summary.avgScore || 0}
              </span>
            </div>
          </div>

          {/* Institution List */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Institution
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Health Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {healthData?.data.map((institution) => {
                  const badge = getRiskBadge(institution.riskLevel)
                  return (
                    <tr
                      key={institution.tenantId}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedInstitution?.tenantId === institution.tenantId ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedInstitution(institution)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{institution.institutionName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {institution.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full">
                            <div
                              className={`h-2 rounded-full ${getScoreProgressColor(institution.overallScore)}`}
                              style={{ width: `${institution.overallScore}%` }}
                            />
                          </div>
                          <span className={`text-sm font-bold ${getScoreColor(institution.overallScore)}`}>
                            {institution.overallScore}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${
                          institution.verificationStatus === 'verified' ? 'text-green-600' :
                          institution.verificationStatus === 'expired' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {institution.verificationStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${
                          institution.paymentStatus === 'current' ? 'text-green-600' :
                          institution.paymentStatus === 'overdue' ? 'text-orange-600' :
                          'text-red-600'
                        }`}>
                          {institution.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(institution.lastActivity)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOutreach(institution.tenantId)
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Contact
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {healthData?.data.length === 0 && (
            <div className="p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2 text-gray-500">No institutions match the selected filter</p>
            </div>
          )}
        </div>

        {/* Institution Detail Panel */}
        {selectedInstitution && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">{selectedInstitution.institutionName}</h2>
                <button
                  onClick={() => setSelectedInstitution(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Health Score */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-gray-200">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getScoreColor(selectedInstitution.overallScore)}`}>
                        {selectedInstitution.overallScore}
                      </div>
                      <div className="text-sm text-gray-500">Health Score</div>
                    </div>
                  </div>
                </div>

                {/* Health Factors */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Health Factors</h3>
                  <div className="space-y-3">
                    {selectedInstitution.factors.map((factor, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{factor.name}</span>
                          <span className={`text-sm font-bold ${getScoreColor(factor.score)}`}>
                            {factor.score}/100
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-2 rounded-full ${getScoreProgressColor(factor.score)}`}
                            style={{ width: `${factor.score}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{factor.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Verification Status</div>
                    <div className="text-sm font-medium text-gray-900">{selectedInstitution.verificationStatus}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Payment Status</div>
                    <div className="text-sm font-medium text-gray-900">{selectedInstitution.paymentStatus}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Support Tickets</div>
                    <div className="text-sm font-medium text-gray-900">{selectedInstitution.supportTicketCount} open</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Tier</div>
                    <div className="text-sm font-medium text-gray-900">{selectedInstitution.tier}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleOutreach(selectedInstitution.tenantId)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
                  >
                    Initiate Outreach
                  </button>
                  <button
                    onClick={() => setSelectedInstitution(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
