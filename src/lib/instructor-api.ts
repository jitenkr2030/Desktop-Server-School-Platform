// Instructor API Service
// This service handles all instructor-related API calls

const API_BASE = '/api/instructor'

export interface InstructorStats {
  totalCourses: number
  publishedCourses: number
  pendingCourses: number
  totalStudents: number
  totalEarnings: number
  averageRating: number
}

export interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  duration: number
  isActive: boolean
  createdAt: string
  _count: {
    lessons: number
    progress: number
  }
}

export interface Student {
  id: string
  name: string
  email: string
  avatar?: string
  enrolledCourses: number
  lastActive: string
}

// Public Instructor interface for listing on /instructors page
export interface PublicInstructor {
  id: string
  name: string
  avatar?: string
  bio: string
  expertise: string
  experience?: string
  qualifications?: string
  rating: number
  totalStudents: number
  totalCourses: number
}

export interface Lesson {
  id: string
  title: string
  content: string
  videoUrl?: string
  audioUrl?: string
  pdfUrl?: string
  duration: number
  order: number
  isActive: boolean
  _count?: {
    progress: number
  }
}

// Get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken')
  }
  return null
}

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken()
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || error.message || 'API request failed')
  }

  return response.json()
}

// Instructor Stats API
export async function getInstructorStats(): Promise<{ success: boolean; stats: InstructorStats }> {
  return apiRequest<{ success: boolean; stats: InstructorStats }>('/stats')
}

// Instructor Courses API
export async function getInstructorCourses(): Promise<{ success: boolean; courses: Course[] }> {
  return apiRequest<{ success: boolean; courses: Course[] }>('/courses')
}

export async function createInstructorCourse(data: {
  title: string
  description: string
  thumbnail?: string
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  duration?: number
  categoryId?: string
  subCategoryId?: string
  learningPathId?: string
}): Promise<{ success: boolean; message: string; course: Course }> {
  return apiRequest<{ success: boolean; message: string; course: Course }>('/courses', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Instructor Students API
export async function getInstructorStudents(): Promise<{ success: boolean; students: Student[] }> {
  return apiRequest<{ success: boolean; students: Student[] }>('/students')
}

// Instructor Lessons API
export async function getInstructorLessons(courseId: string): Promise<{ success: boolean; lessons: Lesson[] }> {
  return apiRequest<{ success: boolean; lessons: Lesson[] }>(`/lessons?courseId=${courseId}`)
}

export async function createInstructorLesson(data: {
  courseId: string
  title: string
  content: string
  videoUrl?: string
  audioUrl?: string
  pdfUrl?: string
  duration?: number
  order?: number
}): Promise<{ success: boolean; message: string; lesson: Lesson }> {
  return apiRequest<{ success: boolean; message: string; lesson: Lesson }>('/lessons', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Instructor Profile API
export async function getInstructorProfile(): Promise<{ success: boolean; profile: any }> {
  return apiRequest<{ success: boolean; profile: any }>('/profile')
}

export async function updateInstructorProfile(data: {
  bio: string
  expertise: string[]
  experience?: string
  qualifications?: string
  achievements?: string[]
  socialLinks?: Record<string, string>
  teachingStyle?: string
}): Promise<{ success: boolean; message: string; profile: any }> {
  return apiRequest<{ success: boolean; message: string; profile: any }>('/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// Instructor Assessments API
export async function getInstructorAssessments(courseId: string, lessonId?: string): Promise<{ success: boolean; assessments: any[] }> {
  const params = new URLSearchParams({ courseId })
  if (lessonId) params.append('lessonId', lessonId)
  return apiRequest<{ success: boolean; assessments: any[] }>(`/assessments?${params.toString()}`)
}

export async function createInstructorAssessment(data: {
  courseId: string
  lessonId?: string
  title: string
  description?: string
  type: 'QUIZ' | 'PRACTICE' | 'SCENARIO'
  passingScore?: number
  timeLimit?: number
  questions?: any[]
}): Promise<{ success: boolean; message: string; assessment: any }> {
  return apiRequest<{ success: boolean; message: string; assessment: any }>('/assessments', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Get Public Instructors (for /instructors page)
export async function getPublicInstructors(): Promise<{ success: boolean; instructors: PublicInstructor[] }> {
  return apiRequest<{ success: boolean; instructors: PublicInstructor[] }>('/public')
}
