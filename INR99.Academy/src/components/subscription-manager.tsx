"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PaymentForm } from "@/components/payment-form"
import { IndianRupee, CheckCircle, X, Calendar, Crown } from "lucide-react"

interface SubscriptionPlan {
  type: 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  name: string
  price: number
  duration: string
  description: string
  features: string[]
  popular?: boolean
  savings?: string
}

interface UserSubscription {
  id: string
  type: 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  status: string
  startDate: string
  endDate: string
  amount: number
  currency: string
  autoRenew: boolean
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    type: 'MONTHLY',
    name: 'Monthly',
    price: 99,
    duration: '1 month',
    description: 'Perfect for trying out the platform',
    features: [
      'Access to all courses',
      'Mobile & desktop access',
      'Progress tracking',
      'Community access',
      'Cancel anytime'
    ]
  },
  {
    type: 'QUARTERLY',
    name: 'Quarterly',
    price: 297,
    duration: '3 months',
    description: 'Great for committed learners',
    features: [
      'Everything in Monthly',
      'Save ₹30',
      'Priority support',
      'Download certificates'
    ]
  },
  {
    type: 'YEARLY',
    name: 'Yearly',
    price: 999,
    duration: '1 year',
    description: 'Best value for committed learners',
    features: [
      'Everything in Quarterly',
      'Save ₹189',
      'Offline access',
      '1-on-1 mentoring'
    ],
    popular: true,
    savings: 'Save ₹189'
  }
]

export function SubscriptionManager() {
  const { data: session, status } = useSession()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && status === 'authenticated' && session?.user) {
      fetchSubscription()
    }
  }, [mounted, status, session])

  const fetchSubscription = async () => {
    if (!session?.user?.email) return

    try {
      const response = await fetch(`/api/subscription?email=${session.user.email}`)
      const data = await response.json()

      if (data.success) {
        setSubscription(data.subscription)
      }
    } catch (error) {
      console.error('Fetch subscription error:', error)
    }
  }

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!session?.user) return

    setSelectedPlan(plan)
    setShowPaymentDialog(true)
  }

  const handlePaymentSuccess = async (paymentId: string) => {
    // After successful payment, create the subscription
    if (!selectedPlan || !session?.user) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.email, // Use email as ID for demo
          type: selectedPlan.type,
          paymentId: paymentId
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Subscription activated successfully!')
        fetchSubscription()
        setShowPaymentDialog(false)
        setSelectedPlan(null)
      } else {
        setError(data.message || 'Failed to create subscription')
      }
    } catch (error) {
      console.error('Subscribe error:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
    setShowPaymentDialog(false)
    setSelectedPlan(null)
  }

  const handleCancelSubscription = async () => {
    if (!subscription) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.id
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Subscription cancelled successfully!')
        fetchSubscription()
        setShowCancelDialog(false)
      } else {
        setError(data.message || 'Failed to cancel subscription')
      }
    } catch (error) {
      console.error('Cancel subscription error:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  if (!mounted || status === 'loading') {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">Login to View Subscription Plans</h3>
        <p className="text-gray-600 mb-6">Please login or signup to view and manage your subscription</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      {subscription && subscription.status === 'ACTIVE' && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-green-600" />
                <CardTitle className="text-green-800">Active Subscription</CardTitle>
              </div>
              <Badge className="bg-green-100 text-green-800">
                {getDaysRemaining(subscription.endDate)} days remaining
              </Badge>
            </div>
            <CardDescription className="text-green-700">
              You have access to all premium features until {formatDate(subscription.endDate)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-green-800">
                  {subscription.type === 'MONTHLY' ? '₹99/month' : 
                   subscription.type === 'QUARTERLY' ? '₹297/quarter' : '₹999/year'} Plan - {subscription.type}
                </p>
                <p className="text-sm text-green-600">
                  Auto-renewal: {subscription.autoRenew ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Cancel Subscription
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Subscription</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel your subscription? You will lose access to all premium features immediately.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                      Keep Subscription
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleCancelSubscription}
                      disabled={loading}
                    >
                      {loading ? 'Cancelling...' : 'Cancel Subscription'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success/Error Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <X className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <Card key={plan.type} className={`relative ${plan.popular ? 'border-orange-200 ring-2 ring-orange-100' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-orange-500 text-white px-3 py-1">
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-2">
                <IndianRupee className="h-6 w-6 text-gray-600" />
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-500">/{plan.duration.split(' ')[0]}</span>
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription className="text-gray-600">
                {plan.description}
              </CardDescription>
              {plan.savings && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {plan.savings}
                </Badge>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                className={`w-full ${plan.popular ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                variant={plan.popular ? 'default' : 'outline'}
                disabled={loading || (subscription && subscription.status === 'ACTIVE')}
                onClick={() => handleSubscribe(plan)}
              >
                {subscription && subscription.status === 'ACTIVE' 
                  ? 'Already Subscribed'
                  : loading 
                    ? 'Processing...' 
                    : plan.popular 
                      ? 'Get Started' 
                      : 'Choose Plan'
                }
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Subscription Info */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Subscription Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">What's Included:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Unlimited access to all courses</li>
              <li>• Mobile-first learning experience</li>
              <li>• Progress tracking and certificates</li>
              <li>• Community access and support</li>
              <li>• New content added regularly</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Flexible Options:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Cancel anytime</li>
              <li>• Switch between plans</li>
              <li>• No hidden fees</li>
              <li>• Secure payment processing</li>
              <li>• 24/7 customer support</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complete Your Subscription</DialogTitle>
            <DialogDescription>
              Choose your preferred payment method to activate your {selectedPlan?.name} subscription
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <PaymentForm
              amount={selectedPlan.price}
              type="SUBSCRIPTION"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}