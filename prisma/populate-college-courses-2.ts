import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating lessons for College Category courses - Part 2...')

  // college7: Physiology (ADVANCED, 400 min) - 4 modules: 100 + 100 + 100 + 100 lessons
  const college7 = await prisma.course.findUnique({ where: { id: 'college7' } })
  if (college7) {
    console.log('Creating lessons for college7: Physiology...')
    await prisma.lesson.deleteMany({ where: { courseId: college7.id } })
    const lessons: any[] = []
    // Module 1: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college7.id,
        title: `Cellular & General Physiology - Lesson ${i}`,
        content: `Comprehensive lesson covering cellular and general physiological principles. This lesson explores cell membrane transport, homeostasis, body fluid compartments, and fundamental physiological processes.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    // Module 2: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college7.id,
        title: `Nerve & Muscle Physiology - Lesson ${i}`,
        content: `Detailed lesson covering nervous system and muscle physiology. This lesson explores nerve impulse transmission, synaptic transmission, muscle contraction mechanisms, and neuromuscular junction function.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    // Module 3: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college7.id,
        title: `Cardiovascular & Respiratory Physiology - Lesson ${i}`,
        content: `Comprehensive lesson covering cardiovascular and respiratory system functions. This lesson explores cardiac cycle, blood pressure regulation, gas exchange, ventilation-perfusion matching, and acid-base balance.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    // Module 4: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college7.id,
        title: `Renal & Endocrine Physiology - Lesson ${i}`,
        content: `Advanced lesson covering renal and endocrine system functions. This lesson explores kidney function, fluid-electrolyte balance, hormone action, and the integration of physiological systems.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 300 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 400 lessons for Physiology')
  }

  // college8: Medical Research Methods (ADVANCED, 410 min) - 4 modules: 100 + 100 + 100 + 110 lessons
  const college8 = await prisma.course.findUnique({ where: { id: 'college8' } })
  if (college8) {
    console.log('Creating lessons for college8: Medical Research Methods...')
    await prisma.lesson.deleteMany({ where: { courseId: college8.id } })
    const lessons: any[] = []
    // Module 1: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college8.id,
        title: `Research Design & Methodology - Lesson ${i}`,
        content: `Comprehensive lesson covering medical research design and methodology. This lesson explores research questions, hypothesis formulation, study design types, and methodological considerations for clinical research.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    // Module 2: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college8.id,
        title: `Biostatistics & Data Analysis - Lesson ${i}`,
        content: `Detailed lesson covering biostatistics and data analysis in medical research. This lesson explores descriptive statistics, hypothesis testing, regression analysis, and interpretation of research findings.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    // Module 3: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college8.id,
        title: `Clinical Trials & Epidemiology - Lesson ${i}`,
        content: `Comprehensive lesson covering clinical trials and epidemiological methods. This lesson explores trial design phases, randomization, blinding, bias control, and population-based research approaches.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    // Module 4: 110 lessons
    for (let i = 1; i <= 110; i++) {
      lessons.push({
        courseId: college8.id,
        title: `Evidence-Based Medicine & Ethics - Lesson ${i}`,
        content: `Advanced lesson covering evidence-based medicine and research ethics. This lesson explores systematic reviews, meta-analysis, critical appraisal, informed consent, and ethical considerations in medical research.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 300 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 410 lessons for Medical Research Methods')
  }

  // college9: Business Economics (INTERMEDIATE, 420 min) - 4 modules: 100 + 100 + 100 + 120 lessons
  const college9 = await prisma.course.findUnique({ where: { id: 'college9' } })
  if (college9) {
    console.log('Creating lessons for college9: Business Economics...')
    await prisma.lesson.deleteMany({ where: { courseId: college9.id } })
    const lessons: any[] = []
    // Module 1: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college9.id,
        title: `Microeconomic Foundations - Lesson ${i}`,
        content: `Comprehensive lesson covering microeconomic principles for business. This lesson explores supply and demand, market equilibrium, consumer behavior, production theory, and cost analysis.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    // Module 2: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college9.id,
        title: `Macroeconomic Environment - Lesson ${i}`,
        content: `Detailed lesson covering macroeconomic factors affecting business. This lesson explores GDP, inflation, unemployment, fiscal policy, monetary policy, and business cycle analysis.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    // Module 3: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college9.id,
        title: `Market Structures & Strategy - Lesson ${i}`,
        content: `Comprehensive lesson covering market structures and competitive strategy. This lesson explores perfect competition, monopoly, oligopoly, monopolistic competition, and strategic decision-making frameworks.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    // Module 4: 120 lessons
    for (let i = 1; i <= 120; i++) {
      lessons.push({
        courseId: college9.id,
        title: `Managerial Economics Applications - Lesson ${i}`,
        content: `Advanced lesson covering managerial economics applications in business. This lesson explores pricing strategies, risk analysis, investment decisions, and economic forecasting for business planning.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 300 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 420 lessons for Business Economics')
  }

  // college10: Accounting Principles (INTERMEDIATE, 430 min) - 4 modules: 100 + 100 + 100 + 130 lessons
  const college10 = await prisma.course.findUnique({ where: { id: 'college10' } })
  if (college10) {
    console.log('Creating lessons for college10: Accounting Principles...')
    await prisma.lesson.deleteMany({ where: { courseId: college10.id } })
    const lessons: any[] = []
    // Module 1: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college10.id,
        title: `Accounting Fundamentals & Concepts - Lesson ${i}`,
        content: `Comprehensive lesson covering fundamental accounting concepts and principles. This lesson explores accounting equation, double-entry system, journal entries, ledger posting, and trial balance preparation.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    // Module 2: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college10.id,
        title: `Financial Statement Preparation - Lesson ${i}`,
        content: `Detailed lesson covering preparation of financial statements. This lesson explores income statement, balance sheet, cash flow statement, and the relationships between financial statements.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    // Module 3: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college10.id,
        title: `Asset Accounting & Depreciation - Lesson ${i}`,
        content: `Comprehensive lesson covering asset accounting and depreciation methods. This lesson explores cash and receivables, inventory valuation, property plant equipment, and various depreciation approaches.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    // Module 4: 130 lessons
    for (let i = 1; i <= 130; i++) {
      lessons.push({
        courseId: college10.id,
        title: `Liabilities, Equity & Financial Analysis - Lesson ${i}`,
        content: `Advanced lesson covering liabilities, equity, and financial analysis. This lesson explores current and long-term liabilities, corporate equity, and ratio analysis for financial statement interpretation.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 300 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 430 lessons for Accounting Principles')
  }

  // college11: Business Statistics (INTERMEDIATE, 440 min) - 4 modules: 100 + 100 + 100 + 140 lessons
  const college11 = await prisma.course.findUnique({ where: { id: 'college11' } })
  if (college11) {
    console.log('Creating lessons for college11: Business Statistics...')
    await prisma.lesson.deleteMany({ where: { courseId: college11.id } })
    const lessons: any[] = []
    // Module 1: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college11.id,
        title: `Descriptive Statistics & Data Visualization - Lesson ${i}`,
        content: `Comprehensive lesson covering descriptive statistics and data visualization. This lesson explores central tendency measures, dispersion, probability distributions, and graphical data representation techniques.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    // Module 2: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college11.id,
        title: `Probability & Probability Distributions - Lesson ${i}`,
        content: `Detailed lesson covering probability theory and distributions. This lesson explores conditional probability, Bayes' theorem, discrete and continuous distributions, and their business applications.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    // Module 3: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college11.id,
        title: `Statistical Inference & Hypothesis Testing - Lesson ${i}`,
        content: `Comprehensive lesson covering statistical inference and hypothesis testing. This lesson explores sampling distributions, confidence intervals, z-tests, t-tests, and ANOVA for business decision-making.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    // Module 4: 140 lessons
    for (let i = 1; i <= 140; i++) {
      lessons.push({
        courseId: college11.id,
        title: `Regression Analysis & Business Forecasting - Lesson ${i}`,
        content: `Advanced lesson covering regression analysis and business forecasting. This lesson explores simple and multiple regression, time series analysis, forecasting techniques, and statistical quality control.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 300 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 440 lessons for Business Statistics')
  }

  console.log('Part 2 of College Category courses completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
