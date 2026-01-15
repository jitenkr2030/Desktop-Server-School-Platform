import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSampleUsers } from '@/lib/simple-db'
import { z } from 'zod'

const verifyOTPSchema = z.object({
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, 'Invalid mobile number'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mobileNumber, otp } = verifyOTPSchema.parse(body)

    // Check for demo accounts first
    const sampleUsers = getSampleUsers()
    const demoUser = sampleUsers.find(user => user.mobileNumber === mobileNumber)

    if (demoUser) {
      // Demo user found, accept any OTP and return user with role
      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully (Demo Account)',
        user: {
          id: demoUser.id,
          mobileNumber: demoUser.mobileNumber,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role
        }
      })
    }

    // Find user by mobile number in database
    const user = await db.user.findUnique({
      where: { mobileNumber }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // For demo purposes, we'll accept any 6-digit OTP
    // In production, verify against stored OTP with proper validation
    if (otp.length !== 6) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP' },
        { status: 400 }
      )
    }

    // Update user with successful login timestamp
    await db.user.update({
      where: { id: user.id },
      data: {
        // In production, clear OTP after successful verification
        name: user.name || `Verified_${Date.now()}`,
        lastLogin: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      user: {
        id: user.id,
        mobileNumber: user.mobileNumber,
        email: user.email,
        name: user.name,
        role: user.role || 'STUDENT' // Default to STUDENT if no role set
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid input data' },
        { status: 400 }
      )
    }

    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}