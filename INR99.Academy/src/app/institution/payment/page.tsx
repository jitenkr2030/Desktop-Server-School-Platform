'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function InstitutionPaymentPage() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const tenantId = searchParams.get('tenant_id')
  const orderId = searchParams.get('order_id')

  const [paymentDetails, setPaymentDetails] = useState({
    name: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    // Check for success in URL
    if (searchParams.get('success') === 'true') {
      setSuccess(true)
    }
  }, [searchParams])

  const handleCreatePayment = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/tenants/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          institutionName: paymentDetails.name,
          email: paymentDetails.email,
          phone: paymentDetails.phone,
          subdomain: paymentDetails.name.toLowerCase().replace(/\s+/g, '-'),
          adminName: paymentDetails.name,
          adminPassword: 'temppassword123',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account')
      }

      // Create payment order
      const paymentResponse = await fetch('/institution/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId: data.tenant.id,
          amount: 99,
          customerId: data.user.id,
          customerEmail: data.user.email,
          customerPhone: paymentDetails.phone,
        }),
      })

      const paymentData = await paymentResponse.json()

      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || 'Failed to create payment')
      }

      // In production, this would redirect to Cashfree checkout
      // For now, simulate successful payment
      setProcessing(true)

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Verify payment
      const verifyResponse = await fetch('/institution/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: paymentData.order_id,
          paymentId: `pay_${Date.now()}`,
          orderAmount: 99,
        }),
      })

      const verifyData = await verifyResponse.json()

      if (verifyData.verified) {
        setSuccess(true)
      } else {
        throw new Error('Payment verification failed')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      setProcessing(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your institution is now active. You can now access your admin dashboard and start customizing your platform.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700">
              <strong>Next steps:</strong>
            </p>
            <ul className="text-sm text-blue-600 mt-2 text-left list-disc list-inside">
              <li>Customize your branding (logo, colors)</li>
              <li>Invite teachers and students</li>
              <li>Explore available courses</li>
            </ul>
          </div>
          <div className="space-y-3">
            <a
              href="/institution/admin"
              className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Go to Admin Dashboard
            </a>
            <a
              href="#"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              View Your Platform
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gray-900">INR99 Academy</h1>
          </Link>
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">
            Complete Your Subscription
          </h2>
          <p className="mt-2 text-gray-600">
            Get your branded learning platform for just ₹99/month
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="flex items-center justify-between py-4 border-b">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Professional Plan</p>
                <p className="text-sm text-gray-500">Monthly subscription</p>
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">₹99</p>
          </div>
          <div className="flex items-center justify-between py-4">
            <p className="text-gray-600">Subtotal</p>
            <p className="font-medium text-gray-900">₹99</p>
          </div>
          <div className="flex items-center justify-between py-4 border-t">
            <p className="text-lg font-semibold text-gray-900">Total</p>
            <p className="text-lg font-bold text-gray-900">₹99</p>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Billing Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution Name
              </label>
              <input
                type="text"
                value={paymentDetails.name}
                onChange={(e) =>
                  setPaymentDetails((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your Institution Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={paymentDetails.email}
                onChange={(e) =>
                  setPaymentDetails((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@institution.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={paymentDetails.phone}
                onChange={(e) =>
                  setPaymentDetails((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Method
          </h3>

          <div className="space-y-3">
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                defaultChecked
                className="w-4 h-4 text-blue-600"
              />
              <div className="ml-3 flex items-center flex-1">
                <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">UPI</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">UPI</p>
                  <p className="text-sm text-gray-500">Pay using any UPI app</p>
                </div>
              </div>
            </label>

            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                className="w-4 h-4 text-blue-600"
              />
              <div className="ml-3 flex items-center flex-1">
                <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">CARDS</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Credit/Debit Card</p>
                  <p className="text-sm text-gray-500">Visa, Mastercard, RuPay</p>
                </div>
              </div>
            </label>

            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                className="w-4 h-4 text-blue-600"
              />
              <div className="ml-3 flex items-center flex-1">
                <div className="w-10 h-6 bg-green-600 rounded flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">NET</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Net Banking</p>
                  <p className="text-sm text-gray-500">All major banks supported</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handleCreatePayment}
          disabled={loading || !paymentDetails.name || !paymentDetails.email}
          className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </>
          ) : processing ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Completing Payment...
            </>
          ) : (
            <>Pay ₹99</>
          )}
        </button>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Secured by Cashfree • 256-bit SSL encryption</span>
          </div>
        </div>

        {/* Terms */}
        <p className="mt-4 text-center text-sm text-gray-500">
          By completing this payment, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}

function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}
