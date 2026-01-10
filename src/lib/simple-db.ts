import fs from 'fs'
import path from 'path'

// Simple JSON-based database access for fallback
// This reads the SQLite database file and extracts data without external dependencies

interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  difficulty: string
  duration: number
  isActive: boolean
  instructorId: string
  learningPathId?: string
  createdAt: string
}

interface Instructor {
  id: string
  name: string
  avatar?: string
  expertise?: string
}

interface LearningPath {
  id: string
  title: string
  description: string
  icon?: string
  color?: string
  categoryId?: string
  isActive: boolean
}

interface LearningPathCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  sortOrder: number
  isActive: boolean
  isFeatured: boolean
}

interface Lesson {
  id: string
  courseId: string
  title: string
  content: string
  videoUrl?: string
  audioUrl?: string
  pdfUrl?: string
  duration: number
  order: number
  isActive: boolean
  createdAt: string
}

// ========== PHASE 4: INSTRUCTOR SUBSCRIPTION INTERFACES ==========

// Instructor subscription plan types
export type InstructorPlanType = 'FREE' | 'BASIC' | 'PRO'

export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED'

// Instructor subscription plan configuration
interface InstructorPlan {
  id: InstructorPlanType
  name: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  limits: {
    maxCourses: number
    maxLiveSessions: number
    maxStorageGB: number
    hasAnalytics: boolean
    hasCustomBranding: boolean
    hasPrioritySupport: boolean
  }
}

// Instructor subscription record
interface InstructorSubscription {
  id: string
  userId: string
  planId: InstructorPlanType
  status: SubscriptionStatus
  currentPeriodStart: string
  currentPeriodEnd: string
  razorpaySubscriptionId?: string
  cancelAtPeriodEnd: boolean
  createdAt: string
  updatedAt: string
}

// Instructor usage tracking
interface InstructorUsage {
  userId: string
  courseCount: number
  liveSessionCount: number
  storageUsedGB: number
  totalStudents: number
  lastUpdated: string
}

// Plan configurations
export const INSTRUCTOR_PLANS: InstructorPlan[] = [
  {
    id: 'FREE',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Create up to 1 course',
      'No live sessions',
      'Basic analytics',
      'Standard support'
    ],
    limits: {
      maxCourses: 1,
      maxLiveSessions: 0,
      maxStorageGB: 1,
      hasAnalytics: true,
      hasCustomBranding: false,
      hasPrioritySupport: false
    }
  },
  {
    id: 'BASIC',
    name: 'Basic',
    monthlyPrice: 499,
    yearlyPrice: 4999,
    features: [
      'Create up to 5 courses',
      'Up to 5 live sessions/month',
      '10GB storage',
      'Advanced analytics',
      'Email support',
      'Student management'
    ],
    limits: {
      maxCourses: 5,
      maxLiveSessions: 5,
      maxStorageGB: 10,
      hasAnalytics: true,
      hasCustomBranding: false,
      hasPrioritySupport: false
    }
  },
  {
    id: 'PRO',
    name: 'Pro',
    monthlyPrice: 1499,
    yearlyPrice: 14999,
    features: [
      'Unlimited courses',
      'Unlimited live sessions',
      '100GB storage',
      'Advanced analytics',
      'Custom branding',
      'Priority support',
      'API access',
      'White-label options'
    ],
    limits: {
      maxCourses: -1,
      maxLiveSessions: -1,
      maxStorageGB: 100,
      hasAnalytics: true,
      hasCustomBranding: true,
      hasPrioritySupport: true
    }
  }
]

// ========== PHASE 3: COMMUNITY FEATURES INTERFACES ==========

// User confusion submissions
interface ConfusionSubmission {
  id: string
  userId: string
  userName: string
  topic: string
  description: string
  category: string
  status: 'pending' | 'approved' | 'in-progress' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  upvotes: number
  submittedAt: string
  updatedAt: string
}

// Success stories from users
interface SuccessStory {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  relatedConfusionId?: string
  relatedLessonId?: string
  story: string
  storyHindi?: string
  storyTamil?: string
  storyTelugu?: string
  storyBengali?: string
  storyMarathi?: string
  language: string
  isAnonymous: boolean
  isFeatured: boolean
  isApproved: boolean
  createdAt: string
}

// Expert Q&A integration with community discussions
interface ExpertQnA {
  id: string
  lessonId: string
  courseId: string
  discussionThreadId: string
  expertId: string
  expertName: string
  isActive: boolean
  createdAt: string
  lastActivityAt: string
}

// Regional language translations for confusion lessons
interface LessonTranslation {
  lessonId: string
  language: string
  title: string
  content: string
  contentHtml: string
  isVerified: boolean
  translatedAt: string
}

// Supported languages configuration
interface SupportedLanguage {
  code: string
  name: string
  nativeName: string
  flag: string
  isDefault: boolean
  direction: 'ltr' | 'rtl'
}

// Language configuration
const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', isDefault: true, direction: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', isDefault: false, direction: 'ltr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', isDefault: false, direction: 'ltr' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', isDefault: false, direction: 'ltr' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', isDefault: false, direction: 'ltr' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', isDefault: false, direction: 'ltr' }
]

// Comprehensive Four Main Learning Paths with 42 courses
const MOCK_COURSES: Course[] = [
  // School Education - Class 1-5 (Primary School)
  {
    id: 'school1',
    title: 'Mathematics Grade 1',
    description: 'Basic arithmetic, numbers, and counting for Class 1 students',
    difficulty: 'BEGINNER',
    duration: 120,
    isActive: true,
    instructorId: 'inst1',
    learningPathId: 'primary-school',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'school2',
    title: 'English Grammar Grade 1',
    description: 'Basic English grammar, vocabulary, and reading for Class 1',
    difficulty: 'BEGINNER',
    duration: 100,
    isActive: true,
    instructorId: 'inst2',
    learningPathId: 'primary-school',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'school3',
    title: 'Mathematics Grade 2',
    description: 'Addition, subtraction, and basic geometry for Class 2',
    difficulty: 'BEGINNER',
    duration: 140,
    isActive: true,
    instructorId: 'inst1',
    learningPathId: 'primary-school',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'school4',
    title: 'Science Fundamentals Grade 3',
    description: 'Introduction to basic science concepts for Class 3',
    difficulty: 'BEGINNER',
    duration: 150,
    isActive: true,
    instructorId: 'inst3',
    learningPathId: 'primary-school',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'school5',
    title: 'Mathematics Grade 3',
    description: 'Multiplication, division, and fractions for Class 3',
    difficulty: 'BEGINNER',
    duration: 160,
    isActive: true,
    instructorId: 'inst1',
    learningPathId: 'primary-school',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'school6',
    title: 'English Literature Grade 4',
    description: 'Reading comprehension and basic literature for Class 4',
    difficulty: 'BEGINNER',
    duration: 180,
    isActive: true,
    instructorId: 'inst2',
    learningPathId: 'primary-school',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'school7',
    title: 'Mathematics Grade 4',
    description: 'Advanced arithmetic and introduction to algebra for Class 4',
    difficulty: 'INTERMEDIATE',
    duration: 170,
    isActive: true,
    instructorId: 'inst1',
    learningPathId: 'primary-school',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'school8',
    title: 'Science Grade 5',
    description: 'Biology, chemistry, and physics basics for Class 5',
    difficulty: 'INTERMEDIATE',
    duration: 190,
    isActive: true,
    instructorId: 'inst3',
    learningPathId: 'primary-school',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // School Education - Class 6-8 (Middle School)
  {
    id: 'school9',
    title: 'Mathematics Grade 6',
    description: 'Algebra basics, geometry, and advanced arithmetic for Class 6',
    difficulty: 'INTERMEDIATE',
    duration: 200,
    isActive: true,
    instructorId: 'inst1',
    learningPathId: 'middle-school',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'school10',
    title: 'Science Grade 6',
    description: 'Physics, chemistry, and biology fundamentals for Class 6',
    difficulty: 'INTERMEDIATE',
    duration: 210,
    isActive: true,
    instructorId: 'inst3',
    learningPathId: 'middle-school',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'school11',
    title: 'English Literature Grade 7',
    description: 'Advanced reading comprehension and writing skills for Class 7',
    difficulty: 'INTERMEDIATE',
    duration: 220,
    isActive: true,
    instructorId: 'inst2',
    learningPathId: 'middle-school',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'school12',
    title: 'Mathematics Grade 7',
    description: 'Pre-algebra, geometry, and statistical analysis for Class 7',
    difficulty: 'INTERMEDIATE',
    duration: 230,
    isActive: true,
    instructorId: 'inst1',
    learningPathId: 'middle-school',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'school13',
    title: 'Science Grade 8',
    description: 'Advanced science concepts and laboratory skills for Class 8',
    difficulty: 'ADVANCED',
    duration: 240,
    isActive: true,
    instructorId: 'inst3',
    learningPathId: 'middle-school',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // School Education - Class 9-10 (High School)
  {
    id: 'school14',
    title: 'Mathematics Grade 9',
    description: 'Algebra, trigonometry, and coordinate geometry for Class 9',
    difficulty: 'ADVANCED',
    duration: 250,
    isActive: true,
    instructorId: 'inst1',
    learningPathId: 'high-school',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'school15',
    title: 'Physics Grade 9',
    description: 'Mechanics, thermodynamics, and wave physics for Class 9',
    difficulty: 'ADVANCED',
    duration: 260,
    isActive: true,
    instructorId: 'inst3',
    learningPathId: 'high-school',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'school16',
    title: 'Chemistry Grade 10',
    description: 'Organic and inorganic chemistry fundamentals for Class 10',
    difficulty: 'ADVANCED',
    duration: 270,
    isActive: true,
    instructorId: 'inst3',
    learningPathId: 'high-school',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'school17',
    title: 'Biology Grade 10',
    description: 'Cell biology, genetics, and human physiology for Class 10',
    difficulty: 'ADVANCED',
    duration: 280,
    isActive: true,
    instructorId: 'inst3',
    learningPathId: 'high-school',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'school18',
    title: 'Mathematics Grade 10',
    description: 'Calculus introduction, statistics, and probability for Class 10',
    difficulty: 'ADVANCED',
    duration: 290,
    isActive: true,
    instructorId: 'inst1',
    learningPathId: 'high-school',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // School Education - Class 11-12 (Senior Secondary)
  {
    id: 'school19',
    title: 'Advanced Mathematics Class 11',
    description: 'Calculus, matrices, and three-dimensional geometry',
    difficulty: 'ADVANCED',
    duration: 300,
    isActive: true,
    instructorId: 'inst1',
    learningPathId: 'senior-secondary',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'school20',
    title: 'Physics Class 11',
    description: 'Electromagnetism, modern physics, and quantum mechanics',
    difficulty: 'ADVANCED',
    duration: 310,
    isActive: true,
    instructorId: 'inst3',
    learningPathId: 'senior-secondary',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'school21',
    title: 'Chemistry Class 11',
    description: 'Physical chemistry, organic reactions, and spectroscopy',
    difficulty: 'ADVANCED',
    duration: 320,
    isActive: true,
    instructorId: 'inst3',
    learningPathId: 'senior-secondary',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'school22',
    title: 'Biology Class 12',
    description: 'Molecular biology, evolution, and biotechnology',
    difficulty: 'ADVANCED',
    duration: 330,
    isActive: true,
    instructorId: 'inst3',
    learningPathId: 'senior-secondary',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // College & University - Engineering Foundation
  {
    id: 'college1',
    title: 'Engineering Mathematics',
    description: 'Advanced calculus, differential equations, and linear algebra',
    difficulty: 'ADVANCED',
    duration: 340,
    isActive: true,
    instructorId: 'inst1',
    learningPathId: 'engineering-foundation',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'college2',
    title: 'Programming Fundamentals',
    description: 'Introduction to programming with C++ and Python',
    difficulty: 'INTERMEDIATE',
    duration: 350,
    isActive: true,
    instructorId: 'inst4',
    learningPathId: 'engineering-foundation',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'college3',
    title: 'Engineering Physics',
    description: 'Applied physics for engineering applications',
    difficulty: 'ADVANCED',
    duration: 360,
    isActive: true,
    instructorId: 'inst3',
    learningPathId: 'engineering-foundation',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'college4',
    title: 'Digital Electronics',
    description: 'Logic gates, circuits, and digital system design',
    difficulty: 'ADVANCED',
    duration: 370,
    isActive: true,
    instructorId: 'inst4',
    learningPathId: 'engineering-foundation',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // College & University - Medical Sciences Foundation
  {
    id: 'college5',
    title: 'Human Anatomy',
    description: 'Detailed study of human body structure and systems',
    difficulty: 'ADVANCED',
    duration: 380,
    isActive: true,
    instructorId: 'inst5',
    learningPathId: 'medical-foundation',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'college6',
    title: 'Biochemistry',
    description: 'Chemical processes in living organisms',
    difficulty: 'ADVANCED',
    duration: 390,
    isActive: true,
    instructorId: 'inst5',
    learningPathId: 'medical-foundation',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'college7',
    title: 'Physiology',
    description: 'Functions of human body systems',
    difficulty: 'ADVANCED',
    duration: 400,
    isActive: true,
    instructorId: 'inst5',
    learningPathId: 'medical-foundation',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'college8',
    title: 'Medical Research Methods',
    description: 'Research design and statistical analysis in medicine',
    difficulty: 'ADVANCED',
    duration: 410,
    isActive: true,
    instructorId: 'inst5',
    learningPathId: 'medical-foundation',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // College & University - Business & Commerce Foundation
  {
    id: 'college9',
    title: 'Business Economics',
    description: 'Micro and macroeconomics for business applications',
    difficulty: 'INTERMEDIATE',
    duration: 420,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'business-foundation',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'college10',
    title: 'Accounting Principles',
    description: 'Financial and managerial accounting fundamentals',
    difficulty: 'INTERMEDIATE',
    duration: 430,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'business-foundation',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'college11',
    title: 'Business Statistics',
    description: 'Statistical methods for business decision making',
    difficulty: 'INTERMEDIATE',
    duration: 440,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'business-foundation',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'college12',
    title: 'Marketing Fundamentals',
    description: 'Basic principles of marketing and consumer behavior',
    difficulty: 'INTERMEDIATE',
    duration: 450,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'business-foundation',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // College & University - Arts & Humanities Foundation
  {
    id: 'college13',
    title: 'World Literature',
    description: 'Study of classic and contemporary world literature',
    difficulty: 'INTERMEDIATE',
    duration: 460,
    isActive: true,
    instructorId: 'inst2',
    learningPathId: 'arts-foundation',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'college14',
    title: 'Philosophy Basics',
    description: 'Introduction to philosophical thinking and ethics',
    difficulty: 'INTERMEDIATE',
    duration: 470,
    isActive: true,
    instructorId: 'inst2',
    learningPathId: 'arts-foundation',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'college15',
    title: 'History of Art',
    description: 'Survey of art history from ancient to modern times',
    difficulty: 'INTERMEDIATE',
    duration: 480,
    isActive: true,
    instructorId: 'inst2',
    learningPathId: 'arts-foundation',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'college16',
    title: 'Communication Skills',
    description: 'Effective written and verbal communication techniques',
    difficulty: 'INTERMEDIATE',
    duration: 490,
    isActive: true,
    instructorId: 'inst2',
    learningPathId: 'arts-foundation',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Career & Professional Skills - Technology & Programming
  {
    id: 'career1',
    title: 'Web Development Bootcamp',
    description: 'Complete web development course with HTML, CSS, JavaScript',
    difficulty: 'INTERMEDIATE',
    duration: 500,
    isActive: true,
    instructorId: 'instructor1',
    learningPathId: 'technology-programming',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'career2',
    title: 'Python Programming Mastery',
    description: 'Advanced Python programming for data science and automation',
    difficulty: 'INTERMEDIATE',
    duration: 520,
    isActive: true,
    instructorId: 'inst4',
    learningPathId: 'technology-programming',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'career3',
    title: 'Data Science Fundamentals',
    description: 'Introduction to data science, statistics, and machine learning',
    difficulty: 'ADVANCED',
    duration: 540,
    isActive: true,
    instructorId: 'inst4',
    learningPathId: 'technology-programming',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'career4',
    title: 'Mobile App Development',
    description: 'Build mobile apps using React Native and Flutter',
    difficulty: 'ADVANCED',
    duration: 560,
    isActive: true,
    instructorId: 'inst4',
    learningPathId: 'technology-programming',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Career & Professional Skills - Business & Entrepreneurship
  {
    id: 'career5',
    title: 'Business Strategy Mastery',
    description: 'Strategic planning and competitive analysis',
    difficulty: 'INTERMEDIATE',
    duration: 580,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'business-entrepreneurship',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'career6',
    title: 'Entrepreneurship Essentials',
    description: 'Start and grow your own business from scratch',
    difficulty: 'INTERMEDIATE',
    duration: 600,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'business-entrepreneurship',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'career7',
    title: 'Financial Management',
    description: 'Corporate finance and investment strategies',
    difficulty: 'ADVANCED',
    duration: 620,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'business-entrepreneurship',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'career8',
    title: 'Project Management',
    description: 'Agile and traditional project management methodologies',
    difficulty: 'INTERMEDIATE',
    duration: 640,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'business-entrepreneurship',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Career & Professional Skills - Creative & Design
  {
    id: 'career9',
    title: 'UI/UX Design Mastery',
    description: 'Complete UI/UX design course with Figma and Adobe XD',
    difficulty: 'INTERMEDIATE',
    duration: 660,
    isActive: true,
    instructorId: 'inst7',
    learningPathId: 'creative-design',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'career10',
    title: 'Graphic Design Fundamentals',
    description: 'Adobe Creative Suite and design principles',
    difficulty: 'INTERMEDIATE',
    duration: 680,
    isActive: true,
    instructorId: 'inst7',
    learningPathId: 'creative-design',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'career11',
    title: 'Content Creation & Video Editing',
    description: 'Create engaging content and edit videos professionally',
    difficulty: 'INTERMEDIATE',
    duration: 700,
    isActive: true,
    instructorId: 'inst7',
    learningPathId: 'creative-design',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'career12',
    title: 'Photography & Digital Art',
    description: 'Professional photography and digital art creation',
    difficulty: 'INTERMEDIATE',
    duration: 720,
    isActive: true,
    instructorId: 'inst7',
    learningPathId: 'creative-design',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Career & Professional Skills - Communication & Marketing
  {
    id: 'career13',
    title: 'Digital Marketing Mastery',
    description: 'SEO, social media marketing, and online advertising',
    difficulty: 'INTERMEDIATE',
    duration: 740,
    isActive: true,
    instructorId: 'inst8',
    learningPathId: 'communication-marketing',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'career14',
    title: 'Public Speaking & Presentation',
    description: 'Master public speaking and professional presentations',
    difficulty: 'INTERMEDIATE',
    duration: 760,
    isActive: true,
    instructorId: 'inst8',
    learningPathId: 'communication-marketing',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'career15',
    title: 'Social Media Management',
    description: 'Build and manage social media presence effectively',
    difficulty: 'INTERMEDIATE',
    duration: 780,
    isActive: true,
    instructorId: 'inst8',
    learningPathId: 'communication-marketing',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'career16',
    title: 'Brand Strategy & Management',
    description: 'Develop and manage strong brand identity',
    difficulty: 'ADVANCED',
    duration: 800,
    isActive: true,
    instructorId: 'inst8',
    learningPathId: 'communication-marketing',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Life Skills - Personal Finance & Investment
  {
    id: 'life1',
    title: 'Personal Finance Management',
    description: 'Budgeting, saving, and financial planning basics',
    difficulty: 'BEGINNER',
    duration: 150,
    isActive: true,
    instructorId: 'inst9',
    learningPathId: 'personal-finance',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'life2',
    title: 'Investment & Wealth Building',
    description: 'Stock market, mutual funds, and long-term investing',
    difficulty: 'INTERMEDIATE',
    duration: 200,
    isActive: true,
    instructorId: 'inst9',
    learningPathId: 'personal-finance',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'life3',
    title: 'Tax Planning & Insurance',
    description: 'Tax optimization and insurance planning strategies',
    difficulty: 'INTERMEDIATE',
    duration: 180,
    isActive: true,
    instructorId: 'inst9',
    learningPathId: 'personal-finance',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Life Skills - Health & Wellness
  {
    id: 'life4',
    title: 'Nutrition & Healthy Living',
    description: 'Healthy eating habits and lifestyle optimization',
    difficulty: 'BEGINNER',
    duration: 120,
    isActive: true,
    instructorId: 'inst10',
    learningPathId: 'health-wellness',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'life5',
    title: 'Fitness & Exercise',
    description: 'Home workouts and physical fitness fundamentals',
    difficulty: 'BEGINNER',
    duration: 140,
    isActive: true,
    instructorId: 'inst10',
    learningPathId: 'health-wellness',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'life6',
    title: 'Mental Health & Mindfulness',
    description: 'Stress management, meditation, and mental wellness',
    difficulty: 'BEGINNER',
    duration: 100,
    isActive: true,
    instructorId: 'inst10',
    learningPathId: 'health-wellness',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // ========== CONFUSION REMOVER COURSES ==========
  // Life Essentials - Digital Basics
  {
    id: 'cr_digital',
    title: 'Digital & Smartphone Basics',
    description: 'Understand smartphones, apps, internet, and everyday digital tools without confusion',
    difficulty: 'BEGINNER',
    duration: 60,
    isActive: true,
    instructorId: 'inst4',
    learningPathId: 'digital-basics',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Life Essentials - Digital Money
  {
    id: 'cr_upi',
    title: 'UPI, Banking & Digital Money',
    description: 'Stop fearing failed transactions. Understand how digital payments actually work',
    difficulty: 'BEGINNER',
    duration: 75,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'digital-money',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Life Essentials - Government Docs
  {
    id: 'cr_gov',
    title: 'Government Portals & Certificates',
    description: 'Aadhaar, PAN, DigiLocker - why they exist and how to use them correctly',
    difficulty: 'BEGINNER',
    duration: 60,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'gov-docs',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Life Essentials - Online Safety
  {
    id: 'cr_fraud',
    title: 'Online Safety & Fraud Awareness',
    description: 'How fraud happens, common scams, and how to protect yourself and your money',
    difficulty: 'BEGINNER',
    duration: 90,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'online-safety',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Life Essentials - Personal Money
  {
    id: 'cr_money',
    title: 'Personal Money Basics',
    description: 'Income, savings, EMI, loans - the simple system of personal money explained',
    difficulty: 'BEGINNER',
    duration: 60,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'personal-money',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Life Essentials - English Communication
  {
    id: 'cr_english',
    title: 'English & Communication',
    description: 'Remove the fear from English. Practical communication for daily life and work',
    difficulty: 'BEGINNER',
    duration: 60,
    isActive: true,
    instructorId: 'inst2',
    learningPathId: 'english-comm',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Community Understanding - Bulk Buying
  {
    id: 'cr_bulk',
    title: 'Community Bulk Buying Model',
    description: 'Understanding how pooling and community purchasing actually works',
    difficulty: 'BEGINNER',
    duration: 45,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'bulk-buying',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Community Understanding - Food for Work
  {
    id: 'cr_foodwork',
    title: 'Food-for-Work Model',
    description: 'Dignity-based community support systems and how they function',
    difficulty: 'BEGINNER',
    duration: 45,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'food-work',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Community Understanding - How Communities Work
  {
    id: 'cr_community',
    title: 'How Community Systems Work',
    description: 'NGOs, Panchayats, CSR - understanding how communities organize and function',
    difficulty: 'BEGINNER',
    duration: 45,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'community-systems',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Government Exams - UPSC Civil Services
  {
    id: 'upsc_prelims',
    title: 'UPSC Civil Services Prelims Complete Preparation',
    description: 'Comprehensive preparation for UPSC Civil Services Preliminary Examination covering GS Paper I and CSAT',
    difficulty: 'ADVANCED',
    duration: 600,
    isActive: true,
    instructorId: 'inst3',
    learningPathId: 'gov-exams',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'upsc_mains',
    title: 'UPSC Civil Services Mains Complete Preparation',
    description: 'Detailed preparation for UPSC Civil Services Mains Examination including all GS papers and Optional subject',
    difficulty: 'ADVANCED',
    duration: 800,
    isActive: true,
    instructorId: 'inst3',
    learningPathId: 'gov-exams',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'upsc_interview',
    title: 'UPSC Interview & Personality Test Preparation',
    description: 'Preparation for the final stage of UPSC Civil Services - Interview and Personality Test',
    difficulty: 'ADVANCED',
    duration: 200,
    isActive: true,
    instructorId: 'inst3',
    learningPathId: 'gov-exams',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Government Exams - SSC
  {
    id: 'ssc_chsl',
    title: 'SSC CHSL (10+2) Complete Preparation',
    description: 'Complete preparation for SSC Combined Higher Secondary Level Examination',
    difficulty: 'INTERMEDIATE',
    duration: 400,
    isActive: true,
    instructorId: 'inst1',
    learningPathId: 'gov-exams',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ssc_cgl',
    title: 'SSC CGL Complete Preparation',
    description: 'Comprehensive preparation for SSC Combined Graduate Level Examination',
    difficulty: 'ADVANCED',
    duration: 500,
    isActive: true,
    instructorId: 'inst1',
    learningPathId: 'gov-exams',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ssc_mts',
    title: 'SSC MTS (Multi-Tasking Staff) Preparation',
    description: 'Preparation for SSC Multi-Tasking Staff Examination',
    difficulty: 'BEGINNER',
    duration: 300,
    isActive: true,
    instructorId: 'inst1',
    learningPathId: 'gov-exams',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Government Exams - State Police
  {
    id: 'state_police',
    title: 'State Police Constable & SI Complete Preparation',
    description: 'Complete preparation for State Police Constable and Sub-Inspector examinations',
    difficulty: 'INTERMEDIATE',
    duration: 450,
    isActive: true,
    instructorId: 'inst3',
    learningPathId: 'gov-exams',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Government Exams - TET
  {
    id: 'state_tet',
    title: 'TET (Teacher Eligibility Test) Complete Preparation',
    description: 'Complete preparation for TET examinations for teaching positions',
    difficulty: 'INTERMEDIATE',
    duration: 400,
    isActive: true,
    instructorId: 'inst2',
    learningPathId: 'gov-exams',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Stock Market & Trading Courses
  {
    id: 'stock-market-basics',
    title: 'Stock Market Basics for Beginners',
    description: 'Introduction to stock markets, trading basics, and investment fundamentals',
    difficulty: 'BEGINNER',
    duration: 300,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'stock-trading',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'options-trading-mastery',
    title: 'Options Trading Mastery',
    description: 'Advanced options trading strategies, pricing models, and risk management',
    difficulty: 'ADVANCED',
    duration: 500,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'stock-trading',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'technical-analysis-master',
    title: 'Technical Analysis Master Course',
    description: 'Master technical analysis, chart patterns, indicators, and trading strategies',
    difficulty: 'ADVANCED',
    duration: 450,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'stock-trading',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'mutual-funds-sip-mastery',
    title: 'Mutual Funds & SIP Mastery',
    description: 'Complete guide to mutual funds, SIP investments, and wealth creation',
    difficulty: 'INTERMEDIATE',
    duration: 350,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'stock-trading',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Professional Certification - CA
  {
    id: 'course-ca-foundation',
    title: 'CA Foundation Complete Course',
    description: 'Complete preparation for CA Foundation examination',
    difficulty: 'INTERMEDIATE',
    duration: 500,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'professional',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'course-ca-intermediate',
    title: 'CA Intermediate Complete Course',
    description: 'Complete preparation for CA Intermediate examination',
    difficulty: 'ADVANCED',
    duration: 600,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'professional',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'course-ca-final',
    title: 'CA Final Complete Course',
    description: 'Complete preparation for CA Final examination',
    difficulty: 'ADVANCED',
    duration: 800,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'professional',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Professional Certification - CS
  {
    id: 'cs_foundation',
    title: 'CS Foundation Complete Course',
    description: 'Complete preparation for Company Secretary Foundation examination',
    difficulty: 'INTERMEDIATE',
    duration: 400,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'professional',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cs_executive',
    title: 'CS Executive Complete Course',
    description: 'Complete preparation for Company Secretary Executive examination',
    difficulty: 'ADVANCED',
    duration: 500,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'professional',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cs_professional',
    title: 'CS Professional Complete Course',
    description: 'Complete preparation for Company Secretary Professional examination',
    difficulty: 'ADVANCED',
    duration: 600,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'professional',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Professional Certification - CMA
  {
    id: 'cma_foundation',
    title: 'CMA Foundation Complete Course',
    description: 'Complete preparation for CMA Foundation examination',
    difficulty: 'INTERMEDIATE',
    duration: 400,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'professional',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cma_intermediate',
    title: 'CMA Intermediate Complete Course',
    description: 'Complete preparation for CMA Intermediate examination',
    difficulty: 'ADVANCED',
    duration: 500,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'professional',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cma_final',
    title: 'CMA Final Complete Course',
    description: 'Complete preparation for CMA Final examination',
    difficulty: 'ADVANCED',
    duration: 700,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'professional',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Professional Certification - CFA
  {
    id: 'cfa_level1',
    title: 'CFA Level 1 Complete Course',
    description: 'Complete preparation for CFA Level I examination',
    difficulty: 'ADVANCED',
    duration: 600,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'professional',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cfa_level2',
    title: 'CFA Level 2 Complete Course',
    description: 'Complete preparation for CFA Level II examination',
    difficulty: 'ADVANCED',
    duration: 700,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'professional',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cfa_level3',
    title: 'CFA Level 3 Complete Course',
    description: 'Complete preparation for CFA Level III examination',
    difficulty: 'ADVANCED',
    duration: 800,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'professional',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Professional Certification - FRM
  {
    id: 'frm_part1',
    title: 'FRM Part 1 Complete Course',
    description: 'Complete preparation for FRM Part I examination',
    difficulty: 'ADVANCED',
    duration: 500,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'professional',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'frm_part2',
    title: 'FRM Part 2 Complete Course',
    description: 'Complete preparation for FRM Part II examination',
    difficulty: 'ADVANCED',
    duration: 600,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'professional',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Professional Certification - ACCA
  {
    id: 'acca_level1',
    title: 'ACCA (Papers AB, MA, FA)',
    description: 'Complete preparation for ACCA Applied Knowledge level papers',
    difficulty: 'INTERMEDIATE',
    duration: 400,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'professional',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'acca_level2',
    title: 'ACCA (Papers LW, PM, TX, FR, AA, FM)',
    description: 'Complete preparation for ACCA Applied Skills level papers',
    difficulty: 'ADVANCED',
    duration: 600,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'professional',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'acca_level3',
    title: 'ACCA (Strategic Professional Level)',
    description: 'Complete preparation for ACCA Strategic Professional level',
    difficulty: 'ADVANCED',
    duration: 700,
    isActive: true,
    instructorId: 'inst6',
    learningPathId: 'professional',
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Additional Courses
  {
    id: 'course-actuarial-science',
    title: 'Actuarial Science Complete Course',
    description: 'Complete preparation for Actuarial Science examinations',
    difficulty: 'ADVANCED',
    duration: 600,
    isActive: true,
    instructorId: 'inst1',
    learningPathId: 'professional',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'advanced-excel-pro',
    title: 'Advanced Excel for Professionals',
    description: 'Master advanced Excel features, formulas, VBA, and data analysis',
    difficulty: 'INTERMEDIATE',
    duration: 300,
    isActive: true,
    instructorId: 'inst4',
    learningPathId: 'technology-programming',
    createdAt: '2025-01-01T00:00:00Z'
  }
]

// Sample users for demonstration
interface SampleUser {
  id: string
  mobileNumber: string
  email?: string
  name?: string
  role?: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | 'SUPER_ADMIN'
}

interface Discussion {
  id: string
  title: string
  content: string
  isPinned: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  userId: string
  courseId: string
  tags?: string[]
  difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced'
  subjectCategory?: string
  viewCount: number
  likeCount: number
}

interface DiscussionReply {
  id: string
  content: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  userId: string
  discussionId: string
  parentReplyId?: string // For threaded replies
  likeCount: number
  isEdited: boolean
  editHistory?: Array<{
    content: string
    editedAt: string
  }>
}

const SAMPLE_USERS: SampleUser[] = [
  {
    id: 'admin1',
    mobileNumber: '9999999999',
    email: 'admin@inr99.academy',
    name: 'Platform Administrator',
    role: 'ADMIN'
  },
  {
    id: 'instructor1',
    mobileNumber: '8888888888',
    email: 'instructor@inr99.academy',
    name: 'Dr. Priya Sharma',
    role: 'INSTRUCTOR'
  },
  {
    id: 'student1',
    mobileNumber: '7777777777',
    email: 'student@inr99.academy',
    name: 'Demo Student',
    role: 'STUDENT'
  },
  {
    id: 'superadmin1',
    mobileNumber: '6666666666',
    email: 'superadmin@inr99.academy',
    name: 'Super Administrator',
    role: 'SUPER_ADMIN'
  }
]

const MOCK_INSTRUCTORS: Instructor[] = [
  {
    id: 'instructor1',
    name: 'Dr. Priya Sharma',
    expertise: '["Mathematics", "Statistics", "Algebra", "Calculus", "Web Development", "Programming"]'
  },
  {
    id: 'inst1',
    name: 'Dr. Priya Sharma (Math)',
    expertise: '["Mathematics", "Statistics", "Algebra", "Calculus", "Class 1-12 Mathematics"]'
  },
  {
    id: 'inst2',
    name: 'Prof. Rajesh Kumar',
    expertise: '["English Literature", "Communication", "Arts", "Humanities", "Creative Writing"]'
  },
  {
    id: 'inst3',
    name: 'Dr. Sunita Menon',
    expertise: '["Physics", "Chemistry", "Biology", "Science", "Class 6-12 Sciences"]'
  },
  {
    id: 'inst4',
    name: 'Vikram Singh',
    expertise: '["Programming", "Web Development", "Data Science", "Mobile Development", "Python"]'
  },
  {
    id: 'inst5',
    name: 'Dr. Anjali Gupta',
    expertise: '["Medicine", "Anatomy", "Physiology", "Biochemistry", "Medical Research"]'
  },
  {
    id: 'inst6',
    name: 'Arun Patel',
    expertise: '["Business", "Finance", "Accounting", "Marketing", "Entrepreneurship"]'
  },
  {
    id: 'inst7',
    name: 'Kavya Reddy',
    expertise: '["UI/UX Design", "Graphic Design", "Photography", "Video Editing", "Creative Arts"]'
  },
  {
    id: 'inst8',
    name: 'Rohit Joshi',
    expertise: '["Digital Marketing", "Brand Strategy", "Social Media", "Public Speaking", "Communication"]'
  },
  {
    id: 'inst9',
    name: 'Meera Iyer',
    expertise: '["Personal Finance", "Investment", "Tax Planning", "Wealth Management", "Financial Planning"]'
  },
  {
    id: 'inst10',
    name: 'Dr. Kiran Mehta',
    expertise: '["Nutrition", "Fitness", "Mental Health", "Wellness", "Mindfulness"]'
  }
]

const MOCK_LEARNING_PATHS: LearningPath[] = [
  // School Education Paths
  {
    id: 'primary-school',
    title: 'Primary School (Class 1-5)',
    description: 'Foundation education for primary school students',
    icon: 'BookOpen',
    color: 'bg-blue-100',
    categoryId: 'school-education',
    isActive: true
  },
  {
    id: 'middle-school',
    title: 'Middle School (Class 6-8)',
    description: 'Intermediate education for middle school students',
    icon: 'GraduationCap',
    color: 'bg-green-100',
    categoryId: 'school-education',
    isActive: true
  },
  {
    id: 'high-school',
    title: 'High School (Class 9-10)',
    description: 'Secondary education for high school students',
    icon: 'Award',
    color: 'bg-purple-100',
    categoryId: 'school-education',
    isActive: true
  },
  {
    id: 'senior-secondary',
    title: 'Senior Secondary (Class 11-12)',
    description: 'Advanced secondary education for senior students',
    icon: 'Star',
    color: 'bg-yellow-100',
    categoryId: 'school-education',
    isActive: true
  },

  // College & University Paths
  {
    id: 'engineering-foundation',
    title: 'Engineering Foundation',
    description: 'Core engineering subjects and fundamentals',
    icon: 'Settings',
    color: 'bg-orange-100',
    categoryId: 'college-university',
    isActive: true
  },
  {
    id: 'medical-foundation',
    title: 'Medical Sciences Foundation',
    description: 'Pre-medical education and health sciences',
    icon: 'Heart',
    color: 'bg-red-100',
    categoryId: 'college-university',
    isActive: true
  },
  {
    id: 'business-foundation',
    title: 'Business & Commerce Foundation',
    description: 'Business fundamentals and commerce education',
    icon: 'Briefcase',
    color: 'bg-indigo-100',
    categoryId: 'college-university',
    isActive: true
  },
  {
    id: 'arts-foundation',
    title: 'Arts & Humanities Foundation',
    description: 'Liberal arts and humanities education',
    icon: 'Palette',
    color: 'bg-pink-100',
    categoryId: 'college-university',
    isActive: true
  },

  // Career & Professional Skills Paths
  {
    id: 'technology-programming',
    title: 'Technology & Programming',
    description: 'Software development and technology skills',
    icon: 'Code',
    color: 'bg-gray-100',
    categoryId: 'career-skills',
    isActive: true
  },
  {
    id: 'business-entrepreneurship',
    title: 'Business & Entrepreneurship',
    description: 'Business strategy and entrepreneurial skills',
    icon: 'TrendingUp',
    color: 'bg-emerald-100',
    categoryId: 'career-skills',
    isActive: true
  },
  {
    id: 'creative-design',
    title: 'Creative & Design',
    description: 'Design skills and creative professions',
    icon: 'Brush',
    color: 'bg-violet-100',
    categoryId: 'career-skills',
    isActive: true
  },
  {
    id: 'communication-marketing',
    title: 'Communication & Marketing',
    description: 'Marketing, communication, and public relations',
    icon: 'Megaphone',
    color: 'bg-cyan-100',
    categoryId: 'career-skills',
    isActive: true
  },

  // Life Skills Paths
  {
    id: 'personal-finance',
    title: 'Personal Finance & Investment',
    description: 'Financial literacy and investment strategies',
    icon: 'DollarSign',
    color: 'bg-teal-100',
    categoryId: 'life-skills',
    isActive: true
  },
  {
    id: 'health-wellness',
    title: 'Health & Wellness',
    description: 'Health, fitness, and wellness practices',
    icon: 'Activity',
    color: 'bg-lime-100',
    categoryId: 'life-skills',
    isActive: true
  },

  // Confusion Remover - Life Essentials Paths
  {
    id: 'digital-basics',
    title: 'Digital Life Basics',
    description: 'Understanding smartphones, internet, and everyday digital tools',
    icon: 'Smartphone',
    color: 'bg-blue-100',
    categoryId: 'life-essentials',
    isActive: true
  },
  {
    id: 'digital-money',
    title: 'Digital Money & Banking',
    description: 'UPI, online payments, and banking basics',
    icon: 'CreditCard',
    color: 'bg-green-100',
    categoryId: 'life-essentials',
    isActive: true
  },
  {
    id: 'gov-docs',
    title: 'Government Documents',
    description: 'Aadhaar, PAN, passports, and official documents',
    icon: 'FileText',
    color: 'bg-yellow-100',
    categoryId: 'life-essentials',
    isActive: true
  },
  {
    id: 'online-safety',
    title: 'Online Safety & Fraud',
    description: 'Protecting yourself from online fraud and scams',
    icon: 'Shield',
    color: 'bg-red-100',
    categoryId: 'life-essentials',
    isActive: true
  },
  {
    id: 'personal-money',
    title: 'Personal Money Basics',
    description: 'Income, savings, budgeting, and financial foundations',
    icon: 'DollarSign',
    color: 'bg-emerald-100',
    categoryId: 'life-essentials',
    isActive: true
  },
  {
    id: 'english-comm',
    title: 'English Communication',
    description: 'Practical English for daily life and work',
    icon: 'MessageSquare',
    color: 'bg-indigo-100',
    categoryId: 'life-essentials',
    isActive: true
  },

  // Confusion Remover - Community Understanding Paths
  {
    id: 'bulk-buying',
    title: 'Community Bulk Buying',
    description: 'Understanding pooling and community purchasing models',
    icon: 'ShoppingCart',
    color: 'bg-amber-100',
    categoryId: 'community-understanding',
    isActive: true
  },
  {
    id: 'food-work',
    title: 'Food-for-Work Models',
    description: 'Dignity-based community support systems',
    icon: 'Utensils',
    color: 'bg-rose-100',
    categoryId: 'community-understanding',
    isActive: true
  },
  {
    id: 'community-systems',
    title: 'How Communities Work',
    description: 'NGOs, Panchayats, CSR, and community systems',
    icon: 'Users',
    color: 'bg-violet-100',
    categoryId: 'community-understanding',
    isActive: true
  },

  // Government Exam Preparation Paths
  {
    id: 'gov-exams',
    title: 'Government Exam Preparation',
    description: 'UPSC, SSC, State Police, TET and other government exam preparation',
    icon: 'Flag',
    color: 'bg-orange-100',
    categoryId: 'gov-exams',
    isActive: true
  },

  // Stock Market & Trading Paths
  {
    id: 'stock-trading',
    title: 'Stock Market & Trading',
    description: 'Stock market basics, technical analysis, and trading strategies',
    icon: 'TrendingUp',
    color: 'bg-green-100',
    categoryId: 'stock-trading',
    isActive: true
  },

  // Professional Certification Paths
  {
    id: 'professional',
    title: 'Professional Certifications',
    description: 'CA, CS, CMA, CFA, FRM, ACCA and other professional courses',
    icon: 'Certificate',
    color: 'bg-blue-100',
    categoryId: 'professional',
    isActive: true
  }
]

const MOCK_LEARNING_PATH_CATEGORIES: LearningPathCategory[] = [
  {
    id: 'school-education',
    name: 'School Education (Class 1-12)',
    slug: 'school-education',
    description: 'Complete school curriculum from Class 1 to Class 12',
    icon: 'School',
    color: 'bg-blue-100',
    sortOrder: 1,
    isActive: true,
    isFeatured: true
  },
  {
    id: 'college-university',
    name: 'College & University (UG Foundation)',
    slug: 'college-university',
    description: 'Undergraduate foundation courses for various disciplines',
    icon: 'University',
    color: 'bg-green-100',
    sortOrder: 2,
    isActive: true,
    isFeatured: true
  },
  {
    id: 'career-skills',
    name: 'Career & Professional Skills',
    slug: 'career-professional-skills',
    description: 'Professional development and career advancement courses',
    icon: 'Briefcase',
    color: 'bg-purple-100',
    sortOrder: 3,
    isActive: true,
    isFeatured: true
  },
  {
    id: 'life-skills',
    name: 'Life Skills & Personal Development',
    slug: 'life-skills',
    description: 'Essential life skills for personal growth and wellness',
    icon: 'Heart',
    color: 'bg-orange-100',
    sortOrder: 4,
    isActive: true,
    isFeatured: true
  },
  {
    id: 'life-essentials',
    name: 'Life Essentials - Confusion Removers',
    slug: 'life-essentials',
    description: 'Clear, practical understanding of everyday digital tools, money, and systems',
    icon: 'Lightbulb',
    color: 'bg-teal-100',
    sortOrder: 5,
    isActive: true,
    isFeatured: true
  },
  {
    id: 'community-understanding',
    name: 'Community Understanding',
    slug: 'community-understanding',
    description: 'Understanding how communities, organizations, and social systems work',
    icon: 'Users',
    color: 'bg-indigo-100',
    sortOrder: 6,
    isActive: true,
    isFeatured: true
  },
  {
    id: 'gov-exams',
    name: 'Government Exam Preparation',
    slug: 'government-exams',
    description: 'Comprehensive preparation for UPSC, SSC, State Police, TET and other government examinations',
    icon: 'Flag',
    color: 'bg-orange-100',
    sortOrder: 7,
    isActive: true,
    isFeatured: true
  },
  {
    id: 'stock-trading',
    name: 'Stock Market & Trading',
    slug: 'stock-market-trading',
    description: 'Stock market fundamentals, technical analysis, options trading, and investment strategies',
    icon: 'TrendingUp',
    color: 'bg-green-100',
    sortOrder: 8,
    isActive: true,
    isFeatured: true
  },
  {
    id: 'professional',
    name: 'Professional Certifications',
    slug: 'professional-certifications',
    description: 'CA, CS, CMA, CFA, FRM, ACCA, US CPA and other professional certification courses',
    icon: 'Certificate',
    color: 'bg-blue-100',
    sortOrder: 9,
    isActive: true,
    isFeatured: true
  }
]

// Sample lessons for key courses
const MOCK_LESSONS: Lesson[] = [
  // Web Development Bootcamp lessons
  {
    id: 'lesson1',
    courseId: 'career1',
    title: 'Introduction to HTML',
    content: 'Learn the basic structure of HTML documents and essential tags',
    videoUrl: 'https://example.com/video1.mp4',
    duration: 15,
    order: 1,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'lesson2',
    courseId: 'career1',
    title: 'CSS Fundamentals',
    content: 'Master CSS selectors, properties, and basic styling techniques',
    videoUrl: 'https://example.com/video2.mp4',
    duration: 20,
    order: 2,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'lesson3',
    courseId: 'career1',
    title: 'JavaScript Basics',
    content: 'Understanding variables, functions, and DOM manipulation',
    videoUrl: 'https://example.com/video3.mp4',
    duration: 25,
    order: 3,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'lesson4',
    courseId: 'career1',
    title: 'Responsive Design',
    content: 'Create mobile-friendly websites using CSS Grid and Flexbox',
    videoUrl: 'https://example.com/video4.mp4',
    duration: 18,
    order: 4,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Python Programming Mastery lessons
  {
    id: 'lesson5',
    courseId: 'career2',
    title: 'Python Installation & Setup',
    content: 'Set up Python development environment and IDE configuration',
    videoUrl: 'https://example.com/video5.mp4',
    duration: 12,
    order: 1,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'lesson6',
    courseId: 'career2',
    title: 'Variables and Data Types',
    content: 'Understanding Python variables, strings, numbers, and lists',
    videoUrl: 'https://example.com/video6.mp4',
    duration: 22,
    order: 2,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'lesson7',
    courseId: 'career2',
    title: 'Control Flow & Functions',
    content: 'Master if statements, loops, and function creation',
    videoUrl: 'https://example.com/video7.mp4',
    duration: 28,
    order: 3,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Mathematics Grade 1 lessons
  {
    id: 'lesson8',
    courseId: 'school1',
    title: 'Numbers 1 to 10',
    content: 'Learn to recognize and write numbers 1 through 10',
    videoUrl: 'https://example.com/video8.mp4',
    duration: 10,
    order: 1,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'lesson9',
    courseId: 'school1',
    title: 'Counting Objects',
    content: 'Practice counting objects and understanding quantity',
    videoUrl: 'https://example.com/video9.mp4',
    duration: 12,
    order: 2,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'lesson10',
    courseId: 'school1',
    title: 'Addition Basics',
    content: 'Introduction to adding numbers using visual aids',
    videoUrl: 'https://example.com/video10.mp4',
    duration: 15,
    order: 3,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Personal Finance Management lessons
  {
    id: 'lesson11',
    courseId: 'life1',
    title: 'Budgeting Fundamentals',
    content: 'Learn how to create and manage a personal budget',
    videoUrl: 'https://example.com/video11.mp4',
    duration: 18,
    order: 1,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'lesson12',
    courseId: 'life1',
    title: 'Saving Strategies',
    content: 'Effective methods for saving money and building emergency funds',
    videoUrl: 'https://example.com/video12.mp4',
    duration: 16,
    order: 2,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // UI/UX Design Mastery lessons
  {
    id: 'lesson13',
    courseId: 'career9',
    title: 'Design Principles',
    content: 'Understanding fundamental design principles and visual hierarchy',
    videoUrl: 'https://example.com/video13.mp4',
    duration: 20,
    order: 1,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'lesson14',
    courseId: 'career9',
    title: 'Figma Basics',
    content: 'Getting started with Figma for UI/UX design',
    videoUrl: 'https://example.com/video14.mp4',
    duration: 25,
    order: 2,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Engineering Mathematics lessons
  {
    id: 'lesson15',
    courseId: 'college1',
    title: 'Calculus Introduction',
    content: 'Basic concepts of limits, derivatives, and integrals',
    videoUrl: 'https://example.com/video15.mp4',
    duration: 30,
    order: 1,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'lesson16',
    courseId: 'college1',
    title: 'Differential Equations',
    content: 'Solving first and second order differential equations',
    videoUrl: 'https://example.com/video16.mp4',
    duration: 35,
    order: 2,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // ========== CONFUSION REMOVER LESSONS ==========

  // Digital & Smartphone Basics (cr_digital)
  {
    id: 'cr_digital_01',
    courseId: 'cr_digital',
    title: 'What is a Smartphone Actually?',
    content: `## What is a smartphone?
A smartphone is a phone that can run apps and connect to the internet. It's basically a small computer that fits in your pocket.

## Why does it work this way?
Your smartphone has an operating system (like Android or iOS) that manages all the hardware - the camera, screen, speaker, and internet connection. Apps are programs that use these hardware parts to do specific tasks.

## Where do people make mistakes?
1. Installing apps from unknown sources (APK files from websites)
2. Giving unnecessary permissions to apps (contacts, location, microphone)
3. Not updating the phone's software regularly
4. Clicking on suspicious links in messages

## What should you do next?
✅ Only install apps from Google Play Store or Apple App Store
✅ Check app permissions before installing - ask "why does this flashlight app need my contacts?"
✅ Keep your phone updated with the latest security patches
✅ Restart your phone once a week to keep it running smoothly`,
    duration: 10,
    order: 1,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cr_digital_02',
    courseId: 'cr_digital',
    title: 'How Does the Internet Actually Work?',
    content: `## What is the internet?
The internet is a global network of computers connected together. When you open a website, your phone sends a request through cell towers or WiFi to servers (powerful computers) that store the website data.

## Why does it work this way?
Data travels in small packets through multiple routers (like traffic lights for internet data). Your request goes through many stops before reaching the website server, which then sends the response back to you.

## Where do people make mistakes?
1. Connecting to free public WiFi without understanding the risks
2. Sharing sensitive information on unsecured websites
3. Not understanding the difference between WiFi and mobile data
4. Thinking "incognito mode" makes them completely anonymous

## What should you do next?
✅ Use mobile data for important transactions when outside home
✅ Only enter personal info on websites with lock icon in address bar
✅ Understand that WiFi speeds and mobile data speeds work differently
✅ Use a VPN when using public WiFi for important work`,
    duration: 12,
    order: 2,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // UPI, Banking & Digital Money (cr_upi)
  {
    id: 'cr_upi_01',
    courseId: 'cr_upi',
    title: 'What is UPI and How Does It Actually Work?',
    content: `## What is UPI?
UPI (Unified Payments Interface) is a system that lets you send money directly from your bank account using just your phone number or a virtual payment address (like @upi).

## Why does it work this way?
UPI links your phone number directly to your bank account through NPCI (National Payments Corporation of India). When you scan a QR code, you're authorizing a pull request from your account to the merchant's account.

## Where do people make mistakes?
1. Scanning QR codes to "receive" money (scammers trick people this way)
2. Sharing UPI PIN with callers claiming to be bank officials
3. Not checking the merchant name before authorizing payment
4. Assuming failed transactions mean money is lost

## What should you do next?
✅ Only scan QR codes to PAY, never to receive money
✅ Never share your UPI PIN with anyone - not even bank employees
✅ Check your bank SMS after every transaction
✅ If a transaction fails but money is deducted, wait 24-48 hours before raising a complaint (most refunds happen automatically)`,
    duration: 15,
    order: 1,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cr_upi_02',
    courseId: 'cr_upi',
    title: 'Why UPI Fails and Money Gets Stuck',
    content: `## What happens when UPI fails?
UPI failures usually happen due to: insufficient balance, poor internet connection, bank server issues, or exceeding daily transaction limits.

## Why does it work this way?
Your bank has servers that process UPI transactions. When these servers are busy or down, transactions fail. The "pending" state means the transaction is in process and usually resolves within 24-48 hours.

## Where do people make mistakes?
1. Pressing the "retry" button multiple times, causing multiple transaction attempts
2. Not checking their account balance before attempting payment
3. Assuming the transaction failed when it actually went through
4. Not saving transaction IDs for future reference

## What should you do next?
✅ Always check your bank SMS/notification after a UPI transaction
✅ If money is deducted but transaction shows "failed," don't panic - it usually refunds
✅ Note down the UPI transaction ID (like UPI123456789)
✅ Contact your bank with the transaction ID if money isn't refunded within 48 hours`,
    duration: 12,
    order: 2,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Government Portals & Certificates (cr_gov)
  {
    id: 'cr_gov_01',
    courseId: 'cr_gov',
    title: 'What is Aadhaar and Why Do You Need It?',
    content: `## What is Aadhaar?
Aadhaar is a 12-digit unique identification number issued by UIDAI that captures your biometric (fingerprints, iris scan) and demographic (name, address, DOB) information.

## Why does it work this way?
Aadhaar acts as a single source of identity verification across India. Banks, telecom companies, and government services use Aadhaar to verify you are who you claim to be.

## Where do people make mistakes?
1. Sharing Aadhaar copies without proper masking of sensitive information
2. Updating Aadhaar details at unauthorized agents instead of official centers
3. Not linking important accounts (bank, PAN, mobile) to Aadhaar
4. Ignoring Aadhaar authentication failures

## What should you do next?
✅ Download Aadhaar from myaadhaar.in with masked Aadhaar number
✅ Update Aadhaar only at official Aadhaar Seva Kendra or online through mAadhaar
✅ Link your Aadhaar to essential services (bank account, PAN, mobile number)
✅ Never share your Aadhaar OTP with anyone`,
    duration: 12,
    order: 1,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cr_gov_02',
    courseId: 'cr_gov',
    title: 'What is DigiLocker and How to Use It?',
    content: `## What is DigiLocker?
DigiLocker is a government digital vault that stores your official documents like Aadhaar, PAN, driving license, and certificates in electronic format.

## Why does it work this way?
DigiLocker is linked to your Aadhaar and creates a secure cloud storage for your documents. Government agencies can also push documents directly to your DigiLocker.

## Where do people make mistakes?
1. Not verifying documents after they're uploaded
2. Using DigiLocker for non-government documents that aren't officially recognized
3. Not understanding that DigiLocker documents are legally valid
4. Sharing DigiLocker credentials with others

## What should you do next?
✅ Sign up for DigiLocker using your Aadhaar number
✅ Verify all uploaded documents are correct and legible
✅ Use DigiLocker documents as valid proof for most official purposes
✅ Keep your DigiLocker password secure and don't share it`,
    duration: 10,
    order: 2,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Online Safety & Fraud Awareness (cr_fraud)
  {
    id: 'cr_fraud_01',
    courseId: 'cr_fraud',
    title: 'How OTP Fraud Actually Happens',
    content: `## What is OTP fraud?
OTP (One Time Password) fraud happens when scammers trick you into sharing the OTP sent to your phone, allowing them to authorize transactions from your account.

## Why does it work this way?
Scammers use social engineering - they call pretending to be from your bank, Amazon, or government, and create urgency or fear. They ask for OTP to "verify your account" or "stop a fake transaction."

## Where do people make mistakes?
1. Believing callers who claim to be from banks or government departments
2. Sharing OTP under pressure or threat
3. Not verifying the caller through official channels
4. Clicking on links in suspicious messages

## What should you do next?
✅ Remember: NO BANK, COMPANY, OR GOVERNMENT will ever ask for your OTP
✅ If someone asks for OTP, hang up immediately
✅ Verify any suspicious call by calling the official customer care number
✅ Report suspected fraud to your bank and cyber crime portal (1930)`,
    duration: 15,
    order: 1,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cr_fraud_02',
    courseId: 'cr_fraud',
    title: 'How to Protect Yourself from Online Scams',
    content: `## What are common online scams in India?
Common scams include: lottery/sweepstakes fraud, job scams, loan scams, tech support scams, and UPI QR code scams.

## Why does it work this way?
Scammers target emotions - greed (winning money), fear (legal trouble), urgency (limited offer), or kindness (helping someone in need) to make you act without thinking.

## Where do people make mistakes?
1. Believing messages about winning lotteries they never entered
2. Paying "processing fees" for loans or jobs
3. Scanning QR codes to receive money (always a scam)
4. Clicking on links in unsolicited messages

## What should you do next?
✅ If it sounds too good to be true, it's a scam
✅ Never pay money to receive money
✅ Only scan QR codes to PAY, never to receive
✅ Verify job offers through official company websites
✅ Install Truecaller to identify spam calls`,
    duration: 12,
    order: 2,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Personal Money Basics (cr_money)
  {
    id: 'cr_money_01',
    courseId: 'cr_money',
    title: 'The Simple System of Personal Money',
    content: `## What is personal money management?
It's simply understanding where your money comes from (income) and where it goes (expenses), then planning how to use what's left (savings and investments).

## Why does it work this way?
Money follows the law of conservation - you can't spend more than you earn without going into debt. Understanding this basic principle helps you make better financial decisions.

## Where do people make mistakes?
1. Not tracking daily expenses and wondering where money went
2. Confusing "need" with "want" in spending decisions
3. Not building an emergency fund before investing
4. Taking loans without understanding total interest cost

## What should you do next?
✅ Track all expenses for one month to understand spending patterns
✅ Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings
✅ Build emergency fund of 3-6 months expenses before investing
✅ Always calculate total interest cost before taking any loan`,
    duration: 12,
    order: 1,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cr_money_02',
    courseId: 'cr_money',
    title: 'Understanding Income, Salary, and Deductions',
    content: `## What is the difference between income and salary?
Income is any money you receive (salary, business profit, rental income, interest). Salary is specifically the fixed payment you receive from an employer.

## Why does it work this way?
Your salary has deductions like PF (Provident Fund), ESIC (insurance), and TDS (tax) before you receive the "take-home" amount. These deductions provide long-term benefits.

## Where do people make mistakes?
1. Not understanding their salary slip and what each deduction means
2. Not checking if employer is depositing PF contributions
3. Not filing tax returns even when TDS was deducted
4. Confusing gross salary with net salary

## What should you do next?
✅ Get a clear understanding of your salary slip components
✅ Verify PF contributions through UAN portal
✅ File income tax returns even if TDS was deducted
✅ Use PF passbook to track your provident fund savings`,
    duration: 12,
    order: 2,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // English & Communication (cr_english)
  {
    id: 'cr_english_01',
    courseId: 'cr_english',
    title: 'Removing the Fear from English Communication',
    content: `## Why do people fear speaking English?
Fear comes from feeling judged for "wrong" grammar or pronunciation. But in reality, most people care more about understanding your message than perfect English.

## Why does English matter in India?
English is a connecting language across India's diverse languages. Most professional opportunities, government exams, and higher education require English communication skills.

## Where do people make mistakes?
1. Waiting to speak "perfect" English before starting conversations
2. Focusing on grammar more than clarity of message
3. Avoiding English-speaking situations due to fear
4. Mixing up formal and informal English in wrong contexts

## What should you do next?
✅ Start speaking English regardless of mistakes - fluency comes with practice
✅ Focus on being understood rather than speaking perfectly
✅ Practice with simple conversations before moving to complex topics
✅ Watch English content with subtitles to improve understanding`,
    duration: 10,
    order: 1,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cr_english_02',
    courseId: 'cr_english',
    title: 'Practical Email and Message Writing',
    content: `## What makes a good professional email?
A professional email is clear, concise, and has the right structure: subject line, greeting, purpose, details, and closing.

## Why does it work this way?
In professional settings, emails represent you. Clear emails get faster responses and create better impressions than long, confusing messages.

## Where do people make mistakes?
1. Writing long paragraphs without clear purpose
2. Not including a clear subject line
3. Using informal language (emojis, shortcuts) in professional emails
4. Forgetting attachments mentioned in the email

## What should you do next?
✅ Keep subject lines short and descriptive (e.g., "Request for Leave: Jan 15-20")
✅ Use proper greeting (Dear Mr./Ms. or Hello) based on relationship
✅ State your purpose in the first paragraph
✅ Proofread before sending and double-check attachments`,
    duration: 10,
    order: 2,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Community Bulk Buying Model (cr_bulk)
  {
    id: 'cr_bulk_01',
    courseId: 'cr_bulk',
    title: 'Why Bulk Buying Becomes Cheaper',
    content: `## What is community bulk buying?
It's when a group of people pool their money together to buy large quantities of products directly from manufacturers or wholesalers, getting lower per-unit prices.

## Why does it work this way?
Wholesalers offer discounts for bulk purchases because they save on packaging, marketing, and retail overhead costs. When these savings are shared among buyers, everyone pays less.

## Where do people make mistakes?
1. Joining groups without verifying the organizer or supplier
2. Not understanding the total cost including transportation and distribution
3. Assuming all bulk buying groups are legitimate
4. Not asking about quality and return policies

## What should you do next?
✅ Verify the organizer and supplier before joining any bulk buying group
✅ Ask about quality guarantees and return policies
✅ Understand the complete cost including delivery charges
✅ Start with small groups you can verify personally`,
    duration: 12,
    order: 1,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cr_bulk_02',
    courseId: 'cr_bulk',
    title: 'How Pooling Small Amounts Works',
    content: `## What does "pooling" mean in community buying?
Pooling is when each person contributes their small amount to reach the minimum order quantity needed for wholesale pricing.

## Why does it work this way?
Individual small purchases have high per-unit costs due to retail margins. When 10 people each contribute ₹500 for a ₹5000 wholesale order, each gets wholesale pricing on their ₹500 worth of goods.

## Where do people make mistakes?
1. Not understanding the per-unit cost vs. total contribution
2. Assuming pooling always means better deals (it doesn't if quality is poor)
3. Not tracking their share of the purchased goods
4. Joining groups without clear accounting

## What should you do next?
✅ Calculate the per-unit cost to verify you're getting a better deal
✅ Ask for quality certifications before joining
✅ Request clear accounting of contributions and deliveries
✅ Start with non-perishable, easily verifiable goods`,
    duration: 10,
    order: 2,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Food-for-Work Model (cr_foodwork)
  {
    id: 'cr_foodwork_01',
    courseId: 'cr_foodwork',
    title: 'Understanding Dignity-Based Support Systems',
    content: `## What is a food-for-work model?
It's a support system where people receive food or meals in exchange for light community work, rather than receiving free aid without any contribution.

## Why does it work this way?
This model maintains the dignity of recipients by ensuring they contribute to their community while receiving support. It also builds community infrastructure through collective effort.

## Where do people make mistakes?
1. Confusing food-for-work with free food distribution programs
2. Not understanding the ethical limits of such programs
3. Assuming all work requirements are fair and reasonable
4. Not verifying that the organization running the program is legitimate

## What should you do next?
✅ Understand that this model requires work - it's not free aid
✅ Verify the organization and their work requirements are fair
✅ Recognize that the work should be light and appropriate
✅ Know that such programs are typically run by NGOs, Panchayats, or government agencies`,
    duration: 12,
    order: 1,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cr_foodwork_02',
    courseId: 'cr_foodwork',
    title: 'Why Earned Aid Matters More Than Free Aid',
    content: `## What is the difference between earned aid and free aid?
Earned aid is assistance received in exchange for some contribution (work, participation). Free aid is given without any expectation of return.

## Why does this distinction matter?
Research shows that earned aid creates better long-term outcomes - it maintains dignity, builds skills, and prevents dependency while free aid, though well-intentioned, can create dependency.

## Where do people make mistakes?
1. Feeling entitled to free aid without understanding long-term consequences
2. Not recognizing that earned aid builds community bonds
3. Assuming all free aid programs are better than work-based programs
4. Not evaluating the quality and fairness of work requirements

## What should you do next?
✅ Understand that work-for-food programs aim to build skills and dignity
✅ Check that work requirements are fair and appropriate
✅ Recognize that such programs help both recipients and communities
✅ Support legitimate organizations running such programs`,
    duration: 10,
    order: 2,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // How Community Systems Work (cr_community)
  {
    id: 'cr_community_01',
    courseId: 'cr_community',
    title: 'What NGOs Actually Do',
    content: `## What is an NGO?
NGO stands for Non-Governmental Organization - a non-profit group that works independently of government to address social, environmental, or humanitarian issues.

## Why do NGOs exist?
NGOs fill gaps where government services don't reach or need supplementation. They often have more flexibility and specialized focus than government programs.

## Where do people make mistakes?
1. Assuming all NGOs are the same or equally trustworthy
2. Not verifying how donated money is actually used
3. Assuming NGO work is always free (many charge for services)
4. Not understanding that NGOs can be for-profit or non-profit

## What should you do next?
✅ Verify an NGO's registration and track record before donating
✅ Ask for financial reports showing how donations are used
✅ Understand that NGOs vary widely in quality and approach
✅ Check if the NGO has proper governance structures`,
    duration: 12,
    order: 1,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cr_community_02',
    courseId: 'cr_community',
    title: 'How Panchayats and Local Governance Work',
    content: `## What is a Panchayat?
Panchayat is a local self-government body in rural India that manages village affairs, including development, dispute resolution, and welfare program implementation.

## Why does it work this way?
The 73rd Constitutional Amendment gave Panchayats constitutional status and authority over local matters including education, health, and rural development.

## Where do people make mistakes?
1. Not understanding the difference between Gram Panchayat, Block Panchayat, and Zila Panchayat
2. Not knowing their representatives or how to contact them
3. Assuming Panchayats handle all village problems
4. Not utilizing Panchayat services for official documentation

## What should you do next?
✅ Know your Sarpanch and Ward members
✅ Understand that Panchayats handle property documents, caste certificates, and welfare schemes
✅ Attend Gram Sabha meetings to participate in village decisions
✅ Use Panchayat services for official work when applicable`,
    duration: 12,
    order: 2,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // ========== PHASE 2: ADDITIONAL 20 LESSONS ==========

  // Digital & Smartphone Basics - Lessons 3-4
  {
    id: 'cr_digital_03',
    courseId: 'cr_digital',
    title: 'Understanding Apps and How to Install Them Safely',
    content: `## What are apps and why do you need them?
Apps (applications) are software programs designed for your smartphone. They extend your phone's capabilities - from making video calls to checking bank balances to editing photos.

## Why does it work this way?
Apps are developed specifically for mobile operating systems (Android or iOS). They access your phone's hardware (camera, microphone, GPS) to provide specialized functionality. The app stores (Play Store, App Store) verify apps for basic security before making them available.

## Where do people make mistakes?
1. Installing apps from sources other than official stores (APK files from unknown websites)
2. Not checking app ratings and reviews before downloading
3. Ignoring the list of permissions an app requests
4. Keeping old apps that are no longer updated by developers

## What should you do next?
✅ Only download apps from Google Play Store or Apple App Store
✅ Check app ratings (4+ stars is generally safe) and read recent reviews
✅ Review permissions - a calculator app shouldn't need camera access
✅ Update apps regularly or enable auto-update for security patches
✅ Delete apps you don't use - they may collect data in the background`,
    duration: 10,
    order: 3,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cr_digital_04',
    courseId: 'cr_digital',
    title: 'Common Smartphone Settings You Should Know',
    content: `## What are the most important smartphone settings?
Your phone has settings that control privacy, security, connectivity, and usability. Understanding these gives you control over your device and data.

## Why do these settings matter?
Default settings are often optimized for convenience, not privacy or security. Taking time to customize them protects your personal information and improves your experience.

## Where do people make mistakes?
1. Leaving location services on for all apps (battery drain and privacy risk)
2. Not setting up screen lock (PIN, pattern, or fingerprint)
3. Allowing notifications from unknown sources
4. Not backing up their data to cloud or computer

## What should you do next?
✅ Set up screen lock immediately - use fingerprint + PIN for best security
✅ Review app permissions monthly (Settings > Apps > Permissions)
✅ Turn off location for apps that don't need it (games, calculators)
✅ Enable two-factor authentication for your Google/Apple account
✅ Set up automatic backup (Google Drive for Android, iCloud for iPhone)
✅ Learn to check battery usage to identify apps consuming too much power`,
    duration: 12,
    order: 4,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // UPI, Banking & Digital Money - Lessons 3-4
  {
    id: 'cr_upi_03',
    courseId: 'cr_upi',
    title: 'Understanding Bank Accounts and Their Features',
    content: `## What types of bank accounts should you know about?
In India, common account types include Savings Accounts (for personal money storage), Current Accounts (for business transactions), and Fixed Deposits (for earning higher interest).

## Why does understanding accounts matter?
Each account type serves different purposes. Using the right account helps you manage money efficiently, avoid unnecessary charges, and maximize benefits.

## Where do people make mistakes?
1. Keeping too much money in savings accounts (could earn more in FDs or other investments)
2. Not understanding minimum balance requirements and associated charges
3. Not linking Aadhaar and mobile number to their account
4. Ignoring bank statements and not tracking transactions

## What should you do next?
✅ Understand your account type and its features
✅ Check minimum balance requirements and maintain the balance
✅ Register for mobile banking and net banking
✅ Enable SMS alerts for all transactions
✅ Review statements monthly to catch unauthorized charges
✅ Consider a separate account for savings goals (emergency fund, vacation)
✅ Know your customer ID and account number - you'll need them for transfers`,
    duration: 12,
    order: 3,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cr_upi_04',
    courseId: 'cr_upi',
    title: 'Safe Practices for Online Banking and Transactions',
    content: `## What makes online banking safe?
Safe online banking combines secure networks, protected devices, and vigilant habits. Banks use encryption and security protocols, but your practices are equally important.

## Why does this matter?
Online banking fraud is common in India. Understanding safety practices protects your hard-earned money from being stolen through unauthorized transactions.

## Where do people make mistakes?
1. Using public WiFi for banking transactions
2. Not logging out properly from net banking sessions
3. Saving login credentials on shared or public computers
4. Clicking on links in emails claiming to be from the bank
5. Sharing OTP or passwords over phone calls

## What should you do next?
✅ Always use your own device or a trusted personal device for banking
✅ Prefer mobile data over public WiFi for transactions
✅ Check for "https://" and padlock icon in browser address bar
✅ Never click links in emails - type the bank URL directly
✅ Enable transaction alerts via SMS and email
✅ Use virtual keyboards for entering PINs on shared computers
✅ Report lost phones immediately to block mobile banking apps
✅ Change passwords regularly and use strong, unique passwords
✅ Set transaction limits according to your needs`,
    duration: 15,
    order: 4,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Government Portals & Certificates - Lessons 3-4
  {
    id: 'cr_gov_03',
    courseId: 'cr_gov',
    title: 'Understanding PAN Card and Its Importance',
    content: `## What is a PAN card and why do you need it?
PAN (Permanent Account Number) is a 10-character alphanumeric identifier issued by the Income Tax Department. It's required for financial transactions above ₹50,000 and for filing income tax returns.

## Why does PAN matter?
PAN links all your financial activities to a single identity. Banks, mutual funds, and government departments require PAN for verification and tracking transactions.

## Where do people make mistakes?
1. Using the same PAN for multiple accounts (illegal)
2. Not linking PAN with Aadhaar (now mandatory)
3. Not updating PAN details when address or name changes
4. Carrying PAN card unnecessarily (risk of misuse)

## What should you do next?
✅ Apply for PAN if you don't have one (free through NSDL or UTIITSL)
✅ Keep your PAN safe - it's a critical identity document
✅ Link PAN with Aadhaar through e-filing portal
✅ Update PAN details within 30 days of any change
✅ Use e-PAN (digital copy) from income tax portal
✅ Quote PAN correctly for all financial transactions
✅ Never share PAN card photos publicly on social media
✅ Report lost PAN immediately to authorities`,
    duration: 12,
    order: 3,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cr_gov_04',
    courseId: 'cr_gov',
    title: 'How to Apply for and Use Passport Services Online',
    content: `## What is the online passport application process?
India's passport services are largely digitized through the Passport Seva Portal. You can apply online, schedule appointments, and track application status.

## Why apply online?
Online applications are faster, reduce paperwork, and allow you to choose convenient appointment slots. The process is transparent with real-time tracking.

## Where do people make mistakes?
1. Not checking eligibility requirements before applying
2. Choosing wrong category (fresh passport vs. re-issue)
3. Uploading incorrect or poor-quality documents
4. Not carrying original documents for verification
5. Missing appointment due to not checking date/time carefully

## What should you do next?
✅ Visit passportseva.gov.in for all passport-related services
✅ Choose correct application type: fresh (Tatkaal or Normal) or re-issue
✅ Gather required documents: address proof, identity proof, birth certificate
✅ Upload clear, scanned documents (not photos of documents)
✅ Pay fees online and save the receipt
✅ Note your application's File Number for tracking
✅ Arrive 15 minutes early for appointment with all original documents
✅ Carry both original and self-attested copies of all documents
✅ For Tatkaal, ensure all documents are verified by specified authorities
✅ Track application status online using File Number`,
    duration: 15,
    order: 4,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Online Safety & Fraud Awareness - Lessons 3-4
  {
    id: 'cr_fraud_03',
    courseId: 'cr_fraud',
    title: 'Identifying and Avoiding Investment Frauds',
    content: `## What are common investment frauds in India?
Investment frauds include pyramid schemes, Ponzi schemes, fake cryptocurrency platforms, and unregistered investment advisors promising unrealistic returns.

## Why do these frauds succeed?
Fraudsters exploit desires for quick wealth and lack of financial knowledge. They use social proof (fake testimonials), urgency ("limited time offer"), and authority claims ("government approved").

## Where do people make mistakes?
1. Believing promises of guaranteed high returns (anything above 12-15% is suspicious)
2. Not checking if the company is registered with SEBI
3. Investing based on social media ads or celebrity endorsements
4. Paying "processing fees" to receive investment returns
5. Not understanding what they're investing in

## What should you do next?
✅ Verify any investment company through SEBI's official website
✅ Remember: If it sounds too good to be true, it probably is
✅ Check for proper registration (RNI for newspapers, SEBI for financial products)
✅ Never pay money to receive money (classic scam sign)
✅ Research company background through Ministry of Corporate Affairs
✅ Consult a certified financial advisor before investing
✅ Start with small amounts when trying new platforms
✅ Report suspected fraud to SEBI (Sebi SCORES) or local police
✅ Learn basic financial literacy before investing
✅ Understand the risk profile of any investment before putting money`,
    duration: 15,
    order: 3,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cr_fraud_04',
    courseId: 'cr_fraud',
    title: 'Protecting Your Personal Information Online',
    content: `## Why is personal information protection important?
Your personal information (Aadhaar, PAN, phone number, address, photos) can be used for identity theft, financial fraud, and social engineering attacks.

## How is personal information misused?
Scammers use your information to create fake identities, access your accounts, trick you in phishing attacks, or sell your data to other criminals.

## Where do people make mistakes?
1. Sharing Aadhaar/PAN photos on social media or WhatsApp groups
2. Entering personal info on suspicious websites
3. Using weak passwords that are easy to guess
4. Not reviewing privacy settings on social media
5. Responding to unknown callers asking for "verification"

## What should you do next?
✅ Mask sensitive information (hide first 8 digits of Aadhaar) before sharing
✅ Use strong, unique passwords for each account (at least 12 characters)
✅ Enable two-factor authentication on all important accounts
✅ Review and limit social media privacy settings
✅ Never share OTP, PIN, or passwords with anyone
✅ Verify URLs before entering personal information
✅ Use password managers to store credentials securely
✅ Check if your data has been compromised on haveibeenpwned.com
✅ Destroy documents containing personal information before throwing them away
✅ Report data breaches to the concerned organization immediately`,
    duration: 12,
    order: 4,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Personal Money Basics - Lessons 3-4
  {
    id: 'cr_money_03',
    courseId: 'cr_money',
    title: 'Understanding Credit Cards and Smart Usage',
    content: `## What is a credit card and how does it work?
A credit card allows you to borrow money from the bank up to a limit to make purchases. You must repay the borrowed amount, either fully (to avoid interest) or partially (with interest).

## Why use credit cards wisely?
Credit cards build your credit history and offer convenience, but misuse leads to debt accumulation and high interest charges (typically 24-36% annually in India).

## Where do people make mistakes?
1. Not paying the full bill each month and accumulating interest
2. Using more than 30% of the credit limit (hurts credit score)
3. Making minimum payments only (interest compounds quickly)
4. Not tracking spending and exceeding budget
5. Ignoring credit card bills and missing payments

## What should you do next?
✅ Pay full bill each month to avoid interest charges
✅ Keep credit utilization below 30% of limit
✅ Set up auto-pay for at least minimum amount (as backup)
✅ Review statements carefully for unauthorized charges
✅ Report lost cards immediately
✅ Negotiate for lower interest rate if you have good payment history
✅ Use rewards cards that match your spending patterns
✅ Don't use credit card for cash advances (high fees + immediate interest)
✅ Cancel unused cards to reduce temptation and simplify finances
✅ Build credit score through timely payments`,
    duration: 12,
    order: 3,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cr_money_04',
    courseId: 'cr_money',
    title: 'Simple Budgeting Methods That Actually Work',
    content: `## What makes a budgeting method effective?
An effective budget helps you track income, control spending, save regularly, and reach financial goals without feeling restricted or deprived.

## Which budgeting methods work best?
Popular methods include the 50/30/20 rule, zero-based budgeting, envelope system, and expense tracking apps. Choose one that fits your lifestyle.

## Where do people make mistakes?
1. Creating unrealistic budgets they can't follow
2. Not tracking small daily expenses
3. Forgetting irregular expenses (annual insurance, gifts)
4. Not adjusting budget based on actual spending patterns
5. Giving up after a few weeks

## What should you do next?
✅ Start with simple tracking - note all expenses for 2 weeks
✅ Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings
✅ Separate accounts for spending, bills, and savings
✅ Use budgeting apps (Walnut, Money Manager, or even Notes)
✅ Plan for irregular expenses by saving monthly amounts
✅ Review and adjust budget monthly based on actual data
✅ Set specific, achievable financial goals
✅ Celebrate small wins to stay motivated
✅ Automate savings so you don't have to decide each month
✅ Keep your budget flexible - life changes, so should your budget`,
    duration: 12,
    order: 4,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // English & Communication - Lessons 3-4
  {
    id: 'cr_english_03',
    courseId: 'cr_english',
    title: 'Professional Phone Call Etiquette',
    content: `## What makes phone calls professional?
Professional phone calls have clear greetings, purpose statements, active listening, and polite closures. They're essential for job interviews, client calls, and workplace communication.

## Why does phone etiquette matter?
First impressions on phone calls affect job prospects and business relationships. Clear, professional communication shows competence and respect.

## Where do people make mistakes?
1. Not introducing themselves at the start
2. Calling at inconvenient times without checking
3. Talking too fast or too softly
4. Not taking notes and forgetting important details
5. Ending calls abruptly without confirmation

## What should you do next?
✅ Greet clearly: "Hello, this is [name] speaking"
✅ State your purpose within the first 30 seconds
✅ Listen actively and take notes during the call
✅ Ask for clarification if you don't understand
✅ Confirm next steps before ending: "So I'll send the email by Monday?"
✅ End politely: "Thank you for your time, goodbye"
✅ Practice common phrases: "May I speak to...", "Could you please hold...", "Would it be convenient..."
✅ Keep a notepad ready for important information
✅ Call from a quiet place with good network coverage
✅ Follow up with an email summarizing the conversation`,
    duration: 10,
    order: 3,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cr_english_04',
    courseId: 'cr_english',
    title: 'Improving English Reading and Comprehension',
    content: `## How can reading improve your English?
Reading exposes you to correct grammar, vocabulary, and sentence structures. Regular reading builds comprehension skills and expands your word bank naturally.

## What should you read as a beginner?
Start with materials at your level - children's books, simplified news (Suchana), or graded readers. Gradually increase difficulty as comprehension improves.

## Where do people make mistakes?
1. Trying to read complex material too soon
2. Not looking up new words and losing momentum
3. Reading silently without speaking aloud
4. Giving up when encountering unfamiliar words
5. Not practicing consistently

## What should you do next?
✅ Start with one paragraph daily from easy reading material
✅ Look up 3-5 new words each day and use them in sentences
✅ Read aloud for 10-15 minutes daily to improve pronunciation
✅ Use apps like Duolingo, BBC Learning English, or Khan Academy
✅ Read news in simple English (BBC Learning English, VOA Learning English)
✅ Keep a vocabulary notebook with new words and meanings
✅ Practice with simple stories before moving to complex articles
✅ Set a daily reading time and stick to it
✅ Discuss what you read to improve retention
✅ Watch English videos with subtitles to connect written and spoken English`,
    duration: 12,
    order: 4,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Community Bulk Buying Model - Lessons 3-4
  {
    id: 'cr_bulk_03',
    courseId: 'cr_bulk',
    title: 'Calculating Real Costs in Community Buying',
    content: `## What costs should you calculate in bulk buying?
True costs include product price, transportation, distribution fees, storage, and any processing charges. Sometimes "bulk" prices aren't better deals when all costs are considered.

## Why calculate total costs?
Marketing often highlights only the product price. The real value of bulk buying depends on complete cost calculation including hidden expenses.

## Where do people make mistakes?
1. Only comparing product prices, not total costs
2. Ignoring transportation and delivery charges
3. Not accounting for spoilage or wastage (especially for perishables)
4. Forgetting storage costs (space, containers, preservation)
5. Overbuying because "it's a good deal"

## What should you do next?
✅ Ask for complete cost breakdown: product + transport + distribution
✅ Calculate per-unit cost including all additional charges
✅ Consider shelf life and your actual consumption rate
✅ Compare with retail prices for fair comparison
✅ Factor in your time and effort for collection/storage
✅ Start with small quantities to test quality before big orders
✅ Ask about return policies for defective items
✅ Join groups with transparent accounting practices
✅ Consider quality certifications before bulk purchases
✅ Document your savings to understand real benefits`,
    duration: 10,
    order: 3,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cr_bulk_04',
    courseId: 'cr_bulk',
    title: 'Building Trust in Community Buying Groups',
    content: `## Why is trust important in community buying?
Community buying relies on group coordination. Trust in the organizer and fellow members ensures fair dealing, timely delivery, and quality products.

## How do you build and verify trust?
Trust is built through transparency, track record, community reputation, and clear policies. Verify through existing members and past transactions.

## Where do people make mistakes?
1. Joining groups without researching the organizer
2. Not checking references or past group performance
3. Making large payments without any guarantee
4. Ignoring warning signs (pressure to pay quickly, no clear policies)
5. Not keeping transaction records

## What should you do next?
✅ Research the organizer's background and reputation
✅ Talk to existing members about their experience
✅ Start with small, test purchases before big orders
✅ Ensure clear payment terms and receipt documentation
✅ Ask about dispute resolution processes
✅ Verify supplier credentials and product quality
✅ Keep all payment receipts and communication records
✅ Join groups through trusted community organizations
✅ Watch for red flags: pressure tactics, unclear terms, no physical address
✅ Report suspicious groups to local consumer forums`,
    duration: 10,
    order: 4,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // Food-for-Work Model - Lessons 3-4
  {
    id: 'cr_foodwork_03',
    courseId: 'cr_foodwork',
    title: 'Finding and Joining Food-for-Work Programs',
    content: `## How do you find legitimate food-for-work programs?
Legitimate programs are run by government agencies (MGNREGA), registered NGOs, or recognized community organizations. Research local options through official channels.

## Why find legitimate programs?
Illegitimate programs may exploit workers, offer unfair conditions, or simply take money without providing support. Verification protects you from exploitation.

## Where do people make mistakes?
1. Joining programs without verifying the organization
2. Not understanding work requirements and compensation
3. Missing enrollment deadlines or application procedures
4. Not keeping records of work done and payments received
5. Assuming all programs are the same (they vary significantly)

## What should you do next?
✅ Contact your Gram Panchayat or local BDO office for government programs
✅ Verify NGO registration through Ministry of Home Affairs portal
✅ Ask for written terms of work before joining
✅ Understand payment rates and schedule
✅ Keep a record of days worked and payments received
✅ Ask other community members about their experiences
✅ Report exploitative practices to district administration
✅ Check for official identification of program organizers
✅ Understand your rights under MGNREGA or similar schemes
✅ Network with other participants for updates and support`,
    duration: 12,
    order: 3,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cr_foodwork_04',
    courseId: 'cr_foodwork',
    title: 'Rights and Benefits in Community Work Programs',
    content: `## What rights do participants have in work programs?
Rights vary by program but typically include fair wages, safe working conditions, timely payments, and dignity in treatment. Government programs like MGNREGA have legal protections.

## How do you protect your rights?
Know program rules, document everything, report violations, and connect with fellow participants for mutual support.

## Where do people make mistakes?
1. Not knowing their entitlements under specific programs
2. Accepting below-legal wages to "stay in the program"
3. Not documenting work done or payments received
4. fearing backlash and not reporting violations
5. Not exercising their right to information

## What should you do next?
✅ Learn the specific rules and rights of your program
✅ Keep a written record of days, hours, and tasks
✅ Demand proper wage slips and payment receipts
✅ Report delayed payments or unfair deductions immediately
✅ Know the minimum wage rates for your area and job type
✅ Request written contracts or agreements
✅ Connect with local labor rights organizations if needed
✅ File complaints through proper channels (ombudsman, labor department)
✅ Support fellow participants in knowing their rights
✅ Understand that speaking up is your legal right`,
    duration: 12,
    order: 4,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },

  // How Community Systems Work - Lessons 3-4
  {
    id: 'cr_community_03',
    courseId: 'cr_community',
    title: 'Understanding CSR and Corporate Social Responsibility',
    content: `## What is CSR and how does it work?
CSR (Corporate Social Responsibility) requires large companies to spend 2% of net profit on community development activities through specified activities like education, healthcare, and environmental projects.

## Why does CSR matter for communities?
CSR funds provide additional resources for community development beyond government programs. Companies may fund infrastructure, skill development, health camps, and environmental initiatives.

## Where do people make mistakes?
1. Not knowing which companies operate CSR programs locally
2. Not understanding how to access CSR benefits
3. Assuming CSR benefits are automatic (need to apply or qualify)
4. Not knowing which activities are covered under CSR
5. Approaching the wrong contact points

## What should you do next?
✅ Check which companies have CSR obligations in your area
✅ Understand CSR activities: education, healthcare, rural development, environment
✅ Approach district administration for CSR project information
✅ Connect with NGOs implementing CSR projects
✅ Apply through proper channels with required documents
✅ Understand that CSR is not charity but legal obligation
✅ Keep records and follow up on applications
✅ Report diversion of CSR funds to authorities
✅ Participate in community meetings where CSR projects are discussed
✅ Leverage CSR for skill development and employment opportunities`,
    duration: 12,
    order: 3,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'cr_community_04',
    courseId: 'cr_community',
    title: 'How to Access Government Welfare Schemes',
    content: `## What government welfare schemes are available?
India has hundreds of schemes for different groups - farmers, women, children, elderly, disabled, and economically weak. Examples include PM Kisan, Ujjwala Yojana, Ayushman Bharat, and old age pensions.

## How do you access these schemes?
Most schemes require Aadhaar linkage and application through official portals or local government offices. Each scheme has specific eligibility criteria and application procedures.

## Where do people make mistakes?
1. Not knowing which schemes they're eligible for
2. Applying through unofficial channels and losing money
3. Not having required documents (Aadhaar, bank account, caste certificate)
4. Missing application deadlines
5. Not following up on application status

## What should you do next?
✅ Visit your nearest Common Service Center (CSC) for assistance
✅ Download schemes handbook from government portals
✅ Check eligibility on official websites before applying
✅ Keep documents ready: Aadhaar, bank account with IFSC, mobile number
✅ Apply through official portals (pmkisan.gov.in, ayushmanmanrogya.in)
✅ Never pay money to apply for government schemes
✅ Note application/reference numbers for tracking
✅ Follow up with local officials if delays occur
✅ Report fraud to 1800-XXX-XXXX helplines
✅ Help others in your community access these benefits`,
    duration: 15,
    order: 4,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  }
]

// ========== PHASE 3: COMMUNITY FEATURES MOCK DATA ==========

// User confusion submissions
const MOCK_CONFUSION_SUBMISSIONS: ConfusionSubmission[] = [
  {
    id: 'sub1',
    userId: 'student1',
    userName: 'Rajesh Kumar',
    topic: 'How to check if my UPI transaction actually failed or succeeded?',
    description: 'I made a payment of ₹500 to a merchant but the app showed "failed". I got an SMS from my bank saying "UPI txn fail" but the money was deducted. How do I verify if the transaction really failed or if it will be refunded?',
    category: 'Digital Money',
    status: 'approved',
    priority: 'high',
    upvotes: 45,
    submittedAt: '2025-01-20T10:30:00Z',
    updatedAt: '2025-01-21T14:00:00Z'
  },
  {
    id: 'sub2',
    userId: 'student2',
    userName: 'Priya Sharma',
    topic: 'My Aadhaar is linked to my old phone number - how do I update it?',
    description: 'I changed my phone number but my Aadhaar is still linked to the old number. I need to update it for bank account and mobile number verification. What is the process?',
    category: 'Government Documents',
    status: 'in-progress',
    priority: 'medium',
    upvotes: 32,
    submittedAt: '2025-01-19T15:45:00Z',
    updatedAt: '2025-01-20T09:00:00Z'
  },
  {
    id: 'sub3',
    userId: 'student3',
    userName: 'Amit Verma',
    topic: 'What happens if I click on a suspicious link by mistake?',
    description: 'I accidentally clicked on a link in an SMS that said "Your bank account will be blocked". It asked me to enter my ATM PIN. I realized it was fake and closed it immediately. What should I do now?',
    category: 'Online Safety',
    status: 'pending',
    priority: 'high',
    upvotes: 67,
    submittedAt: '2025-01-21T08:15:00Z',
    updatedAt: '2025-01-21T08:15:00Z'
  },
  {
    id: 'sub4',
    userId: 'student4',
    userName: 'Sunita Devi',
    topic: 'How do I explain to my parents about online shopping safely?',
    description: 'My parents want to shop online but are afraid of fraud. They keep hearing about people losing money. How can I teach them to shop safely online?',
    category: 'Digital Basics',
    status: 'approved',
    priority: 'medium',
    upvotes: 28,
    submittedAt: '2025-01-18T16:20:00Z',
    updatedAt: '2025-01-19T11:00:00Z'
  },
  {
    id: 'sub5',
    userId: 'student5',
    userName: 'Mohammed Irfan',
    topic: 'What is the correct format for writing professional emails in English?',
    description: 'I need to write emails to my boss and clients but I am not confident about the format. What should be the greeting, body, and closing for professional communication?',
    category: 'English Communication',
    status: 'resolved',
    priority: 'low',
    upvotes: 54,
    submittedAt: '2025-01-15T12:00:00Z',
    updatedAt: '2025-01-17T10:30:00Z'
  }
]

// Success stories from users
const MOCK_SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'story1',
    userId: 'student6',
    userName: 'Geeta Kumari',
    userAvatar: 'GK',
    relatedConfusionId: 'cr_upi_01',
    relatedLessonId: 'cr_upi_01',
    story: 'Before learning about UPI, I was so scared of digital payments. I used to go to the bank for everything. After reading the "What is UPI" lesson, I understood how it works and now I use UPI daily. I even taught my mother how to scan QR codes!',
    storyHindi: 'UPI के बारे में जानने से पहले, मुझे डिजिटल पेमेंट से बहुत डर लगता था। मैं सब काम के लिए बैंक जाता था। "UPI क्या है" पढ़ने के बाद, मैंने समझा कि यह कैसे काम करता है और अब मैं रोज़ाना UPI इस्तेमाल करता हूं।',
    language: 'en',
    isAnonymous: false,
    isFeatured: true,
    isApproved: true,
    createdAt: '2025-01-20T14:30:00Z'
  },
  {
    id: 'story2',
    userId: 'student7',
    userName: 'Vikram Singh',
    relatedConfusionId: 'cr_fraud_01',
    relatedLessonId: 'cr_fraud_01',
    story: 'I almost lost ₹50,000 to an OTP scam last month. The caller said he was from the bank and asked for OTP to "reverse a wrong transaction". I remembered the lesson about OTP fraud and immediately disconnected the call. That lesson saved my money!',
    language: 'en',
    isAnonymous: false,
    isFeatured: true,
    isApproved: true,
    createdAt: '2025-01-19T09:15:00Z'
  },
  {
    id: 'story3',
    userId: 'student8',
    userName: 'Anjali Gupta',
    relatedConfusionId: 'cr_digital_01',
    relatedLessonId: 'cr_digital_01',
    story: 'My grandfather used to be terrified of smartphones. He thought clicking anything would delete his data or cost money. After going through the "What is a Smartphone" lesson together, he now video calls his grandchildren every weekend!',
    language: 'en',
    isAnonymous: false,
    isFeatured: true,
    isApproved: true,
    createdAt: '2025-01-18T11:45:00Z'
  },
  {
    id: 'story4',
    userId: 'student9',
    userName: 'Ramesh Yadav',
    relatedConfusionId: 'cr_gov_01',
    relatedLessonId: 'cr_gov_01',
    story: 'I always thought Aadhaar was just an ID card. I never knew it could be used to verify documents digitally. The DigiLocker lesson changed how I store and share my documents. No more carrying original documents everywhere!',
    language: 'en',
    isAnonymous: false,
    isFeatured: false,
    isApproved: true,
    createdAt: '2025-01-17T16:20:00Z'
  },
  {
    id: 'story5',
    userId: 'student10',
    userName: 'Pooja Reddy',
    relatedConfusionId: 'cr_english_01',
    relatedLessonId: 'cr_english_01',
    story: 'I avoided speaking English for years because I was afraid of making mistakes. The "Removing Fear from English" lesson made me realize that communication is about being understood, not about perfect grammar. I gave my first presentation in English last week!',
    language: 'en',
    isAnonymous: false,
    isFeatured: true,
    isApproved: true,
    createdAt: '2025-01-16T13:00:00Z'
  }
]

// Expert Q&A integration data
const MOCK_EXPERT_QNA: ExpertQnA[] = [
  {
    id: 'qa1',
    lessonId: 'cr_upi_01',
    courseId: 'cr_upi',
    discussionThreadId: 'cr_upi_thread_01',
    expertId: 'inst6',
    expertName: 'Arun Patel',
    isActive: true,
    createdAt: '2025-01-15T10:00:00Z',
    lastActivityAt: '2025-01-21T15:30:00Z'
  },
  {
    id: 'qa2',
    lessonId: 'cr_fraud_01',
    courseId: 'cr_fraud',
    discussionThreadId: 'cr_fraud_thread_01',
    expertId: 'inst6',
    expertName: 'Arun Patel',
    isActive: true,
    createdAt: '2025-01-15T10:00:00Z',
    lastActivityAt: '2025-01-20T11:45:00Z'
  },
  {
    id: 'qa3',
    lessonId: 'cr_digital_01',
    courseId: 'cr_digital',
    discussionThreadId: 'cr_digital_thread_01',
    expertId: 'inst4',
    expertName: 'Vikram Singh',
    isActive: true,
    createdAt: '2025-01-15T10:00:00Z',
    lastActivityAt: '2025-01-19T09:20:00Z'
  }
]

// Lesson translations for regional languages
const MOCK_LESSON_TRANSLATIONS: LessonTranslation[] = [
  {
    lessonId: 'cr_upi_01',
    language: 'hi',
    title: 'UPI क्या है और यह वास्तव में कैसे काम करता है?',
    content: `## UPI क्या है?
UPI (Unified Payments Interface) एक ऐसी प्रणाली है जो आपको सिर्फ अपना फ़ोन नंबर या वर्चुअल पेमेंट एड्रेस (जैसे @upi) का उपयोग करके सीधे अपने बैंक खाते से पैसे भेजने की अनुमति देती है।

## यह इस तरह क्यों काम करता है?
UPI आपके फ़ोन नंबर को NPCI (National Payments Corporation of India) के माध्यम से सीधे आपके बैंक खाते से जोड़ता है। जब आप QR कोड स्कैन करते हैं, तो आप अपने खाते से व्यापारी के खाते में पुल अनुरोध को अधिकृत कर रहे होते हैं।

## लोग कहाँ गलती करते हैं?
1. पैसे प्राप्त करने के लिए QR कोड स्कैन करना (धोखेबाज इस तरह लोगों को धोखा देते हैं)
2. बैंक अधिकारियों होने का दावा करने वाले कॉलर्स के साथ UPI PIN साझा करना
3. भुगतान अधिकृत करने से पहले व्यापारी का नाम जांचना नहीं
4. यह मान लेना कि विफल लेनदेन का मतलब है कि पैसा खो गया है

## आपको अगला क्या करना चाहिए?
✅ भुगतान करने के लिए ही QR कोड स्कैन करें, पैसे प्राप्त करने के लिए कभी नहीं
✅ अपना UPI PIN किसी के साथ साझा न करें - बैंक कर्मचारियों के साथ भी नहीं
✅ हर लेनदेन के बाद अपना बैंक SMS जांचें
✅ यदि लेनदेन विफल हो जाता है लेकिन पैसा कट जाता है, तो शिकायत दर्ज करने से पहले 24-48 घंटे प्रतीक्षा करें (अधिकांश रिफंड स्वचालित रूप से होते हैं)`,
    contentHtml: '<h2>UPI क्या है?</h2><p>UPI (Unified Payments Interface) एक ऐसी प्रणाली है...</p>',
    isVerified: true,
    translatedAt: '2025-01-15T00:00:00Z'
  },
  {
    lessonId: 'cr_digital_01',
    language: 'hi',
    title: 'स्मार्टफोन वास्तव में क्या है?',
    content: `## स्मार्टफोन क्या है?
स्मार्टफोन एक ऐसा फ़ोन है जो ऐप्स चला सकता है और इंटरनेट से जुड़ सकता है। यह अनिवार्य रूप से एक छोटा कंप्यूटर है जो आपकी जेब में फिट हो जाता है।

## यह इस तरह क्यों काम करता है?
आपके स्मार्टफोन में एक ऑपरेटिंग सिस्टम है (जैसे Android या iOS) जो सभी हार्डवेयर - कैमरा, स्क्रीन, स्पीकर और इंटरनेट कनेक्शन को प्रबंधित करता है। ऐप विशिष्ट कार्य करने के लिए इन हार्डवेयर भागों का उपयोग करने वाले प्रोग्राम हैं।

## लोग कहाँ गलती करते हैं?
1. अज्ञात स्रोतों से ऐप्स इंस्टॉल करना (वेबसाइटों से APK फाइलें)
2. ऐप्स को अनावश्यक अनुमतियाँ देना (संपर्क, स्थान, माइक्रोफोन)
3. फ़ोन के सॉफ्टवेयर को नियमित रूप से अपडेट नहीं करना
4. संदेशों में संदिग्ध लिंक पर क्लिक करना

## आपको अगला क्या करना चाहिए?
✅ Google Play Store या Apple App Store से ही ऐप्स इंस्टॉल करें
✅ इंस्टॉल करने से पहले ऐप की अनुमतियाँ जांचें - पूछें "इस फ्लैशलाइट ऐप को मेरे संपर्कों की क्यों जरूरत है?"
✅ अपना फ़ोन नवीनतम सुरक्षा पैच के साथ अपडेट रखें
✅ इसे सुचारू रूप से चलाने के लिए सप्ताह में एक बार फ़ोन रीस्टार्ट करें`,
    contentHtml: '<h2>स्मार्टफोन क्या है?</h2><p>स्मार्टफोन एक ऐसा फ़ोन है...</p>',
    isVerified: true,
    translatedAt: '2025-01-15T00:00:00Z'
  },
  {
    lessonId: 'cr_fraud_01',
    language: 'hi',
    title: 'OTP धोखाधड़ी वास्तव में कैसे होती है?',
    content: `## OTP धोखाधड़ी क्या है?
OTP (One Time Password) धोखाधड़ी तब होती है जब धोखेबाज आपको अपने फ़ोन पर भेजे गए OTP को साझा करने के लिए धोखा देते हैं, जिससे वे आपके खाते से लेनदेन को अधिकृत कर सकते हैं।

## यह इस तरह क्यों काम करता है?
धोखेबाज सोशल इंजीनियरिंग का उपयोग करते हैं - वे आपके बैंक, Amazon या सरकार से होने का दावा करके कॉल करते हैं और जल्दबाजी या डर पैदा करते हैं। वे "आपके खाते को सत्यापित करने" या "नकली लेनदेन रोकने" के लिए OTP माँगते हैं।

## लोग कहाँ गलती करते हैं?
1. बैंकों या सरकारी विभागों से होने का दावा करने वाले कॉलर्स पर विश्वास करना
2. दबाव या धमकी के तहत OTP साझा करना
3. कॉलर को आधिकारिक चैनलों के माध्यम से सत्यापित नहीं करना
4. संदिग्ध संदेशों में लिंक पर क्लिक करना

## आपको अगला क्या करना चाहिए?
✅ याद रखें: कोई भी बैंक, कंपनी या सरकार कभी भी आपका OTP नहीं माँगेगा
✅ अगर कोई OTP माँगे, तो तुरंत फ़ोन काट दें
✅ किसी भी संदिग्ध कॉल को आधिकारिक कस्टमर केयर नंबर से सत्यापित करें
✅ संदिग्ध धोखाधड़ी की सूचना अपने बैंक और साइबर क्राइम पोर्टल (1930) को दें`,
    contentHtml: '<h2>OTP धोखाधड़ी क्या है?</h2><p>OTP (One Time Password) धोखाधड़ी...</p>',
    isVerified: true,
    translatedAt: '2025-01-15T00:00:00Z'
  }
]

// Enhanced Discussion Mock Data
const MOCK_DISCUSSIONS: Discussion[] = [
  {
    id: 'disc1',
    title: 'Help with CSS Flexbox layout issues',
    content: `I'm having trouble understanding CSS Flexbox. Can someone explain the main concepts? I'm trying to create a responsive navbar but the items aren't aligning properly.

Here's what I've tried:
\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
}
\`\`\`

But the items are still not spacing correctly. What am I missing?`,
    isPinned: true,
    isActive: true,
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    userId: 'student1',
    courseId: 'career1',
    tags: ['css', 'flexbox', 'beginner', 'layout'],
    difficultyLevel: 'Beginner',
    subjectCategory: 'Web Development',
    viewCount: 45,
    likeCount: 8
  },
  {
    id: 'disc2',
    title: 'Best practices for JavaScript functions',
    content: `What are the best practices for writing clean JavaScript functions? I want to improve my code quality and make it more maintainable.

I'm specifically looking for:
- Function naming conventions
- Parameter handling
- Return statements
- Error handling

Any examples or resources would be appreciated!`,
    isPinned: false,
    isActive: true,
    createdAt: '2025-01-16T14:20:00Z',
    updatedAt: '2025-01-16T14:20:00Z',
    userId: 'student1',
    courseId: 'career2',
    tags: ['javascript', 'functions', 'best-practices', 'code-quality'],
    difficultyLevel: 'Intermediate',
    subjectCategory: 'Programming',
    viewCount: 67,
    likeCount: 12
  },
  {
    id: 'disc3',
    title: 'Color theory in modern UI design',
    content: `How important is color theory in modern UI design? Any resources to learn more about creating effective color palettes?

I'm working on a mobile app and struggling with:
- Choosing complementary colors
- Ensuring accessibility
- Creating brand consistency

Looking for expert insights! 🎨`,
    isPinned: false,
    isActive: true,
    createdAt: '2025-01-17T09:15:00Z',
    updatedAt: '2025-01-17T09:15:00Z',
    userId: 'student1',
    courseId: 'career9',
    tags: ['ui-design', 'color-theory', 'accessibility', 'branding'],
    difficultyLevel: 'Intermediate',
    subjectCategory: 'Design',
    viewCount: 34,
    likeCount: 6
  },
  {
    id: 'disc4',
    title: 'Budgeting tips for beginners in India 🇮🇳',
    content: `I'm new to personal finance and looking for budgeting tips specifically for Indian context. What are the best apps or methods to track expenses?

Current situation:
- Monthly income: ₹45,000
- Living with family in Mumbai
- Want to start investing

What percentage should I allocate for savings?`,
    isPinned: true,
    isActive: true,
    createdAt: '2025-01-18T11:45:00Z',
    updatedAt: '2025-01-18T11:45:00Z',
    userId: 'student1',
    courseId: 'life1',
    tags: ['budgeting', 'india', 'personal-finance', 'savings', 'beginner'],
    difficultyLevel: 'Beginner',
    subjectCategory: 'Finance',
    viewCount: 89,
    likeCount: 15
  },
  {
    id: 'disc5',
    title: 'Python vs R for data analysis',
    content: `I'm starting my data science journey and confused between Python and R. Which one should I learn first for data analysis in India?

Factors to consider:
- Job market in India
- Learning curve
- Industry preferences
- Career growth opportunities

Also, which online courses would you recommend?`,
    isPinned: false,
    isActive: true,
    createdAt: '2025-01-19T16:30:00Z',
    updatedAt: '2025-01-19T16:30:00Z',
    userId: 'student1',
    courseId: 'career2',
    tags: ['python', 'r', 'data-science', 'career', 'comparison'],
    difficultyLevel: 'Beginner',
    subjectCategory: 'Data Science',
    viewCount: 123,
    likeCount: 18
  },
  {
    id: 'disc6',
    title: 'React hooks vs class components',
    content: `Should I focus on learning React hooks or class components? Most tutorials seem to prefer hooks now.

I understand the basics but I'm confused about:
- When to use each approach
- Migration strategies
- Performance differences
- Future-proofing my knowledge

What do you recommend for someone starting out?`,
    isPinned: false,
    isActive: true,
    createdAt: '2025-01-20T13:20:00Z',
    updatedAt: '2025-01-20T13:20:00Z',
    userId: 'student1',
    courseId: 'career1',
    tags: ['react', 'hooks', 'class-components', 'javascript', 'framework'],
    difficultyLevel: 'Intermediate',
    subjectCategory: 'Web Development',
    viewCount: 56,
    likeCount: 9
  },
  {
    id: 'disc7',
    title: 'Getting started with Figma - Tips for beginners',
    content: `Just started using Figma for UI design and feeling a bit overwhelmed. What are the essential features I should focus on first?

Looking for:
- Basic shortcuts
- Component creation
- Design system setup
- Collaboration features

Any beginner-friendly tutorials or resources?`,
    isPinned: false,
    isActive: true,
    createdAt: '2025-01-21T10:00:00Z',
    updatedAt: '2025-01-21T10:00:00Z',
    userId: 'student1',
    courseId: 'career9',
    tags: ['figma', 'ui-design', 'tools', 'beginner', 'tutorial'],
    difficultyLevel: 'Beginner',
    subjectCategory: 'Design',
    viewCount: 28,
    likeCount: 4
  },
  {
    id: 'disc8',
    title: 'Investment options for young professionals in India',
    content: `As a 25-year-old working professional, what investment options should I consider? I've already started an emergency fund and want to explore other investment avenues.

Current situation:
- Stable job with steady income
- Risk appetite: Moderate
- Investment horizon: 5-10 years
- Monthly investment capacity: ₹15,000

Looking for advice on SIPs, mutual funds, and other options.`,
    isPinned: false,
    isActive: true,
    createdAt: '2025-01-22T14:15:00Z',
    updatedAt: '2025-01-22T14:15:00Z',
    userId: 'student1',
    courseId: 'life1',
    tags: ['investing', 'mutual-funds', 'sip', 'young-professionals', 'india'],
    difficultyLevel: 'Intermediate',
    subjectCategory: 'Finance',
    viewCount: 78,
    likeCount: 11
  }
]

const MOCK_DISCUSSION_REPLIES: DiscussionReply[] = [
  {
    id: 'reply1',
    content: `Flexbox is all about flexible box layouts. The main concepts are flex container, flex items, and various properties like justify-content and align-items. 

For your navbar issue, try this:

\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Add this line */
  padding: 0 1rem;
}

.navbar ul {
  display: flex;
  list-style: none;
  gap: 1rem; /* Use gap instead of margins */
}
\`\`\`

Also, make sure your HTML structure is correct!`,
    isActive: true,
    createdAt: '2025-01-15T11:45:00Z',
    updatedAt: '2025-01-15T11:45:00Z',
    userId: 'instructor1',
    discussionId: 'disc1',
    likeCount: 5,
    isEdited: false
  },
  {
    id: 'reply2',
    content: `I recommend checking out CSS Tricks guide on Flexbox. It has great interactive examples! 

Also, remember that flexbox is one-dimensional (either row OR column), whereas CSS Grid is two-dimensional. For complex layouts, you might need to combine both.

Here's a helpful resource: https://css-tricks.com/snippets/css/a-guide-to-flexbox/`,
    isActive: true,
    createdAt: '2025-01-15T12:30:00Z',
    updatedAt: '2025-01-15T12:30:00Z',
    userId: 'student1',
    discussionId: 'disc1',
    likeCount: 3,
    isEdited: false
  },
  {
    id: 'reply3',
    content: `Great question! Here are some best practices for JavaScript functions:

**Function Naming:**
- Use camelCase: \`calculateTotal()\`
- Be descriptive: \`getUserProfileById()\`
- Start with verbs: \`fetchData()\`, \`validateInput()\`

**Parameters:**
- Keep functions focused (single responsibility)
- Use default parameters when possible
- Consider destructuring for complex objects

**Example:**
\`\`\`javascript
// Good practice
function calculateDiscount(price, discountPercentage = 10) {
  if (price <= 0 || discountPercentage < 0) {
    throw new Error('Invalid parameters');
  }
  
  const discountAmount = (price * discountPercentage) / 100;
  return price - discountAmount;
}
\`\`\`

Would you like me to elaborate on any of these points?`,
    isActive: true,
    createdAt: '2025-01-16T15:20:00Z',
    updatedAt: '2025-01-16T15:20:00Z',
    userId: 'instructor1',
    discussionId: 'disc2',
    likeCount: 8,
    isEdited: false
  },
  {
    id: 'reply4',
    content: `Don't forget about pure functions and avoiding side effects! 

Also, learn about async/await for handling asynchronous operations cleanly:

\`\`\`javascript
// Modern async pattern
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}
\`\`\``,
    isActive: true,
    createdAt: '2025-01-16T16:45:00Z',
    updatedAt: '2025-01-16T16:45:00Z',
    userId: 'student1',
    discussionId: 'disc2',
    likeCount: 4,
    isEdited: false
  },
  {
    id: 'reply5',
    content: `Color theory is crucial! It affects user experience, accessibility, and brand perception. 

**Key principles:**
- **Contrast Ratio:** Ensure WCAG AA compliance (4.5:1 for normal text)
- **Color Psychology:** Blue = trust, Green = success, Red = error
- **60-30-10 Rule:** 60% primary color, 30% secondary, 10% accent

**Tools I recommend:**
- Figma's color picker with contrast checking
- Adobe Color for palette generation
- Color Oracle for accessibility testing

**Quick tip:** Start with a monochromatic palette and gradually add complementary colors.`,
    isActive: true,
    createdAt: '2025-01-17T10:30:00Z',
    updatedAt: '2025-01-17T10:30:00Z',
    userId: 'instructor1',
    discussionId: 'disc3',
    likeCount: 6,
    isEdited: false
  },
  {
    id: 'reply6',
    content: `For Indian context, I recommend using apps like **Walnut** or **Money Manager**. They work well with Indian banks and UPI transactions.

**Budgeting Rule for India:**
- **50%** - Needs (rent, food, utilities)
- **30%** - Wants (entertainment, dining out)
- **20%** - Savings & Investments

**Quick tips:**
1. Track expenses for first 3 months to understand your spending pattern
2. Use UPI for most transactions (easy tracking)
3. Start with SIPs in mutual funds (₹500-1000 monthly)
4. Build emergency fund first (3-6 months expenses)

**Apps for Indians:**
- Walnut (expense tracking)
- ET Money (investments)
- Paytm (UPI payments)`,
    isActive: true,
    createdAt: '2025-01-18T13:20:00Z',
    updatedAt: '2025-01-18T13:20:00Z',
    userId: 'instructor1',
    discussionId: 'disc4',
    likeCount: 12,
    isEdited: false
  },
  {
    id: 'reply7',
    content: `I'd recommend **Python** first for several reasons:

✅ **Learning Curve:** Gentler for beginners
✅ **Job Market:** More opportunities in India (IT hub)
✅ **Versatility:** Web dev, data science, automation, AI
✅ **Community:** Larger support community
✅ **Libraries:** Pandas, NumPy, Matplotlib for data analysis

**Learning Path:**
1. Python basics (2-3 weeks)
2. NumPy & Pandas (1 month)
3. Data visualization (Matplotlib/Seaborn)
4. Machine learning basics (Scikit-learn)

**R strengths:** Statistical analysis, academic research, built-in statistical functions

**Resources for Indians:**
- Python.org tutorials
- Coursera's Python for Everybody
- DataCamp (has Indian pricing)`,
    isActive: true,
    createdAt: '2025-01-19T18:00:00Z',
    updatedAt: '2025-01-19T18:00:00Z',
    userId: 'instructor1',
    discussionId: 'disc5',
    likeCount: 15,
    isEdited: false
  },
  {
    id: 'reply8',
    content: `Definitely focus on **hooks**! They're the modern way of writing React components. Class components are considered legacy now.

**Why hooks are better:**
- Less boilerplate code
- Easier to share stateful logic
- Better performance optimization
- Simpler testing

**Learning sequence:**
1. useState (state management)
2. useEffect (side effects)
3. useContext (global state)
4. Custom hooks (reusable logic)

**Migration tip:** Don't worry about converting old class components immediately. Focus on learning hooks for new components.`,
    isActive: true,
    createdAt: '2025-01-20T14:15:00Z',
    updatedAt: '2025-01-20T14:15:00Z',
    userId: 'instructor1',
    discussionId: 'disc6',
    likeCount: 7,
    isEdited: false
  }
]

// Simple data access functions
export function getCourses(): Course[] {
  return MOCK_COURSES
}

export function getInstructors(): Instructor[] {
  return MOCK_INSTRUCTORS
}

export function getLearningPaths(): LearningPath[] {
  return MOCK_LEARNING_PATHS
}

export function getLearningPathCategories(): LearningPathCategory[] {
  return MOCK_LEARNING_PATH_CATEGORIES
}

export function getLessons(): Lesson[] {
  return MOCK_LESSONS
}

export function getLessonsByCourseId(courseId: string): Lesson[] {
  return MOCK_LESSONS.filter(lesson => lesson.courseId === courseId && lesson.isActive)
    .sort((a, b) => a.order - b.order)
}

export function getLessonById(lessonId: string): Lesson | null {
  return MOCK_LESSONS.find(lesson => lesson.id === lessonId) || null
}

export function getCourseCount(): number {
  return MOCK_COURSES.filter(c => c.isActive).length
}

export function getLearningPathCount(): number {
  return MOCK_LEARNING_PATHS.filter(p => p.isActive).length
}

export function getLessonCount(): number {
  return 500 // Comprehensive curriculum with lessons for all courses
}

export function getInstructorCount(): number {
  return MOCK_INSTRUCTORS.length
}

export function getUserCount(): number {
  return 2500 // Growing user base
}

export function getSampleUsers(): SampleUser[] {
  return SAMPLE_USERS
}

export function getUserById(userId: string): SampleUser | null {
  return SAMPLE_USERS.find(user => user.id === userId) || null
}

// Discussion data access functions
export function getDiscussions(): Discussion[] {
  return MOCK_DISCUSSIONS.filter(d => d.isActive)
    .sort((a, b) => {
      // Pinned discussions first, then by creation date
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
}

export function getDiscussionById(discussionId: string): Discussion | null {
  return MOCK_DISCUSSIONS.find(d => d.id === discussionId && d.isActive) || null
}

export function getDiscussionsByCourseId(courseId: string): Discussion[] {
  return MOCK_DISCUSSIONS.filter(d => d.courseId === courseId && d.isActive)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getDiscussionReplies(discussionId: string): DiscussionReply[] {
  return MOCK_DISCUSSION_REPLIES
    .filter(r => r.discussionId === discussionId && r.isActive)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

export function getDiscussionReplyById(replyId: string): DiscussionReply | null {
  return MOCK_DISCUSSION_REPLIES.find(r => r.id === replyId && r.isActive) || null
}

export function getThreadedReplies(discussionId: string): DiscussionReply[] {
  const allReplies = getDiscussionReplies(discussionId)
  
  // Build threaded structure
  const replyMap = new Map<string, DiscussionReply & { replies: DiscussionReply[] }>()
  const rootReplies: (DiscussionReply & { replies: DiscussionReply[] })[] = []
  
  // First pass: create map with empty replies array
  allReplies.forEach(reply => {
    replyMap.set(reply.id, { ...reply, replies: [] })
  })
  
  // Second pass: organize into tree structure
  allReplies.forEach(reply => {
    const replyWithChildren = replyMap.get(reply.id)!
    if (reply.parentReplyId && replyMap.has(reply.parentReplyId)) {
      // This is a child reply
      replyMap.get(reply.parentReplyId)!.replies.push(replyWithChildren)
    } else {
      // This is a root reply
      rootReplies.push(replyWithChildren)
    }
  })
  
  return rootReplies as DiscussionReply[]
}

export function getTrendingDiscussions(): Discussion[] {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  return MOCK_DISCUSSIONS
    .filter(d => d.isActive && new Date(d.createdAt) >= oneWeekAgo)
    .sort((a, b) => (b.likeCount + b.viewCount) - (a.likeCount + a.viewCount))
    .slice(0, 5)
}

export function getDiscussionTags(): string[] {
  const allTags = MOCK_DISCUSSIONS
    .filter(d => d.isActive && d.tags)
    .flatMap(d => d.tags!)
  
  // Remove duplicates and sort alphabetically
  return [...new Set(allTags)].sort()
}

export function searchDiscussions(query: string): Discussion[] {
  const lowercaseQuery = query.toLowerCase()
  return MOCK_DISCUSSIONS.filter(d => 
    d.isActive && (
      d.title.toLowerCase().includes(lowercaseQuery) ||
      d.content.toLowerCase().includes(lowercaseQuery) ||
      (d.tags && d.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
    )
  )
}

export function filterDiscussionsByDifficulty(difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): Discussion[] {
  return MOCK_DISCUSSIONS.filter(d => d.isActive && d.difficultyLevel === difficulty)
}

export function filterDiscussionsByTag(tag: string): Discussion[] {
  return MOCK_DISCUSSIONS.filter(d => d.isActive && d.tags?.includes(tag))
}

// ========== PHASE 3: COMMUNITY FEATURES DATA ACCESS FUNCTIONS ==========

// Supported languages
export function getSupportedLanguages(): SupportedLanguage[] {
  return SUPPORTED_LANGUAGES
}

export function getLanguageByCode(code: string): SupportedLanguage | null {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || null
}

// Confusion submissions
export function getConfusionSubmissions(): ConfusionSubmission[] {
  return MOCK_CONFUSION_SUBMISSIONS
    .filter(s => s.status === 'approved' || s.status === 'in-progress')
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
}

export function getConfusionSubmissionById(submissionId: string): ConfusionSubmission | null {
  return MOCK_CONFUSION_SUBMISSIONS.find(s => s.id === submissionId) || null
}

export function getConfusionSubmissionsByCategory(category: string): ConfusionSubmission[] {
  return MOCK_CONFUSION_SUBMISSIONS
    .filter(s => (s.status === 'approved' || s.status === 'in-progress') && s.category === category)
    .sort((a, b) => b.upvotes - a.upvotes)
}

export function getTopConfusionSubmissions(limit: number = 5): ConfusionSubmission[] {
  return MOCK_CONFUSION_SUBMISSIONS
    .filter(s => s.status === 'approved' || s.status === 'in-progress')
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, limit)
}

export function getPendingConfusionSubmissions(): ConfusionSubmission[] {
  return MOCK_CONFUSION_SUBMISSIONS
    .filter(s => s.status === 'pending')
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
}

// Success stories
export function getSuccessStories(): SuccessStory[] {
  return MOCK_SUCCESS_STORIES
    .filter(s => s.isApproved)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getFeaturedSuccessStories(): SuccessStory[] {
  return MOCK_SUCCESS_STORIES
    .filter(s => s.isApproved && s.isFeatured)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getSuccessStoriesByLessonId(lessonId: string): SuccessStory[] {
  return MOCK_SUCCESS_STORIES
    .filter(s => s.isApproved && s.relatedLessonId === lessonId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getSuccessStoryById(storyId: string): SuccessStory | null {
  return MOCK_SUCCESS_STORIES.find(s => s.id === storyId) || null
}

export function getRecentSuccessStories(limit: number = 3): SuccessStory[] {
  return MOCK_SUCCESS_STORIES
    .filter(s => s.isApproved)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

// Expert Q&A
export function getExpertQnAByLessonId(lessonId: string): ExpertQnA | null {
  return MOCK_EXPERT_QNA.find(qa => qa.lessonId === lessonId && qa.isActive) || null
}

export function getExpertQnAById(qaId: string): ExpertQnA | null {
  return MOCK_EXPERT_QNA.find(qa => qa.id === qaId) || null
}

export function getActiveExpertQnA(): ExpertQnA[] {
  return MOCK_EXPERT_QNA.filter(qa => qa.isActive)
}

// Lesson translations
export function getLessonTranslation(lessonId: string, languageCode: string): LessonTranslation | null {
  return MOCK_LESSON_TRANSLATIONS
    .find(t => t.lessonId === lessonId && t.language === languageCode && t.isVerified) || null
}

export function getLessonTranslations(lessonId: string): LessonTranslation[] {
  return MOCK_LESSON_TRANSLATIONS.filter(t => t.lessonId === lessonId && t.isVerified)
}

export function getAvailableTranslationsForLesson(lessonId: string): string[] {
  return MOCK_LESSON_TRANSLATIONS
    .filter(t => t.lessonId === lessonId && t.isVerified)
    .map(t => t.language)
}

export function getLessonContentInLanguage(lessonId: string, languageCode: string): { title: string; content: string } | null {
  const lesson = getLessonById(lessonId)
  if (!lesson) return null

  const translation = getLessonTranslation(lessonId, languageCode)
  if (translation) {
    return {
      title: translation.title,
      content: translation.content
    }
  }

  // Return original English content if no translation available
  return {
    title: lesson.title,
    content: lesson.content
  }
}

// ========== PHASE 4: INSTRUCTOR SUBSCRIPTION DATA ACCESS FUNCTIONS ==========

// Mock instructor subscription data
const MOCK_INSTRUCTOR_SUBSCRIPTIONS: InstructorSubscription[] = [
  {
    id: 'sub_1',
    userId: 'instructor1',
    planId: 'PRO',
    status: 'ACTIVE',
    currentPeriodStart: '2025-01-01T00:00:00Z',
    currentPeriodEnd: '2026-01-01T00:00:00Z',
    razorpaySubscriptionId: 'sub_razorpay_123',
    cancelAtPeriodEnd: false,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'sub_2',
    userId: 'instructor2',
    planId: 'BASIC',
    status: 'ACTIVE',
    currentPeriodStart: '2025-01-15T00:00:00Z',
    currentPeriodEnd: '2025-02-15T00:00:00Z',
    cancelAtPeriodEnd: false,
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z'
  }
]

const MOCK_INSTRUCTOR_USAGE: InstructorUsage[] = [
  {
    userId: 'instructor1',
    courseCount: 3,
    liveSessionCount: 8,
    storageUsedGB: 25,
    totalStudents: 150,
    lastUpdated: '2025-01-20T00:00:00Z'
  },
  {
    userId: 'instructor2',
    courseCount: 2,
    liveSessionCount: 2,
    storageUsedGB: 3,
    totalStudents: 45,
    lastUpdated: '2025-01-20T00:00:00Z'
  }
]

export function getInstructorPlanById(planId: InstructorPlanType): InstructorPlan | null {
  return INSTRUCTOR_PLANS.find(plan => plan.id === planId) || null
}

export function getAllInstructorPlans(): InstructorPlan[] {
  return INSTRUCTOR_PLANS
}

export function getInstructorSubscription(userId: string): InstructorSubscription | null {
  return MOCK_INSTRUCTOR_SUBSCRIPTIONS.find(sub => sub.userId === userId && sub.status === 'ACTIVE') || null
}

export function getInstructorUsage(userId: string): InstructorUsage | null {
  return MOCK_INSTRUCTOR_USAGE.find(usage => usage.userId === userId) || null
}

export function canCreateCourse(userId: string): { allowed: boolean; reason?: string; currentCount: number; maxAllowed: number } {
  const subscription = getInstructorSubscription(userId)
  const usage = getInstructorUsage(userId)

  if (!subscription) {
    // Default to free tier
    const freePlan = INSTRUCTOR_PLANS.find(p => p.id === 'FREE')!
    const currentCount = usage?.courseCount || 0
    if (currentCount >= freePlan.limits.maxCourses) {
      return {
        allowed: false,
        reason: 'You have reached your course limit. Please upgrade your plan to create more courses.',
        currentCount,
        maxAllowed: freePlan.limits.maxCourses
      }
    }
    return { allowed: true, currentCount, maxAllowed: freePlan.limits.maxCourses }
  }

  const plan = INSTRUCTOR_PLANS.find(p => p.id === subscription.planId)!
  const currentCount = usage?.courseCount || 0
  const maxCourses = plan.limits.maxCourses

  if (maxCourses !== -1 && currentCount >= maxCourses) {
    return {
      allowed: false,
      reason: `You have reached your course limit (${maxCourses}). Please upgrade to create more courses.`,
      currentCount,
      maxAllowed: maxCourses
    }
  }

  return { allowed: true, currentCount, maxAllowed: maxCourses }
}

export function canCreateLiveSession(userId: string): { allowed: boolean; reason?: string; currentCount: number; maxAllowed: number } {
  const subscription = getInstructorSubscription(userId)
  const usage = getInstructorUsage(userId)

  if (!subscription) {
    // Default to free tier - no live sessions allowed
    const freePlan = INSTRUCTOR_PLANS.find(p => p.id === 'FREE')!
    const currentCount = usage?.liveSessionCount || 0
    return {
      allowed: false,
      reason: 'Live sessions are not available on the Free plan. Please upgrade to Basic or Pro to host live sessions.',
      currentCount,
      maxAllowed: freePlan.limits.maxLiveSessions
    }
  }

  const plan = INSTRUCTOR_PLANS.find(p => p.id === subscription.planId)!
  const currentCount = usage?.liveSessionCount || 0
  const maxSessions = plan.limits.maxLiveSessions

  if (maxSessions === -1) {
    return { allowed: true, currentCount, maxAllowed: -1 }
  }

  if (currentCount >= maxSessions) {
    return {
      allowed: false,
      reason: `You have reached your live session limit (${maxSessions}/month). Please upgrade or wait until next billing cycle.`,
      currentCount,
      maxAllowed: maxSessions
    }
  }

  return { allowed: true, currentCount, maxAllowed: maxSessions }
}

export function getInstructorSubscriptionStatus(userId: string): {
  plan: InstructorPlan | null
  subscription: InstructorSubscription | null
  usage: InstructorUsage | null
} {
  const subscription = getInstructorSubscription(userId)
  const plan = subscription ? getInstructorPlanById(subscription.planId) : getInstructorPlanById('FREE')
  const usage = getInstructorUsage(userId)

  return { plan, subscription, usage }
}