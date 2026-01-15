"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CreditCard,
  Smartphone,
  Wallet,
  IndianRupee,
  Shield,
  CheckCircle,
  Clock,
  ArrowRight,
  Copy,
  QrCode
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  fields: Array<{
    name: string
    label: string
    type: string
    placeholder: string
    required?: boolean
  }>
}

interface PaymentPlan {
  id: string
  name: string
  price: number
  duration: string
  features: string[]
  popular?: boolean
}

export function PaymentProcessor({
  amount = 1188,
  type = 'SUBSCRIPTION',
  onSuccess,
  onCancel
}: {
  amount?: number
  type?: 'SUBSCRIPTION' | 'CERTIFICATE'
  onSuccess?: () => void
  onCancel?: () => void
}) {
  const { data: session, status } = useSession()
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [selectedPlan, setSelectedPlan] = useState<string>('yearly')
  const [processing, setProcessing] = useState(false)
  const [paymentData, setPaymentData] = useState<Record<string, string>>({})
  const [upiId, setUpiId] = useState('inr99@upi')
  const [showQR, setShowQR] = useState(false)
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: <Smartphone className="h-5 w-5" />,
      description: 'Pay using any UPI app',
      fields: [
        { name: 'upiId', label: 'UPI ID', type: 'text', placeholder: 'your@upi', required: true }
      ]
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Pay using your card',
      fields: [
        { name: 'cardNumber', label: 'Card Number', type: 'text', placeholder: '1234 5678 9012 3456', required: true },
        { name: 'expiry', label: 'Expiry Date', type: 'text', placeholder: 'MM/YY', required: true },
        { name: 'cvv', label: 'CVV', type: 'text', placeholder: '123', required: true },
        { name: 'cardholderName', label: 'Cardholder Name', type: 'text', placeholder: 'John Doe', required: true }
      ]
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: <Wallet className="h-5 w-5" />,
      description: 'Pay using digital wallets',
      fields: [
        { name: 'walletType', label: 'Wallet Type', type: 'select', placeholder: 'Select wallet', required: true },
        { name: 'walletNumber', label: 'Wallet Number', type: 'text', placeholder: 'Enter wallet number', required: true }
      ]
    }
  ]

  const paymentPlans: PaymentPlan[] = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: 99,
      duration: '1 month',
      features: [
        'Access to all courses',
        'Mobile & desktop access',
        'Progress tracking',
        'Community access',
        'Priority support',
        'Download certificates'
      ],
      popular: false
    },
    {
      id: 'quarterly',
      name: 'Quarterly Plan',
      price: 249,
      duration: '3 months',
      features: [
        'Everything in Monthly',
        'Save ₹48',
        'Access to all courses',
        'Mobile & desktop access',
        'Progress tracking',
        'Community access',
        'Priority support',
        'Download certificates'
      ],
      popular: false
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      price: 999,
      duration: '1 year',
      features: [
        'Everything in Quarterly',
        'Save ₹252',
        'Exclusive content',
        '1-on-1 mentoring',
        'Offline access',
        'Priority customer support'
      ],
      popular: true
    }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const handleFieldChange = (fieldName: string, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handlePayment = async () => {
    if (status !== 'authenticated' || !session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a payment",
        variant: "destructive"
      })
      return
    }

    if (!selectedMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive"
      })
      return
    }

    const method = paymentMethods.find(m => m.id === selectedMethod)
    if (!method) return

    // Validate required fields
    const missingFields = method.fields
      .filter(field => field.required)
      .filter(field => !paymentData[field.name])
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive"
      })
      return
    }

    setProcessing(true)

    try {
      // Create payment record
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          amount: selectedPlan === 'monthly' ? 99 : selectedPlan === 'quarterly' ? 249 : 999,
          paymentMethod: selectedMethod,
          paymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        })
      })

      if (paymentResponse.ok) {
        const paymentData = await paymentResponse.json()
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Verify payment
        const verifyResponse = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentId: paymentData.paymentId,
            paymentMethod: selectedMethod,
            transactionId: `txn_${Date.now()}`
          })
        })

        if (verifyResponse.ok) {
          toast({
            title: "Payment Successful",
            description: "Your payment has been processed successfully"
          })
          onSuccess?.()
        } else {
          toast({
            title: "Payment Failed",
            description: "Failed to verify payment",
            variant: "destructive"
          })
        }
      } else {
        const error = await paymentResponse.json()
        toast({
          title: "Payment Failed",
          description: error.error || "Failed to process payment",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "An error occurred while processing your payment",
        variant: "destructive"
      })
    } finally {
      setProcessing(false)
    }
  }

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId)
    toast({
      title: "UPI ID Copied",
      description: "UPI ID copied to clipboard"
    })
  }

  const selectedPaymentPlan = paymentPlans.find(p => p.id === selectedPlan)
  const finalAmount = selectedPaymentPlan?.price || amount

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Payment Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Plan</CardTitle>
          <CardDescription>Select the subscription plan that works best for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? 'border-orange-500 ring-2 ring-orange-200'
                    : 'border-gray-200 hover:border-gray-300'
                } ${plan.popular ? 'relative' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-orange-500">⭐ Best Value</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="flex items-center justify-center gap-1">
                    <IndianRupee className="h-4 w-4" />
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">/{plan.duration}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {selectedPlan === plan.id && (
                    <div className="flex items-center justify-center pt-2">
                      <CheckCircle className="h-5 w-5 text-orange-500" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Choose how you'd like to pay</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
            <TabsList className="grid w-full grid-cols-3">
              {paymentMethods.map((method) => (
                <TabsTrigger key={method.id} value={method.id} className="flex items-center gap-2">
                  {method.icon}
                  <span className="hidden sm:inline">{method.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {paymentMethods.map((method) => (
              <TabsContent key={method.id} value={method.id} className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  {method.icon}
                  <div>
                    <h3 className="font-medium">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>

                {method.id === 'upi' && (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-medium">Pay via UPI</p>
                          <p className="text-sm text-gray-600">Scan the QR code or use UPI ID</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowQR(!showQR)}
                        >
                          <QrCode className="h-4 w-4 mr-2" />
                          {showQR ? 'Hide QR' : 'Show QR'}
                        </Button>
                      </div>
                      
                      {showQR && (
                        <div className="flex justify-center py-4">
                          <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <QrCode className="h-24 w-24 text-gray-400" />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="block text-sm font-medium">UPI ID</label>
                        <div className="flex gap-2">
                          <Input
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="your@upi"
                          />
                          <Button variant="outline" onClick={copyUpiId}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {method.fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="block text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'select' ? (
                      <Select onValueChange={(value) => handleFieldChange(field.name, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paytm">Paytm</SelectItem>
                          <SelectItem value="phonepe">PhonePe</SelectItem>
                          <SelectItem value="gpay">Google Pay</SelectItem>
                          <SelectItem value="amazonpay">Amazon Pay</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={paymentData[field.name] || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      />
                    )}
                  </div>
                ))}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-lg font-semibold">
                      Total: {formatCurrency(finalAmount)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedPaymentPlan?.duration} access
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={onCancel}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePayment}
                      disabled={processing || !selectedMethod}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      {processing ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          Pay {formatCurrency(finalAmount)}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Security Note */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="h-4 w-4" />
            <span>Your payment information is encrypted and secure. We don't store your card details.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}