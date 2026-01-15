import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/db'

// GET - List appeals with filtering
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin permissions
    const admin = await prisma.user.findFirst({
      where: {
        clerkId: userId,
        role: 'ADMIN'
      }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'PENDING'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}
    
    if (status && status !== 'ALL') {
      where.status = status
    }

    const [appeals, total] = await Promise.all([
      prisma.verificationAppeal.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              studentCount: true
            }
          }
        }
      }),
      prisma.verificationAppeal.count({ where })
    ])

    return NextResponse.json({
      success: true,
      appeals: appeals.map(appeal => ({
        id: appeal.id,
        tenantId: appeal.tenantId,
        tenantName: appeal.tenant.name,
        studentCount: appeal.tenant.studentCount,
        originalDecision: appeal.originalDecision,
        appealReason: appeal.appealReason,
        supportingDocuments: appeal.supportingDocuments as any[],
        status: appeal.status,
        submittedAt: appeal.createdAt.toISOString(),
        reviewedAt: appeal.reviewedAt?.toISOString() || null,
        reviewNotes: appeal.reviewNotes,
        reviewedBy: appeal.reviewedBy
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching appeals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appeals' },
      { status: 500 }
    )
  }
}
