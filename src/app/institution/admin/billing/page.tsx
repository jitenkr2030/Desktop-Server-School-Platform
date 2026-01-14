'use client'

import { useState } from 'react'

// Mock data for demonstration
const mockSubscription = {
  plan: 'Professional',
  price: 99,
  billingCycle: 'Monthly',
  status: 'active',
  startDate: '2026-01-14',
  nextBillingDate: '2026-02-14',
  paymentMethod: {
    type: 'UPI',
    last4: '1234',
    expiry: '12/26',
  },
}

const mockPaymentHistory = [
  {
    id: 'pay_1',
    date: '2026-01-14',
    amount: 99,
    status: 'completed',
    invoice: 'INV-2026-0001',
  },
  {
    id: 'pay_2',
    date: '2025-12-14',
    amount: 99,
    status: 'completed',
    invoice: 'INV-2025-0012',
  },
  {
    id: 'pay_3',
    date: '2025-11-14',
    amount: 99,
    status: 'completed',
    invoice: 'INV-2025-0011',
  },
  {
    id: 'pay_4',
    date: '2025-10-14',
    amount: 99,
    status: 'completed',
    invoice: 'INV-2025-0010',
  },
]

export default function InstitutionBillingPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleUpdatePayment = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setLoading(false)
    setShowPaymentModal(false)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-600">Manage your subscription and payment details</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Current Plan</p>
              <h2 className="text-2xl font-bold mt-1">{mockSubscription.plan}</h2>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">₹{mockSubscription.price}</p>
              <p className="text-blue-100">/{mockSubscription.billingCycle}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <div className="flex items-center mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span className="font-medium text-gray-900 capitalize">{mockSubscription.status}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Period</p>
              <p className="font-medium text-gray-900 mt-1">
                {formatDate(mockSubscription.startDate)} - {formatDate(mockSubscription.nextBillingDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Next Billing Date</p>
              <p className="font-medium text-gray-900 mt-1">{formatDate(mockSubscription.nextBillingDate)}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-medium text-gray-900 mb-4">Plan Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Custom branded portal',
                'Up to 100 users',
                'Access to all INR99 courses',
                'Teacher & student management',
                'Class management',
                'Analytics & reports',
                'Email support',
                'Custom domain support',
              ].map((feature, index) => (
                <div key={index} className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
              Change Plan
            </button>
            <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50">
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            Update
          </button>
        </div>

        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
          <div className="w-12 h-8 bg-white border rounded flex items-center justify-center mr-4">
            <span className="text-xs font-bold text-gray-700">UPI</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">UPI •••• {mockSubscription.paymentMethod.last4}</p>
            <p className="text-sm text-gray-500">Expires {mockSubscription.paymentMethod.expiry}</p>
          </div>
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
            Default
          </span>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockPaymentHistory.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(payment.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 capitalize">
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {payment.invoice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Billing Contact */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="admin@institution.edu"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue="+91 9876543210"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
            Update Contact
          </button>
        </div>
      </div>

      {/* Billing FAQ */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing FAQ</h2>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-medium text-gray-900">When will I be charged?</h3>
            <p className="text-sm text-gray-600 mt-1">
              You will be charged on the same date each month. If your payment fails, we'll retry 3 times before suspending your account.
            </p>
          </div>
          <div className="border-b pb-4">
            <h3 className="font-medium text-gray-900">Can I cancel my subscription?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Yes, you can cancel anytime. Your access will continue until the end of the current billing period.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Do you offer refunds?</h3>
            <p className="text-sm text-gray-600 mt-1">
              We offer a 7-day money-back guarantee. Contact support for refund requests within 7 days of payment.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Update Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Update Payment Method</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UPI ID
                </label>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> After updating your payment method, we'll charge ₹1 to verify it's valid. This will be refunded within 24 hours.
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePayment}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Update Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
