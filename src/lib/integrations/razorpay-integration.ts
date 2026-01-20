/**
 * Razorpay Payment Gateway Integration
 * Handles subscription payments, invoicing, and payment tracking
 */

import { z } from 'zod';
import crypto from 'crypto';

// Configuration
export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
  webhookSecret: string;
  apiBaseUrl: string;
  timeout: number;
  retryAttempts: number;
}

// Payment status enum
export type PaymentStatus = 
  | 'created'
  | 'authorized'
  | 'captured'
  | 'refunded'
  | 'failed'
  | 'disputed';

// Subscription status
export type SubscriptionStatus = 
  | 'created'
  | 'active'
  | 'paused'
  | 'cancelled'
  | 'expired'
  | 'pending';

// Customer schema
export const customerSchema = z.object({
  customerId: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  organizationName: z.string(),
  gstNumber: z.string().optional(),
  billingAddress: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    country: z.string().default('IN'),
  }).optional(),
});

export type Customer = z.infer<typeof customerSchema>;

// Plan schema
export const planSchema = z.object({
  planId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  tier: z.enum(['starter', 'growth', 'scale', 'enterprise']),
  amount: z.number(),
  currency: z.string().default('INR'),
  interval: z.enum(['monthly', 'annual']),
  features: z.array(z.string()),
  maxStudents: z.number(),
  apiCallsLimit: z.number(),
  storageLimit: z.number(),
});

export type Plan = z.infer<typeof planSchema>;

// Subscription schema
export const subscriptionSchema = z.object({
  subscriptionId: z.string(),
  customerId: z.string(),
  planId: z.string(),
  status: z.string(),
  currentTermStart: z.string(),
  currentTermEnd: z.string(),
  nextBillingAt: z.string().optional(),
  cancelAtTermEnd: z.boolean(),
  pausedAt: z.string().optional(),
  resumeAt: z.string().optional(),
});

export type Subscription = z.infer<typeof subscriptionSchema>;

// Invoice schema
export const invoiceSchema = z.object({
  invoiceId: z.string(),
  customerId: z.string(),
  subscriptionId: z.string().optional(),
  status: z.enum(['draft', 'issued', 'paid', 'void', 'overdue']),
  amount: z.number(),
  taxAmount: z.number(),
  totalAmount: z.number(),
  currency: z.string(),
  issuedAt: z.string(),
  dueDate: z.string(),
  paidAt: z.string().optional(),
  lineItems: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    amount: z.number(),
    quantity: z.number(),
  })),
});

export type Invoice = z.infer<typeof invoiceSchema>;

// Payment schema
export const paymentSchema = z.object({
  paymentId: z.string(),
  customerId: z.string(),
  subscriptionId: z.string().optional(),
  invoiceId: z.string().optional(),
  amount: z.number(),
  currency: z.string(),
  status: z.string(),
  method: z.string(),
  gatewayPaymentId: z.string(),
  capturedAt: z.string().optional(),
  refundedAt: z.string().optional(),
  refundedAmount: z.number().optional(),
});

export type Payment = z.infer<typeof paymentSchema>;

// Webhook event types
export type WebhookEventType = 
  | 'payment.authorized'
  | 'payment.captured'
  | 'payment.failed'
  | 'payment.refunded'
  | 'invoice.paid'
  | 'subscription.activated'
  | 'subscription.cancelled'
  | 'subscription.paused'
  | 'subscription.resumed';

export interface WebhookEvent {
  event: WebhookEventType;
  payload: Record<string, any>;
  timestamp: string;
  signature: string;
}

// API Response types
export interface RazorpayApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    description: string;
    field?: string;
  };
}

// Usage tracking
export interface UsageRecord {
  subscriptionId: string;
  metric: 'api_calls' | 'storage' | 'verifications';
  quantity: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export class RazorpayIntegration {
  private config: RazorpayConfig;

  constructor(config: Partial<RazorpayConfig> = {}) {
    this.config = {
      keyId: config.keyId || process.env.RAZORPAY_KEY_ID || '',
      keySecret: config.keySecret || process.env.RAZORPAY_KEY_SECRET || '',
      webhookSecret: config.webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET || '',
      apiBaseUrl: config.apiBaseUrl || 'https://api.razorpay.com/v1',
      timeout: config.timeout || 30000,
      retryAttempts: config.retryAttempts || 3,
    };
  }

  /**
   * Create a new customer
   */
  async createCustomer(customer: Omit<Customer, 'customerId'>): Promise<Customer | null> {
    try {
      const response = await this.makeRequest<{ id: string; email: string; name: string }>(
        '/customers',
        'POST',
        {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          gst_number: customer.gstNumber,
          billing_address: customer.billingAddress ? {
            street_address1: customer.billingAddress.line1,
            street_address2: customer.billingAddress.line2,
            city: customer.billingAddress.city,
            state: customer.billingAddress.state,
            zipcode: customer.billingAddress.pincode,
            country: customer.billingAddress.country,
          } : undefined,
        }
      );

      if (response.success && response.data) {
        return {
          customerId: response.data.id,
          name: response.data.name,
          email: response.data.email,
          phone: customer.phone,
          organizationName: customer.organizationName,
          gstNumber: customer.gstNumber,
          billingAddress: customer.billingAddress,
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to create customer:', error);
      return null;
    }
  }

  /**
   * Get customer by ID
   */
  async getCustomer(customerId: string): Promise<Customer | null> {
    try {
      const response = await this.makeRequest<any>(
        `/customers/${customerId}`,
        'GET'
      );

      if (response.success && response.data) {
        return {
          customerId: response.data.id,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          organizationName: response.data.name, // Using name as org name
          gstNumber: response.data.gst_number,
          billingAddress: response.data.billing_address ? {
            line1: response.data.billing_address.street_address1,
            line2: response.data.billing_address.street_address2,
            city: response.data.billing_address.city,
            state: response.data.billing_address.state,
            pincode: response.data.billing_address.zipcode,
            country: response.data.billing_address.country,
          } : undefined,
        };
      }

      return null;
    } catch (error) {
      console.error(`Failed to get customer ${customerId}:`, error);
      return null;
    }
  }

  /**
   * Create a plan
   */
  async createPlan(plan: Omit<Plan, 'planId'>): Promise<Plan | null> {
    try {
      const response = await this.makeRequest<{ id: string; item: any }>(
        '/plans',
        'POST',
        {
          item: {
            name: plan.name,
            description: plan.description,
            amount: Math.round(plan.amount * 100), // Convert to paise
            currency: plan.currency,
          },
          period: plan.interval,
          interval: 1,
        }
      );

      if (response.success && response.data) {
        return {
          planId: response.data.id,
          ...plan,
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to create plan:', error);
      return null;
    }
  }

  /**
   * Create a subscription
   */
  async createSubscription(
    customerId: string,
    planId: string,
    billingCycle: 'monthly' | 'annual' = 'monthly',
    startAt?: number
  ): Promise<Subscription | null> {
    try {
      const response = await this.makeRequest<any>(
        '/subscriptions',
        'POST',
        {
          customer_id: customerId,
          plan_id: planId,
          billing_cycle: billingCycle === 'monthly' ? 'monthly' : 'yearly',
          start_at: startAt || Math.floor(Date.now() / 1000) + 86400, // Start tomorrow
          total_count: 12, // Default to 12 billing cycles
          notes: {
            tier: 'custom',
          },
        }
      );

      if (response.success && response.data) {
        return {
          subscriptionId: response.data.id,
          customerId: response.data.customer_id,
          planId: response.data.plan_id,
          status: response.data.status,
          currentTermStart: new Date(response.data.current_term_start * 1000).toISOString(),
          currentTermEnd: new Date(response.data.current_term_end * 1000).toISOString(),
          nextBillingAt: response.data.next_billing_at 
            ? new Date(response.data.next_billing_at * 1000).toISOString() 
            : undefined,
          cancelAtTermEnd: response.data.cancel_at_term_end,
          pausedAt: response.data.paused_at 
            ? new Date(response.data.paused_at * 1000).toISOString() 
            : undefined,
          resumeAt: response.data.resume_at 
            ? new Date(response.data.resume_at * 1000).toISOString() 
            : undefined,
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to create subscription:', error);
      return null;
    }
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId: string): Promise<Subscription | null> {
    try {
      const response = await this.makeRequest<any>(
        `/subscriptions/${subscriptionId}`,
        'GET'
      );

      if (response.success && response.data) {
        return {
          subscriptionId: response.data.id,
          customerId: response.data.customer_id,
          planId: response.data.plan_id,
          status: response.data.status,
          currentTermStart: new Date(response.data.current_term_start * 1000).toISOString(),
          currentTermEnd: new Date(response.data.current_term_end * 1000).toISOString(),
          nextBillingAt: response.data.next_billing_at 
            ? new Date(response.data.next_billing_at * 1000).toISOString() 
            : undefined,
          cancelAtTermEnd: response.data.cancel_at_term_end,
          pausedAt: response.data.paused_at 
            ? new Date(response.data.paused_at * 1000).toISOString() 
            : undefined,
          resumeAt: response.data.resume_at 
            ? new Date(response.data.resume_at * 1000).toISOString() 
            : undefined,
        };
      }

      return null;
    } catch (error) {
      console.error(`Failed to get subscription ${subscriptionId}:`, error);
      return null;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(
    subscriptionId: string,
    cancelAtTermEnd: boolean = true
  ): Promise<Subscription | null> {
    try {
      const response = await this.makeRequest<any>(
        `/subscriptions/${subscriptionId}/cancel`,
        'POST',
        cancelAtTermEnd ? { cancel_at_cycle_end: true } : {}
      );

      if (response.success && response.data) {
        return this.getSubscription(response.data.id);
      }

      return null;
    } catch (error) {
      console.error(`Failed to cancel subscription ${subscriptionId}:`, error);
      return null;
    }
  }

  /**
   * Pause subscription
   */
  async pauseSubscription(subscriptionId: string, resumeAt?: Date): Promise<boolean> {
    try {
      const response = await this.makeRequest<any>(
        `/subscriptions/${subscriptionId}/pause`,
        'POST',
        resumeAt ? { resume_at: Math.floor(resumeAt.getTime() / 1000) } : {}
      );

      return response.success;
    } catch (error) {
      console.error(`Failed to pause subscription ${subscriptionId}:`, error);
      return false;
    }
  }

  /**
   * Resume subscription
   */
  async resumeSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const response = await this.makeRequest<any>(
        `/subscriptions/${subscriptionId}/resume`,
        'POST',
        {}
      );

      return response.success;
    } catch (error) {
      console.error(`Failed to resume subscription ${subscriptionId}:`, error);
      return false;
    }
  }

  /**
   * Create order for one-time payment
   */
  async createOrder(
    amount: number,
    customerId: string,
    currency: string = 'INR',
    notes?: Record<string, string>
  ): Promise<{ orderId: string; amount: number; currency: string } | null> {
    try {
      const response = await this.makeRequest<any>(
        '/orders',
        'POST',
        {
          amount: Math.round(amount * 100),
          currency,
          customer_id: customerId,
          notes,
        }
      );

      if (response.success && response.data) {
        return {
          orderId: response.data.id,
          amount: response.data.amount / 100,
          currency: response.data.currency,
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to create order:', error);
      return null;
    }
  }

  /**
   * Capture payment
   */
  async capturePayment(paymentId: string, amount?: number): Promise<Payment | null> {
    try {
      const response = await this.makeRequest<any>(
        `/payments/${paymentId}/capture`,
        'POST',
        amount ? { amount: Math.round(amount * 100) } : {}
      );

      if (response.success && response.data) {
        return this.mapPaymentResponse(response.data);
      }

      return null;
    } catch (error) {
      console.error(`Failed to capture payment ${paymentId}:`, error);
      return null;
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(
    paymentId: string,
    amount?: number,
    reason?: string
  ): Promise<{ refundId: string; status: string } | null> {
    try {
      const response = await this.makeRequest<any>(
        `/payments/${paymentId}/refund`,
        'POST',
        amount ? { amount: Math.round(amount * 100) } : {},
        reason ? { 'X-Razorpay-Comment': reason } : undefined
      );

      if (response.success && response.data) {
        return {
          refundId: response.data.id,
          status: response.data.status,
        };
      }

      return null;
    } catch (error) {
      console.error(`Failed to refund payment ${paymentId}:`, error);
      return null;
    }
  }

  /**
   * Get payments for a customer
   */
  async getCustomerPayments(
    customerId: string,
    from?: Date,
    to?: Date,
    limit: number = 10
  ): Promise<Payment[]> {
    try {
      const params = new URLSearchParams();
      params.append('customer_id', customerId);
      params.append('limit', limit.toString());
      
      if (from) params.append('from', Math.floor(from.getTime() / 1000).toString());
      if (to) params.append('to', Math.floor(to.getTime() / 1000).toString());

      const response = await this.makeRequest<{ items: any[] }>(
        `/payments?${params.toString()}`,
        'GET'
      );

      if (response.success && response.data) {
        return response.data.items.map(item => this.mapPaymentResponse(item)).filter(Boolean) as Payment[];
      }

      return [];
    } catch (error) {
      console.error(`Failed to get payments for customer ${customerId}:`, error);
      return [];
    }
  }

  /**
   * Create invoice
   */
  async createInvoice(invoice: Omit<Invoice, 'invoiceId'>): Promise<Invoice | null> {
    try {
      const response = await this.makeRequest<any>(
        '/invoices',
        'POST',
        {
          customer_id: invoice.customerId,
          subscription_id: invoice.subscriptionId,
          line_items: invoice.lineItems.map(item => ({
            item: {
              name: item.name,
              description: item.description,
              amount: Math.round(item.amount * 100),
              quantity: item.quantity,
            },
          })),
          currency: invoice.currency,
          due_date: Math.floor(new Date(invoice.dueDate).getTime() / 1000),
          notes: {
            subscription_id: invoice.subscriptionId,
          },
        }
      );

      if (response.success && response.data) {
        return {
          invoiceId: response.data.id,
          ...invoice,
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to create invoice:', error);
      return null;
    }
  }

  /**
   * Send invoice via email
   */
  async sendInvoice(invoiceId: string): Promise<boolean> {
    try {
      const response = await this.makeRequest<any>(
        `/invoices/${invoiceId}/notify_by_email`,
        'POST',
        {}
      );

      return response.success;
    } catch (error) {
      console.error(`Failed to send invoice ${invoiceId}:`, error);
      return false;
    }
  }

  /**
   * Record usage for usage-based billing
   */
  async recordUsage(subscriptionId: string, metric: UsageRecord['metric'], quantity: number): Promise<boolean> {
    try {
      const response = await this.makeRequest<any>(
        '/usage',
        'POST',
        {
          subscription_id: subscriptionId,
          metric: metric,
          quantity: quantity,
          timestamp: Math.floor(Date.now() / 1000),
        }
      );

      return response.success;
    } catch (error) {
      console.error(`Failed to record usage for ${subscriptionId}:`, error);
      return false;
    }
  }

  /**
   * Get current cycle usage
   */
  async getCycleUsage(subscriptionId: string): Promise<{
    apiCalls: number;
    storage: number;
    verifications: number;
  } | null> {
    try {
      const response = await this.makeRequest<any>(
        `/subscriptions/${subscriptionId}/usages`,
        'GET'
      );

      if (response.success && response.data) {
        const usages = response.data.items || [];
        return {
          apiCalls: usages.find((u: any) => u.metric === 'api_calls')?.quantity || 0,
          storage: usages.find((u: any) => u.metric === 'storage')?.quantity || 0,
          verifications: usages.find((u: any) => u.metric === 'verifications')?.quantity || 0,
        };
      }

      return null;
    } catch (error) {
      console.error(`Failed to get cycle usage for ${subscriptionId}:`, error);
      return null;
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    payload: string,
    signature: string
  ): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(payload)
        .digest('hex');
      
      return signature === expectedSignature;
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return false;
    }
  }

  /**
   * Parse webhook event
   */
  parseWebhookEvent(payload: string, signature: string): WebhookEvent | null {
    if (!this.verifyWebhookSignature(payload, signature)) {
      console.error('Invalid webhook signature');
      return null;
    }

    try {
      const data = JSON.parse(payload);
      return {
        event: data.event,
        payload: data.payload,
        timestamp: new Date().toISOString(),
        signature,
      };
    } catch (error) {
      console.error('Failed to parse webhook payload:', error);
      return null;
    }
  }

  /**
   * Map payment API response to Payment type
   */
  private mapPaymentResponse(data: any): Payment {
    return {
      paymentId: data.id,
      customerId: data.customer_id,
      subscriptionId: data.subscription_id,
      invoiceId: data.invoice_id,
      amount: data.amount / 100,
      currency: data.currency,
      status: data.status,
      method: data.method,
      gatewayPaymentId: data.id,
      capturedAt: data.captured_at 
        ? new Date(data.captured_at * 1000).toISOString() 
        : undefined,
      refundedAt: data.refunded_at 
        ? new Date(data.refunded_at * 1000).toISOString() 
        : undefined,
      refundedAmount: data.amount_refunded 
        ? data.amount_refunded / 100 
        : undefined,
    };
  }

  /**
   * Make authenticated API request
   */
  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: any,
    additionalHeaders?: Record<string, string>
  ): Promise<RazorpayApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...additionalHeaders,
      };

      const auth = Buffer.from(`${this.config.keyId}:${this.config.keySecret}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;

      const response = await fetch(`${this.config.apiBaseUrl}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: {
            code: errorData.error?.code || 'UNKNOWN_ERROR',
            description: errorData.error?.description || `HTTP ${response.status}`,
            field: errorData.error?.field,
          },
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error(`Razorpay API error:`, error);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          description: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }
}

// Export singleton instance
export const razorpayIntegration = new RazorpayIntegration();

// Helper functions
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function getPaymentStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    created: '#6b7280',
    authorized: '#3b82f6',
    captured: '#10b981',
    refunded: '#f59e0b',
    failed: '#ef4444',
    disputed: '#dc2626',
  };
  return colors[status];
}

export function getSubscriptionStatusColor(status: SubscriptionStatus): string {
  const colors: Record<SubscriptionStatus, string> = {
    created: '#6b7280',
    active: '#10b981',
    paused: '#f59e0b',
    cancelled: '#ef4444',
    expired: '#6b7280',
    pending: '#3b82f6',
  };
  return colors[status];
}
