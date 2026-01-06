const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding US CPA Complete Course (All 4 Papers)...')
  const courseId = 'us_cpa'
  let lessonOrder = 1
  const lessons = []
  const assessments = []

  // ============ SECTION 1: FAR - Financial Accounting & Reporting (180 Hours) ============
  // Module 1: Conceptual Framework & Standard Setting (Orders 1-15)
  const farModule1Lessons = [
    'Introduction to US GAAP and IFRS',
    'Conceptual Framework Overview',
    'Objectives of Financial Reporting',
    'Qualitative Characteristics of Financial Information',
    'Elements of Financial Statements',
    'Recognition and Measurement Concepts',
    'The Standard-Setting Process',
    'FASB Codification System',
    'SEC Reporting Requirements',
    'Role of AICPA and PCAOB',
    'Accounting Principles vs Accounting Estimates',
    'Consistency and Comparability',
    'Materiality in Financial Reporting',
    'Going Concern Assumption',
    'Module 1 Assessment'
  ]
  
  // Module 2: Financial Statements (Orders 16-30)
  const farModule2Lessons = [
    'Components of Financial Statements',
    'Statement of Financial Position (Balance Sheet)',
    'Statement of Comprehensive Income',
    'Statement of Retained Earnings',
    'Statement of Changes in Equity',
    'Classification of Assets',
    'Classification of Liabilities',
    'Equity Components and Transactions',
    'Notes to Financial Statements',
    'Management Discussion and Analysis',
    'Interim Financial Reporting',
    'Comparative Financial Statements',
    'Common Size Financial Statements',
    'Vertical and Horizontal Analysis',
    'Module 2 Assessment'
  ]
  
  // Module 3: Revenue Recognition - ASC 606 (Orders 31-45)
  const farModule3Lessons = [
    'Introduction to ASC 606',
    'Five-Step Revenue Recognition Model',
    'Identifying the Contract with Customer',
    'Identifying Performance Obligations',
    'Determining Transaction Price',
    'Allocating Transaction Price',
    'Recognizing Revenue When Satisfied',
    'Revenue Recognition for Goods',
    'Revenue Recognition for Services',
    'Variable Consideration and Constraints',
    'Time Value of Money in Revenue',
    'Bill-and-Hold Arrangements',
    'Principal vs Agent Considerations',
    'Revenue Recognition for Licenses',
    'Module 3 Assessment'
  ]
  
  // Module 4: Inventory and Cost Measurement (Orders 46-60)
  const farModule4Lessons = [
    'Inventory Classification and Types',
    'Inventory Valuation Methods',
    'Specific Identification Method',
    'Weighted Average Cost Method',
    'FIFO (First-In, First-Out)',
    'LIFO (Last-In, First-Out)',
    'LIFO Conformity and LIFO Reserve',
    'Lower of Cost or Market (LCM)',
    'Retail Inventory Method',
    'Gross Profit Method',
    'Inventory Estimation Techniques',
    'Inventory Cost Flow Assumptions',
    'Perpetual vs Periodic Inventory',
    'Inventory Turnover and Days Sales',
    'Module 4 Assessment'
  ]
  
  // Module 5: PPE, Intangibles and Impairment (Orders 61-78)
  const farModule5Lessons = [
    'Classification of Property, Plant and Equipment',
    'Initial Measurement of PPE',
    'Capitalization of Interest Costs',
    'Improvements and Betterments',
    'Self-Constructed Assets',
    'Purchased Assets and Basket Purchases',
    'Depreciation Methods - Straight Line',
    'Depreciation Methods - Declining Balance',
    'Depreciation Methods - Units of Production',
    'Depreciation - Partial Years',
    'Revision of Depreciation Estimates',
    'Intangible Assets - Recognition',
    'Intangible Assets - Measurement',
    'Goodwill and Business Combinations',
    'Impairment of Long-Lived Assets',
    'Impairment of Goodwill',
    'Disposal of PPE and Intangibles',
    'Module 5 Assessment'
  ]
  
  // Module 6: Investments and Fair Value Accounting (Orders 79-93)
  const farModule6Lessons = [
    'Debt Securities - Classification',
    'Debt Securities - Amortized Cost',
    'Debt Securities - Fair Value Option',
    'Equity Securities - Fair Value Accounting',
    'Investments in Associates (Equity Method)',
    'Joint Ventures and Joint Arrangements',
    'Consolidation Overview',
    'Variable Interest Entities (VIEs)',
    'Fair Value Measurement Framework',
    'Fair Value Hierarchy',
    'Valuation Techniques for Fair Value',
    'Day 2 Gains and Losses',
    'Impairment of Investments',
    'Transfer Between Categories',
    'Module 6 Assessment'
  ]
  
  // Module 7: Liabilities, Bonds and Leases (Orders 94-112)
  const farModule7Lessons = [
    'Classification of Liabilities',
    'Current vs Non-Current Classification',
    'Notes Payable and Interest Expense',
    'Bonds Payable - Initial Recognition',
    'Bonds Payable - Effective Interest Method',
    'Bond Premium and Discount Amortization',
    'Early Bond Retirement',
    'Convertible Debt Instruments',
    'Debt with Warrants',
    'Induced Conversions',
    'Leases - Lessee Accounting (ASC 842)',
    'Leases - Lessor Accounting (ASC 842)',
    'Lease Classification Criteria',
    'Sale-Type and Direct Financing Leases',
    'Operating Lease Presentation',
    'Lease Modifications and Reassessments',
    'Module 7 Assessment',
    'Module 7 Practical Exercise'
  ]
  
  // Module 8: Pensions and Employee Benefits (Orders 113-127)
  const farModule8Lessons = [
    'Types of Pension Plans',
    'Defined Contribution Plans',
    'Defined Benefit Plans',
    'Pension Expense Components',
    'Service Cost and Interest Cost',
    'Expected Return on Plan Assets',
    'Amortization of Prior Service Cost',
    'Gains and Losses on Pension Plans',
    'Pension Asset/Liability Recognition',
    'Other Post-Employment Benefits (OPEB)',
    'Compensated Absences (Vacation Pay)',
    'Bonus and Profit Sharing Plans',
    'Employee Stock Ownership Plans (ESOP)',
    'Multiemployer Plans',
    'Module 8 Assessment'
  ]
  
  // Module 9: Income Taxes - Deferred Tax (Orders 128-142)
  const farModule9Lessons = [
    'Introduction to Income Tax Accounting',
    'Temporary vs Permanent Differences',
    'Deferred Tax Assets and Liabilities',
    'Valuation Allowance for DTAs',
    'Effective Tax Rate Reconciliation',
    'Intraperiod Tax Allocation',
    'Interperiod Tax Allocation',
    'Net Operating Losses (NOL)',
    'Tax Credits and Their Accounting',
    'Uncertain Tax Positions (ASC 740)',
    'Accounting for Change in Tax Status',
    'Deferred Tax for Flow-Through Entities',
    'Presentation and Disclosure Requirements',
    'Tax Planning Strategies',
    'Module 9 Assessment'
  ]
  
  // Module 10: Cash Flow Statements (Orders 143-155)
  const farModule10Lessons = [
    'Purpose and Importance of Cash Flow',
    'Classification of Cash Flows',
    'Operating Activities - Direct Method',
    'Operating Activities - Indirect Method',
    'Investing Activities',
    'Financing Activities',
    'Non-Cash Investing and Financing',
    'Reconciliation of Net Income to Cash',
    'Preparing the Statement of Cash Flows',
    'Cash Flow Ratios and Analysis',
    'Free Cash Flow Calculation',
    'Operating Cash Flow Quality',
    'Direct vs Indirect Method Comparison',
    'Module 10 Assessment'
  ]
  
  // Module 11: Consolidations and Business Combinations (Orders 156-170)
  const farModule11Lessons = [
    'Business Combinations - Overview',
    'Acquisition Method',
    'Identifying the Acquirer',
    'Determining Acquisition Date',
    'Recognizing and Measuring Assets and Liabilities',
    'Goodwill and Bargain Purchase',
    'Contingent Consideration',
    'Push-Down Accounting',
    'Consolidated Financial Statements',
    'Wholly Owned Subsidiary Consolidation',
    'Noncontrolling Interest',
    'Intra-Entity Transactions',
    'Equity Method vs Consolidation',
    'Step Acquisitions',
    'Module 11 Assessment'
  ]
  
  // Module 12: Governmental and Not-for-Profit Accounting (Orders 171-185)
  const farModule12Lessons = [
    'Governmental Accounting Overview',
    'Governmental Fund Accounting',
    'Modified Accrual Basis',
    'General Fund and Special Revenue Funds',
    'Capital Projects Funds',
    'Debt Service Funds',
    'Proprietary Funds - Enterprise Funds',
    'Proprietary Funds - Internal Service Funds',
    'Fiduciary Funds',
    'Government-Wide Financial Statements',
    'Not-for-Profit Accounting Overview',
    'NFP Financial Statements',
    'Contribution Recognition - ASU 2018-08',
    'NFP Expenses and Functional Allocation',
    'Module 12 Assessment'
  ]
  
  // Module 13: FAR Simulation and Case Practice (Orders 186-200)
  const farModule13Lessons = [
    'FAR Comprehensive Review',
    'Complex Revenue Recognition Cases',
    'Multi-Step Inventory Problems',
    'Advanced Lease Accounting Scenarios',
    'Pension Accounting Simulations',
    'Consolidation Workpaper Exercises',
    'Governmental Accounting Practice',
    'NFP Contribution Scenarios',
    'Deferred Tax Planning Cases',
    'Fair Value Measurement Problems',
    'Cash Flow Statement Preparation',
    'Integrated FAR Case Study',
    'FAR Exam Strategy and Tips',
    'Common FAR Exam Mistakes',
    'Module 13 Assessment'
  ]

  // ============ SECTION 2: AUD - Auditing and Attestation (120 Hours) ============
  // Module 1: Ethics and Professional Responsibilities (Orders 201-212)
  const audModule1Lessons = [
    'Code of Professional Conduct Overview',
    'AICPA Code of Ethics Principles',
    'Independence Requirements',
    'Integrity and Objectivity',
    'General Standards and Performance Standards',
    'Accounting Principles and Reporting Standards',
    'Ethical Conflicts and Resolution',
    'State Board of Accountancy Requirements',
    'Peer Review Requirements',
    'Continuing Professional Education (CPE)',
    'Disciplinary Proceedings and Actions',
    'Module 1 Assessment'
  ]
  
  // Module 2: Audit Planning and Risk Assessment (Orders 213-224)
  const audModule2Lessons = [
    'Pre-Engagement Planning Activities',
    'Engagement Letters and Terms',
    'Understanding the Entity and Environment',
    'Assessing Control Risk',
    'Risk of Material Misstatement (RMM)',
    'Inherent Risk and Control Risk',
    'Audit Risk Model and Components',
    'Risk Assessment Procedures',
    'Fraud Risk Assessment',
    'Risk Response Strategies',
    'Overall Audit Strategy',
    'Module 2 Assessment'
  ]
  
  // Module 3: Internal Controls - COSO Framework (Orders 225-236)
  const audModule3Lessons = [
    'COSO Internal Control Framework',
    'Control Environment',
    'Risk Assessment Component',
    'Control Activities',
    'Information and Communication',
    'Monitoring Activities',
    'Entity-Level Controls vs Transaction-Level',
    'Control Deficiencies and Compensating Controls',
    'Assessing Control Effectiveness',
    'Automated Control Considerations',
    'Limitations of Internal Control',
    'Module 3 Assessment'
  ]
  
  // Module 4: Audit Evidence and Procedures (Orders 237-248)
  const audModule4Lessons = [
    'Nature and Sufficiency of Evidence',
    'Types of Audit Evidence',
    'Audit Documentation',
    'Physical Observation',
    'Confirmation Process',
    'Reperformance and Recalculation',
    'Analytical Procedures',
    'Inquiry and Representation Letters',
    'Evidence Quality Assessment',
    'Timing of Audit Procedures',
    'Extent of Audit Procedures',
    'Module 4 Assessment'
  ]
  
  // Module 5: Sampling and Documentation (Orders 249-258)
  const audModule5Lessons = [
    'Audit Sampling Overview',
    'Statistical vs Non-Statistical Sampling',
    'Sampling Risk and Non-Sampling Risk',
    'Sample Selection Methods',
    'Attribute Sampling for Tests of Controls',
    'Variable Sampling for Substantive Tests',
    'Sample Size Determination',
    'Evaluating Sample Results',
    'Non-Statistical Sampling Approaches',
    'Dual-Purpose Samples',
    'Documentation Requirements',
    'Module 5 Assessment'
  ]
  
  // Module 6: Audit of Revenue, Expenses and Assets (Orders 259-272)
  const audModule6Lessons = [
    'Revenue Recognition Audit Procedures',
    'Cutoff Testing for Revenue',
    'Accounts Receivable Confirmation',
    'Alternative Procedures for Receivables',
    'Audit of Cash and Cash Equivalents',
    'Inventory Observation Procedures',
    'Inventory Price Test Procedures',
    'Audit of Property, Plant and Equipment',
    'Audit of Intangible Assets',
    'Audit of Accounts Payable',
    'Audit of Accrued Liabilities',
    'Audit of Equity Transactions',
    'Related Party Transactions',
    'Module 6 Assessment'
  ]
  
  // Module 7: Audit Reports and Opinions (Orders 273-284)
  const audModule7Lessons = [
    'Unmodified (Unqualified) Opinion',
    'Qualified Opinion',
    'Disclaimer of Opinion',
    'Adverse Opinion',
    'Report Modifications - Other Information',
    'Report Modifications - Known Departures',
    'Emphasis-of-Matter Paragraphs',
    'Other-Matter Paragraphs',
    'Comparative Financial Statements',
    'Reissued Audit Reports',
    'Review vs Audit Engagement Reports',
    'Module 7 Assessment'
  ]
  
  // Module 8: Attestation Engagements (Orders 285-294)
  const audModule8Lessons = [
    'Attestation Engagements Overview',
    'Examination Engagements',
    'Review Engagements',
    'Agreed-Upon Procedures Engagements',
    'Attestation on Compliance',
    'Service Organization Controls (SOC)',
    'SOC 1 Reports',
    'SOC 2 and SOC 3 Reports',
    'Attestation on MD&A',
    'Module 8 Assessment'
  ]
  
  // Module 9: Government Audits (Orders 295-306)
  const audModule9Lessons = [
    'Government Auditing Standards (Yellow Book)',
    'Single Audit Act Requirements',
    'Uniform Guidance (OMB Circular A-133)',
    'Compliance Testing',
    'Audit of Federal Awards',
    'Major Program Determination',
    'Type A and Type B Programs',
    'Low-Risk Type A Criteria',
    'Reportable Conditions and Material Weaknesses',
    'Audit Findings and Reporting',
    'Recoverability Reviews',
    'Module 9 Assessment'
  ]
  
  // Module 10: AUD Simulations and Case Studies (Orders 307-320)
  const audModule10Lessons = [
    'Comprehensive AUD Review',
    'Ethics Case Scenarios',
    'Risk Assessment Practice',
    'Internal Control Evaluation Cases',
    'Evidence Collection Problems',
    'Sampling Application Exercises',
    'Audit Report Writing',
    'Attestation Engagement Scenarios',
    'Government Audit Cases',
    'Integrated AUD Case Study',
    'AUD Exam Strategy and Tips',
    'Common AUD Exam Mistakes',
    'Module 10 Assessment',
    'Mock Exam AUD Section',
    'AUD Performance Review'
  ]

  // ============ SECTION 3: REG - Regulation (120 Hours) ============
  // Module 1: Ethics and Professional Responsibility (Orders 321-330)
  const regModule1Lessons = [
    'Ethics and Professional Responsibility Overview',
    'AICPA Code of Conduct for Tax Professionals',
    'Treasury Department Circular 230',
    'IRS Ethics and Practice Requirements',
    'Tax Return Penalties',
    'Civil and Criminal Penalties',
    'Practitioner Privileges',
    'Unethical Tax Practices',
    'State Board Ethics Requirements',
    'Module 1 Assessment'
  ]
  
  // Module 2: Business Law (Orders 331-344)
  const regModule2Lessons = [
    'Contract Law - Formation',
    'Contract Law - Performance and Breach',
    'Third-Party Rights and Assignments',
    'Sales Law (UCC Article 2)',
    'Bailment and Lease Transactions',
    'Agency Law and Relationships',
    'Employer-Employee Relationships',
    'Partnership Formation and Operation',
    'Limited Liability Entities',
    'Corporate Formation and Capital Structure',
    'Secured Transactions (UCC Article 9)',
    'Bankruptcy Law - Chapter 7',
    'Bankruptcy Law - Chapter 11',
    'Module 2 Assessment'
  ]
  
  // Module 3: Federal Taxation - Individuals (Orders 345-360)
  const regModule3Lessons = [
    'Gross Income - Inclusion Rules',
    'Gross Income - Exclusions',
    'Adjusted Gross Income (AGI)',
    'Standard Deduction vs Itemized Deductions',
    'Medical and Dental Expenses',
    'Charitable Contributions',
    'Casualty and Theft Losses',
    'Moving Expenses',
    'HSA and Archer MSA Deductions',
    'Educational Expenses',
    'Self-Employment Tax',
    'Individual Estimated Tax Payments',
    'Filing Status and Exemptions',
    'Tax Credits for Individuals',
    'Module 3 Assessment'
  ]
  
  // Module 4: Federal Taxation - Corporations (Orders 361-376)
  const regModule4Lessons = [
    'C Corporation Formation',
    'C Corporation Income Calculation',
    'C Corporation Deductions',
    'Dividends Received Deduction',
    'Net Operating Losses (NOL)',
    'Corporate Tax Rates',
    'Alternative Minimum Tax (AMT)',
    'Accumulated Earnings Tax',
    'Personal Holding Company Tax',
    'Corporate Distributions',
    'Stock Dividends and Stock Splits',
    'Redemptions and Liquidations',
    'Section 1244 Stock Losses',
    'Corporate Tax Planning Strategies',
    'Module 4 Assessment'
  ]
  
  // Module 5: Partnerships and S-Corporations (Orders 377-392)
  const regModule5Lessons = [
    'Partnership Formation and Basis',
    'Partnership Income Allocation',
    'Special Allocations and Override',
    'Partner Distributions',
    'Partnership Filing Requirements',
    'Partner Self-Employment Income',
    'S-Corporation Election and Qualification',
    'S-Corporation Income Allocation',
    'S-Corporation Distributions',
    'S-Corporation Losses',
    'Built-In Gains Tax',
    'Excess Net Passive Income',
    'S-Corporation Shareholder Compensation',
    'S-Corp vs C-Corp Election',
    'Module 5 Assessment'
  ]
  
  // Module 6: Property Transactions (Orders 393-406)
  const regModule6Lessons = [
    'Classification of Property Transactions',
    'Determination of Basis',
    'Cost Basis and Adjusted Basis',
    'Nontaxable Exchanges - Section 1031',
    'Like-Kind Exchange Rules',
    'Section 1031 Exchangeboot Rules',
    'Involuntary Conversions - Section 1033',
    'Deferred Like-Kind Exchanges',
    'Related Party Transactions',
    'Sale of Principal Residence',
    'Section 121 Exclusion Rules',
    'Capital Gains and Losses',
    'Capital Loss Limitation Rules',
    'Module 6 Assessment'
  ]
  
  // Module 7: Tax Credits and Deductions (Orders 407-418)
  const regModule7Lessons = [
    'General Business Tax Credits',
    'Research Credit',
    'Work Opportunity Credit',
    'Small Employer Health Insurance',
    'Child Tax Credit',
    'Education Credits',
    'Elderly and Disabled Credits',
    'Foreign Tax Credit',
    'Minimum Tax Credit',
    'Refundable vs Nonrefundable Credits',
    'General Deduction Limitations',
    'Section 280A Limits',
    'Module 7 Assessment'
  ]
  
  // Module 8: Tax Compliance and Procedures (Orders 419-430)
  const regModule8Lessons = [
    'Tax Return Filing Requirements',
    'Extension of Time to File',
    'Statute of Limitations',
    'Assessment and Collection Process',
    'IRS Examination Process',
    'Appeal and Collection Due Process',
    'Offers in Compromise',
    'Installment Agreements',
    'Tax Liens and Levies',
    'Innocent Spouse Relief',
    'Passive Activity Loss Rules',
    'At-Risk Rules',
    'Module 8 Assessment'
  ]
  
  // Module 9: REG Simulations and Practical Tax Cases (Orders 431-440)
  const regModule9Lessons = [
    'Comprehensive REG Review',
    'Business Law Case Studies',
    'Individual Tax Return Preparation',
    'Corporate Tax Return Cases',
    'Partnership Taxation Scenarios',
    'S-Corp Election Analysis',
    'Property Transaction Planning',
    'Tax Credit Optimization',
    'Compliance Review Exercise',
    'Integrated REG Case Study',
    'REG Exam Strategy and Tips',
    'Common REG Exam Mistakes',
    'Module 9 Assessment'
  ]

  // ============ SECTION 4: DISCIPLINE SECTION - Choose One Track ============
  // Track A: BAR - Business Analysis and Reporting (Orders 441-460)
  const barModule1Lessons = [
    'Advanced Financial Reporting Overview',
    'Complex Revenue Recognition Scenarios',
    'Business Combinations - Advanced Topics',
    'Variable Interest Entities - Complex Cases',
    'Foreign Currency Transactions',
    'Translation vs Transaction Adjustments',
    'Derivatives and Hedging Accounting',
    'Fair Value Measurement - Advanced',
    'Data Analytics in Auditing',
    'Data Visualization for Accountants',
    'Statistical Analysis Techniques',
    'Financial Modeling Fundamentals',
    'Valuation Modeling Approaches',
    'Strategic Performance Analysis',
    'Module BAR Assessment'
  ]
  
  const barModule2Lessons = [
    'Performance Measurement Frameworks',
    'Balanced Scorecard Implementation',
    'Key Performance Indicators',
    'Benchmarking and Industry Analysis',
    'Budgeting and Forecasting Techniques',
    'Zero-Based Budgeting',
    'Activity-Based Costing',
    'Target Costing Approaches',
    'Lean Accounting Principles',
    'Management Reporting Systems',
    'Predictive Analytics in Finance',
    'Business Intelligence Tools',
    'Dashboard Design Principles',
    'Automated Reporting Solutions',
    'BAR Mock Exam'
  ]

  // Track B: ISC - Information Systems and Controls (Orders 441-460)
  const iscModule1Lessons = [
    'IT Governance Overview',
    'IT Strategy and Architecture',
    'COBIT Framework',
    'ITIL Principles',
    'IT Risk Management',
    'Cybersecurity Fundamentals',
    'Threat Identification and Assessment',
    'Security Controls and Safeguards',
    'Access Control Systems',
    'Encryption and Data Protection',
    'Network Security',
    'Malware and Intrusion Detection',
    'Incident Response Planning',
    'Disaster Recovery Planning',
    'Module ISC Assessment'
  ]
  
  const iscModule2Lessons = [
    'System Development Life Cycle',
    'Systems Acquisition and Implementation',
    'Testing and Change Management',
    'Application Controls',
    'General Controls',
    'Business Continuity Management',
    'Cloud Computing Considerations',
    'Outsourcing and Third-Party Risk',
    'SOC Reports - Technical Review',
    'IT Audit Procedures',
    'Audit Trail and Log Management',
    'Database Controls',
    'Blockchain Considerations',
    'Emerging Technologies in Accounting',
    'ISC Mock Exam'
  ]

  // Track C: TCP - Tax Compliance and Planning (Orders 441-460)
  const tcpModule1Lessons = [
    'Advanced Tax Planning Overview',
    'Individual Tax Strategy Optimization',
    'Business Entity Selection',
    'Compensation Planning Strategies',
    'Retirement Plan Tax Planning',
    'Executive Compensation Analysis',
    'Fringe Benefits Taxation',
    'Multistate Taxation Fundamentals',
    'Apportionment and Allocation',
    'Nexus and Taxability Determinations',
    'International Tax Fundamentals',
    'Transfer Pricing Concepts',
    'Treaty-Based Planning',
    'Foreign Tax Credit Planning',
    'Module TCP Assessment'
  ]
  
  const tcpModule2Lessons = [
    'Advanced Corporate Tax Planning',
    'Merger and Acquisition Tax Strategies',
    'Stock vs Asset Acquisitions',
    'Tax-Free Reorganizations',
    'Section 338 Elections',
    'Partnership Taxation Planning',
    'Trust and Estate Taxation',
    'Gift Tax Planning Strategies',
    'Wealth Transfer Optimization',
    'Tax-Exempt Organization Planning',
    'State and Local Tax (SALT) Planning',
    'Tax Controversy and Resolution',
    'Tax Research Methodology',
    'Client Advisory Services',
    'TCP Mock Exam'
  ]

  // ============ BUILD ALL LESSONS ============
  
  // Section 1: FAR Lessons
  const allFarLessons = [...farModule1Lessons, ...farModule2Lessons, ...farModule3Lessons, 
                         ...farModule4Lessons, ...farModule5Lessons, ...farModule6Lessons,
                         ...farModule7Lessons, ...farModule8Lessons, ...farModule9Lessons,
                         ...farModule10Lessons, ...farModule11Lessons, ...farModule12Lessons,
                         ...farModule13Lessons]
  
  // Section 2: AUD Lessons
  const allAudLessons = [...audModule1Lessons, ...audModule2Lessons, ...audModule3Lessons,
                         ...audModule4Lessons, ...audModule5Lessons, ...audModule6Lessons,
                         ...audModule7Lessons, ...audModule8Lessons, ...audModule9Lessons,
                         ...audModule10Lessons]
  
  // Section 3: REG Lessons
  const allRegLessons = [...regModule1Lessons, ...regModule2Lessons, ...regModule3Lessons,
                         ...regModule4Lessons, ...regModule5Lessons, ...regModule6Lessons,
                         ...regModule7Lessons, ...regModule8Lessons, ...regModule9Lessons]
  
  // Section 4: Discipline Lessons (choosing BAR track as default)
  const allDisciplineLessons = [...barModule1Lessons, ...barModule2Lessons]

  // Combine all lessons
  const allLessons = [...allFarLessons, ...allAudLessons, ...allRegLessons, ...allDisciplineLessons]

  console.log(`📚 Total lessons to create: ${allLessons.length}`)

  try {
    // Prepare all lessons for batch creation
    const lessonsToCreate = allLessons.map((title, i) => ({
      id: `${courseId}_lesson_${i + 1}`,
      title: title,
      content: `Complete lesson content for: ${title}`,
      duration: 30,
      order: i + 1,
      isActive: true,
      courseId: courseId
    }))
    
    // Create all lessons in a single batch operation
    await prisma.lesson.createMany({
      data: lessonsToCreate
    })
    
    console.log(`✅ Created ${allLessons.length} lessons`)
    
    // Create assessments for each major section
    const sectionAssessments = [
      { title: 'FAR Section Assessment', idSuffix: 'far_assessment' },
      { title: 'AUD Section Assessment', idSuffix: 'aud_assessment' },
      { title: 'REG Section Assessment', idSuffix: 'reg_assessment' },
      { title: 'Discipline Section Assessment', idSuffix: 'discipline_assessment' },
      { title: 'CPA Final Mock Exam', idSuffix: 'final_mock' },
      { title: 'CPA Comprehensive Practice Exam', idSuffix: 'comprehensive_practice' }
    ]
    
    for (const assessment of sectionAssessments) {
      const created = await prisma.assessment.create({
        data: {
          id: `${courseId}_${assessment.idSuffix}`,
          title: assessment.title,
          type: 'PRACTICE',
          isActive: true,
          courseId: courseId
        }
      })
      assessments.push(created)
    }
    
    console.log(`✅ Created ${assessments.length} assessments`)
    console.log(`📊 Section breakdown:`)
    console.log(`   FAR: ${allFarLessons.length} lessons`)
    console.log(`   AUD: ${allAudLessons.length} lessons`)
    console.log(`   REG: ${allRegLessons.length} lessons`)
    console.log(`   Discipline: ${allDisciplineLessons.length} lessons`)
    console.log(`   Total: ${allLessons.length} lessons + ${assessments.length} assessments`)
    
    console.log('🎉 US CPA course seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding course:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()