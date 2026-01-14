/**
 * Cashfree Payment Gateway Service
 * 
 * Yeh service Cashfree API ke saath communication handle karta hai.
 * Isme order create, payment verify aur webhook signature verification shamil hai.
 * 
 * Author: INR99 Academy
 * Version: 1.0.0
 */

import CryptoJS from 'crypto-js'

// Cashfree configuration interface
interface CashfreeConfig {
  appId: string
  secretKey: string
  apiUrl: string
  env: string
}

// Create order parameters interface
interface CreateOrderParams {
  orderId: string
  orderAmount: number
  customerId: string
  customerEmail: string
  customerPhone: string
  orderNote?: string
  returnUrl?: string
}

// Order response interface
interface OrderResponse {
  order_id: string
  payment_session_id: string
  order_status: string
}

// Payment verification response interface
interface PaymentVerificationResponse {
  success: boolean
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'ERROR'
  paymentId?: string
  paymentMethod?: string
  message?: string
}

// Webhook payload interface
interface WebhookPayload {
  type: string
  data: {
    order_id: string
    order_amount: number
    transaction_amount: number
    transaction_status: string
    payment_method: {
      type: string
      utr?: string
      card_number?: string
    }
    transaction_id: string
  }
}

export class CashfreeService {
  private config: CashfreeConfig
  private headers: Record<string, string>

  constructor() {
    // Environment se Cashfree credentials load kar rahe hain
    this.config = {
      appId: process.env.CASHFREE_APP_ID || '',
      secretKey: process.env.CASHFREE_SECRET_KEY || '',
      apiUrl: process.env.CASHFREE_API_URL || 'https://api.cashfree.com/pg',
      env: process.env.CASHFREE_ENV || 'production'
    }

    // API headers set kar rahe hain
    this.headers = {
      'Content-Type': 'application/json',
      'x-client-id': this.config.appId,
      'x-client-secret': this.config.secretKey,
      'x-api-version': '2023-08-01'
    }
  }

  /**
   * Create a new order with Cashfree
   * 
   * Yeh method Cashfree ke /orders endpoint ko call karke
   * ek naya payment order create karta hai.
   */
  async createOrder(params: CreateOrderParams): Promise<OrderResponse> {
    try {
      // Request body prepare kar rahe hain
      const payload = {
        order_id: params.orderId,
        order_amount: params.orderAmount,
        order_currency: 'INR',
        customer_details: {
          customer_id: params.customerId,
          customer_email: params.customerEmail,
          customer_phone: params.customerPhone,
          customer_name: params.customerId
        },
        order_note: params.orderNote || `INR99 Academy Payment - ${params.orderId}`,
        order_meta: {
          return_url: params.returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?order_id={order_id}`
        }
      }

      console.log('Cashfree createOrder request:', JSON.stringify(payload, null, 2))

      // Cashfree API call kar rahe hain
      const response = await fetch(`${this.config.apiUrl}/orders`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      })

      // Response parse kar rahe hain
      const data = await response.json()

      if (!response.ok) {
        console.error('Cashfree API error:', data)
        throw new Error(data.message || 'Failed to create Cashfree order')
      }

      console.log('Cashfree order created successfully:', data)

      return {
        order_id: data.order_id,
        payment_session_id: data.payment_session_id,
        order_status: data.order_status
      }

    } catch (error: any) {
      console.error('Cashfree createOrder error:', error)
      throw error
    }
  }

  /**
   * Get order payments from Cashfree
   * 
   * Yeh method kisi specific order ki saari payments retrieve karta hai
   * taaki hum payment status check kar sakein.
   */
  async getOrderPayments(orderId: string): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.config.apiUrl}/orders/${orderId}/payments`,
        { headers: this.headers }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch order payments')
      }

      const data = await response.json()
      return data.list || []

    } catch (error: any) {
      console.error('Cashfree getOrderPayments error:', error)
      throw error
    }
  }

  /**
   * Verify payment status from Cashfree
   * 
   * Yeh method Cashfree se payment status verify karta hai
   * aur appropriate response return karta hai.
   */
  async verifyPayment(orderId: string): Promise<PaymentVerificationResponse> {
    try {
      // Cashfree se order ki payments retrieve kar rahe hain
      const payments = await this.getOrderPayments(orderId)

      // SUCCESS wala payment dhundh rahe hain
      const successfulPayment = payments.find(
        (p: any) => p.transaction_status === 'SUCCESS'
      )

      if (successfulPayment) {
        return {
          success: true,
          status: 'SUCCESS',
          paymentId: successfulPayment.cf_payment_id,
          paymentMethod: successfulPayment.payment_method?.type
        }
      }

      // PENDING wala payment dhundh rahe hain
      const pendingPayment = payments.find(
        (p: any) => p.transaction_status === 'PENDING'
      )

      if (pendingPayment) {
        return {
          success: false,
          status: 'PENDING',
          message: 'Payment is still being processed'
        }
      }

      // Agar koi success ya pending payment nahi mila, toh failed hai
      const failedPayment = payments.find(
        (p: any) => p.transaction_status === 'FAILED'
      )

      if (failedPayment) {
        return {
          success: false,
          status: 'FAILED',
          message: failedPayment.payment_message || 'Payment failed'
        }
      }

      return {
        success: false,
        status: 'ERROR',
        message: 'Unable to determine payment status'
      }

    } catch (error: any) {
      console.error('Cashfree verifyPayment error:', error)
      return {
        success: false,
        status: 'ERROR',
        message: error.message || 'Failed to verify payment'
      }
    }
  }

  /**
   * Verify webhook signature from Cashfree
   * 
   * Yeh method webhook request ka signature verify karta hai
   * taaki hum ensure kar sakein ki request Cashfree se hi aayi hai.
   */
  verifyWebhookSignature(payload: string, signature: string, webhookSecret: string): boolean {
    try {
      // HMAC SHA256 signature generate kar rahe hain
      const expectedSignature = CryptoJS.HmacSHA256(payload, webhookSecret)
        .toString(CryptoJS.enc.Hex)

      // Signature compare kar rahe hain
      return signature === expectedSignature

    } catch (error) {
      console.error('Webhook signature verification error:', error)
      return false
    }
  }

  /**
   * Generate payment link for manual sharing
   * 
   * Yeh method ek shareable payment link generate karta hai
   * jise hum users ko WhatsApp ya email ke through bhej sakte hain.
   */
  generatePaymentLink(params: {
    orderId: string
    orderAmount: number
    customerEmail: string
    customerPhone: string
  }): string {
    const baseUrl = 'https://payments.cashfree.com/links'
    const queryParams = new URLSearchParams({
      order_id: params.orderId,
      order_amount: params.orderAmount.toString(),
      order_currency: 'INR',
      customer_email: params.customerEmail,
      customer_phone: params.customerPhone
    })

    return `${baseUrl}?${queryParams.toString()}`
  }

  /**
   * Get payment methods available for the order
   * 
   * Yeh method batata hai ki kaun se payment methods
   * available hain for this particular order.
   */
  getAvailablePaymentMethods(): string[] {
    return [
      'UPI',        // Unified Payment Interface
      'CARD',       // Credit/Debit Cards
      'NETBANKING', // Net Banking
      'WALLET'      // Digital Wallets (Paytm, PhonePe, etc.)
    ]
  }
}

// Export single instance of CashfreeService
export const cashfreeService = new CashfreeService()
