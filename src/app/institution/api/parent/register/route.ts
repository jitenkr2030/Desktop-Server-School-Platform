import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'
import { hash } from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, mobileNumber, tenantSlug } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Check if parent already exists
    const existingParent = await db.parentUser.findUnique({
      where: { email },
    })

    if (existingParent) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Find tenant if provided
    let tenantId = null
    if (tenantSlug) {
      const tenant = await db.tenant.findUnique({
        where: { slug: tenantSlug },
      })
      tenantId = tenant?.id
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create parent user
    const parent = await db.parentUser.create({
      data: {
        email,
        password: hashedPassword,
        name,
        mobileNumber,
        status: 'ACTIVE',
        isVerified: false,
      },
    })

    return NextResponse.json({
      success: true,
      parent: {
        id: parent.id,
        email: parent.email,
        name: parent.name,
      },
    })
  } catch (error) {
    console.error('Parent registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
