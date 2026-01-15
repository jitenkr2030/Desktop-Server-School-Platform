/**
 * Account Health Management System
 * Monitors organization health, detects issues, and triggers proactive outreach
 */

import { TierLevel } from './tier-types';

export type HealthStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
export type AlertType = 'usage_spike' | 'verification_failure' | 'payment_issue' | 'inactivity' | 'support_escalation' | 'security' | 'compliance';
export type OutreachChannel = 'email' | 'sms' | 'in_app' | 'phone' | 'account_manager';

export interface HealthMetric {
  id: string;
  name: string;
  value: number;
  maxValue: number;
  weight: number;
  category: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
}

export interface HealthScore {
  organizationId: string;
  overallScore: number;
  status: HealthStatus;
  metrics: HealthMetric[];
  breakdown: {
    usage: number;
    engagement: number;
    compliance: number;
    support: number;
    financial: number;
  };
  trend: 'improving' | 'declining' | 'stable';
  lastCalculated: Date;
}

export interface HealthAlert {
  id: string;
  organizationId: string;
  type: AlertType;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  recommendation: string;
  metricId?: string;
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  createdAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  outreachAttempts: OutreachAttempt[];
}

export interface OutreachAttempt {
  id: string;
  channel: OutreachChannel;
  templateId: string;
  sentAt: Date;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  response?: string;
}

export interface OutreachTemplate {
  id: string;
  name: string;
  type: AlertType;
  channel: OutreachChannel;
  subject?: string;
  content: string;
  conditions: {
    healthStatus?: HealthStatus[];
    alertSeverity?: ('info' | 'warning' | 'critical')[];
    tierLevel?: TierLevel[];
    hoursSinceAlert?: { min: number; max: number };
  };
  priority: number;
  active: boolean;
}

export interface OrganizationHealthData {
  organizationId: string;
  tier: TierLevel;
  metrics: {
    verificationSuccess: number;
    verificationVolume: number;
    apiUsage: number;
    apiLimit: number;
    storageUsed: number;
    storageLimit: number;
    loginFrequency: number;
    lastLoginAt: Date;
    supportTicketCount: number;
    supportTicketResolutionTime: number;
    paymentStatus: 'current' | 'overdue' | 'failed';
    daysUntilPayment: number;
    documentExpiryRisk: number;
    complianceScore: number;
    teamMembersActive: number;
  };
}

// Thresholds for health metrics
const HEALTH_THRESHOLDS: Record<string, { excellent: number; good: number; fair: number }> = {
  verificationSuccess: { excellent: 95, good: 85, fair: 70 },
  apiUsage: { excellent: 30, good: 60, fair: 85 }, // Lower is better (percentage)
  storageUsed: { excellent: 30, good: 60, fair: 85 },
  loginFrequency: { excellent: 7, good: 3, fair: 1 }, // Days since last login (lower is better)
  supportTicketResolutionTime: { excellent: 24, good: 48, fair: 72 },
  complianceScore: { excellent: 95, good: 85, fair: 70 },
  paymentStatus: { excellent: 30, good: 15, fair: 7 } // Days until payment due
};

// Outreach templates
export const OUTREACH_TEMPLATES: OutreachTemplate[] = [
  {
    id: 'welcome_onboarding',
    name: 'Welcome & Onboarding',
    type: 'inactivity',
    channel: 'email',
    subject: 'Welcome to Our Platform! Let\'s Get Started',
    content: 'Welcome aboard! We\'re excited to have you. Here are some resources to help you get started...',
    conditions: { hoursSinceAlert: { min: 0, max: 24 } },
    priority: 10,
    active: true
  },
  {
    id: 'usage_insight',
    name: 'Usage Insight',
    type: 'usage_spike',
    channel: 'email',
    subject: 'Your Usage Has Increased',
    content: 'We noticed a significant increase in your verification volume. Here are some tips to optimize...',
    conditions: { alertSeverity: ['info'] },
    priority: 5,
    active: true
  },
  {
    id: 'upgrade_recommendation',
    name: 'Upgrade Recommendation',
    type: 'usage_spike',
    channel: 'email',
    subject: 'You\'re Approaching Your Usage Limits',
    content: 'Great news! Your usage has been growing. Consider upgrading to the next tier for more capacity...',
    conditions: { 
      alertSeverity: ['warning'],
      tierLevel: ['starter', 'growth']
    },
    priority: 8,
    active: true
  },
  {
    id: 'verification_help',
    name: 'Verification Help',
    type: 'verification_failure',
    channel: 'email',
    subject: 'We Can Help With Your Verification',
    content: 'We noticed some verification challenges. Our team is here to help you resolve these issues...',
    conditions: {},
    priority: 7,
    active: true
  },
  {
    id: 'payment_reminder',
    name: 'Payment Reminder',
    type: 'payment_issue',
    channel: 'email',
    subject: 'Upcoming Payment Reminder',
    content: 'This is a friendly reminder that your subscription renewal is coming up...',
    conditions: { hoursSinceAlert: { min: 48, max: 168 } },
    priority: 9,
    active: true
  },
  {
    id: 'critical_alert',
    name: 'Critical Alert',
    type: 'payment_issue',
    channel: 'sms',
    subject: 'Urgent: Account Action Required',
    content: 'Your account requires immediate attention. Please log in to resolve the issue...',
    conditions: { 
      alertSeverity: ['critical'],
      tierLevel: ['scale', 'enterprise']
    },
    priority: 10,
    active: true
  }
];

export class HealthManager {
  private organizationId: string;

  constructor(organizationId: string) {
    this.organizationId = organizationId;
  }

  /**
   * Calculate comprehensive health score
   */
  calculateHealthScore(data: OrganizationHealthData): HealthScore {
    const metrics: HealthMetric[] = [];

    // Verification Success Rate
    metrics.push(this.createMetric(
      'verification_success',
      'Verification Success Rate',
      data.verificationSuccess,
      100,
      25,
      'compliance',
      data.verificationSuccess >= 95 ? 'up' : data.verificationSuccess >= 85 ? 'stable' : 'down'
    ));

    // API Usage
    const apiUsagePercent = (data.apiUsage / data.apiLimit) * 100;
    metrics.push(this.createMetric(
      'api_usage',
      'API Usage',
      apiUsagePercent,
      100,
      15,
      'usage',
      apiUsagePercent < 30 ? 'up' : apiUsagePercent < 60 ? 'stable' : 'down'
    ));

    // Storage Usage
    const storagePercent = (data.storageUsed / data.storageLimit) * 100;
    metrics.push(this.createMetric(
      'storage_usage',
      'Storage Usage',
      storagePercent,
      100,
      10,
      'usage',
      storagePercent < 30 ? 'up' : storagePercent < 60 ? 'stable' : 'down'
    ));

    // Login Activity
    const daysSinceLogin = Math.floor(
      (Date.now() - new Date(data.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    metrics.push(this.createMetric(
      'login_activity',
      'Login Activity',
      daysSinceLogin,
      30,
      10,
      'engagement',
      daysSinceLogin <= 1 ? 'up' : daysSinceLogin <= 7 ? 'stable' : 'down'
    ));

    // Support Health
    metrics.push(this.createMetric(
      'support_health',
      'Support Resolution Time',
      data.supportTicketResolutionTime,
      168,
      10,
      'support',
      data.supportTicketResolutionTime <= 24 ? 'up' : data.supportTicketResolutionTime <= 48 ? 'stable' : 'down'
    ));

    // Payment Status
    metrics.push(this.createMetric(
      'payment_health',
      'Payment Status',
      data.daysUntilPayment,
      30,
      10,
      'financial',
      data.daysUntilPayment >= 15 ? 'up' : data.daysUntilPayment >= 7 ? 'stable' : 'down'
    ));

    // Compliance Score
    metrics.push(this.createMetric(
      'compliance_score',
      'Compliance Score',
      data.complianceScore,
      100,
      10,
      'compliance',
      data.complianceScore >= 95 ? 'up' : data.complianceScore >= 85 ? 'stable' : 'down'
    ));

    // Team Engagement
    metrics.push(this.createMetric(
      'team_engagement',
      'Active Team Members',
      data.teamMembersActive,
      50,
      10,
      'engagement',
      data.teamMembersActive >= 5 ? 'up' : 'stable'
    ));

    // Calculate weighted scores
    const categoryScores = this.calculateCategoryScores(metrics);
    const overallScore = this.calculateOverallScore(metrics);

    return {
      organizationId: this.organizationId,
      overallScore,
      status: this.getStatusFromScore(overallScore),
      metrics,
      breakdown: categoryScores,
      trend: this.calculateTrend(metrics),
      lastCalculated: new Date()
    };
  }

  /**
   * Create a health metric
   */
  private createMetric(
    id: string,
    name: string,
    value: number,
    maxValue: number,
    weight: number,
    category: string,
    trend: 'up' | 'down' | 'stable'
  ): HealthMetric {
    // Normalize value to 0-100 scale
    const normalizedValue = Math.min(100, Math.max(0, (value / maxValue) * 100));
    
    return {
      id,
      name,
      value: Math.round(value * 100) / 100,
      maxValue,
      weight,
      category,
      trend,
      lastUpdated: new Date()
    };
  }

  /**
   * Calculate scores by category
   */
  private calculateCategoryScores(metrics: HealthMetric[]): HealthScore['breakdown'] {
    const categories = ['usage', 'engagement', 'compliance', 'support', 'financial'];
    const breakdown: HealthScore['breakdown'] = {
      usage: 0,
      engagement: 0,
      compliance: 0,
      support: 0,
      financial: 0
    };

    categories.forEach(category => {
      const categoryMetrics = metrics.filter(m => m.category === category);
      if (categoryMetrics.length > 0) {
        const totalWeight = categoryMetrics.reduce((sum, m) => sum + m.weight, 0);
        const weightedScore = categoryMetrics.reduce((sum, m) => {
          const normalizedValue = (m.value / m.maxValue) * 100;
          return sum + (normalizedValue * m.weight);
        }, 0) / totalWeight;
        breakdown[category as keyof typeof breakdown] = Math.round(weightedScore);
      }
    });

    return breakdown;
  }

  /**
   * Calculate overall health score
   */
  private calculateOverallScore(metrics: HealthMetric[]): number {
    const totalWeight = metrics.reduce((sum, m) => sum + m.weight, 0);
    const weightedScore = metrics.reduce((sum, m) => {
      const normalizedValue = (m.value / m.maxValue) * 100;
      return sum + (normalizedValue * m.weight);
    }, 0) / totalWeight;

    return Math.round(weightedScore);
  }

  /**
   * Get health status from score
   */
  private getStatusFromScore(score: number): HealthStatus {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (selectors >= 60) return 'fair';
    if (score >= 40) return 'poor';
    return 'critical';
  }

  /**
   * Calculate trend from metrics
   */
  private calculateTrend(metrics: HealthMetric[]): 'improving' | 'declining' | 'stable' {
    const trends = metrics.map(m => m.trend);
    const improvingCount = trends.filter(t => t === 'up').length;
    const decliningCount = trends.filter(t => t === 'down').length;

    if (improvingCount > decliningCount + 1) return 'improving';
    if (decliningCount > improvingCount + 1) return 'declining';
    return 'stable';
  }

  /**
   * Detect issues and generate alerts
   */
  detectIssues(data: OrganizationHealthData): HealthAlert[] {
    const alerts: HealthAlert[] = [];

    // Check verification success rate
    if (data.verificationSuccess < 70) {
      alerts.push(this.createAlert(
        'verification_failure',
        'critical',
        'Low Verification Success Rate',
        `Your verification success rate has dropped to ${data.verificationSuccess}%.`,
        'Review recent verification failures and check our documentation for common issues.',
        'verification_success'
      ));
    } else if (data.verificationSuccess < 85) {
      alerts.push(this.createAlert(
        'verification_failure',
        'warning',
        'Verification Success Rate Declining',
        `Your verification success rate is at ${data.verificationSuccess}%.`,
        'Consider reviewing the verification guide to improve success rates.',
        'verification_success'
      ));
    }

    // Check API usage
    const apiUsagePercent = (data.apiUsage / data.apiLimit) * 100;
    if (apiUsagePercent >= 90) {
      alerts.push(this.createAlert(
        'usage_spike',
        'critical',
        'API Usage Critical',
        `API usage is at ${apiUsagePercent}% of your limit.`,
        'Consider upgrading your plan or optimizing API usage.',
        'api_usage'
      ));
    } else if (apiUsagePercent >= 75) {
      alerts.push(this.createAlert(
        'usage_spike',
        'warning',
        'API Usage High',
        `API usage is at ${apiUsagePercent}% of your limit.`,
        'Monitor your usage and consider upgrading soon.',
        'api_usage'
      ));
    }

    // Check storage usage
    const storagePercent = (data.storageUsed / data.storageLimit) * 100;
    if (storagePercent >= 90) {
      alerts.push(this.createAlert(
        'usage_spike',
        'critical',
        'Storage Critical',
        `Storage usage is at ${storagePercent}% of your limit.`,
        'Delete old documents or upgrade your storage limit.',
        'storage_usage'
      ));
    }

    // Check login activity
    const daysSinceLogin = Math.floor(
      (Date.now() - new Date(data.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceLogin > 14) {
      alerts.push(this.createAlert(
        'inactivity',
        'warning',
        'Account Inactivity',
        `No login for ${daysSinceLogin} days.`,
        'Log in to your account to stay connected and catch up on updates.',
        'login_activity'
      ));
    }

    // Check payment status
    if (data.paymentStatus === 'overdue') {
      alerts.push(this.createAlert(
        'payment_issue',
        'critical',
        'Payment Overdue',
        'Your subscription payment is overdue.',
        'Update your payment information to avoid service interruption.',
        'payment_health'
      ));
    } else if (data.daysUntilPayment <= 3 && data.paymentStatus === 'current') {
      alerts.push(this.createAlert(
        'payment_issue',
        'info',
        'Upcoming Payment',
        `Your subscription will renew in ${data.daysUntilPayment} days.`,
        'Ensure your payment method is up to date.',
        'payment_health'
      ));
    }

    // Check support tickets
    if (data.supportTicketCount > 5 && data.supportTicketResolutionTime > 72) {
      alerts.push(this.createAlert(
        'support_escalation',
        'warning',
        'Support Ticket Backlog',
        `You have ${data.supportTicketCount} open tickets with an average resolution time of ${data.supportTicketResolutionTime} hours.`,
        'Consider reaching out directly for faster resolution.',
        'support_health'
      ));
    }

    // Check compliance risks
    if (data.documentExpiryRisk > 50) {
      alerts.push(this.createAlert(
        'compliance',
        'warning',
        'Document Expiration Risk',
        `${data.documentExpiryRisk}% of your documents are expiring soon.`,
        'Review and update expiring documents to maintain compliance.',
        'compliance_score'
      ));
    }

    return alerts;
  }

  /**
   * Create a health alert
   */
  private createAlert(
    type: AlertType,
    severity: 'info' | 'warning' | 'critical',
    title: string,
    description: string,
    recommendation: string,
    metricId?: string
  ): HealthAlert {
    return {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      organizationId: this.organizationId,
      type,
      severity,
      title,
      description,
      recommendation,
      metricId,
      status: 'active',
      createdAt: new Date(),
      outreachAttempts: []
    };
  }

  /**
   * Get appropriate outreach template for an alert
   */
  getOutreachTemplate(
    alert: HealthAlert,
    tier: TierLevel,
    hoursSinceAlert: number
  ): OutreachTemplate | null {
    const eligibleTemplates = OUTREACH_TEMPLATES.filter(template => {
      // Check if template is active
      if (!template.active) return false;

      // Check if template type matches alert type
      if (template.type !== alert.type) return false;

      // Check conditions
      if (template.conditions.healthStatus && 
          !template.conditions.healthStatus.includes(this.getStatusFromScore(75))) {
        return false;
      }

      if (template.conditions.alertSeverity && 
          !template.conditions.alertSeverity.includes(alert.severity)) {
        return false;
      }

      if (template.conditions.tierLevel && 
          !template.conditions.tierLevel.includes(tier)) {
        return false;
      }

      if (template.conditions.hoursSinceAlert) {
        const { min, max } = template.conditions.hoursSinceAlert;
        if (hoursSinceAlert < min || hoursSinceAlert > max) {
          return false;
        }
      }

      return true;
    });

    // Return highest priority template
    return eligibleTemplates.sort((a, b) => b.priority - a.priority)[0] || null;
  }

  /**
   * Generate personalized recommendations
   */
  generateRecommendations(healthScore: HealthScore): string[] {
    const recommendations: string[] = [];

    // Check each metric for improvement opportunities
    healthScore.metrics.forEach(metric => {
      const normalizedValue = (metric.value / metric.maxValue) * 100;
      const threshold = HEALTH_THRESHOLDS[metric.id];
      
      if (threshold && normalizedValue < threshold.fair) {
        recommendations.push(this.getRecommendationForMetric(metric));
      }
    });

    return recommendations;
  }

  /**
   * Get recommendation for a specific metric
   */
  private getRecommendationForMetric(metric: HealthMetric): string {
    const recommendations: Record<string, string> = {
      verification_success: 'Review our verification best practices guide to improve success rates',
      api_usage: 'Consider upgrading your plan or optimizing API calls for better efficiency',
      storage_usage: 'Clean up old documents or upgrade your storage limit',
      login_activity: 'Log in regularly to stay updated with new features and security updates',
      support_health: 'Check our documentation first - it may have answers to your questions',
      payment_health: 'Ensure your payment method is up to date to avoid service interruption',
      compliance_score: 'Review compliance requirements and update any outdated documents',
      team_engagement: 'Invite more team members or check if they need access permissions'
    };

    return recommendations[metric.id] || `Improve your ${metric.name} metric`;
  }

  /**
   * Predict potential issues based on trends
   */
  predictIssues(metrics: HealthMetric[]): { type: AlertType; likelihood: number; timeframe: string }[] {
    const predictions: { type: AlertType; likelihood: number; timeframe: string }[] = [];

    metrics.forEach(metric => {
      if (metric.trend === 'down') {
        const normalizedValue = (metric.value / metric.maxValue) * 100;
        const threshold = HEALTH_THRESHOLDS[metric.id];

        if (threshold && normalizedValue < threshold.good) {
          const likelihood = Math.round(100 - normalizedValue);
          predictions.push({
            type: this.getAlertTypeForMetric(metric.id),
            likelihood: Math.min(likelihood, 95),
            timeframe: this.estimateTimeframe(metric)
          });
        }
      }
    });

    return predictions.sort((a, b) => b.likelihood - a.likelihood);
  }

  /**
   * Get alert type for a metric
   */
  private getAlertTypeForMetric(metricId: string): AlertType {
    const mapping: Record<string, AlertType> = {
      verification_success: 'verification_failure',
      api_usage: 'usage_spike',
      storage_usage: 'usage_spike',
      login_activity: 'inactivity',
      support_health: 'support_escalation',
      payment_health: 'payment_issue',
      compliance_score: 'compliance',
      team_engagement: 'inactivity'
    };
    return mapping[metricId] || 'usage_spike';
  }

  /**
   * Estimate timeframe for issue to occur
   */
  private estimateTimeframe(metric: HealthMetric): string {
    const normalizedValue = (metric.value / metric.maxValue) * 100;
    const declineRate = metric.trend === 'down' ? 5 : 0; // Approximate daily decline

    if (declineRate === 0) return 'Unknown';

    const daysToThreshold = Math.max(0, (normalizedValue - 50) / declineRate);

    if (daysToThreshold <= 1) return 'Within 24 hours';
    if (daysToThreshold <= 7) return `Within ${Math.ceil(daysToThreshold)} days`;
    if (daysToThreshold <= 30) return `Within ${Math.ceil(daysToThreshold / 7)} weeks`;
    return `Within ${Math.ceil(daysToThreshold / 30)} months`;
  }

  /**
   * Generate health summary for dashboard
   */
  generateHealthSummary(score: HealthScore): {
    status: HealthStatus;
    summary: string;
    topIssues: string[];
    recommendations: string[];
  } {
    const statusMessages: Record<HealthStatus, string> = {
      excellent: 'Your account is in excellent health! Keep up the great work.',
      good: 'Your account is in good shape. A few minor improvements can be made.',
      fair: 'Your account health needs attention. Review the recommendations below.',
      poor: 'Your account has significant issues that need prompt attention.',
      critical: 'Your account requires immediate attention. Please review the alerts.'
    };

    return {
      status: score.status,
      summary: statusMessages[score.status],
      topIssues: score.metrics
        .filter(m => (m.value / m.maxValue) * 100 < 70)
        .map(m => m.name),
      recommendations: this.generateRecommendations(score)
    };
  }
}

export const createHealthManager = (organizationId: string) => {
  return new HealthManager(organizationId);
};
