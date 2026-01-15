import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, tenantIds, reviewNotes } = body

    if (!action || !tenantIds || !Array.isArray(tenantIds) || tenantIds.length === 0) {
      return NextResponse.json(
        { error: 'Valid action and tenant IDs are required' },
        { status: 400 }
      )
    }

    if (!['APPROVE', 'REJECT', 'REQUEST_INFO'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Supported: APPROVE, REJECT, REQUEST_INFO' },
        { status: 400 }
      )
    }

    const db = createClient()
    const results = {
      total: tenantIds.length,
      successful: 0,
      failed: 0,
      skipped: 0,
      details: [] as any[],
    }

    for (const tenantId of tenantIds) {
      try {
        // Get tenant with documents
        const tenant = await db.tenant.findUnique({
          where: { id: tenantId },
          include: { verificationDocs: true },
        })

        if (!tenant) {
          results.skipped++
          results.details.push({
            tenantId,
            status: 'skipped',
            reason: 'Tenant not found',
          })
          continue
        }

        if (tenant.eligibilityStatus !== 'UNDER_REVIEW') {
          results.skipped++
          results.details.push({
            tenantId,
            name: tenant.name,
            status: 'skipped',
            reason: `Status is ${tenant.eligibilityStatus}, expected UNDER_REVIEW`,
          })
          continue
        }

        // Determine new status
        let newStatus: string
        let docStatus: string
        
        switch (action) {
          case 'APPROVE':
            newStatus = 'ELIGIBLE'
            docStatus = 'APPROVED'
            break
          case 'REJECT':
            newStatus = 'REJECTED'
            docStatus = 'REJECTED'
            break
          case 'REQUEST_INFO':
            newStatus = 'UNDER_REVIEW'
            docStatus = 'REQUIRES_MORE_INFO'
            break
          default:
            newStatus = tenant.eligibilityStatus
            docStatus = 'PENDING'
        }

        // Update tenant
        await db.tenant.update({
          where: { id: tenantId },
          data: {
            eligibilityStatus: newStatus as any,
            verifiedAt: action === 'APPROVE' ? new Date() : undefined,
          },
        })

        // Update documents
        if (tenant.verificationDocs.length > 0) {
          await db.verificationDocument.updateMany({
            where: {
              tenantId,
              status: 'PENDING',
            },
            data: {
              status: docStatus as any,
              reviewedBy: session.user.id,
              reviewedAt: new Date(),
              reviewNotes: reviewNotes || null,
            },
          })
        }

        results.successful++
        results.details.push({
          tenantId,
          name: tenant.name,
          status: 'success',
          action,
          newStatus,
        })

        console.log(`[BULK_ACTION] ${action} ${tenant.name} (${tenantId})`)
      } catch (err) {
        results.failed++
        results.details.push({
          tenantId,
          status: 'failed',
          error: err instanceof Error ? err.message : 'Unknown error',
        })
        console.error(`[BULK_ACTION] Failed to process ${tenantId}:`, err)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.total} institutions: ${results.successful} successful, ${results.failed} failed, ${results.skipped} skipped`,
      results,
    })
  } catch (error) {
    console.error('Bulk action error:', error)
    return NextResponse.json(
      { error: 'Failed to process bulk action' },
      { status: 500 }
    )
  }
}

// Export list of tenant IDs for a given status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'UNDER_REVIEW'
    const format = searchParams.get('format') || 'json'

    const db = createClient()

    const tenants = await db.tenant.findMany({
      where: {
        eligibilityStatus: status as any,
        studentCount: { gte: 1500 },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        studentCount: true,
        createdAt: true,
        eligibilityDeadline: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    if (format === 'csv') {
      const csv = [
        'ID,Name,Slug,Student Count,Created At,Deadline',
        ...tenants.map(t => 
          `"${t.id}","${t.name}","${t.slug}",${t.studentCount},"${t.createdAt.toISOString()}","${t.eligibilityDeadline?.toISOString() || ''}"`
        ),
      ].join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="tenants-${status}-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }

    return NextResponse.json({
      success: true,
      count: tenants.length,
      tenants,
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
