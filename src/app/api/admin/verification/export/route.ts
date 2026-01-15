import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'

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
    const format = searchParams.get('format') || 'csv'
    const status = searchParams.get('status')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // Build query filters
    const where: any = {}
    
    if (status && status !== 'all') {
      where.eligibilityStatus = status
    }
    
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt.gte = new Date(dateFrom)
      if (dateTo) where.createdAt.lte = new Date(dateTo)
    }

    // Fetch tenants with related data
    const tenants = await prisma.tenant.findMany({
      where,
      include: {
        verificationDocs: {
          select: {
            documentType: true,
            status: true,
            fileName: true
          }
        },
        verificationReviews: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            action: true,
            notes: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform data for export
    const exportData = tenants.map(tenant => ({
      'Tenant ID': tenant.id,
      'Institution Name': tenant.name,
      'Slug': tenant.slug,
      'Student Count': tenant.studentCount || 0,
      'Status': tenant.eligibilityStatus,
      'Deadline': tenant.eligibilityDeadline ? new Date(tenant.eligibilityDeadline).toISOString() : 'N/A',
      'Created At': new Date(tenant.createdAt).toISOString(),
      'Documents Submitted': tenant.verificationDocs.length,
      'Last Review Action': tenant.verificationReviews[0]?.action || 'N/A',
      'Last Review Notes': tenant.verificationReviews[0]?.notes || '',
      'Document Types': tenant.verificationDocs.map(d => d.documentType).join('; ')
    }))

    if (format === 'csv') {
      const headers = Object.keys(exportData[0] || {}).join(',')
      const rows = exportData.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value
        ).join(',')
      )
      const csv = [headers, ...rows].join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="verification-export-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    if (format === 'json') {
      return new NextResponse(JSON.stringify(exportData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="verification-export-${new Date().toISOString().split('T')[0]}.json"`
        }
      })
    }

    if (format === 'xlsx') {
      // For Excel export, we'll use a simplified approach
      // In production, you might want to use a library like xlsx
      const headers = Object.keys(exportData[0] || {}).join('\t')
      const rows = exportData.map(row => 
        Object.values(row).join('\t')
      ).join('\n')
      const tsv = [headers, ...rows].join('\n')

      return new NextResponse(tsv, {
        headers: {
          'Content-Type': 'application/tab-separated-values',
          'Content-Disposition': `attachment; filename="verification-export-${new Date().toISOString().split('T')[0]}.tsv"`
        }
      })
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
  } catch (error) {
    console.error('Error exporting data:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
