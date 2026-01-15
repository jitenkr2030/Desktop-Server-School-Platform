'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Crown, 
  TrendingUp, 
  Zap,
  Star,
  Building2,
  BarChart3,
  Shield,
  Globe,
  HardDrive,
  MessageSquare,
  CreditCard,
  HelpCircle
} from 'lucide-react';
import { TierLevel, TierFeature, UpgradePath } from '@/lib/tiers/tier-types';
import { 
  getFeaturesForTier, 
  getFeaturesByCategory, 
  getFeatureDiff,
  FEATURE_INFO 
} from '@/lib/tiers/feature-flags';
import styles from './tier-page.module.css';

interface TierStatus {
  currentTier: TierLevel;
  tierName: string;
  studentCount: number;
  eligibleForUpgrade: boolean;
  usageStats: {
    api: { used: number; limit: number; percentage: number };
    storage: { used: number; limit: number; percentage: number };
    pending: { used: number; limit: number; percentage: number };
  };
  features: TierFeature[];
  upgradePath?: UpgradePath;
}

interface TierPlan {
  id: TierLevel;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  maxStudents: number;
  price: {
    monthly: number;
    annual: number;
  };
  popular?: boolean;
}

const TIER_PLANS: TierPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small institutions getting started with verification',
    icon: <Star size={24} />,
    color: '#6B7280',
    maxStudents: 500,
    price: { monthly: 0, annual: 0 }
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'For growing institutions with increasing verification needs',
    icon: <TrendingUp size={24} />,
    color: '#10B981',
    maxStudents: 1500,
    price: { monthly: 299, annual: 2990 }
  },
  {
    id: 'scale',
    name: 'Scale',
    description: 'Enterprise-grade features for large institutions',
    icon: <Building2 size={24} />,
    color: '#3B82F6',
    maxStudents: 5000,
    price: { monthly: 799, annual: 7990 }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for the largest institutions',
    icon: <Crown size={24} />,
    color: '#8B5CF6',
    maxStudents: Infinity,
    price: { monthly: -1, annual: -1 }
  }
];

export default function TierManagementPage() {
  const router = useRouter();
  const [tierStatus, setTierStatus] = useState<TierStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<TierLevel | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'compare'>('overview');

  const fetchTierStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/tenant/tier?includeFeatures=true&includeUpgradePath=true');
      if (response.ok) {
        const data = await response.json();
        setTierStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch tier status:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTierStatus();
  }, [fetchTierStatus]);

  const handleUpgradeRequest = async () => {
    if (!selectedTier) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/tenant/tier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestedTier: selectedTier,
          reason: 'Upgrade request from tenant dashboard',
          billingCycle
        })
      });

      if (response.ok) {
        setShowUpgradeModal(false);
        fetchTierStatus();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit upgrade request');
      }
    } catch (error) {
      console.error('Failed to submit upgrade request:', error);
      alert('Failed to submit upgrade request');
    } finally {
      setSubmitting(false);
    }
  };

  const getProgressBarColor = (percentage: number): string => {
    if (percentage >= 90) return '#EF4444';
    if (percentage >= 75) return '#F59E0B';
    return '#10B981';
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === -1) return 'Unlimited';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading tier information...</p>
      </div>
    );
  }

  const currentPlan = TIER_PLANS.find(p => p.id === tierStatus?.currentTier) || TIER_PLANS[0];
  const upgradePath = tierStatus?.upgradePath;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Subscription & Tiers</h1>
          <p>Manage your subscription plan and unlock features for your institution</p>
        </div>
        <div className={styles.currentTierBadge} style={{ backgroundColor: currentPlan.color }}>
          {currentPlan.icon}
          <span>{currentPlan.name}</span>
        </div>
      </div>

      {/* Usage Statistics */}
      {tierStatus?.usageStats && (
        <div className={styles.usageSection}>
          <h2>Current Usage</h2>
          <div className={styles.usageCards}>
            <div className={styles.usageCard}>
              <div className={styles.usageIcon}>
                <BarChart3 size={20} />
              </div>
              <div className={styles.usageContent}>
                <h3>API Calls</h3>
                <div className={styles.usageStats}>
                  <span className={styles.usageNumber}>
                    {tierStatus.usageStats.api.limit === -1 
                      ? 'Unlimited' 
                      : tierStatus.usageStats.api.used.toLocaleString()}
                  </span>
                  <span className={styles.usageLimit}>
                    / {tierStatus.usageStats.api.limit === -1 ? 'Unlimited' : tierStatus.usageStats.api.limit.toLocaleString()}
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{
                      width: `${Math.min(tierStatus.usageStats.api.percentage, 100)}%`,
                      backgroundColor: getProgressBarColor(tierStatus.usageStats.api.percentage)
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.usageCard}>
              <div className={styles.usageIcon}>
                <HardDrive size={20} />
              </div>
              <div className={styles.usageContent}>
                <h3>Storage</h3>
                <div className={styles.usageStats}>
                  <span className={styles.usageNumber}>
                    {formatBytes(tierStatus.usageStats.storage.used)}
                  </span>
                  <span className={styles.usageLimit}>
                    / {formatBytes(tierStatus.usageStats.storage.limit)}
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{
                      width: `${Math.min(tierStatus.usageStats.storage.percentage, 100)}%`,
                      backgroundColor: getProgressBarColor(tierStatus.usageStats.storage.percentage)
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.usageCard}>
              <div className={styles.usageIcon}>
                <Shield size={20} />
              </div>
              <div className={styles.usageContent}>
                <h3>Pending Verifications</h3>
                <div className={styles.usageStats}>
                  <span className={styles.usageNumber}>
                    {tierStatus.usageStats.pending.limit === -1 
                      ? 'Unlimited' 
                      : tierStatus.usageStats.pending.used}
                  </span>
                  <span className={styles.usageLimit}>
                    / {tierStatus.usageStats.pending.limit === -1 ? 'Unlimited' : tierStatus.usageStats.pending.limit}
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{
                      width: `${Math.min(tierStatus.usageStats.pending.percentage, 100)}%`,
                      backgroundColor: getProgressBarColor(tierStatus.usageStats.pending.percentage)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'overview' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'features' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('features')}
        >
          My Features
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'compare' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('compare')}
        >
          Compare Plans
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className={styles.overviewSection}>
          {/* Upgrade Path */}
          {upgradePath && upgradePath.nextTier && tierStatus?.eligibleForUpgrade && (
            <div className={styles.upgradeBanner}>
              <div className={styles.upgradeBannerContent}>
                <div className={styles.upgradeIcon}>
                  <Zap size={24} />
                </div>
                <div className={styles.upgradeText}>
                  <h3>Upgrade to {TIER_PLANS.find(p => p.id === upgradePath.nextTier)?.name}</h3>
                  <p>{upgradePath.reason}</p>
                  {upgradePath.benefits.length > 0 && (
                    <ul className={styles.upgradeBenefits}>
                      {upgradePath.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <button 
                  className={styles.upgradeButton}
                  onClick={() => {
                    setSelectedTier(upgradePath.nextTier!);
                    setShowUpgradeModal(true);
                  }}
                >
                  Upgrade Now <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Tier Cards */}
          <div className={styles.tierGrid}>
            {TIER_PLANS.map((plan) => (
              <div 
                key={plan.id}
                className={`${styles.tierCard} ${plan.id === tierStatus?.currentTier ? styles.currentTierCard : ''}`}
                style={{ '--tier-color': plan.color } as React.CSSProperties}
              >
                {plan.popular && (
                  <div className={styles.popularBadge}>Most Popular</div>
                )}
                <div className={styles.tierHeader}>
                  <div className={styles.tierIcon} style={{ backgroundColor: plan.color + '20', color: plan.color }}>
                    {plan.icon}
                  </div>
                  <h3>{plan.name}</h3>
                  <p className={styles.tierDescription}>{plan.description}</p>
                </div>
                
                <div className={styles.tierPricing}>
                  {plan.price.monthly === -1 ? (
                    <div className={styles.customPricing}>Custom Pricing</div>
                  ) : (
                    <>
                      <div className={styles.priceDisplay}>
                        <span className={styles.currency}>$</span>
                        <span className={styles.amount}>
                          {billingCycle === 'monthly' ? plan.price.monthly : Math.round(plan.price.annual / 12)}
                        </span>
                        <span className={styles.period}>/month</span>
                      </div>
                      {billingCycle === 'annual' && (
                        <p className={styles.annualPrice}>
                          ${plan.price.annual}/year (Save ~17%)
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className={styles.tierLimit}>
                  <Building2 size={16} />
                  <span>Up to {plan.maxStudents === Infinity ? 'Unlimited' : plan.maxStudents.toLocaleString()} students</span>
                </div>

                <ul className={styles.featureList}>
                  {getFeaturesForTier(plan.id).slice(0, 5).map((feature) => {
                    const featureInfo = FEATURE_INFO[feature];
                    return (
                      <li key={feature}>
                        <CheckCircle2 size={16} style={{ color: plan.color }} />
                        <span>{featureInfo?.name || feature}</span>
                      </li>
                    );
                  })}
                  {getFeaturesForTier(plan.id).length > 5 && (
                    <li className={styles.moreFeatures}>
                      +{getFeaturesForTier(plan.id).length - 5} more features
                    </li>
                  )}
                </ul>

                {plan.id === tierStatus?.currentTier ? (
                  <div className={styles.currentPlanButton}>
                    Current Plan
                  </div>
                ) : (
                  <button 
                    className={styles.selectPlanButton}
                    onClick={() => {
                      setSelectedTier(plan.id);
                      setShowUpgradeModal(true);
                    }}
                  >
                    {TIER_PLANS.indexOf(plan) > TIER_PLANS.findIndex(p => p.id === tierStatus?.currentTier) 
                      ? 'Upgrade' 
                      : 'Downgrade'}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Billing Cycle Toggle */}
          <div className={styles.billingToggle}>
            <span className={!billingCycle ? styles.activeBilling : ''}>Monthly</span>
            <button 
              className={`${styles.toggleSwitch} ${billingCycle ? styles.annual : ''}`}
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            >
              <span className={styles.toggleKnob}></span>
            </button>
            <span className={billingCycle ? styles.activeBilling : ''}>
              Annual <span className={styles.saveBadge}>Save 17%</span>
            </span>
          </div>
        </div>
      )}

      {activeTab === 'features' && (
        <div className={styles.featuresSection}>
          <h2>Your Current Features</h2>
          {tierStatus?.features && (
            <div className={styles.featuresByCategory}>
              {Object.entries(getFeaturesByCategory(tierStatus.currentTier)).map(([category, features]) => (
                <div key={category} className={styles.featureCategory}>
                  <h3 className={styles.categoryTitle}>{category}</h3>
                  <div className={styles.featureGrid}>
                    {features.map((feature) => {
                      const featureInfo = FEATURE_INFO[feature];
                      return (
                        <div key={feature} className={styles.featureCard}>
                          <div className={styles.featureIcon}>
                            {featureInfo?.icon && (
                              <span className={`icon-${featureInfo.icon}`}>
                                {getFeatureIcon(featureInfo.icon)}
                              </span>
                            )}
                          </div>
                          <div className={styles.featureContent}>
                            <h4>{featureInfo?.name || feature}</h4>
                            <p>{featureInfo?.description}</p>
                          </div>
                          <CheckCircle2 size={20} className={styles.featureCheck} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'compare' && (
        <div className={styles.compareSection}>
          <h2>Compare Plans</h2>
          <div className={styles.comparisonTable}>
            <div className={styles.comparisonHeader}>
              <div className={styles.comparisonCell}>Feature</div>
              {TIER_PLANS.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`${styles.comparisonCell} ${plan.id === tierStatus?.currentTier ? styles.currentColumn : ''}`}
                  style={{ '--tier-color': plan.color } as React.CSSProperties}
                >
                  <div className={styles.comparisonTierIcon} style={{ backgroundColor: plan.color }}>
                    {plan.icon}
                  </div>
                  <span>{plan.name}</span>
                </div>
              ))}
            </div>
            {getAllUniqueFeatures().map((feature) => {
              const featureInfo = FEATURE_INFO[feature];
              return (
                <div key={feature} className={styles.comparisonRow}>
                  <div className={`${styles.comparisonCell} ${styles.featureNameCell}`}>
                    <span className={styles.featureName}>{featureInfo?.name || feature}</span>
                    <span className={styles.featureCategory}>{featureInfo?.category}</span>
                  </div>
                  {TIER_PLANS.map((plan) => {
                    const isAvailable = getFeaturesForTier(plan.id).includes(feature);
                    return (
                      <div 
                        key={`${plan.id}-${feature}`} 
                        className={`${styles.comparisonCell} ${plan.id === tierStatus?.currentTier ? styles.currentColumn : ''}`}
                      >
                        {isAvailable ? (
                          <CheckCircle2 size={20} className={styles.checkIcon} style={{ color: plan.color }} />
                        ) : (
                          <XCircle size={20} className={styles.crossIcon} />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && selectedTier && (
        <div className={styles.modalOverlay} onClick={() => setShowUpgradeModal(false)}>
          <div classStyle={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowUpgradeModal(false)}>
              ×
            </button>
            <h2>Upgrade to {TIER_PLANS.find(p => p.id === selectedTier)?.name}</h2>
            
            <div className={styles.modalDetails}>
              <div className={styles.modalSection}>
                <h3>Billing Cycle</h3>
                <div className={styles.modalBillingToggle}>
                  <button 
                    className={`${styles.modalBillingOption} ${billingCycle === 'monthly' ? styles.selected : ''}`}
                    onClick={() => setBillingCycle('monthly')}
                  >
                    Monthly
                  </button>
                  <button 
                    className={`${styles.modalBillingOption} ${billingCycle === 'annual' ? styles.selected : ''}`}
                    onClick={() => setBillingCycle('annual')}
                  >
                    Annual (Save 17%)
                  </button>
                </div>
              </div>

              <div className={styles.modalSection}>
                <h3>What&apos;s Included</h3>
                <ul className={styles.modalFeatureList}>
                  {getFeaturesForTier(selectedTier).slice(0, 8).map((feature) => {
                    const featureInfo = FEATURE_INFO[feature];
                    return (
                      <li key={feature}>
                        <CheckCircle2 size={16} />
                        {featureInfo?.name || feature}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className={styles.modalUpgradeFeatures}>
                {tierStatus?.currentTier && (
                  <div className={styles.featureDiff}>
                    <h4>You&apos;ll Unlock:</h4>
                    {getFeatureDiff(tierStatus.currentTier, selectedTier).added.map((feature) => {
                      const featureInfo = FEATURE_INFO[feature];
                      return (
                        <div key={feature} className={styles.unlockedFeature}>
                          <span className={styles.unlockedIcon}>+</span>
                          <span>{featureInfo?.name || feature}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowUpgradeModal(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.confirmButton}
                onClick={handleUpgradeRequest}
                disabled={submitting}
              >
                {submitting ? 'Processing...' : 'Confirm Upgrade'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className={styles.helpSection}>
        <div className={styles.helpCard}>
          <MessageSquare size={24} />
          <div>
            <h3>Need Help Choosing a Plan?</h3>
            <p>Our team can help you find the right tier for your institution</p>
          </div>
          <button className={styles.helpButton}>Contact Sales</button>
        </div>
        <div className={styles.helpCard}>
          <HelpCircle size={24} />
          <div>
            <h3>Have Questions?</h3>
            <p>Check our FAQ or contact support for assistance</p>
          </div>
          <button className={styles.helpButton}>View FAQ</button>
        </div>
      </div>
    </div>
  );
}

function getFeatureIcon(iconName: string): React.ReactNode {
  const icons: Record<string, React.ReactNode> = {
    'shield-check': <Shield size={16} />,
    'shield-search': <Shield size={16} />,
    'zap': <Zap size={16} />,
    'users': <Building2 size={16} />,
    'bot': <BarChart3 size={16} />,
    'workflow': <TrendingUp size={16} />,
    'upload': <TrendingUp size={16} />,
    'files': <BarChart3 size={16} />,
    'mail': <MessageSquare size={16} />,
    'message-square': <MessageSquare size={16} />,
    'hook': <Zap size={16} />,
    'bell': <Zap size={16} />,
    'bar-chart': <BarChart3 size={16} />,
    'chart-line': <BarChart3 size={16} />,
    'brain': <Crown size={16} />,
    'file-text': <BarChart3 size={16} />,
    'sparkles': <Crown size={16} />,
    'api': <Zap size={16} />,
    'database': <HardDrive size={16} />,
    'palette': <Star size={16} />,
    'image': <Star size={16} />,
    'layers': <Building2 size={16} />,
    'globe': <Globe size={16} />,
    'hard-drive': <HardDrive size={16} />,
    'infinity': <Crown size={16} />,
    'help-circle': <HelpCircle size={16} />,
    'fast-forward': <Zap size={16} />,
    'user-check': <Building2 size={16} />,
    'clock': <Zap size={16} />,
    'plug': <Zap size={16} />,
    'network': <Building2 size={16} />,
    'download': <Zap size={16} />,
    'history': <BarChart3 size={16} />,
    'clipboard-check': <Shield size={16} />,
    'award': <Crown size={16} />,
    'file-signature': <BarChart3 size={16} />,
    'building': <Building2 size={16} />,
    'map-pin': <Globe size={16} />
  };
  return icons[iconName] || <Star size={16} />;
}

function getAllUniqueFeatures(): TierFeature[] {
  const allFeatures = new Set<TierFeature>();
  Object.values(TIER_FEATURES).forEach(features => {
    features.forEach(feature => allFeatures.add(feature));
  });
  return Array.from(allFeatures);
}

// Import TIER_FEATURES for the getAllUniqueFeatures function
import { TIER_FEATURES } from './feature-flags';
