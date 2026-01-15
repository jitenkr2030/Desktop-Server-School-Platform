import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { 
  schoolBoardManager,
  SchoolVerificationRequest,
  StudentVerificationRequest,
  BoardInfo,
} from '@/lib/integrations/school-boards/school-board-manager';
import { z } from 'zod';

// Validation schemas
const schoolVerificationSchema = z.object({
  board: z.enum([
    'cbse', 'icse', 'up', 'mp', 'rajasthan', 'maharashtra', 
    'karnataka', 'tamilnadu', 'gujarat', 'westbengal'
  ]),
  schoolCode: z.string().min(1),
});

const studentVerificationSchema = z.object({
  board: z.enum([
    'cbse', 'icse', 'up', 'mp', 'rajasthan', 'maharashtra', 
    'karnataka', 'tamilnadu', 'gujarat', 'westbengal'
  ]),
  rollNumber: z.string().min(1),
  year: z.number().min(2000).max(2030),
  classLevel: z.enum([10, 12]),
  examMonth: z.string().optional(),
});

// GET /api/school-boards - Get supported boards and health status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'boards';
    const session = await getServerSession(authOptions);
    
    // Public endpoints don't require auth
    const requireAuth = searchParams.get('public') !== 'true';

    if (requireAuth && !session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    switch (action) {
      case 'boards':
        // Return list of supported boards
        const boards: BoardInfo[] = schoolBoardManager.getSupportedBoards();
        return NextResponse.json({
          boards: boards.map(b => ({
            code: b.code,
            name: b.name,
            fullName: b.fullName,
            website: b.website,
            features: b.features,
          })),
        });

      case 'health':
        // Return health status for all boards
        const healthStatus = await schoolBoardManager.getHealthStatus();
        return NextResponse.json({
          timestamp: new Date().toISOString(),
          health: healthStatus,
          summary: {
            total: healthStatus.length,
            healthy: healthStatus.filter(h => h.status === 'healthy').length,
            degraded: healthStatus.filter(h => h.status === 'degraded').length,
            down: healthStatus.filter(h => h.status === 'down').length,
          },
        });

      case 'info':
        // Get info for specific board
        const boardCode = searchParams.get('board');
        if (!boardCode) {
          return NextResponse.json({ error: 'Board code required' }, { status: 400 });
        }
        const boardInfo = schoolBoardManager.getBoardInfo(boardCode as any);
        if (!boardInfo) {
          return NextResponse.json({ error: 'Unknown board' }, { status: 404 });
        }
        return NextResponse.json(boardInfo);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in school-boards GET:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// POST /api/school-boards - Verify school or student
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'verify-school': {
        // Validate request
        const validation = schoolVerificationSchema.safeParse(data);
        if (!validation.success) {
          return NextResponse.json(
            { error: 'Invalid request', details: validation.error.errors },
            { status: 400 }
          );
        }

        const req: SchoolVerificationRequest = {
          board: validation.data.board,
          schoolCode: validation.data.schoolCode,
        };

        const result = await schoolBoardManager.verifySchool(req);
        return NextResponse.json(result);
      }

      case 'verify-student': {
        // Validate request
        const validation = studentVerificationSchema.safeParse(data);
        if (!validation.success) {
          return NextResponse.json(
            { error: 'Invalid request', details: validation.error.errors },
            { status: 400 }
          );
        }

        const req: StudentVerificationRequest = {
          board: validation.data.board,
          rollNumber: validation.data.rollNumber,
          year: validation.data.year,
          classLevel: validation.data.classLevel,
          examMonth: validation.data.examMonth,
        };

        const result = await schoolBoardManager.verifyStudent(req);
        return NextResponse.json(result);
      }

      case 'batch-verify-schools': {
        // Validate request
        if (!Array.isArray(data.requests)) {
          return NextResponse.json(
            { error: 'Invalid request: requests must be an array' },
            { status: 400 }
          );
        }

        const requests: SchoolVerificationRequest[] = data.requests.map((r: any) => ({
          board: r.board,
          schoolCode: r.schoolCode,
        }));

        const result = await schoolBoardManager.batchVerifySchools(requests);
        return NextResponse.json(result);
      }

      case 'batch-verify-students': {
        // Validate request
        if (!Array.isArray(data.requests)) {
          return NextResponse.json(
            { error: 'Invalid request: requests must be an array' },
            { status: 400 }
          );
        }

        const requests: StudentVerificationRequest[] = data.requests.map((r: any) => ({
          board: r.board,
          rollNumber: r.rollNumber,
          year: r.year,
          classLevel: r.classLevel,
          examMonth: r.examMonth,
        }));

        const result = await schoolBoardManager.batchVerifyStudents(requests);
        return NextResponse.json(result);
      }

      case 'search': {
        const result = await schoolBoardManager.searchSchools({
          board: data.board || 'all',
          state: data.state,
          district: data.district,
          affiliationStatus: data.affiliationStatus,
          management: data.management,
          page: data.page || 1,
          limit: data.limit || 20,
        });

        return NextResponse.json(result);
      }

      case 'get-school': {
        if (!data.board || !data.schoolCode) {
          return NextResponse.json(
            { error: 'Board and schoolCode required' },
            { status: 400 }
          );
        }

        const school = await schoolBoardManager.getSchool(data.board, data.schoolCode);
        if (!school) {
          return NextResponse.json({ error: 'School not found' }, { status: 404 });
        }

        return NextResponse.json(school);
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in school-boards POST:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
