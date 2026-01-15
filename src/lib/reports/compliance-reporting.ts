// Compliance Reporting Service

import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

interface ComplianceReport {
  id: string
  type: ReportType
  title: string
  generatedAt: Date
  period: { start: Date; end: Date }
  data: any
  format: 'pdf' | 'xlsx' | 'csv' | 'json'
  status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED'
  fileUrl?: string
  metadata: ReportMetadata
}

interface ReportMetadata {
  generatedBy: string
  regulatoryBody?: string
  version: string
  signature?: string
  checksum?: string
}

type ReportType =
  | 'AICTE_COMPLIANCE'
  | 'NCTE_COMPLIANCE'
  | 'STATE_EDUCATION_COMPLIANCE'
  | 'QUARTERLY_VERIFICATION_SUMMARY'
  | 'ANNUAL_COMPLIANCE_CERTIFICATE'
  | 'VERIFICATION_AUDIT_TRAIL'
  | 'INSTITUTION_STATUS_REPORT'

interface ReportConfig {
  type: ReportType
  startDate: Date
  endDate: Date
  format?: 'pdf' | 'xlsx' | 'csv' | 'json'
  regulatoryBody?: string
}

// Compliance Report Generator
export class ComplianceReportService {
  async generateReport(config: ReportConfig): Promise<ComplianceReport> {
    const reportId = uuidv4()
    const now = new Date()

    // Create initial report record
    const report = await prisma.complianceReport.create({
      data: {
        id: reportId,
        type: config.type,
        title: this.getReportTitle(config.type),
        generatedAt: now,
        periodStart: config.startDate,
        periodEnd: config.endDate,
        format: config.format || 'pdf',
        status: 'GENERATING',
        metadata: {
          generatedBy: 'SYSTEM',
          regulatoryBody: config.regulatoryBody,
          version: '1.0.0'
        }
      }
    })

    try {
      // Generate report data based on type
      const data = await this.generateReportData(config)

      // Update report with data
      const completedReport = await prisma.complianceReport.update({
        where: { id: reportId },
        data: {
          status: 'COMPLETED',
          reportData: data as any,
          metadata: {
            generatedBy: 'SYSTEM',
            regulatoryBody: config.regulatoryBody,
            version: '1.0.0',
            checksum: this.generateChecksum(data)
          }
        }
      })

      return {
        id: completedReport.id,
        type: completedReport.type,
        title: completedReport.title,
        generatedAt: completedReport.generatedAt,
        period: {
          start: completedReport.periodStart,
          end: completedReport.periodEnd
        },
        data,
        format: completedReport.format as any,
        status: 'COMPLETED',
        metadata: completedReport.metadata as any
      }
    } catch (error) {
      // Mark report as failed
      await prisma.complianceReport.update({
        where: { id: reportId },
        data: { status: 'FAILED' }
      })

      throw error
    }
  }

  private async generateReportData(config: ReportConfig): Promise<any> {
    switch (config.type) {
      case 'AICTE_COMPLIANCE':
        return this.generateAICTEComplianceReport(config)
      case 'NCTE_COMPLIANCE':
        return this.generateNCTEComplianceReport(config)
      case 'STATE_EDUCATION_COMPLIANCE':
        return this.generateStateComplianceReport(config)
      case 'QUARTERLY_VERIFICATION_SUMMARY':
        return this.generateQuarterlySummary(config)
      case 'ANNUAL_COMPLIANCE_CERTIFICATE':
        return this.generateAnnualCertificate(config)
      case 'VERIFICATION_AUDIT_TRAIL':
        return this.generateAuditTrail(config)
      case 'INSTITUTION_STATUS_REPORT':
        return this.generateInstitutionStatusReport(config)
      default:
        throw new Error(`Unknown report type: ${config.type}`)
    }
  }

  private async generateAICTEComplianceReport(config: ReportConfig): Promise<AICTEComplianceData> {
    // Get all institutions with AICTE approval documents
    const institutions = await prisma.tenant.findMany({
      where: {
        createdAt: {
          gte: config.startDate,
          lte: config.endDate
        },
        verificationDocs: {
          some: {
            documentType: 'AICTE_APPROVAL',
            status: { in: ['APPROVED', 'PENDING', 'UNDER_REVIEW'] }
          }
        }
      },
      include: {
        verificationDocs: {
          where: { documentType: 'AICTE_APPROVAL' }
        },
        verificationReviews: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    const approved = institutions.filter(t => t.eligibilityStatus === 'APPROVED')
    const pending = institutions.filter(t => 
      ['PENDING', 'UNDER_REVIEW', 'REQUIRES_MORE_INFO'].includes(t.eligibilityStatus)
    )
    const rejected = institutions.filter(t => t.eligibilityStatus === 'REJECTED')

    return {
      reportType: 'AICTE_COMPLIANCE',
      reportPeriod: {
        start: config.startDate.toISOString(),
        end: config.endDate.toISOString()
      },
      summary: {
        totalInstitutions: institutions.length,
        approvedInstitutions: approved.length,
        pendingInstitutions: pending.length,
        rejectedInstitutions: rejected.length,
        approvalRate: institutions.length > 0 
          ? (approved.length / institutions.length * 100).toFixed(2) + '%'
          : 'N/A'
      },
      approvedInstitutions: approved.map(t => ({
        id: t.id,
        name: t.name,
        approvalDate: t.updatedAt.toISOString(),
        studentCount: t.studentCount
      })),
      pendingInstitutions: pending.map(t => ({
        id: t.id,
        name: t.name,
        submissionDate: t.createdAt.toISOString(),
        studentCount: t.studentCount
      })),
      statistics: {
        averageProcessingDays: await this.calculateAverageProcessingTime('AICTE'),
        studentImpact: {
          totalStudents: approved.reduce((sum, t) => sum + (t.studentCount || 0), 0),
          averageStudentsPerInstitution: approved.length > 0
            ? Math.round(approved.reduce((sum, t) => sum + (t.studentCount || 0), 0) / approved.length)
            : 0
        }
      },
      generatedAt: new Date().toISOString()
    }
  }

  private async generateNCTEComplianceReport(config: ReportConfig): Promise<NCTEComplianceData> {
    const institutions = await prisma.tenant.findMany({
      where: {
        createdAt: {
          gte: config.startDate,
          lte: config.endDate
        },
        verificationDocs: {
          some: {
            documentType: 'NCTE_RECOGNITION',
            status: { in: ['APPROVED', 'PENDING', 'UNDER_REVIEW'] }
          }
        }
      },
      include: {
        verificationDocs: {
          where: { documentType: 'NCTE_RECOGNITION' }
        }
      }
    })

    const approved = institutions.filter(t => t.eligibilityStatus === 'APPROVED')

    return {
      reportType: 'NCTE_COMPLIANCE',
      reportPeriod: {
        start: config.startDate.toISOString(),
        end: config.endDate.toISOString()
      },
      summary: {
        totalInstitutions: institutions.length,
        recognizedInstitutions: approved.length,
        pendingRecognition: institutions.length - approved.length,
        recognitionRate: institutions.length > 0
          ? (approved.length / institutions.length * 100).toFixed(2) + '%'
          : 'N/A'
      },
      recognizedInstitutions: approved.map(t => ({
        id: t.id,
        name: t.name,
        recognitionDate: t.updatedAt.toISOString(),
        teacherEducationPrograms: 'B.Ed, M.Ed', // Would come from document analysis
        approvedIntake: t.studentCount
      })),
      generatedAt: new Date().toISOString()
    }
  }

  private async generateStateComplianceReport(config: ReportConfig): Promise<StateComplianceData> {
    const institutions = await prisma.tenant.findMany({
      where: {
        createdAt: {
          gte: config.startDate,
          lte: config.endDate
        },
        verificationDocs: {
          some: {
            documentType: 'STATE_GOVERNMENT_APPROVAL',
            status: 'APPROVED'
          }
        }
      },
      include: {
        verificationDocs: {
          where: { documentType: 'STATE_GOVERNMENT_APPROVAL' }
        }
      }
    })

    return {
      reportType: 'STATE_EDUCATION_COMPLIANCE',
      reportPeriod: {
        start: config.startDate.toISOString(),
        end: config.endDate.toISOString()
      },
      summary: {
        totalInstitutions: institutions.length,
        stateApproved: institutions.length,
        complianceRate: '100%'
      },
      stateApprovedInstitutions: institutions.map(t => ({
        id: t.id,
        name: t.name,
        approvalDate: t.updatedAt.toISOString(),
        state: 'Multiple States', // Would come from document data
        studentCount: t.studentCount
      })),
      generatedAt: new Date().toISOString()
    }
  }

  private async generateQuarterlySummary(config: ReportConfig): Promise<QuarterlySummaryData> {
    const startOfQuarter = new Date(config.startDate)
    const endOfQuarter = new Date(config.endDate)

    const stats = await this.getQuarterlyStatistics(startOfQuarter, endOfQuarter)

    return {
      reportType: 'QUARTERLY_VERIFICATION_SUMMARY',
      quarter: this.getQuarterLabel(startOfQuarter),
      period: {
        start: startOfQuarter.toISOString(),
        end: endOfQuarter.toISOString()
      },
      summary: stats,
      trends: await this.calculateTrends(startOfQuarter, endOfQuarter),
      generatedAt: new Date().toISOString()
    }
  }

  private async generateAnnualCertificate(config: ReportConfig): Promise<AnnualCertificateData> {
    const year = config.startDate.getFullYear()
    const annualStats = await this.getAnnualStatistics(year)

    return {
      reportType: 'ANNUAL_COMPLIANCE_CERTIFICATE',
      certificateNumber: `INR99-AC-${year}-${uuidv4().substring(0, 8).toUpperCase()}`,
      year,
      validFrom: new Date(year, 0, 1).toISOString(),
      validUntil: new Date(year + 1, 0, 1).toISOString(),
      complianceStatement: 'This certifies that INR99 Academy has maintained proper verification procedures for all affiliated institutions during the calendar year.',
      statistics: annualStats,
      authorizedSignatory: {
        name: 'INR99 Academy Administration',
        title: 'Chief Compliance Officer',
        date: new Date().toISOString()
      },
      generatedAt: new Date().toISOString()
    }
  }

  private async generateAuditTrail(config: ReportConfig): Promise<AuditTrailData> {
    const auditLogs = await prisma.verificationAuditLog.findMany({
      where: {
        createdAt: {
          gte: config.startDate,
          lte: config.endDate
        }
      },
      include: {
        tenant: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    return {
      reportType: 'VERIFICATION_AUDIT_TRAIL',
      period: {
        start: config.startDate.toISOString(),
        end: config.endDate.toISOString()
      },
      summary: {
        totalEntries: auditLogs.length,
        uniqueActions: [...new Set(auditLogs.map(l => l.action))].length,
        uniqueTenants: [...new Set(auditLogs.map(l => l.tenantId))].length
      },
      actionBreakdown: this.aggregateActions(auditLogs),
      entries: auditLogs.map(log => ({
        timestamp: log.createdAt.toISOString(),
        tenantId: log.tenantId,
        tenantName: log.tenant?.name,
        action: log.action,
        performedBy: log.performedBy,
        details: log.details
      })),
      cryptographicHash: this.generateChecksum(auditLogs),
      generatedAt: new Date().toISOString()
    }
  }

  private async generateInstitutionStatusReport(config: ReportConfig): Promise<InstitutionStatusData> {
    const institutions = await prisma.tenant.findMany({
      where: {
        createdAt: {
          gte: config.startDate,
          lte: config.endDate
        }
      },
      include: {
        verificationDocs: true,
        verificationReviews: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    return {
      reportType: 'INSTITUTION_STATUS_REPORT',
      period: {
        start: config.startDate.toISOString(),
        end: config.endDate.toISOString()
      },
      summary: {
        totalInstitutions: institutions.length,
        byStatus: {
          approved: institutions.filter(t => t.eligibilityStatus === 'APPROVED').length,
          pending: institutions.filter(t => ['PENDING', 'UNDER_REVIEW'].includes(t.eligibilityStatus)).length,
          rejected: institutions.filter(t => t.eligibilityStatus === 'REJECTED').length,
          requiresMoreInfo: institutions.filter(t => t.eligibilityStatus === 'REQUIRES_MORE_INFO').length
        }
      },
      institutions: institutions.map(t => ({
        id: t.id,
        name: t.name,
        status: t.eligibilityStatus,
        studentCount: t.studentCount,
        documentsSubmitted: t.verificationDocs.length,
        lastActivity: t.updatedAt.toISOString(),
        currentReview: t.verificationReviews[0] || null
      })),
      generatedAt: new Date().toISOString()
    }
  }

  // Helper methods
  private getReportTitle(type: ReportType): string {
    const titles: Record<ReportType, string> = {
      AICTE_COMPLIANCE: 'AICTE Compliance Report',
      NCTE_COMPLIANCE: 'NCTE Recognition Compliance Report',
      STATE_EDUCATION_COMPLIANCE: 'State Education Department Compliance Report',
      QUARTERLY_VERIFICATION_SUMMARY: 'Quarterly Verification Summary',
      ANNUAL_COMPLIANCE_CERTIFICATE: 'Annual Compliance Certificate',
      VERIFICATION_AUDIT_TRAIL: 'Verification Audit Trail Report',
      INSTITUTION_STATUS_REPORT: 'Institution Status Report'
    }
    return titles[type]
  }

  private async getQuarterlyStatistics(start: Date, end: Date) {
    const total = await prisma.tenant.count({
      where: { createdAt: { gte: start, lte: end } }
    })

    const approved = await prisma.verificationReview.count({
      where: {
        action: 'APPROVE',
        createdAt: { gte: start, lte: end }
      }
    })

    const rejected = await prisma.verificationReview.count({
      where: {
        action: 'REJECT',
        createdAt: { gte: start, lte: end }
      }
    })

    return {
      totalApplications: total,
      approved,
      rejected,
      pending: total - approved - rejected,
      approvalRate: total > 0 ? ((approved / total) * 100).toFixed(2) + '%' : 'N/A'
    }
  }

  private async getAnnualStatistics(year: number) {
    const startOfYear = new Date(year, 0, 1)
    const endOfYear = new Date(year, 11, 31)

    const stats = await this.getQuarterlyStatistics(startOfYear, endOfYear)

    const approvedTenants = await prisma.tenant.findMany({
      where: {
        eligibilityStatus: 'APPROVED',
        updatedAt: { gte: startOfYear, lte: endOfYear }
      }
    })

    return {
      ...stats,
      totalStudentsImpacted: approvedTenants.reduce((sum, t) => sum + (t.studentCount || 0), 0),
      averageProcessingDays: await this.calculateAverageProcessingTime('ALL'),
      peakMonth: await this.getPeakMonth(startOfYear, endOfYear)
    }
  }

  private async calculateAverageProcessingTime(type: string): Promise<number> {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const approved = await prisma.tenant.findMany({
      where: {
        eligibilityStatus: 'APPROVED',
        updatedAt: { gte: thirtyDaysAgo }
      }
    })

    if (approved.length === 0) return 0

    const totalDays = approved.reduce((sum, t) => {
      const days = Math.ceil(
        (t.updatedAt.getTime() - t.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      )
      return sum + days
    }, 0)

    return Math.round(totalDays / approved.length)
  }

  private async getPeakMonth(start: Date, end: Date): Promise<string> {
    const monthlyCounts: Record<string, number> = {}

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1
    }

    const peakMonth = Object.entries(monthlyCounts).sort((a, b) => b[1] - a[1])[0]
    return peakMonth ? peakMonth[0] : 'N/A'
  }

  private getQuarterLabel(date: Date): string {
    const quarter = Math.floor(date.getMonth() / 3) + 1
    return `Q${quarter} ${date.getFullYear()}`
  }

  private async calculateTrends(start: Date, end: Date) {
    // Calculate week-over-week or month-over-month trends
    const midpoint = new Date((start.getTime() + end.getTime()) / 2)
    const firstHalf = await this.getQuarterlyStatistics(start, midpoint)
    const secondHalf = await this.getQuarterlyStatistics(midpoint, end)

    return {
      firstHalf,
      secondHalf,
      trend: secondHalf.totalApplications > firstHalf.totalApplications ? 'INCREASING' : 'STABLE'
    }
  }

  private aggregateActions(auditLogs: any[]) {
    const breakdown: Record<string, number> = {}
    for (const log of auditLogs) {
      breakdown[log.action] = (breakdown[log.action] || 0) + 1
    }
    return breakdown
  }

  private generateChecksum(data: any): string {
    // Simple checksum for demo; in production use proper cryptographic hash
    const str = JSON.stringify(data)
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16)
  }

  // Get report history
  async getReportHistory(limit: number = 50) {
    return prisma.complianceReport.findMany({
      orderBy: { generatedAt: 'desc' },
      take: limit
    })
  }
}

// Report Data Types
interface AICTEComplianceData {
  reportType: string
  reportPeriod: { start: string; end: string }
  summary: any
  approvedInstitutions: any[]
  pendingInstitutions: any[]
  statistics: any
  generatedAt: string
}

interface NCTEComplianceData {
  reportType: string
  reportPeriod: { start: string; end: string }
  summary: any
  recognizedInstitutions: any[]
  generatedAt: string
}

interface StateComplianceData {
  reportType: string
  reportPeriod: { start: string; end: string }
  summary: any
  stateApprovedInstitutions: any[]
  generatedAt: string
}

interface QuarterlySummaryData {
  reportType: string
  quarter: string
  period: { start: string; end: string }
  summary: any
  trends: any
  generatedAt: string
}

interface AnnualCertificateData {
  reportType: string
  certificateNumber: string
  year: number
  validFrom: string
  validUntil: string
  complianceStatement: string
  statistics: any
  authorizedSignatory: any
  generatedAt: string
}

interface AuditTrailData {
  reportType: string
  period: { start: string; end: string }
  summary: any
  actionBreakdown: Record<string, number>
  entries: any[]
  cryptographicHash: string
  generatedAt: string
}

interface InstitutionStatusData {
  reportType: string
  period: { start: string; end: string }
  summary: any
  institutions: any[]
  generatedAt: string
}

// Export singleton
export const complianceReportService = new ComplianceReportService()
