import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log(' 🌱 Starting CS Foundation course creation...')

  const courseId = 'cs_foundation'
  const categoryId = 'cat_cs' // CS courses category

  // Check if category exists, create if not
  let category = await prisma.category.findFirst({
    where: { id: categoryId }
  })

  if (!category) {
    category = await prisma.category.create({
      data: {
        id: categoryId,
        name: 'Company Secretary',
        slug: 'company-secretary',
        description: 'Complete Company Secretary courses for ICSI exams'
      }
    })
    console.log('✅ Created CS category')
  }

  // Cleanup existing course data
  console.log('🧹 Cleaning up existing CS Foundation data...')
  await prisma.assessment.deleteMany({ where: { courseId: courseId } })
  await prisma.lesson.deleteMany({ where: { courseId: courseId } })
  await prisma.subCategory.deleteMany({ where: { categoryId: categoryId, slug: { in: ['cs-foundation', 'cs-foundation-paper-1', 'cs-foundation-paper-2', 'cs-foundation-paper-3', 'cs-foundation-paper-4'] } } })
  await prisma.course.deleteMany({ where: { id: courseId } })
  console.log('✅ Cleanup complete')

  // Create course
  console.log('📚 Creating CS Foundation course...')
  const course = await prisma.course.create({
    data: {
      id: courseId,
      title: 'CS Foundation Complete Course',
      description: 'Complete conceptual and exam-oriented preparation for the Company Secretary (CS) Foundation Programme by ICSI. Build a strong base in law, business environment, economics, and accounting.',
      difficulty: 'BEGINNER',
      duration: 4800, // 80 hours in minutes
      price: 99,
      thumbnail: '/assets/courses/cs-foundation.svg',
      isActive: true,
      categoryId: categoryId,
      subcategories: {
        create: [
          { name: 'CS Foundation', slug: 'cs-foundation', categoryId: categoryId }
        ]
      },
      instructor: {
        connect: { id: 'inst_professional' }
      }
    }
  })
  console.log('✅ Course created:', course.title)

  // Define lessons with order numbers for module grouping
  const lessonsData = [
    // Module 1: Business Environment & Law (Paper 1) - Orders 1-99
    { title: 'Business Environment – Meaning & Scope', duration: 140, order: 1 },
    { title: 'Forms of Business Organization', duration: 150, order: 2 },
    { title: 'Entrepreneurship & MSMEs', duration: 130, order: 3 },
    { title: 'Introduction to Company Law', duration: 160, order: 4 },
    { title: 'Company Formation & Incorporation', duration: 150, order: 5 },
    { title: 'Basic Corporate Governance Concepts', duration: 140, order: 6 },
    { title: 'Indian Contract Act – Essentials', duration: 160, order: 7 },
    { title: 'Sale of Goods Act – Overview', duration: 130, order: 8 },
    { title: 'Case Studies & MCQs Practice', duration: 140, order: 9 },

    // Module 2: Business Management, Ethics & Entrepreneurship (Paper 2) - Orders 100-199
    { title: 'Principles of Management', duration: 140, order: 101 },
    { title: 'Planning, Organising & Staffing', duration: 150, order: 102 },
    { title: 'Directing & Controlling', duration: 140, order: 103 },
    { title: 'Leadership & Motivation', duration: 150, order: 104 },
    { title: 'Business Ethics & Values', duration: 130, order: 105 },
    { title: 'Corporate Social Responsibility (CSR)', duration: 140, order: 106 },
    { title: 'Entrepreneurship Development', duration: 150, order: 107 },
    { title: 'Startup Ecosystem in India', duration: 130, order: 108 },
    { title: 'Case-based Questions & MCQs', duration: 140, order: 109 },

    // Module 3: Business Economics (Paper 3) - Orders 200-299
    { title: 'Nature & Scope of Economics', duration: 130, order: 201 },
    { title: 'Basic Economic Problems', duration: 140, order: 202 },
    { title: 'Demand Analysis & Elasticity', duration: 150, order: 203 },
    { title: 'Supply & Market Equilibrium', duration: 140, order: 204 },
    { title: 'Production & Cost', duration: 150, order: 205 },
    { title: 'Market Structures', duration: 140, order: 206 },
    { title: 'National Income & Inflation', duration: 150, order: 207 },
    { title: 'Indian Economic Environment', duration: 140, order: 208 },
    { title: 'Practice Questions & MCQs', duration: 140, order: 209 },

    // Module 4: Fundamentals of Accounting & Auditing (Paper 4) - Orders 300-399
    { title: 'Introduction to Accounting', duration: 140, order: 301 },
    { title: 'Accounting Concepts & Conventions', duration: 150, order: 302 },
    { title: 'Journal, Ledger & Trial Balance', duration: 160, order: 303 },
    { title: 'Cash Book & Bank Reconciliation', duration: 150, order: 304 },
    { title: 'Depreciation Accounting', duration: 150, order: 305 },
    { title: 'Final Accounts (Basics)', duration: 160, order: 306 },
    { title: 'Fundamentals of Auditing', duration: 140, order: 307 },
    { title: 'Types of Audit', duration: 130, order: 308 },
    { title: 'Numerical Practice & MCQs', duration: 150, order: 309 },
  ]

  console.log('📝 Creating 36 lessons across 4 modules...')

  for (const lessonData of lessonsData) {
    await prisma.lesson.create({
      data: {
        title: lessonData.title,
        duration: lessonData.duration,
        order: lessonData.order,
        courseId: courseId,
        isActive: true
      }
    })
    console.log(`✅ Lesson ${lessonData.order}: ${lessonData.title}`)
  }

  // Create assessments
  console.log('📊 Creating assessments...')
  await prisma.assessment.create({
    data: {
      title: 'Module 1: Business Environment & Law Mock Test',
      type: 'QUIZ',
      courseId: courseId,
      duration: 30,
      passingScore: 40
    }
  })
  await prisma.assessment.create({
    data: {
      title: 'Module 2: Business Management & Ethics Quiz',
      type: 'QUIZ',
      courseId: courseId,
      duration: 30,
      passingScore: 40
    }
  })
  await prisma.assessment.create({
    data: {
      title: 'Module 3: Business Economics Assessment',
      type: 'QUIZ',
      courseId: courseId,
      duration: 30,
      passingScore: 40
    }
  })
  await prisma.assessment.create({
    data: {
      title: 'Module 4: Accounting & Auditing Practice Test',
      type: 'QUIZ',
      courseId: courseId,
      duration: 30,
      passingScore: 40
    }
  })
  await prisma.assessment.create({
    data: {
      title: 'CS Foundation Complete Mock Test',
      type: 'PRACTICE',
      courseId: courseId,
      duration: 180,
      passingScore: 50
    }
  })
  console.log('✅ Assessments created')

  // Update course duration
  const totalDuration = lessonsData.reduce((sum, lesson) => sum + lesson.duration, 0)
  await prisma.course.update({
    where: { id: courseId },
    data: { duration: totalDuration }
  })

  console.log('============================================================')
  console.log('🎉 CS Foundation Complete Course created successfully!')
  console.log('============================================================')
  console.log('📖 Course:', course.title)
  console.log('📁 Course ID:', course.id)
  console.log('📊 Structure Summary:')
  console.log('   📚 Total Modules: 4 (4 Papers)')
  console.log('   📝 Total Lessons:', lessonsData.length)
  console.log('   ⏱️ Total Duration:', totalDuration, 'minutes (', Math.round(totalDuration / 60), 'hours)')
  console.log('   📝 Total Assessments: 5')
  console.log('📚 Modules Breakdown:')
  console.log('   1. Business Environment & Law (Paper 1) (9 lessons, 20h)')
  console.log('   2. Business Management, Ethics & Entrepreneurship (Paper 2) (9 lessons, 20h)')
  console.log('   3. Business Economics (Paper 3) (9 lessons, 20h)')
  console.log('   4. Fundamentals of Accounting & Auditing (Paper 4) (9 lessons, 20h)')
  console.log('✅ Ready to publish!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
