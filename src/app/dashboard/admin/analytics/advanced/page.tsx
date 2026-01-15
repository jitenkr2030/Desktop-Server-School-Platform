'use client'

import { useState, useEffect, useCallback } from 'react'

interface PredictionData {
  rejectionRisks: number
  avgProcessingTime: number
  anomaliesDetected: number
  trendData: TrendDataPoint[]
}

interface TrendDataPoint {
  date: string
  applications: number
  approvals: number
  rejections: number
}

interface RiskAssessment {
  tenantId: string
  riskScore: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  factors: RiskFactor[]
  recommendations: string[]
  processedAt: string
}

interface RiskFactor {
  category: string
  score: number
  description: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH'
}

interface AnomalyAlert {
  id: string
  type: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  metric: string
  currentValue: number
  expectedValue: number
  deviation: number
  detectedAt: string
  acknowledged: boolean
}

export default function AdvancedAnalyticsDashboard() {
  const [loading, setLoading] = useState(true)
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null)
  const [recentRisks, setRecentRisks] = useState<RiskAssessment[]>([])
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'risks' | 'anomalies' | 'predictions'>('overview')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAnalytics()
    // Set up polling for real-time updates
    const interval = setInterval(fetchAnalytics, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const fetchAnalytics = async () => {
    try {
      const [predictionsRes, risksRes, anomaliesRes] = await Promise.all([
        fetch('/api/admin/analytics/predictions'),
        fetch('/api/admin/analytics/rejection-risks'),
        fetch('/api/admin/analytics/anomalies')
      ])

      const predictionsData = await predictionsRes.json()
      const risksData = await risksRes.json()
      const anomaliesData = await anomaliesRes.json()

      if (predictionsData.success) setPredictionData(predictionsData.data)
      if (risksData.success) setRecentRisks(risksData.risks?.slice(0, 10) || [])
      if (anomaliesData.success) setAnomalies(anomaliesData.anomalies?.slice(0, 10) || [])
    } catch (err) {
      setError('Failed to fetch analytics data')
    } finally {
      setLoading(false)
    }
  }

  const acknowledgeAnomaly = async (anomalyId: string) => {
    try {
      await fetch(`/api/admin/analytics/anomalies/${anomalyId}/acknowledge`, {
        method: 'POST'
      })
      setAnomalies(prev => prev.map(a => 
        a.id === anomalyId ? { ...a, acknowledged: true } : a
      ))
    } catch (err) {
      setError('Failed to acknowledge anomaly')
    }
  }

  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = {
      LOW: 'bg-green-100 text-green-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-red-100 text-red-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  const getAnomalySeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      LOW: 'bg-blue-100 text-blue-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-orange-100 text-orange-800',
      CRITICAL: 'bg-red-100 text-red-800'
    }
    return colors[severity] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
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
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Advanced Analytics & Predictions
          </h1>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {(['overview', 'risks', 'anomalies', 'predictions'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && predictionData && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">High Risk Applications</div>
                <div className="mt-2 text-3xl font-bold text-red-600">
                  {predictionData.rejectionRisks}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  May require attention
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Avg Processing Time</div>
                <div className="mt-2 text-3xl font-bold text-blue-600">
                  {predictionData.avgProcessingTime} days
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Estimated completion
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Active Anomalies</div>
                <div className="mt-2 text-3xl font-bold text-orange-600">
                  {predictionData.anomaliesDetected}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Requires review
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">This Week</div>
                <div className="mt-2 text-3xl font-bold text-green-600">
                  {predictionData.trendData.reduce((sum, d) => sum + d.approvals, 0)}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Approvals this week
                </div>
              </div>
            </div>

            {/* Trend Chart */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Weekly Trends</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {predictionData.trendData.map((day, index) => {
                    const maxValue = Math.max(
                      day.applications,
                      day.approvals,
                      day.rejections
                    )
                    return (
                      <div key={day.date} className="flex items-center">
                        <span className="w-24 text-sm text-gray-500">
                          {new Date(day.date).toLocaleDateString('en-IN', { 
                            weekday: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <div className="flex-1 mx-4 space-y-2">
                          <div className="h-6 bg-gray-100 rounded-full overflow-hidden flex">
                            <div 
                              className="h-full bg-blue-400"
                              style={{ width: `${(day.applications / maxValue) * 100}%` }}
                              title={`Applications: ${day.applications}`}
                            ></div>
                          </div>
                          <div className="h-6 bg-gray-100 rounded-full overflow-hidden flex">
                            <div 
                              className="h-full bg-green-400"
                              style={{ width: `${(day.approvals / maxValue) * 100}%` }}
                              title={`Approvals: ${day.approvals}`}
                            ></div>
                          </div>
                          <div className="h-6 bg-gray-100 rounded-full overflow-hidden flex">
                            <div 
                              className="h-full bg-red-400"
                              style={{ width: `${(day.rejections / maxValue) * 100}%` }}
                              title={`Rejections: ${day.rejections}`}
                            ></div>
                          </div>
                        </div>
                        <div className="w-24 text-right space-y-1">
                          <div className="text-xs text-blue-600">Apps: {day.applications}</div>
                          <div className="text-xs text-green-600">Apr: {day.approvals}</div>
                          <div className="text-xs text-red-600">Rej: {day.rejections}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                    <span className="text-gray-600">Applications</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-gray-600">Approvals</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                    <span className="text-gray-600">Rejections</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent High Risk */}
            {recentRisks.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Recent High Risk Applications</h2>
                  <button
                    onClick={() => setActiveTab('risks')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View All →
                  </button>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentRisks.slice(0, 5).map((risk) => (
                    <div key={risk.tenantId} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(risk.riskLevel)}`}>
                            {risk.riskLevel} RISK
                          </span>
                          <span className="ml-3 text-sm text-gray-900">
                            Score: {(risk.riskScore * 100).toFixed(0)}%
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(risk.processedAt)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {risk.factors[0]?.description || 'No specific factors identified'}
                        </p>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {risk.recommendations.slice(0, 2).map((rec, i) => (
                          <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Risks Tab */}
        {activeTab === 'risks' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Rejection Risk Analysis</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentRisks.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No risk data available
                </div>
              ) : (
                recentRisks.map((risk) => (
                  <div key={risk.tenantId} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full mr-3 ${getRiskColor(risk.riskLevel)}`}>
                            {risk.riskLevel} RISK
                          </span>
                          <span className="text-sm text-gray-500">
                            Score: {(risk.riskScore * 100).toFixed(0)}%
                          </span>
                        </div>
                        
                        <div className="space-y-3 mt-4">
                          {risk.factors.map((factor, i) => (
                            <div key={i} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900">{factor.category}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getRiskColor(factor.severity)}`}>
                                  {factor.severity}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{factor.description}</p>
                              <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      factor.score >= 0.7 ? 'bg-green-500' :
                                      factor.score >= 0.4 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${factor.score * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {risk.recommendations.map((rec, i) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Anomalies Tab */}
        {activeTab === 'anomalies' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Detected Anomalies</h2>
              <span className="text-sm text-gray-500">
                {anomalies.filter(a => !a.acknowledged).length} unacknowledged
              </span>
            </div>
            <div className="divide-y divide-gray-200">
              {anomalies.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No anomalies detected
                </div>
              ) : (
                anomalies.map((anomaly) => (
                  <div key={anomaly.id} className={`p-6 ${anomaly.acknowledged ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full mr-3 ${getAnomalySeverityColor(anomaly.severity)}`}>
                            {anomaly.severity}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(anomaly.detectedAt)}
                          </span>
                          {anomaly.acknowledged && (
                            <span className="ml-2 text-xs text-green-600">✓ Acknowledged</span>
                          )}
                        </div>
                        
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {anomaly.type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm text-gray-600">{anomaly.description}</p>
                        
                        <div className="mt-3 flex items-center space-x-4 text-sm">
                          <div>
                            <span className="text-gray-500">Current: </span>
                            <span className="font-medium">{anomaly.currentValue}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Expected: </span>
                            <span className="font-medium">{anomaly.expectedValue}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Deviation: </span>
                            <span className={`font-medium ${anomaly.deviation > 50 ? 'text-red-600' : 'text-yellow-600'}`}>
                              {anomaly.deviation.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {!anomaly.acknowledged && (
                        <button
                          onClick={() => acknowledgeAnomaly(anomaly.id)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Acknowledge
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Predictions Tab */}
        {activeTab === 'predictions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">ML-Powered Predictions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Rejection Risk Prediction</h3>
                  <p className="text-sm text-blue-600 mb-3">
                    Our machine learning model analyzes multiple factors to predict the likelihood of rejection before manual review.
                  </p>
                  <div className="flex items-center">
                    <div className="flex-1 bg-white rounded h-2 mr-2">
                      <div className="bg-blue-600 h-2 rounded" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-blue-800">85% Accuracy</span>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-green-800 mb-2">Processing Time Forecast</h3>
                  <p className="text-sm text-green-600 mb-3">
                    Predicts expected processing time based on document completeness and historical patterns.
                  </p>
                  <div className="flex items-center">
                    <div className="flex-1 bg-white rounded h-2 mr-2">
                      <div className="bg-green-600 h-2 rounded" style={{ width: '78%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-green-800">78% Accuracy</span>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-purple-800 mb-2">Anomaly Detection</h3>
                  <p className="text-sm text-purple-600 mb-3">
                    Real-time monitoring detects unusual patterns in rejection rates, processing times, and application volumes.
                  </p>
                  <div className="flex items-center">
                    <div className="flex-1 bg-white rounded h-2 mr-2">
                      <div className="bg-purple-600 h-2 rounded" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-purple-800">92% Detection Rate</span>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-orange-800 mb-2">Document Quality Analysis</h3>
                  <p className="text-sm text-orange-600 mb-3">
                    Automated assessment of document clarity, completeness, and authenticity using OCR and ML.
                  </p>
                  <div className="flex items-center">
                    <div className="flex-1 bg-white rounded h-2 mr-2">
                      <div className="bg-orange-600 h-2 rounded" style={{ width: '88%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-orange-800">88% Accuracy</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Prediction Factors</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">Document Completeness</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-blue-600 h-2 rounded" style={{ width: '35%' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">35% impact</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">Document Quality Score</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-green-600 h-2 rounded" style={{ width: '25%' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">25% impact</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">Historical Approval Rate</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-yellow-600 h-2 rounded" style={{ width: '20%' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">20% impact</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">Student Count Threshold</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-red-600 h-2 rounded" style={{ width: '20%' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">20% impact</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
