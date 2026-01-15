/**
 * Integration Manager
 * Centralized coordination of all third-party service integrations
 */

import { 
  AICTEIntegration, 
  aicteIntegration,
  Institution,
  AICTEApprovalStatus,
  validateInstitutionData,
  isInstitutionApproved,
  getApprovalStatusDisplay
} from './aicte-integration';

import { 
  NCTEIntegration, 
  ncteIntegration,
  NCTEInstitution,
  NCTEVerificationResult,
  getInstitutionTypeDisplay,
  getCourseStatusDisplay
} from './ncte-integration';

import { 
  RazorpayIntegration, 
  razorpayIntegration,
  Customer,
  Plan,
  Subscription,
  Payment,
  Invoice,
  UsageRecord
} from './razorpay-integration';

import { 
  SendGridIntegration, 
  sendgridIntegration,
  EmailRecipient,
  Email,
  EMAIL_TEMPLATES
} from './sendgrid-integration';

import { 
  S3StorageIntegration, 
  s3StorageIntegration,
  DocumentMetadata,
  UploadOptions,
  formatBytes,
  StorageClass
} from './s3-storage';

// Unified institution type
export type InstitutionType = 'technical' | 'teacher_education' | 'general';
export type UnifiedInstitutionStatus = 'verified' | 'pending' | 'unverified' | 'expired' | 'rejected';

export interface UnifiedInstitution {
  id: string;
  type: InstitutionType;
  name: string;
  address: string;
  state: string;
  district: string;
  pincode: string;
  establishmentYear: number;
  status: UnifiedInstitutionStatus;
  approvalDetails: {
    authority: string;
    applicationId: string;
    status: string;
    approvalDate?: string;
    expiryDate?: string;
  };
  programs: {
    name: string;
    level: string;
    intake: number;
    approved: boolean;
  }[];
  lastVerifiedAt: string;
  metadata: Record<string, any>;
}

// Verification request types
export interface VerificationRequest {
  institutionId: string;
  institutionType: InstitutionType;
  documents: {
    type: string;
    documentId: string;
    category: DocumentMetadata['category'];
  }[];
  priority?: 'standard' | 'express';
  notes?: string;
}

export interface VerificationResult {
  requestId: string;
  institutionId: string;
  status: 'pending' | 'completed' | 'failed';
  result?: {
    verified: boolean;
    authority: string;
    approvalStatus: string;
    details: any;
  };
  error?: string;
  completedAt?: string;
}

// Integration health status
export interface IntegrationHealth {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  lastChecked: string;
  error?: string;
}

// Batch operation result
export interface BatchResult<T> {
  success: T[];
  failed: { item: string; error: string }[];
  total: number;
  completedAt: string;
}

export class IntegrationManager {
  // Service instances
  private aicte: AICTEIntegration;
  private ncte: NCTEIntegration;
  private razorpay: RazorpayIntegration;
  private sendgrid: SendGridIntegration;
  private s3: S3StorageIntegration;

  constructor() {
    this.aicte = aicteIntegration;
    this.ncte = ncteIntegration;
    this.razorpay = razorpayIntegration;
    this.sendgrid = sendgridIntegration;
    this.s3 = s3StorageIntegration;
  }

  // ==================== Institution Verification ====================

  /**
   * Verify institution across all relevant authorities
   */
  async verifyInstitution(
    institutionId: string,
    type: InstitutionType
  ): Promise<VerificationResult> {
    const requestId = `vr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    try {
      let result;

      switch (type) {
        case 'technical':
          const aicteStatus = await this.aicte.verifyInstitutionApproval(institutionId);
          result = {
            verified: isInstitutionApproved(aicteStatus!),
            authority: 'AICTE',
            approvalStatus: aicteStatus?.approvalStatus || 'unknown',
            details: aicteStatus,
          };
          break;

        case 'teacher_education':
          const ncteResult = await this.ncte.verifyInstitution(institutionId);
          result = {
            verified: ncteResult?.isVerified || false,
            authority: 'NCTE',
            approvalStatus: ncteResult?.details?.courses?.[0]?.status || 'unknown',
            details: ncteResult,
          };
          break;

        default:
          throw new Error(`Unsupported institution type: ${type}`);
      }

      return {
        requestId,
        institutionId,
        status: 'completed',
        result,
        completedAt: new Date().toISOString(),
      };
    } catch (error) {
      return {
        requestId,
        institutionId,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Batch verify multiple institutions
   */
  async batchVerifyInstitutions(
    requests: VerificationRequest[]
  ): Promise<BatchResult<VerificationResult>> {
    const results: VerificationResult[] = [];
    const failed: { item: string; error: string }[] = [];

    for (const request of requests) {
      const result = await this.verifyInstitution(
        request.institutionId,
        request.institutionType
      );
      
      if (result.status === 'failed') {
        failed.push({
          item: request.institutionId,
          error: result.error || 'Unknown error',
        });
      }
      
      results.push(result);
    }

    return {
      success: results.filter(r => r.status === 'completed'),
      failed,
      total: requests.length,
      completedAt: new Date().toISOString(),
    };
  }

  /**
   * Get unified institution data
   */
  async getUnifiedInstitution(
    institutionId: string,
    type: InstitutionType
  ): Promise<UnifiedInstitution | null> {
    try {
      if (type === 'technical') {
        const aicteData = await this.aicte.getInstitutionDetails(institutionId);
        const aicteStatus = await this.aicte.verifyInstitutionApproval(institutionId);

        if (!aicteData) return null;

        return {
          id: institutionId,
          type,
          name: aicteData.name,
          address: aicteData.address,
          state: aicteData.state,
          district: aicteData.district,
          pincode: aicteData.pincode,
          establishmentYear: aicteData.establishmentYear,
          status: isInstitutionApproved(aicteStatus!) ? 'verified' : 'pending',
          approvalDetails: {
            authority: 'AICTE',
            applicationId: aicteStatus?.aicteApplicationId || '',
            status: aicteStatus?.approvalStatus || 'unknown',
            approvalDate: aicteStatus?.approvalDate,
            expiryDate: aicteStatus?.expiryDate,
          },
          programs: aicteStatus?.approvedPrograms?.map(p => ({
            name: p.programName,
            level: p.level,
            intake: p.intake,
            approved: true,
          })) || [],
          lastVerifiedAt: aicteStatus?.lastVerifiedAt || new Date().toISOString(),
          metadata: aicteData,
        };
      } else if (type === 'teacher_education') {
        const ncteData = await this.ncte.verifyInstitution(institutionId);

        if (!ncteData) return null;

        return {
          id: institutionId,
          type,
          name: ncteData.details.institutionName,
          address: ncteData.details.address,
          state: ncteData.details.state,
          district: ncteData.details.district,
          pincode: ncteData.details.pincode,
          establishmentYear: ncteData.details.establishmentYear,
          status: ncteData.isVerified ? 'verified' : 'pending',
          approvalDetails: {
            authority: 'NCTE',
            applicationId: ncteData.details.ncteApplicationNumber,
            status: ncteData.details.courses?.[0]?.status || 'unknown',
          },
          programs: ncteData.details.courses.map(c => ({
            name: c.courseName,
            level: c.duration.toString(),
            intake: c.approvedIntake,
            approved: c.status === 'approved',
          })),
          lastVerifiedAt: new Date().toISOString(),
          metadata: ncteData.details,
        };
      }

      return null;
    } catch (error) {
      console.error(`Failed to get unified institution ${institutionId}:`, error);
      return null;
    }
  }

  // ==================== Document Management ====================

  /**
   * Upload document with verification
   */
  async uploadVerificationDocument(
    organizationId: string,
    buffer: Buffer,
    options: {
      fileName: string;
      mimeType: string;
      category: DocumentMetadata['category'];
      uploadedBy: string;
      tags?: string[];
    }
  ): Promise<{ documentId: string; location: string } | null> {
    const result = await this.s3.uploadDocument(buffer, {
      organizationId,
      ...options,
    });

    if (result) {
      // Log document upload for audit
      console.log(`Document uploaded: ${result.documentId} for organization ${organizationId}`);
    }

    return result;
  }

  /**
   * Get document download URL
   */
  async getDocumentUrl(
    documentId: string,
    fileName?: string,
    expiresIn: number = 3600
  ): Promise<string | null> {
    return this.s3.getPresignedDownloadUrl(documentId, expiresIn, fileName);
  }

  /**
   * Delete document
   */
  async deleteDocument(documentId: string): Promise<boolean> {
    return this.s3.deleteDocument(documentId);
  }

  /**
   * Get organization document storage summary
   */
  async getOrganizationStorageSummary(organizationId: string): Promise<{
    totalSize: string;
    totalCount: number;
    byCategory: Record<string, { count: number; size: string }>;
  }> {
    const usage = await this.s3.getOrganizationStorageUsage(organizationId);
    
    return {
      totalSize: formatBytes(usage.totalSize),
      totalCount: usage.documentCount,
      byCategory: Object.fromEntries(
        Object.entries(usage.byCategory).map(([key, value]) => [
          key,
          { count: value.count, size: formatBytes(value.size) },
        ])
      ),
    };
  }

  // ==================== Subscription Management ====================

  /**
   * Create customer
   */
  async createCustomer(
    data: Omit<Customer, 'customerId'>
  ): Promise<Customer | null> {
    return this.razorpay.createCustomer(data);
  }

  /**
   * Create subscription
   */
  async createSubscription(
    customerId: string,
    planId: string,
    billingCycle: 'monthly' | 'annual'
  ): Promise<Subscription | null> {
    return this.razorpay.createSubscription(customerId, planId, billingCycle);
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(
    subscriptionId: string,
    immediately: boolean = false
  ): Promise<boolean> {
    if (immediately) {
      return !(await this.razorpay.cancelSubscription(subscriptionId, false));
    }
    return !(await this.razorpay.cancelSubscription(subscriptionId, true));
  }

  /**
   * Pause subscription
   */
  async pauseSubscription(subscriptionId: string): Promise<boolean> {
    return this.razorpay.pauseSubscription(subscriptionId);
  }

  /**
   * Resume subscription
   */
  async resumeSubscription(subscriptionId: string): Promise<boolean> {
    return this.razorpay.resumeSubscription(subscriptionId);
  }

  /**
   * Get subscription usage
   */
  async getSubscriptionUsage(subscriptionId: string): Promise<UsageRecord | null> {
    const usage = await this.razorpay.getCycleUsage(subscriptionId);
    if (!usage) return null;

    return {
      subscriptionId,
      metric: 'api_calls',
      quantity: usage.apiCalls,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Record usage
   */
  async recordUsage(
    subscriptionId: string,
    metric: UsageRecord['metric'],
    quantity: number
  ): Promise<boolean> {
    return this.razorpay.recordUsage(subscriptionId, metric, quantity);
  }

  // ==================== Email Notifications ====================

  /**
   * Send verification status notification
   */
  async sendVerificationNotification(
    to: EmailRecipient,
    status: 'approved' | 'rejected' | 'pending',
    details: any
  ): Promise<boolean> {
    return this.sendgrid.sendVerificationStatusEmail(to, status, details);
  }

  /**
   * Send payment notification
   */
  async sendPaymentNotification(
    to: EmailRecipient,
    type: 'confirmation' | 'reminder' | 'failed',
    details: any
  ): Promise<boolean> {
    if (type === 'confirmation') {
      return this.sendgrid.sendPaymentConfirmation(to, details);
    }
    // Add other payment templates as needed
    return false;
  }

  /**
   * Send support ticket notification
   */
  async sendSupportNotification(
    to: EmailRecipient,
    action: 'created' | 'updated' | 'resolved',
    details: any
  ): Promise<boolean> {
    return this.sendgrid.sendSupportTicketNotification(to, action, details);
  }

  /**
   * Send bulk email
   */
  async sendBulkEmail(
    recipients: EmailRecipient[],
    subject: string,
    htmlBody: string,
    category?: string
  ): Promise<{ success: boolean; recipientCount: number } | null> {
    const emails: Email[] = recipients.map(to => ({
      to: [to],
      subject,
      htmlBody,
      categories: category ? [category] : undefined,
    }));

    return this.sendgrid.sendBulkEmails(emails);
  }

  // ==================== Health Check ====================

  /**
   * Check health of all integrations
   */
  async checkHealth(): Promise<IntegrationHealth[]> {
    const checks: IntegrationHealth[] = [];
    const now = new Date().toISOString();

    // Check S3 (basic connectivity)
    const s3Start = Date.now();
    try {
      // Simple check - would use HeadBucket in production
      checks.push({
        service: 's3',
        status: 'healthy',
        latency: Date.now() - s3Start,
        lastChecked: now,
      });
    } catch (error) {
      checks.push({
        service: 's3',
        status: 'down',
        latency: Date.now() - s3Start,
        lastChecked: now,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    // Check other services
    const services = [
      { name: 'aicte', instance: this.aicte },
      { name: 'ncte', instance: this.ncte },
      { name: 'razorpay', instance: this.razorpay },
      { name: 'sendgrid', instance: this.sendgrid },
    ];

    for (const service of services) {
      const start = Date.now();
      try {
        // Simple API check - would be actual health check in production
        checks.push({
          service: service.name,
          status: 'healthy',
          latency: Date.now() - start,
          lastChecked: now,
        });
      } catch (error) {
        checks.push({
          service: service.name,
          status: 'down',
          latency: Date.now() - start,
          lastChecked: now,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return checks;
  }

  /**
   * Get overall system status
   */
  async getSystemStatus(): Promise<{
    healthy: boolean;
    integrations: IntegrationHealth[];
    recommendations: string[];
  }> {
    const health = await this.checkHealth();
    const degraded = health.filter(h => h.status === 'degraded').length;
    const down = health.filter(h => h.status === 'down').length;

    const recommendations: string[] = [];
    if (down > 0) {
      recommendations.push(`${down} integration(s) are down. Check API keys and network connectivity.`);
    }
    if (degraded > 0) {
      recommendations.push(`${degraded} integration(s) are experiencing issues. Monitor for latency.`);
    }

    return {
      healthy: down === 0,
      integrations: health,
      recommendations,
    };
  }

  // ==================== Utility Methods ====================

  /**
   * Get institution status display
   */
  getStatusDisplay(
    status: UnifiedInstitutionStatus
  ): { label: string; color: string; bgColor: string } {
    const config: Record<UnifiedInstitutionStatus, { label: string; color: string; bgColor: string }> = {
      verified: { label: 'Verified', color: '#059669', bgColor: '#d1fae5' },
      pending: { label: 'Pending', color: '#d97706', bgColor: '#fef3c7' },
      unverified: { label: 'Unverified', color: '#6b7280', bgColor: '#f1f5f9' },
      expired: { label: 'Expired', color: '#dc2626', bgColor: '#fee2e2' },
      rejected: { label: 'Rejected', color: '#dc2626', bgColor: '#fee2e2' },
    };
    return config[status];
  }

  /**
   * Calculate tier eligibility based on institution data
   */
  calculateTierEligibility(institution: UnifiedInstitution): {
    recommendedTier: 'starter' | 'growth' | 'scale' | 'enterprise';
    reasoning: string[];
  } {
    const reasoning: string[] = [];
    let score = 0;

    // Factor 1: Institution type
    if (institution.type === 'technical' || institution.type === 'teacher_education') {
      score += 1;
    }

    // Factor 2: Programs count
    const programCount = institution.programs.length;
    if (programCount >= 10) {
      score += 3;
      reasoning.push('Large number of programs suggests enterprise needs');
    } else if (programCount >= 5) {
      score += 2;
      reasoning.push('Multiple programs indicate growth potential');
    } else {
      score += 1;
    }

    // Factor 3: Total intake
    const totalIntake = institution.programs.reduce((sum, p) => sum + p.intake, 0);
    if (totalIntake >= 3000) {
      score += 3;
      reasoning.push('High student intake requires enterprise capacity');
    } else if (totalIntake >= 1500) {
      score += 2;
      reasoning.push('Moderate intake benefits from scale features');
    } else if (totalIntake >= 500) {
      score += 1;
      reasoning.push('Standard intake fits growth tier');
    }

    // Factor 4: Verification status
    if (institution.status === 'verified') {
      score += 1;
    }

    // Determine tier
    let recommendedTier: 'starter' | 'growth' | 'scale' | 'enterprise';
    if (score >= 8) {
      recommendedTier = 'enterprise';
      reasoning.push('Enterprise tier recommended for high complexity operations');
    } else if (score >= 5) {
      recommendedTier = 'scale';
      reasoning.push('Scale tier recommended for growing institutions');
    } else if (score >= 3) {
      recommendedTier = 'growth';
      reasoning.push('Growth tier recommended for established institutions');
    } else {
      recommendedTier = 'starter';
      reasoning.push('Starter tier sufficient for current needs');
    }

    return { recommendedTier, reasoning };
  }

  /**
   * Generate comprehensive report
   */
  async generateIntegrationReport(
    organizationId: string
  ): Promise<{
    organizationId: string;
    generatedAt: string;
    status: {
      overall: string;
      integrations: IntegrationHealth[];
    };
    usage: {
      storage: ReturnType<typeof this.s3.getOrganizationStorageUsage>;
      verification: number;
    };
    recommendations: string[];
  }> {
    const systemStatus = await this.getSystemStatus();
    const storageUsage = await this.s3.getOrganizationStorageUsage(organizationId);

    const recommendations: string[] = [];
    
    if (systemStatus.integrations.some(i => i.status === 'down')) {
      recommendations.push('Some integrations are currently unavailable. Contact support.');
    }
    
    if (storageUsage.totalSize > 5 * 1024 * 1024 * 1024) {
      recommendations.push('Storage usage is high. Consider upgrading storage or archiving old documents.');
    }

    return {
      organizationId,
      generatedAt: new Date().toISOString(),
      status: {
        overall: systemStatus.healthy ? 'healthy' : 'issues_detected',
        integrations: systemStatus.integrations,
      },
      usage: {
        storage: storageUsage,
        verification: 0, // Would count from database
      },
      recommendations,
    };
  }
}

// Export singleton instance
export const integrationManager = new IntegrationManager();

// Export individual integrations for direct access
export {
  aicteIntegration,
  ncteIntegration,
  razorpayIntegration,
  sendgridIntegration,
  s3StorageIntegration,
};

// Export types
export * from './aicte-integration';
export * from './ncte-integration';
export * from './razorpay-integration';
export * from './sendgrid-integration';
export * from './s3-storage';
