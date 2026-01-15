import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

// ==================== CloudConvert Webhook Handler ====================

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const signature = request.headers.get('cloudconvert-signature')

    // Verify webhook signature (if configured)
    if (process.env.CLOUDCONVERT_WEBHOOK_SECRET && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.CLOUDCONVERT_WEBHOOK_SECRET)
        .update(JSON.stringify(payload))
        .digest('hex')

      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    console.log('CloudConvert webhook received:', JSON.stringify(payload, null, 2))

    // Extract job and task info from payload
    const { event, job, task } = payload

    if (event !== 'task.completed' && event !== 'job.completed') {
      return NextResponse.json({ received: true })
    }

    // Find the conversion job by CloudConvert job ID
    // Note: You might need to store the CloudConvert job ID in your database
    // For now, we'll try to find it through related tasks

    // Get all pending/processing jobs and check their status
    const pendingJobs = await db.conversionJob.findMany({
      where: {
        status: { in: ['PENDING', 'PROCESSING'] }
      },
      take: 100
    })

    // Check each job's tasks through CloudConvert API
    // This is a simplified approach; in production, store the CloudConvert job ID

    if (task?.status === 'completed') {
      // Find the job that matches this task
      // In production, you'd store the CloudConvert task ID
      
      // Get the output files
      const outputFiles = task.result?.files || []
      
      // Determine output URLs
      let outputVideoUrl: string | undefined
      let outputAudioUrl: string | undefined

      for (const file of outputFiles) {
        if (file.filename?.endsWith('.mp4')) {
          outputVideoUrl = file.url
        } else if (file.filename?.endsWith('.mp3')) {
          outputAudioUrl = file.url
        }
      }

      // Find and update the conversion job
      // This is a placeholder - you should match by CloudConvert job ID
      console.log('Conversion completed:', {
        outputVideoUrl,
        outputAudioUrl,
        taskId: task.id
      })

      return NextResponse.json({ received: true })
    }

    if (task?.status === 'failed') {
      console.error('Conversion failed:', task.message)
      
      // Find and update the failed job
      // await db.conversionJob.update({...})
      
      return NextResponse.json({ received: true })
    }

    // Handle progress updates
    if (task?.status === 'working') {
      const progress = task.progress || 0
      console.log(`Conversion progress: ${progress}%`)
      
      // Update progress in database
      // await db.conversionJob.update({...})
      
      return NextResponse.json({ received: true })
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// ==================== Webhook Test Endpoint ====================

export async function GET(request: NextRequest) {
  return NextResponse.json({
    service: 'Course Builder Webhook',
    status: 'active',
    endpoints: {
      POST: 'CloudConvert webhook handler'
    }
  })
}
