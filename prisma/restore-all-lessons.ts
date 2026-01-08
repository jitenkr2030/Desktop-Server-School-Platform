import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting comprehensive lesson restoration for ALL courses...\n')

  let totalLessonsAdded = 0
  let coursesProcessed = 0

  // Define type for lesson data
  type LessonData = {
    id: string
    courseId: string
    title: string
    content: string
    duration: number
    order: number
    videoUrl: string
    isActive: boolean
  }

  try {
    // ========================================================================
    // CAREER COURSES
    // ========================================================================

    // Career3: Data Science & Analytics
    const career3 = await prisma.course.findUnique({ where: { id: 'career3' } })
    if (career3) {
      console.log('📝 Adding lessons for career3: Data Science & Analytics...')
      await prisma.lesson.deleteMany({ where: { courseId: 'career3' } })
      const lessons: LessonData[] = []
      const modules = [
        'Statistics & Probability',
        'Python for Data Science',
        'Data Wrangling & Visualization',
        'Machine Learning Fundamentals',
        'Deep Learning & Neural Networks',
        'Natural Language Processing',
        'Computer Vision',
        'Data Science Capstone',
      ]
      const lessonsPerModule = [12, 15, 12, 15, 12, 10, 10, 14]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `career3_module${m+1}_lesson${l}`,
            courseId: 'career3',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()}. This lesson provides in-depth knowledge with practical examples, real-world applications, hands-on exercises, and expert insights for mastering data science and analytics.`,
            duration: 18 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Data Science & Analytics`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // Career4: Cloud Computing & DevOps
    const career4 = await prisma.course.findUnique({ where: { id: 'career4' } })
    if (career4) {
      console.log('📝 Adding lessons for career4: Cloud Computing & DevOps...')
      await prisma.lesson.deleteMany({ where: { courseId: 'career4' } })
      const lessons: LessonData[] = []
      const modules = [
        'Cloud Computing Fundamentals',
        'AWS Core Services',
        'Azure Cloud Services',
        'Google Cloud Platform',
        'Containerization with Docker',
        'Kubernetes Orchestration',
        'CI/CD Pipelines',
        'Infrastructure as Code',
        'Monitoring & Logging',
        'Cloud Security',
      ]
      const lessonsPerModule = [8, 12, 12, 10, 10, 10, 10, 8, 8, 8]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `career4_module${m+1}_lesson${l}`,
            courseId: 'career4',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()}. This lesson provides practical knowledge of cloud platforms, deployment strategies, and DevOps best practices for modern software development.`,
            duration: 20 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Cloud Computing & DevOps`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // Career5: Mobile App Development
    const career5 = await prisma.course.findUnique({ where: { id: 'career5' } })
    if (career5) {
      console.log('📝 Adding lessons for career5: Mobile App Development...')
      await prisma.lesson.deleteMany({ where: { courseId: 'career5' } })
      const lessons: LessonData[] = []
      const modules = [
        'Mobile Development Fundamentals',
        'React Native Development',
        'Flutter Development',
        'iOS Native Development',
        'Android Native Development',
        'State Management',
        'API Integration',
        'App Deployment & Publishing',
      ]
      const lessonsPerModule = [8, 15, 15, 12, 12, 8, 10, 8]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `career5_module${m+1}_lesson${l}`,
            courseId: 'career5',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()}. This lesson provides hands-on experience with mobile development frameworks, UI design, and app deployment strategies for iOS and Android platforms.`,
            duration: 18 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Mobile App Development`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // Career6: Entrepreneurship Essentials
    const career6 = await prisma.course.findUnique({ where: { id: 'career6' } })
    if (career6) {
      console.log('📝 Adding lessons for career6: Entrepreneurship Essentials...')
      await prisma.lesson.deleteMany({ where: { courseId: 'career6' } })
      const lessons: LessonData[] = []
      const modules = [
        'Entrepreneurial Mindset',
        'Business Model Development',
        'Market Research & Validation',
        'Financial Planning',
        'Team Building',
        'Growth Strategies',
      ]
      const lessonsPerModule = [15, 18, 15, 18, 15, 15]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `career6_module${m+1}_lesson${l}`,
            courseId: 'career6',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()}. This lesson provides essential knowledge for aspiring entrepreneurs, including startup methodologies, business planning, and strategic growth techniques.`,
            duration: 15 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Entrepreneurship Essentials`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // Career7: Financial Management
    const career7 = await prisma.course.findUnique({ where: { id: 'career7' } })
    if (career7) {
      console.log('📝 Adding lessons for career7: Financial Management...')
      await prisma.lesson.deleteMany({ where: { courseId: 'career7' } })
      const lessons: LessonData[] = []
      const modules = [
        'Financial Statement Analysis',
        'Corporate Finance',
        'Investment Analysis',
        'Risk Management',
        'Financial Planning',
        'Advanced Finance Topics',
      ]
      const lessonsPerModule = [18, 18, 18, 15, 15, 16]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `career7_module${m+1}_lesson${l}`,
            courseId: 'career7',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()}. This lesson provides in-depth knowledge of financial theories, practical applications, and real-world case studies for financial professionals.`,
            duration: 18 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Financial Management`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // Career8: Project Management
    const career8 = await prisma.course.findUnique({ where: { id: 'career8' } })
    if (career8) {
      console.log('📝 Adding lessons for career8: Project Management...')
      await prisma.lesson.deleteMany({ where: { courseId: 'career8' } })
      const lessons: LessonData[] = []
      const modules = [
        'Project Management Fundamentals',
        'Project Planning',
        'Risk & Quality Management',
        'Agile & Scrum',
        'Team Leadership',
        'Project Execution',
      ]
      const lessonsPerModule = [15, 18, 15, 18, 15, 15]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `career8_module${m+1}_lesson${l}`,
            courseId: 'career8',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()}. This lesson explores project management methodologies, tools, and best practices for delivering successful projects on time and within budget.`,
            duration: 15 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Project Management`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // Career9: UX/UI Design Mastery
    const career9 = await prisma.course.findUnique({ where: { id: 'career9' } })
    if (career9) {
      console.log('📝 Adding lessons for career9: UX/UI Design Mastery...')
      await prisma.lesson.deleteMany({ where: { courseId: 'career9' } })
      const lessons: LessonData[] = []
      const modules = [
        'Design Thinking',
        'User Research',
        'Wireframing & Prototyping',
        'Visual Design',
        'Interaction Design',
        'Usability Testing',
        'Design Systems',
        'Portfolio Development',
      ]
      const lessonsPerModule = [10, 12, 12, 12, 12, 10, 10, 12]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `career9_module${m+1}_lesson${l}`,
            courseId: 'career9',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()}. This lesson provides practical skills in user experience design, interface creation, and usability testing for digital products.`,
            duration: 16 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for UX/UI Design Mastery`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // Career10: Graphic Design Fundamentals
    const career10 = await prisma.course.findUnique({ where: { id: 'career10' } })
    if (career10) {
      console.log('📝 Adding lessons for career10: Graphic Design Fundamentals...')
      await prisma.lesson.deleteMany({ where: { courseId: 'career10' } })
      const lessons: LessonData[] = []
      const modules = [
        'Design Fundamentals',
        'Typography',
        'Color Theory',
        'Layout & Composition',
        'Photoshop Mastery',
        'Illustrator Mastery',
        'Logo Design',
        'Print Design',
        'Digital Design',
        'Design Portfolio',
      ]
      const lessonsPerModule = [8, 8, 8, 8, 10, 10, 8, 8, 8, 8]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `career10_module${m+1}_lesson${l}`,
            courseId: 'career10',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()}. This lesson provides creative design skills and software proficiency for professional graphic design work.`,
            duration: 15 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Graphic Design Fundamentals`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // Career11: Content Creation & Video Editing
    const career11 = await prisma.course.findUnique({ where: { id: 'career11' } })
    if (career11) {
      console.log('📝 Adding lessons for career11: Content Creation & Video Editing...')
      await prisma.lesson.deleteMany({ where: { courseId: 'career11' } })
      const lessons: LessonData[] = []
      const modules = [
        'Content Strategy',
        'Scriptwriting',
        'Videography Basics',
        'Audio Production',
        'Premiere Pro',
        'DaVinci Resolve',
        'Motion Graphics',
        'Visual Effects',
        'Content Distribution',
        'Video Production Capstone',
      ]
      const lessonsPerModule = [8, 8, 8, 8, 10, 10, 10, 8, 8, 10]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `career11_module${m+1}_lesson${l}`,
            courseId: 'career11',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()}. This lesson provides professional video production skills, editing techniques, and content distribution strategies.`,
            duration: 16 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Content Creation & Video Editing`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // Career12: Photography & Digital Art
    const career12 = await prisma.course.findUnique({ where: { id: 'career12' } })
    if (career12) {
      console.log('📝 Adding lessons for career12: Photography & Digital Art...')
      await prisma.lesson.deleteMany({ where: { courseId: 'career12' } })
      const lessons: LessonData[] = []
      const modules = [
        'Photography Fundamentals',
        'Exposure & Lighting',
        'Composition',
        'Portrait Photography',
        'Landscape Photography',
        'Lightroom Mastery',
        'Advanced Editing',
        'Studio Photography',
        'Photo Business',
        'Photography Portfolio',
      ]
      const lessonsPerModule = [8, 8, 8, 8, 8, 10, 10, 8, 8, 8]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `career12_module${m+1}_lesson${l}`,
            courseId: 'career12',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()}. This lesson provides artistic skills and technical knowledge for professional photography and digital art creation.`,
            duration: 15 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Photography & Digital Art`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // Career13: Digital Marketing Mastery
    const career13 = await prisma.course.findUnique({ where: { id: 'career13' } })
    if (career13) {
      console.log('📝 Adding lessons for career13: Digital Marketing Mastery...')
      await prisma.lesson.deleteMany({ where: { courseId: 'career13' } })
      const lessons: LessonData[] = []
      const modules = [
        'Digital Marketing Fundamentals',
        'SEO Mastery',
        'PPC Advertising',
        'Social Media Marketing',
        'Email Marketing',
        'Content Marketing',
        'Marketing Analytics',
        'Conversion Optimization',
        'Marketing Automation',
        'Digital Marketing Capstone',
      ]
      const lessonsPerModule = [10, 12, 10, 12, 10, 10, 10, 10, 10, 10]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `career13_module${m+1}_lesson${l}`,
            courseId: 'career13',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()}. This lesson provides strategic digital marketing knowledge, platform-specific tactics, and performance measurement skills.`,
            duration: 16 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Digital Marketing Mastery`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // Career14: Blockchain & Web3 Development
    const career14 = await prisma.course.findUnique({ where: { id: 'career14' } })
    if (career14) {
      console.log('📝 Adding lessons for career14: Blockchain & Web3 Development...')
      await prisma.lesson.deleteMany({ where: { courseId: 'career14' } })
      const lessons: LessonData[] = []
      const modules = [
        'Blockchain Fundamentals',
        'Cryptocurrency Economics',
        'Smart Contract Development',
        'Solidity Programming',
        'DeFi Development',
        'NFT Development',
        'Web3.js & Ethers.js',
        'Security & Best Practices',
      ]
      const lessonsPerModule = [10, 10, 12, 15, 12, 10, 12, 10]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `career14_module${m+1}_lesson${l}`,
            courseId: 'career14',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()}. This lesson provides technical knowledge of blockchain technology, smart contract development, and decentralized application creation.`,
            duration: 20 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Blockchain & Web3 Development`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // Career15: Social Media Management
    const career15 = await prisma.course.findUnique({ where: { id: 'career15' } })
    if (career15) {
      console.log('📝 Adding lessons for career15: Social Media Management...')
      await prisma.lesson.deleteMany({ where: { courseId: 'career15' } })
      const lessons: LessonData[] = []
      const modules = [
        'Social Media Strategy',
        'Platform Mastery',
        'Content Creation',
        'Community Management',
        'Influencer Marketing',
        'Social Advertising',
        'Social Analytics',
        'Crisis Management',
        'Social Media Tools',
        'Social Media Capstone',
      ]
      const lessonsPerModule = [8, 10, 10, 8, 8, 10, 8, 8, 8, 10]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `career15_module${m+1}_lesson${l}`,
            courseId: 'career15',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()}. This lesson provides comprehensive skills for managing social media presence, engagement strategies, and performance analysis.`,
            duration: 15 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Social Media Management`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // Career16: Brand Strategy & Management
    const career16 = await prisma.course.findUnique({ where: { id: 'career16' } })
    if (career16) {
      console.log('📝 Adding lessons for career16: Brand Strategy & Management...')
      await prisma.lesson.deleteMany({ where: { courseId: 'career16' } })
      const lessons: LessonData[] = []
      const modules = [
        'Brand Fundamentals',
        'Brand Strategy',
        'Brand Identity Design',
        'Brand Messaging',
        'Brand Experience',
        'Digital Branding',
        'Brand Equity Management',
        'Rebranding',
        'Brand Governance',
        'Brand Strategy Capstone',
      ]
      const lessonsPerModule = [8, 10, 10, 8, 8, 10, 10, 8, 8, 10]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `career16_module${m+1}_lesson${l}`,
            courseId: 'career16',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()}. This lesson provides strategic brand development knowledge, creative design skills, and management techniques for building strong brands.`,
            duration: 16 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Brand Strategy & Management`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // ========================================================================
    // LIFE SKILLS COURSES
    // ========================================================================

    // Life2: Investment & Wealth Building
    const life2 = await prisma.course.findUnique({ where: { id: 'life2' } })
    if (life2) {
      console.log('📝 Adding lessons for life2: Investment & Wealth Building...')
      await prisma.lesson.deleteMany({ where: { courseId: 'life2' } })
      const lessons: LessonData[] = []
      const modules = [
        'Investment Fundamentals',
        'Advanced Wealth Building',
      ]
      const lessonsPerModule = [15, 15]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `life2_module${m+1}_lesson${l}`,
            courseId: 'life2',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()}. This lesson provides essential investment strategies, market analysis techniques, and wealth accumulation principles.`,
            duration: 10 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Investment & Wealth Building`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // Life3: Tax Planning & Insurance
    const life3 = await prisma.course.findUnique({ where: { id: 'life3' } })
    if (life3) {
      console.log('📝 Adding lessons for life3: Tax Planning & Insurance...')
      await prisma.lesson.deleteMany({ where: { courseId: 'life3' } })
      const lessons: LessonData[] = []
      const modules = [
        'Tax Planning & Compliance',
        'Insurance Planning & Risk Management',
      ]
      const lessonsPerModule = [15, 15]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `life3_module${m+1}_lesson${l}`,
            courseId: 'life3',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()}. This lesson explores tax optimization strategies, legal compliance, insurance products, and risk management techniques.`,
            duration: 10 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Tax Planning & Insurance`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // Life4: Nutrition & Healthy Living
    const life4 = await prisma.course.findUnique({ where: { id: 'life4' } })
    if (life4) {
      console.log('📝 Adding lessons for life4: Nutrition & Healthy Living...')
      await prisma.lesson.deleteMany({ where: { courseId: 'life4' } })
      const lessons: LessonData[] = []
      const modules = [
        'Nutrition Fundamentals',
        'Healthy Living Practices',
      ]
      const lessonsPerModule = [12, 10]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `life4_module${m+1}_lesson${l}`,
            courseId: 'life4',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()}. This lesson provides detailed information about macronutrients, micronutrients, meal planning, and healthy lifestyle habits.`,
            duration: 8 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Nutrition & Healthy Living`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // Life5: Fitness & Exercise
    const life5 = await prisma.course.findUnique({ where: { id: 'life5' } })
    if (life5) {
      console.log('📝 Adding lessons for life5: Fitness & Exercise...')
      await prisma.lesson.deleteMany({ where: { courseId: 'life5' } })
      const lessons: LessonData[] = []
      const modules = [
        'Fitness Fundamentals',
        'Exercise Programming',
      ]
      const lessonsPerModule = [12, 10]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `life5_module${m+1}_lesson${l}`,
            courseId: 'life5',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()}. This lesson provides foundational knowledge of exercise physiology, strength training principles, and workout program design.`,
            duration: 8 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Fitness & Exercise`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // Life6: Mental Health & Mindfulness
    const life6 = await prisma.course.findUnique({ where: { id: 'life6' } })
    if (life6) {
      console.log('📝 Adding lessons for life6: Mental Health & Mindfulness...')
      await prisma.lesson.deleteMany({ where: { courseId: 'life6' } })
      const lessons: LessonData[] = []
      const modules = ['Mental Health & Mindfulness Basics']
      const lessonsPerModule = [12]
      let order = 1
      for (let l = 1; l <= lessonsPerModule[0]; l++) {
        lessons.push({
          id: `life6_lesson${l}`,
          courseId: 'life6',
          title: `${modules[0]} - Lesson ${l}`,
          content: `Comprehensive lesson covering ${modules[0].toLowerCase()}. This lesson provides information about psychological well-being, meditation techniques, stress reduction, and emotional intelligence.`,
          duration: 10 + l,
          order: order++,
          videoUrl: 'https://example.com/video',
          isActive: true,
        })
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Mental Health & Mindfulness`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // ========================================================================
    // SCHOOL COURSES
    // ========================================================================

    // School2: Mathematics Grade 2
    const school2 = await prisma.course.findUnique({ where: { id: 'school2' } })
    if (school2) {
      console.log('📝 Adding lessons for school2: Mathematics Grade 2...')
      await prisma.lesson.deleteMany({ where: { courseId: 'school2' } })
      const lessons: LessonData[] = []
      const modules = [
        'Numbers 1-100',
        'Addition & Subtraction',
        'Multiplication Basics',
        'Shapes & Geometry',
        'Measurement',
        'Time & Money',
        'Data Handling',
        'Review & Practice',
      ]
      const lessonsPerModule = [5, 6, 6, 4, 4, 5, 4, 4]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `school2_module${m+1}_lesson${l}`,
            courseId: 'school2',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Fun and engaging lesson on ${modules[m].toLowerCase()} for young learners. Includes colorful visuals, interactive activities, and practice problems.`,
            duration: 12 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Mathematics Grade 2`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // School3: Mathematics Grade 3
    const school3 = await prisma.course.findUnique({ where: { id: 'school3' } })
    if (school3) {
      console.log('📝 Adding lessons for school3: Mathematics Grade 3...')
      await prisma.lesson.deleteMany({ where: { courseId: 'school3' } })
      const lessons: LessonData[] = []
      const modules = [
        'Numbers & Place Value',
        'Multiplication & Division',
        'Fractions',
        'Geometry & Shapes',
        'Measurement',
        'Time & Calendar',
        'Data Interpretation',
        'Review & Practice',
      ]
      const lessonsPerModule = [5, 6, 6, 5, 5, 5, 4, 4]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `school3_module${m+1}_lesson${l}`,
            courseId: 'school3',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Interactive lesson on ${modules[m].toLowerCase()} for elementary students. Includes examples, exercises, and real-world applications.`,
            duration: 12 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Mathematics Grade 3`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // School4: Science Grade 4
    const school4 = await prisma.course.findUnique({ where: { id: 'school4' } })
    if (school4) {
      console.log('📝 Adding lessons for school4: Science Grade 4...')
      await prisma.lesson.deleteMany({ where: { courseId: 'school4' } })
      const lessons: LessonData[] = []
      const modules = [
        'Living Things',
        'Plants & Photosynthesis',
        'Animals & Habitats',
        'Matter & Materials',
        'Forces & Motion',
        'Energy',
        'Earth & Space',
        'Scientific Method',
      ]
      const lessonsPerModule = [5, 5, 5, 5, 5, 5, 5, 5]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `school4_module${m+1}_lesson${l}`,
            courseId: 'school4',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Engaging lesson on ${modules[m].toLowerCase()} with experiments, observations, and fun facts to spark scientific curiosity.`,
            duration: 12 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Science Grade 4`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // School5: Mathematics Grade 5
    const school5 = await prisma.course.findUnique({ where: { id: 'school5' } })
    if (school5) {
      console.log('📝 Adding lessons for school5: Mathematics Grade 5...')
      await prisma.lesson.deleteMany({ where: { courseId: 'school5' } })
      const lessons: LessonData[] = []
      const modules = [
        'Large Numbers & Operations',
        'Fractions & Decimals',
        'Percentage Basics',
        'Geometry & Mensuration',
        'Algebra Introduction',
        'Data Handling',
        'Ratio & Proportion',
        'Review & Practice',
      ]
      const lessonsPerModule = [5, 6, 5, 6, 5, 5, 5, 5]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `school5_module${m+1}_lesson${l}`,
            courseId: 'school5',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson on ${modules[m].toLowerCase()} with step-by-step explanations, practice problems, and real-world applications.`,
            duration: 12 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Mathematics Grade 5`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // School6: Science Grade 6
    const school6 = await prisma.course.findUnique({ where: { id: 'school6' } })
    if (school6) {
      console.log('📝 Adding lessons for school6: Science Grade 6...')
      await prisma.lesson.deleteMany({ where: { courseId: 'school6' } })
      const lessons: LessonData[] = []
      const modules = [
        'Cell Structure',
        'Classification of Organisms',
        'Matter & Its Properties',
        'Motion & Forces',
        'Light & Sound',
        'Weather & Climate',
        'Natural Resources',
        'Environmental Science',
      ]
      const lessonsPerModule = [5, 6, 6, 6, 6, 5, 5, 5]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `school6_module${m+1}_lesson${l}`,
            courseId: 'school6',
            title: `${modules[m]} - Lesson ${l}`,
            content: `In-depth lesson on ${modules[m].toLowerCase()} with diagrams, experiments, and concept explanations for middle school students.`,
            duration: 14 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Science Grade 6`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // School7: Mathematics Grade 7
    const school7 = await prisma.course.findUnique({ where: { id: 'school7' } })
    if (school7) {
      console.log('📝 Adding lessons for school7: Mathematics Grade 7...')
      await prisma.lesson.deleteMany({ where: { courseId: 'school7' } })
      const lessons: LessonData[] = []
      const modules = [
        'Integers & Rational Numbers',
        'Algebraic Expressions',
        'Linear Equations',
        'Ratio & Proportion',
        'Geometry & Construction',
        'Data Handling',
        'Probability',
        'Review & Practice',
      ]
      const lessonsPerModule = [6, 6, 6, 5, 6, 5, 5, 5]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `school7_module${m+1}_lesson${l}`,
            courseId: 'school7',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Advanced lesson on ${modules[m].toLowerCase()} with problem-solving strategies and real-world mathematical applications.`,
            duration: 14 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Mathematics Grade 7`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // School8: Science Grade 8
    const school8 = await prisma.course.findUnique({ where: { id: 'school8' } })
    if (school8) {
      console.log('📝 Adding lessons for school8: Science Grade 8...')
      await prisma.lesson.deleteMany({ where: { courseId: 'school8' } })
      const lessons: LessonData[] = []
      const modules = [
        'Cell Biology',
        'Human Body Systems',
        'Chemical Reactions',
        'Acids, Bases & Salts',
        'Metals & Non-Metals',
        'Force & Pressure',
        'Energy & Work',
        'Pollution & Conservation',
      ]
      const lessonsPerModule = [5, 6, 6, 6, 6, 6, 5, 5]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `school8_module${m+1}_lesson${l}`,
            courseId: 'school8',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson on ${modules[m].toLowerCase()} with scientific principles, laboratory techniques, and environmental awareness.`,
            duration: 14 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Science Grade 8`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // School9: Mathematics Grade 9
    const school9 = await prisma.course.findUnique({ where: { id: 'school9' } })
    if (school9) {
      console.log('📝 Adding lessons for school9: Mathematics Grade 9...')
      await prisma.lesson.deleteMany({ where: { courseId: 'school9' } })
      const lessons: LessonData[] = []
      const modules = [
        'Number Systems',
        'Polynomials',
        'Coordinate Geometry',
        'Linear Equations',
        'Euclidean Geometry',
        'Heron\'s Formula',
        'Probability & Statistics',
        'Mathematical Reasoning',
      ]
      const lessonsPerModule = [6, 8, 6, 6, 8, 6, 6, 6]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `school9_module${m+1}_lesson${l}`,
            courseId: 'school9',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Concept-focused lesson on ${modules[m].toLowerCase()} with rigorous practice problems and mathematical proofs.`,
            duration: 15 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Mathematics Grade 9`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // School10: Science Grade 10
    const school10 = await prisma.course.findUnique({ where: { id: 'school10' } })
    if (school10) {
      console.log('📝 Adding lessons for school10: Science Grade 10...')
      await prisma.lesson.deleteMany({ where: { courseId: 'school10' } })
      const lessons: LessonData[] = []
      const modules = [
        'Chemical Reactions & Equations',
        'Acids, Bases & Salts',
        'Metals & Non-Metals',
        'Carbon & Compounds',
        'Periodic Classification',
        'Life Processes',
        'Control & Coordination',
        'Reproduction',
        'Heredity & Evolution',
        'Light & Reflection',
        'Electricity',
        'Magnetic Effects',
        'Sources of Energy',
        'Environment',
      ]
      const lessonsPerModule = [5, 5, 5, 6, 5, 6, 5, 5, 5, 6, 6, 5, 5, 5]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `school10_module${m+1}_lesson${l}`,
            courseId: 'school10',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Detailed lesson on ${modules[m].toLowerCase()} with NCERT-based content, diagrams, and examination-focused practice.`,
            duration: 15 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Science Grade 10`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // School11: Mathematics Grade 11
    const school11 = await prisma.course.findUnique({ where: { id: 'school11' } })
    if (school11) {
      console.log('📝 Adding lessons for school11: Mathematics Grade 11...')
      await prisma.lesson.deleteMany({ where: { courseId: 'school11' } })
      const lessons: LessonData[] = []
      const modules = [
        'Sets & Functions',
        'Trigonometry',
        'Coordinate Geometry',
        'Calculus Introduction',
        'Mathematical Reasoning',
        'Statistics & Probability',
        'Linear Inequalities',
        'Permutations & Combinations',
      ]
      const lessonsPerModule = [8, 10, 8, 8, 6, 8, 6, 8]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `school11_module${m+1}_lesson${l}`,
            courseId: 'school11',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Advanced lesson on ${modules[m].toLowerCase()} for senior secondary students with comprehensive theory and problem-solving techniques.`,
            duration: 16 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Mathematics Grade 11`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // School12: Mathematics Grade 12
    const school12 = await prisma.course.findUnique({ where: { id: 'school12' } })
    if (school12) {
      console.log('📝 Adding lessons for school12: Mathematics Grade 12...')
      await prisma.lesson.deleteMany({ where: { courseId: 'school12' } })
      const lessons: LessonData[] = []
      const modules = [
        'Relations & Functions',
        'Inverse Trigonometry',
        'Matrices & Determinants',
        'Continuity & Differentiability',
        'Application of Derivatives',
        'Integrals',
        'Application of Integrals',
        'Differential Equations',
        'Vector Algebra',
        'Three Dimensional Geometry',
        'Linear Programming',
        'Probability',
      ]
      const lessonsPerModule = [8, 6, 10, 10, 8, 12, 8, 8, 10, 10, 6, 8]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `school12_module${m+1}_lesson${l}`,
            courseId: 'school12',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson on ${modules[m].toLowerCase()} for Class 12 students with detailed derivations, examples, and NCERT exercises.`,
            duration: 18 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Mathematics Grade 12`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // ========================================================================
    // COLLEGE COURSES
    // ========================================================================

    // College1: Engineering Mathematics I
    const college1 = await prisma.course.findUnique({ where: { id: 'college1' } })
    if (college1) {
      console.log('📝 Adding lessons for college1: Engineering Mathematics I...')
      await prisma.lesson.deleteMany({ where: { courseId: 'college1' } })
      const lessons: LessonData[] = []
      const modules = [
        'Differential Calculus',
        'Partial Derivatives',
        'Integral Calculus',
        'Multiple Integrals',
        'Vector Calculus',
        'Differential Equations',
      ]
      const lessonsPerModule = [15, 15, 18, 15, 15, 18]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `college1_module${m+1}_lesson${l}`,
            courseId: 'college1',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Detailed lesson covering ${modules[m].toLowerCase()} with mathematical proofs, derivations, and engineering applications for undergraduate students.`,
            duration: 20 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Engineering Mathematics I`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // College2: Programming Fundamentals
    const college2 = await prisma.course.findUnique({ where: { id: 'college2' } })
    if (college2) {
      console.log('📝 Adding lessons for college2: Programming Fundamentals...')
      await prisma.lesson.deleteMany({ where: { courseId: 'college2' } })
      const lessons: LessonData[] = []
      const modules = [
        'Introduction to Programming',
        'Control Structures & Functions',
        'Data Structures & Algorithms',
      ]
      const lessonsPerModule = [15, 15, 20]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `college2_module${m+1}_lesson${l}`,
            courseId: 'college2',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()} with hands-on coding exercises and algorithmic problem-solving for computer science students.`,
            duration: 18 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Programming Fundamentals`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // College3: Engineering Physics
    const college3 = await prisma.course.findUnique({ where: { id: 'college3' } })
    if (college3) {
      console.log('📝 Adding lessons for college3: Engineering Physics...')
      await prisma.lesson.deleteMany({ where: { courseId: 'college3' } })
      const lessons: LessonData[] = []
      const modules = [
        'Mechanics & Motion',
        'Waves, Optics & Thermodynamics',
        'Electromagnetism & Modern Physics',
      ]
      const lessonsPerModule = [18, 18, 20]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `college3_module${m+1}_lesson${l}`,
            courseId: 'college3',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Detailed lesson covering ${modules[m].toLowerCase()} with physics principles, mathematical derivations, and engineering applications.`,
            duration: 18 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Engineering Physics`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // College4: Digital Electronics
    const college4 = await prisma.course.findUnique({ where: { id: 'college4' } })
    if (college4) {
      console.log('📝 Adding lessons for college4: Digital Electronics...')
      await prisma.lesson.deleteMany({ where: { courseId: 'college4' } })
      const lessons: LessonData[] = []
      const modules = [
        'Digital Logic Fundamentals',
        'Combinational & Sequential Circuits',
        'Microprocessors & Digital Systems',
      ]
      const lessonsPerModule = [15, 18, 20]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `college4_module${m+1}_lesson${l}`,
            courseId: 'college4',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()} with circuit design, boolean algebra, and digital system architecture.`,
            duration: 18 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Digital Electronics`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // College5: Human Anatomy
    const college5 = await prisma.course.findUnique({ where: { id: 'college5' } })
    if (college5) {
      console.log('📝 Adding lessons for college5: Human Anatomy...')
      await prisma.lesson.deleteMany({ where: { courseId: 'college5' } })
      const lessons: LessonData[] = []
      const modules = [
        'Cell Biology & Tissues',
        'Skeletal & Muscular Systems',
        'Organ Systems & Integration',
      ]
      const lessonsPerModule = [15, 15, 20]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `college5_module${m+1}_lesson${l}`,
            courseId: 'college5',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Detailed lesson covering ${modules[m].toLowerCase()} with anatomical structures, physiological functions, and clinical correlations for medical students.`,
            duration: 18 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Human Anatomy`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // College6: Biochemistry
    const college6 = await prisma.course.findUnique({ where: { id: 'college6' } })
    if (college6) {
      console.log('📝 Adding lessons for college6: Biochemistry...')
      await prisma.lesson.deleteMany({ where: { courseId: 'college6' } })
      const lessons: LessonData[] = []
      const modules = [
        'Biomolecules & Enzymes',
        'Metabolic Pathways',
        'Molecular Biology & Genetics',
      ]
      const lessonsPerModule = [15, 18, 20]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `college6_module${m+1}_lesson${l}`,
            courseId: 'college6',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()} with biochemical reactions, molecular mechanisms, and laboratory techniques.`,
            duration: 18 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Biochemistry`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // ========================================================================
    // PROFESSIONAL COURSES
    // ========================================================================

    // CA Foundation
    const caFoundation = await prisma.course.findUnique({ where: { id: 'ca_foundation' } })
    if (caFoundation) {
      console.log('📝 Adding lessons for CA Foundation...')
      await prisma.lesson.deleteMany({ where: { courseId: 'ca_foundation' } })
      const lessons: LessonData[] = []
      const modules = [
        'Accounting',
        'Business Laws',
        'Quantitative Aptitude',
        'Business Economics',
      ]
      const lessonsPerModule = [25, 20, 25, 20]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `ca_foundation_module${m+1}_lesson${l}`,
            courseId: 'ca_foundation',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()} for CA Foundation examination with theoretical concepts, practical problems, and examination tips.`,
            duration: 20 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for CA Foundation`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // CA Intermediate
    const caIntermediate = await prisma.course.findUnique({ where: { id: 'ca_intermediate' } })
    if (caIntermediate) {
      console.log('📝 Adding lessons for CA Intermediate...')
      await prisma.lesson.deleteMany({ where: { courseId: 'ca_intermediate' } })
      const lessons: LessonData[] = []
      const modules = [
        'Advanced Accounting',
        'Corporate Law',
        'Taxation',
        'Cost Management',
      ]
      const lessonsPerModule = [30, 25, 30, 25]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `ca_intermediate_module${m+1}_lesson${l}`,
            courseId: 'ca_intermediate',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Advanced lesson covering ${modules[m].toLowerCase()} for CA Intermediate examination with complex problems, case studies, and practical applications.`,
            duration: 22 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for CA Intermediate`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // CA Final
    const caFinal = await prisma.course.findUnique({ where: { id: 'ca_final' } })
    if (caFinal) {
      console.log('📝 Adding lessons for CA Final...')
      await prisma.lesson.deleteMany({ where: { courseId: 'ca_final' } })
      const lessons: LessonData[] = []
      const modules = [
        'Advanced Auditing',
        'Strategic Financial Management',
        'Advanced Taxation',
        'Corporate Governance',
        'Financial Reporting',
        'Strategic Management',
      ]
      const lessonsPerModule = [25, 30, 30, 20, 25, 20]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `ca_final_module${m+1}_lesson${l}`,
            courseId: 'ca_final',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Expert-level lesson covering ${modules[m].toLowerCase()} for CA Final examination with advanced concepts, real-world scenarios, and professional insights.`,
            duration: 25 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for CA Final`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // CS Executive
    const csExecutive = await prisma.course.findUnique({ where: { id: 'cs_executive' } })
    if (csExecutive) {
      console.log('📝 Adding lessons for CS Executive...')
      await prisma.lesson.deleteMany({ where: { courseId: 'cs_executive' } })
      const lessons: LessonData[] = []
      const modules = [
        'Company Law',
        'Securities Law',
        'Economic & Commercial Laws',
        'Tax Laws & Practice',
      ]
      const lessonsPerModule = [25, 20, 20, 25]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `cs_executive_module${m+1}_lesson${l}`,
            courseId: 'cs_executive',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()} for CS Executive examination with legal provisions, case laws, and practical applications.`,
            duration: 20 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for CS Executive`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // CS Professional
    const csProfessional = await prisma.course.findUnique({ where: { id: 'cs_professional' } })
    if (csProfessional) {
      console.log('📝 Adding lessons for CS Professional...')
      await prisma.lesson.deleteMany({ where: { courseId: 'cs_professional' } })
      const lessons: LessonData[] = []
      const modules = [
        'Corporate Governance',
        'Secretarial Practice',
        'Corporate Compliance',
        'Corporate Restructuring',
      ]
      const lessonsPerModule = [25, 25, 20, 20]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `cs_professional_module${m+1}_lesson${l}`,
            courseId: 'cs_professional',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Advanced lesson covering ${modules[m].toLowerCase()} for CS Professional examination with professional practices, compliance requirements, and corporate strategies.`,
            duration: 22 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for CS Professional`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // CMA Foundation
    const cmaFoundation = await prisma.course.findUnique({ where: { id: 'cma_foundation' } })
    if (cmaFoundation) {
      console.log('📝 Adding lessons for CMA Foundation...')
      await prisma.lesson.deleteMany({ where: { courseId: 'cma_foundation' } })
      const lessons: LessonData[] = []
      const modules = [
        'Fundamentals of Accounting',
        'Fundamentals of Economics',
        'Fundamentals of Statistics',
        'Fundamentals of Management',
      ]
      const lessonsPerModule = [20, 18, 18, 18]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `cma_foundation_module${m+1}_lesson${l}`,
            courseId: 'cma_foundation',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Foundational lesson covering ${modules[m].toLowerCase()} for CMA Foundation examination with basic concepts and practical examples.`,
            duration: 18 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for CMA Foundation`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // CMA Intermediate
    const cmaIntermediate = await prisma.course.findUnique({ where: { id: 'cma_intermediate' } })
    if (cmaIntermediate) {
      console.log('📝 Adding lessons for CMA Intermediate...')
      await prisma.lesson.deleteMany({ where: { courseId: 'cma_intermediate' } })
      const lessons: LessonData[] = []
      const modules = [
        'Cost Accounting',
        'Financial Accounting',
        'Laws & Ethics',
        'Direct Taxation',
      ]
      const lessonsPerModule = [25, 25, 20, 22]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `cma_intermediate_module${m+1}_lesson${l}`,
            courseId: 'cma_intermediate',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Intermediate lesson covering ${modules[m].toLowerCase()} for CMA Intermediate examination with cost analysis, accounting practices, and tax computations.`,
            duration: 20 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for CMA Intermediate`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // CMA Final
    const cmaFinal = await prisma.course.findUnique({ where: { id: 'cma_final' } })
    if (cmaFinal) {
      console.log('📝 Adding lessons for CMA Final...')
      await prisma.lesson.deleteMany({ where: { courseId: 'cma_final' } })
      const lessons: LessonData[] = []
      const modules = [
        'Strategic Cost Management',
        'Financial Strategy',
        'Performance Management',
        'Risk Management',
        'Corporate Finance',
        'Strategic Management',
      ]
      const lessonsPerModule = [25, 25, 22, 20, 22, 20]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `cma_final_module${m+1}_lesson${l}`,
            courseId: 'cma_final',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Advanced lesson covering ${modules[m].toLowerCase()} for CMA Final examination with strategic frameworks, financial analysis, and decision-making techniques.`,
            duration: 25 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for CMA Final`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // CFA Level 1
    const cfaLevel1 = await prisma.course.findUnique({ where: { id: 'cfa_level1' } })
    if (cfaLevel1) {
      console.log('📝 Adding lessons for CFA Level 1...')
      await prisma.lesson.deleteMany({ where: { courseId: 'cfa_level1' } })
      const lessons: LessonData[] = []
      const modules = [
        'Ethical & Professional Standards',
        'Quantitative Methods',
        'Economics',
        'Financial Statement Analysis',
        'Corporate Issuers',
        'Equity Investments',
        'Fixed Income',
        'Derivatives',
        'Alternative Investments',
        'Portfolio Management',
      ]
      const lessonsPerModule = [20, 25, 20, 30, 15, 25, 25, 15, 15, 20]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `cfa_level1_module${m+1}_lesson${l}`,
            courseId: 'cfa_level1',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()} for CFA Level 1 examination with theoretical concepts, calculations, and practical applications in investment management.`,
            duration: 22 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for CFA Level 1`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // CFA Level 2
    const cfaLevel2 = await prisma.course.findUnique({ where: { id: 'cfa_level2' } })
    if (cfaLevel2) {
      console.log('📝 Adding lessons for CFA Level 2...')
      await prisma.lesson.deleteMany({ where: { courseId: 'cfa_level2' } })
      const lessons: LessonData[] = []
      const modules = [
        'Ethical & Professional Standards',
        'Quantitative Methods',
        'Economics',
        'Financial Statement Analysis',
        'Corporate Issuers',
        'Equity Valuation',
        'Fixed Income',
        'Derivatives',
        'Alternative Investments',
        'Portfolio Management',
      ]
      const lessonsPerModule = [18, 22, 18, 35, 15, 35, 30, 20, 18, 25]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `cfa_level2_module${m+1}_lesson${l}`,
            courseId: 'cfa_level2',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Advanced lesson covering ${modules[m].toLowerCase()} for CFA Level 2 examination with in-depth analysis, valuation techniques, and case study applications.`,
            duration: 25 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for CFA Level 2`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // CFA Level 3
    const cfaLevel3 = await prisma.course.findUnique({ where: { id: 'cfa_level3' } })
    if (cfaLevel3) {
      console.log('📝 Adding lessons for CFA Level 3...')
      await prisma.lesson.deleteMany({ where: { courseId: 'cfa_level3' } })
      const lessons: LessonData[] = []
      const modules = [
        'Ethical & Professional Standards',
        'Portfolio Management',
        'Wealth Planning',
        'Capital Market Theory',
        'Alternative Investments',
        'Trading & Rebalancing',
        'Performance Evaluation',
        'Investment Policy Statement',
      ]
      const lessonsPerModule = [18, 35, 30, 25, 20, 20, 22, 20]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `cfa_level3_module${m+1}_lesson${l}`,
            courseId: 'cfa_level3',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Expert-level lesson covering ${modules[m].toLowerCase()} for CFA Level 3 examination with portfolio strategies, wealth planning frameworks, and institutional investment management.`,
            duration: 28 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for CFA Level 3`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // FRM Part 1
    const frmPart1 = await prisma.course.findUnique({ where: { id: 'frm_part1' } })
    if (frmPart1) {
      console.log('📝 Adding lessons for FRM Part 1...')
      await prisma.lesson.deleteMany({ where: { courseId: 'frm_part1' } })
      const lessons: LessonData[] = []
      const modules = [
        'Foundations of Risk Management',
        'Quantitative Analysis',
        'Financial Markets & Products',
        'Valuation & Risk Models',
      ]
      const lessonsPerModule = [25, 30, 35, 30]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `frm_part1_module${m+1}_lesson${l}`,
            courseId: 'frm_part1',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()} for FRM Part 1 examination with risk frameworks, mathematical models, and market instruments.`,
            duration: 22 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for FRM Part 1`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // FRM Part 2
    const frmPart2 = await prisma.course.findUnique({ where: { id: 'frm_part2' } })
    if (frmPart2) {
      console.log('📝 Adding lessons for FRM Part 2...')
      await prisma.lesson.deleteMany({ where: { courseId: 'frm_part2' } })
      const lessons: LessonData[] = []
      const modules = [
        'Market Risk Measurement',
        'Credit Risk Management',
        'Operational Risk Management',
        'Integrated Risk Management',
        'Current Issues in Financial Markets',
        'Risk Management Best Practices',
      ]
      const lessonsPerModule = [28, 30, 25, 25, 22, 20]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `frm_part2_module${m+1}_lesson${l}`,
            courseId: 'frm_part2',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Advanced lesson covering ${modules[m].toLowerCase()} for FRM Part 2 examination with advanced risk techniques, regulatory requirements, and practical case studies.`,
            duration: 25 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for FRM Part 2`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // Actuarial Science
    const actuarialScience = await prisma.course.findUnique({ where: { id: 'actuarial_science' } })
    if (actuarialScience) {
      console.log('📝 Adding lessons for Actuarial Science...')
      await prisma.lesson.deleteMany({ where: { courseId: 'actuarial_science' } })
      const lessons: LessonData[] = []
      const modules = [
        'Actuarial Mathematics',
        'Probability & Statistics',
        'Financial Mathematics',
        'Risk Models',
        'Life Contingencies',
        'General Insurance',
      ]
      const lessonsPerModule = [30, 35, 30, 25, 30, 25]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `actuarial_science_module${m+1}_lesson${l}`,
            courseId: 'actuarial_science',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Specialized lesson covering ${modules[m].toLowerCase()} for Actuarial Science examination with mathematical techniques, statistical methods, and actuarial modeling.`,
            duration: 25 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for Actuarial Science`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // ========================================================================
    // COMPETITIVE EXAMS
    // ========================================================================

    // UPSC Prelims
    const upscPrelims = await prisma.course.findUnique({ where: { id: 'upsc_prelims' } })
    if (upscPrelims) {
      console.log('📝 Adding lessons for UPSC Prelims...')
      await prisma.lesson.deleteMany({ where: { courseId: 'upsc_prelims' } })
      const lessons: LessonData[] = []
      const modules = [
        'Indian Polity',
        'Indian Economy',
        'Indian History',
        'Geography',
        'Environment & Ecology',
        'Science & Technology',
        'Current Affairs',
        'CSAT Paper II',
      ]
      const lessonsPerModule = [30, 28, 30, 28, 25, 25, 30, 25]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `upsc_prelims_module${m+1}_lesson${l}`,
            courseId: 'upsc_prelims',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()} for UPSC Prelims examination with conceptual clarity, NCERT-based content, and current affairs integration.`,
            duration: 25 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for UPSC Prelims`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // UPSC Mains
    const upscMains = await prisma.course.findUnique({ where: { id: 'upsc_mains' } })
    if (upscMains) {
      console.log('📝 Adding lessons for UPSC Mains...')
      await prisma.lesson.deleteMany({ where: { courseId: 'upsc_mains' } })
      const lessons: LessonData[] = []
      const modules = [
        'GS Paper I - Indian Heritage & Culture',
        'GS Paper II - Governance & Constitution',
        'GS Paper III - Economy & Security',
        'GS Paper IV - Ethics & Integrity',
        'Essay Writing',
        'Optional Subject Strategy',
        'Answer Writing Practice',
        'Current Affairs for Mains',
      ]
      const lessonsPerModule = [25, 30, 30, 25, 20, 30, 25, 25]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `upsc_mains_module${m+1}_lesson${l}`,
            courseId: 'upsc_mains',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Advanced lesson covering ${modules[m].toLowerCase()} for UPSC Mains examination with answer writing techniques, case studies, and content structuring.`,
            duration: 28 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for UPSC Mains`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // UPSC Interview
    const upscInterview = await prisma.course.findUnique({ where: { id: 'upsc_interview' } })
    if (upscInterview) {
      console.log('📝 Adding lessons for UPSC Interview...')
      await prisma.lesson.deleteMany({ where: { courseId: 'upsc_interview' } })
      const lessons: LessonData[] = []
      const modules = [
        'DAF Analysis & Preparation',
        'Current Affairs Deep Dive',
        'Background Questions',
        'Situational Questions',
        'Mock Interview Practice',
        'Personality Development',
        'Communication Skills',
        'Interview Ethics',
      ]
      const lessonsPerModule = [8, 10, 10, 8, 12, 8, 8, 6]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `upsc_interview_module${m+1}_lesson${l}`,
            courseId: 'upsc_interview',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Expert guidance lesson covering ${modules[m].toLowerCase()} for UPSC Interview with mock scenarios, confidence building, and communication techniques.`,
            duration: 20 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for UPSC Interview`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // SSC CGL
    const sscCGL = await prisma.course.findUnique({ where: { id: 'ssc_cgl' } })
    if (sscCGL) {
      console.log('📝 Adding lessons for SSC CGL...')
      await prisma.lesson.deleteMany({ where: { courseId: 'ssc_cgl' } })
      const lessons: LessonData[] = []
      const modules = [
        'Quantitative Aptitude',
        'English Language',
        'General Intelligence & Reasoning',
        'General Awareness',
        'Statistics (Paper III)',
        'Finance & Economics (Paper IV)',
      ]
      const lessonsPerModule = [35, 35, 35, 30, 25, 25]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `ssc_cgl_module${m+1}_lesson${l}`,
            courseId: 'ssc_cgl',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()} for SSC CGL examination with shortcut techniques, previous year questions, and time management strategies.`,
            duration: 18 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for SSC CGL`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // SSC CHSL
    const sscCHSL = await prisma.course.findUnique({ where: { id: 'ssc_chsl' } })
    if (sscCHSL) {
      console.log('📝 Adding lessons for SSC CHSL...')
      await prisma.lesson.deleteMany({ where: { courseId: 'ssc_chsl' } })
      const lessons: LessonData[] = []
      const modules = [
        'Quantitative Aptitude',
        'English Language',
        'General Intelligence & Reasoning',
        'General Awareness',
        'Typing & Data Entry',
      ]
      const lessonsPerModule = [30, 30, 30, 28, 10]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `ssc_chsl_module${m+1}_lesson${l}`,
            courseId: 'ssc_chsl',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Focused lesson covering ${modules[m].toLowerCase()} for SSC CHSL examination with practice exercises and exam-oriented content.`,
            duration: 16 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for SSC CHSL`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // SSC MTS
    const sscMTS = await prisma.course.findUnique({ where: { id: 'ssc_mts' } })
    if (sscMTS) {
      console.log('📝 Adding lessons for SSC MTS...')
      await prisma.lesson.deleteMany({ where: { courseId: 'ssc_mts' } })
      const lessons: LessonData[] = []
      const modules = [
        'Numerical Aptitude',
        'General Intelligence',
        'English Language',
        'General Awareness',
      ]
      const lessonsPerModule = [25, 25, 25, 25]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `ssc_mts_module${m+1}_lesson${l}`,
            courseId: 'ssc_mts',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Foundational lesson covering ${modules[m].toLowerCase()} for SSC MTS examination with basic concepts and practice questions.`,
            duration: 14 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for SSC MTS`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // SSC GD
    const sscGD = await prisma.course.findUnique({ where: { id: 'ssc_gd' } })
    if (sscGD) {
      console.log('📝 Adding lessons for SSC GD Constable...')
      await prisma.lesson.deleteMany({ where: { courseId: 'ssc_gd' } })
      const lessons: LessonData[] = []
      const modules = [
        'General Intelligence & Reasoning',
        'General Awareness',
        'Elementary Mathematics',
        'English/Hindi Language',
        'Physical Efficiency Test',
      ]
      const lessonsPerModule = [25, 30, 25, 25, 15]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `ssc_gd_module${m+1}_lesson${l}`,
            courseId: 'ssc_gd',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()} for SSC GD Constable examination with subject-specific preparation and physical test guidance.`,
            duration: 14 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for SSC GD Constable`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // Banking SBI
    const bankingSBI = await prisma.course.findUnique({ where: { id: 'banking_sbi' } })
    if (bankingSBI) {
      console.log('📝 Adding lessons for SBI PO & Clerk...')
      await prisma.lesson.deleteMany({ where: { courseId: 'banking_sbi' } })
      const lessons: LessonData[] = []
      const modules = [
        'Reasoning Ability',
        'Quantitative Aptitude',
        'English Language',
        'General Awareness',
        'Computer Knowledge',
        'Descriptive Test',
      ]
      const lessonsPerModule = [35, 40, 35, 30, 25, 15]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `banking_sbi_module${m+1}_lesson${l}`,
            courseId: 'banking_sbi',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Detailed lesson covering ${modules[m].toLowerCase()} for SBI PO & Clerk examination with banking-specific content and shortcut methods.`,
            duration: 18 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for SBI PO & Clerk`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // Banking IBPS
    const bankingIBPS = await prisma.course.findUnique({ where: { id: 'banking_ibps' } })
    if (bankingIBPS) {
      console.log('📝 Adding lessons for IBPS PO & Clerk...')
      await prisma.lesson.deleteMany({ where: { courseId: 'banking_ibps' } })
      const lessons: LessonData[] = []
      const modules = [
        'Reasoning Ability',
        'Quantitative Aptitude',
        'English Language',
        'General Awareness',
        'Computer Knowledge',
        'Interview Preparation',
      ]
      const lessonsPerModule = [35, 40, 35, 30, 25, 20]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `banking_ibps_module${m+1}_lesson${l}`,
            courseId: 'banking_ibps',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Comprehensive lesson covering ${modules[m].toLowerCase()} for IBPS PO & Clerk examination with comprehensive syllabus coverage and exam strategies.`,
            duration: 18 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for IBPS PO & Clerk`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // Banking RRB
    const bankingRRB = await prisma.course.findUnique({ where: { id: 'banking_rrb' } })
    if (bankingRRB) {
      console.log('📝 Adding lessons for RRB PO & Clerk...')
      await prisma.lesson.deleteMany({ where: { courseId: 'banking_rrb' } })
      const lessons: LessonData[] = []
      const modules = [
        'Reasoning',
        'Numerical Ability',
        'English Language',
        'General Awareness',
        'Computer Awareness',
      ]
      const lessonsPerModule = [30, 35, 30, 28, 22]
      let order = 1
      for (let m = 0; m < modules.length; m++) {
        for (let l = 1; l <= lessonsPerModule[m]; l++) {
          lessons.push({
            id: `banking_rrb_module${m+1}_lesson${l}`,
            courseId: 'banking_rrb',
            title: `${modules[m]} - Lesson ${l}`,
            content: `Focused lesson covering ${modules[m].toLowerCase()} for RRB examination with regional banking context and rural development focus.`,
            duration: 16 + l,
            order: order++,
            videoUrl: 'https://example.com/video',
            isActive: true,
          })
        }
      }
      await prisma.lesson.createMany({ data: lessons })
      console.log(`✅ Added ${lessons.length} lessons for RRB PO & Clerk`)
      totalLessonsAdded += lessons.length
      coursesProcessed++
    }

    // ========================================================================
    // PRINT SUMMARY
    // ========================================================================

    console.log('\n' + '='.repeat(80))
    console.log('📊 COMPREHENSIVE LESSON RESTORATION COMPLETE')
    console.log('='.repeat(80))
    console.log(`✅ Total courses processed: ${coursesProcessed}`)
    console.log(`✅ Total lessons added: ${totalLessonsAdded}`)
    console.log('='.repeat(80))
    console.log('🎉 All course lessons have been successfully restored!')
    console.log('='.repeat(80))

  } catch (error) {
    console.error('❌ Error adding lessons:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
