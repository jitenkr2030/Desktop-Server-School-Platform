import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Sample learning paths data for demo/fallback
const sampleLearningPaths = [
  {
    id: 'full-stack-web-development',
    title: 'Full-Stack Web Development',
    description: 'Master modern web development from frontend to backend with React, Node.js, and databases.',
    icon: '💻',
    color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    courseCount: 5,
    totalDuration: 2400,
    totalLessons: 180,
    previewCourses: [
      {
        id: 'html-css-fundamentals',
        title: 'HTML & CSS Fundamentals',
        description: 'Build the foundation of modern web pages',
        difficulty: 'Beginner',
        duration: 240,
        lessonCount: 20,
        instructor: { id: 'inst-1', name: 'Sarah Johnson', avatar: null }
      },
      {
        id: 'javascript-essentials',
        title: 'JavaScript Essentials',
        description: 'Learn JavaScript from scratch',
        difficulty: 'Beginner',
        duration: 360,
        lessonCount: 30,
        instructor: { id: 'inst-2', name: 'Mike Chen', avatar: null }
      },
      {
        id: 'react-mastery',
        title: 'React.js Mastery',
        description: 'Build dynamic single-page applications',
        difficulty: 'Intermediate',
        duration: 480,
        lessonCount: 40,
        instructor: { id: 'inst-1', name: 'Sarah Johnson', avatar: null }
      }
    ]
  },
  {
    id: 'data-science-machine-learning',
    title: 'Data Science & Machine Learning',
    description: 'Dive into data analysis, visualization, and predictive modeling with Python.',
    icon: '📊',
    color: 'bg-gradient-to-r from-green-500 to-teal-600',
    courseCount: 6,
    totalDuration: 3000,
    totalLessons: 220,
    previewCourses: [
      {
        id: 'python-programming',
        title: 'Python Programming',
        description: 'Learn Python from the ground up',
        difficulty: 'Beginner',
        duration: 300,
        lessonCount: 25,
        instructor: { id: 'inst-4', name: 'Emma Watson', avatar: null }
      },
      {
        id: 'data-analysis-pandas',
        title: 'Data Analysis with Pandas',
        description: 'Master data manipulation and analysis',
        difficulty: 'Intermediate',
        duration: 400,
        lessonCount: 32,
        instructor: { id: 'inst-4', name: 'Emma Watson', avatar: null }
      },
      {
        id: 'data-visualization',
        title: 'Data Visualization',
        description: 'Create compelling data visualizations',
        difficulty: 'Intermediate',
        duration: 350,
        lessonCount: 28,
        instructor: { id: 'inst-5', name: 'David Park', avatar: null }
      }
    ]
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Mastery',
    description: 'Learn to create effective marketing campaigns across multiple digital channels.',
    icon: '📈',
    color: 'bg-gradient-to-r from-purple-500 to-pink-600',
    courseCount: 4,
    totalDuration: 1200,
    totalLessons: 90,
    previewCourses: [
      {
        id: 'seo-fundamentals',
        title: 'SEO Fundamentals',
        description: 'Master search engine optimization',
        difficulty: 'Beginner',
        duration: 280,
        lessonCount: 22,
        instructor: { id: 'inst-7', name: 'Rachel Green', avatar: null }
      },
      {
        id: 'social-media-marketing',
        title: 'Social Media Marketing',
        description: 'Build engaged communities on social platforms',
        difficulty: 'Beginner',
        duration: 320,
        lessonCount: 25,
        instructor: { id: 'inst-8', name: 'Tom Harris', avatar: null }
      },
      {
        id: 'content-marketing',
        title: 'Content Marketing Strategy',
        description: 'Create compelling content that converts',
        difficulty: 'Intermediate',
        duration: 300,
        lessonCount: 24,
        instructor: { id: 'inst-7', name: 'Rachel Green', avatar: null }
      }
    ]
  },
  {
    id: 'cloud-computing-devops',
    title: 'Cloud Computing & DevOps',
    description: 'Master cloud platforms, containerization, and CI/CD pipelines.',
    icon: '☁️',
    color: 'bg-gradient-to-r from-orange-500 to-red-600',
    courseCount: 5,
    totalDuration: 2200,
    totalLessons: 165,
    previewCourses: [
      {
        id: 'cloud-foundations',
        title: 'Cloud Computing Foundations',
        description: 'Understand cloud concepts and services',
        difficulty: 'Beginner',
        duration: 350,
        lessonCount: 28,
        instructor: { id: 'inst-3', name: 'Alex Kumar', avatar: null }
      },
      {
        id: 'aws-essentials',
        title: 'AWS Essential Services',
        description: 'Master core AWS services',
        difficulty: 'Intermediate',
        duration: 450,
        lessonCount: 35,
        instructor: { id: 'inst-3', name: 'Alex Kumar', avatar: null }
      },
      {
        id: 'docker-kubernetes',
        title: 'Docker & Kubernetes',
        description: 'Container orchestration mastery',
        difficulty: 'Intermediate',
        duration: 500,
        lessonCount: 40,
        instructor: { id: 'inst-9', name: 'James Wilson', avatar: null }
      }
    ]
  },
  {
    id: 'mobile-app-development',
    title: 'Mobile App Development',
    description: 'Build cross-platform mobile apps with React Native and Flutter.',
    icon: '📱',
    color: 'bg-gradient-to-r from-cyan-500 to-blue-600',
    courseCount: 4,
    totalDuration: 1800,
    totalLessons: 140,
    previewCourses: [
      {
        id: 'react-native-basics',
        title: 'React Native Basics',
        description: 'Build your first mobile app',
        difficulty: 'Intermediate',
        duration: 400,
        lessonCount: 32,
        instructor: { id: 'inst-1', name: 'Sarah Johnson', avatar: null }
      },
      {
        id: 'react-native-advanced',
        title: 'Advanced React Native',
        description: 'Complex app development',
        difficulty: 'Advanced',
        duration: 450,
        lessonCount: 36,
        instructor: { id: 'inst-1', name: 'Sarah Johnson', avatar: null }
      },
      {
        id: 'flutter-intro',
        title: 'Flutter Introduction',
        description: 'Dart and Flutter fundamentals',
        difficulty: 'Intermediate',
        duration: 450,
        lessonCount: 36,
        instructor: { id: 'inst-2', name: 'Mike Chen', avatar: null }
      }
    ]
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    description: 'Learn to design beautiful, user-centered interfaces and experiences.',
    icon: '🎨',
    color: 'bg-gradient-to-r from-pink-500 to-rose-600',
    courseCount: 4,
    totalDuration: 1400,
    totalLessons: 110,
    previewCourses: [
      {
        id: 'design-principles',
        title: 'Design Principles',
        description: 'Core concepts of visual design',
        difficulty: 'Beginner',
        duration: 300,
        lessonCount: 24,
        instructor: { id: 'inst-10', name: 'Sophie Brown', avatar: null }
      },
      {
        id: 'figma-mastery',
        title: 'Figma Mastery',
        description: 'Professional UI design in Figma',
        difficulty: 'Beginner',
        duration: 350,
        lessonCount: 28,
        instructor: { id: 'inst-10', name: 'Sophie Brown', avatar: null }
      },
      {
        id: 'ux-research',
        title: 'UX Research Methods',
        description: 'Understand your users deeply',
        difficulty: 'Intermediate',
        duration: 350,
        lessonCount: 28,
        instructor: { id: 'inst-11', name: 'Chris Taylor', avatar: null }
      }
    ]
  },

  // ==================== CONFUSION REMOVERS LEARNING PATHS ====================
  {
    id: 'life-essentials',
    title: 'Life Essentials - Confusion Removers',
    description: 'Clear, practical understanding of everyday digital tools, money, and systems. Remove confusion from daily life.',
    icon: '💡',
    color: 'bg-gradient-to-r from-amber-500 to-orange-600',
    courseCount: 6,
    totalDuration: 405,
    totalLessons: 24,
    previewCourses: [
      {
        id: 'cr_digital',
        title: 'Digital & Smartphone Basics',
        description: 'Understand your phone without fear',
        difficulty: 'Beginner',
        duration: 60,
        lessonCount: 4,
        instructor: { id: 'instructor-3', name: 'Amit Patel', avatar: null }
      },
      {
        id: 'cr_upi',
        title: 'UPI, Banking & Digital Money',
        description: 'Stop fearing failed transactions',
        difficulty: 'Beginner',
        duration: 75,
        lessonCount: 4,
        instructor: { id: 'instructor-2', name: 'Priya Sharma', avatar: null }
      },
      {
        id: 'cr_fraud',
        title: 'Online Safety & Fraud Awareness',
        description: 'Protect yourself from online scams',
        difficulty: 'Beginner',
        duration: 90,
        lessonCount: 4,
        instructor: { id: 'instructor-2', name: 'Priya Sharma', avatar: null }
      }
    ]
  },
  {
    id: 'community-understanding',
    title: 'Community Understanding',
    description: 'Understanding how communities, organizations, and social systems work. Learn about NGOs, Panchayats, and community support.',
    icon: '👥',
    color: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    courseCount: 3,
    totalDuration: 135,
    totalLessons: 12,
    previewCourses: [
      {
        id: 'cr_bulk',
        title: 'Community Bulk Buying Model',
        description: 'Understanding pooling and community purchasing',
        difficulty: 'Beginner',
        duration: 45,
        lessonCount: 4,
        instructor: { id: 'instructor-7', name: 'Rahul Mehta', avatar: null }
      },
      {
        id: 'cr_foodwork',
        title: 'Food-for-Work Model',
        description: 'Dignity-based community support',
        difficulty: 'Beginner',
        duration: 45,
        lessonCount: 4,
        instructor: { id: 'instructor-7', name: 'Rahul Mehta', avatar: null }
      },
      {
        id: 'cr_community',
        title: 'How Community Systems Work',
        description: 'NGOs, Panchayats, CSR made clear',
        difficulty: 'Beginner',
        duration: 45,
        lessonCount: 4,
        instructor: { id: 'instructor-7', name: 'Rahul Mehta', avatar: null }
      }
    ]
  }
]

// GET /api/learning-paths - Get all learning paths
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pathId = searchParams.get('id')
    const useDemo = searchParams.get('demo') === 'true'

    // Use sample data if demo mode is requested
    if (useDemo) {
      return NextResponse.json({
        success: true,
        learningPaths: sampleLearningPaths
      })
    }

    let learningPathsData: any[] = []

    if (pathId) {
      // Get a specific learning path with its courses
      const learningPath = await db.learningPath.findUnique({
        where: { id: pathId },
        include: {
          courses: {
            where: { isActive: true },
            orderBy: { createdAt: 'asc' },
            include: {
              instructor: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              },
              _count: {
                select: {
                  lessons: true
                }
              }
            }
          },
          _count: {
            select: {
              courses: true
            }
          }
        }
      })

      if (!learningPath) {
        // Fallback to sample data
        const samplePath = sampleLearningPaths.find(p => p.id === pathId)
        if (samplePath) {
          // Transform sample path to match expected format
          const fullPath = {
            ...samplePath,
            isActive: true,
            sortOrder: 0,
            courses: samplePath.previewCourses.map(course => ({
              ...course,
              isActive: true,
              thumbnail: null,
              _count: { lessons: course.lessonCount || 0 }
            }))
          }
          return NextResponse.json({
            success: true,
            learningPath: fullPath
          })
        }
        return NextResponse.json(
          { success: false, message: 'Learning path not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        learningPath: {
          ...learningPath,
          courseCount: learningPath.courses.length
        }
      })
    }

    // Get all learning paths with preview courses
    const learningPaths = await db.learningPath.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: {
            courses: true
          }
        },
        courses: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
          take: 3,
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            },
            _count: {
              select: {
                lessons: true
              }
            }
          }
        }
      }
    })

    // Transform the response
    learningPathsData = learningPaths.map(path => {
      const totalDuration = path.courses.reduce((sum: number, course: any) => sum + course.duration, 0)
      const totalLessons = path.courses.reduce((sum: number, course: any) => sum + course._count.lessons, 0)

      return {
        id: path.id,
        title: path.title,
        description: path.description,
        icon: path.icon,
        color: path.color,
        sortOrder: path.sortOrder,
        isActive: path.isActive,
        courseCount: path._count.courses,
        totalDuration,
        totalLessons,
        previewCourses: path.courses.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          difficulty: course.difficulty,
          duration: course.duration,
          thumbnail: course.thumbnail,
          lessonCount: course._count.lessons,
          instructor: course.instructor
        }))
      }
    })

    // If no data found in database, use sample data
    if (learningPathsData.length === 0) {
      learningPathsData = sampleLearningPaths
    }

    // If still no data or only sample data, try to fetch LearningPathCategory as fallback
    if (learningPathsData.length === 0 || learningPathsData.every(path => path.id.startsWith('sample-'))) {
      try {
        const categories = await db.learningPathCategory.findMany({
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            _count: {
              select: { learningPaths: true }
            }
          }
        })

        if (categories.length > 0) {
          // Transform LearningPathCategory into LearningPath format
          const categoryPaths = categories.map((cat: any) => ({
            id: cat.id,
            title: cat.name,
            description: cat.description || `Explore ${cat.name} courses and learning paths`,
            icon: cat.icon || '📚',
            color: cat.color || 'bg-gradient-to-r from-blue-500 to-indigo-600',
            sortOrder: cat.sortOrder,
            isActive: cat.isActive,
            isCategory: true, // Flag to identify these are categories, not traditional learning paths
            courseCount: cat._count.learningPaths,
            totalDuration: 0,
            totalLessons: 0,
            previewCourses: []
          }))

          learningPathsData = categoryPaths
        }
      } catch (categoryError) {
        console.error('Error fetching LearningPathCategory as fallback:', categoryError)
      }
    }

    // If specific pathId was requested but not found in DB, try sample data
    if (pathId && learningPathsData.length === 1 && !learningPathsData[0].courses) {
      const samplePath = sampleLearningPaths.find(p => p.id === pathId)
      if (samplePath) {
        const fullPath = {
          ...samplePath,
          isActive: true,
          sortOrder: 0,
          courses: samplePath.previewCourses.map(course => ({
            ...course,
            isActive: true,
            thumbnail: null,
            _count: { lessons: course.lessonCount || 0 }
          }))
        }
        return NextResponse.json({
          success: true,
          learningPath: fullPath
        })
      }
    }

    return NextResponse.json({
      success: true,
      learningPaths: learningPathsData
    })

  } catch (error) {
    console.error('Get learning paths error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
