import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSampleUsers } from '@/lib/simple-db'
import { z } from 'zod'

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

const sendOTPSchema = z.object({
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, 'Invalid mobile number'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mobileNumber } = sendOTPSchema.parse(body)

    // Check for demo accounts first
    const sampleUsers = getSampleUsers()
    const demoUser = sampleUsers.find(user => user.mobileNumber === mobileNumber)

    if (demoUser) {
      // Demo user found, return success with demo OTP info
      const demoOTP = '123456' // Standard demo OTP
      console.log(`Demo OTP for ${mobileNumber}: ${demoOTP}`)
      
      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully (Demo Account)',
        userId: demoUser.id,
        demo: true,
        note: 'Use OTP: 123456 for demo accounts'
      })
    }

    // Check if user exists, if not create one
    let user = await db.user.findUnique({
      where: { mobileNumber }
    })

    if (!user) {
      user = await db.user.create({
        data: {
          mobileNumber,
          isActive: true,
          role: 'STUDENT' // Default role for new users
        }
      })
    }

    // Generate OTP (in production, use a proper SMS service)
    const otp = generateOTP()
    
    // For demo purposes, we'll store OTP in user record
    // In production, use a proper OTP service with expiration
    await db.user.update({
      where: { id: user.id },
      data: {
        // Note: This is a demo implementation. In production, 
        // store OTP securely with expiration time
        name: user.name || `User_${otp}`,
        lastLogin: new Date()
      }
    })

    // Log OTP for demo purposes (remove in production)
    console.log(`OTP for ${mobileNumber}: ${otp}`)

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      userId: user.id
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid mobile number' },
        { status: 400 }
      )
    }

    console.error('Send OTP error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}