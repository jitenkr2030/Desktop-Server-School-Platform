'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface IntegrationHealth {
  name: string
  displayName: string
  status: 'healthy' | 'degraded' | 'down' | 'unknown'
  latency: number
  uptime: number
  lastChecked: string
  message?: string
}

interface HealthSummary {
  overallStatus: string
  total: number
  healthy: number
  degraded: number
  down: number
  avgLatency: number
  avgUptime: number
}

export default function AdminIntegrationsPage() {
  const router = useRouter()
  const [healthData, setHealthData] = useState<{
    integrations: IntegrationHealth[]
    summary: HealthSummary
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    fetchHealthData()
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchHealthData, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchHealthData = async () => {
    try {
      const response = await fetch('/api/health/integrations')
      const data = await response.json()

      if (data.success) {
        setHealthData(data.data)
        setLastUpdated(new Date())
      } else {
        setError(data.error || 'Failed to fetch health data')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const response = await fetch('/api/health/integrations', { method: 'POST' })
      const data = await response.json()
      
      if (data.success) {
        setHealthData(data.data)
        setLastUpdated(new Date())
      }
    } catch (err) {
      setError('Failed to refresh health data')
    } finally {
      setRefreshing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200'
      case 'degraded': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'down': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return (
        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
      case 'degraded': return (
        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
      case 'down': return (
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
      default: return (
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  }

  const formatLatency = (ms: number) => {
    if (ms === 0) return '-'
    return `${ms}ms`
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
            Integration Health Dashboard
          </h1>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => router.push('/dashboard/admin')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`rounded-lg shadow p-6 border ${
            healthData?.summary.overallStatus === 'healthy' ? 'bg-green-50 border-green-200' :
            healthData?.summary.overallStatus === 'degraded' ? 'bg-yellow-50 border-yellow-200' :
            'bg-red-50 border-red-200'
          }`}>
            <div className="text-sm font-medium text-gray-600">Overall Status</div>
            <div className="mt-2 flex items-center gap-2">
              {healthData && getStatusIcon(healthData.summary.overallStatus)}
              <span className={`text-2xl font-bold capitalize ${
                healthData?.summary.overallStatus === 'healthy' ? 'text-green-700' :
                healthData?.summary.overallStatus === 'degraded' ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {healthData?.summary.overallStatus || 'Unknown'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Healthy Services</div>
            <div className="mt-2 text-3xl font-bold text-green-600">
              {healthData?.summary.healthy || 0}
            </div>
            <div className="text-sm text-gray-500">of {healthData?.summary.total || 0} total</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Average Latency</div>
            <div className="mt-2 text-3xl font-bold text-blue-600">
              {healthData?.summary.avgLatency ? `${healthData.summary.avgLatency}ms` : '-'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Average Uptime</div>
            <div className="mt-2 text-3xl font-bold text-green-600">
              {healthData?.summary.avgUptime ? `${healthData.summary.avgUptime}%` : '-'}
            </div>
          </div>
        </div>

        {/* Issues Alert */}
        {(healthData?.summary.degraded || 0) > 0 || (healthData?.summary.down || 0) > 0 ? (
          <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium text-orange-800">
                {((healthData?.summary.degraded || 0) > 0) && ((healthData?.summary.down || 0) > 0)
                  ? `${healthData?.summary.degraded} degraded and ${healthData?.summary.down} down`
                  : (healthData?.summary.degraded || 0) > 0
                    ? `${healthData?.summary.degraded} service(s) degraded`
                    : `${healthData?.summary.down} service(s) down`
                }
              </span>
            </div>
          </div>
        ) : null}

        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {healthData?.integrations.map((integration) => (
            <div
              key={integration.name}
              className={`bg-white rounded-lg shadow border ${getStatusColor(integration.status)}`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(integration.status)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{integration.displayName}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                        integration.status === 'healthy' ? 'bg-green-100 text-green-800' :
                        integration.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {integration.status}
                      </span>
                    </div>
                  </div>
                </div>

                {integration.message && (
                  <div className="mt-3 p-2 bg-yellow-50 rounded text-sm text-yellow-800">
                    {integration.message}
                  </div>
                )}

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Latency</div>
                    <div className="font-medium">{formatLatency(integration.latency)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Uptime</div>
                    <div className="font-medium">{integration.uptime}%</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Last checked: {new Date(integration.lastChecked).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
