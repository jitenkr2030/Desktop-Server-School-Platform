const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const courseId = 'acca_level3';

// SBL – Strategic Business Leader (Lessons 1-90)
const sblLessons = [
  // Module 1: Leadership & Governance (15 lessons)
  "Introduction to Strategic Business Leader",
  "Role of the CFO and Finance Function",
  "Leadership and Organizational Culture",
  "Corporate Governance Principles and Codes",
  "Board Composition and Effectiveness",
  "Director Responsibilities and Liabilities",
  "Shareholder Rights and Stakeholder Engagement",
  "ESG - Environmental, Social, and Governance",
  "Sustainability Reporting Frameworks",
  "Corporate Social Responsibility",
  "Business Ethics and Professional Values",
  "Corporate Governance in Different Jurisdictions",
  "Audit Committee and Risk Committee",
  "Whistleblowing and Internal Controls",
  "Leadership Styles and Organizational Behavior",
  
  // Module 2: Strategy Analysis & Development (20 lessons)
  "Strategic Analysis - PESTEL Framework",
  "Porter's Five Forces Analysis",
  "Industry Life Cycle Analysis",
  "SWOT Analysis and Strategic Positioning",
  "Value Chain Analysis",
  "Core Competencies and Competitive Advantage",
  "McKinsey 7S Framework",
  "BCG Matrix and Portfolio Management",
  "Ansoff Matrix for Growth Strategies",
  "Blue Ocean Strategy Concept",
  "Generic Competitive Strategies",
  "Cost Leadership vs Differentiation",
  "Strategic alliances and Partnerships",
  "Mergers and Acquisitions Strategy",
  "Joint Ventures and Strategic Alliances",
  "Vertical Integration Strategies",
  "Diversification and Related Unrelated",
  "Strategic Group Analysis",
  "Scenario Planning and Future Analysis",
  "Strategic Options and Choice Methods",
  
  // Module 3: Risk Management & Internal Control (20 lessons)
  "Risk Management Overview and COSO Framework",
  "Risk Identification and Assessment",
  "Risk Appetite and Risk Tolerance",
  "Risk Register and Risk Matrix",
  "Inherent Risk vs Residual Risk",
  "Strategic, Operational, Financial, and Hazard Risks",
  "Enterprise Risk Management (ERM) Framework",
  "Internal Control Systems and Procedures",
  "Three Lines of Defense Model",
  "Control Environment and Tone at the Top",
  "Control Activities and Segregation of Duties",
  "Information and Communication in Controls",
  "Monitoring and Continuous Improvement",
  "Compliance Risk and Regulatory Risk",
  "Reputational Risk Management",
  "Cybersecurity Risk and Data Protection",
  "Business Continuity Planning (BCP)",
  "Disaster Recovery Planning",
  "Crisis Management Strategies",
  "Risk Reporting and Communication",
  
  // Module 4: Technology & Digital Transformation (15 lessons)
  "Digital Transformation in Business",
  "Artificial Intelligence and Machine Learning",
  "Big Data Analytics and Business Intelligence",
  "Cloud Computing and Infrastructure",
  "Blockchain Technology and Applications",
  "Internet of Things (IoT) in Business",
  "Robotic Process Automation (RPA)",
  "Cybersecurity Threats and Countermeasures",
  "Data Privacy and GDPR Compliance",
  "E-commerce and Digital Business Models",
  "Agile and Digital Project Management",
  "Change Management in Digital Transformation",
  "Digital Strategy and Innovation",
  "Technology Governance and Controls",
  "Digital Ethics and Responsible AI",
  
  // Module 5: Innovation & Change Management (10 lessons)
  "Innovation Types and Frameworks",
  "Disruptive Innovation and incumbent Response",
  "Change Management Models (Kotter, ADKAR)",
  "Resistance to Change and Overcoming Barriers",
  "Stakeholder Management in Change",
  "Communication in Change Management",
  "Organizational Development Interventions",
  "Culture Change and Transformation",
  "Innovation Ecosystems and Open Innovation",
  "Managing Innovation Projects",
  
  // Module 6: Finance in Planning & Decision Making (10 lessons)
  "Strategic Financial Analysis",
  "Working Capital Management Strategies",
  "Capital Structure Decision Making",
  "Dividend Policy and Shareholder Value",
  "Valuation Methods and Principles",
  "Economic Value Added (EVA)",
  "Balanced Scorecard and Strategy Mapping",
  "Performance Measurement Systems",
  "Corporate Restructuring Strategies",
  "Corporate Governance and Executive Compensation"
];

// SBR – Strategic Business Reporting (Lessons 91-170)
const sbrLessons = [
  // Module 1: Professional & Ethical Duties (12 lessons)
  "Fundamentals of Corporate Reporting",
  "Ethical Framework for Accountants",
  "Professional Competence and Due Care",
  "Confidentiality and Data Security",
  "Conflicts of Interest and Independence",
  "Professional Skepticism and Judgment",
  "Fraud and Financial Statement Manipulation",
  "Regulatory Environment for Reporting",
  "Corporate Reporting Standards Overview",
  "ACCA Code of Ethics and Conduct",
  "Reporting to Those Charged with Governance",
  "Professional Liability and Negligence",
  
  // Module 2: Financial Reporting Framework (15 lessons)
  "Conceptual Framework for Financial Reporting",
  "Qualitative Characteristics of Financial Info",
  "Recognition and Measurement Principles",
  "Double Entry and Accounting Equations",
  "Accruals and Matching Concepts",
  "Going Concern Assumption",
  "Prudence and Conservatism",
  "Substance over Form",
  "Fair Presentation and Compliance",
  "International Financial Reporting Standards",
  "Regulatory Framework for Accounting",
  "First-time Adoption of IFRS",
  "IAS 1 - Presentation of Financial Statements",
  "IAS 8 - Accounting Policies and Estimates",
  "IAS 10 - Events After Reporting Period",
  
  // Module 3: Reporting Financial Performance (20 lessons)
  "Revenue Recognition Principles (IFRS 15)",
  "Performance Obligations and Transaction Price",
  "Variable Consideration and Contract Assets",
  "Revenue Recognition for Multiple Elements",
  "IAS 12 - Income Taxes",
  "Current and Deferred Tax Calculations",
  "Tax Base and Temporary Differences",
  "Recognition of Deferred Tax Assets",
  "Presentation of Tax in Financial Statements",
  "IAS 16 - Property, Plant and Equipment",
  "Cost Models and Revaluation Models",
  "Component Depreciation and Useful Life",
  "Impairment of Assets (IAS 36)",
  "Reversal of Impairment Losses",
  "Investment Property (IAS 40)",
  "Biological Assets (IAS 41)",
  "Intangible Assets (IAS 38)",
  "Research and Development Costs",
  "Leases (IFRS 16) - Lessee Accounting",
  "Leases (IFRS 16) - Lessor Accounting",
  
  // Module 4: Group Accounts & Consolidations (20 lessons)
  "Principles of Group Accounting",
  "IFRS 10 - Consolidated Financial Statements",
  "Control and Power over Investee",
  "Voting Rights and Contractual Arrangements",
  "Subsidiary vs Associate vs Joint Venture",
  "Consolidation Methodology - Full Consolidation",
  "Elimination of Intra-group Transactions",
  "Unrealized Profits in Intra-group Sales",
  "Non-controlling Interests (NCI)",
  "Goodwill on Consolidation",
  "Measurement of Goodwill",
  "Impairment of Goodwill",
  "Equity Method for Associates (IAS 28)",
  "Investment in Joint Ventures (IFRS 11)",
  "Joint Arrangements and Classification",
  "Fair Value Measurement (IFRS 13)",
  "Complex Group Structures",
  "Foreign Currency Translation (IAS 21)",
  "Functional Currency and Presentation Currency",
  "Translation of Foreign Operations",
  
  // Module 5: Specialized Entities & Instruments (18 lessons)
  "Financial Instruments - IAS 32 and IFRS 9",
  "Classification and Measurement of Financial Assets",
  "Impairment of Financial Assets",
  "Hedge Accounting (IFRS 9)",
  "Derivatives and Embedded Derivatives",
  "Equity Instruments and Share Capital",
  "Compound Financial Instruments",
  "Financial Liabilities and Derecognition",
  "Accounting for Government Grants (IAS 20)",
  "Agriculture and Biological Assets",
  "Insurance Contracts (IFRS 17)",
  "Revenue from Contracts with Customers",
  "Construction Contracts (IFRS 15)",
  "Non-current Assets Held for Sale (IFRS 5)",
  "Discontinued Operations and Disposals",
  "Business Combinations (IFRS 3)",
  "Acquisition Method and Goodwill",
  "Accounting for Partial Acquisitions",
  
  // Module 6: Analysis & Interpretation (15 lessons)
  "Financial Statement Analysis Techniques",
  "Ratio Analysis - Profitability Ratios",
  "Ratio Analysis - Liquidity and Solvency",
  "Efficiency and Activity Ratios",
  "Investor Ratios and Market Ratios",
  "Common Size Analysis",
  "Trend Analysis and Horizontal Analysis",
  "Cash Flow Analysis and Ratios",
  "Working Capital Analysis",
  " DuPont Analysis andROCE",
  "Interpretation Challenges and Limitations",
  "Creative Accounting and Red Flags",
  "Going Concern Analysis",
  "Predictive Value and Bankruptcy Models",
  "Integrated Reporting and Sustainability"
];

// AFM – Advanced Financial Management (Lessons 171-246)
const afmLessons = [
  // Module 1: Corporate Finance Strategy (12 lessons)
  "Strategic Financial Management Overview",
  "Corporate Objectives and Value Creation",
  "Shareholder Value Maximization",
  "Stakeholder Theory and Agency Theory",
  "Corporate Governance and Finance",
  "International Financial Management",
  "Exchange Rate Risk and Exposure",
  "Interest Rate Risk Management",
  "Economic and Translational Exposure",
  "Treasury Management and Function",
  "Corporate Financing Strategies",
  "Financial Strategy Formulation",
  
  // Module 2: Advanced Investment Appraisal (15 lessons)
  "Discounted Cash Flow Techniques",
  "NPV vs IRR - Conflicts and Solutions",
  "Capital Budgeting Process",
  "Risk Analysis in Investment Appraisal",
  "Sensitivity Analysis Techniques",
  "Scenario Analysis and Simulation",
  "Decision Trees for Investment Decisions",
  "Real Options Analysis",
  "Option to Expand, Abandon, and Defer",
  "Monte Carlo Simulation in Finance",
  "Adjusted Present Value (APV) Method",
  "WACC and Cost of Capital Adjustments",
  "Specific Investment Risk Adjustments",
  "Project Finance and Structuring",
  "Public Sector Investment Appraisal",
  
  // Module 3: Business Valuations (15 lessons)
  "Valuation Principles and Methodologies",
  "DCF Valuation and Terminal Value",
  "Comparable Company Analysis (Comps)",
  "Precedent Transaction Analysis",
  "Asset-based Valuation Methods",
  "Earnings-based Valuation (P/E Ratio)",
  "Economic Value Added (EVA) Valuation",
  "Valuation of Private Companies",
  "Valuation of Intangible Assets",
  "Goodwill Impairment Testing",
  "Valuation for Mergers and Acquisitions",
  "Discounts and Premiums in Valuation",
  "Synergy Valuation in M&A",
  "Valuation for Restructuring",
  "Emerging Market Valuation Challenges",
  
  // Module 4: Mergers & Acquisitions (15 lessons)
  "M&A Rationale and Strategic Fit",
  "Types of Mergers - Horizontal, Vertical, Conglomerate",
  "M&A Process and Due Diligence",
  "Deal Structuring and Consideration",
  "Share Purchase vs Asset Purchase",
  "Financing M&A Transactions",
  "Leveraged Buyouts (LBOs)",
  "Management Buyouts (MBOs)",
  "Private Equity and Venture Capital",
  "Post-merger Integration",
  "Cross-border M&A Considerations",
  "Regulatory and Competition Issues",
  "Reverse Takeovers and SPACs",
  "M&A Success Factors",
  "Corporate Recovery and Turnaround",
  
  // Module 5: Risk Management & Derivatives (12 lessons)
  "Introduction to Financial Derivatives",
  "Forward Contracts and Futures",
  "Options - Calls and Puts",
  "Option Pricing Models (Black-Scholes)",
  "Swaps - Interest Rate and Currency",
  "Hedging Strategies and Effectiveness",
  "Hedging Accounting (IFRS 9)",
  "Risk Management Policies",
  "Commodity Risk Management",
  "Credit Risk and Counterparty Risk",
  "Value at Risk (VaR) Models",
  "Stress Testing and Scenario Analysis"
];

// AAA – Advanced Audit & Assurance (Lessons 171-246)
const aaaLessons = [
  // Module 1: Audit Strategy & Planning (12 lessons)
  "Overview of Advanced Audit",
  "Regulatory Framework for Audits",
  "Audit Engagement and Planning",
  "Understanding the Entity and Environment",
  "Assessing Fraud Risk Factors",
  "Materiality and Performance Materiality",
  "Audit Risk Model and Assessment",
  "Audit Strategy and Audit Program",
  "Internal Audit vs External Audit",
  "Review and Other Assurance Engagements",
  "Regulatory and Statutory Audits",
  "Group Audits Considerations",
  
  // Module 2: Professional & Ethical Judgment (10 lessons)
  "Ethical Framework for Auditors",
  "ACCA Code of Ethics - Fundamental Principles",
  "Independence and Objectivity",
  "Confidentiality and Data Security",
  "Professional Competence and Due Care",
  "Professional Skepticism",
  "Ethical Conflicts and Resolution",
  "Ethics in High-Risk Engagements",
  "Tone at the Top and Culture",
  "Whistleblowing and Reporting Concerns",
  
  // Module 3: Quality Management (ISQM) (10 lessons)
  "Quality Management Standards (ISQM 1)",
  "System of Quality Management",
  "Risk Assessment Process",
  "Governance and Leadership",
  "Ethical and Professional Requirements",
  "Acceptance and Continuance Relationships",
  "Engagement Performance Standards",
  "Monitoring and Remediation",
  "ISQM 2 - Engagement Quality Reviews",
  "International Standards on Auditing Overview",
  
  // Module 4: Audit of Complex Entities (18 lessons)
  "Audit of Financial Services Entities",
  "Audit of Insurance Companies",
  "Audit of Banks and Financial Institutions",
  "Audit of Investment Entities",
  "Audit of Pension Funds",
  "Audit of Public Sector Entities",
  "Audit of Not-for-Profit Organizations",
  "Audit of Complex Financial Instruments",
  "Audit of Revenue Recognition",
  "Audit of Group Consolidation",
  "Audit of Foreign Operations",
  "Audit of Related Party Transactions",
  "Audit of Events After Reporting Period",
  "Going Concern Assessment",
  "Subsequent Discovery of Facts",
  "Audit Evidence and Documentation",
  "Sampling and Audit Technology",
  "Forensic Audit and Investigation",
  
  // Module 5: Group Audits & Emerging Issues (16 lessons)
  "Group Audit Considerations",
  "Understanding Group Structure",
  "Component Auditors and Their Work",
  "Consolidation and Eliminations",
  "Communication with Component Auditors",
  "Review of Component Auditor Work",
  "Group Audit Opinion Formation",
  "Emerging Issues in Audit",
  "Sustainability and ESG Assurance",
  "Cybersecurity and IT Audit",
  "Data Analytics in Audit",
  "Artificial Intelligence in Audit",
  "Blockchain and Cryptocurrency Audit",
  "Regulatory Changes and Impact",
  "Climate Risk and Audit",
  "Future of Audit Profession"
];

// APM – Advanced Performance Management (Lessons 247-322)
const apmLessons = [
  // Module 1: Strategic Performance Management (12 lessons)
  "Strategic Performance Management Overview",
  "Performance Management Frameworks",
  "Balanced Scorecard Design",
  "Strategy Maps and Cause-effect Links",
  "Key Performance Indicators (KPIs)",
  "Performance Targets and Benchmarking",
  "Stretch Targets and Adaptive Planning",
  "Performance Management Systems",
  "Mission, Vision, and Values",
  "Stakeholder Analysis in Performance",
  "Corporate Governance and Performance",
  "ESG and Sustainability Metrics",
  
  // Module 2: Advanced Decision-Making (15 lessons)
  "Decision-making Models and Approaches",
  "Cost Volume Profit Analysis (CVP)",
  "Limiting Factors and Optimization",
  "Pricing Decisions and Strategies",
  "Product Portfolio Decisions",
  "Make or Buy Decisions",
  "Further Processing Decisions",
  "Special Order Decisions",
  "Theory of Constraints and Throughput",
  "Life Cycle Costing",
  "Target Costing and Value Engineering",
  "Environmental Cost Management",
  "Transfer Pricing Methods",
  "International Transfer Pricing",
  "Divisional Performance Evaluation",
  
  // Module 3: Performance Measurement Systems (15 lessons)
  "Traditional vs Contemporary Systems",
  "Financial Performance Measures",
  "Return on Investment (ROI)",
  "Residual Income (RI) and EVA",
  "Economic Profit Measures",
  "Non-financial Performance Indicators",
  "Customer and Market Metrics",
  "Internal Process Metrics",
  "Learning and Growth Metrics",
  "Integrated Performance Measurement",
  "Activity-based Costing (ABC)",
  "Time-driven ABC and TDABC",
  "Lean Accounting Principles",
  "Throughput Accounting",
  "Benchmarking and Best Practice",
  
  // Module 4: Risk and Uncertainty (10 lessons)
  "Risk Management in Performance",
  "Identification and Assessment of Risks",
  "Risk Appetite and Tolerance",
  "Control Risk and Mitigating Actions",
  "Scenario Planning and Analysis",
  "Decision-making Under Uncertainty",
  "Probabilistic Modeling",
  "Real Options in Decision-making",
  "Corporate Governance and Risk",
  "Risk Reporting and Communication",
  
  // Module 5: Big Data & Analytics (12 lessons)
  "Big Data in Performance Management",
  "Data Collection and Quality",
  "Business Intelligence Tools",
  "Dashboard and Visualization",
  "Predictive Analytics Techniques",
  "Machine Learning Applications",
  "Data-driven Decision Making",
  "Performance Reporting Automation",
  "Text Mining and Sentiment Analysis",
  "Social Media Analytics",
  "IoT and Real-time Performance",
  "Ethical Considerations in Analytics"
];

// ATX – Advanced Taxation (Lessons 285-322)
const atxLessons = [
  // Module 1: Advanced Income Tax Planning (12 lessons)
  "Overview of Advanced Taxation",
  "Principles of Tax Planning",
  "Tax Avoidance vs Tax Evasion",
  "General Anti-Abuse Rules (GAAR)",
  "Specific Anti-Avoidance Rules",
  "Corporate Tax Residence Rules",
  "Double Taxation and Relief Methods",
  "Withholding Tax Obligations",
  "Controlled Foreign Company Rules",
  "Transfer Pricing Fundamentals",
  "Thin Capitalization Rules",
  "Tax Consequences of Corporate Actions",
  
  // Module 2: Corporate Tax Strategy (15 lessons)
  "Corporate Tax Planning Strategies",
  "Group Relief and Loss Utilization",
  "Group Company Structures",
  "Company Incorporation and Capital",
  "Debt vs Equity Financing",
  "Repurchase of Shares and Capital",
  "Corporate Restructuring - Mergers",
  "Corporate Restructuring - Demergers",
  "Capital Gains Tax and Rollover Relief",
  "Business Asset Disposal Relief",
  "Enterprise Investment Scheme (EIS)",
  "Research and Development Credits",
  "Patent Box and Innovation Reliefs",
  "Corporate Entrepreneurship Relief",
  "Tax-efficient Profit Extraction",
  
  // Module 3: International Taxation (15 lessons)
  "International Tax Framework",
  "Source vs Residence Taxation",
  "Permanent Establishment Rules",
  "Treaty Interpretation and Application",
  "Tax Treaty Benefits and Limitations",
  "Beneficial Ownership Rules",
  "Dividend, Interest, and Royalty Taxation",
  "Cross-border Group Financing",
  "Intellectual Property Planning",
  "Holding Company Structures",
  "Branch vs Subsidiary Planning",
  "Tax Havens and Base Erosion",
  "Country-by-Country Reporting",
  "Transfer Pricing Documentation",
  "Advance Pricing Agreements (APAs)",
  
  // Module 4: Property & Inheritance Tax (12 lessons)
  "Property Taxation Overview",
  "Capital Gains Tax on Property",
  "Lettings Relief and Allowances",
  "Principal Private Residence Relief",
  "Inheritance Tax Basics",
  "Potentially Exempt Transfers",
  "Business Property Relief",
  "Agricultural Property Relief",
  "Lifetime vs Death Planning",
  "Trust Taxation",
  "Stamp Duty and Land Taxes",
  "Property Investment Structuring",
  
  // Module 5: Ethics and Compliance (12 lessons)
  "Tax Professional Ethics",
  "ACCA Tax Rules of Conduct",
  "Client Confidentiality and Disclosure",
  "Tax Advice and Opinion Letters",
  "Avoiding Unethical Tax Planning",
  "Tax Compliance Obligations",
  "Filing Deadlines and Penalties",
  "Tax Investigations and Disputes",
  "Alternative Dispute Resolution",
  "Publishing and Disclosure Rules",
  "Professional Negligence in Tax",
  "Continuing Professional Development"
];

async function main() {
  console.log('Starting ACCA Level 3 lesson seeding...');
  
  // Delete existing lessons first to avoid duplicates
  console.log('Cleaning up existing lessons...');
  await prisma.lesson.deleteMany({ where: { courseId } });
  await prisma.assessment.deleteMany({ where: { courseId } });
  
  // Prepare all lessons
  let allLessons = [];
  
  // Add SBL lessons
  sblLessons.forEach((title, index) => {
    allLessons.push({
      id: `${courseId}_lesson_${index + 1}`,
      title: title,
      content: `Complete lesson content for: ${title}`,
      duration: 30,
      order: index + 1,
      isActive: true,
      courseId: courseId,
    });
  });
  
  // Add SBR lessons
  sbrLessons.forEach((title, index) => {
    allLessons.push({
      id: `${courseId}_lesson_${index + 91}`,
      title: title,
      content: `Complete lesson content for: ${title}`,
      duration: 30,
      order: index + 91,
      isActive: true,
      courseId: courseId,
    });
  });
  
  // Add AFM lessons
  afmLessons.forEach((title, index) => {
    allLessons.push({
      id: `${courseId}_lesson_afm_${index + 1}`,
      title: title,
      content: `Complete lesson content for: ${title}`,
      duration: 30,
      order: index + 171,
      isActive: true,
      courseId: courseId,
    });
  });
  
  // Add AAA lessons
  aaaLessons.forEach((title, index) => {
    allLessons.push({
      id: `${courseId}_lesson_aaa_${index + 1}`,
      title: title,
      content: `Complete lesson content for: ${title}`,
      duration: 30,
      order: index + 209,
      isActive: true,
      courseId: courseId,
    });
  });
  
  // Add APM lessons
  apmLessons.forEach((title, index) => {
    allLessons.push({
      id: `${courseId}_lesson_apm_${index + 1}`,
      title: title,
      content: `Complete lesson content for: ${title}`,
      duration: 30,
      order: index + 247,
      isActive: true,
      courseId: courseId,
    });
  });
  
  // Add ATX lessons
  atxLessons.forEach((title, index) => {
    allLessons.push({
      id: `${courseId}_lesson_atx_${index + 1}`,
      title: title,
      content: `Complete lesson content for: ${title}`,
      duration: 30,
      order: index + 285,
      isActive: true,
      courseId: courseId,
    });
  });
  
  console.log(`Total lessons prepared: ${allLessons.length}`);
  
  // Use createMany for batch insertion
  await prisma.lesson.createMany({ data: allLessons });
  console.log('Lessons created successfully!');
  
  // Create assessments for each module
  const assessments = [
    { title: 'SBL - Strategic Business Leader Assessment', order: 1 },
    { title: 'SBR - Strategic Business Reporting Assessment', order: 2 },
    { title: 'AFM - Advanced Financial Management Assessment', order: 3 },
    { title: 'AAA - Advanced Audit & Assurance Assessment', order: 4 },
    { title: 'APM - Advanced Performance Management Assessment', order: 5 },
    { title: 'ATX - Advanced Taxation Assessment', order: 6 },
  ];
  
  for (const assessment of assessments) {
    await prisma.assessment.create({
      data: {
        title: assessment.title,
        courseId: courseId,
        type: 'SCENARIO',
        isActive: true,
      },
    });
  }
  console.log('Assessments created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
