const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with courses and lessons...')

  try {
    // Create Learning Paths
    const learningPaths = await Promise.all([
      prisma.learningPath.create({
        data: {
          id: 'lp1',
          title: 'Full Stack Web Development',
          description: 'Complete journey from beginner to full stack developer. Learn HTML, CSS, JavaScript, React, Node.js, and databases.',
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
          description: 'Master the art of user interface and experience design. From design principles to advanced prototyping.',
          icon: 'Palette',
          color: 'bg-purple-100',
          sortOrder: 2,
          isActive: true,
        },
      }),
      prisma.learningPath.create({
        data: {
          id: 'lp3',
          title: 'Financial Literacy & Investment',
          description: 'Complete guide to personal finance, investing, and wealth building for Indian investors.',
          icon: 'PiggyBank',
          color: 'bg-green-100',
          sortOrder: 3,
          isActive: true,
        },
      }),
      prisma.learningPath.create({
        data: {
          id: 'lp4',
          title: 'Data Science & Machine Learning',
          description: 'From data analysis to machine learning. Learn Python, statistics, and ML algorithms.',
          icon: 'Brain',
          color: 'bg-orange-100',
          sortOrder: 4,
          isActive: true,
        },
      }),
      prisma.learningPath.create({
        data: {
          id: 'lp5',
          title: 'Digital Marketing Pro',
          description: 'Master digital marketing channels, SEO, social media, and online advertising.',
          icon: 'Megaphone',
          color: 'bg-pink-100',
          sortOrder: 5,
          isActive: true,
        },
      }),
    ])

    // Create Courses
    const courses = await Promise.all([
      // Web Development Courses
      prisma.course.create({
        data: {
          id: 'course1',
          title: 'HTML & CSS Fundamentals',
          description: 'Learn the building blocks of web development with HTML5 and CSS3. Build responsive websites from scratch.',
          thumbnail: 'https://images.unsplash.com/photo-5069828223272-3f7e6b452238?w=400&h=250&fit=crop',
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
          title: 'JavaScript Programming Mastery',
          description: 'Master JavaScript programming from basics to advanced concepts including ES6+, async programming, and DOM manipulation.',
          thumbnail: 'https://images.unsplash.com/photo-5069828223272-3f7e6b452238?w=400&h=250&fit=crop',
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
          title: 'React Development Bootcamp',
          description: 'Build modern web applications with React. Learn components, hooks, state management, and routing.',
          thumbnail: 'https://images.unsplash.com/photo-5069828223272-3f7e6b452238?w=400&h=250&fit=crop',
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
          title: 'Node.js & Express Backend',
          description: 'Create server-side applications with Node.js and Express. Learn APIs, databases, and authentication.',
          thumbnail: 'https://images.unsplash.com/photo-5069828223272-3f7e6b452238?w=400&h=250&fit=crop',
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
          title: 'Android App Development with Kotlin',
          description: 'Build native Android applications with Kotlin. Learn UI design, APIs, and app publishing.',
          thumbnail: 'https://images.unsplash.com/photo-5069828223272-3f7e6b452238?w=400&h=250&fit=crop',
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
          title: 'Python Programming for Beginners',
          description: 'Learn Python programming from scratch. Perfect for data science, web development, and automation.',
          thumbnail: 'https://images.unsplash.com/photo-5069828223272-3f7e6b452238?w=400&h=250&fit=crop',
          difficulty: 'BEGINNER',
          duration: 200,
          isActive: true,
          instructorId: 'inst1',
          categoryId: 'cat1',
          subCategoryId: 'sub4',
          learningPathId: 'lp4',
        },
      }),

      // Design Courses
      prisma.course.create({
        data: {
          id: 'course7',
          title: 'UI Design Principles & Practices',
          description: 'Learn fundamental principles of user interface design. Master color theory, typography, and layout.',
          thumbnail: 'https://images.unsplash.com/photo-5069828223272-3f7e6b452238?w=400&h=250&fit=crop',
          difficulty: 'BEGINNER',
          duration: 150,
          isActive: true,
          instructorId: 'inst2',
          categoryId: 'cat2',
          subCategoryId: 'sub5',
          learningPathId: 'lp2',
        },
      }),
      prisma.course.create({
        data: {
          id: 'course8',
          title: 'Figma for UI/UX Design',
          description: 'Master Figma for UI/UX design. Learn prototyping, components, and design systems.',
          thumbnail: 'https://images.unsplash.com/photo-5069828223272-3f7e6b452238?w=400&h=250&fit=crop',
          difficulty: 'BEGINNER',
          duration: 200,
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
          title: 'UX Research & User Testing',
          description: 'Learn user research techniques and methodologies. Conduct user interviews and usability tests.',
          thumbnail: 'https://images.unsplash.com/photo-5069828223272-3f7e6b452238?w=400&h=250&fit=crop',
          difficulty: 'INTERMEDIATE',
          duration: 180,
          isActive: true,
          instructorId: 'inst2',
          categoryId: 'cat2',
          subCategoryId: 'sub6',
          learningPathId: 'lp2',
        },
      }),
      prisma.course.create({
        data: {
          id: 'course10',
          title: 'Graphic Design with Adobe Creative Suite',
          description: 'Master graphic design using Photoshop, Illustrator, and InDesign. Create stunning visual content.',
          thumbnail: 'https://images.unsplash.com/photo-5069828223272-3f7e6b452238?w=400&h=250&fit=crop',
          difficulty: 'INTERMEDIATE',
          duration: 250,
          isActive: true,
          instructorId: 'inst2',
          categoryId: 'cat2',
          subCategoryId: 'sub7',
        },
      }),

      // Business & Finance Courses
      prisma.course.create({
        data: {
          id: 'course11',
          title: 'Personal Finance Mastery',
          description: 'Essential personal finance management skills for Indians. Learn budgeting, saving, and investing.',
          thumbnail: 'https://images.unsplash.com/photo-5069828223272-3f7e6b452238?w=400&h=250&fit=crop',
          difficulty: 'BEGINNER',
          duration: 120,
          isActive: true,
          instructorId: 'inst3',
          categoryId: 'cat3',
          subCategoryId: 'sub8',
          learningPathId: 'lp3',
        },
      }),
      prisma.course.create({
        data: {
          id: 'course12',
          title: 'Investment Fundamentals for Indians',
          description: 'Learn the basics of investing in stocks, mutual funds, and other investment options in India.',
          thumbnail: 'https://images.unsplash.com/photo-5069828223272-3f7e6b452238?w=400&h=250&fit=crop',
          difficulty: 'INTERMEDIATE',
          duration: 200,
          isActive: true,
          instructorId: 'inst3',
          categoryId: 'cat3',
          subCategoryId: 'sub8',
          learningPathId: 'lp3',
        },
      }),
      prisma.course.create({
        data: {
          id: 'course13',
          title: 'Business Strategy & Planning',
          description: 'Fundamental concepts of business strategy and strategic planning for entrepreneurs.',
          thumbnail: 'https://images.unsplash.com/photo-5069828223272-3f7e6b452238?w=400&h=250&fit=crop',
          difficulty: 'INTERMEDIATE',
          duration: 160,
          isActive: true,
          instructorId: 'inst4',
          categoryId: 'cat3',
          subCategoryId: 'sub9',
        },
      }),
      prisma.course.create({
        data: {
          id: 'course14',
          title: 'Digital Marketing for Business',
          description: 'Learn digital marketing strategies to grow your business online. SEO, social media, and paid advertising.',
          thumbnail: 'https://images.unsplash.com/photo-5069828223272-3f7e6b452238?w=400&h=250&fit=crop',
          difficulty: 'BEGINNER',
          duration: 180,
          isActive: true,
          instructorId: 'inst4',
          categoryId: 'cat3',
          subCategoryId: 'sub10',
          learningPathId: 'lp5',
        },
      }),

      // Data Science Courses
      prisma.course.create({
        data: {
          id: 'course15',
          title: 'Data Analysis with Python',
          description: 'Learn data analysis using Python, Pandas, and NumPy. Clean, analyze, and visualize data.',
          thumbnail: 'https://images.unsplash.com/photo-5069828223272-3f7e6b452238?w=400&h=250&fit=crop',
          difficulty: 'INTERMEDIATE',
          duration: 220,
          isActive: true,
          instructorId: 'inst5',
          categoryId: 'cat4',
          subCategoryId: 'sub12',
          learningPathId: 'lp4',
        },
      }),
      prisma.course.create({
        data: {
          id: 'course16',
          title: 'Machine Learning Fundamentals',
          description: 'Introduction to machine learning algorithms and applications. Learn supervised and unsupervised learning.',
          thumbnail: 'https://images.unsplash.com/photo-5069828223272-3f7e6b452238?w=400&h=250&fit=crop',
          difficulty: 'ADVANCED',
          duration: 300,
          isActive: true,
          instructorId: 'inst5',
          categoryId: 'cat4',
          subCategoryId: 'sub11',
          learningPathId: 'lp4',
        },
      }),
    ])

    // Create Lessons
    const lessons = await Promise.all([
      // HTML & CSS Fundamentals Lessons
      prisma.lesson.create({
        data: {
          id: 'lesson1',
          courseId: 'course1',
          title: 'Introduction to HTML5',
          content: 'Learn the basics of HTML5 structure, semantic elements, and document structure. Understand how HTML forms the foundation of web pages.',
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
          content: 'Deep dive into HTML elements, attributes, and their usage. Learn about headings, paragraphs, lists, links, and images.',
          duration: 20,
          order: 2,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson3',
          courseId: 'course1',
          title: 'CSS Fundamentals and Selectors',
          content: 'Introduction to CSS and styling web pages. Learn about selectors, properties, and values.',
          duration: 25,
          order: 3,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson4',
          courseId: 'course1',
          title: 'CSS Layouts with Flexbox and Grid',
          content: 'Master modern CSS layouts including Flexbox and Grid. Create responsive and complex layouts easily.',
          duration: 30,
          order: 4,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson5',
          courseId: 'course1',
          title: 'Responsive Web Design',
          content: 'Learn responsive design principles and media queries. Build websites that work on all devices.',
          duration: 25,
          order: 5,
          isActive: true,
        },
      }),

      // JavaScript Programming Lessons
      prisma.lesson.create({
        data: {
          id: 'lesson6',
          courseId: 'course2',
          title: 'JavaScript Basics and Syntax',
          content: 'Introduction to JavaScript programming language. Learn variables, data types, and basic syntax.',
          duration: 20,
          order: 1,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson7',
          courseId: 'course2',
          title: 'Functions and Scope in JavaScript',
          content: 'Understanding JavaScript functions, parameters, return values, and variable scope.',
          duration: 25,
          order: 2,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson8',
          courseId: 'course2',
          title: 'Objects and Arrays',
          content: 'Learn about JavaScript objects and arrays. Understand how to work with complex data structures.',
          duration: 30,
          order: 3,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson9',
          courseId: 'course2',
          title: 'DOM Manipulation',
          content: 'Learn how to manipulate HTML elements using JavaScript. Understand the DOM tree and event handling.',
          duration: 35,
          order: 4,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson10',
          courseId: 'course2',
          title: 'ES6+ Features',
          content: 'Modern JavaScript features including arrow functions, destructuring, template literals, and modules.',
          duration: 30,
          order: 5,
          isActive: true,
        },
      }),

      // UI Design Lessons
      prisma.lesson.create({
        data: {
          id: 'lesson11',
          courseId: 'course7',
          title: 'Introduction to UI Design',
          content: 'Learn the fundamentals of User Interface design and its importance in digital products.',
          duration: 15,
          order: 1,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson12',
          courseId: 'course7',
          title: 'Color Theory in Design',
          content: 'Understanding color theory, color psychology, and how to create effective color palettes.',
          duration: 20,
          order: 2,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson13',
          courseId: 'course7',
          title: 'Typography and Font Selection',
          content: 'Learn about typography principles, font pairing, and creating visual hierarchy with text.',
          duration: 18,
          order: 3,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson14',
          courseId: 'course7',
          title: 'Layout and Composition',
          content: 'Master layout principles, grid systems, and creating balanced compositions.',
          duration: 22,
          order: 4,
          isActive: true,
        },
      }),

      // Personal Finance Lessons
      prisma.lesson.create({
        data: {
          id: 'lesson15',
          courseId: 'course11',
          title: 'Introduction to Personal Finance',
          content: 'Understanding the importance of personal finance and setting financial goals.',
          duration: 12,
          order: 1,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson16',
          courseId: 'course11',
          title: 'Budgeting Basics',
          content: 'Learn how to create and maintain a personal budget. Track income and expenses effectively.',
          duration: 18,
          order: 2,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson17',
          courseId: 'course11',
          title: 'Saving Strategies',
          content: 'Effective saving strategies for short-term and long-term financial goals.',
          duration: 15,
          order: 3,
          isActive: true,
        },
      }),
      prisma.lesson.create({
        data: {
          id: 'lesson18',
          courseId: 'course11',
          title: 'Debt Management',
          content: 'Understanding different types of debt and strategies to manage and eliminate debt.',
          duration: 20,
          order: 4,
          isActive: true,
        },
      }),
    ])

    console.log('✅ Courses and lessons seeded successfully!')
    console.log('📊 Summary:')
    console.log(`  - Learning Paths: ${learningPaths.length}`)
    console.log(`  - Courses: ${courses.length}`)
    console.log(`  - Lessons: ${lessons.length}`)

  } catch (error) {
    console.error('❌ Error seeding courses and lessons:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()