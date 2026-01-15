import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { tenantId, action, details } = body

    if (!tenantId || !action) {
      return NextResponse.json(
        { error: 'tenantId and action are required' },
        { status: 400 }
      )
    }

    // Verify the user has access to this tenant
    const tenant = await prisma.tenant.findFirst({
      where: {
        id: tenantId,
        users: {
          some: { clerkId: userId }
        }
      }
    })

    // Admin users can create audit logs for any tenant
    const admin = await prisma.user.findFirst({
      where: {
        clerkId: userId,
        role: 'ADMIN'
      }
    })

    if (!tenant && !admin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const auditLog = await prisma.verificationAuditLog.create({
      data: {
        tenantId,
        action,
        details,
        performedBy: userId
      }
    })

    return NextResponse.json({
      success: true,
      auditLog: {
        id: auditLog.id,
        action: auditLog.action,
        details: auditLog.details,
        createdAt: auditLog.createdAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Error creating audit log:', error)
    return NextResponse.json(
      { error: 'Failed to create audit log' },
      { status: 500 }
    )
  }
}

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
    const tenantId = searchParams.get('tenantId')
    const action = searchParams.get('action')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}
    
    if (tenantId) {
      where.tenantId = tenantId
    }
    
    if (action) {
      where.action = action
    }
    
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    const [auditLogs, total] = await Promise.all([
      prisma.verificationAuditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          tenant: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }),
      prisma.verificationAuditLog.count({ where })
    ])

    return NextResponse.json({
      success: true,
      auditLogs: auditLogs.map(log => ({
        id: log.id,
        tenantId: log.tenantId,
        tenantName: log.tenant?.name,
        action: log.action,
        details: log.details,
        performedBy: log.performedBy,
        createdAt: log.createdAt.toISOString()
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
}
