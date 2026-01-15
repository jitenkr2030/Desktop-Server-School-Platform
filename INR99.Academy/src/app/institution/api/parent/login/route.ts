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

    // Find parent by email
    const parent = await db.parentUser.findUnique({
      where: { email },
      include: {
        links: {
          where: { status: 'VERIFIED' },
          include: {
            student: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
                class: true,
              },
            },
          },
        },
      },
    })

    if (!parent) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await compare(password, parent.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if parent is active
    if (parent.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Your account has been deactivated. Please contact support.' },
        { status: 403 }
      )
    }

    // Update last login
    await db.parentUser.update({
      where: { id: parent.id },
      data: { lastLogin: new Date() },
    })

    // Get linked children with their info
    const children = parent.links.map((link) => ({
      id: link.student.user.id,
      name: link.student.user.name,
      email: link.student.user.email,
      admissionNumber: link.student.admissionNumber,
      className: link.student.class?.name,
      rollNumber: link.student.rollNumber,
      section: link.student.section,
      relationType: link.relationType,
    }))

    return NextResponse.json({
      success: true,
      parent: {
        id: parent.id,
        email: parent.email,
        name: parent.name,
        mobileNumber: parent.mobileNumber,
      },
      children,
    })
  } catch (error) {
    console.error('Parent login error:', error)
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}
