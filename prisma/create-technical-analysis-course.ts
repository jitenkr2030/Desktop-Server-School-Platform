import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating Technical Analysis Master Course...')

  // Find existing instructor
  const instructor = await prisma.instructor.findFirst({
    where: { name: { contains: 'INR99', mode: 'insensitive' } }
  })

  if (!instructor) {
    console.log('Creating new instructor...')
    // Create instructor if not exists
  }

  const instructorId = instructor?.id || 'inst-stock-market-faculty'

  // Create the course
  const course = await prisma.course.upsert({
    where: { id: 'technical-analysis-master' },
    update: {},
    create: {
      id: 'technical-analysis-master',
      title: 'Technical Analysis Master Course',
      description: 'Master price-based market analysis, read charts like professionals, and make data-driven trading decisions using technical analysis.',
      thumbnail: '/assets/courses/technical-analysis-master.svg',
      difficulty: 'ADVANCED',
      duration: 3000, // 50 hours in minutes
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

  // Module 1: Foundations of Technical Analysis (4 hours = 240 minutes, 10 lessons)
  const module1Lessons = [
    { title: 'Introduction to Technical Analysis', duration: 20, order: 1 },
    { title: 'History & Evolution of Technical Analysis', duration: 22, order: 2 },
    { title: 'Dow Theory & Market Assumptions', duration: 25, order: 3 },
    { title: 'Understanding Price Action', duration: 24, order: 4 },
    { title: 'Role of Volume in Technical Analysis', duration: 22, order: 5 },
    { title: 'Time Frames in Trading', duration: 20, order: 6 },
    { title: 'Market Trends & Their Phases', duration: 25, order: 7 },
    { title: 'Technical Analysis vs Fundamental Analysis', duration: 28, order: 8 },
    { title: 'Common Misconceptions about TA', duration: 24, order: 9 },
    { title: 'Setting Up Your Trading Workspace', duration: 30, order: 10 },
  ]

  // Module 2: Candlestick Analysis (6 hours = 360 minutes, 12 lessons)
  const module2Lessons = [
    { title: 'Candlestick Structure & Anatomy', duration: 25, order: 101 },
    { title: 'Understanding Candlestick Psychology', duration: 28, order: 102 },
    { title: 'Single Candlestick Patterns - Hammers', duration: 30, order: 103 },
    { title: 'Single Candlestick Patterns - Dojis', duration: 28, order: 104 },
    { title: 'Double Candlestick Patterns - Engulfing', duration: 32, order: 105 },
    { title: 'Double Candlestick Patterns - Tweezers', duration: 28, order: 106 },
    { title: 'Multi-Candlestick Patterns - Three Soldiers', duration: 30, order: 107 },
    { title: 'Multi-Candlestick Patterns - Three Crows', duration: 28, order: 108 },
    { title: 'Reversal vs Continuation Signals', duration: 32, order: 109 },
    { title: 'Pattern Reliability & Confirmation', duration: 35, order: 110 },
    { title: 'Reading Candles on Indian Stocks', duration: 34, order: 111 },
    { title: 'Live Chart Examples & Practice', duration: 30, order: 112 },
  ]

  // Module 3: Chart Patterns Mastery (6 hours = 360 minutes, 12 lessons)
  const module3Lessons = [
    { title: 'Introduction to Chart Patterns', duration: 25, order: 201 },
    { title: 'Trend Continuation Patterns - Flags', duration: 30, order: 202 },
    { title: 'Trend Continuation Patterns - Pennants', duration: 28, order: 203 },
    { title: 'Trend Continuation Patterns - Triangles', duration: 32, order: 204 },
    { title: 'Reversal Patterns - Head & Shoulders', duration: 35, order: 205 },
    { title: 'Reversal Patterns - Double Top & Bottom', duration: 32, order: 206 },
    { title: 'Reversal Patterns - Rounding Bottom', duration: 28, order: 207 },
    { title: 'Understanding Breakouts & Fakeouts', duration: 30, order: 208 },
    { title: 'Measuring Pattern Targets', duration: 32, order: 209 },
    { title: 'Setting Stop-Loss for Patterns', duration: 28, order: 210 },
    { title: 'Pattern Failure Analysis', duration: 30, order: 211 },
    { title: 'Pattern Trading on Nifty & Bank Nifty', duration: 30, order: 212 },
  ]

  // Module 4: Support, Resistance & Market Structure (5 hours = 300 minutes, 10 lessons)
  const module4Lessons = [
    { title: 'Understanding Support Levels', duration: 28, order: 301 },
    { title: 'Understanding Resistance Levels', duration: 28, order: 302 },
    { title: 'Horizontal Support & Resistance', duration: 32, order: 303 },
    { title: 'Dynamic Support & Resistance', duration: 30, order: 304 },
    { title: 'Identifying Supply & Demand Zones', duration: 35, order: 305 },
    { title: 'Drawing Trendlines Correctly', duration: 30, order: 306 },
    { title: 'Price Channels & Their Use', duration: 28, order: 307 },
    { title: 'Market Structure & Swing Points', duration: 32, order: 308 },
    { title: 'Structure Break & Retest Strategy', duration: 30, order: 309 },
    { title: 'Reading Institutional Footprints', duration: 27, order: 310 },
  ]

  // Module 5: Technical Indicators (Advanced Usage) (7 hours = 420 minutes, 14 lessons)
  const module5Lessons = [
    { title: 'Introduction to Technical Indicators', duration: 25, order: 401 },
    { title: 'Simple Moving Average (SMA)', duration: 30, order: 402 },
    { title: 'Exponential Moving Average (EMA)', duration: 32, order: 403 },
    { title: 'VWAP - Volume Weighted Average Price', duration: 35, order: 404 },
    { title: 'Moving Average Crossover Strategies', duration: 32, order: 405 },
    { title: 'RSI - Relative Strength Index Basics', duration: 30, order: 406 },
    { title: 'RSI Advanced Concepts & Divergences', duration: 35, order: 407 },
    { title: 'MACD - Moving Average Convergence Divergence', duration: 32, order: 408 },
    { title: 'Stochastic Oscillator Explained', duration: 30, order: 409 },
    { title: 'ATR - Average True Range', duration: 28, order: 410 },
    { title: 'Bollinger Bands Deep Dive', duration: 32, order: 411 },
    { title: 'Combining Multiple Indicators', duration: 35, order: 412 },
    { title: 'Avoiding Indicator Overload', duration: 28, order: 413 },
    { title: 'Custom Indicator Setup for Indian Markets', duration: 36, order: 414 },
  ]

  // Module 6: Volume & Price Relationship (5 hours = 300 minutes, 10 lessons)
  const module6Lessons = [
    { title: 'Volume Analysis Fundamentals', duration: 28, order: 501 },
    { title: 'Interpreting Volume Spikes', duration: 30, order: 502 },
    { title: 'Volume Breakout Confirmation', duration: 32, order: 503 },
    { title: 'Volume Divergence Trading', duration: 35, order: 504 },
    { title: 'Institutional Accumulation Patterns', duration: 32, order: 505 },
    { title: 'Institutional Distribution Patterns', duration: 30, order: 506 },
    { title: 'On-Balance Volume (OBV)', duration: 28, order: 507 },
    { title: 'VWAP for Intraday Trading', duration: 30, order: 508 },
    { title: 'Volume Price Confirmation Strategies', duration: 30, order: 509 },
    { title: 'Practical Volume Trading Exercises', duration: 25, order: 510 },
  ]

  // Module 7: Timeframes & Multi-Timeframe Analysis (4 hours = 240 minutes, 8 lessons)
  const module7Lessons = [
    { title: 'Intraday Timeframes Explained', duration: 28, order: 601 },
    { title: 'Swing Trading Timeframes', duration: 28, order: 602 },
    { title: 'Positional Trading Timeframes', duration: 25, order: 603 },
    { title: 'Top-Down Analysis Approach', duration: 32, order: 604 },
    { title: 'Multi-Timeframe Alignment Strategy', duration: 35, order: 605 },
    { title: 'Precision in Entry & Exit', duration: 30, order: 606 },
    { title: 'Filtering Trades with Timeframes', duration: 32, order: 607 },
    { title: 'Timeframe Trading Exercise', duration: 30, order: 608 },
  ]

  // Module 8: Risk Management Using Technicals (5 hours = 300 minutes, 10 lessons)
  const module8Lessons = [
    { title: 'Stop-Loss Placement Logic', duration: 28, order: 701 },
    { title: 'Technical Stop-Loss Placement', duration: 30, order: 702 },
    { title: 'Risk-Reward Ratio Calculation', duration: 32, order: 703 },
    { title: 'Position Sizing Using Charts', duration: 30, order: 704 },
    { title: 'Drawdown Control Strategies', duration: 28, order: 705 },
    { title: 'Technical Invalidation Points', duration: 32, order: 706 },
    { title: 'Portfolio Risk Management', duration: 30, order: 707 },
    { title: 'Using ATR for Risk Management', duration: 28, order: 708 },
    { title: 'Scaling In & Out Strategies', duration: 32, order: 709 },
    { title: 'Risk Management Case Studies', duration: 30, order: 710 },
  ]

  // Module 9: Trading Psychology & Discipline (4 hours = 240 minutes, 8 lessons)
  const module9Lessons = [
    { title: 'Chart-Based Emotional Traps', duration: 28, order: 801 },
    { title: 'Fear & Greed in Trading', duration: 30, order: 802 },
    { title: 'Overtrading Prevention', duration: 32, order: 803 },
    { title: 'Building Trading Discipline', duration: 30, order: 804 },
    { title: 'Creating Trading Rules', duration: 28, order: 805 },
    { title: 'Handling Losing Streaks', duration: 30, order: 806 },
    { title: 'Developing Consistency Mindset', duration: 32, order: 807 },
    { title: 'Psychology Practice Exercises', duration: 30, order: 808 },
  ]

  // Module 10: Build Your Technical Trading System (4 hours = 240 minutes, 8 lessons)
  const module10Lessons = [
    { title: 'Strategy Framework Design', duration: 28, order: 901 },
    { title: 'Defining Entry Criteria', duration: 30, order: 902 },
    { title: 'Defining Exit Criteria', duration: 28, order: 903 },
    { title: 'Backtesting Your Strategy', duration: 32, order: 904 },
    { title: 'Creating a Trade Checklist', duration: 28, order: 905 },
    { title: 'Trading Journal Template', duration: 30, order: 906 },
    { title: 'Review & Improvement Process', duration: 32, order: 907 },
    { title: 'Long-Term Growth Plan', duration: 32, order: 908 },
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
    ...module8Lessons,
    ...module9Lessons,
    ...module10Lessons,
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
    { title: 'Technical Analysis Foundations Quiz', type: 'QUIZ' as const },
    { title: 'Candlestick & Patterns Assessment', type: 'QUIZ' as const },
    { title: 'Indicators & Analysis Quiz', type: 'QUIZ' as const },
    { title: 'Trading System Project', type: 'SCENARIO' as const },
    { title: 'Final Certification Assessment', type: 'PRACTICE' as const },
  ]

  for (let i = 0; i < assessments.length; i++) {
    await prisma.assessment.create({
      data: {
        courseId: course.id,
        title: assessments[i].title,
        type: assessments[i].type,
        isActive: true,
      },
    })
  }

  console.log('Assessments created successfully!')
  console.log('Technical Analysis Master Course setup complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
