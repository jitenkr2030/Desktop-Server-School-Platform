import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'
import { compare } from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
      include: {
        tenantUsers: {
          include: {
            tenant: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Your account has been deactivated' },
        { status: 403 }
      )
    }

    // Get the user's tenant (if any)
    const tenantUser = user.tenantUsers.find(
      (tu) => tu.status === 'ACTIVE' && ['OWNER', 'ADMIN', 'INSTRUCTOR'].includes(tu.role)
    )

    if (!tenantUser) {
      return NextResponse.json(
        { error: 'You are not associated with any institution' },
        { status: 403 }
      )
    }

    // Check if tenant is active
    if (tenantUser.tenant.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Your institution subscription is not active' },
        { status: 403 }
      )
    }

    // In production, set authentication cookie/token here
    // For now, return success response

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      tenant: {
        id: tenantUser.tenant.id,
        name: tenantUser.tenant.name,
        slug: tenantUser.tenant.slug,
        subdomain: `${tenantUser.tenant.slug}.inr99.academy`,
      },
    })
  } catch (error) {
    console.error('Institution login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
