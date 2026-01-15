import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cloudConvertService } from '@/lib/cloudconvert'
import { getAuthenticatedUser } from '@/lib/auth'

// ==================== Upload Presigned URL ====================

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { filename, contentType, courseId, lessonId } = await request.json()

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Filename and content type are required' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
      'application/pdf',
      'video/mp4',
      'video/webm',
      'audio/mpeg',
      'audio/wav',
      'image/jpeg',
      'image/png'
    ]

    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      )
    }

    // For now, generate a simple upload URL
    // In production, use S3, UploadThing, or similar
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const fileExtension = filename.split('.').pop()
    const uniqueFilename = `${fileId}.${fileExtension}`
    
    // Store file info in database
    const fileRecord = await db.$queryRaw`
      INSERT INTO upload_files (id, filename, original_filename, content_type, course_id, lesson_id, uploaded_by, created_at)
      VALUES (${fileId}, ${uniqueFilename}, ${filename}, ${contentType}, ${courseId || null}, ${lessonId || null}, ${user.id}, NOW())
      RETURNING *
    `.catch(() => null)

    // Generate upload URL (mock for now - replace with S3/UploadThing)
    const uploadUrl = `/api/uploads/${uniqueFilename}`
    
    return NextResponse.json({
      uploadUrl,
      fileId,
      fileUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/uploads/${uniqueFilename}`,
      expiresIn: 3600 // 1 hour
    })
  } catch (error: any) {
    console.error('Upload URL generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}
