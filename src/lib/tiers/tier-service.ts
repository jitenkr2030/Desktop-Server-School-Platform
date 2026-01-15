/**
 * Tier Service - Business logic for tier management
 */

import { prisma } from '@/lib/db'
import { TierLevel, TierFeature } from './tier-types'
import { getFeaturesForTier } from './feature-flags'

export interface TierStats {
  totalTenants: number
  byTier: Record<TierLevel, number>
  tierPercentages: Record<TierLevel, string>
}

export interface TenantTierInfo {
  tenantId: string
  currentTier: TierLevel
  features: TierFeature[]
  upgradeAvailable: boolean
  nextTier?: TierLevel
}

export const tierService = {
  /**
   * Get statistics about tier distribution
   */
  async getStats(): Promise<TierStats> {
    const tenants = await prisma.tenant.findMany({
      select: { tier: true }
    })

    const byTier = tenants.reduce((acc, tenant) => {
      acc[tenant.tier] = (acc[tenant.tier] || 0) + 1
      return acc
    }, {} as Record<TierLevel, number>)

    const totalTenants = tenants.length

    const tierPercentages = Object.keys(byTier).reduce((acc, tier) => {
      acc[tier as TierLevel] = ((byTier[tier as TierLevel] / totalTenants) * 100).toFixed(1)
      return acc
    }, {} as Record<TierLevel, string>)

    return { totalTenants, byTier, tierPercentages }
  },

  /**
   * Get tier info for a specific tenant
   */
  async getTenantTierInfo(tenantId: string): Promise<TenantTierInfo | null> {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { tier: true, subscriptionTier: true }
    })

    if (!tenant) return null

    const currentTier = tenant.tier as TierLevel
    const features = getFeaturesForTier(currentTier)
    const tierLevels: TierLevel[] = ['STARTER', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE']
    const currentIndex = tierLevels.indexOf(currentTier)

    return {
      tenantId,
      currentTier,
      features,
      upgradeAvailable: currentIndex < tierLevels.length - 1,
      nextTier: currentIndex < tierLevels.length - 1 ? tierLevels[currentIndex + 1] : undefined
    }
  },

  /**
   * Upgrade a tenant to a higher tier
   */
  async upgradeTier(tenantId: string, newTier: TierLevel): Promise<{ success: boolean; message: string }> {
    try {
      await prisma.tenant.update({
        where: { id: tenantId },
        data: { 
          tier: newTier,
          subscriptionTier: newTier.toLowerCase()
        }
      })

      return {
        success: true,
        message: `Successfully upgraded to ${newTier} tier`
      }
    } catch (error) {
      console.error('Error upgrading tier:', error)
      return {
        success: false,
        message: 'Failed to upgrade tier. Please try again.'
      }
    }
  },

  /**
   * Check if a feature is available for a tenant
   */
  async isFeatureAvailable(tenantId: string, featureId: string): Promise<boolean> {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { tier: true }
    })

    if (!tenant) return false

    const features = getFeaturesForTier(tenant.tier as TierLevel)
    return features.some(f => f.id === featureId && f.enabled)
  },

  /**
   * Get feature usage statistics for a tenant
   */
  async getFeatureUsage(tenantId: string) {
    const tenantTier = await this.getTenantTierInfo(tenantId)
    if (!tenantTier) return null

    const features = tenantTier.features.map(feature => ({
      id: feature.id,
      name: feature.name,
      enabled: feature.enabled,
      usage: null as any // Could be extended to track actual usage
    }))

    return {
      tenantId,
      currentTier: tenantTier.currentTier,
      totalFeatures: features.length,
      enabledFeatures: features.filter(f => f.enabled).length,
      features
    }
  }
}
