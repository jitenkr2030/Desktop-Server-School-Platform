"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NewNavigation } from '@/components/new-navigation'
import { PaymentProcessor } from '@/components/payment-processor'

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  duration: string
  features: string[]
  popular?: boolean
}

export default function SubscriptionPage() {
  const [mounted, setMounted] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>('yearly')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <div style={{ paddingTop: '64px' }}></div>
      </div>
    )
  }

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: 99,
      duration: 'month',
      features: [
        'Everything included - School + College + Career + Business',
        'All 18 learning categories',
        'Mobile & desktop access',
        'Progress tracking',
        'Community access',
        'Priority support',
        'Download certificates'
      ]
    },
    {
      id: 'quarterly',
      name: 'Quarterly Plan',
      price: 249,
      duration: 'quarter',
      features: [
        'Everything in Monthly',
        'Save ₹48 vs monthly',
        'All 18 learning categories',
        'Mobile & desktop access',
        'Progress tracking',
        'Community access',
        'Priority support',
        'Download certificates'
      ]
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      price: 999,
      duration: 'year',
      features: [
        'Everything in Quarterly',
        'Save ₹252 vs quarterly',
        'Offline access',
        '1-on-1 mentoring',
        'Exclusive workshops',
        'Priority customer support'
      ],
      popular: true
    }
  ]

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId)
    setShowPayment(true)
  }

  const handlePaymentSuccess = () => {
    alert('Subscription Activated! Welcome to INR99.Academy!')
    setShowPayment(false)
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 2000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  if (showPayment) {
    return (
      <div style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <NewNavigation />
        <div style={{ minHeight: '100vh', background: '#f9fafb', paddingTop: '64px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
            <PaymentProcessor 
              defaultAmount={subscriptionPlans.find(p => p.id === selectedPlan)?.price || 99}
              planType={selectedPlan}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setShowPayment(false)}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NewNavigation />

      <div style={{ minHeight: '100vh', background: '#f9fafb', paddingTop: '64px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', padding: '4rem 0 3rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{
                display: 'inline-block',
                background: '#fef3c7',
                borderRadius: '9999px',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                color: '#92400e',
                fontWeight: '600'
              }}>
                🚀 India's Learning Utility - Just ₹999/year
              </span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
              One Subscription = 
              <span style={{ color: '#ea580c', display: 'block' }}>Everything</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '700px', margin: '0 auto 1.5rem' }}>
              Access School Learning (Class 1-12) + College Foundation + Career Skills + Money & Business. 
              All 18 learning categories included. No per-course pricing, no hidden fees.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {[
                { icon: '✅', text: 'No per-course pricing' },
                { icon: '✅', text: 'Cancel anytime' },
                { icon: '✅', text: 'Family sharing' }
              ].map((item, index) => (
                <span key={index} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: index === 0 ? '#dcfce7' : index === 1 ? '#dbeafe' : '#f3e8ff',
                  color: index === 0 ? '#16a34a' : index === 1 ? '#2563eb' : '#9333ea',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  {item.icon} {item.text}
                </span>
              ))}
            </div>
          </div>

          {/* Notice - Quarterly & Yearly Available */}
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'center',
            border: '1px solid #f59e0b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🎯</span>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#92400e' }}>
                Available Plans - Monthly, Quarterly & Yearly
              </h3>
            </div>
            <p style={{ color: '#a16207', fontSize: '0.95rem' }}>
              Choose <strong>₹99/month</strong>, <strong>₹249/quarter</strong>, or <strong>₹999/year</strong> for complete access to all 18 learning categories! 
              Best value - Save ₹252 with yearly plan.
            </p>
          </div>

          {/* Subscription Plans */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                style={{
                  background: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  border: plan.popular ? '2px solid #ea580c' : '1px solid #e5e7eb',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: '#ea580c',
                    color: 'white',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    ⭐ Most Popular
                  </div>
                )}
                
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                    {plan.name}
                  </h3>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                      <span style={{ fontSize: '1.5rem', color: '#ea580c', fontWeight: 'bold' }}>₹</span>
                      <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#111827' }}>
                        {plan.price}
                      </span>
                      <span style={{ color: '#6b7280', fontSize: '1rem' }}>/{plan.duration}</span>
                    </div>
                    {plan.id === 'yearly' && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', color: '#16a34a', fontWeight: '600' }}>
                          Just ₹999/year - Best Value!
                        </span>
                      </div>
                    )}
                    {plan.id === 'quarterly' && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', color: '#16a34a', fontWeight: '600' }}>
                          Just ₹249/quarter - Save ₹48!
                        </span>
                      </div>
                    )}
                    {plan.id === 'monthly' && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', color: '#9ca3af', fontWeight: '600' }}>
                          See monthly breakdown
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', textAlign: 'left' }}>
                    {plan.features.map((feature, index) => (
                      <li key={index} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        padding: '0.5rem 0',
                        fontSize: '0.875rem',
                        color: '#374151'
                      }}>
                        <span style={{
                          color: '#16a34a',
                          fontSize: '1rem',
                          flexShrink: 0
                        }}>
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: plan.id === 'yearly'
                          ? '#ea580c'
                          : plan.id === 'quarterly'
                            ? '#16a34a'
                            : '#6b7280',
                      color: 'white',
                      transition: 'background 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      if (plan.id === 'yearly') {
                        e.currentTarget.style.background = '#c2410c'
                      } else if (plan.id === 'quarterly') {
                        e.currentTarget.style.background = '#15803d'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (plan.id === 'yearly') {
                        e.currentTarget.style.background = '#ea580c'
                      } else if (plan.id === 'quarterly') {
                        e.currentTarget.style.background = '#16a34a'
                      }
                    }}
                  >
                    {plan.id === 'yearly' ? (
                      '🔥 Get Started - Best Value'
                    ) : plan.id === 'quarterly' ? (
                      '✅ Get Started - Save ₹48!'
                    ) : (
                      '✅ Get Started'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Features Comparison */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '4rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem', textAlign: 'center' }}>
              Plan Comparison
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', marginBottom: '2rem' }}>
              Compare features between all available plans
            </p>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '1rem', color: '#6b7280', fontWeight: '500' }}>Feature</th>
                    <th style={{ textAlign: 'center', padding: '1rem', color: '#111827', fontWeight: '600' }}>Monthly</th>
                    <th style={{ textAlign: 'center', padding: '1rem', color: '#111827', fontWeight: '600' }}>Quarterly</th>
                    <th style={{ textAlign: 'center', padding: '1rem', color: '#111827', fontWeight: '600' }}>Yearly</th>
                  </tr>
                </thead>
                <tbody style={{ borderBottom: '1px solid #e5e7eb' }}>
                  {[
                    { feature: 'School Learning (Class 1-12)', monthly: '✓ All Classes', quarterly: '✓ All Classes', yearly: '✓ All Classes' },
                    { feature: 'College Foundation', monthly: '✓ All Degrees', quarterly: '✓ All Degrees', yearly: '✓ All Degrees' },
                    { feature: 'Career & Skills', monthly: '✓ All Categories', quarterly: '✓ All Categories', yearly: '✓ All Categories' },
                    { feature: 'Money & Business', monthly: '✓ All Topics', quarterly: '✓ All Topics', yearly: '✓ All Topics' },
                    { feature: '18 Learning Categories', monthly: '✓ Complete', quarterly: '✓ Complete', yearly: '✓ Complete' },
                    { feature: 'Mobile App Access', monthly: '✓', quarterly: '✓', yearly: '✓' },
                    { feature: 'Progress Tracking', monthly: '✓', quarterly: '✓', yearly: '✓' },
                    { feature: 'Community Access', monthly: '✓', quarterly: '✓', yearly: '✓' },
                    { feature: 'Certificates', monthly: 'Premium', quarterly: 'Premium', yearly: 'Premium' },
                    { feature: 'Priority Support', monthly: '✓', quarterly: '✓', yearly: '✓' },
                    { feature: 'Offline Access', monthly: '✗', quarterly: '✗', yearly: '✓' },
                    { feature: '1-on-1 Mentoring', monthly: '✗', quarterly: '✗', yearly: '✓' },
                    { feature: 'Savings', monthly: '-', quarterly: '₹48 saved', yearly: '₹252 saved' }
                  ].map((row, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.75rem 1rem', color: '#374151', fontSize: '0.875rem' }}>{row.feature}</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#111827', fontSize: '0.875rem' }}>{row.monthly}</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#111827', fontSize: '0.875rem' }}>{row.quarterly}</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#111827', fontSize: '0.875rem' }}>{row.yearly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '4rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                background: '#dcfce7',
                color: '#16a34a',
                padding: '0.75rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                ✓
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>
                30-Day Money Back Guarantee
              </h3>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', maxWidth: '600px', margin: '0 auto' }}>
              Not satisfied with your learning experience? Get a full refund within 30 days of purchase. 
              No questions asked, no hassle.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#111827',
        color: 'white',
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            © 2026 INR99.Academy - India's Learning Infrastructure
          </p>
        </div>
      </footer>
    </div>
  )
}
