'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface FeatureAccess {
  status: 'ACTIVE' | 'GRACE_PERIOD' | 'RESTRICTED'
  daysRemaining: number
  deadline: string | null
  accessLevel: string
  warnings: string[]
}

export default function FeatureRestrictionBanner() {
  const router = useRouter()
  const [featureAccess, setFeatureAccess] = useState<FeatureAccess | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeatureAccess()
  }, [])

  const fetchFeatureAccess = async () => {
    try {
      const response = await fetch('/api/tenant/feature-access')
      const data = await response.json()
      if (data.success) {
        setFeatureAccess(data.access)
      }
    } catch (error) {
      console.error('Error fetching feature access:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return null

  if (!featureAccess) return null

  // Only show if there's a restriction or warning
  if (featureAccess.status === 'ACTIVE') return null

  const isRestricted = featureAccess.status === 'RESTRICTED'
  const isGracePeriod = featureAccess.status === 'GRACE_PERIOD'

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 ${isRestricted ? 'bg-red-600' : 'bg-yellow-500'}`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg
              className={`w-6 h-6 mr-3 ${isRestricted ? 'text-white' : 'text-white'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isRestricted 
                  ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                }
              />
            </svg>
            <div>
              {isRestricted ? (
                <p className="text-white font-medium">
                  Your verification deadline has passed. Platform features are now restricted until you complete verification.
                </p>
              ) : (
                <p className="text-white font-medium">
                  Your verification deadline is approaching in {featureAccess.daysRemaining} days. Complete verification to maintain full access.
                </p>
              )}
              {featureAccess.warnings.map((warning, index) => (
                <p key={index} className="text-white text-sm mt-1 opacity-90">
                  {warning}
                </p>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/dashboard/tenant/verification')}
              className={`px-4 py-2 rounded-md font-medium text-sm ${
                isRestricted
                  ? 'bg-white text-red-600 hover:bg-red-50'
                  : 'bg-white text-yellow-600 hover:bg-yellow-50'
              }`}
            >
              {isRestricted ? 'Complete Verification Now' : 'Continue Verification'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
