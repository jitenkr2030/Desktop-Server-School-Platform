'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { NewNavigation } from '@/components/new-navigation'
import { Check, Star, Zap, Crown, CreditCard, Loader2 } from 'lucide-react'

interface InstructorPlan {
  id: string
  name: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  limits: {
    maxCourses: number
    maxLiveSessions: number
    maxStorageGB: number
    hasAnalytics: boolean
    hasCustomBranding: boolean
    hasPrioritySupport: boolean
  }
}

export default function InstructorPricingPage() {
  const [mounted, setMounted] = useState(false)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(false)
  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  const [processingPlan, setProcessingPlan] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    fetchSubscriptionStatus()
  }, [])

  const fetchSubscriptionStatus = async () => {
    try {
      // In production, get userId from session
      const response = await fetch('/api/instructor/subscription/status?userId=instructor1')
      const data = await response.json()
      if (data.success) {
        setSubscriptionData(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch subscription status:', error)
    }
  }

  const plans: InstructorPlan[] = [
    {
      id: 'FREE',
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        'Create up to 1 course',
        'No live sessions',
        'Basic analytics dashboard',
        'Standard support',
        'Community access'
      ],
      limits: {
        maxCourses: 1,
        maxLiveSessions: 0,
        maxStorageGB: 1,
        hasAnalytics: true,
        hasCustomBranding: false,
        hasPrioritySupport: false
      }
    },
    {
      id: 'BASIC',
      name: 'Basic',
      monthlyPrice: 499,
      yearlyPrice: 4999,
      features: [
        'Create up to 5 courses',
        '5 live sessions/month',
        '10GB storage',
        'Advanced analytics',
        'Student management',
        'Email support'
      ],
      limits: {
        maxCourses: 5,
        maxLiveSessions: 5,
        maxStorageGB: 10,
        hasAnalytics: true,
        hasCustomBranding: false,
        hasPrioritySupport: false
      }
    },
    {
      id: 'PRO',
      name: 'Pro',
      monthlyPrice: 1499,
      yearlyPrice: 14999,
      features: [
        'Unlimited courses',
        'Unlimited live sessions',
        '100GB storage',
        'Advanced analytics',
        'Custom branding',
        'Priority support',
        'API access',
        'White-label options'
      ],
      limits: {
        maxCourses: -1,
        maxLiveSessions: -1,
        maxStorageGB: 100,
        hasAnalytics: true,
        hasCustomBranding: true,
        hasPrioritySupport: true
      }
    }
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'FREE') return

    setProcessingPlan(planId)
    try {
      const response = await fetch('/api/instructor/subscription/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'instructor1', // In production, get from session
          planId,
          billingCycle
        })
      })

      const data = await response.json()
      if (data.success) {
        // In production, redirect to Razorpay checkout
        // For demo, simulate successful activation
        alert(`Plan selected: ${planId}. In production, this would redirect to payment gateway.`)
      }
    } catch (error) {
      console.error('Failed to create order:', error)
    } finally {
      setProcessingPlan(null)
    }
  }

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <div style={{ paddingTop: '64px' }}></div>
      </div>
    )
  }

  const currentPlanId = subscriptionData?.currentPlan?.id || 'FREE'

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NewNavigation />

      <div style={{ minHeight: '100vh', background: '#f9fafb', paddingTop: '64px' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #4f46e5 50%, #7c3aed 100%)',
          color: 'white',
          padding: '4rem 1rem'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255,255,255,0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem'
              }}>
                <Crown size={16} />
                For Instructors & Content Creators
              </span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Choose Your Teaching Plan
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
              Start free and upgrade as you grow. Create courses, host live sessions, and build your teaching business.
            </p>

            {/* Usage Stats */}
            {subscriptionData?.usage && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                marginTop: '2rem',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  background: 'rgba(255,255,255,0.15)',
                  padding: '1rem 1.5rem',
                  borderRadius: '0.75rem'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {subscriptionData.usage.courseCount}
                  </div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Courses Created</div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.15)',
                  padding: '1rem 1.5rem',
                  borderRadius: '0.75rem'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {subscriptionData.usage.liveSessionCount}
                  </div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Live Sessions</div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.15)',
                  padding: '1rem 1.5rem',
                  borderRadius: '0.75rem'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {subscriptionData.usage.totalStudents}
                  </div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Total Students</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Billing Toggle */}
        <div style={{ maxWidth: '1200px', margin: '-1.5rem auto 2rem', padding: '0 1rem' }}>
          <div style={{
            display: 'inline-flex',
            background: 'white',
            borderRadius: '9999px',
            padding: '0.25rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer',
                background: billingCycle === 'monthly' ? '#4f46e5' : 'transparent',
                color: billingCycle === 'monthly' ? 'white' : '#6b7280',
                transition: 'all 0.2s'
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer',
                background: billingCycle === 'yearly' ? '#4f46e5' : 'transparent',
                color: billingCycle === 'yearly' ? 'white' : '#6b7280',
                transition: 'all 0.2s'
              }}
            >
              Yearly
              <span style={{
                marginLeft: '0.5rem',
                fontSize: '0.75rem',
                background: '#16a34a',
                color: 'white',
                padding: '0.125rem 0.5rem',
                borderRadius: '9999px'
              }}>
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem 4rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {plans.map((plan) => {
              const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
              const isCurrentPlan = currentPlanId === plan.id
              const isPopular = plan.id === 'BASIC'

              return (
                <div
                  key={plan.id}
                  style={{
                    background: 'white',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    boxShadow: isPopular
                      ? '0 20px 40px -5px rgba(79, 70, 229, 0.3)'
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: isPopular ? '2px solid #4f46e5' : '1px solid #e5e7eb',
                    position: 'relative',
                    transform: isPopular ? 'scale(1.02)' : 'scale(1)',
                    transition: 'transform 0.2s'
                  }}
                >
                  {isPopular && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: '#4f46e5',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <Star size={12} />
                      Most Popular
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      background: '#16a34a',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      Current Plan
                    </div>
                  )}

                  {/* Plan Header */}
                  <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '4rem',
                      height: '4rem',
                      borderRadius: '1rem',
                      marginBottom: '1rem',
                      background: plan.id === 'FREE' ? '#f3f4f6' :
                        plan.id === 'BASIC' ? '#dbeafe' : '#fef3c7',
                      color: plan.id === 'FREE' ? '#6b7280' :
                        plan.id === 'BASIC' ? '#2563eb' : '#d97706'
                    }}>
                      {plan.id === 'FREE' ? <Zap size={24} /> :
                        plan.id === 'BASIC' ? <Crown size={24} /> : <Star size={24} />}
                    </div>

                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                      {plan.name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.25rem' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
                        {price === 0 ? 'Free' : formatPrice(price)}
                      </span>
                      {price > 0 && (
                        <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          /{billingCycle}
                        </span>
                      )}
                    </div>

                    {billingCycle === 'yearly' && price > 0 && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#16a34a', fontWeight: '500' }}>
                          {formatPrice(price / 12)}/month billed annually
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div style={{ padding: '2rem' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0' }}>
                      {plan.features.map((feature, index) => (
                        <li key={index} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          padding: '0.5rem 0',
                          fontSize: '0.9375rem',
                          color: '#374151'
                        }}>
                          <span style={{
                            color: '#16a34a',
                            flexShrink: 0,
                            marginTop: '0.125rem'
                          }}>
                            <Check size={18} />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Limits */}
                    <div style={{
                      background: '#f9fafb',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      marginBottom: '1.5rem'
                    }}>
                      <h4 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                        Limits
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <div style={{ color: '#374151' }}>
                          Courses: <strong>{plan.limits.maxCourses === -1 ? 'Unlimited' : plan.limits.maxCourses}</strong>
                        </div>
                        <div style={{ color: '#374151' }}>
                          Live Sessions: <strong>{plan.limits.maxLiveSessions === -1 ? 'Unlimited' : plan.limits.maxLiveSessions}/mo</strong>
                        </div>
                        <div style={{ color: '#374151' }}>
                          Storage: <strong>{plan.limits.maxStorageGB}GB</strong>
                        </div>
                        <div style={{ color: '#374151' }}>
                          Branding: <strong>{plan.limits.hasCustomBranding ? 'Custom' : 'Standard'}</strong>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    {isCurrentPlan ? (
                      <button
                        disabled
                        style={{
                          width: '100%',
                          padding: '0.875rem',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'not-allowed',
                          background: '#f3f4f6',
                          color: '#6b7280',
                          border: 'none'
                        }}
                      >
                        Current Plan
                      </button>
                    ) : plan.id === 'FREE' ? (
                      <button
                        onClick={() => handleSelectPlan(plan.id)}
                        style={{
                          width: '100%',
                          padding: '0.875rem',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          background: '#f3f4f6',
                          color: '#374151',
                          border: '1px solid #d1d5db',
                          transition: 'all 0.2s'
                        }}
                      >
                        Downgrade to Free
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSelectPlan(plan.id)}
                        disabled={processingPlan === plan.id}
                        style={{
                          width: '100%',
                          padding: '0.875rem',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: processingPlan === plan.id ? 'not-allowed' : 'pointer',
                          background: isPopular ? '#4f46e5' : '#111827',
                          color: 'white',
                          border: 'none',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          opacity: processingPlan === plan.id ? 0.7 : 1
                        }}
                      >
                        {processingPlan === plan.id ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard size={18} />
                            {subscriptionData?.currentPlan?.id === 'FREE' ? 'Upgrade Now' : 'Switch Plan'}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Feature Comparison */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem 4rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem', textAlign: 'center' }}>
              Compare Plans
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', marginBottom: '2rem' }}>
              See what's included in each plan
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '1rem', color: '#6b7280', fontWeight: '500' }}>Feature</th>
                    <th style={{ textAlign: 'center', padding: '1rem', color: '#111827', fontWeight: '600' }}>Free</th>
                    <th style={{ textAlign: 'center', padding: '1rem', color: '#111827', fontWeight: '600' }}>Basic</th>
                    <th style={{ textAlign: 'center', padding: '1rem', color: '#111827', fontWeight: '600' }}>Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Course Creation', free: '1 course', basic: '5 courses', pro: 'Unlimited' },
                    { feature: 'Live Sessions', free: 'None', basic: '5/month', pro: 'Unlimited' },
                    { feature: 'Storage', free: '1GB', basic: '10GB', pro: '100GB' },
                    { feature: 'Basic Analytics', free: true, basic: true, pro: true },
                    { feature: 'Advanced Analytics', free: false, basic: true, pro: true },
                    { feature: 'Custom Branding', free: false, basic: false, pro: true },
                    { feature: 'Priority Support', free: false, basic: false, pro: true },
                    { feature: 'API Access', free: false, basic: false, pro: true },
                    { feature: 'White-label', free: false, basic: false, pro: true }
                  ].map((row, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.75rem 1rem', color: '#374151', fontSize: '0.875rem' }}>{row.feature}</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#111827', fontSize: '0.875rem' }}>
                        {typeof row.free === 'boolean' ? (
                          row.free ? <Check size={16} className="inline text-green-500" /> : <span style={{ color: '#d1d5db' }}>-</span>
                        ) : row.free}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#111827', fontSize: '0.875rem' }}>
                        {typeof row.basic === 'boolean' ? (
                          row.basic ? <Check size={16} className="inline text-green-500" /> : <span style={{ color: '#d1d5db' }}>-</span>
                        ) : row.basic}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#111827', fontSize: '0.875rem' }}>
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? <Check size={16} className="inline text-green-500" /> : <span style={{ color: '#d1d5db' }}>-</span>
                        ) : row.pro}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem 4rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '2rem', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              {
                q: 'Can I change my plan later?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate the difference.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit/debit cards, UPI, net banking, and wallets through our secure Razorpay payment gateway.'
              },
              {
                q: 'Is there a refund policy?',
                a: 'Yes, we offer a 7-day money-back guarantee. If you\'re not satisfied, contact us within 7 days of purchase for a full refund.'
              },
              {
                q: 'What happens when I reach my limits?',
                a: 'You\'ll receive notifications as you approach your limits. To continue creating content, simply upgrade to a higher plan.'
              }
            ].map((faq, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  {faq.q}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: '#111827',
          color: 'white',
          padding: '4rem 1rem',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Ready to Start Teaching?
          </h2>
          <p style={{ fontSize: '1.125rem', opacity: 0.8, marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Join thousands of instructors who are building their teaching business on INR99 Academy.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/instructor/courses/builder"
              style={{
                padding: '0.875rem 2rem',
                background: '#4f46e5',
                color: 'white',
                borderRadius: '0.5rem',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              Start Creating Courses
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#111827',
        color: '#9ca3af',
        padding: '2rem 1rem',
        textAlign: 'center',
        borderTop: '1px solid #374151'
      }}>
        <p style={{ fontSize: '0.875rem' }}>
          © 2026 INR99 Academy - India's Learning Infrastructure
        </p>
      </footer>
    </div>
  )
}
