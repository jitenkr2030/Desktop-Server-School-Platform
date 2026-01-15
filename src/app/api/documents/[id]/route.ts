import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { integrationManager } from '@/lib/integrations/integration-manager';
import { s3StorageIntegration, formatBytes } from '@/lib/integrations/s3-storage';

// GET /api/documents/[id] - Get document details or delete
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const documentId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const download = searchParams.get('download') === 'true';
    const expiresIn = parseInt(searchParams.get('expiresIn') || '3600');

    // Get document metadata
    const metadata = await s3StorageIntegration.getDocumentMetadata(documentId);
    
    if (!metadata) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Verify ownership
    if (metadata.organizationId !== session.user.organizationId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get download URL if requested
    let downloadUrl: string | null = null;
    if (download) {
      downloadUrl = await s3StorageIntegration.getPresignedDownloadUrl(
        documentId,
        expiresIn,
        metadata.originalName || metadata.fileName
      );
    }

    return NextResponse.json({
      metadata,
      ...(downloadUrl && { downloadUrl }),
    });
  } catch (error) {
    console.error('Error getting document:', error);
    return NextResponse.json(
      { error: 'Failed to get document' },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/[id] - Delete document
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const documentId = params.id;

    // Get metadata first to verify ownership
    const metadata = await s3StorageIntegration.getDocumentMetadata(documentId);
    
    if (!metadata) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (metadata.organizationId !== session.user.organizationId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const success = await s3StorageIntegration.deleteDocument(documentId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete document' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, deleted: documentId });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
