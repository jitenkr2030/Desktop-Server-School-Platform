import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating lessons for remaining career courses...')

  // Career6: Entrepreneurship Essentials (INTERMEDIATE, 600 min) - 6 modules x 100 lessons each
  const career6 = await prisma.course.findUnique({ where: { id: 'career6' } })
  if (career6) {
    console.log('Creating lessons for career6: Entrepreneurship Essentials...')
    // Delete existing lessons first
    await prisma.lesson.deleteMany({ where: { courseId: career6.id } })
    
    const modules = [
      { name: 'Entrepreneurial Mindset & Opportunity Recognition', order: 100 },
      { name: 'Business Model Development & Validation', order: 200 },
      { name: 'Financial Planning & Resource Management', order: 300 },
      { name: 'Team Building & Leadership', order: 400 },
      { name: 'Growth Strategies & Scaling', order: 500 },
      { name: 'Exit Strategies & Long-term Success', order: 600 },
    ]
    
    const lessons = []
    let lessonNum = 0
    
    for (const module of modules) {
      for (let i = 1; i <= 100; i++) {
        lessonNum++
        lessons.push({
          courseId: career6.id,
          title: `${module.name} - Lesson ${i}`,
          content: `Comprehensive lesson covering key aspects of ${module.name.toLowerCase()}. This lesson provides in-depth knowledge and practical insights for aspiring entrepreneurs. Topics include opportunity analysis, business planning, financial management, leadership skills, and strategic growth.`,
          videoUrl: 'https://example.com/video',
          duration: 6,
          order: module.order + i,
          isActive: true,
        })
      }
    }
    
    await prisma.lesson.createMany({ data: lessons })
    console.log(`Created ${lessonNum} lessons for Entrepreneurship Essentials`)
  }

  // Career7: Financial Management (ADVANCED, 620 min) - 6 modules x 100 lessons each
  const career7 = await prisma.course.findUnique({ where: { id: 'career7' } })
  if (career7) {
    console.log('Creating lessons for career7: Financial Management...')
    await prisma.lesson.deleteMany({ where: { courseId: career7.id } })
    
    const modules = [
      { name: 'Financial Analysis & Statement Analysis', order: 100 },
      { name: 'Corporate Finance & Capital Structure', order: 200 },
      { name: 'Investment Analysis & Portfolio Management', order: 300 },
      { name: 'Risk Management & Hedging Strategies', order: 400 },
      { name: 'Financial Planning & Forecasting', order: 500 },
      { name: 'Advanced Topics in Finance', order: 600 },
    ]
    
    const lessons = []
    let lessonNum = 0
    
    for (const module of modules) {
      for (let i = 1; i <= 100; i++) {
        lessonNum++
        lessons.push({
          courseId: career7.id,
          title: `${module.name} - Lesson ${i}`,
          content: `Comprehensive lesson covering essential concepts in ${module.name.toLowerCase()}. This lesson provides detailed explanations of financial theories, practical applications, and real-world case studies for financial professionals.`,
          videoUrl: 'https://example.com/video',
          duration: 6,
          order: module.order + i,
          isActive: true,
        })
      }
    }
    
    await prisma.lesson.createMany({ data: lessons })
    console.log(`Created ${lessonNum} lessons for Financial Management`)
  }

  // Career8: Project Management (INTERMEDIATE, 640 min) - 6 modules x 100 lessons each
  const career8 = await prisma.course.findUnique({ where: { id: 'career8' } })
  if (career8) {
    console.log('Creating lessons for career8: Project Management...')
    await prisma.lesson.deleteMany({ where: { courseId: career8.id } })
    
    const modules = [
      { name: 'Project Management Fundamentals', order: 100 },
      { name: 'Project Planning & Scheduling', order: 200 },
      { name: 'Risk & Quality Management', order: 300 },
      { name: 'Agile & Scrum Methodologies', order: 400 },
      { name: 'Team Leadership & Communication', order: 500 },
      { name: 'Project Execution & Closure', order: 600 },
    ]
    
    const lessons = []
    let lessonNum = 0
    
    for (const module of modules) {
      for (let i = 1; i <= 100; i++) {
        lessonNum++
        lessons.push({
          courseId: career8.id,
          title: `${module.name} - Lesson ${i}`,
          content: `Comprehensive lesson covering critical aspects of ${module.name.toLowerCase()}. This lesson explores project management methodologies, tools, and best practices for delivering successful projects on time and within budget.`,
          videoUrl: 'https://example.com/video',
          duration: 6,
          order: module.order + i,
          isActive: true,
        })
      }
    }
    
    await prisma.lesson.createMany({ data: lessons })
    console.log(`Created ${lessonNum} lessons for Project Management`)
  }

  // Career12: Photography & Digital Art - Add remaining 184 lessons (currently has 16)
  const career12 = await prisma.course.findUnique({ where: { id: 'career12' } })
  if (career12) {
    console.log('Adding remaining lessons for career12: Photography & Digital Art...')
    
    const existingLessons = await prisma.lesson.count({ where: { courseId: career12.id } })
    console.log(`Found ${existingLessons} existing lessons`)
    
    if (existingLessons < 200) {
      const modules = [
        { name: 'Photography Basics & Camera Operation', order: 100 },
        { name: 'Composition & Visual Storytelling', order: 200 },
        { name: 'Lighting Techniques', order: 300 },
        { name: 'Post-Processing & Editing', order: 400 },
        { name: 'Digital Art & Illustration', order: 500 },
        { name: 'Advanced Creative Techniques', order: 600 },
      ]
      
      const lessons = []
      let lessonNum = 0
      
      for (const module of modules) {
        for (let i = 1; i <= 100; i++) {
          lessonNum++
          lessons.push({
            courseId: career12.id,
            title: `${module.name} - Lesson ${i}`,
            content: `Comprehensive lesson covering creative concepts in ${module.name.toLowerCase()}. This lesson provides hands-on techniques, artistic principles, and professional insights for photographers and digital artists.`,
            videoUrl: 'https://example.com/video',
            duration: 7,
            order: module.order + i,
            isActive: true,
          })
        }
      }
      
      // Delete existing and recreate all
      await prisma.lesson.deleteMany({ where: { courseId: career12.id } })
      await prisma.lesson.createMany({ data: lessons })
      console.log(`Created 200 lessons for Photography & Digital Art`)
    }
  }

  // Career13: Digital Marketing Mastery (INTERMEDIATE, 740 min) - 7 modules x 100 lessons each
  const career13 = await prisma.course.findUnique({ where: { id: 'career13' } })
  if (career13) {
    console.log('Creating lessons for career13: Digital Marketing Mastery...')
    await prisma.lesson.deleteMany({ where: { courseId: career13.id } })
    
    const modules = [
      { name: 'Digital Marketing Fundamentals', order: 100 },
      { name: 'Search Engine Optimization (SEO)', order: 200 },
      { name: 'Social Media Marketing', order: 300 },
      { name: 'Content Marketing & Strategy', order: 400 },
      { name: 'Pay-Per-Click Advertising', order: 500 },
      { name: 'Email Marketing & Automation', order: 600 },
      { name: 'Analytics & Performance Optimization', order: 700 },
    ]
    
    const lessons = []
    let lessonNum = 0
    
    for (const module of modules) {
      for (let i = 1; i <= 100; i++) {
        lessonNum++
        lessons.push({
          courseId: career13.id,
          title: `${module.name} - Lesson ${i}`,
          content: `Comprehensive lesson covering strategic approaches to ${module.name.toLowerCase()}. This lesson explores digital marketing tactics, platform-specific strategies, and measurement techniques for maximizing online marketing ROI.`,
          videoUrl: 'https://example.com/video',
          duration: 7,
          order: module.order + i,
          isActive: true,
        })
      }
    }
    
    await prisma.lesson.createMany({ data: lessons })
    console.log(`Created ${lessonNum} lessons for Digital Marketing Mastery`)
  }

  // Career15: Social Media Management (INTERMEDIATE, 780 min) - 7 modules x 100 lessons each
  const career15 = await prisma.course.findUnique({ where: { id: 'career15' } })
  if (career15) {
    console.log('Creating lessons for career15: Social Media Management...')
    await prisma.lesson.deleteMany({ where: { courseId: career15.id } })
    
    const modules = [
      { name: 'Social Media Landscape Overview', order: 100 },
      { name: 'Content Creation for Social Media', order: 200 },
      { name: 'Community Management & Engagement', order: 300 },
      { name: 'Platform-Specific Strategies', order: 400 },
      { name: 'Social Media Advertising', order: 500 },
      { name: 'Influencer Marketing', order: 600 },
      { name: 'Analytics & Reporting', order: 700 },
    ]
    
    const lessons = []
    let lessonNum = 0
    
    for (const module of modules) {
      for (let i = 1; i <= 100; i++) {
        lessonNum++
        lessons.push({
          courseId: career15.id,
          title: `${module.name} - Lesson ${i}`,
          content: `Comprehensive lesson covering essential skills for ${module.name.toLowerCase()}. This lesson provides practical knowledge about social media platforms, content strategies, community engagement, and performance measurement.`,
          videoUrl: 'https://example.com/video',
          duration: 8,
          order: module.order + i,
          isActive: true,
        })
      }
    }
    
    await prisma.lesson.createMany({ data: lessons })
    console.log(`Created ${lessonNum} lessons for Social Media Management`)
  }

  // Career16: Brand Strategy & Management (ADVANCED, 800 min) - 8 modules x 100 lessons each
  const career16 = await prisma.course.findUnique({ where: { id: 'career16' } })
  if (career16) {
    console.log('Creating lessons for career16: Brand Strategy & Management...')
    await prisma.lesson.deleteMany({ where: { courseId: career16.id } })
    
    const modules = [
      { name: 'Brand Foundation & Identity', order: 100 },
      { name: 'Brand Positioning & Messaging', order: 200 },
      { name: 'Visual Identity Systems', order: 300 },
      { name: 'Brand Architecture', order: 400 },
      { name: 'Brand Experience Design', order: 500 },
      { name: 'Digital Brand Management', order: 600 },
      { name: 'Brand Equity & Valuation', order: 700 },
      { name: 'Crisis Management & Brand Protection', order: 800 },
    ]
    
    const lessons = []
    let lessonNum = 0
    
    for (const module of modules) {
      for (let i = 1; i <= 100; i++) {
        lessonNum++
        lessons.push({
          courseId: career16.id,
          title: `${module.name} - Lesson ${i}`,
          content: `Comprehensive lesson covering strategic principles of ${module.name.toLowerCase()}. This lesson explores brand development frameworks, creative strategies, management techniques, and protection mechanisms for building strong brands.`,
          videoUrl: 'https://example.com/video',
          duration: 8,
          order: module.order + i,
          isActive: true,
        })
      }
    }
    
    await prisma.lesson.createMany({ data: lessons })
    console.log(`Created ${lessonNum} lessons for Brand Strategy & Management`)
  }

  console.log('All remaining career courses have been populated!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
