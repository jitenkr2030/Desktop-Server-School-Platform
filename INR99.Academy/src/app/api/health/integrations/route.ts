import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { integrationManager } from '@/lib/integrations/integration-manager';

// GET /api/health/integrations - Check all integration health statuses
export async function GET(request: NextRequest) {
  try {
    // Check if admin authentication is required
    const searchParams = request.nextUrl.searchParams;
    const requireAuth = searchParams.get('auth') !== 'false';

    if (requireAuth) {
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.organizationId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const systemStatus = await integrationManager.getSystemStatus();
    const integrations = await integrationManager.checkHealth();

    return NextResponse.json({
      overall: systemStatus.healthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      integrations: integrations.map(i => ({
        service: i.service,
        status: i.status,
        latency: `${i.latency}ms`,
        lastChecked: i.lastChecked,
        ...(i.error && { error: i.error }),
      })),
      summary: {
        total: integrations.length,
        healthy: integrations.filter(i => i.status === 'healthy').length,
        degraded: integrations.filter(i => i.status === 'degraded').length,
        down: integrations.filter(i => i.status === 'down').length,
      },
      recommendations: systemStatus.recommendations,
    });
  } catch (error) {
    console.error('Error checking integration health:', error);
    return NextResponse.json(
      { 
        overall: 'error',
        error: 'Failed to check integration health',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
