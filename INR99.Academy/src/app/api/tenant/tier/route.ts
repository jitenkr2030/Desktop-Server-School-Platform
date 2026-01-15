import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TierService } from '@/lib/tiers/tier-service';
import { z } from 'zod';

// GET /api/tenant/tier - Get current tier status and eligibility
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = session.user.organizationId;
    const searchParams = request.nextUrl.searchParams;
    const includeFeatures = searchParams.get('includeFeatures') === 'true';
    const includeUpgradePath = searchParams.get('includeUpgradePath') === 'true';

    const tierService = new TierService();
    
    // Get current tier status
    const tierStatus = await tierService.getTierStatus(organizationId, {
      includeFeatures,
      includeUpgradePath
    });

    return NextResponse.json(tierStatus);
  } catch (error) {
    console.error('Error fetching tier status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tier status' },
      { status: 500 }
    );
  }
}

// POST /api/tenant/tier - Request tier upgrade or downgrade
const tierRequestSchema = z.object({
  requestedTier: z.enum(['starter', 'growth', 'scale', 'enterprise']),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  billingCycle: z.enum(['monthly', 'annual']).optional(),
  specialRequirements: z.array(z.string()).optional()
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = session.user.organizationId;
    const body = await request.json();
    
    // Validate request body
    const validationResult = tierRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { requestedTier, reason, billingCycle, specialRequirements } = validationResult.data;
    const tierService = new TierService();

    // Check if upgrade is allowed
    const eligibility = await tierService.checkUpgradeEligibility(organizationId, requestedTier);
    
    if (!eligibility.eligible) {
      return NextResponse.json({
        error: 'Tier upgrade not eligible',
        reasons: eligibility.reasons,
        requirements: eligibility.requirements
      }, { status: 403 });
    }

    // Process the upgrade request
    const upgradeRequest = await tierService.createUpgradeRequest(organizationId, {
      requestedTier,
      reason,
      billingCycle,
      specialRequirements
    });

    return NextResponse.json({
      success: true,
      message: 'Tier upgrade request submitted successfully',
      upgradeRequest
    }, { status: 201 });
  } catch (error) {
    console.error('Error processing tier request:', error);
    return NextResponse.json(
      { error: 'Failed to process tier request' },
      { status: 500 }
    );
  }
}
