const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📖 Creating lessons for Senior Secondary - Commerce Stream (Class 11-12)...\n');

  const courseId = 'school_senior_commerce_11_12';
  let order = 1;

  async function createLesson(title, content, duration, orderNum) {
    await prisma.lesson.create({
      data: {
        id: `${courseId}_lesson_${orderNum}`,
        title: title,
        content: content,
        duration: duration,
        order: orderNum,
        courseId: courseId,
        isActive: true,
      }
    });
  }

  async function createAssessment(title, orderNum) {
    await prisma.assessment.create({
      data: {
        id: `${courseId}_assessment_${orderNum}`,
        title: title,
        type: 'QUIZ',
        courseId: courseId,
        isActive: true,
      }
    });
  }

  // ==================== ACCOUNTANCY ====================
  console.log('📒 Creating Accountancy lessons...');
  const accountancyTopics = [
    { title: 'Introduction to Accounting', content: 'Basic accounting principles and concepts', duration: 50 },
    { title: 'Theory Base of Accounting', content: 'GAAP, assumptions, and principles', duration: 45 },
    { title: 'Recording of Transactions', content: 'Journal and ledger entries', duration: 60 },
    { title: 'Subsidiary Books', content: 'Cash book, purchase book, sales book', duration: 55 },
    { title: 'Bank Reconciliation Statement', content: 'Preparation of BRS', duration: 50 },
    { title: 'Trial Balance', content: 'Preparation and errors in trial balance', duration: 50 },
    { title: 'Depreciation Provisions', content: 'Methods of depreciation', duration: 55 },
    { title: 'Accounting for Bills', content: 'Bills of exchange and promissory notes', duration: 50 },
    { title: 'Rectification of Errors', content: 'Locating and rectifying errors', duration: 55 },
    { title: 'Financial Statements', content: 'Trading and profit & loss account', duration: 60 },
    { title: 'Financial Statements - Final', content: 'Balance sheet preparation', duration: 60 },
    { title: 'Accounts from Incomplete Records', content: 'Single entry system', duration: 55 },
    { title: 'Not-for-Profit Organizations', content: 'Receipts and payments account', duration: 55 },
    { title: 'Partnership Fundamentals', content: 'Partnership deed and agreement', duration: 55 },
    { title: 'Partnership - Admission', content: 'Admission of new partner', duration: 60 },
    { title: 'Partnership - Retirement', content: 'Retirement and death of partner', duration: 60 },
    { title: 'Partnership - Dissolution', content: 'Dissolution of partnership firm', duration: 55 },
    { title: 'Company Accounts - Issue', content: 'Issue of shares and debentures', duration: 60 },
    { title: 'Company Accounts - Forfeiture', content: 'Forfeiture and reissue of shares', duration: 55 },
    { title: 'Financial Statement Analysis', content: 'Common-size statements', duration: 55 },
    { title: 'Accounting Ratios', content: 'Liquidity, profitability, and turnover ratios', duration: 60 },
    { title: 'Cash Flow Statement', content: 'Classification and preparation', duration: 60 },
  ];

  for (const topic of accountancyTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== BUSINESS STUDIES ====================
  console.log('📈 Creating Business Studies lessons...');
  const businessTopics = [
    { title: 'Nature and Significance of Management', content: 'Management concepts and objectives', duration: 50 },
    { title: 'Principles of Management', content: 'Fayol\'s 14 principles of management', duration: 55 },
    { title: 'Business Environment', content: 'Internal and external environment', duration: 50 },
    { title: 'Planning', content: 'Types of planning and strategies', duration: 55 },
    { title: 'Organizing', content: 'Organizational structures and design', duration: 55 },
    { title: 'Staffing', content: 'Human resource management basics', duration: 55 },
    { title: 'Directing', content: 'Motivation, leadership, and communication', duration: 60 },
    { title: 'Controlling', content: 'Control process and techniques', duration: 55 },
    { title: 'Financial Management', content: 'Capital structure and financing', duration: 60 },
    { title: 'Financial Markets', content: 'Stock exchange and money market', duration: 60 },
    { title: 'Marketing Management', content: 'Marketing mix and strategies', duration: 60 },
    { title: 'Consumer Protection', content: 'Consumer rights and redressal', duration: 50 },
    { title: 'Entrepreneurship Development', content: 'Entrepreneurial traits and skills', duration: 55 },
    { title: 'Business Finance', content: 'Sources of finance for business', duration: 55 },
    { title: 'Organising Staffing', content: 'HR planning and recruitment', duration: 55 },
    { title: 'Communication', content: 'Business communication process', duration: 50 },
    { title: 'Controlling Business', content: 'Budgetary control and variance analysis', duration: 55 },
    { title: 'Financial Markets Advanced', content: 'SEBI and investor protection', duration: 55 },
    { title: 'Marketing Segmentation', content: 'Target marketing strategies', duration: 55 },
    { title: 'Product and Pricing', content: 'Product life cycle and pricing strategies', duration: 55 },
  ];

  for (const topic of businessTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== ECONOMICS ====================
  console.log('💰 Creating Economics lessons...');
  const economicsTopics = [
    { title: 'Introduction to Microeconomics', content: 'Scarcity, choice, and opportunity cost', duration: 50 },
    { title: 'Theory of Consumer Behavior', content: 'Utility analysis and demand', duration: 55 },
    { title: 'Demand Analysis', content: 'Law of demand and elasticity', duration: 55 },
    { title: 'Supply Analysis', content: 'Law of supply and determinants', duration: 50 },
    { title: 'Market Equilibrium', content: 'Price determination in markets', duration: 55 },
    { title: 'Production Function', content: 'Law of returns and cost curves', duration: 55 },
    { title: 'Cost and Revenue', content: 'Different types of costs', duration: 55 },
    { title: 'Perfect Competition', content: 'Features and equilibrium', duration: 60 },
    { title: 'Imperfect Competition', content: 'Monopoly and oligopoly', duration: 60 },
    { title: 'Introduction to Macroeconomics', content: 'National income concepts', duration: 55 },
    { title: 'National Income Accounting', content: 'GDP and GNP calculation', duration: 60 },
    { title: 'Money and Banking', content: 'Functions of money and central bank', duration: 60 },
    { title: 'Aggregate Demand and Supply', content: 'AD-AS model', duration: 60 },
    { title: 'Government Budget', content: 'Fiscal policy and budget', duration: 55 },
    { title: 'Income Determination', content: 'Multiplier effect', duration: 60 },
    { title: 'Foreign Exchange Rate', content: 'Balance of payments', duration: 55 },
    { title: 'Open Economy Macroeconomics', content: 'International trade and finance', duration: 60 },
    { title: 'Indian Economic Development', content: 'Post-independence economy', duration: 55 },
    { title: 'Economic Reforms', content: 'Liberalization and reforms', duration: 55 },
    { title: 'Poverty', content: 'Poverty lines and programs', duration: 55 },
    { title: 'Human Capital Formation', content: 'Education and health investment', duration: 50 },
    { title: 'Employment and Unemployment', content: 'Types and causes', duration: 55 },
    { title: 'Inflation', content: 'Types and effects of inflation', duration: 50 },
    { title: 'Sustainable Development', content: 'Environmental economics', duration: 50 },
  ];

  for (const topic of economicsTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== MATHEMATICS (COMMERCE) ====================
  console.log('📐 Creating Mathematics lessons...');
  const mathTopics = [
    { title: 'Sets and Relations', content: 'Set operations and relations', duration: 50 },
    { title: 'Complex Numbers', content: 'Algebra of complex numbers', duration: 50 },
    { title: 'Quadratic Equations', content: 'Roots and solutions', duration: 50 },
    { title: 'Sequences and Series', content: 'AP, GP, and HP', duration: 55 },
    { title: 'Straight Lines', content: 'Coordinate geometry basics', duration: 50 },
    { title: 'Conic Sections', content: 'Parabola and ellipse', duration: 55 },
    { title: 'Limits and Derivatives', content: 'Introduction to calculus', duration: 60 },
    { title: 'Statistics', content: 'Measures of dispersion', duration: 55 },
    { title: 'Probability', content: 'Basic probability rules', duration: 55 },
    { title: 'Matrices', content: 'Matrix operations', duration: 55 },
    { title: 'Determinants', content: 'Properties and applications', duration: 55 },
    { title: 'Linear Programming', content: 'Graphical method', duration: 55 },
  ];

  for (const topic of mathTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== ASSESSMENTS ====================
  console.log('\n📝 Creating assessments...');
  await createAssessment('Accountancy Assessment (Class 11-12)', 1);
  await createAssessment('Business Studies Assessment (Class 11-12)', 2);
  await createAssessment('Economics Assessment (Class 11-12)', 3);
  await createAssessment('Mathematics Assessment (Commerce)', 4);
  await createAssessment('Board Exam Practice', 5);
  await createAssessment('Final Assessment (Commerce Stream)', 6);

  console.log(`\n✅ Completed! Created ${order - 1} lessons and 6 assessments.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
