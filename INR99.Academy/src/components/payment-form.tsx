"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Smartphone, Wallet, IndianRupee, Shield, CheckCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PaymentFormProps {
  amount: number
  type: 'SUBSCRIPTION' | 'CERTIFICATE'
  courseId?: string
  onSuccess?: (paymentId: string) => void
  onError?: (error: string) => void
}

export function PaymentForm({ amount, type, courseId, onSuccess, onError }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'WALLET'>('UPI')
  const [loading, setLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    upiId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    walletType: '',
    walletNumber: ''
  })
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setPaymentStatus('processing')

    try {
      const paymentDetails: any = {}
      
      switch (paymentMethod) {
        case 'UPI':
          paymentDetails.upiId = formData.upiId
          break
        case 'CARD':
          paymentDetails.cardNumber = formData.cardNumber
          paymentDetails.cardExpiry = formData.cardExpiry
          paymentDetails.cardCvv = formData.cardCvv
          break
        case 'WALLET':
          paymentDetails.walletType = formData.walletType
          paymentDetails.walletNumber = formData.walletNumber
          break
      }

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          paymentMethod,
          paymentDetails,
          type,
          courseId
        })
      })

      const data = await response.json()

      if (response.ok) {
        setPaymentId(data.paymentId)
        setPaymentStatus('processing')
        
        // Simulate payment processing check
        await checkPaymentStatus(data.paymentId)
        
        toast({
          title: "Payment Initiated",
          description: "Your payment is being processed..."
        })
      } else {
        throw new Error(data.error || 'Payment failed')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed'
      setPaymentStatus('error')
      onError?.(errorMessage)
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const checkPaymentStatus = async (pid: string) => {
    const maxAttempts = 10
    let attempts = 0

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/payments/${pid}/status`)
        const data = await response.json()

        if (data.status === 'COMPLETED') {
          setPaymentStatus('success')
          onSuccess?.(pid)
          toast({
            title: "Payment Successful",
            description: "Your payment has been processed successfully!"
          })
        } else if (data.status === 'FAILED') {
          setPaymentStatus('error')
          onError?.('Payment failed')
          toast({
            title: "Payment Failed",
            description: "Your payment could not be processed",
            variant: "destructive"
          })
        } else if (attempts < maxAttempts) {
          attempts++
          setTimeout(checkStatus, 2000) // Check every 2 seconds
        } else {
          setPaymentStatus('error')
          onError?.('Payment timeout')
          toast({
            title: "Payment Timeout",
            description: "Payment processing took too long",
            variant: "destructive"
          })
        }
      } catch (error) {
        setPaymentStatus('error')
        onError?.('Failed to check payment status')
        toast({
          title: "Error",
          description: "Failed to check payment status",
          variant: "destructive"
        })
      }
    }

    checkStatus()
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'UPI':
        return <Smartphone className="h-5 w-5" />
      case 'CARD':
        return <CreditCard className="h-5 w-5" />
      case 'WALLET':
        return <Wallet className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  if (paymentStatus === 'success') {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-green-900">Payment Successful!</h3>
              <p className="text-green-700">
                Your payment has been processed successfully.
              </p>
              {paymentId && (
                <p className="text-sm text-green-600 mt-2">
                  Payment ID: {paymentId}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (paymentStatus === 'processing') {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
            <div>
              <h3 className="text-xl font-semibold text-blue-900">Processing Payment...</h3>
              <p className="text-blue-700">
                Please wait while we process your payment.
              </p>
              {paymentId && (
                <p className="text-sm text-blue-600 mt-2">
                  Payment ID: {paymentId}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IndianRupee className="h-5 w-5" />
          Complete Payment
        </CardTitle>
        <CardDescription>
          Pay securely using your preferred payment method
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Display */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Amount to Pay</div>
            <div className="text-3xl font-bold text-gray-900">
              ₹{amount}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <Label className="text-base font-medium">Payment Method</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { value: 'UPI', label: 'UPI', icon: <Smartphone className="h-5 w-5" /> },
                { value: 'CARD', label: 'Card', icon: <CreditCard className="h-5 w-5" /> },
                { value: 'WALLET', label: 'Wallet', icon: <Wallet className="h-5 w-5" /> }
              ].map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setPaymentMethod(method.value as any)}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    paymentMethod === method.value
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    {method.icon}
                    <span className="text-sm font-medium">{method.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Specific Fields */}
          <div className="space-y-4">
            {paymentMethod === 'UPI' && (
              <div>
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  placeholder="your@upi"
                  value={formData.upiId}
                  onChange={(e) => handleInputChange('upiId', e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter your UPI ID (e.g., mobile@upi or name@upi)
                </p>
              </div>
            )}

            {paymentMethod === 'CARD' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    maxLength={19}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardExpiry">Expiry Date</Label>
                    <Input
                      id="cardExpiry"
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardCvv">CVV</Label>
                    <Input
                      id="cardCvv"
                      placeholder="123"
                      value={formData.cardCvv}
                      onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'WALLET' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="walletType">Wallet Type</Label>
                  <Select value={formData.walletType} onValueChange={(value) => handleInputChange('walletType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select wallet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PAYTM">Paytm</SelectItem>
                      <SelectItem value="PHONEPE">PhonePe</SelectItem>
                      <SelectItem value="GPAY">Google Pay</SelectItem>
                      <SelectItem value="MOBIKWIK">MobiKwik</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="walletNumber">Mobile Number</Label>
                  <Input
                    id="walletNumber"
                    placeholder="9876543210"
                    value={formData.walletNumber}
                    onChange={(e) => handleInputChange('walletNumber', e.target.value)}
                    maxLength={10}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Security Note */}
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">
              Your payment information is secure and encrypted
            </span>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : (
              `Pay ₹${amount}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}