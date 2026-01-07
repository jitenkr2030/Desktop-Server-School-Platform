import { db } from '../src/lib/db'

async function main() {
  console.log('Creating Options Trading Mastery course...')

  // Check if course already exists
  const existingCourse = await db.course.findFirst({
    where: {
      OR: [
        { id: 'options-trading-mastery' },
        { title: 'Options Trading Mastery' }
      ]
    }
  })

  if (existingCourse) {
    console.log('Course already exists:', existingCourse.id)
    return
  }

  // Create the course
  const course = await db.course.create({
    data: {
      id: 'options-trading-mastery',
      title: 'Options Trading Mastery',
      description: 'Master options trading from a professional and risk-managed perspective. Covers option pricing, Greeks, volatility, advanced strategies, hedging, and real-market execution with India-specific examples.',
      difficulty: 'ADVANCED',
      duration: 2700, // 45 hours in minutes
      thumbnail: '/assets/courses/options-trading-mastery.svg',
      learningPathId: 'investment-trading',
      instructorId: 'inst-stock-market-faculty',
      isActive: true,
    }
  })

  console.log('Course created:', course.id)

  // Create Module 1: Options Market Foundations (4 hours)
  const module1Lessons = [
    { order: 1, title: 'Introduction to Options Trading', duration: 25, content: 'Understanding what options are and how they work' },
    { order: 2, title: 'Options Market Structure & Participants', duration: 25, content: 'Overview of options exchanges and market participants' },
    { order: 3, title: 'Call Options: Understanding Buyer Perspective', duration: 25, content: 'How call options work for buyers' },
    { order: 4, title: 'Put Options: Understanding Buyer Perspective', duration: 25, content: 'How put options work for buyers' },
    { order: 5, title: 'Option Sellers (Writers) Perspective', duration: 25, content: 'Understanding the obligation of option sellers' },
    { order: 6, title: 'Index Options vs Stock Options', duration: 25, content: 'Key differences between index and stock options' },
    { order: 7, title: 'Expiry Cycles & Settlements', duration: 25, content: 'Understanding expiration dates and settlement procedures' },
    { order: 8, title: 'Option Chain Reading Basics', duration: 25, content: 'How to read and interpret option chains' },
    { order: 9, title: 'In-the-Money, At-the-Money, Out-of-the-Money', duration: 25, content: 'Understanding ITM, ATM, and OTM options' },
  ]

  // Create Module 2: Option Pricing & Greeks (6 hours)
  const module2Lessons = [
    { order: 101, title: 'Option Premium Components', duration: 25, content: 'Understanding intrinsic and extrinsic value' },
    { order: 102, title: 'Intrinsic Value Explained', duration: 25, content: 'How intrinsic value is calculated' },
    { order: 103, title: 'Time Value & Extrinsic Value', duration: 25, content: 'Understanding time decay and extrinsic value' },
    { order: 104, title: 'Introduction to Implied Volatility (IV)', duration: 30, content: 'What implied volatility means for options' },
    { order: 105, title: 'IV Ranking & Percentile', duration: 30, content: 'How to compare IV across different strikes' },
    { order: 106, title: 'Delta: Directional Risk Measure', duration: 30, content: 'Understanding delta and its practical applications' },
    { order: 107, title: 'Gamma: Rate of Change of Delta', duration: 30, content: 'How gamma affects delta and risk' },
    { order: 108, title: 'Theta: Time Decay Factor', duration: 30, content: 'Understanding theta and its impact on premiums' },
    { order: 109, title: 'Vega: Volatility Sensitivity', duration: 30, content: 'How vega measures volatility risk' },
    { order: 110, title: 'Greek Interactions in Real Trading', duration: 30, content: 'How Greeks work together' },
    { order: 111, title: 'Greek-Based Decision Making Framework', duration: 30, content: 'Using Greeks for trade selection' },
    { order: 112, title: 'Practical Greeks Calculator Usage', duration: 30, content: 'Hands-on Greek calculation exercises' },
  ]

  // Create Module 3: Volatility & Market Behavior (4 hours)
  const module3Lessons = [
    { order: 201, title: 'Historical Volatility Explained', duration: 25, content: 'Calculating and interpreting historical volatility' },
    { order: 202, title: 'Implied Volatility Deep Dive', duration: 25, content: 'Understanding IV in different market conditions' },
    { order: 203, title: 'IV Crush: What Happens After Events', duration: 30, content: 'Understanding volatility contraction post-events' },
    { order: 204, title: 'IV Expansion During Uncertainty', duration: 30, content: 'How volatility expands during market stress' },
    { order: 205, title: 'Earnings Season Volatility Strategies', duration: 30, content: 'Trading options around earnings announcements' },
    { order: 206, title: 'Budget & Policy Event Trading', duration: 30, content: 'Handling budget and RBI policy events' },
    { order: 207, title: 'Volatility Skew & Smile', duration: 30, content: 'Understanding volatility across different strikes' },
    { order: 208, title: 'Volatility Trading Strategies', duration: 30, content: 'Trading volatility directly' },
    { order: 209, title: 'Market Regime Identification', duration: 30, content: 'Identifying trending vs ranging markets' },
  ]

  // Create Module 4: Option Buying Strategies (5 hours)
  const module4Lessons = [
    { order: 301, title: 'Directional Trading with Options', duration: 30, content: 'Using options for directional bets' },
    { order: 302, title: 'Momentum-Based Option Setups', duration: 30, content: 'Option strategies for momentum trades' },
    { order: 303, title: 'Breakout Trading with Options', duration: 30, content: 'Using options for breakout trades' },
    { order: 304, title: 'News-Based Option Strategies', duration: 30, content: 'Trading options around news events' },
    { order: 305, title: 'Long Call Strategy Deep Dive', duration: 30, content: 'Maximizing call option buying' },
    { order: 306, title: 'Long Put Strategy Deep Dive', duration: 30, content: 'Maximizing put option buying' },
    { order: 307, title: 'Risk Control for Option Buyers', duration: 30, content: 'Managing risk when buying options' },
    { order: 308, title: 'Position Sizing for Buyers', duration: 25, content: 'Proper sizing for option purchases' },
    { order: 309, title: 'Option Buyer Psychology', duration: 30, content: 'Mental aspects of option buying' },
    { order: 310, title: 'Discipline for Consistent Buyers', duration: 30, content: 'Building disciplined buying habits' },
  ]

  // Create Module 5: Option Selling Strategies (6 hours)
  const module5Lessons = [
    { order: 401, title: 'Probability-Based Selling Approach', duration: 30, content: 'Selling options based on win rate' },
    { order: 402, title: 'Understanding Probability of Profit', duration: 30, content: 'Calculating POP for selling strategies' },
    { order: 403, title: 'Credit Spreads: Bull Put & Bear Call', duration: 35, content: 'Implementing credit spread strategies' },
    { order: 404, title: 'Iron Condor Construction', duration: 35, content: 'Building and managing iron condors' },
    { order: 405, title: 'Iron Fly for High Probability', duration: 30, content: 'Iron fly as a high-probability strategy' },
    { order: 406, title: 'Calendar Spreads Explained', duration: 35, content: 'Time decay strategies with calendars' },
    { order: 407, title: 'Diagonal Spreads Strategy', duration: 35, content: 'Combining directional and time elements' },
    { order: 408, title: 'Capital Requirements for Selling', duration: 30, content: 'Margin requirements and capital planning' },
    { order: 409, title: 'Margin Management Techniques', duration: 30, content: 'Managing margin efficiently' },
    { order: 410, title: 'Assignment Risk Management', duration: 30, content: 'Handling early assignment risk' },
    { order: 411, title: 'Rolling Strategies for Winners', duration: 30, content: 'Rolling to extend winning trades' },
    { order: 412, title: 'Rolling Strategies for Losers', duration: 30, content: 'Rolling to manage losing positions' },
  ]

  // Create Module 6: Hedging & Risk-Defined Trading (5 hours)
  const module6Lessons = [
    { order: 501, title: 'Portfolio Hedging with Options', duration: 30, content: 'Using options to protect portfolios' },
    { order: 502, title: 'Protective Put Strategy', duration: 30, content: 'Buying puts for portfolio protection' },
    { order: 503, title: 'Collar Strategy Implementation', duration: 35, content: 'Using collars for downside protection' },
    { order: 504, title: 'Risk-Defined Structures Overview', duration: 30, content: 'Understanding defined-risk strategies' },
    { order: 505, title: 'Vertical Spreads: Risk Defined', duration: 35, content: 'Implementing vertical spreads' },
    { order: 506, title: 'Straddle vs Strangle: When to Use', duration: 30, content: 'Choosing between straddles and strangles' },
    { order: 507, title: 'Stop-Loss vs Adjustment Debate', duration: 30, content: 'When to cut vs when to adjust' },
    { order: 508, title: 'Defensive Options Strategies', duration: 30, content: 'Using options defensively' },
    { order: 509, title: 'Crisis Market Protection', duration: 30, content: 'Protecting during market crashes' },
    { order: 510, title: 'Correlation Hedging Techniques', duration: 30, content: 'Hedging with correlated assets' },
  ]

  // Create Module 7: Advanced Adjustments & Trade Management (5 hours)
  const module7Lessons = [
    { order: 601, title: 'Delta Neutral Adjustments', duration: 30, content: 'Maintaining delta neutrality' },
    { order: 602, title: 'Gamma Scalping Basics', duration: 35, content: 'Scalping gamma for profits' },
    { order: 603, title: 'Rolling: Forward, Down, Up', duration: 30, content: 'Different rolling techniques' },
    { order: 604, title: 'Managing Early Assignment', duration: 30, content: 'Handling assignment situations' },
    { order: 605, title: 'Gamma Risk Assessment', duration: 30, content: 'Evaluating gamma exposure' },
    { order: 606, title: 'Theta Decay Optimization', duration: 30, content: 'Maximizing time decay benefits' },
    { order: 607, title: 'Vega Management in Portfolios', duration: 30, content: 'Managing volatility exposure' },
    { order: 608, title: 'Exit Strategy Framework', duration: 30, content: 'When to exit options positions' },
    { order: 609, title: 'Profit Taking Rules', duration: 25, content: 'Taking profits at the right time' },
    { order: 610, title: 'Loss Recovery Planning', duration: 30, content: 'Managing losses and recovery' },
  ]

  // Create Module 8: Index Options Mastery (5 hours)
  const module8Lessons = [
    { order: 701, title: 'NIFTY Options: Structure & Behavior', duration: 30, content: 'Understanding NIFTY options characteristics' },
    { order: 702, title: 'Weekly Expiry Behavior', duration: 30, content: 'How weekly expiry affects options' },
    { order: 703, title: 'Intraday Index Options Trading', duration: 35, content: 'Day trading index options' },
    { order: 704, title: 'Positional NIFTY Strategies', duration: 35, content: 'Holding positions for multiple days' },
    { order: 705, title: 'BANKNIFTY: Higher Beta Trading', duration: 35, content: 'Trading bank index options' },
    { order: 706, title: 'Bank Nifty Risk Control', duration: 30, content: 'Managing higher volatility in BANKNIFTY' },
    { order: 707, title: 'MIDCAPNIFTY Opportunities', duration: 30, content: 'Exploring mid-cap index options' },
    { order: 708, title: 'Institutional Participation Reading', duration: 30, content: 'Detecting institutional activity' },
    { order: 709, title: 'Open Interest Analysis', duration: 30, content: 'Using OI data for trading decisions' },
    { order: 710, title: 'PCR Ratio Practical Application', duration: 30, content: 'Using put-call ratio effectively' },
  ]

  // Create Module 9: Psychology & Professional Discipline (3 hours)
  const module9Lessons = [
    { order: 801, title: 'Overtrading: Causes & Solutions', duration: 25, content: 'Identifying and preventing overtrading' },
    { order: 802, title: 'Drawdown Psychology', duration: 30, content: 'Managing emotions during drawdowns' },
    { order: 803, title: 'Loss Recovery Traps', duration: 25, content: 'Avoiding revenge trading' },
    { order: 804, title: 'Building a Trader Routine', duration: 25, content: 'Creating daily trading habits' },
    { order: 805, title: 'Journaling for Improvement', duration: 25, content: 'Keeping a trading journal' },
    { order: 806, title: 'Review & Analysis Process', duration: 25, content: 'Analyzing past trades systematically' },
    { order: 807, title: 'Long-Term Consistency Mindset', duration: 25, content: 'Thinking long-term for success' },
  ]

  // Create Module 10: Build Your Options Trading System (2 hours)
  const module10Lessons = [
    { order: 901, title: 'Strategy Selection Framework', duration: 30, content: 'Choosing the right strategy for you' },
    { order: 902, title: 'Backtesting Your Ideas', duration: 25, content: 'Testing strategies on historical data' },
    { order: 903, title: 'Forward Testing & Paper Trading', duration: 25, content: 'Validating before real trading' },
    { order: 904, title: 'Creating Your Trade Checklist', duration: 20, content: 'Building a systematic entry process' },
    { order: 905, title: 'Capital Deployment Plan', duration: 25, content: 'Sizing positions correctly' },
    { order: 906, title: 'Risk Per Trade Rules', duration: 20, content: 'Defining risk parameters' },
    { order: 907, title: 'Growth Roadmap: Next Steps', duration: 25, content: 'Planning your trading journey' },
    { order: 908, title: 'Course Summary & Action Plan', duration: 20, content: 'Final review and next steps' },
  ]

  // Create all lessons
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

  for (const lesson of allLessons) {
    await db.lesson.create({
      data: {
        title: lesson.title,
        duration: lesson.duration,
        order: lesson.order,
        content: lesson.content,
        courseId: course.id,
        isActive: true,
      }
    })
  }

  console.log(`Created ${allLessons.length} lessons`)

  // Create assessments
  await db.assessment.create({
    data: {
      title: 'Options Market Foundations Quiz',
      type: 'QUIZ',
      courseId: course.id,
      lessonId: (await db.lesson.findFirst({ where: { courseId: course.id, order: 1 } }))?.id || '',
    }
  })

  await db.assessment.create({
    data: {
      title: 'Option Pricing & Greeks Assessment',
      type: 'QUIZ',
      courseId: course.id,
      lessonId: (await db.lesson.findFirst({ where: { courseId: course.id, order: 101 } }))?.id || '',
    }
  })

  await db.assessment.create({
    data: {
      title: 'Advanced Options Strategies Assessment',
      type: 'QUIZ',
      courseId: course.id,
      lessonId: (await db.lesson.findFirst({ where: { courseId: course.id, order: 401 } }))?.id || '',
    }
  })

  await db.assessment.create({
    data: {
      title: 'Trading Psychology & System Building Assessment',
      type: 'QUIZ',
      courseId: course.id,
      lessonId: (await db.lesson.findFirst({ where: { courseId: course.id, order: 801 } }))?.id || '',
    }
  })

  await db.assessment.create({
    data: {
      title: 'Options Trading Mastery Final Exam',
      type: 'PRACTICE',
      courseId: course.id,
    }
  })

  console.log('Created 5 assessments')
  console.log('Options Trading Mastery course setup complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
