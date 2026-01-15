import { NextRequest, NextResponse } from 'next/server';

// Types
export type HealthScore = 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface InstitutionHealth {
  tenantId: string;
  institutionName: string;
  tier: string;
  overallScore: HealthScore;
  riskLevel: RiskLevel;
  factors: HealthFactor[];
  lastActivity: Date;
  verificationStatus: string;
  paymentStatus: string;
  supportTicketCount: number;
  createdAt: Date;
}

export interface HealthFactor {
  name: string;
  score: number;
  weight: number;
  description: string;
  recommendations?: string[];
}

// In-memory store for demo
const healthStore: Map<string, InstitutionHealth> = new Map();

// Initialize with sample data
function initializeSampleData() {
  if (healthStore.size > 0) return;
  
  const sampleInstitutions: InstitutionHealth[] = [
    {
      tenantId: 'inst-001',
      institutionName: 'Delhi Technical University',
      tier: 'Scale',
      overallScore: 95,
      riskLevel: 'low',
      factors: [
        { name: 'Profile Completeness', score: 100, weight: 0.2, description: 'All profile fields completed' },
        { name: 'Verification Status', score: 100, weight: 0.4, description: 'Fully verified' },
        { name: 'Payment History', score: 90, weight: 0.3, description: 'On-time payments' },
        { name: 'Support Tickets', score: 90, weight: 0.1, description: 'Low ticket volume' },
      ],
      lastActivity: new Date(),
      verificationStatus: 'verified',
      paymentStatus: 'current',
      supportTicketCount: 2,
      createdAt: new Date('2024-01-15'),
    },
    {
      tenantId: 'inst-002',
      institutionName: 'Mumbai Institute of Technology',
      tier: 'Enterprise',
      overallScore: 78,
      riskLevel: 'low',
      factors: [
        { name: 'Profile Completeness', score: 85, weight: 0.2, description: 'Minor details missing' },
        { name: 'Verification Status', score: 90, weight: 0.4, description: 'Verification in progress' },
        { name: 'Payment History', score: 60, weight: 0.3, description: 'Late payment last month' },
        { name: 'Support Tickets', score: 80, weight: 0.1, description: 'Moderate ticket volume' },
      ],
      lastActivity: new Date(Date.now() - 86400000 * 2),
      verificationStatus: 'pending',
      paymentStatus: 'overdue',
      supportTicketCount: 5,
      createdAt: new Date('2024-03-20'),
    },
    {
      tenantId: 'inst-003',
      institutionName: 'Bangalore International School',
      tier: 'Growth',
      overallScore: 45,
      riskLevel: 'high',
      factors: [
        { name: 'Profile Completeness', score: 70, weight: 0.2, description: 'Key information missing' },
        { name: 'Verification Status', score: 30, weight: 0.4, description: 'Verification expired' },
        { name: 'Payment History', score: 50, weight: 0.3, description: 'Multiple late payments' },
        { name: 'Support Tickets', score: 30, weight: 0.1, description: 'High unresolved tickets' },
      ],
      lastActivity: new Date(Date.now() - 86400000 * 7),
      verificationStatus: 'expired',
      paymentStatus: 'overdue',
      supportTicketCount: 12,
      createdAt: new Date('2024-06-10'),
    },
    {
      tenantId: 'inst-004',
      institutionName: 'Chennai Arts College',
      tier: 'Foundation',
      overallScore: 25,
      riskLevel: 'critical',
      factors: [
        { name: 'Profile Completeness', score: 40, weight: 0.2, description: 'Incomplete profile' },
        { name: 'Verification Status', score: 0, weight: 0.4, description: 'Never submitted documents' },
        { name: 'Payment History', score: 20, weight: 0.3, description: 'Payment default' },
        { name: 'Support Tickets', score: 40, weight: 0.1, description: 'Multiple complaints' },
      ],
      lastActivity: new Date(Date.now() - 86400000 * 14),
      verificationStatus: 'pending',
      paymentStatus: 'defaulted',
      supportTicketCount: 8,
      createdAt: new Date('2024-08-05'),
    },
    {
      tenantId: 'inst-005',
      institutionName: 'Pune Engineering College',
      tier: 'Scale',
      overallScore: 88,
      riskLevel: 'low',
      factors: [
        { name: 'Profile Completeness', score: 95, weight: 0.2, description: 'Complete profile' },
        { name: 'Verification Status', score: 100, weight: 0.4, description: 'Fully verified' },
        { name: 'Payment History', score: 80, weight: 0.3, description: 'Generally on-time' },
        { name: 'Support Tickets', score: 70, weight: 0.1, description: 'Moderate engagement' },
      ],
      lastActivity: new Date(),
      verificationStatus: 'verified',
      paymentStatus: 'current',
      supportTicketCount: 3,
      createdAt: new Date('2024-02-28'),
    },
  ];
  
  sampleInstitutions.forEach(inst => healthStore.set(inst.tenantId, inst));
}

initializeSampleData();

/**
 * Calculate risk level from health score
 */
function getRiskLevel(score: HealthScore): RiskLevel {
  if (score >= 80) return 'low';
  if (score >= 60) return 'medium';
  if (score >= 40) return 'high';
  return 'critical';
}

/**
 * GET - Get health data for admin dashboard
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const riskLevel = searchParams.get('riskLevel') as RiskLevel | null;
    const tier = searchParams.get('tier');
    const minScore = parseInt(searchParams.get('minScore') || '0');
    const maxScore = parseInt(searchParams.get('maxScore') || '100');
    
    // Initialize sample data
    initializeSampleData();
    
    if (tenantId) {
      // Get specific institution health
      const health = healthStore.get(tenantId);
      
      if (!health) {
        return NextResponse.json(
          { success: false, error: 'Institution not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: health,
      });
    }
    
    // Get all institutions with optional filters
    let institutions: InstitutionHealth[] = Array.from(healthStore.values());
    
    if (riskLevel) {
      institutions = institutions.filter(i => i.riskLevel === riskLevel);
    }
    
    if (tier) {
      institutions = institutions.filter(i => i.tier.toLowerCase() === tier.toLowerCase());
    }
    
    institutions = institutions.filter(i => 
      i.overallScore >= minScore && i.overallScore <= maxScore
    );
    
    // Sort by risk level (critical first)
    const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    institutions.sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]);
    
    // Calculate summary statistics
    const summary = {
      total: institutions.length,
      byRisk: {
        critical: institutions.filter(i => i.riskLevel === 'critical').length,
        high: institutions.filter(i => i.riskLevel === 'high').length,
        medium: institutions.filter(i => i.riskLevel === 'medium').length,
        low: institutions.filter(i => i.riskLevel === 'low').length,
      },
      avgScore: Math.round(
        institutions.reduce((sum, i) => sum + i.overallScore, 0) / institutions.length
      ),
      atRisk: institutions.filter(i => i.riskLevel === 'critical' || i.riskLevel === 'high').length,
    };
    
    return NextResponse.json({
      success: true,
      data: institutions,
      summary,
    });
  } catch (error) {
    console.error('Error fetching health data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch health data' },
      { status: 500 }
    );
  }
}

/**
 * POST - Trigger health recalculation for an institution
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId } = body;
    
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Tenant ID is required' },
        { status: 400 }
      );
    }
    
    // In production, this would recalculate the health score
    // For demo, just return success
    
    return NextResponse.json({
      success: true,
      message: 'Health recalculation triggered',
      tenantId,
    });
  } catch (error) {
    console.error('Error triggering health recalculation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to trigger recalculation' },
      { status: 500 }
    );
  }
}
