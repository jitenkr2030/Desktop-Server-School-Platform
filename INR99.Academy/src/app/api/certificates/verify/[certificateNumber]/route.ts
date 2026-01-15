import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { certificateNumber: string } }
) {
  try {
    const { certificateNumber } = params

    if (!certificateNumber) {
      return NextResponse.json({ error: 'Certificate number is required' }, { status: 400 })
    }

    const certificate = await db.certificate.findUnique({
      where: {
        certificateNumber: certificateNumber
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        course: {
          select: {
            title: true,
            description: true,
            difficulty: true,
            instructor: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    }

    return NextResponse.json(certificate)
  } catch (error) {
    console.error('Error verifying certificate:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}