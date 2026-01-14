import { ZodError } from 'zod';

// ============================================
// COMPREHENSIVE ERROR HANDLING SYSTEM
// Provides consistent error handling across the application
// ============================================

// Error codes enum
export enum ErrorCode {
  // Authentication errors (AUTH_*)
  AUTH_INVALID_TOKEN = 'AUTH_INVALID_TOKEN',
  AUTH_EXPIRED_TOKEN = 'AUTH_EXPIRED_TOKEN',
  AUTH_MISSING_TOKEN = 'AUTH_MISSING_TOKEN',
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_ACCOUNT_LOCKED = 'AUTH_ACCOUNT_LOCKED',
  AUTH_ACCOUNT_INACTIVE = 'AUTH_ACCOUNT_INACTIVE',
  AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED',
  
  // Validation errors (VALIDATION_*)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  VALIDATION_REQUIRED = 'VALIDATION_REQUIRED',
  VALIDATION_INVALID_FORMAT = 'VALIDATION_INVALID_FORMAT',
  VALIDATION_OUT_OF_RANGE = 'VALIDATION_OUT_OF_RANGE',
  VALIDATION_DUPLICATE = 'VALIDATION_DUPLICATE',
  
  // Resource errors (RESOURCE_*)
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  RESOURCE_DELETED = 'RESOURCE_DELETED',
  RESOURCE_ARCHIVED = 'RESOURCE_ARCHIVED',
  
  // Permission errors (PERMISSION_*)
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  PERMISSION_INSUFFICIENT = 'PERMISSION_INSUFFICIENT',
  PERMISSION_ROLE_INVALID = 'PERMISSION_ROLE_INVALID',
  
  // Tenant errors (TENANT_*)
  TENANT_NOT_FOUND = 'TENANT_NOT_FOUND',
  TENANT_INACTIVE = 'TENANT_INACTIVE',
  TENANT_SUSPENDED = 'TENANT_SUSPENDED',
  TENANT_EXPIRED = 'TENANT_EXPIRED',
  
  // Rate limit errors (RATE_*)
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  
  // Server errors (SERVER_*)
  SERVER_ERROR = 'SERVER_ERROR',
  SERVER_UNAVAILABLE = 'SERVER_UNAVAILABLE',
  SERVER_TIMEOUT = 'SERVER_TIMEOUT',
  SERVER_DATABASE_ERROR = 'SERVER_DATABASE_ERROR',
  
  // File errors (FILE_*)
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  FILE_INVALID_TYPE = 'FILE_INVALID_TYPE',
  FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED',
  
  // Payment errors (PAYMENT_*)
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_DECLINED = 'PAYMENT_DECLINED',
  PAYMENT_EXPIRED = 'PAYMENT_EXPIRED',
  PAYMENT_SUBSCRIPTION_FAILED = 'PAYMENT_SUBSCRIPTION_FAILED',
  
  // Custom domain errors (DOMAIN_*)
  DOMAIN_NOT_VERIFIED = 'DOMAIN_NOT_VERIFIED',
  DOMAIN_EXISTS = 'DOMAIN_EXISTS',
  DOMAIN_INVALID = 'DOMAIN_INVALID',
  DOMAIN_LIMIT_EXCEEDED = 'DOMAIN_LIMIT_EXCEEDED',
}

// HTTP status codes mapping
export const ErrorHttpStatus: Record<ErrorCode, number> = {
  // Authentication errors - 401
  AUTH_INVALID_TOKEN: 401,
  AUTH_EXPIRED_TOKEN: 401,
  AUTH_MISSING_TOKEN: 401,
  AUTH_INVALID_CREDENTIALS: 401,
  AUTH_ACCOUNT_LOCKED: 403,
  AUTH_ACCOUNT_INACTIVE: 403,
  AUTH_UNAUTHORIZED: 401,
  
  // Validation errors - 400
  VALIDATION_ERROR: 400,
  VALIDATION_REQUIRED: 400,
  VALIDATION_INVALID_FORMAT: 400,
  VALIDATION_OUT_OF_RANGE: 400,
  VALIDATION_DUPLICATE: 409,
  
  // Resource errors - 404/409
  RESOURCE_NOT_FOUND: 404,
  RESOURCE_ALREADY_EXISTS: 409,
  RESOURCE_CONFLICT: 409,
  RESOURCE_DELETED: 410,
  RESOURCE_ARCHIVED: 410,
  
  // Permission errors - 403
  PERMISSION_DENIED: 403,
  PERMISSION_INSUFFICIENT: 403,
  PERMISSION_ROLE_INVALID: 403,
  
  // Tenant errors - 403/404
  TENANT_NOT_FOUND: 404,
  TENANT_INACTIVE: 403,
  TENANT_SUSPENDED: 403,
  TENANT_EXPIRED: 403,
  
  // Rate limit errors - 429
  RATE_LIMIT_EXCEEDED: 429,
  TOO_MANY_REQUESTS: 429,
  
  // Server errors - 500
  SERVER_ERROR: 500,
  SERVER_UNAVAILABLE: 503,
  SERVER_TIMEOUT: 504,
  SERVER_DATABASE_ERROR: 500,
  
  // File errors - 400/404/413
  FILE_NOT_FOUND: 404,
  FILE_TOO_LARGE: 413,
  FILE_INVALID_TYPE: 400,
  FILE_UPLOAD_FAILED: 500,
  
  // Payment errors - 400/402
  PAYMENT_FAILED: 400,
  PAYMENT_DECLINED: 402,
  PAYMENT_EXPIRED: 400,
  PAYMENT_SUBSCRIPTION_FAILED: 402,
  
  // Custom domain errors - 400/409
  DOMAIN_NOT_VERIFIED: 400,
  DOMAIN_EXISTS: 409,
  DOMAIN_INVALID: 400,
  DOMAIN_LIMIT_EXCEEDED: 400,
};

// Custom error class
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;
  public readonly isOperational: boolean;
  public readonly timestamp: string;
  public readonly requestId?: string;
  public readonly path?: string;
  public readonly method?: string;

  constructor(
    code: ErrorCode,
    message: string,
    options: {
      details?: Record<string, unknown>;
      isOperational?: boolean;
      requestId?: string;
      path?: string;
      method?: string;
    } = {}
  ) {
    super(message);
    
    this.code = code;
    this.statusCode = ErrorHttpStatus[code] || 500;
    this.details = options.details;
    this.isOperational = options.isOperational ?? true;
    this.timestamp = new Date().toISOString();
    this.requestId = options.requestId;
    this.path = options.path;
    this.method = options.method;
    
    // Capture stack trace (excluding constructor)
    Error.captureStackTrace(this, AppError);
  }

  toJSON(): ErrorResponse {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
        timestamp: this.timestamp,
        requestId: this.requestId,
      },
    };
  }

  toString(): string {
    return `[${this.code}] ${this.message}${this.details ? ` - ${JSON.stringify(this.details)}` : ''}`;
  }
}

// Error response interface
export interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
    timestamp: string;
    requestId?: string;
  };
}

// Success response interface
export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

// API Response wrapper
export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

// Create error response
export function createErrorResponse(
  code: ErrorCode,
  message: string,
  options: {
    details?: Record<string, unknown>;
    requestId?: string;
  } = {}
): ErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details: options.details,
      timestamp: new Date().toISOString(),
      requestId: options.requestId,
    },
  };
}

// Create success response
export function createSuccessResponse<T>(
  data: T,
  meta?: SuccessResponse<T>['meta']
): SuccessResponse<T> {
  return {
    success: true,
    data,
    meta,
  };
}

// Error factory functions
export function authenticationError(
  message: string = 'Authentication failed',
  options?: Parameters<typeof AppError>[2]
): AppError {
  return new AppError(ErrorCode.AUTH_UNAUTHORIZED, message, options);
}

export function validationError(
  message: string = 'Validation failed',
  details?: Record<string, unknown>,
  options?: Parameters<typeof AppError>[2]
): AppError {
  return new AppError(ErrorCode.VALIDATION_ERROR, message, { details, ...options });
}

export function notFoundError(
  resource: string,
  options?: Parameters<typeof AppError>[2]
): AppError {
  return new AppError(ErrorCode.RESOURCE_NOT_FOUND, `${resource} not found`, options);
}

export function permissionError(
  message: string = 'You do not have permission to perform this action',
  options?: Parameters<typeof AppError>[2]
): AppError {
  return new AppError(ErrorCode.PERMISSION_DENIED, message, options);
}

export function conflictError(
  message: string = 'Resource conflict',
  options?: Parameters<typeof AppError>[2]
): AppError {
  return new AppError(ErrorCode.RESOURCE_CONFLICT, message, options);
}

export function rateLimitError(
  message: string = 'Too many requests',
  options?: Parameters<typeof AppError>[2]
): AppError {
  return new AppError(ErrorCode.RATE_LIMIT_EXCEEDED, message, options);
}

export function serverError(
  message: string = 'Internal server error',
  options?: Parameters<typeof AppError>[2]
): AppError {
  return new AppError(ErrorCode.SERVER_ERROR, message, options);
}

// Handle Zod validation errors
export function handleZodError(error: ZodError): AppError {
  const details: Record<string, unknown> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!details[path]) {
      details[path] = [];
    }
    (details[path] as string[]).push({
      message: err.message,
      code: err.code,
    });
  });
  
  return validationError('Validation failed', details);
}

// Handle known error types
export function handleKnownError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }
  
  if (error instanceof ZodError) {
    return handleZodError(error);
  }
  
  if (error instanceof Error) {
    // Check for common error patterns
    if (error.message.includes('not found')) {
      return notFoundError('Resource');
    }
    if (error.message.includes('Unauthorized') || error.message.includes('jwt')) {
      return authenticationError(error.message);
    }
    if (error.message.includes('permission') || error.message.includes('access')) {
      return permissionError(error.message);
    }
    
    return serverError(error.message);
  }
  
  return serverError('An unexpected error occurred');
}

// ============================================
// NEXT.JS API ROUTE ERROR HANDLER
// ============================================

import { NextRequest, NextResponse } from 'next/server';

export interface ErrorHandlerOptions {
  includeStackTrace?: boolean;
  logErrors?: boolean;
  defaultMessage?: string;
}

const defaultOptions: ErrorHandlerOptions = {
  includeStackTrace: process.env.NODE_ENV === 'development',
  logErrors: true,
  defaultMessage: 'An unexpected error occurred',
};

// Global error handler for API routes
export function handleApiError(
  error: unknown,
  request: NextRequest,
  options: ErrorHandlerOptions = defaultOptions
): NextResponse {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();
  
  // Handle known errors
  const appError = handleKnownError(error);
  
  // Log error
  if (options.logErrors) {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      requestId,
      method: request.method,
      url: request.url,
      code: appError.code,
      message: appError.message,
      stack: appError.stack,
      ...(options.includeStackTrace && { stack: appError.stack }),
    }));
  }
  
  // Create response
  const response = appError.toJSON();
  response.error.requestId = requestId;
  
  return NextResponse.json(response, {
    status: appError.statusCode,
    headers: {
      'X-Request-Id': requestId,
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

// Error handler wrapper for API routes
export function withErrorHandler(
  handler: (request: NextRequest, ...args: unknown[]) => Promise<NextResponse | unknown>,
  options: ErrorHandlerOptions = defaultOptions
) {
  return async (request: NextRequest, ...args: unknown[]): Promise<NextResponse> => {
    try {
      const response = await handler(request, ...args);
      return response as NextResponse;
    } catch (error) {
      return handleApiError(error, request, options);
    }
  };
}

// ============================================
// FRONTEND ERROR BOUNDARY & TOAST SYSTEM
// ============================================

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Toast state management
export class ToastManager {
  private toasts: Toast[] = [];
  private listeners: ((toasts: Toast[]) => void)[] = [];

  add(toast: Omit<Toast, 'id'>): string {
    const id = crypto.randomUUID();
    const newToast: Toast = {
      id,
      dismissible: true,
      duration: 5000,
      ...toast,
    };
    
    this.toasts = [...this.toasts, newToast];
    this.notify();
    
    // Auto-dismiss
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => this.remove(id), newToast.duration);
    }
    
    return id;
  }

  remove(id: string): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  clear(): void {
    this.toasts = [];
    this.notify();
  }

  subscribe(listener: (toasts: Toast[]) => void): () => void {
    this.listeners.push(listener);
    listener(this.toasts);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.toasts));
  }

  getToasts(): Toast[] {
    return [...this.toasts];
  }

  // Convenience methods
  success(title: string, message?: string): string {
    return this.add({ type: 'success', title, message });
  }

  error(title: string, message?: string): string {
    return this.add({ type: 'error', title, message, duration: 8000 });
  }

  warning(title: string, message?: string): string {
    return this.add({ type: 'warning', title, message });
  }

  info(title: string, message?: string): string {
    return this.add({ type: 'info', title, message });
  }
}

// Singleton toast manager
export const toastManager = new ToastManager();

// ============================================
// LOADING STATE MANAGEMENT
// ============================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingContext {
  state: LoadingState;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  start: () => void;
  stop: () => void;
  setSuccess: () => void;
  setError: (error: Error) => void;
  reset: () => void;
}

export function createLoadingContext(): LoadingContext {
  let state: LoadingState = 'idle';
  let error: Error | null = null;
  
  const listeners: ((state: LoadingState, error: Error | null) => void)[] = [];
  
  const notify = () => {
    listeners.forEach((listener) => listener(state, error));
  };
  
  return {
    get state() {
      return state;
    },
    get isLoading() {
      return state === 'loading';
    },
    get isSuccess() {
      return state === 'success';
    },
    get isError() {
      return state === 'error';
    },
    get error() {
      return error;
    },
    start: () => {
      state = 'loading';
      error = null;
      notify();
    },
    stop: () => {
      state = 'idle';
      notify();
    },
    setSuccess: () => {
      state = 'success';
      error = null;
      notify();
    },
    setError: (err: Error) => {
      state = 'error';
      error = err;
      notify();
    },
    reset: () => {
      state = 'idle';
      error = null;
      notify();
    },
    subscribe: (listener: (state: LoadingState, error: Error | null) => void) => {
      listeners.push(listener);
      listener(state, error);
      return () => {
        listeners.splice(listeners.indexOf(listener), 1);
      };
    },
  };
}

// Async operation wrapper with loading state
export async function withLoading<T>(
  context: LoadingContext,
  operation: () => Promise<T>
): Promise<T> {
  context.start();
  try {
    const result = await operation();
    context.setSuccess();
    return result;
  } catch (error) {
    context.setError(error as Error);
    throw error;
  }
}

// ============================================
// REQUEST TRACKING
// ============================================

export interface RequestTracker {
  id: string;
  method: string;
  url: string;
  startTime: number;
  duration?: number;
  status?: number;
  error?: Error;
}

const activeRequests: Map<string, RequestTracker> = new Map();

export function startRequest(request: NextRequest): RequestTracker {
  const id = request.headers.get('x-request-id') || crypto.randomUUID();
  const tracker: RequestTracker = {
    id,
    method: request.method,
    url: request.url,
    startTime: Date.now(),
  };
  
  activeRequests.set(id, tracker);
  return tracker;
}

export function endRequest(id: string, status?: number, error?: Error): void {
  const tracker = activeRequests.get(id);
  if (tracker) {
    tracker.duration = Date.now() - tracker.startTime;
    tracker.status = status;
    tracker.error = error;
    activeRequests.delete(id);
  }
}

export function getActiveRequests(): RequestTracker[] {
  return Array.from(activeRequests.values());
}

export function getSlowRequests(thresholdMs: number = 5000): RequestTracker[] {
  return Array.from(activeRequests.values()).filter(
    (r) => Date.now() - r.startTime > thresholdMs
  );
}

export type {
  ErrorResponse,
  SuccessResponse,
  ApiResponse,
  Toast,
  ToastType,
  LoadingContext,
  RequestTracker,
};
