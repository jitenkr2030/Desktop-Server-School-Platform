import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret } = body

    // Simple secret key protection
    if (secret !== process.env.seed_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Invalid secret key' },
        { status: 401 }
      )
    }

    console.log('🌱 Starting database seeding...')

    // Clear existing data in correct order (respecting foreign keys)
    await prisma.userBadge.deleteMany()
    await prisma.certificate.deleteMany()
    await prisma.paymentRecord.deleteMany()
    await prisma.discussionReply.deleteMany()
    await prisma.discussion.deleteMany()
    await prisma.userAssessment.deleteMany()
    await prisma.assessmentQuestion.deleteMany()
    await prisma.assessment.deleteMany()
    await prisma.courseProgress.deleteMany()
    await prisma.lesson.deleteMany()
    await prisma.subCategoryStats.deleteMany()
    await prisma.categoryStats.deleteMany()
    await prisma.course.deleteMany()
    await prisma.instructor.deleteMany()
    await prisma.subCategory.deleteMany()
    await prisma.category.deleteMany()
    await prisma.learningPath.deleteMany()
    await prisma.skillBadge.deleteMany()
    await prisma.subscription.deleteMany()
    await prisma.user.deleteMany()

    console.log('🗑️ Cleared existing data')

    // Create Users with hashed passwords
    const hashedPassword = await bcrypt.hash('password123', 10)
    const users = await Promise.all([
      prisma.user.create({
        data: {
          id: 'admin',
          mobileNumber: '+919876543210',
          email: 'admin@inr99.academy',
          name: 'Admin User',
          password: hashedPassword,
          isActive: true,
        },
      }),
      prisma.user.create({
        data: {
          id: 'user1',
          mobileNumber: '+919876543211',
          email: 'rahul@example.com',
          name: 'Rahul Sharma',
          password: hashedPassword,
          isActive: true,
        },
      }),
      prisma.user.create({
        data: {
          id: 'user2',
          mobileNumber: '+919876543212',
          email: 'priya@example.com',
          name: 'Priya Patel',
          password: hashedPassword,
          isActive: true,
        },
      }),
      prisma.user.create({
        data: {
          id: 'user3',
          mobileNumber: '+919876543213',
          email: 'amit@example.com',
          name: 'Amit Kumar',
          password: hashedPassword,
          isActive: true,
        },
      }),
    ])

    // Create Instructors
    const instructors = await Promise.all([
      prisma.instructor.create({
        data: {
          id: 'inst1',
          name: 'Dr. Ananya Reddy',
          bio: 'PhD in Computer Science with 15+ years of industry experience',
          expertise: JSON.stringify(['Web Development', 'JavaScript', 'React', 'Node.js']),
          isActive: true,
        },
      }),
      prisma.instructor.create({
        data: {
          id: 'inst2',
          name: 'Rajesh Kumar',
          bio: 'Senior UI/UX Designer with 10+ years of experience',
          expertise: JSON.stringify(['UI Design', 'UX Research', 'Figma', 'Adobe Creative Suite']),
          isActive: true,
        },
      }),
      prisma.instructor.create({
        data: {
          id: 'inst3',
          name: 'Sunita Menon',
          bio: 'Finance expert with 20+ years in banking and investment',
          expertise: JSON.stringify(['Finance', 'Investment', 'Banking', 'Personal Finance']),
          isActive: true,
        },
      }),
      prisma.instructor.create({
        data: {
          id: 'inst4',
          name: 'Vikram Singh',
          bio: 'Business consultant and entrepreneur',
          expertise: JSON.stringify(['Business Strategy', 'Marketing', 'Leadership', 'Startup']),
          isActive: true,
        },
      }),
    ])

    // Create Categories
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          id: 'cat1',
          name: 'Programming',
          slug: 'programming',
          description: 'Learn various programming languages and development frameworks',
          icon: 'BookOpen',
          color: 'bg-blue-100',
          isFeatured: true,
          sortOrder: 1,
          isActive: true,
        },
      }),
      prisma.category.create({
        data: {
          id: 'cat2',
          name: 'Design',
          slug: 'design',
          description: 'UI/UX design, graphic design, and creative skills',
          icon: 'FolderOpen',
          color: 'bg-purple-100',
          isFeatured: true,
          sortOrder: 2,
          isActive: true,
        },
      }),
      prisma.category.create({
        data: {
          id: 'cat3',
          name: 'Business & Finance',
          slug: 'business-finance',
          description: 'Business skills, finance, and entrepreneurship',
          icon: 'TrendingUp',
          color: 'bg-green-100',
          isFeatured: true,
          sortOrder: 3,
          isActive: true,
        },
      }),
      prisma.category.create({
        data: {
          id: 'cat4',
          name: 'Data Science',
          slug: 'data-science',
          description: 'Data analysis, machine learning, and AI',
          icon: 'BarChart3',
          color: 'bg-orange-100',
          isFeatured: false,
          sortOrder: 4,
          isActive: true,
        },
      }),
      prisma.category.create({
        data: {
          id: 'cat5',
          name: 'Digital Marketing',
          slug: 'digital-marketing',
          description: 'SEO, social media, and online marketing strategies',
          icon: 'Megaphone',
          color: 'bg-pink-100',
          isFeatured: false,
          sortOrder: 5,
          isActive: true,
        },
      }),
    ])

    // Create SubCategories
    const subCategories = await Promise.all([
      prisma.subCategory.create({
        data: {
          id: 'sub1',
          name: 'Web Development',
          slug: 'web-development',
          description: 'Frontend and backend web development',
          icon: 'Code',
          color: 'bg-blue-200',
          categoryId: 'cat1',
          sortOrder: 1,
          isActive: true,
        },
      }),
      prisma.subCategory.create({
        data: {
          id: 'sub2',
          name: 'Mobile Development',
          slug: 'mobile-development',
          description: 'iOS and Android app development',
          icon: 'Smartphone',
          color: 'bg-blue-200',
          categoryId: 'cat1',
          sortOrder: 2,
          isActive: true,
        },
      }),
      prisma.subCategory.create({
        data: {
          id: 'sub3',
          name: 'Database & SQL',
          slug: 'database-sql',
          description: 'Database design and SQL programming',
          icon: 'Database',
          color: 'bg-blue-200',
          categoryId: 'cat1',
          sortOrder: 3,
          isActive: true,
        },
      }),
      prisma.subCategory.create({
        data: {
          id: 'sub4',
          name: 'UI Design',
          slug: 'ui-design',
          description: 'User interface design principles',
          icon: 'Palette',
          color: 'bg-purple-200',
          categoryId: 'cat2',
          sortOrder: 1,
          isActive: true,
        },
      }),
      prisma.subCategory.create({
        data: {
          id: 'sub5',
          name: 'UX Research',
          slug: 'ux-research',
          description: 'User experience research and testing',
          icon: 'Search',
          color: 'bg-purple-200',
          categoryId: 'cat2',
          sortOrder: 2,
          isActive: true,
        },
      }),
      prisma.subCategory.create({
        data: {
          id: 'sub6',
          name: 'Personal Finance',
          slug: 'personal-finance',
          description: 'Personal financial planning and management',
          icon: 'PiggyBank',
          color: 'bg-green-200',
          categoryId: 'cat3',
          sortOrder: 1,
          isActive: true,
        },
      }),
      prisma.subCategory.create({
        data: {
          id: 'sub7',
          name: 'Business Strategy',
          slug: 'business-strategy',
          description: 'Strategic business planning and execution',
          icon: 'Target',
          color: 'bg-green-200',
          categoryId: 'cat3',
          sortOrder: 2,
          isActive: true,
        },
      }),
    ])

    // Create Learning Paths
    const learningPaths = await Promise.all([
      prisma.learningPath.create({
        data: {
          id: 'lp1',
          title: 'Full Stack Web Development',
          description: 'Complete journey from beginner to full stack developer',
          icon: 'Code',
          color: 'bg-blue-100',
          sortOrder: 1,
          isActive: true,
        },
      }),
      prisma.learningPath.create({
        data: {
          id: 'lp2',
          title: 'UI/UX Design Mastery',
          description: 'Master the art of user interface and experience design',
          icon: 'Palette',
          color: 'bg-purple-100',
          sortOrder: 2,
          isActive: true,
        },
      }),
      prisma.learningPath.create({
        data: {
          id: 'lp3',
          title: 'Financial Literacy',
          description: 'Complete guide to personal finance and investment',
          icon: 'PiggyBank',
          color: 'bg-green-100',
          sortOrder: 3,
          isActive: true,
        },
      }),
    ])

    // Create Courses
    const courses = await Promise.all([
      prisma.course.create({
        data: {
          id: 'course1',
          title: 'HTML & CSS Fundamentals',
          description: 'Learn the building blocks of web development with HTML and CSS',
          difficulty: 'BEGINNER',
          duration: 180,
          isActive: true,
          instructorId: 'inst1',
          categoryId: 'cat1',
          subCategoryId: 'sub1',
          learningPathId: 'lp1',
        },
      }),
      prisma.course.create({
        data: {
          id: 'course2',
          title: 'JavaScript Programming',
          description: 'Master JavaScript programming from basics to advanced concepts',
          difficulty: 'BEGINNER',
          duration: 240,
          isActive: true,
          instructorId: 'inst1',
          categoryId: 'cat1',
          subCategoryId: 'sub1',
          learningPathId: 'lp1',
        },
      }),
      prisma.course.create({
        data: {
          id: 'course3',
          title: 'React Development',
          description: 'Build modern web applications with React',
          difficulty: 'INTERMEDIATE',
          duration: 300,
          isActive: true,
          instructorId: 'inst1',
          categoryId: 'cat1',
          subCategoryId: 'sub1',
          learningPathId: 'lp1',
        },
      }),
      prisma.course.create({
        data: {
          id: 'course4',
          title: 'Node.js Backend Development',
          description: 'Create server-side applications with Node.js and Express',
          difficulty: 'INTERMEDIATE',
          duration: 280,
          isActive: true,
          instructorId: 'inst1',
          categoryId: 'cat1',
          subCategoryId: 'sub1',
          learningPathId: 'lp1',
        },
      }),
      prisma.course.create({
        data: {
          id: 'course5',
          title: 'Android App Development',
          description: 'Build native Android applications with Kotlin',
          difficulty: 'INTERMEDIATE',
          duration: 320,
          isActive: true,
          instructorId: 'inst1',
          categoryId: 'cat1',
          subCategoryId: 'sub2',
        },
      }),
      prisma.course.create({
        data: {
          id: 'course6',
          title: 'UI Design Principles',
          description: 'Learn fundamental principles of user interface design',
          difficulty: 'BEGINNER',
          duration: 150,
          isActive: true,
          instructorId: 'inst2',
          categoryId: 'cat2',
          subCategoryId: 'sub4',
          learningPathId: 'lp2',
        },
      }),
      prisma.course.create({
        data: {
          id: 'course7',
          title: 'Figma for Designers',
          description: 'Master Figma for UI/UX design',
          difficulty: 'BEGINNER',
          duration: 200,
          isActive: true,
          instructorId: 'inst2',
          categoryId: 'cat2',
          subCategoryId: 'sub4',
          learningPathId: 'lp2',
        },
      }),
      prisma.course.create({
        data: {
          id: 'course8',
          title: 'UX Research Methods',
          description: 'Learn user research techniques and methodologies',
          difficulty: 'INTERMEDIATE',
          duration: 180,
          isActive: true,
          instructorId: 'inst2',
          categoryId: 'cat2',
          subCategoryId: 'sub5',
          learningPathId: 'lp2',
        },
      }),
      prisma.course.create({
        data: {
          id: 'course9',
          title: 'Personal Finance Basics',
          description: 'Essential personal finance management skills',
          difficulty: 'BEGINNER',
          duration: 120,
          isActive: true,
          instructorId: 'inst3',
          categoryId: 'cat3',
          subCategoryId: 'sub6',
          learningPathId: 'lp3',
        },
      }),
      prisma.course.create({
        data: {
          id: 'course10',
          title: 'Investment Fundamentals',
          description: 'Learn the basics of investing in stocks, bonds, and mutual funds',
          difficulty: 'INTERMEDIATE',
          duration: 200,
          isActive: true,
          instructorId: 'inst3',
          categoryId: 'cat3',
          subCategoryId: 'sub6',
          learningPathId: 'lp3',
        },
      }),
      prisma.course.create({
        data: {
          id: 'course11',
          title: 'Business Strategy 101',
          description: 'Fundamental concepts of business strategy',
          difficulty: 'INTERMEDIATE',
          duration: 160,
          isActive: true,
          instructorId: 'inst4',
          categoryId: 'cat3',
          subCategoryId: 'sub7',
        },
      }),
    ])

    // Create Lessons
    const lessons = await Promise.all([
      prisma.lesson.create({
        data: {
          id: 'lesson1',
          courseId: 'course1',
          title: 'Introduction to HTML',
          content: 'Learn the basics of HTML structure and syntax',
          duration: 15,
          order: 1,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson2',
          courseId: 'course1',
          title: 'HTML Elements and Attributes',
          content: 'Understanding HTML elements, attributes, and their usage',
          duration: 20,
          order: 2,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson3',
          courseId: 'course1',
          title: 'CSS Fundamentals',
          content: 'Introduction to CSS and styling web pages',
          duration: 25,
          order: 3,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson4',
          courseId: 'course1',
          title: 'CSS Layouts',
          content: 'Learn about CSS layouts including Flexbox and Grid',
          duration: 30,
          order: 4,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson5',
          courseId: 'course2',
          title: 'JavaScript Basics',
          content: 'Introduction to JavaScript programming',
          duration: 20,
          order: 1,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson6',
          courseId: 'course2',
          title: 'Variables and Data Types',
          content: 'Understanding JavaScript variables and data types',
          duration: 25,
          order: 2,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson7',
          courseId: 'course2',
          title: 'Functions and Scope',
          content: 'Learn about JavaScript functions and variable scope',
          duration: 30,
          order: 3,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson8',
          courseId: 'course6',
          title: 'Introduction to UI Design',
          content: 'Learn the fundamentals of User Interface design',
          duration: 15,
          order: 1,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson9',
          courseId: 'course6',
          title: 'Color Theory',
          content: 'Understanding color theory in design',
          duration: 20,
          order: 2,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson10',
          courseId: 'course6',
          title: 'Typography',
          content: 'Learn about typography and font selection',
          duration: 18,
          order: 3,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson11',
          courseId: 'course9',
          title: 'Introduction to Personal Finance',
          content: 'Understanding the importance of personal finance',
          duration: 12,
          order: 1,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson12',
          courseId: 'course9',
          title: 'Budgeting Basics',
          content: 'Learn how to create and maintain a budget',
          duration: 18,
          order: 2,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson13',
          courseId: 'course9',
          title: 'Saving Strategies',
          content: 'Effective saving strategies for financial goals',
          duration: 15,
          order: 3,
          isActive: true,
        },
      }),
    ])

    // Create Assessments
    const assessments = await Promise.all([
      prisma.assessment.create({
        data: {
          id: 'assess1',
          courseId: 'course1',
          title: 'HTML & CSS Basics Quiz',
          type: 'QUIZ',
          isActive: true,
        },
      }),
      prisma.assessment.create({
        data: {
          id: 'assess2',
          courseId: 'course2',
          title: 'JavaScript Fundamentals Quiz',
          type: 'QUIZ',
          isActive: true,
        },
      }),
      prisma.assessment.create({
        data: {
          id: 'assess3',
          courseId: 'course6',
          title: 'UI Design Principles Quiz',
          type: 'QUIZ',
          isActive: true,
        },
      }),
    ])

    // Create Assessment Questions
    await Promise.all([
      prisma.assessmentQuestion.create({
        data: {
          id: 'q1',
          assessmentId: 'assess1',
          question: 'What does HTML stand for?',
          type: 'MULTIPLE_CHOICE',
          options: JSON.stringify([
            'Hyper Text Markup Language',
            'High Tech Modern Language',
            'Home Tool Markup Language',
            'Hyperlink and Text Markup Language'
          ]),
          correctAnswer: 'Hyper Text Markup Language',
          explanation: 'HTML stands for Hyper Text Markup Language',
          order: 1,
        },
      }),
      prisma.assessmentQuestion.create({
        data: {
          id: 'q2',
          assessmentId: 'assess1',
          question: 'Which CSS property is used to change the text color?',
          type: 'MULTIPLE_CHOICE',
          options: JSON.stringify([
            'text-color',
            'font-color',
            'color',
            'text-style'
          ]),
          correctAnswer: 'color',
          explanation: 'The color property is used to change the text color in CSS',
          order: 2,
        },
      }),
      prisma.assessmentQuestion.create({
        data: {
          id: 'q3',
          assessmentId: 'assess2',
          question: 'What is the correct way to declare a variable in JavaScript?',
          type: 'MULTIPLE_CHOICE',
          options: JSON.stringify([
            'variable myVar;',
            'var myVar;',
            'v myVar;',
            'declare myVar;'
          ]),
          correctAnswer: 'var myVar;',
          explanation: 'The correct way to declare a variable in JavaScript is using the var keyword',
          order: 1,
        },
      }),
    ])

    // Create Discussions
    const discussions = await Promise.all([
      prisma.discussion.create({
        data: {
          id: 'disc1',
          courseId: 'course1',
          userId: 'user1',
          title: 'Help with CSS Flexbox layout',
          content: 'I\'m having trouble understanding CSS Flexbox. Can someone explain the main concepts?',
          isPinned: true,
          isActive: true,
        },
      }),
      prisma.discussion.create({
        data: {
          id: 'disc2',
          courseId: 'course2',
          userId: 'user2',
          title: 'Best practices for JavaScript functions',
          content: 'What are the best practices for writing clean JavaScript functions?',
          isPinned: false,
          isActive: true,
        },
      }),
      prisma.discussion.create({
        data: {
          id: 'disc3',
          courseId: 'course6',
          userId: 'user3',
          title: 'Color theory in modern UI design',
          content: 'How important is color theory in modern UI design? Any resources to learn more?',
          isPinned: false,
          isActive: true,
        },
      }),
    ])

    // Create Discussion Replies
    await Promise.all([
      prisma.discussionReply.create({
        data: {
          id: 'reply1',
          discussionId: 'disc1',
          userId: 'user2',
          content: 'Flexbox is all about flexible box layouts. The main concepts are flex container, flex items, and various properties like justify-content and align-items.',
        },
      }),
      prisma.discussionReply.create({
        data: {
          id: 'reply2',
          discussionId: 'disc1',
          userId: 'user3',
          content: 'I recommend checking out CSS Tricks guide on Flexbox. It has great examples!',
        },
      }),
      prisma.discussionReply.create({
        data: {
          id: 'reply3',
          discussionId: 'disc2',
          userId: 'user1',
          content: 'Some best practices: use meaningful function names, keep functions small and focused, and use proper error handling.',
        },
      }),
    ])

    // Create Subscriptions
    await Promise.all([
      prisma.subscription.create({
        data: {
          id: 'sub1',
          userId: 'user1',
          type: 'MONTHLY',
          status: 'ACTIVE',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-02-01'),
          autoRenew: true,
        },
      }),
      prisma.subscription.create({
        data: {
          id: 'sub2',
          userId: 'user2',
          type: 'YEARLY',
          status: 'ACTIVE',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2025-01-15'),
          autoRenew: true,
        },
      }),
    ])

    // Create Course Progress
    await Promise.all([
      prisma.courseProgress.create({
        data: {
          id: 'progress1',
          userId: 'user1',
          courseId: 'course1',
          lessonId: 'lesson2',
          completed: false,
          progress: 50,
          timeSpent: 90,
          lastAccess: new Date(),
        },
      }),
      prisma.courseProgress.create({
        data: {
          id: 'progress2',
          userId: 'user2',
          courseId: 'course2',
          lessonId: 'lesson6',
          completed: false,
          progress: 33,
          timeSpent: 75,
          lastAccess: new Date(),
        },
      }),
    ])

    // Create User Assessments
    await Promise.all([
      prisma.userAssessment.create({
        data: {
          id: 'userAssess1',
          userId: 'user1',
          assessmentId: 'assess1',
          score: 85,
          answers: JSON.stringify({
            q1: 'Hyper Text Markup Language',
            q2: 'color'
          }),
          completedAt: new Date(),
        },
      }),
    ])

    // Create Skill Badges
    const skillBadges = await Promise.all([
      prisma.skillBadge.create({
        data: {
          id: 'badge1',
          name: 'HTML Basics',
          description: 'Completed HTML fundamentals course',
          criteria: JSON.stringify({ courseCompletion: 'course1', minScore: 80 }),
          isActive: true,
        },
      }),
      prisma.skillBadge.create({
        data: {
          id: 'badge2',
          name: 'JavaScript Beginner',
          description: 'Started JavaScript programming journey',
          criteria: JSON.stringify({ courseStart: 'course2' }),
          isActive: true,
        },
      }),
      prisma.skillBadge.create({
        data: {
          id: 'badge3',
          name: 'UI Design Novice',
          description: 'Exploring UI design principles',
          criteria: JSON.stringify({ courseStart: 'course6' }),
          isActive: true,
        },
      }),
    ])

    // Create User Badges
    await Promise.all([
      prisma.userBadge.create({
        data: {
          id: 'userBadge1',
          userId: 'user1',
          badgeId: 'badge1',
        },
      }),
      prisma.userBadge.create({
        data: {
          id: 'userBadge2',
          userId: 'user2',
          badgeId: 'badge2',
        },
      }),
    ])

    // Create Payment Records
    await Promise.all([
      prisma.paymentRecord.create({
        data: {
          id: 'pay1',
          userId: 'user1',
          type: 'SUBSCRIPTION',
          amount: 99,
          currency: 'INR',
          status: 'COMPLETED',
          paymentId: 'pay_123456',
        },
      }),
      prisma.paymentRecord.create({
        data: {
          id: 'pay2',
          userId: 'user2',
          type: 'SUBSCRIPTION',
          amount: 1188,
          currency: 'INR',
          status: 'COMPLETED',
          paymentId: 'pay_789012',
        },
      }),
    ])

    // Create Category Stats
    await Promise.all([
      prisma.categoryStats.create({
        data: {
          categoryId: 'cat1',
          courseCount: 5,
          studentCount: 150,
          totalDuration: 1340,
          avgRating: 4.5,
          revenue: 14850,
        },
      }),
      prisma.categoryStats.create({
        data: {
          categoryId: 'cat2',
          courseCount: 3,
          studentCount: 89,
          totalDuration: 530,
          avgRating: 4.7,
          revenue: 8799,
        },
      }),
      prisma.categoryStats.create({
        data: {
          categoryId: 'cat3',
          courseCount: 3,
          studentCount: 67,
          totalDuration: 480,
          avgRating: 4.3,
          revenue: 6633,
        },
      }),
      prisma.categoryStats.create({
        data: {
          categoryId: 'cat4',
          courseCount: 0,
          studentCount: 0,
          totalDuration: 0,
          avgRating: 0,
          revenue: 0,
        },
      }),
      prisma.categoryStats.create({
        data: {
          categoryId: 'cat5',
          courseCount: 0,
          studentCount: 0,
          totalDuration: 0,
          avgRating: 0,
          revenue: 0,
        },
      }),
    ])

    // Create SubCategory Stats
    await Promise.all([
      prisma.subCategoryStats.create({
        data: {
          subCategoryId: 'sub1',
          courseCount: 4,
          studentCount: 134,
          totalDuration: 1100,
          avgRating: 4.6,
          revenue: 13266,
        },
      }),
      prisma.subCategoryStats.create({
        data: {
          subCategoryId: 'sub2',
          courseCount: 1,
          studentCount: 16,
          totalDuration: 320,
          avgRating: 4.2,
          revenue: 1584,
        },
      }),
      prisma.subCategoryStats.create({
        data: {
          subCategoryId: 'sub3',
          courseCount: 0,
          studentCount: 0,
          totalDuration: 0,
          avgRating: 0,
          revenue: 0,
        },
      }),
      prisma.subCategoryStats.create({
        data: {
          subCategoryId: 'sub4',
          courseCount: 2,
          studentCount: 56,
          totalDuration: 350,
          avgRating: 4.8,
          revenue: 5544,
        },
      }),
      prisma.subCategoryStats.create({
        data: {
          subCategoryId: 'sub5',
          courseCount: 1,
          studentCount: 33,
          totalDuration: 180,
          avgRating: 4.5,
          revenue: 3255,
        },
      }),
      prisma.subCategoryStats.create({
        data: {
          subCategoryId: 'sub6',
          courseCount: 2,
          studentCount: 45,
          totalDuration: 320,
          avgRating: 4.4,
          revenue: 4455,
        },
      }),
      prisma.subCategoryStats.create({
        data: {
          subCategoryId: 'sub7',
          courseCount: 1,
          studentCount: 22,
          totalDuration: 160,
          avgRating: 4.1,
          revenue: 2178,
        },
      }),
    ])

    // Create Certificates
    await Promise.all([
      prisma.certificate.create({
        data: {
          id: 'cert1',
          userId: 'user1',
          courseId: 'course1',
          certificateNumber: 'CERT2024001',
          verified: false,
        },
      }),
    ])

    console.log('✅ Database seeded successfully!')

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        users: users.length,
        instructors: instructors.length,
        categories: categories.length,
        subCategories: subCategories.length,
        learningPaths: learningPaths.length,
        courses: courses.length,
        lessons: lessons.length,
        assessments: assessments.length,
        discussions: discussions.length,
        skillBadges: skillBadges.length,
      },
    })

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    return NextResponse.json(
      { success: false, message: 'Error seeding database', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to seed the database',
    required: {
      secret: 'Your_seed_SECRET_value',
    },
  })
}
