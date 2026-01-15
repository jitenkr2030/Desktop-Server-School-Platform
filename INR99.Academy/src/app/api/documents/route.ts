import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { integrationManager, DocumentMetadata } from '@/lib/integrations/integration-manager';
import { s3StorageIntegration, formatBytes } from '@/lib/integrations/s3-storage';
import { z } from 'zod';

// Document upload validation schema
const uploadSchema = z.object({
  fileName: z.string().min(1).max(255),
  mimeType: z.string(),
  size: z.number().positive(),
  category: z.enum(['verification_document', 'id_proof', 'address_proof', 'academic_certificate', 'compliance_document', 'other']),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string()).optional(),
});

// GET /api/documents - List documents
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = session.user.organizationId;
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') as DocumentMetadata['category'] | null;
    const limit = parseInt(searchParams.get('limit') || '100');
    const continuationToken = searchParams.get('continuationToken') || undefined;

    const result = await s3StorageIntegration.listDocuments(organizationId, {
      category: category || undefined,
      maxKeys: limit,
      continuationToken,
    });

    return NextResponse.json({
      documents: result.documents,
      nextToken: result.nextToken,
      isTruncated: result.isTruncated,
    });
  } catch (error) {
    console.error('Error listing documents:', error);
    return NextResponse.json(
      { error: 'Failed to list documents' },
      { status: 500 }
    );
  }
}

// POST /api/documents - Upload document
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as DocumentMetadata['category'];
    const tags = formData.get('tags')?.toString().split(',').filter(Boolean);
    const metadataStr = formData.get('metadata')?.toString();

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    // Validate file type
    if (!s3StorageIntegration.validateFileType(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      );
    }

    // Validate file size
    if (!s3StorageIntegration.validateFileSize(file.size)) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload document
    const result = await integrationManager.uploadVerificationDocument(
      session.user.organizationId,
      buffer,
      {
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
        category,
        uploadedBy: session.user.id || 'unknown',
        tags,
        metadata: metadataStr ? JSON.parse(metadataStr) : undefined,
      }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to upload document' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      documentId: result.documentId,
      location: result.location,
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
