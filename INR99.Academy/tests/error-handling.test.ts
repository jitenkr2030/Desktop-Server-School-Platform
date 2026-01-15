import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  AppError, 
  ErrorCode, 
  createErrorResponse, 
  createSuccessResponse,
  authenticationError,
  validationError,
  notFoundError,
  permissionError,
  serverError,
  handleKnownError,
  handleZodError 
} from '@/lib/error-handling';
import { ZodError } from 'zod';

// ============================================
// ERROR CLASS TESTS
// ============================================

describe('AppError', () => {
  it('should create error with correct properties', () => {
    const error = new AppError(ErrorCode.RESOURCE_NOT_FOUND, 'Resource not found');
    
    expect(error.code).toBe(ErrorCode.RESOURCE_NOT_FOUND);
    expect(error.message).toBe('Resource not found');
    expect(error.statusCode).toBe(404);
    expect(error.isOperational).toBe(true);
    expect(error.timestamp).toBeDefined();
  });

  it('should include custom details', () => {
    const error = new AppError(ErrorCode.VALIDATION_ERROR, 'Validation failed', {
      details: { field: ['Field is required'] },
    });
    
    expect(error.details).toEqual({ field: ['Field is required'] });
  });

  it('should include request metadata', () => {
    const error = new AppError(ErrorCode.AUTH_UNAUTHORIZED, 'Invalid token', {
      requestId: 'req-123',
      path: '/api/users',
      method: 'GET',
    });
    
    expect(error.requestId).toBe('req-123');
    expect(error.path).toBe('/api/users');
    expect(error.method).toBe('GET');
  });

  it('should convert to JSON correctly', () => {
    const error = new AppError(ErrorCode.SERVER_ERROR, 'Internal error', {
      requestId: 'req-456',
    });
    
    const json = error.toJSON();
    
    expect(json.success).toBe(false);
    expect(json.error.code).toBe(ErrorCode.SERVER_ERROR);
    expect(json.error.message).toBe('Internal error');
    expect(json.error.requestId).toBe('req-456');
    expect(json.error.timestamp).toBeDefined();
  });

  it('should convert to string with details', () => {
    const error = new AppError(ErrorCode.VALIDATION_ERROR, 'Validation failed', {
      details: { email: ['Invalid format'] },
    });
    
    expect(error.toString()).toContain('[VALIDATION_ERROR]');
    expect(error.toString()).toContain('Validation failed');
  });
});

// ============================================
// ERROR FACTORY TESTS
// ============================================

describe('Error Factory Functions', () => {
  it('authenticationError should create AUTH_UNAUTHORIZED error', () => {
    const error = authenticationError('Invalid credentials');
    
    expect(error.code).toBe(ErrorCode.AUTH_UNAUTHORIZED);
    expect(error.message).toBe('Invalid credentials');
    expect(error.statusCode).toBe(401);
  });

  it('validationError should create VALIDATION_ERROR with details', () => {
    const error = validationError('Invalid data', { email: ['Invalid'] });
    
    expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
    expect(error.message).toBe('Invalid data');
    expect(error.details).toEqual({ email: ['Invalid'] });
  });

  it('notFoundError should create RESOURCE_NOT_FOUND error', () => {
    const error = notFoundError('User');
    
    expect(error.code).toBe(ErrorCode.RESOURCE_NOT_FOUND);
    expect(error.message).toBe('User not found');
    expect(error.statusCode).toBe(404);
  });

  it('permissionError should create PERMISSION_DENIED error', () => {
    const error = permissionError('Access denied');
    
    expect(error.code).toBe(ErrorCode.PERMISSION_DENIED);
    expect(error.message).toBe('Access denied');
    expect(error.statusCode).toBe(403);
  });

  it('serverError should create SERVER_ERROR with 500 status', () => {
    const error = serverError('Something went wrong');
    
    expect(error.code).toBe(ErrorCode.SERVER_ERROR);
    expect(error.message).toBe('Something went wrong');
    expect(error.statusCode).toBe(500);
  });
});

// ============================================
// ERROR HANDLING TESTS
// ============================================

describe('Error Handling', () => {
  describe('handleKnownError', () => {
    it('should return AppError as-is', () => {
      const originalError = new AppError(ErrorCode.RESOURCE_NOT_FOUND, 'Not found');
      const handled = handleKnownError(originalError);
      
      expect(handled).toBe(originalError);
    });

    it('should handle ZodError', () => {
      const zodError = new ZodError([
        { code: 'invalid_type', expected: 'string', received: 'number', path: ['name'], message: 'Expected string' },
      ]);
      
      const handled = handleKnownError(zodError);
      
      expect(handled.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(handled.details).toBeDefined();
    });

    it('should handle generic Error with "not found" message', () => {
      const error = new Error('User not found in database');
      const handled = handleKnownError(error);
      
      expect(handled.code).toBe(ErrorCode.RESOURCE_NOT_FOUND);
    });

    it('should handle generic Error with "Unauthorized" message', () => {
      const error = new Error('jwt token expired');
      const handled = handleKnownError(error);
      
      expect(handled.code).toBe(ErrorCode.AUTH_UNAUTHORIZED);
    });

    it('should handle unknown errors as server errors', () => {
      const handled = handleKnownError('unknown error');
      
      expect(handled.code).toBe(ErrorCode.SERVER_ERROR);
    });
  });

  describe('handleZodError', () => {
    it('should format ZodError details correctly', () => {
      const zodError = new ZodError([
        { code: 'invalid_type', expected: 'string', received: 'number', path: ['email'], message: 'Expected string' },
        { code: 'too_small', minimum: 1, inclusive: true, type: 'string', path: ['name'], message: 'Required' },
      ]);
      
      const handled = handleZodError(zodError);
      
      expect(handled.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(handled.details?.email).toBeDefined();
      expect(handled.details?.name).toBeDefined();
    });
  });
});

// ============================================
// RESPONSE FACTORY TESTS
// ============================================

describe('Response Factory', () => {
  describe('createErrorResponse', () => {
    it('should create error response object', () => {
      const response = createErrorResponse(
        ErrorCode.RESOURCE_NOT_FOUND,
        'Resource not found',
        { requestId: 'req-123' }
      );
      
      expect(response.success).toBe(false);
      expect(response.error.code).toBe(ErrorCode.RESOURCE_NOT_FOUND);
      expect(response.error.message).toBe('Resource not found');
      expect(response.error.requestId).toBe('req-123');
      expect(response.error.timestamp).toBeDefined();
    });
  });

  describe('createSuccessResponse', () => {
    it('should create success response with data', () => {
      const response = createSuccessResponse({ id: '1', name: 'Test' });
      
      expect(response.success).toBe(true);
      expect(response.data).toEqual({ id: '1', name: 'Test' });
    });

    it('should include meta for paginated responses', () => {
      const response = createSuccessResponse(
        [{ id: '1' }, { id: '2' }],
        { page: 1, pageSize: 10, total: 100, totalPages: 10 }
      );
      
      expect(response.meta).toEqual({
        page: 1,
        pageSize: 10,
        total: 100,
        totalPages: 10,
      });
    });
  });
});

// ============================================
// HTTP STATUS CODE TESTS
// ============================================

describe('HTTP Status Codes', () => {
  it('should map authentication errors to 401', () => {
    const error = authenticationError();
    expect(error.statusCode).toBe(401);
  });

  it('should map validation errors to 400', () => {
    const error = validationError();
    expect(error.statusCode).toBe(400);
  });

  it('should map not found errors to 404', () => {
    const error = notFoundError('Resource');
    expect(error.statusCode).toBe(404);
  });

  it('should map permission errors to 403', () => {
    const error = permissionError();
    expect(error.statusCode).toBe(403);
  });

  it('should map server errors to 500', () => {
    const error = serverError();
    expect(error.statusCode).toBe(500);
  });
});
