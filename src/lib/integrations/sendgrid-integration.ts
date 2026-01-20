/**
 * SendGrid Email Service Integration
 * Handles transactional emails, templates, and email analytics
 */

import { z } from 'zod';
import crypto from 'crypto';

// Configuration
export interface SendGridConfig {
  apiKey: string;
  fromEmail: string;
  fromName: string;
  replyToEmail: string;
  replyToName: string;
  webhookKey: string;
  apiBaseUrl: string;
  timeout: number;
}

// Email recipient
export const emailRecipientSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export type EmailRecipient = z.infer<typeof emailRecipientSchema>;

// Email attachment
export const emailAttachmentSchema = z.object({
  content: z.string(), // Base64 encoded
  filename: z.string(),
  type: z.string().optional(),
  disposition: z.enum(['inline', 'attachment']).default('attachment'),
});

export type EmailAttachment = z.infer<typeof emailAttachmentSchema>;

// Email content
export const emailContentSchema = z.object({
  subject: z.string(),
  htmlBody: z.string().optional(),
  textBody: z.string().optional(),
  templateId: z.string().optional(),
  dynamicTemplateData: z.record(z.any()).optional(),
});

export type EmailContent = z.infer<typeof emailContentSchema>;

// Complete email
export const emailSchema = z.object({
  to: z.array(emailRecipientSchema).min(1),
  cc: z.array(emailRecipientSchema).optional(),
  bcc: z.array(emailRecipientSchema).optional(),
  from: emailRecipientSchema.optional(),
  replyTo: emailRecipientSchema.optional(),
  subject: z.string(),
  htmlBody: z.string().optional(),
  textBody: z.string().optional(),
  templateId: z.string().optional(),
  templateData: z.record(z.any()).optional(),
  attachments: z.array(emailAttachmentSchema).optional(),
  categories: z.array(z.string()).optional(),
  customArgs: z.record(z.string()).optional(),
  sendAt: z.number().optional(),
  trackingSettings: z.object({
    clickTracking: z.boolean().optional(),
    openTracking: z.boolean().optional(),
    subscriptionTracking: z.boolean().optional(),
  }).optional(),
});

export type Email = z.infer<typeof emailSchema>;

// API Response types
export interface SendGridApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: {
    message: string;
    field?: string;
    help?: string;
  }[];
}

// Email event types
export type EmailEventType = 
  | 'processed'
  | 'dropped'
  | 'delivered'
  | 'deferred'
  | 'bounced'
  | 'blocked'
  | 'spam_report'
  | 'unsubscribed'
  | 'group_unsubscribed'
  | 'group_resubscribed'
  | 'open'
  | 'click';

export interface EmailEvent {
  event: EmailEventType;
  email: string;
  timestamp: number;
  messageId: string;
  messageSid?: string;
  reason?: string;
  ip?: string;
  userAgent?: string;
  url?: string;
  sgEventId: string;
  sgMessageId: string;
  templateId?: string;
}

// Template types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  plainTextContent?: string;
  categories: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Analytics types
export interface EmailAnalytics {
  period: {
    start: string;
    end: string;
  };
  metrics: {
    requested: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    blocked: number;
    spamReported: number;
    unsubscribed: number;
  };
  rates: {
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
    spamReportRate: number;
  };
}

// Predefined template IDs
export const EMAIL_TEMPLATES = {
  VERIFICATION_SUBMITTED: 'd-verification-submitted',
  VERIFICATION_APPROVED: 'd-verification-approved',
  VERIFICATION_REJECTED: 'd-verification-rejected',
  VERIFICATION_REMINDER: 'd-verification-reminder',
  APPEAL_SUBMITTED: 'd-appeal-submitted',
  APPEAL_REVIEWED: 'd-appeal-reviewed',
  TIER_UPGRADE_OFFER: 'd-tier-upgrade-offer',
  PAYMENT_RECEIVED: 'd-payment-received',
  PAYMENT_REMINDER: 'd-payment-reminder',
  PAYMENT_FAILED: 'd-payment-failed',
  ACCOUNT_CREATED: 'd-account-created',
  PASSWORD_RESET: 'd-password-reset',
  SUPPORT_TICKET_CREATED: 'd-support-ticket-created',
  SUPPORT_TICKET_UPDATED: 'd-support-ticket-updated',
} as const;

export class SendGridIntegration {
  private config: SendGridConfig;

  constructor(config: Partial<SendGridConfig> = {}) {
    this.config = {
      apiKey: config.apiKey || process.env.SENDGRID_API_KEY || '',
      fromEmail: config.fromEmail || process.env.SENDGRID_FROM_EMAIL || 'noreply@verification-portal.com',
      fromName: config.fromName || process.env.SENDGRID_FROM_NAME || 'Verification Portal',
      replyToEmail: config.replyToEmail || process.env.SENDGRID_REPLY_TO_EMAIL || 'support@verification-portal.com',
      replyToName: config.replyToName || process.env.SENDGRID_REPLY_TO_NAME || 'Support Team',
      webhookKey: config.webhookKey || process.env.SENDGRID_WEBHOOK_KEY || '',
      apiBaseUrl: config.apiBaseUrl || 'https://api.sendgrid.com/v3',
      timeout: config.timeout || 30000,
    };
  }

  /**
   * Send single email
   */
  async sendEmail(email: Email): Promise<{ messageId: string; success: boolean } | null> {
    try {
      const payload = this.buildEmailPayload(email);
      
      const response = await this.makeRequest<{ message_uuid: string }>(
        '/mail/send',
        'POST',
        payload
      );

      if (response.success && response.data) {
        return {
          messageId: response.data.message_uuid,
          success: true,
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to send email:', error);
      return null;
    }
  }

  /**
   * Send bulk emails (up to 1000 recipients)
   */
  async sendBulkEmails(
    emails: Email[]
  ): Promise<{ messageId: string; success: boolean; recipientCount: number } | null> {
    try {
      if (emails.length === 0 || emails.length > 1000) {
        throw new Error('Email count must be between 1 and 1000');
      }

      const personalizations = emails.map(email => ({
        to: email.to.map(t => ({ email: t.email, name: t.name })),
        cc: email.cc ? email.cc.map(c => ({ email: c.email, name: c.name })) : undefined,
        bcc: email.bcc ? email.bcc.map(b => ({ email: b.email, name: b.name })) : undefined,
        subject: email.subject,
        dynamic_template_data: email.templateData,
        custom_args: email.customArgs,
        send_at: email.sendAt,
      }));

      const payload = {
        personalizations,
        from: {
          email: email.from?.email || this.config.fromEmail,
          name: email.from?.name || this.config.fromName,
        },
        reply_to: {
          email: this.config.replyToEmail,
          name: this.config.replyToName,
        },
        subject: emails[0].subject, // Fallback subject
        content: emails[0].htmlBody ? [
          { type: 'text/html', value: emails[0].htmlBody },
        ] : undefined,
        template_id: emails[0].templateId,
        attachments: emails[0].attachments,
        categories: emails[0].categories,
        tracking_settings: emails[0].trackingSettings ? {
          click_tracking: { enable: emails[0].trackingSettings.clickTracking },
          open_tracking: { enable: emails[0].trackingSettings.openTracking },
          subscription_tracking: { enable: emails[0].trackingSettings.subscriptionTracking },
        } : undefined,
      };

      const response = await this.makeRequest<{ message_uuid: string }>(
        '/mail/send',
        'POST',
        payload
      );

      if (response.success && response.data) {
        return {
          messageId: response.data.message_uuid,
          success: true,
          recipientCount: emails.reduce((sum, e) => sum + e.to.length, 0),
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to send bulk emails:', error);
      return null;
    }
  }

  /**
   * Send verification status email
   */
  async sendVerificationStatusEmail(
    to: EmailRecipient,
    status: 'approved' | 'rejected' | 'pending',
    details: {
      institutionName: string;
      verificationId: string;
      submittedAt: string;
      reviewedAt?: string;
      reviewer?: string;
      rejectionReason?: string;
    }
  ): Promise<boolean> {
    const templateMap = {
      approved: EMAIL_TEMPLATES.VERIFICATION_APPROVED,
      rejected: EMAIL_TEMPLATES.VERIFICATION_REJECTED,
      pending: EMAIL_TEMPLATES.VERIFICATION_SUBMITTED,
    };

    try {
      const result = await this.sendEmail({
        to: [to],
        subject: `Verification ${status.charAt(0).toUpperCase() + status.slice(1)} - ${details.institutionName}`,
        templateId: templateMap[status],
        templateData: {
          institutionName: details.institutionName,
          verificationId: details.verificationId,
          submittedAt: details.submittedAt,
          reviewedAt: details.reviewedAt,
          reviewer: details.reviewer,
          rejectionReason: details.rejectionReason,
          status: status.charAt(0).toUpperCase() + status.slice(1),
        },
      });

      return result !== null;
    } catch (error) {
      console.error('Failed to send verification status email:', error);
      return false;
    }
  }

  /**
   * Send appeal status email
   */
  async sendAppealStatusEmail(
    to: EmailRecipient,
    status: 'submitted' | 'in_review' | 'approved' | 'rejected',
    details: {
      institutionName: string;
      appealId: string;
      originalVerificationId: string;
      submittedAt: string;
      reviewedAt?: string;
      reviewerComment?: string;
    }
  ): Promise<boolean> {
    const templateMap: Record<string, string> = {
      submitted: EMAIL_TEMPLATES.APPEAL_SUBMITTED,
      in_review: EMAIL_TEMPLATES.APPEAL_SUBMITTED,
      approved: EMAIL_TEMPLATES.APPEAL_REVIEWED,
      rejected: EMAIL_TEMPLATES.APPEAL_REVIEWED,
    };

    try {
      const result = await this.sendEmail({
        to: [to],
        subject: `Appeal ${status.replace('_', ' ')} - ${details.institutionName}`,
        templateId: templateMap[status],
        templateData: {
          institutionName: details.institutionName,
          appealId: details.appealId,
          originalVerificationId: details.originalVerificationId,
          submittedAt: details.submittedAt,
          reviewedAt: details.reviewedAt,
          reviewerComment: details.reviewerComment,
          status: status.replace('_', ' ').toUpperCase(),
        },
      });

      return result !== null;
    } catch (error) {
      console.error('Failed to send appeal status email:', error);
      return false;
    }
  }

  /**
   * Send payment confirmation email
   */
  async sendPaymentConfirmation(
    to: EmailRecipient,
    details: {
      customerName: string;
      amount: number;
      currency: string;
      invoiceId: string;
      planName: string;
      billingPeriod: string;
      transactionId: string;
    }
  ): Promise<boolean> {
    try {
      const result = await this.sendEmail({
        to: [to],
        subject: `Payment Confirmed - ${details.invoiceId}`,
        templateId: EMAIL_TEMPLATES.PAYMENT_RECEIVED,
        templateData: {
          customerName: details.customerName,
          amount: details.amount,
          currency: details.currency,
          invoiceId: details.invoiceId,
          planName: details.planName,
          billingPeriod: details.billingPeriod,
          transactionId: details.transactionId,
        },
      });

      return result !== null;
    } catch (error) {
      console.error('Failed to send payment confirmation email:', error);
      return false;
    }
  }

  /**
   * Send support ticket notification
   */
  async sendSupportTicketNotification(
    to: EmailRecipient,
    action: 'created' | 'updated' | 'resolved',
    details: {
      customerName: string;
      ticketId: string;
      subject: string;
      category: string;
      priority: string;
      assignedTo?: string;
      lastUpdate?: string;
      updateNote?: string;
    }
  ): Promise<boolean> {
    const templateMap: Record<string, string> = {
      created: EMAIL_TEMPLATES.SUPPORT_TICKET_CREATED,
      updated: EMAIL_TEMPLATES.SUPPORT_TICKET_UPDATED,
      resolved: EMAIL_TEMPLATES.SUPPORT_TICKET_UPDATED,
    };

    try {
      const result = await this.sendEmail({
        to: [to],
        subject: `[Ticket ${action === 'created' ? 'Created' : 'Updated'}] ${details.ticketId} - ${details.subject}`,
        templateId: templateMap[action],
        templateData: {
          customerName: details.customerName,
          ticketId: details.ticketId,
          subject: details.subject,
          category: details.category,
          priority: details.priority,
          assignedTo: details.assignedTo,
          lastUpdate: details.lastUpdate,
          updateNote: details.updateNote,
          action: action.charAt(0).toUpperCase() + action.slice(1),
        },
      });

      return result !== null;
    } catch (error) {
      console.error('Failed to send support ticket notification:', error);
      return false;
    }
  }

  /**
   * Get email analytics for a date range
   */
  async getAnalytics(
    startDate: Date,
    endDate: Date
  ): Promise<EmailAnalytics | null> {
    try {
      const params = new URLSearchParams({
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      });

      const response = await this.makeRequest<any>(
        `/stats?${params.toString()}`,
        'GET'
      );

      if (response.success && response.data) {
        // Aggregate stats from response
        const metrics = response.data.reduce((acc: any, day: any) => {
          const stats = day.stats?.[0] || {};
          acc.requested += stats.requests || 0;
          acc.delivered += stats.delivered || 0;
          acc.opened += stats.unique_opens || 0;
          acc.clicked += stats.unique_clicks || 0;
          acc.bounced += stats.bounces || 0;
          acc.blocked += stats.blocks || 0;
          acc.spamReported += stats.spam_reports || 0;
          acc.unsubscribed += stats.unsubscribes || 0;
          return acc;
        }, {
          requested: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          bounced: 0,
          blocked: 0,
          spamReported: 0,
          unsubscribed: 0,
        });

        return {
          period: {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          },
          metrics,
          rates: {
            deliveryRate: metrics.requested > 0 ? (metrics.delivered / metrics.requested) * 100 : 0,
            openRate: metrics.delivered > 0 ? (metrics.opened / metrics.delivered) * 100 : 0,
            clickRate: metrics.delivered > 0 ? (metrics.clicked / metrics.delivered) * 100 : 0,
            bounceRate: metrics.requested > 0 ? (metrics.bounced / metrics.requested) * 100 : 0,
            spamReportRate: metrics.requested > 0 ? (metrics.spamReported / metrics.requested) * 100 : 0,
          },
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to get email analytics:', error);
      return null;
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhookKey)
        .update(payload)
        .digest('hex');
      
      return signature === expectedSignature;
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return false;
    }
  }

  /**
   * Parse webhook events
   */
  parseWebhookEvents(payload: string): EmailEvent[] {
    try {
      const data = JSON.parse(payload);
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error('Failed to parse webhook payload:', error);
      return [];
    }
  }

  /**
   * Create or update dynamic template
   */
  async createTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailTemplate | null> {
    try {
      const response = await this.makeRequest<any>(
        '/templates',
        'POST',
        {
          name: template.name,
          generation: 'dynamic',
        }
      );

      if (response.success && response.data) {
        // Set template content
        await this.setTemplateContent(response.data.id, template);
        
        return {
          id: response.data.id,
          ...template,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to create template:', error);
      return null;
    }
  }

  /**
   * Set template content
   */
  private async setTemplateContent(
    templateId: string,
    template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<boolean> {
    try {
      const response = await this.makeRequest(
        `/templates/${templateId}/versions`,
        'POST',
        {
          subject: template.subject,
          html_content: template.htmlContent,
          plain_text_content: template.plainTextContent,
          active: template.active ? 1 : 0,
        }
      );

      return response.success;
    } catch (error) {
      console.error('Failed to set template content:', error);
      return false;
    }
  }

  /**
   * Build email payload from Email type
   */
  private buildEmailPayload(email: Email): any {
    const payload: any = {
      personalizations: [{
        to: email.to.map(t => ({ email: t.email, name: t.name })),
        subject: email.subject,
      }],
      from: {
        email: email.from?.email || this.config.fromEmail,
        name: email.from?.name || this.config.fromName,
      },
      reply_to: email.replyTo ? {
        email: email.replyTo.email,
        name: email.replyTo.name,
      } : {
        email: this.config.replyToEmail,
        name: this.config.replyToName,
      },
    };

    if (email.cc) {
      payload.personalizations[0].cc = email.cc.map(c => ({ email: c.email, name: c.name }));
    }

    if (email.bcc) {
      payload.personalizations[0].bcc = email.bcc.map(b => ({ email: b.email, name: b.name }));
    }

    if (email.templateId) {
      payload.template_id = email.templateId;
      payload.dynamic_template_data = email.templateData;
    } else {
      if (email.htmlBody) {
        payload.content = [{ type: 'text/html', value: email.htmlBody }];
      }
      if (email.textBody) {
        payload.content = payload.content || [];
        payload.content.push({ type: 'text/plain', value: email.textBody });
      }
    }

    if (email.attachments) {
      payload.attachments = email.attachments.map(a => ({
        content: a.content,
        filename: a.filename,
        type: a.type,
        disposition: a.disposition,
      }));
    }

    if (email.categories) {
      payload.categories = email.categories;
    }

    if (email.customArgs) {
      payload.custom_args = email.customArgs;
    }

    if (email.sendAt) {
      payload.send_at = email.sendAt;
    }

    if (email.trackingSettings) {
      payload.tracking_settings = {
        click_tracking: { enable: email.trackingSettings.clickTracking },
        open_tracking: { enable: email.trackingSettings.openTracking },
        subscription_tracking: { enable: email.trackingSettings.subscriptionTracking },
      };
    }

    return payload;
  }

  /**
   * Make API request
   */
  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: any
  ): Promise<SendGridApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const headers: Record<string, string> = {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      };

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
          errors: errorData.errors || [{ message: `HTTP ${response.status}` }],
        };
      }

      // POST requests to /mail/send return empty body on success
      if (method === 'POST' && endpoint === '/mail/send') {
        return {
          success: true,
          data: { message_uuid: response.headers.get('x-message-id') || 'unknown' },
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error(`SendGrid API error:`, error);
      return {
        success: false,
        errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }],
      };
    }
  }
}

// Export singleton instance
export const sendgridIntegration = new SendGridIntegration();

// Helper function to generate email verification link
export function generateVerificationEmailLink(
  baseUrl: string,
  token: string,
  email: string
): string {
  const params = new URLSearchParams({
    token,
    email: encodeURIComponent(email),
  });
  return `${baseUrl}/verify-email?${params.toString()}`;
}

// Helper function to generate password reset link
export function generatePasswordResetLink(
  baseUrl: string,
  token: string,
  email: string
): string {
  const params = new URLSearchParams({
    token,
    email: encodeURIComponent(email),
  });
  return `${baseUrl}/reset-password?${params.toString()}`;
}
