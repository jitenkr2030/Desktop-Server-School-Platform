/**
 * Feature Flags System
 * Defines feature availability across different subscription tiers
 */

import { TierLevel, TierFeature } from './tier-types';

// Feature flag configuration for each tier level
export const TIER_FEATURES: Record<TierLevel, TierFeature[]> = {
  starter: [
    'basic_verification',
    'document_upload',
    'email_notifications',
    'basic_analytics',
    'support_ticket',
    'api_access_limited',
    'custom_branding_limited',
    'storage_1gb'
  ],
  growth: [
    'basic_verification',
    'advanced_verification',
    'document_upload',
    'bulk_verification',
    'email_notifications',
    'sms_notifications',
    'basic_analytics',
    'advanced_analytics',
    'api_access_standard',
    'custom_branding',
    'storage_10gb',
    'priority_support',
    'integration_basic',
    'data_export'
  ],
  scale: [
    'basic_verification',
    'advanced_verification',
    'priority_verification',
    'document_upload',
    'bulk_verification',
    'automated_verification',
    'email_notifications',
    'sms_notifications',
    'webhook_notifications',
    'basic_analytics',
    'advanced_analytics',
    'predictive_analytics',
    'custom_reports',
    'api_access_extended',
    'custom_branding',
    'white_label',
    'storage_50gb',
    'priority_support',
    'dedicated_account_manager',
    'integration_advanced',
    'data_export',
    'audit_logs',
    'sla_guarantee'
  ],
  enterprise: [
    'basic_verification',
    'advanced_verification',
    'priority_verification',
    'dedicated_verification',
    'document_upload',
    'bulk_verification',
    'automated_verification',
    'custom_workflows',
    'email_notifications',
    'sms_notifications',
    'webhook_notifications',
    'push_notifications',
    'basic_analytics',
    'advanced_analytics',
    'predictive_analytics',
    'custom_reports',
    'ai_insights',
    'api_access_unlimited',
    'custom_branding',
    'white_label',
    'custom_domain',
    'storage_unlimited',
    'priority_support',
    'dedicated_account_manager',
    '24_7_support',
    'integration_enterprise',
    'data_export',
    'data_api',
    'audit_logs',
    'compliance_reports',
    'sla_guarantee',
    'custom_contracts',
    'multi_entity',
    'regional_deployment',
    'data_residency'
  ]
};

// Feature display names and descriptions
export const FEATURE_INFO: Record<TierFeature, {
  name: string;
  description: string;
  category: string;
  icon?: string;
}> = {
  // Verification Features
  basic_verification: {
    name: 'Basic Verification',
    description: 'Standard document verification with manual review',
    category: 'Verification',
    icon: 'shield-check'
  },
  advanced_verification: {
    name: 'Advanced Verification',
    description: 'Multi-layer verification with OCR and data cross-referencing',
    category: 'Verification',
    icon: 'shield-search'
  },
  priority_verification: {
    name: 'Priority Verification',
    description: 'Expedited verification with 24-hour turnaround',
    category: 'Verification',
    icon: 'zap'
  },
  dedicated_verification: {
    name: 'Dedicated Verification',
    description: 'Personal verification team with custom SLA',
    category: 'Verification',
    icon: 'users'
  },
  automated_verification: {
    name: 'Automated Verification',
    description: 'AI-powered automatic verification for eligible documents',
    category: 'Verification',
    icon: 'bot'
  },
  custom_workflows: {
    name: 'Custom Workflows',
    description: 'Create and manage custom verification workflows',
    category: 'Verification',
    icon: 'workflow'
  },

  // Document Features
  document_upload: {
    name: 'Document Upload',
    description: 'Upload and manage verification documents',
    category: 'Documents',
    icon: 'upload'
  },
  bulk_verification: {
    name: 'Bulk Verification',
    description: 'Process multiple verifications simultaneously',
    category: 'Documents',
    icon: 'files'
  },

  // Notification Features
  email_notifications: {
    name: 'Email Notifications',
    description: 'Receive verification updates via email',
    category: 'Notifications',
    icon: 'mail'
  },
  sms_notifications: {
    name: 'SMS Notifications',
    description: 'Receive urgent updates via SMS',
    category: 'Notifications',
    icon: 'message-square'
  },
  webhook_notifications: {
    name: 'Webhook Notifications',
    description: 'Real-time notifications to your systems via webhooks',
    category: 'Notifications',
    icon: 'hook'
  },
  push_notifications: {
    name: 'Push Notifications',
    description: 'Browser push notifications for instant updates',
    category: 'Notifications',
    icon: 'bell'
  },

  // Analytics Features
  basic_analytics: {
    name: 'Basic Analytics',
    description: 'View verification statistics and trends',
    category: 'Analytics',
    icon: 'bar-chart'
  },
  advanced_analytics: {
    name: 'Advanced Analytics',
    description: 'Detailed analytics with filtering and comparison',
    category: 'Analytics',
    icon: 'chart-line'
  },
  predictive_analytics: {
    name: 'Predictive Analytics',
    description: 'AI-powered predictions for rejection risks and trends',
    category: 'Analytics',
    icon: 'brain'
  },
  custom_reports: {
    name: 'Custom Reports',
    description: 'Create and schedule custom reports',
    category: 'Analytics',
    icon: 'file-text'
  },
  ai_insights: {
    name: 'AI Insights',
    description: 'AI-generated insights and recommendations',
    category: 'Analytics',
    icon: 'sparkles'
  },

  // API Features
  api_access_limited: {
    name: 'Limited API Access',
    description: 'Up to 1,000 API calls per month',
    category: 'API',
    icon: 'api'
  },
  api_access_standard: {
    name: 'Standard API Access',
    description: 'Up to 10,000 API calls per month',
    category: 'API',
    icon: 'api'
  },
  api_access_extended: {
    name: 'Extended API Access',
    description: 'Up to 100,000 API calls per month',
    category: 'API',
    icon: 'api'
  },
  api_access_unlimited: {
    name: 'Unlimited API Access',
    description: 'Unlimited API calls with priority processing',
    category: 'API',
    icon: 'api'
  },
  data_api: {
    name: 'Data API',
    description: 'Access to raw data export and analysis APIs',
    category: 'API',
    icon: 'database'
  },

  // Branding Features
  custom_branding: {
    name: 'Custom Branding',
    description: 'Add your logo and brand colors',
    category: 'Branding',
    icon: 'palette'
  },
  custom_branding_limited: {
    name: 'Limited Branding',
    description: 'Add your logo only',
    category: 'Branding',
    icon: 'image'
  },
  white_label: {
    name: 'White Label',
    description: 'Complete white label solution with custom domain',
    category: 'Branding',
    icon: 'layers'
  },
  custom_domain: {
    name: 'Custom Domain',
    description: 'Use your own domain for verification portal',
    category: 'Branding',
    icon: 'globe'
  },

  // Storage Features
  storage_1gb: {
    name: '1 GB Storage',
    description: '1 GB of document storage',
    category: 'Storage',
    icon: 'hard-drive'
  },
  storage_10gb: {
    name: '10 GB Storage',
    description: '10 GB of document storage',
    category: 'Storage',
    icon: 'hard-drive'
  },
  storage_50gb: {
    name: '50 GB Storage',
    description: '50 GB of document storage',
    category: 'Storage',
    icon: 'hard-drive'
  },
  storage_unlimited: {
    name: 'Unlimited Storage',
    description: 'Unlimited document storage',
    category: 'Storage',
    icon: 'infinity'
  },

  // Support Features
  support_ticket: {
    name: 'Support Tickets',
    description: 'Submit and track support tickets',
    category: 'Support',
    icon: 'help-circle'
  },
  priority_support: {
    name: 'Priority Support',
    description: 'Priority ticket handling with faster response times',
    category: 'Support',
    icon: 'fast-forward'
  },
  dedicated_account_manager: {
    name: 'Dedicated Account Manager',
    description: 'Personal account manager for strategic support',
    category: 'Support',
    icon: 'user-check'
  },
  support_24_7: {
    name: '24/7 Support',
    description: 'Round-the-clock support availability',
    category: 'Support',
    icon: 'clock'
  },

  // Integration Features
  integration_basic: {
    name: 'Basic Integrations',
    description: 'Connect with popular third-party tools',
    category: 'Integrations',
    icon: 'plug'
  },
  integration_advanced: {
    name: 'Advanced Integrations',
    description: 'Connect with enterprise systems and custom APIs',
    category: 'Integrations',
    icon: 'plug'
  },
  integration_enterprise: {
    name: 'Enterprise Integrations',
    description: 'Full integration suite including ERP and HR systems',
    category: 'Integrations',
    icon: 'network'
  },

  // Data Features
  data_export: {
    name: 'Data Export',
    description: 'Export verification data in various formats',
    category: 'Data',
    icon: 'download'
  },
  audit_logs: {
    name: 'Audit Logs',
    description: 'Complete audit trail of all verification activities',
    category: 'Data',
    icon: 'history'
  },
  compliance_reports: {
    name: 'Compliance Reports',
    description: 'Generate compliance and regulatory reports',
    category: 'Data',
    icon: 'clipboard-check'
  },

  // Enterprise Features
  sla_guarantee: {
    name: 'SLA Guarantee',
    description: 'Service level agreement with uptime guarantees',
    category: 'Enterprise',
    icon: 'award'
  },
  custom_contracts: {
    name: 'Custom Contracts',
    description: 'Custom billing and service contracts',
    category: 'Enterprise',
    icon: 'file-signature'
  },
  multi_entity: {
    name: 'Multi-Entity Support',
    description: 'Manage multiple organizations under one account',
    category: 'Enterprise',
    icon: 'building'
  },
  regional_deployment: {
    name: 'Regional Deployment',
    description: 'Choose deployment region for data sovereignty',
    category: 'Enterprise',
    icon: 'map-pin'
  },
  data_residency: {
    name: 'Data Residency',
    description: 'Guaranteed data storage in specific regions',
    category: 'Enterprise',
    icon: 'shield'
  }
};

// Get features available for a specific tier
export function getFeaturesForTier(tier: TierLevel): TierFeature[] {
  return TIER_FEATURES[tier] || [];
}

// Check if a specific feature is available in a tier
export function isFeatureAvailable(feature: TierFeature, tier: TierLevel): boolean {
  const tierFeatures = TIER_FEATURES[tier];
  return tierFeatures ? tierFeatures.includes(feature) : false;
}

// Get features that are available in one tier but not another
export function getFeatureDiff(tierA: TierLevel, tierB: TierLevel): {
  added: TierFeature[];
  removed: TierFeature[];
} {
  const featuresA = new Set(TIER_FEATURES[tierA]);
  const featuresB = new Set(TIER_FEATURES[tierB]);

  const added: TierFeature[] = [];
  const removed: TierFeature[] = [];

  featuresB.forEach(feature => {
    if (!featuresA.has(feature)) {
      added.push(feature);
    }
  });

  featuresA.forEach(feature => {
    if (!featuresB.has(feature)) {
      removed.push(feature);
    }
  });

  return { added, removed };
}

// Get all available features across all tiers
export function getAllFeatures(): TierFeature[] {
  const allFeatures = new Set<TierFeature>();
  Object.values(TIER_FEATURES).forEach(features => {
    features.forEach(feature => allFeatures.add(feature));
  });
  return Array.from(allFeatures);
}

// Group features by category
export function getFeaturesByCategory(tier: TierLevel): Record<string, TierFeature[]> {
  const features = getFeaturesForTier(tier);
  const grouped: Record<string, TierFeature[]> = {};

  features.forEach(feature => {
    const category = FEATURE_INFO[feature]?.category || 'Other';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(feature);
  });

  return grouped;
}
