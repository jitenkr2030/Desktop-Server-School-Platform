'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Shield,
  Zap,
  CreditCard,
  FileText,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { 
  HealthScore, 
  HealthAlert, 
  HealthManager,
  AlertType,
  HealthStatus,
  OutreachTemplate
} from '@/lib/health/account-health';
import { TierLevel } from '@/lib/tiers/tier-types';
import styles from './health-dashboard.module.css';

const STATUS_CONFIG: Record<HealthStatus, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  excellent: { label: 'Excellent', color: '#059669', bgColor: '#d1fae5', icon: <CheckCircle size={16} /> },
  good: { label: 'Good', color: '#10b981', bgColor: '#d1fae5', icon: <Activity size={16} /> },
  fair: { label: 'Fair', color: '#f59e0b', bgColor: '#fef3c7', icon: <AlertTriangle size={16} /> },
  poor: { label: 'Poor', color: '#ef4444', bgColor: '#fee2e2', icon: <AlertTriangle size={16} /> },
  critical: { label: 'Critical', color: '#dc2626', bgColor: '#fee2e2', icon: <AlertTriangle size={16} /> }
};

const ALERT_CONFIG: Record<AlertType, { label: string; color: string }> = {
  usage_spike: { label: 'Usage', color: '#3b82f6' },
  verification_failure: { label: 'Verification', color: '#ef4444' },
  payment_issue: { label: 'Payment', color: '#f59e0b' },
  inactivity: { label: 'Inactivity', color: '#6b7280' },
  support_escalation: { label: 'Support', color: '#8b5cf6' },
  security: { label: 'Security', color: '#dc2626' },
  compliance: { label: 'Compliance', color: '#06b6d4' }
};

export default function HealthDashboardPage() {
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<{ type: AlertType; likelihood: number; timeframe: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'alerts' | 'predictions'>('overview');
  const [tier] = useState<TierLevel>('growth');

  const fetchHealthData = useCallback(async () => {
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        const data = await response.json();
        setHealthScore(data.score);
        setAlerts(data.alerts);
        setRecommendations(data.recommendations);
        setPredictions(data.predictions);
      }
    } catch (error) {
      console.error('Failed to fetch health data:', error);
      // Use mock data for demonstration
      const mockData = generateMockData();
      setHealthScore(mockData.score);
      setAlerts(mockData.alerts);
      setRecommendations(mockData.recommendations);
      setPredictions(mockData.predictions);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealthData();
  }, [fetchHealthData]);

  const generateMockData = () => {
    const manager = new HealthManager('org-1');
    
    const healthData = {
      organizationId: 'org-1',
      tier: 'growth' as TierLevel,
      metrics: {
        verificationSuccess: 82,
        verificationVolume: 150,
        apiUsage: 7500,
        apiLimit: 10000,
        storageUsed: 5 * 1024 * 1024 * 1024,
        storageLimit: 10 * 1024 * 1024 * 1024,
        loginFrequency: 3,
        lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        supportTicketCount: 3,
        supportTicketResolutionTime: 36,
        paymentStatus: 'current' as const,
        daysUntilPayment: 20,
        documentExpiryRisk: 15,
        complianceScore: 88,
        teamMembersActive: 8
      }
    };

    const score = manager.calculateHealthScore(healthData);
    const detectedAlerts = manager.detectIssues(healthData);
    const recommendations = manager.generateRecommendations(score);
    const predictions = manager.predictIssues(score.metrics);

    return {
      score,
      alerts: detectedAlerts,
      recommendations,
      predictions
    };
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp size={14} />;
      case 'down': return <TrendingDown size={14} />;
      default: return <Minus size={14} />;
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      usage: <Zap size={18} />,
      engagement: <Users size={18} />,
      compliance: <Shield size={18} />,
      support: <FileText size={18} />,
      financial: <CreditCard size={18} />
    };
    return icons[category] || <Activity size={18} />;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading health data...</p>
      </div>
    );
  }

  const statusConfig = healthScore ? STATUS_CONFIG[healthScore.status] : STATUS_CONFIG.good;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Account Health</h1>
          <p>Monitor your organization's health score and get proactive recommendations</p>
        </div>
        <button className={styles.refreshButton} onClick={fetchHealthData}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Health Score Card */}
      {healthScore && (
        <div className={styles.scoreSection}>
          <div className={styles.scoreCard}>
            <div className={styles.scoreMain}>
              <div 
                className={styles.scoreCircle}
                style={{ '--score-color': statusConfig.color } as React.CSSProperties}
              >
                <span className={styles.scoreValue}>{healthScore.overallScore}</span>
                <span className={styles.scoreLabel}>Health Score</span>
              </div>
              <div className={styles.scoreInfo}>
                <div 
                  className={styles.statusBadge}
                  style={{ background: statusConfig.bgColor, color: statusConfig.color }}
                >
                  {statusConfig.icon}
                  {statusConfig.label}
                </div>
                <div className={styles.trendIndicator}>
                  <span className={styles.trendLabel}>Trend:</span>
                  <span className={`${styles.trendValue} ${styles[healthScore.trend]}`}>
                    {getTrendIcon(healthScore.trend)}
                    {healthScore.trend.charAt(0).toUpperCase() + healthScore.trend.slice(1)}
                  </span>
                </div>
                <p className={styles.scoreSummary}>
                  {healthScore.status === 'excellent' && 'Your account is in excellent health! Keep up the great work.'}
                  {healthScore.status === 'good' && 'Your account is in good shape. A few minor improvements can be made.'}
                  {healthScore.status === 'fair' && 'Your account health needs attention. Review the recommendations below.'}
                  {healthScore.status === 'poor' && 'Your account has significant issues that need prompt attention.'}
                  {healthScore.status === 'critical' && 'Your account requires immediate attention. Please review the alerts.'}
                </p>
              </div>
            </div>
            
            <div className={styles.breakdownSection}>
              <h3>Health Breakdown</h3>
              <div className={styles.breakdownGrid}>
                <BreakdownItem 
                  icon={<Zap size={16} />} 
                  label="Usage" 
                  value={healthScore.breakdown.usage} 
                />
                <BreakdownItem 
                  icon={<Users size={16} />} 
                  label="Engagement" 
                  value={healthScore.breakdown.engagement} 
                />
                <BreakdownItem 
                  icon={<Shield size={16} />} 
                  label="Compliance" 
                  value={healthScore.breakdown.compliance} 
                />
                <BreakdownItem 
                  icon={<FileText size={16} />} 
                  label="Support" 
                  value={healthScore.breakdown.support} 
                />
                <BreakdownItem 
                  icon={<CreditCard size={16} />} 
                  label="Financial" 
                  value={healthScore.breakdown.financial} 
                />
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
          className={`${styles.tabButton} ${activeTab === 'metrics' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          Metrics
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'alerts' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          Alerts {alerts.filter(a => a.status === 'active').length > 0 && (
            <span className={styles.badge}>{alerts.filter(a => a.status === 'active').length}</span>
          )}
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'predictions' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('predictions')}
        >
          Predictions
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && healthScore && (
        <div className={styles.overviewSection}>
          {/* Metrics Overview */}
          <div className={styles.metricsOverview}>
            <h2>Key Metrics</h2>
            <div className={styles.metricsGrid}>
              {healthScore.metrics.slice(0, 4).map(metric => (
                <MetricCard key={metric.id} metric={metric} categoryIcon={getCategoryIcon(metric.category)} />
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className={styles.recommendationsSection}>
              <h2>Recommendations</h2>
              <div className={styles.recommendationsList}>
                {recommendations.map((rec, index) => (
                  <div key={index} className={styles.recommendationCard}>
                    <div className={styles.recommendationIcon}>
                      <ArrowRight size={16} />
                    </div>
                    <p>{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Alerts Summary */}
          {alerts.filter(a => a.status === 'active').length > 0 && (
            <div className={styles.alertsSummary}>
              <h2>Active Alerts</h2>
              <div className={styles.alertsSummaryList}>
                {alerts.filter(a => a.status === 'active').slice(0, 3).map(alert => (
                  <div 
                    key={alert.id} 
                    className={styles.alertSummaryCard}
                    style={{ borderLeftColor: alert.severity === 'critical' ? '#ef4444' : '#f59e0b' }}
                  >
                    <div className={styles.alertSummaryHeader}>
                      <span 
                        className={styles.alertType}
                        style={{ background: ALERT_CONFIG[alert.type].color }}
                      >
                        {ALERT_CONFIG[alert.type].label}
                      </span>
                      <span className={`${styles.alertSeverity} ${styles[alert.severity]}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <h4>{alert.title}</h4>
                    <p>{alert.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'metrics' && healthScore && (
        <div className={styles.metricsSection}>
          <h2>All Metrics</h2>
          <div className={styles.metricsTable}>
            <div className={styles.tableHeader}>
              <span>Metric</span>
              <span>Category</span>
              <span>Value</span>
              <span>Status</span>
              <span>Trend</span>
            </div>
            {healthScore.metrics.map(metric => (
              <div key={metric.id} className={styles.tableRow}>
                <span className={styles.metricName}>{metric.name}</span>
                <span className={styles.metricCategory}>
                  {getCategoryIcon(metric.category)}
                  {metric.category}
                </span>
                <span className={styles.metricValue}>
                  {metric.id.includes('storage') ? formatBytes(metric.value) : 
                   metric.id.includes('usage') ? `${Math.round(metric.value)}%` :
                   `${Math.round(metric.value * 100) / 100}${metric.id === 'login_activity' ? ' days' : ''}`}
                </span>
                <span className={styles.metricStatus}>
                  <MetricStatusIndicator value={metric.value} maxValue={metric.maxValue} />
                </span>
                <span className={`${styles.metricTrend} ${styles[metric.trend]}`}>
                  {getTrendIcon(metric.trend)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className={styles.alertsSection}>
          <h2>Health Alerts</h2>
          {alerts.length === 0 ? (
            <div className={styles.emptyAlerts}>
              <CheckCircle size={48} />
              <h3>No Active Alerts</h3>
              <p>Your account is in good standing with no active alerts</p>
            </div>
          ) : (
            <div className={styles.alertsList}>
              {alerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} tier={tier} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'predictions' && (
        <div className={styles.predictionsSection}>
          <h2>Issue Predictions</h2>
          <p className={styles.predictionsIntro}>
            Based on current trends, these issues may arise if no action is taken
          </p>
          {predictions.length === 0 ? (
            <div className={styles.emptyPredictions}>
              <Activity size={48} />
              <h3>No Predicted Issues</h3>
              <p>Your account trends look stable with no predicted issues</p>
            </div>
          ) : (
            <div className={styles.predictionsList}>
              {predictions.map((prediction, index) => (
                <div key={index} className={styles.predictionCard}>
                  <div className={styles.predictionHeader}>
                    <span 
                      className={styles.predictionType}
                      style={{ background: ALERT_CONFIG[prediction.type].color }}
                    >
                      {ALERT_CONFIG[prediction.type].label}
                    </span>
                    <div className={styles.likelihoodBar}>
                      <div 
                        className={styles.likelihoodFill}
                        style={{ width: `${prediction.likelihood}%` }}
                      />
                      <span>{prediction.likelihood}% likelihood</span>
                    </div>
                  </div>
                  <div className={styles.predictionBody}>
                    <p>Expected timeframe: <strong>{prediction.timeframe}</strong></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Breakdown Item Component
function BreakdownItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  const getColor = (v: number) => {
    if (v >= 90) return '#10b981';
    if (v >= 75) return '#3b82f6';
    if (v >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className={styles.breakdownItem}>
      <div className={styles.breakdownIcon}>{icon}</div>
      <div className={styles.breakdownContent}>
        <span className={styles.breakdownLabel}>{label}</span>
        <div className={styles.breakdownBar}>
          <div 
            className={styles.breakdownFill}
            style={{ width: `${value}%`, background: getColor(value) }}
          />
        </div>
        <span className={styles.breakdownValue} style={{ color: getColor(value) }}>
          {value}%
        </span>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ metric, categoryIcon }: { metric: any; categoryIcon: React.ReactNode }) {
  const percentage = (metric.value / metric.maxValue) * 100;
  const getStatusColor = (p: number) => {
    if (p >= 80) return '#10b981';
    if (p >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className={styles.metricCard}>
      <div className={styles.metricCardHeader}>
        <span className={styles.metricCardIcon}>{categoryIcon}</span>
        <span className={styles.metricCardName}>{metric.name}</span>
      </div>
      <div className={styles.metricCardValue}>
        <span style={{ color: getStatusColor(percentage) }}>
          {metric.id.includes('storage') ? formatBytes(metric.value) : 
           metric.id.includes('usage') ? `${Math.round(metric.value)}%` :
           `${Math.round(metric.value * 100) / 100}`}
        </span>
        <span className={styles.metricCardMax}>/ {metric.maxValue}{metric.id === 'login_activity' ? ' days' : metric.id.includes('usage') ? '%' : ''}</span>
      </div>
      <div className={styles.metricCardBar}>
        <div 
          className={styles.metricCardFill}
          style={{ width: `${Math.min(percentage, 100)}%`, background: getStatusColor(percentage) }}
        />
      </div>
      <div className={`${styles.metricCardTrend} ${styles[metric.trend]}`}>
        {getTrendIcon(metric.trend)}
        <span>{metric.trend}</span>
      </div>
    </div>
  );
}

// Metric Status Indicator Component
function MetricStatusIndicator({ value, maxValue }: { value: number; maxValue: number }) {
  const percentage = (value / maxValue) * 100;
  
  if (percentage >= 80) {
    return <span className={styles.statusGood}>Good</span>;
  } else if (percentage >= 60) {
    return <span className={styles.statusFair}>Fair</span>;
  }
  return <span className={styles.statusPoor}>Needs Attention</span>;
}

// Alert Card Component
function AlertCard({ alert, tier }: { alert: HealthAlert; tier: TierLevel }) {
  const [dismissing, setDismissing] = useState(false);

  const handleDismiss = async () => {
    setDismissing(true);
    // API call would go here
    setTimeout(() => setDismissing(false), 500);
  };

  return (
    <div 
      className={`${styles.alertCard} ${styles[alert.severity]}`}
      style={{ '--alert-color': alert.severity === 'critical' ? '#ef4444' : '#f59e0b' } as React.CSSProperties}
    >
      <div className={styles.alertHeader}>
        <div className={styles.alertMeta}>
          <span 
            className={styles.alertTypeBadge}
            style={{ background: ALERT_CONFIG[alert.type].color }}
          >
            {ALERT_CONFIG[alert.type].label}
          </span>
          <span className={styles.alertTime}>
            <Clock size={14} />
            {formatTimeAgo(alert.createdAt)}
          </span>
        </div>
        <div className={styles.alertActions}>
          <span className={`${styles.alertSeverityBadge} ${styles[alert.severity]}`}>
            {alert.severity}
          </span>
          {alert.status === 'active' && (
            <button className={styles.dismissButton} onClick={handleDismiss} disabled={dismissing}>
              {dismissing ? 'Dismissed' : 'Dismiss'}
            </button>
          )}
        </div>
      </div>
      <h3 className={styles.alertTitle}>{alert.title}</h3>
      <p className={styles.alertDescription}>{alert.description}</p>
      <div className={styles.alertRecommendation}>
        <strong>Recommendation:</strong> {alert.recommendation}
      </div>
    </div>
  );
}

// Helper Functions
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

// Import useState
import { useState } from 'react';
