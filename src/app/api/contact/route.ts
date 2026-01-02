import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contactFormSchema } from '@/lib/validations/contact'
import { sendContactNotification, sendUserAcknowledgment } from '@/lib/email'

// POST /api/contact - Submit a contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = contactFormSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, subject, message } = validationResult.data

    // Create message in database
    const contactMessage = await db.contactMessage.create({
      data: {
        firstName,
        lastName,
        email,
        subject,
        message,
        status: 'PENDING',
      },
    })

    // Send email notification to admin
    const emailSent = await sendContactNotification(
      `${firstName} ${lastName}`,
      email,
      subject,
      message
    )

    // Send acknowledgment to user
    await sendUserAcknowledgment(email, firstName, subject)

    console.log(`Contact message created: ${contactMessage.id}`)
    if (!emailSent) {
      console.warn('Failed to send email notification for contact message:', contactMessage.id)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message! We will get back to you soon.',
        data: {
          id: contactMessage.id,
        },
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
      },
      { status: 500 }
    )
  }
}

// GET /api/contact - Get contact statistics (public)
export async function GET(request: NextRequest) {
  try {
    const totalMessages = await db.contactMessage.count()
    const pendingMessages = await db.contactMessage.count({
      where: { status: 'PENDING' },
    })

    return NextResponse.json({
      success: true,
      data: {
        totalMessages,
        pendingMessages,
      },
    })

  } catch (error) {
    console.error('Contact stats error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch statistics',
      },
      { status: 500 }
    )
  }
}
