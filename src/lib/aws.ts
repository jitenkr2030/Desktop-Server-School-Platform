/**
 * AWS Configuration and Utilities
 * 
 * This module provides AWS configuration and helper functions
 * for S3, SES, and other AWS services used in the application.
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// AWS Configuration
const AWS_REGION = process.env.AWS_REGION || 'ap-south-1'
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET

// Check if AWS credentials are configured
const isAWSConfigured = !!(AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY)

// Initialize S3 Client
const s3Client = isAWSConfigured ? new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!
  }
}) : null

/**
 * Generate a unique S3 key for file storage
 */
export function generateS3Key(folder: string, filename: string): string {
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
  return `${folder}/${timestamp}-${randomSuffix}-${sanitizedFilename}`
}

/**
 * Upload a file to S3
 */
export async function uploadToS3(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!isAWSConfigured || !s3Client || !AWS_S3_BUCKET) {
    return {
      success: false,
      error: 'AWS S3 is not configured. Please set AWS credentials.'
    }
  }

  try {
    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })

    await s3Client.send(command)

    const url = `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`
    
    return { success: true, url }
  } catch (error) {
    console.error('Error uploading to S3:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload to S3'
    }
  }
}

/**
 * Get a signed URL for temporary file access
 */
export async function getSignedS3Url(
  key: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!isAWSConfigured || !s3Client || !AWS_S3_BUCKET) {
    return {
      success: false,
      error: 'AWS S3 is not configured. Please set AWS credentials.'
    }
  }

  try {
    const command = new GetObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: key,
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn })
    return { success: true, url }
  } catch (error) {
    console.error('Error generating signed URL:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate signed URL'
    }
  }
}

/**
 * Delete a file from S3
 */
export async function deleteFromS3(
  key: string
): Promise<{ success: boolean; error?: string }> {
  if (!isAWSConfigured || !s3Client || !AWS_S3_BUCKET) {
    return {
      success: false,
      error: 'AWS S3 is not configured. Please set AWS credentials.'
    }
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: key,
    })

    await s3Client.send(command)
    return { success: true }
  } catch (error) {
    console.error('Error deleting from S3:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete from S3'
    }
  }
}

/**
 * Check if AWS S3 is properly configured
 */
export function isS3Configured(): boolean {
  return isAWSConfigured && !!AWS_S3_BUCKET
}

/**
 * Get S3 bucket name
 */
export function getS3BucketName(): string | null {
  return AWS_S3_BUCKET || null
}

// Export S3 client for advanced usage
export { s3Client, isAWSConfigured }
