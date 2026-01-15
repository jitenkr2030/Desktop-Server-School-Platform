import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contactFormSchema } from '@/lib/validations/contact'
import { sendContactNotification, sendUserAcknowledgment } from '@/lib/email'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// Allowed file types for upload
const allowedFileTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/jpg',
]

const maxFileSize = 10 * 1024 * 1024 // 10MB

// POST /api/contact - Submit a contact message
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    let firstName: string, lastName: string, email: string, subject: string, message: string
    let uploadedFile: File | null = null

    // Check if request contains file upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      
      firstName = formData.get('firstName') as string
      lastName = formData.get('lastName') as string
      email = formData.get('email') as string
      subject = formData.get('subject') as string
      message = formData.get('message') as string
      const file = formData.get('file') as File | null

      if (file && file.size > 0) {
        // Validate file type
        if (!allowedFileTypes.includes(file.type)) {
          return NextResponse.json(
            {
              success: false,
              message: 'Invalid file type. Please upload PDF, DOC, DOCX, JPEG, or PNG files.',
            },
            { status: 400 }
          )
        }

        // Validate file size
        if (file.size > maxFileSize) {
          return NextResponse.json(
            {
              success: false,
              message: 'File size exceeds 10MB limit. Please choose a smaller file.',
            },
            { status: 400 }
          )
        }

        uploadedFile = file
      }
    } else {
      // Handle regular JSON request
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

      const { firstName: fn, lastName: ln, email: em, subject: sb, message: msg } = validationResult.data
      firstName = fn
      lastName = ln
      email = em
      subject = sb
      message = msg
    }

    // Basic validation for required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message: 'All required fields must be provided',
        },
        { status: 400 }
      )
    }

    let attachmentPath: string | null = null
    let attachmentName: string | null = null

    // Save uploaded file if exists
    if (uploadedFile) {
      try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'contact-attachments')
        
        // Create directory if it doesn't exist
        await mkdir(uploadsDir, { recursive: true })

        // Generate unique filename
        const timestamp = Date.now()
        const randomSuffix = Math.random().toString(36).substring(2, 8)
        const extension = path.extname(uploadedFile.name)
        const uniqueFilename = `contact-${timestamp}-${randomSuffix}${extension}`
        
        const filePath = path.join(uploadsDir, uniqueFilename)
        
        // Convert File to Buffer and save
        const arrayBuffer = await uploadedFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        await writeFile(filePath, buffer)

        attachmentPath = `/uploads/contact-attachments/${uniqueFilename}`
        attachmentName = uploadedFile.name
      } catch (fileError) {
        console.error('Error saving uploaded file:', fileError)
        // Continue without attachment if file save fails
      }
    }

    // Create message in database
    const contactMessage = await db.contactMessage.create({
      data: {
        firstName,
        lastName,
        email,
        subject,
        message,
        attachment: attachmentPath,
        attachmentName: attachmentName,
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
