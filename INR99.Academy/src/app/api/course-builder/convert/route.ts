import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cloudConvertService } from '@/lib/cloudconvert'

// ==================== Trigger Conversion ====================

export async function POST(request: NextRequest) {
  try {
    const { lessonId, targetFormat } = await request.json()

    if (!lessonId || !targetFormat) {
      return NextResponse.json(
        { error: 'Lesson ID and target format are required' },
        { status: 400 }
      )
    }

    // Get the lesson with its course info
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Get the source file from conversion job or lesson
    const existingJob = await db.conversionJob.findUnique({
      where: { lessonId }
    })

    if (!existingJob) {
      return NextResponse.json(
        { error: 'No file uploaded for this lesson. Please upload a PPTX file first.' },
        { status: 400 }
      )
    }

    // Create conversion job with CloudConvert
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/course-builder/convert/webhook`
    
    const cloudConvertJob = await cloudConvertService.createConversionJob({
      lessonId,
      sourceFileUrl: existingJob.sourceFileUrl,
      sourceFileName: existingJob.sourceFileName,
      targetFormat,
      webhookUrl
    })

    // Update our job record with CloudConvert job ID
    await db.conversionJob.update({
      where: { id: existingJob.id },
      data: {
        status: 'PROCESSING',
        targetFormat: targetFormat as any
      }
    })

    // Update lesson type
    await db.lesson.update({
      where: { id: lessonId },
      data: { type: 'PPTX' }
    })

    return NextResponse.json({
      success: true,
      jobId: cloudConvertJob.id,
      status: 'PROCESSING'
    })
  } catch (error: any) {
    console.error('Conversion trigger error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to trigger conversion' },
      { status: 500 }
    )
  }
}

// ==================== Get Conversion Status ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lessonId')

    if (!lessonId) {
      return NextResponse.json(
        { error: 'Lesson ID is required' },
        { status: 400 }
      )
    }

    const job = await db.conversionJob.findUnique({
      where: { lessonId }
    })

    if (!job) {
      return NextResponse.json({ error: 'Conversion job not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: job.id,
      status: job.status,
      progress: job.progress,
      outputVideoUrl: job.outputVideoUrl,
      outputAudioUrl: job.outputAudioUrl,
      errorMessage: job.errorMessage,
      completedAt: job.completedAt
    })
  } catch (error: any) {
    console.error('Get conversion status error:', error)
    return NextResponse.json(
      { error: 'Failed to get conversion status' },
      { status: 500 }
    )
  }
}
