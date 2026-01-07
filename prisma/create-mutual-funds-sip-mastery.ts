import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting to seed Mutual Funds & SIP Mastery course...')

  const courseId = 'mutual-funds-sip-mastery'

  // Check if course already exists
  const existingCourse = await prisma.course.findUnique({
    where: { id: courseId },
  })

  if (existingCourse) {
    console.log(`⚠️ Course "${courseId}" already exists. Deleting old data...`)
    
    // Delete associated lessons first
    await prisma.lesson.deleteMany({
      where: { courseId: courseId },
    })
    
    // Delete the course
    await prisma.course.delete({
      where: { id: courseId },
    })
    
    console.log('🗑️ Old course data deleted.')
  }

  // Find existing instructor
  const instructor = await prisma.instructor.findFirst({
    where: { isActive: true },
  })
  
  const instructorId = instructor?.id || 'inst-stock-market-faculty'

  // Create the course
  const course = await prisma.course.upsert({
    where: { id: courseId },
    update: {},
    create: {
      id: courseId,
      title: 'Mutual Funds & SIP Mastery',
      description: 'Learn mutual funds and SIP investing for Indian investors. Master fund selection, asset allocation, risk management, taxation, and long-term wealth creation.',
      thumbnail: '/assets/courses/mutual-funds-sip-mastery.svg',
      difficulty: 'INTERMEDIATE',
      duration: 1080, // 18 hours in minutes
      instructorId: instructorId,
    },
  })

  console.log(`✅ Course created: ${course.title}`)

  // Create modules and lessons
  const modules = [
    {
      moduleNum: 1,
      title: 'Mutual Fund Basics',
      duration: 180, // 3 hours
      lessons: [
        { title: 'Introduction to Mutual Funds', duration: 25, order: 1 },
        { title: 'What are Mutual Funds', duration: 25, order: 2 },
        { title: 'How Mutual Funds Generate Returns', duration: 25, order: 3 },
        { title: 'NAV Explained Simply', duration: 25, order: 4 },
        { title: 'Types of Mutual Funds', duration: 25, order: 5 },
        { title: 'Direct vs Regular Plans', duration: 25, order: 6 },
        { title: 'Growth vs IDCW Options', duration: 20, order: 7 },
      ]
    },
    {
      moduleNum: 2,
      title: 'Mutual Fund Categories Explained',
      duration: 180, // 3 hours
      lessons: [
        { title: 'Equity Mutual Funds Overview', duration: 30, order: 8 },
        { title: 'Debt Mutual Funds Overview', duration: 30, order: 9 },
        { title: 'Hybrid Funds Explained', duration: 30, order: 10 },
        { title: 'Index Funds & ETFs', duration: 30, order: 11 },
        { title: 'Sector & Thematic Funds', duration: 30, order: 12 },
        { title: 'International Funds', duration: 30, order: 13 },
      ]
    },
    {
      moduleNum: 3,
      title: 'How to Select the Right Mutual Fund',
      duration: 180, // 3 hours
      lessons: [
        { title: 'Understanding Fund Objectives & Mandate', duration: 30, order: 14 },
        { title: 'Expense Ratio Impact on Returns', duration: 30, order: 15 },
        { title: 'Fund Manager Evaluation', duration: 30, order: 16 },
        { title: 'Rolling Returns vs Point Returns', duration: 30, order: 17 },
        { title: 'Understanding Risk Ratios', duration: 30, order: 18 },
        { title: 'Sharpe Ratio, Alpha & Beta Explained', duration: 30, order: 19 },
      ]
    },
    {
      moduleNum: 4,
      title: 'SIP Mastery (Systematic Investing)',
      duration: 240, // 4 hours
      lessons: [
        { title: 'SIP vs Lump Sum Investing', duration: 30, order: 20 },
        { title: 'Power of Compounding in SIP', duration: 30, order: 21 },
        { title: 'SIP During Market Corrections', duration: 30, order: 22 },
        { title: 'Step-Up SIP Strategies', duration: 30, order: 23 },
        { title: 'SIP Calculators & Projections', duration: 30, order: 24 },
        { title: 'Common SIP Myths Busted', duration: 30, order: 25 },
        { title: 'SIP Timing & Frequency', duration: 30, order: 26 },
        { title: 'SIP Calculator Practical Examples', duration: 30, order: 27 },
      ]
    },
    {
      moduleNum: 5,
      title: 'Risk Management & Asset Allocation',
      duration: 180, // 3 hours
      lessons: [
        { title: 'Equity-Debt Allocation Basics', duration: 30, order: 28 },
        { title: 'Age-Based Asset Allocation', duration: 30, order: 29 },
        { title: 'Goal-Based Portfolio Building', duration: 30, order: 30 },
        { title: 'Diversification Strategies', duration: 30, order: 31 },
        { title: 'Portfolio Rebalancing Techniques', duration: 30, order: 32 },
        { title: 'Risk Assessment for Investors', duration: 30, order: 33 },
      ]
    },
    {
      moduleNum: 6,
      title: 'Taxation, Regulations & Compliance',
      duration: 90, // 1.5 hours
      lessons: [
        { title: 'Taxation of Equity Funds', duration: 20, order: 34 },
        { title: 'Taxation of Debt Funds', duration: 20, order: 35 },
        { title: 'LTCG vs STCG Explained', duration: 20, order: 36 },
        { title: 'Understanding Exit Load', duration: 15, order: 37 },
        { title: 'SEBI Regulations for Mutual Funds', duration: 15, order: 38 },
      ]
    },
    {
      moduleNum: 7,
      title: 'Long-Term Wealth Creation Blueprint',
      duration: 30, // 0.5 hour
      lessons: [
        { title: 'Building Lifelong SIP Plans', duration: 10, order: 39 },
        { title: 'Common Investor Mistakes to Avoid', duration: 10, order: 40 },
        { title: 'Understanding Market Cycle Behavior', duration: 10, order: 41 },
        { title: 'Portfolio Review & Tracking', duration: 10, order: 42 },
      ]
    },
  ]

  // Create all lessons
  let lessonCount = 0
  for (const moduleData of modules) {
    for (const lessonData of moduleData.lessons) {
      await prisma.lesson.create({
        data: {
          title: lessonData.title,
          duration: lessonData.duration,
          order: lessonData.order,
          course: { connect: { id: courseId } },
          content: `Content for ${lessonData.title}`,
          videoUrl: `https://example.com/videos/${courseId}/lesson-${lessonData.order}.mp4`,
        },
      })
      lessonCount++
    }
    console.log(`✅ Created module: ${moduleData.title} (${moduleData.lessons.length} lessons)`)
  }

  console.log(`🎉 Successfully created ${lessonCount} lessons across ${modules.length} modules`)
  console.log('✨ Mutual Funds & SIP Mastery course seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding course:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
