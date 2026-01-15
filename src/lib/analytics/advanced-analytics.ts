// Advanced Analytics Service with Predictive Capabilities

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface AnalyticsPrediction {
  metric: string
  current: number
  predicted: number
  confidence: number
  trend: 'increasing' | 'decreasing' | 'stable'
  factors: PredictionFactor[]
}

interface PredictionFactor {
  factor: string
  impact: number
  description: string
}

interface RejectionRiskAssessment {
  tenantId: string
  riskScore: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  factors: RiskFactor[]
  recommendations: string[]
  processedAt: Date
}

interface RiskFactor {
  category: string
  score: number
  description: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH'
}

interface ProcessingTimePrediction {
  estimatedDays: number
  confidence: number
  range: { min: number; max: number }
  factors: ProcessingFactor[]
}

interface ProcessingFactor {
  factor: string
  impact: number
  description: string
}

interface AnomalyAlert {
  id: string
  type: AnomalyType
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  metric: string
  currentValue: number
  expectedValue: number
  deviation: number
  detectedAt: Date
  acknowledged: boolean
}

type AnomalyType = 
  | 'SPIKE_IN_REJECTIONS'
  | 'UNUSUAL_PROCESSING_TIME'
  | 'DOCUMENT_QUALITY_DROP'
  | 'APPLICATION_SURGE'
  | 'SYSTEM_ANOMALY'

// Advanced Analytics Service
export class AdvancedAnalyticsService {
  // Predict rejection risk for a tenant
  async predictRejectionRisk(tenantId: string): Promise<RejectionRiskAssessment> {
    try {
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        include: {
          verificationDocs: true,
          verificationReviews: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      })

      if (!tenant) {
        throw new Error('Tenant not found')
      }

      const factors: RiskFactor[] = []

      // Check document completeness
      const documentCompleteness = await this.assessDocumentCompleteness(tenant.verificationDocs)
      factors.push({
        category: 'Document Completeness',
        score: documentCompleteness.score,
        description: documentCompleteness.description,
        severity: documentCompleteness.severity
      })

      // Check document quality (if analyzed)
      const documentQuality = await this.assessDocumentQuality(tenant.verificationDocs)
      factors.push({
        category: 'Document Quality',
        score: documentQuality.score,
        description: documentQuality.description,
        severity: documentQuality.severity
      })

      // Check historical patterns for similar tenants
      const historicalPattern = await this.assessHistoricalPattern(tenant)
      factors.push({
        category: 'Historical Patterns',
        score: historicalPattern.score,
        description: historicalPattern.description,
        severity: historicalPattern.severity
      })

      // Check student count threshold compliance
      const studentCountRisk = this.assessStudentCountRisk(tenant.studentCount)
      factors.push({
        category: 'Student Count',
        score: studentCountRisk.score,
        description: studentCountRisk.description,
        severity: studentCountRisk.severity
      })

      // Calculate overall risk score
      const riskScore = factors.reduce((sum, f) => sum + f.score, 0) / factors.length

      // Determine risk level
      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
      if (riskScore >= 0.7) {
        riskLevel = 'LOW'
      } else if (riskScore >= 0.4) {
        riskLevel = 'MEDIUM'
      } else {
        riskLevel = 'HIGH'
      }

      // Generate recommendations
      const recommendations = this.generateRiskRecommendations(factors, riskLevel)

      return {
        tenantId,
        riskScore,
        riskLevel,
        factors,
        recommendations,
        processedAt: new Date()
      }
    } catch (error) {
      console.error('Risk prediction error:', error)
      throw error
    }
  }

  private async assessDocumentCompleteness(docs: any[]): Promise<{ score: number; description: string; severity: 'LOW' | 'MEDIUM' | 'HIGH' }> {
    const requiredTypes = [
      'AICTE_APPROVAL',
      'STATE_GOVERNMENT_APPROVAL',
      'ENROLLMENT_DATA',
      'STUDENT_ID_SAMPLE',
      'INSTITUTION_REGISTRATION'
    ]

    const submittedTypes = docs.map(d => d.documentType)
    const missingTypes = requiredTypes.filter(t => !submittedTypes.includes(t))
    const approvedDocs = docs.filter(d => d.status === 'APPROVED').length

    // Score based on completion percentage
    const completionScore = (requiredTypes.length - missingTypes.length) / requiredTypes.length
    const qualityBonus = approvedDocs / docs.length

    const score = (completionScore * 0.7) + (qualityBonus * 0.3)

    let severity: 'LOW' | 'MEDIUM' | 'HIGH'
    if (score >= 0.8) severity = 'LOW'
    else if (score >= 0.5) severity = 'MEDIUM'
    else severity = 'HIGH'

    return {
      score,
      description: `${requiredTypes.length - missingTypes.length}/${requiredTypes.length} required documents submitted, ${approvedDocs} approved`,
      severity
    }
  }

  private async assessDocumentQuality(docs: any[]): Promise<{ score: number; description: string; severity: 'LOW' | 'MEDIUM' | 'HIGH' }> {
    // In production, this would use actual analysis results
    // For now, simulate based on document status
    const analyzedDocs = docs.filter(d => d.analyzedAt)
    const highQualityDocs = analyzedDocs.filter(d => {
      const analysis = d.analysisResult as any
      return analysis?.authenticityScore >= 0.8 && analysis?.completenessScore >= 0.8
    })

    const score = analyzedDocs.length > 0 
      ? highQualityDocs.length / analyzedDocs.length 
      : 0.5 // Default score if no analyzed docs

    let severity: 'LOW' | 'MEDIUM' | 'HIGH'
    if (score >= 0.7) severity = 'LOW'
    else if (score >= 0.4) severity = 'MEDIUM'
    else severity = 'HIGH'

    return {
      score,
      description: `${highQualityDocs.length}/${analyzedDocs.length} analyzed documents meet quality standards`,
      severity
    }
  }

  private async assessHistoricalPattern(tenant: any): Promise<{ score: number; description: string; severity: 'LOW' | 'MEDIUM' | 'HIGH' }> {
    // Find similar tenants by student count range
    const studentCount = tenant.studentCount || 0
    const range = 500

    const similarTenants = await prisma.tenant.findMany({
      where: {
        studentCount: {
          gte: studentCount - range,
          lte: studentCount + range
        },
        id: { not: tenant.id }
      }
    })

    if (similarTenants.length === 0) {
      return { score: 0.5, description: 'No similar tenants found for comparison', severity: 'MEDIUM' }
    }

    const approvedCount = similarTenants.filter(t => t.eligibilityStatus === 'APPROVED').length
    const approvalRate = approvedCount / similarTenants.length

    let severity: 'LOW' | 'MEDIUM' | 'HIGH'
    if (approvalRate >= 0.7) severity = 'LOW'
    else if (approvalRate >= 0.4) severity = 'MEDIUM'
    else severity = 'HIGH'

    return {
      score: approvalRate,
      description: `${approvalRate * 100}% approval rate for similar institutions (${similarTenants.length} institutions)`,
      severity
    }
  }

  private assessStudentCountRisk(studentCount: number | null): { score: number; description: string; severity: 'LOW' | 'MEDIUM' | 'HIGH' } {
    if (!studentCount || studentCount < 1500) {
      return {
        score: 0.2,
        description: `Student count ${studentCount || 0} is below 1500 threshold`,
        severity: 'HIGH'
      }
    }

    const score = Math.min(1, studentCount / 3000)

    return {
      score,
      description: `Student count ${studentCount.toLocaleString()} meets 1500+ requirement`,
      severity: 'LOW'
    }
  }

  private generateRiskRecommendations(factors: RiskFactor[], riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'): string[] {
    const recommendations: string[] = []

    // Document recommendations
    const documentFactor = factors.find(f => f.category === 'Document Completeness')
    if (documentFactor && documentFactor.severity !== 'LOW') {
      recommendations.push('Upload all required documents to improve approval chances')
    }

    const qualityFactor = factors.find(f => f.category === 'Document Quality')
    if (qualityFactor && qualityFactor.severity !== 'LOW') {
      recommendations.push('Ensure uploaded documents are clear and legible')
      recommendations.push('Avoid submitting blurry or cropped documents')
    }

    // Student count recommendations
    const studentFactor = factors.find(f => f.category === 'Student Count')
    if (studentFactor && studentFactor.severity !== 'LOW') {
      recommendations.push('Provide audited enrollment data showing 1500+ students')
      recommendations.push('Include official student records with photos')
    }

    // General recommendations
    if (riskLevel === 'HIGH') {
      recommendations.push('Consider contacting support for guidance on completing verification')
    }

    return recommendations
  }

  // Predict processing time
  async predictProcessingTime(tenantId: string): Promise<ProcessingTimePrediction> {
    try {
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        include: { verificationDocs: true }
      })

      if (!tenant) {
        throw new Error('Tenant not found')
      }

      const factors: ProcessingFactor[] = []

      // Document completeness factor
      const docCount = tenant.verificationDocs.length
      const completenessFactor = docCount >= 5 ? 0.9 : 0.6 + (docCount * 0.06)
      factors.push({
        factor: 'Document Completeness',
        impact: completenessFactor - 0.5,
        description: docCount >= 5 
          ? 'All required documents submitted' 
          : `${5 - docCount} documents still required`
      })

      // Historical average
      const avgProcessingTime = await this.getAverageProcessingTime()
      const baseTime = avgProcessingTime

      // Adjust for document quality
      const qualityFactor = tenant.verificationDocs.some(d => d.analyzedAt) ? 0.9 : 1.1
      factors.push({
        factor: 'Document Quality Analysis',
        impact: qualityFactor - 1,
        description: tenant.verificationDocs.some(d => d.analyzedAt)
          ? 'Documents have been analyzed'
          : 'Pending document analysis'
      })

      // Calculate final estimate
      const estimatedTime = Math.round(baseTime * qualityFactor)
      const confidence = 0.75 + (docCount * 0.03)

      return {
        estimatedDays: estimatedTime,
        confidence: Math.min(0.95, confidence),
        range: {
          min: Math.max(1, Math.round(estimatedTime * 0.6)),
          max: Math.round(estimatedTime * 1.4)
        },
        factors
      }
    } catch (error) {
      console.error('Processing time prediction error:', error)
      throw error
    }
  }

  private async getAverageProcessingTime(): Promise<number> {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const approvedTenants = await prisma.tenant.findMany({
      where: {
        eligibilityStatus: 'APPROVED',
        updatedAt: { gte: thirtyDaysAgo }
      }
    })

    if (approvedTenants.length === 0) {
      return 5 // Default 5 days
    }

    const totalDays = approvedTenants.reduce((sum, tenant) => {
      const days = Math.ceil(
        (tenant.updatedAt.getTime() - tenant.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      )
      return sum + days
    }, 0)

    return Math.round(totalDays / approvedTenants.length)
  }

  // Detect anomalies in verification data
  async detectAnomalies(): Promise<AnomalyAlert[]> {
    const alerts: AnomalyAlert[] = []

    // Check for rejection rate spike
    const rejectionSpike = await this.checkRejectionRateSpike()
    if (rejectionSpike) {
      alerts.push(rejectionSpike)
    }

    // Check for processing time anomaly
    const processingTimeAnomaly = await this.checkProcessingTimeAnomaly()
    if (processingTimeAnomaly) {
      alerts.push(processingTimeAnomaly)
    }

    // Check for application surge
    const applicationSurge = await this.checkApplicationSurge()
    if (applicationSurge) {
      alerts.push(applicationSurge)
    }

    // Store alerts in database
    if (alerts.length > 0) {
      await prisma.verificationAnomaly.createMany({
        data: alerts.map(alert => ({
          type: alert.type,
          severity: alert.severity,
          description: alert.description,
          metric: alert.metric,
          currentValue: alert.currentValue,
          expectedValue: alert.expectedValue,
          deviation: alert.deviation,
          acknowledged: false
        }))
      })
    }

    return alerts
  }

  private async checkRejectionRateSpike(): Promise<AnomalyAlert | null> {
    const today = new Date()
    const todayStart = new Date(today.setHours(0, 0, 0, 0))
    
    const todayRejections = await prisma.verificationReview.count({
      where: {
        action: 'REJECT',
        createdAt: { gte: todayStart }
      }
    })

    // Calculate average daily rejections (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const totalRejections = await prisma.verificationReview.count({
      where: {
        action: 'REJECT',
        createdAt: { gte: thirtyDaysAgo }
      }
    })

    const avgDailyRejections = totalRejections / 30
    const threshold = avgDailyRejections * 2

    if (todayRejections > threshold && threshold > 0) {
      return {
        id: uuidv4(),
        type: 'SPIKE_IN_REJECTIONS',
        severity: todayRejections > threshold * 2 ? 'HIGH' : 'MEDIUM',
        description: `Rejection count (${todayRejections}) is ${(todayRejections / avgDailyRejections).toFixed(1)}x above average`,
        metric: 'daily_rejections',
        currentValue: todayRejections,
        expectedValue: Math.round(avgDailyRejections),
        deviation: ((todayRejections - avgDailyRejections) / avgDailyRejections) * 100,
        detectedAt: new Date(),
        acknowledged: false
      }
    }

    return null
  }

  private async checkProcessingTimeAnomaly(): Promise<AnomalyAlert | null> {
    const avgTime = await this.getAverageProcessingTime()
    const today = new Date()
    const recentApproved = await prisma.tenant.findMany({
      where: {
        eligibilityStatus: 'APPROVED',
        updatedAt: {
          gte: new Date(today.getTime() - 24 * 60 * 60 * 1000)
        }
      }
    })

    if (recentApproved.length === 0) return null

    const recentAvgTime = recentApproved.reduce((sum, t) => {
      const days = Math.ceil(
        (t.updatedAt.getTime() - t.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      )
      return sum + days
    }, 0) / recentApproved.length

    const deviation = Math.abs(recentAvgTime - avgTime) / avgTime

    if (deviation > 0.5) {
      return {
        id: uuidv4(),
        type: 'UNUSUAL_PROCESSING_TIME',
        severity: deviation > 1 ? 'HIGH' : 'MEDIUM',
        description: `Recent average processing time (${recentAvgTime.toFixed(1)} days) differs significantly from historical average (${avgTime} days)`,
        metric: 'processing_time',
        currentValue: recentAvgTime,
        expectedValue: avgTime,
        deviation: deviation * 100,
        detectedAt: new Date(),
        acknowledged: false
      }
    }

    return null
  }

  private async checkApplicationSurge(): Promise<AnomalyAlert | null> {
    const today = new Date()
    const todayStart = new Date(today.setHours(0, 0, 0, 0))
    
    const todayApplications = await prisma.tenant.count({
      where: {
        createdAt: { gte: todayStart }
      }
    })

    // Calculate average daily applications
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const totalApplications = await prisma.tenant.count({
      where: {
        createdAt: { gte: thirtyDaysAgo }
      }
    })

    const avgDailyApplications = totalApplications / 30
    const threshold = avgDailyApplications * 3

    if (todayApplications > threshold && threshold > 0) {
      return {
        id: uuidv4(),
        type: 'APPLICATION_SURGE',
        severity: todayApplications > threshold * 2 ? 'HIGH' : 'MEDIUM',
        description: `Application surge detected: ${todayApplications} new applications today (${(todayApplications / avgDailyApplications).toFixed(1)}x above average)`,
        metric: 'daily_applications',
        currentValue: todayApplications,
        expectedValue: Math.round(avgDailyApplications),
        deviation: ((todayApplications - avgDailyApplications) / avgDailyApplications) * 100,
        detectedAt: new Date(),
        acknowledged: false
      }
    }

    return null
  }

  // Get dashboard predictions summary
  async getPredictionSummary(): Promise<{
    rejectionRisks: number
    avgProcessingTime: number
    anomaliesDetected: number
    trendData: TrendDataPoint[]
  }> {
    // Count high-risk tenants
    const highRiskTenants = await prisma.tenant.count({
      where: {
        eligibilityStatus: { in: ['PENDING', 'UNDER_REVIEW', 'REQUIRES_MORE_INFO'] }
      }
    })

    // Get average processing time
    const avgProcessingTime = await this.getAverageProcessingTime()

    // Count unacknowledged anomalies
    const anomaliesDetected = await prisma.verificationAnomaly.count({
      where: { acknowledged: false }
    })

    // Get trend data for last 7 days
    const trendData = await this.getTrendData()

    return {
      rejectionRisks: Math.round(highRiskTenants * 0.3), // Estimate
      avgProcessingTime,
      anomaliesDetected,
      trendData
    }
  }

  private async getTrendData(): Promise<{ date: string; applications: number; approvals: number; rejections: number }[]> {
    const data: { date: string; applications: number; approvals: number; rejections: number }[] = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStart = new Date(date.setHours(0, 0, 0, 0))
      const dateEnd = new Date(date.setHours(23, 59, 59, 999))

      const applications = await prisma.tenant.count({
        where: {
          createdAt: { gte: dateStart, lte: dateEnd }
        }
      })

      const approvals = await prisma.verificationReview.count({
        where: {
          action: 'APPROVE',
          createdAt: { gte: dateStart, lte: dateEnd }
        }
      })

      const rejections = await prisma.verificationReview.count({
        where: {
          action: 'REJECT',
          createdAt: { gte: dateStart, lte: dateEnd }
        }
      })

      data.push({
        date: dateStart.toISOString().split('T')[0],
        applications,
        approvals,
        rejections
      })
    }

    return data
  }
}

// Import uuidv4
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Export singleton
export const advancedAnalyticsService = new AdvancedAnalyticsService()
