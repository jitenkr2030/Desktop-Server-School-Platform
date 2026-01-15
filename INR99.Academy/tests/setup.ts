// ============================================
// TEST SETUP & UTILITIES
// Global test configuration and helpers
// ============================================

import '@testing-library/jest-dom';
import { vi, beforeAll, afterAll, afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock console methods for cleaner test output
const originalConsole = { ...console };

// Suppress console logs during tests (optional)
beforeAll(() => {
  if (process.env.SUPPRESS_CONSOLE === 'true') {
    console.log = vi.fn();
    console.info = vi.fn();
    console.warn = vi.fn();
    console.debug = vi.fn();
  }
});

afterAll(() => {
  console.log = originalConsole.log;
  console.info = originalConsole.info;
  console.warn = originalConsole.warn;
  console.debug = originalConsole.debug;
});

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.clearAllTimers();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  writable: true,
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  writable: true,
  value: sessionStorageMock,
});

// Mock crypto.randomUUID
Object.defineProperty(crypto, 'randomUUID', {
  writable: true,
  value: vi.fn(() => 'test-uuid-' + Math.random().toString(36).substring(7)),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});

// ============================================
// TEST HELPERS
// ============================================

// Create mock implementation
export function createMock<T>(overrides: Partial<T> = {}): T {
  return {
    ...overrides,
  } as T;
}

// Mock function with implementation
export function mockFn<T extends (...args: unknown[]) => unknown>(
  implementation?: T
): ReturnType<typeof vi.fn> {
  return vi.fn(implementation);
}

// Async mock function
export async function mockAsyncFn<T>(
  implementation: () => Promise<T>
): ReturnType<typeof vi.fn> {
  return vi.fn(implementation);
}

// Wait for a specified time
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Wait for async operations to settle
export function flushPromises(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}

// Create mock event
export function createMockEvent<T = Event>(
  overrides: Partial<T> = {}
): T {
  return {
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    ...overrides,
  } as T;
}

// Create mock form data
export function createMockFormData(data: Record<string, string>): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
}

// Mock Next.js navigation
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
  back: vi.fn(),
  prefetch: vi.fn(),
  beforePopState: vi.fn(),
  events: {
    on: vi.fn(),
    off: vi.fn(),
  },
};

// Mock Next.js useRouter
export const mockUseRouter = {
  push: mockRouter.push,
  replace: mockRouter.replace,
  reload: mockRouter.reload,
  back: mockRouter.back,
  prefetch: mockRouter.prefetch,
  pathname: '/',
  query: {},
  asPath: '/',
  isFallback: false,
  isPreview: false,
  isLocaleDomain: false,
};

// Mock Next.js usePathname
export const mockUsePathname = vi.fn(() => '/');

// Mock Next.js useSearchParams
export const mockUseSearchParams = vi.fn(() => new URLSearchParams());

// Mock Next.js useParams
export const mockUseParams = vi.fn(() => ({}));

// ============================================
// ASSERTION HELPERS
// ============================================

// Assert function throws error
export async function expectThrows(
  fn: () => unknown | Promise<unknown>,
  errorMessage?: string
): Promise<void> {
  let thrown = false;
  let actualError: unknown;
  
  try {
    await fn();
  } catch (error) {
    thrown = true;
    actualError = error;
  }
  
  expect(thrown).toBe(true);
  
  if (errorMessage && actualError instanceof Error) {
    expect(actualError.message).toContain(errorMessage);
  }
}

// Assert async function throws specific error
export async function expectThrowsAsync<T extends Error>(
  fn: () => unknown | Promise<unknown>,
  errorType: new (...args: unknown[]) => T,
  errorMessage?: string
): Promise<void> {
  await expect(fn).rejects.toThrow(errorType);
  
  try {
    await fn();
  } catch (error) {
    if (errorMessage && error instanceof Error) {
      expect(error.message).toContain(errorMessage);
    }
  }
}

// Assert objects are deeply equal (ignoring specific keys)
export function toMatchWithExcluded(
  received: Record<string, unknown>,
  expected: Record<string, unknown>,
  excludedKeys: string[] = []
): void {
  const filteredReceived = { ...received };
  const filteredExpected = { ...expected };
  
  excludedKeys.forEach((key) => {
    delete filteredReceived[key];
    delete filteredExpected[key];
  });
  
  expect(filteredReceived).toEqual(filteredExpected);
}

// ============================================
// MOCK API RESPONSES
// ============================================

export const mockApiResponses = {
  success: <T>(data: T) => ({
    success: true,
    data,
  }),
  
  error: (code: string, message: string) => ({
    success: false,
    error: {
      code,
      message,
      timestamp: new Date().toISOString(),
    },
  }),
  
  paginated: <T>(data: T[], page = 1, pageSize = 20, total = 100) => ({
    success: true,
    data,
    meta: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  }),
};

// ============================================
// MOCK DATABASE
// ============================================

export const mockDb = {
  user: {
    findMany: mockFn(),
    findUnique: mockFn(),
    create: mockFn(),
    update: mockFn(),
    delete: mockFn(),
    count: mockFn(),
  },
  course: {
    findMany: mockFn(),
    findUnique: mockFn(),
    create: mockFn(),
    update: mockFn(),
    delete: mockFn(),
    count: mockFn(),
  },
  tenant: {
    findMany: mockFn(),
    findUnique: mockFn(),
    create: mockFn(),
    update: mockFn(),
    delete: mockFn(),
    count: mockFn(),
  },
  // Add more as needed
};

// ============================================
// EXPORTS
// ============================================

export {
  wait,
  flushPromises,
  createMock,
  mockFn,
  mockAsyncFn,
  createMockEvent,
  createMockFormData,
  mockRouter,
  mockUseRouter,
  mockUsePathname,
  mockUseSearchParams,
  mockUseParams,
};
