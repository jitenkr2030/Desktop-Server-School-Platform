import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { replyFormSchema } from '@/lib/validations/contact'
import { sendReplyNotification } from '@/lib/email'

// GET /api/admin/messages/[id] - Get single message
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const message = await db.contactMessage.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        subject: true,
        message: true,
        status: true,
        replyMessage: true,
        repliedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Message not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: message,
    })

  } catch (error) {
    console.error('Fetch message error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch message' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/messages/[id] - Update message status or add reply
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { action, replyMessage, status } = body

    const message = await db.contactMessage.findUnique({
      where: { id: params.id },
    })

    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Message not found' },
        { status: 404 }
      )
    }

    if (action === 'reply') {
      // Validate reply
      const validationResult = replyFormSchema.safeParse({ replyMessage })
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

      // Update message with reply
      const updatedMessage = await db.contactMessage.update({
        where: { id: params.id },
        data: {
          replyMessage,
          repliedAt: new Date(),
          status: 'REPLIED',
        },
      })

      // Send reply notification to user
      await sendReplyNotification(
        message.email,
        message.firstName,
        message.subject,
        replyMessage
      )

      return NextResponse.json({
        success: true,
        message: 'Reply sent successfully',
        data: updatedMessage,
      })
    }

    if (action === 'updateStatus') {
      if (!['PENDING', 'REPLIED', 'CLOSED'].includes(status)) {
        return NextResponse.json(
          { success: false, message: 'Invalid status' },
          { status: 400 }
        )
      }

      const updatedMessage = await db.contactMessage.update({
        where: { id: params.id },
        data: { status },
      })

      return NextResponse.json({
        success: true,
        message: 'Status updated successfully',
        data: updatedMessage,
      })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Update message error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update message' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/messages/[id] - Delete message
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const message = await db.contactMessage.findUnique({
      where: { id: params.id },
    })

    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Message not found' },
        { status: 404 }
      )
    }

    await db.contactMessage.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully',
    })

  } catch (error) {
    console.error('Delete message error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete message' },
      { status: 500 }
    )
  }
}
