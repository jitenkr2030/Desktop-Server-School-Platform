import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { integrationManager } from '@/lib/integrations/integration-manager';

// GET /api/integrations/verify - Verify institution
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const institutionId = searchParams.get('institutionId');
    const type = searchParams.get('type') as 'technical' | 'teacher_education' | 'general';

    if (!institutionId || !type) {
      return NextResponse.json(
        { error: 'Missing required parameters: institutionId and type' },
        { status: 400 }
      );
    }

    const result = await integrationManager.verifyInstitution(institutionId, type);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error verifying institution:', error);
    return NextResponse.json(
      { error: 'Failed to verify institution' },
      { status: 500 }
    );
  }
}

// POST /api/integrations/verify - Batch verify institutions
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { requests } = body;

    if (!requests || !Array.isArray(requests)) {
      return NextResponse.json(
        { error: 'Invalid request: requests must be an array' },
        { status: 400 }
      );
    }

    const result = await integrationManager.batchVerifyInstitutions(requests);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error batch verifying institutions:', error);
    return NextResponse.json(
      { error: 'Failed to batch verify institutions' },
      { status: 500 }
    );
  }
}
