'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Domain {
  domain: string
  verified: boolean
  verificationMethod: string | null
  verifiedAt: string | null
  createdAt: string
}

export default function TenantDomainPage() {
  const router = useRouter()
  const [domains, setDomains] = useState<Domain[]>([])
  const [newDomain, setNewDomain] = useState('')
  const [activeTab, setActiveTab] = useState<'dns' | 'file' | 'email'>('dns')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchDomains()
  }, [])

  const fetchDomains = async () => {
    try {
      const response = await fetch('/api/tenant/domain/verify')
      const data = await response.json()
      if (data.success) {
        setDomains(data.data || [])
      }
    } catch (err) {
      setError('Failed to fetch domains')
    }
  }

  const handleAddDomain = async () => {
    if (!newDomain.trim()) {
      setError('Please enter a domain')
      return
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/
    if (!domainRegex.test(newDomain)) {
      setError('Invalid domain format (e.g., example.com)')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/tenant/domain/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          domain: newDomain.toLowerCase().trim()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add domain')
      }

      setSuccess('Domain added successfully')
      setNewDomain('')
      fetchDomains()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (domain: string, method: 'dns' | 'file' | 'email') => {
    setVerifying(domain)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/tenant/domain/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          domain,
          verificationMethod: method
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      if (data.data.verified) {
        setSuccess(`${domain} verified successfully via ${method.toUpperCase()}`)
      } else {
        setError(`Verification failed via ${method.toUpperCase()}. Please check your records and try again.`)
      }
      
      fetchDomains()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setVerifying(null)
    }
  }

  const handleRemove = async (domain: string) => {
    if (!confirm(`Are you sure you want to remove ${domain}?`)) return

    try {
      const response = await fetch(`/api/tenant/domain/verify?domain=${encodeURIComponent(domain)}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove domain')
      }

      setSuccess('Domain removed successfully')
      fetchDomains()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const getVerificationInstructions = (method: 'dns' | 'file' | 'email') => {
    const instructions = {
      dns: {
        title: 'DNS TXT Record Verification',
        steps: [
          'Log in to your domain registrar or DNS provider',
          'Add a new TXT record with the name "@" or your domain',
          'Copy the verification token below as the TXT value',
          'Wait up to 24 hours for DNS propagation',
          'Click "Verify DNS" below'
        ],
        icon: '🔤'
      },
      file: {
        title: 'HTML File Verification',
        steps: [
          'Download the verification HTML file',
          'Upload it to the root directory of your domain',
          'Ensure the file is accessible at yourdomain.com/verification.html',
          'Click "Verify File" below'
        ],
        icon: '📄'
      },
      email: {
        title: 'Email Verification',
        steps: [
          'We will send a verification link to admin@yourdomain.com',
          'Check your email and click the verification link',
          'Alternatively, enter the code received in the email',
          'Click "Verify Email" below'
        ],
        icon: '📧'
      }
    }
    return instructions[method]
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Domain Management
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

        {/* Add Domain Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Add Custom Domain</h2>
            <p className="text-sm text-gray-500 mt-1">
              Verify ownership of your institution's domain to enable custom branding
            </p>
          </div>
          <div className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="Enter your domain (e.g., college.edu)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleAddDomain}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Domain'}
              </button>
            </div>
          </div>
        </div>

        {/* Domain List */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Your Domains</h2>
          </div>
          <div className="p-6">
            {domains.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <p className="mt-2 text-gray-500">No domains added yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {domains.map((domain) => (
                  <div key={domain.domain} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${domain.verified ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <span className="font-medium text-gray-900">{domain.domain}</span>
                        {domain.verified && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemove(domain.domain)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    {!domain.verified && (
                      <div className="border-t border-gray-100 pt-4 mt-4">
                        <div className="flex gap-2 mb-4">
                          <button
                            onClick={() => setActiveTab('dns')}
                            className={`px-3 py-1.5 text-sm rounded-md ${
                              activeTab === 'dns' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            DNS
                          </button>
                          <button
                            onClick={() => setActiveTab('file')}
                            className={`px-3 py-1.5 text-sm rounded-md ${
                              activeTab === 'file' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            File
                          </button>
                          <button
                            onClick={() => setActiveTab('email')}
                            className={`px-3 py-1.5 text-sm rounded-md ${
                              activeTab === 'email' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            Email
                          </button>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            {getVerificationInstructions(activeTab).icon} {getVerificationInstructions(activeTab).title}
                          </h4>
                          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1 mb-4">
                            {getVerificationInstructions(activeTab).steps.map((step, index) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ol>

                          <button
                            onClick={() => handleVerify(domain.domain, activeTab)}
                            disabled={verifying === domain.domain}
                            className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:opacity-50"
                          >
                            {verifying === domain.domain ? 'Verifying...' : `Verify via ${activeTab.toUpperCase()}`}
                          </button>
                        </div>
                      </div>
                    )}

                    {domain.verified && domain.verifiedAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        Verified on {new Date(domain.verifiedAt).toLocaleDateString()}
                        {domain.verificationMethod && ` via ${domain.verificationMethod.toUpperCase()}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Why verify your domain?</h3>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Establish institutional identity and trust</li>
            <li>Enable custom branded URLs for your courses</li>
            <li>Access advanced email features with your domain</li>
            <li>Improve email deliverability for communications</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
