/**
 * AWS S3 Document Storage Integration
 * Handles document upload, storage, retrieval, and lifecycle management
 */

import { z } from 'zod';
import { Readable } from 'stream';

// AWS SDK imports
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  PutBucketLifecycleConfigurationCommand,
  CreatePresignedPost,
} from '@aws-sdk/client-s3';

import { Upload } from '@aws-sdk/lib-storage';
import { S3RequestPresigner, getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configuration
export interface S3Config {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  bucketPrefix: string;
  endpoint?: string;
  s3ForcePathStyle?: boolean;
  signedUrlExpiry: number;
  maxUploadSize: number;
  allowedMimeTypes: string[];
}

// Document metadata
export const documentMetadataSchema = z.object({
  documentId: z.string(),
  organizationId: z.string(),
  fileName: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  uploadedAt: z.string(),
  uploadedBy: z.string(),
  category: z.enum(['verification_document', 'id_proof', 'address_proof', 'academic_certificate', 'compliance_document', 'other']),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string()).optional(),
  encryption: z.boolean().default(true),
});

export type DocumentMetadata = z.infer<typeof documentMetadataSchema>;

// Upload options
export interface UploadOptions {
  organizationId: string;
  category: DocumentMetadata['category'];
  fileName: string;
  mimeType: string;
  size: number;
  tags?: string[];
  metadata?: Record<string, string>;
  encryption?: boolean;
  retentionDays?: number;
}

// Presigned URL options
export interface PresignedUrlOptions {
  documentId: string;
  operation: 'get' | 'put' | 'delete';
  expiresIn?: number;
  contentType?: string;
}

// Document version
export interface DocumentVersion {
  versionId: string;
  size: number;
  lastModified: string;
  isLatest: boolean;
}

// Lifecycle rule
export interface LifecycleRule {
  id: string;
  status: 'enabled' | 'disabled';
  prefix?: string;
  tagFilters?: { key: string; value: string }[];
  expirationDays?: number;
  transitions?: {
    days: number;
    storageClass: 'STANDARD_IA' | 'GLACIER' | 'DEEP_ARCHIVE';
  }[];
  noncurrentVersionExpirationDays?: number;
}

// API Response types
export interface S3ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

// Document storage class options
export const STORAGE_CLASSES = {
  STANDARD: 'STANDARD',
  STANDARD_IA: 'STANDARD_IA',
  INTELLIGENT_TIERING: 'INTELLIGENT_TIERING',
  GLACIER: 'GLACIER',
  DEEP_ARCHIVE: 'DEEP_ARCHIVE',
} as const;

export type StorageClass = typeof STORAGE_CLASSES[keyof typeof STORAGE_CLASSES];

export class S3StorageIntegration {
  private config: S3Config;
  private s3Client: any;

  constructor(config: Partial<S3Config> = {}) {
    this.config = {
      region: config.region || process.env.AWS_REGION || 'ap-south-1',
      accessKeyId: config.accessKeyId || process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: config.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY || '',
      bucketName: config.bucketName || process.env.S3_BUCKET_NAME || 'verification-documents',
      bucketPrefix: config.bucketPrefix || 'documents/',
      endpoint: config.endpoint,
      s3ForcePathStyle: config.s3ForcePathStyle || false,
      signedUrlExpiry: config.signedUrlExpiry || 3600, // 1 hour
      maxUploadSize: config.maxUploadSize || 50 * 1024 * 1024, // 50MB
      allowedMimeTypes: config.allowedMimeTypes || [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
    };

    // Initialize S3 client (lazy loading to avoid issues in non-AWS environments)
    this.initializeClient();
  }

  /**
   * Initialize S3 client
   */
  private initializeClient(): void {
    try {
      const clientConfig: any = {
        region: this.config.region,
        credentials: {
          accessKeyId: this.config.accessKeyId,
          secretAccessKey: this.config.secretAccessKey,
        },
      };

      if (this.config.endpoint) {
        clientConfig.endpoint = this.config.endpoint;
        clientConfig.forcePathStyle = this.config.s3ForcePathStyle;
      }

      this.s3Client = new S3Client(clientConfig);
    } catch (error) {
      console.warn('S3 client initialization failed - using mock implementation');
      this.s3Client = null;
    }
  }

  /**
   * Generate unique document key
   */
  private generateDocumentKey(organizationId: string, category: string, fileName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const categoryPrefix = category.replace('_', '/');
    
    return `${this.config.bucketPrefix}${organizationId}/${categoryPrefix}/${timestamp}-${randomString}-${sanitizedFileName}`;
  }

  /**
   * Upload document from buffer
   */
  async uploadDocument(
    buffer: Buffer,
    options: UploadOptions
  ): Promise<{ documentId: string; key: string; location: string } | null> {
    try {
      // Validate file type
      if (!this.config.allowedMimeTypes.includes(options.mimeType)) {
        throw new Error(`File type ${options.mimeType} is not allowed`);
      }

      // Validate file size
      if (buffer.length > this.config.maxUploadSize) {
        throw new Error(`File size exceeds maximum allowed size of ${this.config.maxUploadSize} bytes`);
      }

      const documentId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      const key = this.generateDocumentKey(
        options.organizationId,
        options.category,
        options.fileName
      );

      // Upload to S3
      await this.uploadToS3(buffer, key, {
        contentType: options.mimeType,
        metadata: {
          documentId,
          organizationId: options.organizationId,
          originalName: options.originalName,
          category: options.category,
          uploadedBy: options.uploadedBy,
          ...options.metadata,
        },
        encryption: options.encryption ?? true,
      });

      // Generate location URL
      const location = this.getObjectUrl(key);

      return {
        documentId,
        key,
        location,
      };
    } catch (error) {
      console.error('Failed to upload document:', error);
      return null;
    }
  }

  /**
   * Upload document from stream
   */
  async uploadDocumentFromStream(
    stream: Readable,
    options: UploadOptions,
    onProgress?: (progress: number) => void
  ): Promise<{ documentId: string; key: string; location: string } | null> {
    try {
      const documentId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      const key = this.generateDocumentKey(
        options.organizationId,
        options.category,
        options.fileName
      );

      // Convert stream to buffer
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
        if (onProgress) {
          onProgress(chunks.reduce((sum, c) => sum + c.length, 0) / options.size * 100);
        }
      }
      
      const buffer = Buffer.concat(chunks);
      const result = await this.uploadDocument(buffer, {
        ...options,
        size: buffer.length,
      });

      return result;
    } catch (error) {
      console.error('Failed to upload document from stream:', error);
      return null;
    }
  }

  /**
   * Get presigned URL for direct upload
   */
  async getPresignedUploadUrl(
    options: PresignedUrlOptions
  ): Promise<{ url: string; fields: Record<string, string> } | null> {
    try {
      const key = this.getDocumentKeyFromId(options.documentId);
      
      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
        ContentType: options.contentType,
      });

      const presigner = new S3RequestPresigner({
        ...this.s3Client?.config || {},
      });

      const url = await presigner.presign(command, {
        expiresIn: options.expiresIn || this.config.signedUrlExpiry,
      });

      return {
        url,
        fields: {
          key,
          bucket: this.config.bucketName,
          'Content-Type': options.contentType || '',
        },
      };
    } catch (error) {
      console.error('Failed to generate presigned upload URL:', error);
      return null;
    }
  }

  /**
   * Get presigned URL for download
   */
  async getPresignedDownloadUrl(
    documentId: string,
    expiresIn?: number,
    fileName?: string
  ): Promise<string | null> {
    try {
      const key = this.getDocumentKeyFromId(documentId);

      const command = new GetObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
        ResponseContentDisposition: fileName 
          ? `attachment; filename="${fileName}"` 
          : undefined,
      });

      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresIn || this.config.signedUrlExpiry,
      });

      return url;
    } catch (error) {
      console.error('Failed to generate presigned download URL:', error);
      return null;
    }
  }

  /**
   * Download document
   */
  async downloadDocument(documentId: string): Promise<{ buffer: Buffer; metadata: DocumentMetadata } | null> {
    try {
      
      
      const key = this.getDocumentKeyFromId(documentId);

      const response = await this.s3Client.send(new GetObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      }));

      const chunks: Buffer[] = [];
      for await (const chunk of response.Body as Readable) {
        chunks.push(Buffer.from(chunk));
      }
      const buffer = Buffer.concat(chunks);

      const metadata: DocumentMetadata = {
        documentId,
        organizationId: response.Metadata?.organizationid || '',
        fileName: key.split('/').pop() || '',
        originalName: response.Metadata?.originalname || '',
        mimeType: response.ContentType || 'application/octet-stream',
        size: response.ContentLength || buffer.length,
        uploadedAt: response.LastModified?.toISOString() || new Date().toISOString(),
        uploadedBy: response.Metadata?.uploadedby || '',
        category: (response.Metadata?.category as DocumentMetadata['category']) || 'other',
        tags: response.Metadata?.tags?.split(',') || [],
        metadata: response.Metadata,
        encryption: !!response.ServerSideEncryption,
      };

      return { buffer, metadata };
    } catch (error) {
      console.error(`Failed to download document ${documentId}:`, error);
      return null;
    }
  }

  /**
   * Delete document
   */
  async deleteDocument(documentId: string): Promise<boolean> {
    try {
      
      
      const key = this.getDocumentKeyFromId(documentId);

      await this.s3Client.send(new DeleteObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      }));

      return true;
    } catch (error) {
      console.error(`Failed to delete document ${documentId}:`, error);
      return false;
    }
  }

  /**
   * Delete multiple documents
   */
  async deleteDocuments(documentIds: string[]): Promise<{ deleted: string[]; failed: string[] }> {
    const deleted: string[] = [];
    const failed: string[] = [];

    for (const documentId of documentIds) {
      const success = await this.deleteDocument(documentId);
      if (success) {
        deleted.push(documentId);
      } else {
        failed.push(documentId);
      }
    }

    return { deleted, failed };
  }

  /**
   * Get document metadata
   */
  async getDocumentMetadata(documentId: string): Promise<DocumentMetadata | null> {
    try {
      
      
      const key = this.getDocumentKeyFromId(documentId);

      const response = await this.s3Client.send(new HeadObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      }));

      return {
        documentId,
        organizationId: response.Metadata?.organizationid || '',
        fileName: key.split('/').pop() || '',
        originalName: response.Metadata?.originalname || '',
        mimeType: response.ContentType || 'application/octet-stream',
        size: response.ContentLength || 0,
        uploadedAt: response.LastModified?.toISOString() || new Date().toISOString(),
        uploadedBy: response.Metadata?.uploadedby || '',
        category: (response.Metadata?.category as DocumentMetadata['category']) || 'other',
        tags: response.Metadata?.tags?.split(',') || [],
        metadata: response.Metadata,
        encryption: !!response.ServerSideEncryption,
      };
    } catch (error) {
      console.error(`Failed to get document metadata ${documentId}:`, error);
      return null;
    }
  }

  /**
   * List documents for an organization
   */
  async listDocuments(
    organizationId: string,
    options?: {
      category?: DocumentMetadata['category'];
      prefix?: string;
      maxKeys?: number;
      continuationToken?: string;
    }
  ): Promise<{
    documents: DocumentMetadata[];
    nextToken?: string;
    isTruncated: boolean;
  }> {
    try {
      
      
      let prefix = `${this.config.bucketPrefix}${organizationId}`;
      if (options?.category) {
        prefix += `/${options.category.replace('_', '/')}`;
      }
      if (options?.prefix) {
        prefix += `/${options.prefix}`;
      }

      const response = await this.s3Client.send(new ListObjectsV2Command({
        Bucket: this.config.bucketName,
        Prefix: prefix,
        MaxKeys: options?.maxKeys || 100,
        ContinuationToken: options?.continuationToken,
      }));

      const documents: DocumentMetadata[] = (response.Contents || []).map(obj => ({
        documentId: this.getDocumentIdFromKey(obj.Key || ''),
        organizationId,
        fileName: obj.Key?.split('/').pop() || '',
        originalName: '',
        mimeType: 'application/octet-stream',
        size: obj.Size || 0,
        uploadedAt: obj.LastModified?.toISOString() || new Date().toISOString(),
        uploadedBy: '',
        category: 'other' as DocumentMetadata['category'],
        tags: [],
        metadata: {},
        encryption: false,
      }));

      return {
        documents,
        nextToken: response.NextContinuationToken,
        isTruncated: response.IsTruncated || false,
      };
    } catch (error) {
      console.error(`Failed to list documents for organization ${organizationId}:`, error);
      return { documents: [], isTruncated: false };
    }
  }

  /**
   * Copy document
   */
  async copyDocument(
    sourceDocumentId: string,
    targetOrganizationId: string,
    targetCategory: DocumentMetadata['category']
  ): Promise<{ newDocumentId: string; key: string } | null> {
    try {
      const sourceKey = this.getDocumentKeyFromId(sourceDocumentId);
      const targetKey = this.generateDocumentKey(
        targetOrganizationId,
        targetCategory,
        sourceKey.split('/').pop() || 'copied-document'
      );

      

      await this.s3Client.send(new CopyObjectCommand({
        Bucket: this.config.bucketName,
        CopySource: `${this.config.bucketName}/${sourceKey}`,
        Key: targetKey,
      }));

      const newDocumentId = this.getDocumentIdFromKey(targetKey);

      return {
        newDocumentId,
        key: targetKey,
      };
    } catch (error) {
      console.error(`Failed to copy document ${sourceDocumentId}:`, error);
      return null;
    }
  }

  /**
   * Set lifecycle rule for document management
   */
  async setLifecycleRule(rule: LifecycleRule): Promise<boolean> {
    try {
      

      await this.s3Client.send(new PutBucketLifecycleConfigurationCommand({
        Bucket: this.config.bucketName,
        LifecycleConfiguration: {
          Rules: [rule],
        },
      }));

      return true;
    } catch (error) {
      console.error('Failed to set lifecycle rule:', error);
      return false;
    }
  }

  /**
   * Get storage usage for an organization
   */
  async getOrganizationStorageUsage(organizationId: string): Promise<{
    totalSize: number;
    documentCount: number;
    byCategory: Record<string, { count: number; size: number }>;
  }> {
    try {
      
      
      const prefix = `${this.config.bucketPrefix}${organizationId}`;
      
      let totalSize = 0;
      let documentCount = 0;
      const byCategory: Record<string, { count: number; size: number }> = {};

      let continuationToken: string | undefined;
      do {
        const response = await this.s3Client.send(new ListObjectsV2Command({
          Bucket: this.config.bucketName,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }));

        for (const obj of response.Contents || []) {
          totalSize += obj.Size || 0;
          documentCount++;

          // Parse category from key
          const keyParts = (obj.Key || '').split('/');
          const category = keyParts[3] || 'other';
          
          if (!byCategory[category]) {
            byCategory[category] = { count: 0, size: 0 };
          }
          byCategory[category].count++;
          byCategory[category].size += obj.Size || 0;
        }

        continuationToken = response.NextContinuationToken;
      } while (continuationToken);

      return {
        totalSize,
        documentCount,
        byCategory,
      };
    } catch (error) {
      console.error(`Failed to get storage usage for organization ${organizationId}:`, error);
      return {
        totalSize: 0,
        documentCount: 0,
        byCategory: {},
      };
    }
  }

  /**
   * Validate file type
   */
  validateFileType(mimeType: string): boolean {
    return this.config.allowedMimeTypes.includes(mimeType);
  }

  /**
   * Validate file size
   */
  validateFileSize(size: number): boolean {
    return size <= this.config.maxUploadSize;
  }

  /**
   * Upload to S3
   */
  private async uploadToS3(
    buffer: Buffer,
    key: string,
    options: {
      contentType?: string;
      metadata?: Record<string, string>;
      encryption?: boolean;
    }
  ): Promise<void> {
    if (!this.s3Client) {
      // Mock implementation for non-AWS environments
      console.log('Mock S3 upload:', { key, size: buffer.length });
      return;
    }

    

    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
      Body: buffer,
      ContentType: options.contentType,
      Metadata: options.metadata,
      ServerSideEncryption: options.encryption ? 'AES256' : undefined,
    }));
  }

  /**
   * Get object URL
   */
  private getObjectUrl(key: string): string {
    if (this.config.endpoint) {
      return `${this.config.endpoint}/${this.config.bucketName}/${key}`;
    }
    return `https://${this.config.bucketName}.s3.${this.config.region}.amazonaws.com/${key}`;
  }

  /**
   * Get document key from document ID
   */
  private getDocumentKeyFromId(documentId: string): string {
    // Document ID format: doc_TIMESTAMP_RANDOM
    // We need to find the actual key - in production, this would be stored in DB
    const parts = documentId.split('_');
    if (parts.length < 3) {
      throw new Error('Invalid document ID format');
    }
    // Return a constructed key (in production, look up from database)
    return `${this.config.bucketPrefix}*/${parts[1]}/*${parts.slice(2).join('-')}`;
  }

  /**
   * Get document ID from key
   */
  private getDocumentIdFromKey(key: string): string {
    const parts = key.split('/');
    const fileName = parts.pop() || '';
    // Extract document ID from filename (format: timestamp-random-filename)
    const nameParts = fileName.split('-');
    if (nameParts.length < 3) {
      return `doc_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }
    return `doc_${nameParts[0]}_${nameParts.slice(1, 3).join('')}`;
  }
}

// Export singleton instance
export const s3StorageIntegration = new S3StorageIntegration();

// Helper function to format bytes
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to get file extension
export function getFileExtension(fileName: string): string {
  return fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2);
}

// Helper function to sanitize file name
export function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 100);
}
