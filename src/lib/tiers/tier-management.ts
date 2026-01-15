// Tier Management and Feature Allocation System

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Tier definitions
export type TierLevel = 'FOUNDATION' | 'GROWTH' | 'SCALE' | 'ENTERPRISE'

export interface TierConfig {
  name: string
  minStudents: number
  maxStudents: number | null
  features: TierFeatures
  supportLevel: string
  price: string
}

export interface TierFeatures {
  customDomain: boolean
  fullBranding: boolean
  apiAccess: 'NONE' | 'READ_ONLY' | 'FULL'
  studentLimit: number | 'UNLIMITED'
  supportPriority: 'COMMUNITY' | 'EMAIL' | 'PRIORITY' | 'DEDICATED'
  analyticsLevel: 'BASIC' | 'STANDARD' | 'ADVANCED' | 'CUSTOM'
  integrations: 'NONE' | 'BASIC' | 'FULL' | 'CUSTOM'
  maxStorage: number // in GB
  maxUsers: number
  whiteLabelOptions: 'NONE' | 'LIMITED' | 'FULL' | 'CUSTOM'
}

export const TIER_CONFIGS: Record<TierLevel, TierConfig> = {
  FOUNDATION: {
    name: 'Foundation',
    minStudents: 1,
    maxStudents: 499,
    features: {
      customDomain: false,
      fullBranding: false,
      apiAccess: 'NONE',
      studentLimit: 100,
      supportPriority: 'COMMUNITY',
      analyticsLevel: 'BASIC',
      integrations: 'NONE',
      maxStorage: 1,
      maxUsers: 5,
      whiteLabelOptions: 'NONE'
    },
    supportLevel: 'Community Forum',
    price: 'Free'
  },
  GROWTH: {
    name: 'Growth',
    minStudents: 500,
    maxStudents: 1499,
    features: {
      customDomain: true,
      fullBranding: false,
      apiAccess: 'READ_ONLY',
      studentLimit: 1000,
      supportPriority: 'EMAIL',
      analyticsLevel: 'STANDARD',
      integrations: 'BASIC',
      maxStorage: 10,
      maxUsers: 25,
      whiteLabelOptions: 'LIMITED'
    },
    supportLevel: 'Email (48hr response)',
    price: 'Free with verification'
  },
  SCALE: {
    name: 'Scale',
    minStudents: 1500,
    maxStudents: 4999,
    features: {
      customDomain: true,
      fullBranding: true,
      apiAccess: 'FULL',
      studentLimit: 'UNLIMITED',
      supportPriority: 'PRIORITY',
      analyticsLevel: 'ADVANCED',
      integrations: 'FULL',
      maxStorage: 100,
      maxUsers: 100,
      whiteLabelOptions: 'FULL'
    },
    supportLevel: 'Priority Email (24hr response)',
    price: 'Free'
  },
  ENTERPRISE: {
    name: 'Enterprise',
    minStudents: 5000,
    maxStudents: null,
    features: {
      customDomain: true,
      fullBranding: true,
      apiAccess: 'FULL',
      studentLimit: 'UNLIMITED',
      supportPriority: 'DEDICATED',
      analyticsLevel: 'CUSTOM',
      integrations: 'CUSTOM',
      maxStorage: 1000,
      maxUsers: 'UNLIMITED',
      whiteLabelOptions: 'CUSTOM'
    },
    supportLevel: 'Dedicated Manager (4hr response)',
    price: 'Custom'
  }
}

// Tier Transition Manager
export class TierTransitionManager {
  // Calculate tier based on student count
  calculateTier(studentCount: number | null): TierLevel {
    if (!studentCount || studentCount < 500) return 'FOUNDATION'
    if (studentCount < 1500) return 'GROWTH'
    if (studentCount < 5000) return 'SCALE'
    return 'ENTERPRISE'
  }

  // Get tier configuration
  getTierConfig(tier: TierLevel): TierConfig {
    return TIER_CONFIGS[tier]
  }

  // Check if tier change is needed
  async checkAndUpdateTier(tenantId: string): Promise<{
    changed: boolean
    oldTier: TierLevel | null
    newTier: TierLevel
    featuresChanged: string[]
  }> {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { 
        studentCount: true, 
        tier: true,
        tierFeatures: true
      }
    })

    if (!tenant) {
      throw new Error('Tenant not found')
    }

    const newTier = this.calculateTier(tenant.studentCount)
    const oldTier = tenant.tier as TierLevel | null

    // If no tier assigned yet, assign current tier
    if (!oldTier) {
      await prisma.tenant.update({
        where: { id: tenantId },
        data: {
          tier: newTier,
          tierFeatures: TIER_CONFIGS[newTier].features as any,
          tierUpdatedAt: new Date()
        }
      })

      return {
        changed: true,
        oldTier: null,
        newTier,
        featuresChanged: this.getFeatureChanges(null, newTier)
      }
    }

    // Check if tier needs to change
    if (oldTier === newTier) {
      return {
        changed: false,
        oldTier,
        newTier,
        featuresChanged: []
      }
    }

    // Get feature changes
    const featuresChanged = this.getFeatureChanges(oldTier, newTier)

    // Update tenant tier
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        tier: newTier,
        tierFeatures: TIER_CONFIGS[newTier].features as any,
        tierUpdatedAt: new Date()
      }
    })

    // Create audit log
    await prisma.verificationAuditLog.create({
      data: {
        tenantId,
        action: 'TIER_CHANGED',
        details: {
          oldTier,
          newTier,
          studentCount: tenant.studentCount,
          featuresChanged
        },
        performedBy: 'SYSTEM'
      }
    })

    return {
      changed: true,
      oldTier,
      newTier,
      featuresChanged
    }
  }

  // Get list of features that changed between tiers
  private getFeatureChanges(oldTier: TierLevel | null, newTier: TierLevel): string[] {
    const oldFeatures = oldTier ? TIER_CONFIGS[oldTier].features : null
    const newFeatures = TIER_CONFIGS[newTier].features

    const changes: string[] = []

    if (!oldFeatures) {
      // All features are new
      if (newFeatures.customDomain) changes.push('Custom Domain Access')
      if (newFeatures.fullBranding) changes.push('Full Branding')
      if (newFeatures.apiAccess !== 'NONE') changes.push('API Access')
      if (newFeatures.studentLimit === 'UNLIMITED') changes.push('Unlimited Students')
      if (newFeatures.supportPriority !== 'COMMUNITY') changes.push('Priority Support')
      if (newFeatures.analyticsLevel !== 'BASIC') changes.push('Advanced Analytics')
      if (newFeatures.integrations !== 'NONE') changes.push('Integrations')
      if (newFeatures.whiteLabelOptions !== 'NONE') changes.push('White Label Options')
    } else {
      // Compare individual features
      if (oldFeatures.customDomain !== newFeatures.customDomain) {
        changes.push(newFeatures.customDomain ? 'Custom Domain Enabled' : 'Custom Domain Disabled')
      }
      if (oldFeatures.fullBranding !== newFeatures.fullBranding) {
        changes.push(newFeatures.fullBranding ? 'Full Branding Enabled' : 'Full Branding Disabled')
      }
      if (oldFeatures.apiAccess !== newFeatures.apiAccess) {
        changes.push(`API Access: ${oldFeatures.apiAccess} → ${newFeatures.apiAccess}`)
      }
      if (oldFeatures.studentLimit !== newFeatures.studentLimit) {
        changes.push(`Student Limit: ${oldFeatures.studentLimit} → ${newFeatures.studentLimit}`)
      }
      if (oldFeatures.supportPriority !== newFeatures.supportPriority) {
        changes.push(`Support: ${oldFeatures.supportPriority} → ${newFeatures.supportPriority}`)
      }
      if (oldFeatures.analyticsLevel !== newFeatures.analyticsLevel) {
        changes.push(`Analytics: ${oldFeatures.analyticsLevel} → ${newFeatures.analyticsLevel}`)
      }
      if (oldFeatures.integrations !== newFeatures.integrations) {
        changes.push(`Integrations: ${oldFeatures.integrations} → ${newFeatures.integrations}`)
      }
      if (oldFeatures.whiteLabelOptions !== newFeatures.whiteLabelOptions) {
        changes.push(`White Label: ${oldFeatures.whiteLabelOptions} → ${newFeatures.whiteLabelOptions}`)
      }
    }

    return changes
  }

  // Check if institution is approaching tier threshold
  async checkThresholdProximity(tenantId: string): Promise<{
    approachingThreshold: boolean
    thresholdType: 'UPGRADE' | 'DOWNGRADE' | null
    currentStudents: number | null
    thresholdValue: number
    percentageFromThreshold: number
  }> {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { studentCount: true, tier: true }
    })

    if (!tenant || !tenant.studentCount) {
      return {
        approachingThreshold: false,
        thresholdType: null,
        currentStudents: null,
        thresholdValue: 0,
        percentageFromThreshold: 0
      }
    }

    const currentTier = this.calculateTier(tenant.studentCount)
    const currentConfig = TIER_CONFIGS[currentTier]

    // Check if approaching next tier up (within 10%)
    if (currentConfig.maxStudents) {
      const thresholdValue = currentConfig.maxStudents
      const percentageFromThreshold = (tenant.studentCount / thresholdValue) * 100

      if (percentageFromThreshold >= 90) {
        return {
          approachingThreshold: true,
          thresholdType: 'UPGRADE',
          currentStudents: tenant.studentCount,
          thresholdValue,
          percentageFromThreshold
        }
      }
    }

    // Check if approaching tier down (student count dropped)
    if (tenant.studentCount < currentConfig.minStudents) {
      const lowerConfig = Object.values(TIER_CONFIGS).find(
        c => c.maxStudents && tenant.studentCount >= c.minStudents && tenant.studentCount <= c.maxStudents
      )
      
      if (lowerConfig) {
        return {
          approachingThreshold: true,
          thresholdType: 'DOWNGRADE',
          currentStudents: tenant.studentCount,
          thresholdValue: lowerConfig.minStudents,
          percentageFromThreshold: (tenant.studentCount / lowerConfig.minStudents) * 100
        }
      }
    }

    return {
      approachingThreshold: false,
      thresholdType: null,
      currentStudents: tenant.studentCount,
      thresholdValue: 0,
      percentageFromThreshold: 0
    }
  }

  // Get all features for a tier
  getTierFeatures(tier: TierLevel): TierFeatures {
    return TIER_CONFIGS[tier].features
  }

  // Check if a specific feature is available for a tenant
  async hasFeature(tenantId: string, feature: keyof TierFeatures): Promise<boolean> {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { tier: true, tierFeatures: true }
    })

    if (!tenant) return false

    const tier = tenant.tier as TierLevel || this.calculateTier(tenant.studentCount || 0)
    const features = TIER_CONFIGS[tier].features

    return !!features[feature]
  }

  // Get usage statistics compared to tier limits
  async getUsageStats(tenantId: string): Promise<{
    tier: TierLevel
    limits: TierFeatures
    usage: {
      users: { current: number; limit: number }
      storage: { current: number; limit: number }
      students: { current: number | null; limit: number | 'UNLIMITED' }
    }
    exceededLimits: string[]
    nearLimits: string[]
  }> {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        users: true,
        _count: {
          select: {
            students: true,
            courses: true
          }
        }
      }
    })

    if (!tenant) {
      throw new Error('Tenant not found')
    }

    const tier = tenant.tier as TierLevel || this.calculateTier(tenant.studentCount)
    const limits = TIER_CONFIGS[tier].features
    const userCount = tenant.users.length
    const storageUsed = 0 // Would calculate from actual storage usage

    const exceededLimits: string[] = []
    const nearLimits: string[] = []

    // Check user limit
    if (limits.maxUsers !== 'UNLIMITED' && userCount > limits.maxUsers) {
      exceededLimits.push(`Users: ${userCount}/${limits.maxUsers}`)
    } else if (limits.maxUsers !== 'UNLIMITED' && userCount >= limits.maxUsers * 0.9) {
      nearLimits.push(`Users: ${userCount}/${limits.maxUsers}`)
    }

    // Check storage limit
    if (storageUsed > limits.maxStorage) {
      exceededLimits.push(`Storage: ${storageUsed}GB/${limits.maxStorage}GB`)
    } else if (storageUsed >= limits.maxStorage * 0.9) {
      nearLimits.push(`Storage: ${storageUsed}GB/${limits.maxStorage}GB`)
    }

    return {
      tier,
      limits,
      usage: {
        users: { current: userCount, limit: limits.maxUsers as number },
        storage: { current: storageUsed, limit: limits.maxStorage },
        students: { current: tenant.studentCount, limit: limits.studentLimit }
      },
      exceededLimits,
      nearLimits
    }
  }
}

// Feature Access Control
export class FeatureAccessController {
  private tierManager: TierTransitionManager

  constructor() {
    this.tierManager = new TierTransitionManager()
  }

  // Check if feature is accessible
  async canAccess(tenantId: string, feature: string): Promise<{
    accessible: boolean
    reason?: string
    upgradeTo?: TierLevel
  }> {
    const tierConfig = await this.getEffectiveTierConfig(tenantId)

    const featureMatrix: Record<string, keyof TierFeatures> = {
      'custom_domain': 'customDomain',
      'full_branding': 'fullBranding',
      'api_access': 'apiAccess',
      'unlimited_students': 'studentLimit',
      'priority_support': 'supportPriority',
      'advanced_analytics': 'analyticsLevel',
      'integrations': 'integrations',
      'white_label': 'whiteLabelOptions'
    }

    const featureKey = featureMatrix[feature.toLowerCase()]
    if (!featureKey) {
      return { accessible: true }
    }

    const tierFeatures = tierConfig.features
    const featureValue = tierFeatures[featureKey]

    // Check based on feature type
    if (typeof featureValue === 'boolean') {
      if (!featureValue) {
        // Find minimum tier needed
        const requiredTier = this.findMinimumTierForFeature(featureKey)
        return {
          accessible: false,
          reason: `${feature} is not available in your current ${tierConfig.name} tier`,
          upgradeTo: requiredTier
        }
      }
      return { accessible: true }
    }

    if (featureValue === 'NONE') {
      const requiredTier = this.findMinimumTierForFeature(featureKey)
      return {
        accessible: false,
        reason: `API access is not available in your current ${tierConfig.name} tier`,
        upgradeTo: requiredTier
      }
    }

    return { accessible: true }
  }

  // Get effective tier configuration (stored or calculated)
  private async getEffectiveTierConfig(tenantId: string): Promise<TierConfig> {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { tier: true, studentCount: true }
    })

    if (!tenant) {
      throw new Error('Tenant not found')
    }

    const tier = (tenant.tier as TierLevel) || this.tierManager.calculateTier(tenant.studentCount)
    return TIER_CONFIGS[tier]
  }

  // Find minimum tier required for a feature
  private findMinimumTierForFeature(feature: keyof TierFeatures): TierLevel {
    for (const [tierName, config] of Object.entries(TIER_CONFIGS) as [TierLevel, TierConfig][]) {
      const value = config.features[feature]
      if (typeof value === 'boolean' && value) return tierName
      if (typeof value === 'string' && value !== 'NONE' && value !== 'COMMUNITY' && value !== 'BASIC') return tierName
    }
    return 'ENTERPRISE'
  }
}

// Export singleton instances
export const tierTransitionManager = new TierTransitionManager()
export const featureAccessController = new FeatureAccessController()
