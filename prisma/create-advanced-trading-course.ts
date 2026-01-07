import { db } from '../src/lib/db'

async function main() {
  console.log('Creating Stock Market – Advanced Trading Course...')

  const courseId = 'stock-market-advanced-trading'

  // Check if course already exists
  const existingCourse = await db.course.findFirst({
    where: { id: courseId },
  })

  if (existingCourse) {
    console.log(`Course "${existingCourse.title}" already exists with ID: ${courseId}`)
    return
  }

  // Find or create the instructor
  const instructor = await db.instructor.upsert({
    where: { id: 'inst-advanced-trading-faculty' },
    update: {},
    create: {
      id: 'inst-advanced-trading-faculty',
      name: 'Advanced Trading Faculty',
      bio: 'Expert faculty for advanced stock market and derivatives trading courses',
    },
  })
  console.log(`✅ Instructor: ${instructor.name}`)

  // Create the Advanced Trading course
  const course = await db.course.create({
    data: {
      id: courseId,
      title: 'Stock Market – Advanced Trading Course',
      description: 'Master professional trading techniques for equity, derivatives, and intraday markets with Indian market-specific strategies.',
      difficulty: 'ADVANCED',
      duration: 2400, // 40 hours = 2400 minutes
      isActive: true,
      thumbnail: '/assets/courses/advanced-trading.svg',
      instructorId: instructor.id,
      learningPathId: 'investment-trading', // Investment & Trading path
    },
  })

  console.log(`Created course: ${course.id}`)

  // Create lessons grouped by modules
  const lessonsData = [
    // Module 1: Market Structure & Advanced Trading Setup (orders 1-99)
    { title: 'Market microstructure', order: 1, duration: 30, content: 'Understanding how markets function at the microstructure level.' },
    { title: 'Liquidity, volume & order flow', order: 2, duration: 30, content: 'Analyzing liquidity patterns and order flow for better entries.' },
    { title: 'Professional trader mindset', order: 3, duration: 30, content: 'Developing the psychological framework of professional traders.' },
    { title: 'Trading platforms & tools', order: 4, duration: 30, content: 'Mastering trading platforms and analytical tools.' },
    { title: 'Broker & execution strategies', order: 5, duration: 30, content: 'Selecting brokers and optimizing order execution.' },
    { title: 'Advanced trading setup checklist', order: 6, duration: 30, content: 'Comprehensive checklist for professional trading setup.' },

    // Module 2: Advanced Candlestick & Chart Patterns (orders 100-199)
    { title: 'Candlestick psychology', order: 101, duration: 35, content: 'Understanding the psychology behind candlestick formations.' },
    { title: 'Multi-candle patterns', order: 102, duration: 35, content: 'Advanced multi-candle reversal and continuation patterns.' },
    { title: 'Head & Shoulders pattern', order: 103, duration: 35, content: 'Mastering the Head & Shoulders pattern and its variations.' },
    { title: 'Triangle patterns', order: 104, duration: 35, content: 'Trading ascending, descending, and symmetrical triangles.' },
    { title: 'Breakouts & fakeouts', order: 105, duration: 35, content: 'Identifying true breakouts versus trap setups.' },
    { title: 'Pattern failure analysis', order: 106, duration: 35, content: 'How to identify when patterns fail and exit gracefully.' },
    { title: 'Complex chart patterns', order: 107, duration: 35, content: 'Advanced patterns like cup and handle, double tops/bottoms.' },
    { title: 'Volume confirmation patterns', order: 108, duration: 35, content: 'Using volume to confirm pattern validity.' },

    // Module 3: Technical Indicators (Advanced Use) (orders 200-299)
    { title: 'Exponential Moving Average (EMA)', order: 201, duration: 35, content: 'Advanced EMA strategies and crossovers.' },
    { title: 'Simple Moving Average (SMA)', order: 202, duration: 30, content: 'SMA applications and comparison with EMA.' },
    { title: 'VWAP (Volume Weighted Average Price)', order: 203, duration: 35, content: 'Intraday trading with VWAP strategies.' },
    { title: 'RSI (Relative Strength Index)', order: 204, duration: 35, content: 'Advanced RSI techniques and overbought/oversold extremes.' },
    { title: 'MACD (Moving Average Convergence Divergence)', order: 205, duration: 35, content: 'Mastering MACD for trend and momentum.' },
    { title: 'Stochastic oscillator', order: 206, duration: 35, content: 'Advanced stochastic strategies for timing.' },
    { title: 'Indicator combinations', order: 207, duration: 35, content: 'Combining multiple indicators for higher probability trades.' },
    { title: 'Indicator vs price action divergence', order: 208, duration: 35, content: 'Identifying divergences between indicators and price.' },

    // Module 4: Price Action Trading (orders 300-399)
    { title: 'Advanced support & resistance', order: 301, duration: 35, content: 'Multi-timeframe support and resistance analysis.' },
    { title: 'Trend strength assessment', order: 302, duration: 35, content: 'Measuring trend strength using price action.' },
    { title: 'Reversal signals', order: 303, duration: 35, content: 'Identifying high-probability reversal points.' },
    { title: 'Supply & demand zones', order: 304, duration: 35, content: 'Trading from institutional supply and demand zones.' },
    { title: 'Institutional price behavior', order: 305, duration: 35, content: 'Understanding how large players move markets.' },
    { title: 'High-probability trade setups', order: 306, duration: 35, content: 'Identifying the best price action setups.' },
    { title: 'Price action confluence', order: 307, duration: 35, content: 'Combining multiple price action factors.' },
    { title: 'Market structure analysis', order: 308, duration: 35, content: 'Reading market structure for directional bias.' },

    // Module 5: Derivatives Trading (F&O) (orders 400-499)
    { title: 'Futures contract mechanics', order: 401, duration: 35, content: 'Understanding futures pricing and settlement.' },
    { title: 'Futures trading strategies', order: 402, duration: 40, content: 'Long and short futures strategies for various markets.' },
    { title: 'Options basics refresher', order: 403, duration: 30, content: 'Quick refresher on options fundamentals.' },
    { title: 'Option Greeks simplified', order: 404, duration: 40, content: 'Understanding Delta, Gamma, Theta, and Vega.' },
    { title: 'Option buying strategies', order: 405, duration: 35, content: 'When and how to buy options profitably.' },
    { title: 'Option selling (writing) strategies', order: 406, duration: 40, content: 'Income strategies through option selling.' },
    { title: 'Intraday F&O strategies', order: 407, duration: 40, content: 'Day trading with futures and options.' },
    { title: 'Positional F&O strategies', order: 408, duration: 40, content: 'Swing trading with derivatives.' },
    { title: 'Hedging with options', order: 409, duration: 35, content: 'Protecting portfolios using options.' },
    { title: 'Margin & exposure management', order: 410, duration: 35, content: 'Managing margin requirements and exposure in F&O.' },

    // Module 6: Advanced Options Strategies (orders 500-599)
    { title: 'Bull call spread', order: 501, duration: 35, content: 'Constructing bull call spreads for directional bets.' },
    { title: 'Bear put spread', order: 502, duration: 35, content: 'Building bear put spreads for bearish markets.' },
    { title: 'Iron Condor strategy', order: 503, duration: 40, content: 'Advanced Iron Condor for neutral markets.' },
    { title: 'Iron Butterfly strategy', order: 504, duration: 40, content: 'Iron Butterfly for targeted profit zones.' },
    { title: 'Straddle & strangle', order: 505, duration: 35, content: 'Playing volatility with straddles and strangles.' },
    { title: 'Protective collars', order: 506, duration: 35, content: 'Collar strategies for downside protection.' },
    { title: 'Calendar spreads', order: 507, duration: 40, content: 'Time decay strategies with calendar spreads.' },
    { title: 'Volatility trading with options', order: 508, duration: 40, content: 'Trading IV crush and volatility spikes.' },
    { title: 'Index options strategies', order: 509, duration: 35, content: 'Trading NIFTY and bank NIFTY options.' },
    { title: 'Risk-defined income strategies', order: 510, duration: 35, content: 'Generating income with defined risk.' },

    // Module 7: Risk Management & Capital Protection (orders 600-699)
    { title: 'Position sizing formulas', order: 601, duration: 35, content: 'Calculating optimal position size for each trade.' },
    { title: 'Stop-loss placement strategies', order: 602, duration: 35, content: 'Advanced techniques for stop-loss placement.' },
    { title: 'Risk-reward ratio optimization', order: 603, duration: 35, content: 'Maximizing reward while minimizing risk.' },
    { title: 'Maximum drawdown analysis', order: 604, duration: 35, content: 'Understanding and limiting drawdowns.' },
    { title: 'Drawdown recovery strategies', order: 605, duration: 35, content: 'How to recover from losing streaks.' },
    { title: 'Portfolio risk assessment', order: 606, duration: 35, content: 'Measuring overall portfolio risk exposure.' },
    { title: 'Correlation & diversification', order: 607, duration: 35, content: 'Managing risk through diversification.' },
    { title: 'Trading journal system', order: 608, duration: 35, content: 'Building a comprehensive trading journal.' },

    // Module 8: Trading Psychology & Discipline (orders 700-799)
    { title: 'Emotional awareness', order: 701, duration: 30, content: 'Recognizing and managing trading emotions.' },
    { title: 'Fear management', order: 702, duration: 30, content: 'Overcoming fear of losses and missed opportunities.' },
    { title: 'Greed control', order: 703, duration: 30, content: 'Managing greed to avoid overtrading.' },
    { title: 'Over-trading pitfalls', order: 704, duration: 30, content: 'Identifying and eliminating overtrading.' },
    { title: 'Building trading discipline', order: 705, duration: 35, content: 'Developing iron discipline in trading.' },
    { title: 'Loss acceptance', order: 706, duration: 30, content: 'Psychology of accepting losses gracefully.' },

    // Module 9: Live Market Case Studies (orders 800-899)
    { title: 'NIFTY intraday trade analysis', order: 801, duration: 30, content: 'Detailed analysis of NIFTY intraday trades.' },
    { title: 'Bank NIFTY options case study', order: 802, duration: 30, content: 'Bank NIFTY options trading examples.' },
    { title: 'Stock futures trade review', order: 803, duration: 30, content: 'Stock futures trading case studies.' },
    { title: 'Mistake analysis & learning', order: 804, duration: 30, content: 'Learning from trading mistakes.' },

    // Module 10: Building Your Trading System (orders 900-999)
    { title: 'Strategy selection criteria', order: 901, duration: 30, content: 'How to choose strategies that match your personality.' },
    { title: 'Backtesting methodology', order: 902, duration: 30, content: 'Proper backtesting techniques for validity.' },
    { title: 'Creating trading rules', order: 903, duration: 30, content: 'Writing clear, actionable trading rules.' },
    { title: 'Building your trading plan', order: 904, duration: 30, content: 'Creating a comprehensive trading plan.' },
    { title: 'Long-term trader roadmap', order: 905, duration: 30, content: 'Roadmap for becoming a professional trader.' },
  ]

  // Create all lessons
  for (const lessonData of lessonsData) {
    await db.lesson.create({
      data: {
        ...lessonData,
        courseId,
        isActive: true,
      },
    })
    console.log(`Created lesson: ${lessonData.title}`)
  }

  // Create assessments
  const assessmentsData = [
    {
      title: 'Module 1-2 Quiz: Market Structure & Chart Patterns',
      type: 'QUIZ',
    },
    {
      title: 'Module 3-4 Quiz: Technical Analysis & Price Action',
      type: 'QUIZ',
    },
    {
      title: 'Module 5-6 Quiz: Derivatives & Options Strategies',
      type: 'QUIZ',
    },
    {
      title: 'Module 7-8 Quiz: Risk Management & Psychology',
      type: 'QUIZ',
    },
    {
      title: 'Final Assessment: Advanced Trading Mastery',
      type: 'PRACTICE',
    },
  ]

  for (const assessment of assessmentsData) {
    await db.assessment.create({
      data: {
        ...assessment,
        courseId,
        isActive: true,
      },
    })
    console.log(`Created assessment: ${assessment.title}`)
  }

  console.log('\n✅ Stock Market – Advanced Trading Course created successfully!')
  console.log(`📚 Total lessons: ${lessonsData.length}`)
  console.log(`📝 Total assessments: ${assessmentsData.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
