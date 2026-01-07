import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating Risk Management Masterclass...')

  // Find existing instructor
  const instructor = await prisma.instructor.findFirst({
    where: { name: { contains: 'INR99', mode: 'insensitive' } }
  })

  const instructorId = instructor?.id || 'inst-stock-market-faculty'

  // Create the course
  const course = await prisma.course.upsert({
    where: { id: 'risk-management-masterclass' },
    update: {},
    create: {
      id: 'risk-management-masterclass',
      title: 'Risk Management Masterclass',
      description: 'Master the art of protecting capital first and growing it second. Learn position sizing, drawdown control, risk-reward optimization, expectancy, and emotional discipline.',
      thumbnail: '/assets/courses/risk-management-masterclass.svg',
      difficulty: 'ADVANCED',
      duration: 1500, // 25 hours in minutes
      instructorId: instructorId,
      learningPathId: null,
      isActive: true,
    },
  })

  console.log(`Course created: ${course.id}`)

  // Delete existing lessons for this course
  await prisma.lesson.deleteMany({
    where: { courseId: course.id }
  })

  // Delete existing assessments for this course
  await prisma.assessment.deleteMany({
    where: { courseId: course.id }
  })

  // Module 1: Risk Management Philosophy (3 hours = 180 minutes, 8 lessons)
  const module1Lessons = [
    { title: 'Introduction to Risk Management', duration: 20, order: 1 },
    { title: 'Why Traders Fail - Risk Perspective', duration: 25, order: 2 },
    { title: 'Capital Preservation Mindset', duration: 28, order: 3 },
    { title: 'Understanding Risk vs Uncertainty', duration: 24, order: 4 },
    { title: 'Probability & Randomness in Trading', duration: 26, order: 5 },
    { title: 'Professional Risk Thinking', duration: 25, order: 6 },
    { title: 'The 1% Rule Explained', duration: 18, order: 7 },
    { title: 'Risk Management Success Stories', duration: 14, order: 8 },
  ]

  // Module 2: Position Sizing Mastery (5 hours = 300 minutes, 10 lessons)
  const module2Lessons = [
    { title: 'Fixed Position Sizing', duration: 25, order: 101 },
    { title: 'Variable Position Sizing', duration: 28, order: 102 },
    { title: 'Percentage Risk Model Basics', duration: 30, order: 103 },
    { title: 'Advanced Percentage Risk', duration: 32, order: 104 },
    { title: 'Volatility-Based Position Sizing', duration: 35, order: 105 },
    { title: 'ATR Application for Sizing', duration: 30, order: 106 },
    { title: 'Risk Per Trade Logic', duration: 28, order: 107 },
    { title: 'Capital Growth Curves', duration: 32, order: 108 },
    { title: 'Position Sizing Case Studies', duration: 30, order: 109 },
    { title: 'Position Sizing Practice Exercise', duration: 30, order: 110 },
  ]

  // Module 3: Risk-Reward & Expectancy (4 hours = 240 minutes, 8 lessons)
  const module3Lessons = [
    { title: 'Risk-Reward Ratio Myths', duration: 25, order: 201 },
    { title: 'Win Rate vs Payoff Ratio', duration: 28, order: 202 },
    { title: 'Understanding Trade Expectancy', duration: 32, order: 203 },
    { title: 'Expectancy Formula Deep Dive', duration: 30, order: 204 },
    { title: 'System Profitability Mathematics', duration: 32, order: 205 },
    { title: 'Edge Validation Methods', duration: 30, order: 206 },
    { title: 'Positive vs Negative Expectancy', duration: 28, order: 207 },
    { title: 'Expectancy Calculation Exercise', duration: 35, order: 208 },
  ]

  // Module 4: Stop-Loss & Trade Invalidation (4 hours = 240 minutes, 8 lessons)
  const module4Lessons = [
    { title: 'Logical Stop-Loss Placement', duration: 28, order: 301 },
    { title: 'Technical Stop-Loss Strategies', duration: 30, order: 302 },
    { title: 'Volatility-Based Stops', duration: 32, order: 303 },
    { title: 'Hard Stops vs Mental Stops', duration: 28, order: 304 },
    { title: 'Avoiding Stop-Hunts', duration: 32, order: 305 },
    { title: 'Trailing Stop Strategies', duration: 30, order: 306 },
    { title: 'Exit Discipline Principles', duration: 30, order: 307 },
    { title: 'Stop-Loss Case Studies', duration: 30, order: 308 },
  ]

  // Module 5: Drawdown & Capital Protection (4 hours = 240 minutes, 8 lessons)
  const module5Lessons = [
    { title: 'Understanding Maximum Drawdown', duration: 28, order: 401 },
    { title: 'Drawdown Calculation Methods', duration: 30, order: 402 },
    { title: 'Recovery Factor Explained', duration: 32, order: 403 },
    { title: 'Surviving Losing Streaks', duration: 30, order: 404 },
    { title: 'Capital Scaling Rules', duration: 28, order: 405 },
    { title: 'When to Stop Trading', duration: 32, order: 406 },
    { title: 'Account Protection Strategies', duration: 30, order: 407 },
    { title: 'Drawdown Recovery Planning', duration: 30, order: 408 },
  ]

  // Module 6: Psychological Risk & Discipline (3 hours = 180 minutes, 6 lessons)
  const module6Lessons = [
    { title: 'Emotional Risk in Trading', duration: 28, order: 501 },
    { title: 'Revenge Trading Prevention', duration: 30, order: 502 },
    { title: 'Overtrading Control', duration: 32, order: 503 },
    { title: 'Fear & Greed Cycles', duration: 30, order: 504 },
    { title: 'Building Trader Discipline', duration: 32, order: 505 },
    { title: 'Psychological Risk Exercise', duration: 28, order: 506 },
  ]

  // Module 7: Build Your Risk Management Plan (2 hours = 120 minutes, 4 lessons)
  const module7Lessons = [
    { title: 'Creating Your Risk Rulebook', duration: 28, order: 701 },
    { title: 'Setting Daily Loss Limits', duration: 30, order: 702 },
    { title: 'Weekly & Monthly Risk Reviews', duration: 32, order: 703 },
    { title: 'Trade Journal Integration', duration: 30, order: 704 },
  ]

  // Combine all lessons
  const allLessons = [
    ...module1Lessons,
    ...module2Lessons,
    ...module3Lessons,
    ...module4Lessons,
    ...module5Lessons,
    ...module6Lessons,
    ...module7Lessons,
  ]

  console.log(`Creating ${allLessons.length} lessons...`)

  // Create all lessons
  for (const lesson of allLessons) {
    await prisma.lesson.create({
      data: {
        courseId: course.id,
        title: lesson.title,
        content: `Content for ${lesson.title}`,
        duration: lesson.duration,
        order: lesson.order,
        videoUrl: null,
        isActive: true,
      },
    })
  }

  console.log('Lessons created successfully!')

  // Create assessments
  const assessments = [
    { title: 'Risk Management Fundamentals Quiz', type: 'QUIZ' as const },
    { title: 'Position Sizing Assessment', type: 'QUIZ' as const },
    { title: 'Risk-Reward & Expectancy Quiz', type: 'QUIZ' as const },
    { title: 'Risk Management Plan Project', type: 'SCENARIO' as const },
    { title: 'Final Certification Assessment', type: 'PRACTICE' as const },
  ]

  for (const assessment of assessments) {
    await prisma.assessment.create({
      data: {
        courseId: course.id,
        title: assessment.title,
        type: assessment.type,
        isActive: true,
      },
    })
  }

  console.log('Assessments created successfully!')
  console.log('Risk Management Masterclass setup complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
