import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Mapping between expected course IDs and actual seeded IDs
const COURSE_ID_MAPPING: Record<string, string> = {
  // Confusion Removers courses
  'cr_english_mastery': 'cr_english',
  
  // Career courses mapping  
  'python-masterclass': 'career2',
  'web-development-bootcamp': 'career1',
  'data-science-python': 'career3',
  'digital-marketing-complete': 'career13',
  'ui-ux-design-masterclass': 'career9',
  
  // Life skills courses
  'personal-finance-mastery': 'life1',
  'stock-market-fundamentals': 'life2',
  
  // Additional mappings for common variations
  'excel-mastery': 'advanced-excel-pro',
  'job-prep-complete': 'career_jobprep',
  'meditation-mindfulness': 'life6',
  'bcom-financial-accounting': 'college10',
  'class10-mathematics': 'school18',
  'course_public_speaking': 'career14',
  
  // Government exam mappings (if seeded with different IDs)
  'upsc_prelims': 'upsc_prelims',
  'upsc_mains': 'upsc_mains', 
  'upsc_interview': 'upsc_interview',
  'ssc_chsl': 'ssc_chsl',
  'ssc-cgl-preparation': 'ssc_cgl',
  'ssc-mts-preparation': 'ssc_mts',
  'ssc-chsl-preparation': 'ssc_chsl',
  'state_police': 'state_police',
  'state_tet': 'state_tet',
  
  // Professional certification mappings
  'course-ca-foundation': 'course-ca-foundation',
  'course-ca-intermediate': 'course-ca-intermediate',
  'course-ca-final': 'course-ca-final',
  'cs_foundation': 'cs_foundation',
  'cs_executive': 'cs_executive',
  'cs_professional': 'cs_professional',
  'cma_foundation': 'cma_foundation',
  'cma_intermediate': 'cma_intermediate',
  'cma_final': 'cma_final',
  'cfa_level1': 'cfa_level1',
  'cfa_level2': 'cfa_level2',
  'cfa_level3': 'cfa_level3',
  'frm_part1': 'frm_part1',
  'frm_part2': 'frm_part2',
  'acca_level1': 'acca_level1',
  'acca_level2': 'acca_level2',
  'acca_level3': 'acca_level3',
  
  // Stock market & trading courses
  'stock-market-basics': 'stock-market-basics',
  'options-trading-mastery': 'options-trading-mastery',
  'technical-analysis-master': 'technical-analysis-master',
  'mutual-funds-sip-mastery': 'mutual-funds-sip-mastery',
  
  // Additional courses
  'course-actuarial-science': 'course-actuarial-science',
  'advanced-excel-pro': 'advanced-excel-pro',
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let courseId = params.id

    // Check if we need to map the ID to the actual seeded ID
    if (COURSE_ID_MAPPING[courseId]) {
      courseId = COURSE_ID_MAPPING[courseId]
    }

    // Fetch course from database with all related data
    const course = await db.course.findFirst({
      where: {
        id: courseId,
        isActive: true,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            // title field removed - not available in current Prisma client
            bio: true,
            avatar: true,
            expertise: true,
          },
        },
        learningPath: {
          select: {
            id: true,
            title: true,
            description: true,
            color: true,
            icon: true,
          },
        },
        lessons: {
          where: {
            isActive: true,
          },
          orderBy: {
            order: 'asc',
          },
          select: {
            id: true,
            title: true,
            duration: true,
            order: true,
            videoUrl: true,
            content: true,
          },
        },
        _count: {
          select: {
            lessons: true,
            assessments: true,
            progress: true,
          },
        },
      },
    })

    if (!course) {
      return NextResponse.json(
        { success: false, message: 'Course not found' },
        { status: 404 }
      )
    }

    // Group lessons into modules based on course type and lesson structure
    
    const isEnglishCourse = course.id === 'cr_english_mastery'
    const isConstitutionCourse = course.id === 'cr_indian_constitution'
    const isPublicSpeakingIntermediate = course.id === 'career14'
    const isPublicSpeakingAdvanced = course.id === 'course_public_speaking'
    const isWebDevBootcamp = course.id === 'career1'
    const isPythonMastery = course.id === 'career2'
    const isDataScience = course.id === 'career3'
    const isMobileApp = course.id === 'career4'
    const isBusinessStrategy = course.id === 'career5'
    const isEntrepreneurship = course.id === 'career6'
    const isFinancialManagement = course.id === 'career7'
    const isProjectManagement = course.id === 'career8'
    const isUIUXDesign = course.id === 'career9'
    const isGraphicDesign = course.id === 'career10'
    const isContentCreation = course.id === 'career11'
    const isPhotography = course.id === 'career12'
    const isDigitalMarketing = course.id === 'career13'
    const isSocialMedia = course.id === 'career15'
    const isBrandStrategy = course.id === 'career16'
    const isInvestmentWealth = course.id === 'life2'
    const isTaxInsurance = course.id === 'life3'
    const isNutritionHealth = course.id === 'life4'
    const isFitnessExercise = course.id === 'life5'
    const isMentalHealth = course.id === 'life6'
    const isEnglishG1 = course.id === 'school2'
    const isMathG2 = course.id === 'school3'
    const isScienceG3 = course.id === 'school4'
    const isMathG3 = course.id === 'school5'
    const isEnglishLitG4 = course.id === 'school6'
    const isMathG4 = course.id === 'school7'
    const isScienceG5 = course.id === 'school8'
    const isMathG6 = course.id === 'school9'
    const isScienceG6 = course.id === 'school10'
    const isEnglishLitG7 = course.id === 'school11'
    const isMathG7 = course.id === 'school12'
    const isScienceG8 = course.id === 'school13'
    const isMathG9 = course.id === 'school14'
    const isPhysicsG9 = course.id === 'school15'
    const isChemistryG10 = course.id === 'school16'
    const isBiologyG10 = course.id === 'school17'
    const isMathG10 = course.id === 'school18'
    const isMathG11 = course.id === 'school19'
    const isPhysicsG11 = course.id === 'school20'
    const isChemistryG11 = course.id === 'school21'
    const isBiologyG12 = course.id === 'school22'
    const isProgrammingFundamentals = course.id === 'college2'
    const isEngineeringPhysics = course.id === 'college3'
    const isDigitalElectronics = course.id === 'college4'
    const isHumanAnatomy = course.id === 'college5'
    const isBiochemistry = course.id === 'college6'
    const isPhysiology = course.id === 'college7'
    const isMedicalResearch = course.id === 'college8'
    const isBusinessEconomics = course.id === 'college9'
    const isAccountingPrinciples = course.id === 'college10'
    const isBusinessStatistics = course.id === 'college11'
    const isMarketingFundamentals = course.id === 'college12'
    const isWorldLiterature = course.id === 'college13'
    const isPhilosophyBasics = course.id === 'college14'
    const isHistoryOfArt = course.id === 'college15'
    const isCommunicationSkills = course.id === 'college16'
    const isCommerceBasics = course.id === 'course-commerce-basics'
    const isCAFoundation = course.id === 'course-ca-foundation'
    const isCAIntermediate = course.id === 'course-ca-intermediate'
    const isCAFinal = course.id === 'course-ca-final'
    const isCSExecutive = course.id === 'cs_executive'
    const isCSFoundation = course.id === 'cs_foundation'
    const isCSProfessional = course.id === 'cs_professional'
    const isCMAFoundation = course.id === 'cma_foundation'
    const isCMAIntermediate = course.id === 'cma_intermediate'
    const isCMAFinal = course.id === 'cma_final'
    const isCFALevel1 = course.id === 'cfa_level1'
    const isCFALevel2 = course.id === 'cfa_level2'
    const isCFALevel3 = course.id === 'cfa_level3'
    const isFRMPart1 = course.id === 'frm_part1'
    const isFRMPart2 = course.id === 'frm_part2'
    const isUSCMAPart1 = course.id === 'us_cma_part1'
    const isUSCMAPart2 = course.id === 'us_cma_part2'
    const isUSCPA = course.id === 'us_cpa'
    const isACCALevel1 = course.id === 'acca_level1'
    const isACCALevel2 = course.id === 'acca_level2'
    const isACCALevel3 = course.id === 'acca_level3'
    const isSchoolPrimary1_5 = course.id === 'school_primary_1_5'
    const isSchoolPrimary6_8 = course.id === 'school_primary_6_8'
    const isSchoolSecondary9_10 = course.id === 'school_secondary_9_10'
    const isSchoolSeniorScience = course.id === 'school_senior_science'
    const isSchoolSeniorCommerce = course.id === 'school_senior_commerce'
    const isSchoolSeniorArts = course.id === 'school_senior_arts'
    const isSchoolExamPrep = course.id === 'school_exam_prep'
    const isSchoolSkills = course.id === 'school_skills'
    const isCollegeBscPcm = course.id === 'college_bsc_pcm'
    const isCollegeBscPcb = course.id === 'college_bsc_pcb'
    const isCollegeBscCs = course.id === 'college_bsc_cs'
    const isCollegeBscBio = course.id === 'college_bsc_bio'
    const isCollegeBscStats = course.id === 'college_bsc_stats'
    const isCollegeBcom = course.id === 'college_bcom'
    const isCollegeBba = course.id === 'college_bba'
    const isCollegeBaHistory = course.id === 'college_ba_history'
    const isCollegeBaPolsc = course.id === 'college_ba_polsc'
    const isCollegeBaPsychology = course.id === 'college_ba_psychology'
    const isCollegeBtechCs = course.id === 'college_btech_cs'
    const isCollegeLlB = course.id === 'college_llb'
    const isCollegeSemesterSupport = course.id === 'college_semester_support'
    const isCollegeExamPrep = course.id === 'college_exam_prep'
    const isCollegeCareerSkills = course.id === 'college_career_skills'
    const isActuarialScience = course.id === 'course-actuarial-science'
    const isAdvancedExcel = course.id === 'advanced-excel-pro'
    const isStockMarketBasics = course.id === 'stock-market-basics'
    const isOptionsTradingMastery = course.id === 'options-trading-mastery'
    const isTechnicalAnalysisMaster = course.id === 'technical-analysis-master'
    const isPriceActionTrading = course.id === 'price-action-trading'
    const isRiskManagementMasterclass = course.id === 'risk-management-masterclass'
    const isNoCodeAlgoTrading = course.id === 'no-code-algo-trading'
    const isMutualFundsSipMastery = course.id === 'mutual-funds-sip-mastery'
    const isUPSCcivilServicesPrelims = course.id === 'upsc_prelims'
    const isUPSCcivilServicesMains = course.id === 'upsc_mains'
    const isUPSCinterviewPersonality = course.id === 'upsc_interview'
    const isAdvancedAnswerWriting = course.id === 'advanced-answer-writing-mastery'
    const isSSCCHSL = course.id === 'ssc_chsl'
    const isSSCCGL = course.id === 'ssc_cgl'
    const isSSCMTS = course.id === 'ssc_mts'
    const isStatePolice = course.id === 'state_police'
    const isStateTET = course.id === 'state_tet'
    
    const englishModuleNames: Record<string, string> = {
      '1': 'Foundation Building',
      '2': 'Grammar Mastery',
      '3': 'Speaking Confidence',
      '4': 'Vocabulary Building',
      '5': 'Professional Writing',
      '6': 'Interview Skills',
      '7': 'Presentation Skills',
      '8': 'Conversation Skills',
      '9': 'Business Communication',
      '10': 'Advanced Communication',
    }

    const constitutionModuleNames: Record<string, string> = {
      '1': 'Introduction to Indian Constitution',
      '2': 'Parts and Schedules',
      '3': 'Fundamental Rights',
      '4': 'Directive Principles & Fundamental Duties',
      '5': 'Union Government',
      '6': 'State Government',
      '7': 'Local Governance',
      '8': 'Elections & Voting',
      '9': 'Citizenship & Identity',
      '10': 'Rights, Duties & Civic Engagement',
    }

    const publicSpeakingAdvancedModuleNames: Record<string, string> = {
      '1': 'The Psychology of Performance',
      '2': 'Advanced Presentation Structure',
      '3': 'Visual Rhetoric and Slide Design',
      '4': 'Vocal Mastery and Delivery',
      '5': 'Body Language and Presence',
      '6': 'Audience Engagement and Dynamics',
      '7': 'The Art of Persuasion',
      '8': 'Handling the Unexpected',
      '9': 'Virtual and Hybrid Presentations',
      '10': 'Professional Application and Capstone',
    }

    const publicSpeakingIntermediateModuleNames: Record<string, string> = {
      '1': 'Foundation of Public Speaking',
      '2': 'Structuring Your Message',
      '3': 'Voice and Delivery',
      '4': 'Body Language',
      '5': 'Audience Connection',
      '6': 'Practical Application',
    }

    const webDevBootcampModuleNames: Record<string, string> = {
      '1': 'Web Development Introduction',
      '2': 'HTML Fundamentals',
      '3': 'CSS Styling',
      '4': 'JavaScript Basics',
      '5': 'JavaScript Advanced',
      '6': 'Version Control with Git',
      '7': 'UI/UX Design Principles',
      '8': 'React.js Fundamentals',
      '9': 'Backend Development',
      '10': 'Database Management',
      '11': 'Authentication & Security',
      '12': 'API Development',
      '13': 'Testing & Best Practices',
      '14': 'Performance Optimization',
      '15': 'Deployment & DevOps',
      '16': 'Capstone Project',
    }

    const pythonMasteryModuleNames: Record<string, string> = {
      '1': 'Python Basics & Setup',
      '2': 'Data Types & Variables',
      '3': 'Control Flow & Functions',
    }

    const dataScienceModuleNames: Record<string, string> = {
      '1': 'Introduction to Data Science',
      '2': 'Python for Data Science',
      '3': 'Statistics & Probability',
      '4': 'Data Wrangling & Cleaning',
      '5': 'Data Visualization',
      '6': 'Machine Learning Basics',
      '7': 'Supervised Learning',
      '8': 'Unsupervised Learning',
      '9': 'Deep Learning',
      '10': 'Natural Language Processing',
      '11': 'Data Science Projects',
    }

    const mobileAppModuleNames: Record<string, string> = {
      '1': 'Mobile Development Fundamentals',
      '2': 'React Native Basics',
      '3': 'Components & Navigation',
      '4': 'State Management',
      '5': 'Native Features',
      '6': 'Data Storage & APIs',
      '7': 'Performance & Optimization',
      '8': 'Testing & Deployment',
    }

    const businessStrategyModuleNames: Record<string, string> = {
      '1': 'Strategic Thinking',
      '2': 'Market Analysis',
      '3': 'Competitive Strategy',
      '4': 'Business Models',
      '5': 'Strategic Planning',
      '6': 'Execution & Implementation',
    }

    const entrepreneurshipModuleNames: Record<string, string> = {
      '1': 'Entrepreneurial Mindset & Opportunity Recognition',
      '2': 'Business Model Development & Validation',
      '3': 'Financial Planning & Resource Management',
      '4': 'Team Building & Leadership',
      '5': 'Growth Strategies & Scaling',
      '6': 'Exit Strategies & Long-term Success',
    }

    const financialManagementModuleNames: Record<string, string> = {
      '1': 'Financial Analysis & Statement Analysis',
      '2': 'Corporate Finance & Capital Structure',
      '3': 'Investment Analysis & Portfolio Management',
      '4': 'Risk Management & Hedging Strategies',
      '5': 'Financial Planning & Forecasting',
      '6': 'Advanced Topics in Finance',
    }

    const projectManagementModuleNames: Record<string, string> = {
      '1': 'Project Management Fundamentals',
      '2': 'Project Planning & Scheduling',
      '3': 'Risk & Quality Management',
      '4': 'Agile & Scrum Methodologies',
      '5': 'Team Leadership & Communication',
      '6': 'Project Execution & Closure',
    }

    const uiuxDesignModuleNames: Record<string, string> = {
      '1': 'Design Thinking',
      '2': 'User Research',
      '3': 'Wireframing & Prototyping',
      '4': 'Visual Design',
      '5': 'Usability Testing',
    }

    const graphicDesignModuleNames: Record<string, string> = {
      '1': 'Design Principles & Theory',
      '2': 'Color & Typography',
      '3': 'Layout & Composition',
      '4': 'Digital Illustration',
      '5': 'Photo Editing',
      '6': 'Brand Identity Design',
    }

    const contentCreationModuleNames: Record<string, string> = {
      '1': 'Content Strategy',
      '2': 'Video Production',
      '3': 'Video Editing',
      '4': 'Audio Production',
      '5': 'Scripting & Storytelling',
      '6': 'Platform Optimization',
    }

    const photographyModuleNames: Record<string, string> = {
      '1': 'Photography Basics & Camera Operation',
      '2': 'Composition & Visual Storytelling',
      '3': 'Lighting Techniques',
      '4': 'Post-Processing & Editing',
      '5': 'Digital Art & Illustration',
      '6': 'Advanced Creative Techniques',
    }

    const digitalMarketingModuleNames: Record<string, string> = {
      '1': 'Digital Marketing Fundamentals',
      '2': 'Search Engine Optimization (SEO)',
      '3': 'Social Media Marketing',
      '4': 'Content Marketing & Strategy',
      '5': 'Pay-Per-Click Advertising',
      '6': 'Email Marketing & Automation',
      '7': 'Analytics & Performance Optimization',
    }

    const socialMediaModuleNames: Record<string, string> = {
      '1': 'Social Media Landscape Overview',
      '2': 'Content Creation for Social Media',
      '3': 'Community Management & Engagement',
      '4': 'Platform-Specific Strategies',
      '5': 'Social Media Advertising',
      '6': 'Influencer Marketing',
      '7': 'Analytics & Reporting',
    }

    const brandStrategyModuleNames: Record<string, string> = {
      '1': 'Brand Foundation & Identity',
      '2': 'Brand Positioning & Messaging',
      '3': 'Visual Identity Systems',
      '4': 'Brand Architecture',
      '5': 'Brand Experience Design',
      '6': 'Digital Brand Management',
      '7': 'Brand Equity & Valuation',
      '8': 'Crisis Management & Brand Protection',
    }

    const investmentWealthModuleNames: Record<string, string> = {
      '1': 'Investment Fundamentals & Market Basics',
      '2': 'Advanced Wealth Building Strategies',
    }

    const taxInsuranceModuleNames: Record<string, string> = {
      '1': 'Tax Planning & Compliance',
      '2': 'Insurance Planning & Risk Management',
    }

    const nutritionHealthModuleNames: Record<string, string> = {
      '1': 'Nutrition Fundamentals',
      '2': 'Healthy Living Practices',
    }

    const fitnessExerciseModuleNames: Record<string, string> = {
      '1': 'Fitness Fundamentals',
      '2': 'Exercise Programming',
    }

    const mentalHealthModuleNames: Record<string, string> = {
      '1': 'Mental Health & Mindfulness Basics',
    }

    const englishG1ModuleNames: Record<string, string> = {
      '1': 'English Grammar Basics',
    }

    const mathG2ModuleNames: Record<string, string> = {
      '1': 'Number Sense & Operations',
      '2': 'Geometry & Measurement',
    }

    const scienceG3ModuleNames: Record<string, string> = {
      '1': 'Living Things & Nature',
      '2': 'Earth & Space Science',
    }

    const mathG3ModuleNames: Record<string, string> = {
      '1': 'Multiplication & Division',
      '2': 'Fractions & Data Handling',
    }

    const englishLitG4ModuleNames: Record<string, string> = {
      '1': 'Reading Comprehension',
      '2': 'Literature Analysis',
    }

    const mathG4ModuleNames: Record<string, string> = {
      '1': 'Advanced Operations',
      '2': 'Decimals & Advanced Geometry',
    }

    const scienceG5ModuleNames: Record<string, string> = {
      '1': 'Matter & Energy',
      '2': 'Life Science & Ecosystems',
    }

    const mathG6ModuleNames: Record<string, string> = {
      '1': 'Number Theory & Fractions',
      '2': 'Ratios & Proportional Reasoning',
    }

    const scienceG6ModuleNames: Record<string, string> = {
      '1': 'Scientific Method & Inquiry',
      '2': 'Earth Systems Science',
      '3': 'Scientific Applications',
    }

    const englishLitG7ModuleNames: Record<string, string> = {
      '1': 'Classic Literature',
      '2': 'Writing & Composition',
      '3': 'Speech & Presentation',
    }

    const mathG7ModuleNames: Record<string, string> = {
      '1': 'Algebraic Expressions',
      '2': 'Equations & Inequalities',
      '3': 'Probability & Statistics',
    }

    const scienceG8ModuleNames: Record<string, string> = {
      '1': 'Chemistry Fundamentals',
      '2': 'Physics: Forces & Motion',
      '3': 'Scientific Integration',
    }

    const mathG9ModuleNames: Record<string, string> = {
      '1': 'Linear Equations & Functions',
      '2': 'Polynomials & Factoring',
      '3': 'Quadratic Functions',
    }

    const physicsG9ModuleNames: Record<string, string> = {
      '1': 'Mechanics & Motion',
      '2': 'Energy & Work',
      '3': 'Waves & Optics',
    }

    const chemistryG10ModuleNames: Record<string, string> = {
      '1': 'Atomic Structure & Periodicity',
      '2': 'Chemical Reactions & Stoichiometry',
      '3': 'Acids, Bases & Equilibrium',
    }

    const biologyG10ModuleNames: Record<string, string> = {
      '1': 'Cell Biology & Genetics',
      '2': 'Evolution & Ecology',
      '3': 'Human Body Systems',
    }

    const mathG10ModuleNames: Record<string, string> = {
      '1': 'Geometry & Trigonometry',
      '2': 'Advanced Functions',
      '3': 'Coordinate Geometry',
    }

    const mathG11ModuleNames: Record<string, string> = {
      '1': 'Calculus: Limits & Derivatives',
      '2': 'Trigonometry & Complex Numbers',
      '3': 'Sequences, Series & Probability',
    }

    const physicsG11ModuleNames: Record<string, string> = {
      '1': 'Mechanics & Gravitation',
      '2': 'Thermodynamics & Kinetic Theory',
      '3': 'Oscillations & Waves',
      '4': 'Modern Physics Introduction',
    }

    const chemistryG11ModuleNames: Record<string, string> = {
      '1': 'Atomic Structure & Quantum Mechanics',
      '2': 'Chemical Bonding & Molecular Structure',
      '3': 'Thermodynamics & Chemical Equilibrium',
      '4': 'Organic Chemistry Fundamentals',
    }

    const biologyG12ModuleNames: Record<string, string> = {
      '1': 'Genetics & Molecular Biology',
      '2': 'Human Physiology & Reproduction',
      '3': 'Ecology & Environment',
      '4': 'Biology in Medicine & Research',
    }

    const programmingFundamentalsModuleNames: Record<string, string> = {
      '1': 'Introduction to Programming',
      '2': 'Control Structures & Functions',
      '3': 'Data Structures & Algorithms',
    }

    const engineeringPhysicsModuleNames: Record<string, string> = {
      '1': 'Mechanics & Motion',
      '2': 'Waves, Optics & Thermodynamics',
      '3': 'Electromagnetism & Modern Physics',
    }

    const digitalElectronicsModuleNames: Record<string, string> = {
      '1': 'Digital Logic Fundamentals',
      '2': 'Combinational & Sequential Circuits',
      '3': 'Microprocessors & Digital Systems',
    }

    const humanAnatomyModuleNames: Record<string, string> = {
      '1': 'Cell Biology & Tissues',
      '2': 'Skeletal & Muscular Systems',
      '3': 'Organ Systems & Integration',
    }

    const biochemistryModuleNames: Record<string, string> = {
      '1': 'Biomolecules & Enzymes',
      '2': 'Metabolic Pathways',
      '3': 'Molecular Biology & Genetics',
    }

    const physiologyModuleNames: Record<string, string> = {
      '1': 'Cellular & General Physiology',
      '2': 'Nerve & Muscle Physiology',
      '3': 'Cardiovascular & Respiratory Physiology',
      '4': 'Renal & Endocrine Physiology',
    }

    const medicalResearchModuleNames: Record<string, string> = {
      '1': 'Research Design & Methodology',
      '2': 'Biostatistics & Data Analysis',
      '3': 'Clinical Trials & Epidemiology',
      '4': 'Evidence-Based Medicine & Ethics',
    }

    const businessEconomicsModuleNames: Record<string, string> = {
      '1': 'Microeconomic Foundations',
      '2': 'Macroeconomic Environment',
      '3': 'Market Structures & Strategy',
      '4': 'Managerial Economics Applications',
    }

    const accountingPrinciplesModuleNames: Record<string, string> = {
      '1': 'Accounting Fundamentals & Concepts',
      '2': 'Financial Statement Preparation',
      '3': 'Asset Accounting & Depreciation',
      '4': 'Liabilities, Equity & Financial Analysis',
    }

    const businessStatisticsModuleNames: Record<string, string> = {
      '1': 'Descriptive Statistics & Data Visualization',
      '2': 'Probability & Probability Distributions',
      '3': 'Statistical Inference & Hypothesis Testing',
      '4': 'Regression Analysis & Business Forecasting',
    }

    const marketingFundamentalsModuleNames: Record<string, string> = {
      '1': 'Marketing Strategy & Planning',
      '2': 'Consumer Behavior & Research',
      '3': 'Product, Price & Distribution Strategy',
      '4': 'Promotion, Digital Marketing & Integrated Communications',
    }

    const worldLiteratureModuleNames: Record<string, string> = {
      '1': 'Classical Literature & Ancient Epics',
      '2': 'Medieval & Renaissance Literature',
      '3': 'Enlightenment, Romanticism & Realism',
      '4': 'Modern & Contemporary World Literature',
    }

    const philosophyBasicsModuleNames: Record<string, string> = {
      '1': 'Ancient Greek Philosophy',
      '2': 'Medieval & Early Modern Philosophy',
      '3': 'Epistemology & Metaphysics',
      '4': 'Ethics, Political Philosophy & Contemporary Thought',
    }

    const historyOfArtModuleNames: Record<string, string> = {
      '1': 'Ancient & Classical Art',
      '2': 'Medieval & Renaissance Art',
      '3': 'Baroque to Modern Art Movements',
      '4': 'Contemporary Art, Global Perspectives & Art Analysis',
    }

    const communicationSkillsModuleNames: Record<string, string> = {
      '1': 'Foundations of Communication',
      '2': 'Written Communication Skills',
      '3': 'Oral Presentation & Public Speaking',
      '4': 'Interpersonal, Group & Professional Communication',
    }

    const commerceBasicsModuleNames: Record<string, string> = {
      '1': 'Introduction to Commerce',
      '2': 'Fundamentals of Accountancy',
      '3': 'Business Studies – Business Organization',
      '4': 'Business Environment & Management Basics',
      '5': 'Fundamentals of Economics',
      '6': 'Commerce in Real Life & Career Pathways',
    }

    const caFoundationModuleNames: Record<string, string> = {
      '1': 'Principles and Practice of Accounting (Paper 1)',
      '2': 'Business Laws & Business Correspondence (Paper 2)',
      '3': 'Business Mathematics, Logical Reasoning & Statistics (Paper 3)',
      '4': 'Business Economics & Business & Commercial Knowledge (Paper 4)',
    }

    const caIntermediateModuleNames: Record<string, string> = {
      '1': 'Advanced Accounting (Group I – Paper 1)',
      '2': 'Corporate & Other Laws (Group I – Paper 2)',
      '3': 'Taxation (Group I – Paper 3)',
      '4': 'Cost and Management Accounting (Group II – Paper 4)',
      '5': 'Auditing & Ethics (Group II – Paper 5)',
      '6': 'Financial Management (Group II – Paper 6A)',
      '7': 'Strategic Management (Group II – Paper 6B)',
      '8': 'Exam Preparation & Revision',
    }

    const caFinalModuleNames: Record<string, string> = {
      '1': 'Financial Reporting (Group I – Paper 1)',
      '2': 'Advanced Auditing & Professional Ethics (Group I – Paper 2)',
      '3': 'Direct Tax Laws & International Taxation (Group I – Paper 3)',
      '4': 'Indirect Tax Laws (GST & Customs) (Group I – Paper 4)',
      '5': 'Strategic Financial Management (Group II – Paper 5)',
      '6': 'Strategic Cost Management & Performance Evaluation (Group II – Paper 6A)',
      '7': 'Corporate & Economic Laws (Group II – Paper 6B)',
      '8': 'Final Exam Mastery & Professional Readiness',
    }

    const csExecutiveModuleNames: Record<string, string> = {
      '1': 'Jurisprudence, Interpretation & General Laws (Module I – Paper 1)',
      '2': 'Company Law (Module I – Paper 2)',
      '3': 'Setting up of Business, Industrial & Labour Laws (Module I – Paper 3)',
      '4': 'Tax Laws & Practice (Module I – Paper 4)',
      '5': 'Corporate & Management Accounting (Module II – Paper 5)',
      '6': 'Securities Laws & Capital Markets (Module II – Paper 6)',
      '7': 'Economic, Commercial & Intellectual Property Laws (Module II – Paper 7)',
      '8': 'Exam Preparation, Case Writing & Revision',
    }

    const csFoundationModuleNames: Record<string, string> = {
      '1': 'Business Environment & Law (Paper 1)',
      '2': 'Business Management, Ethics & Entrepreneurship (Paper 2)',
      '3': 'Business Economics (Paper 3)',
      '4': 'Fundamentals of Accounting & Auditing (Paper 4)',
    }

    const csProfessionalModuleNames: Record<string, string> = {
      '1': 'Governance, Risk Management, Compliance & Ethics (Module I – Paper 1)',
      '2': 'Advanced Tax Laws & Practice (Module I – Paper 2)',
      '3': 'Drafting, Pleadings & Appearances (Module I – Paper 3)',
      '4': 'Secretarial Audit, Compliance Management & Due Diligence (Module II – Paper 4)',
      '5': 'Corporate Restructuring, Insolvency & Resolution (Module II – Paper 5)',
      '6': 'Capital Markets & Securities Laws (Module II – Paper 6)',
      '7': 'Corporate Disputes & Arbitration (Module III – Paper 7)',
      '8': 'Economic, Business & Commercial Laws (Advanced) (Module III – Paper 8)',
      '9': 'Professional Readiness & Exam Mastery',
    }

    const cmaFoundationModuleNames: Record<string, string> = {
      '1': 'Fundamentals of Business Laws & Ethics (Paper 1)',
      '2': 'Fundamentals of Financial & Cost Accounting (Paper 2)',
      '3': 'Fundamentals of Business Mathematics & Statistics (Paper 3)',
      '4': 'Fundamentals of Business Economics & Management (Paper 4)',
    }

    const cmaIntermediateModuleNames: Record<string, string> = {
      '1': 'Financial Accounting (Group I – Paper 5)',
      '2': 'Corporate Laws & Compliance (Group I – Paper 6)',
      '3': 'Direct Taxation (Group I – Paper 7)',
      '4': 'Cost Accounting (Group II – Paper 8)',
      '5': 'Operations & Strategic Management (Group II – Paper 9)',
      '6': 'Corporate Accounting & Auditing (Group II – Paper 10)',
      '7': 'Financial Management (Group II – Paper 11)',
      '8': 'Exam Preparation & Revision',
    }

    const cmaFinalModuleNames: Record<string, string> = {
      '1': 'Corporate & Economic Laws (Group III – Paper 13)',
      '2': 'Strategic Financial Management (Group III – Paper 14)',
      '3': 'Direct Tax Laws & International Taxation (Group III – Paper 15)',
      '4': 'Indirect Tax Laws & Practice (Group III – Paper 16)',
      '5': 'Strategic Cost Management – Decision Making (Group IV – Paper 17)',
      '6': 'Corporate Financial Reporting (Group IV – Paper 18)',
      '7': 'Cost & Management Audit (Group IV – Paper 19)',
      '8': 'Exam Mastery, Case Writing & Professional Readiness',
    }

    const cfaLevel1ModuleNames: Record<string, string> = {
      '1': 'Ethical and Professional Standards',
      '2': 'Quantitative Methods',
      '3': 'Economics',
      '4': 'Financial Statement Analysis',
      '5': 'Corporate Issuers',
      '6': 'Equity Investments',
      '7': 'Fixed Income',
      '8': 'Derivatives',
      '9': 'Alternative Investments',
      '10': 'Portfolio Management and Wealth Planning',
    }

    const cfaLevel2ModuleNames: Record<string, string> = {
      '1': 'Ethical & Professional Standards',
      '2': 'Quantitative Methods (Advanced)',
      '3': 'Economics (Application Focused)',
      '4': 'Financial Statement Analysis (Advanced)',
      '5': 'Corporate Issuers (Advanced Corporate Finance)',
      '6': 'Equity Investments (Advanced Valuation)',
      '7': 'Fixed Income (Advanced Analysis)',
      '8': 'Derivatives (Application-Oriented)',
      '9': 'Alternative Investments (Advanced)',
      '10': 'Portfolio Management & Wealth Planning',
      '11': 'Integrated Vignette Practice & Revision',
    }

    const cfaLevel3ModuleNames: Record<string, string> = {
      '1': 'Wealth Management',
      '2': 'Individual Wealth Management',
      '3': 'Institutional Wealth Management',
      '4': 'Behavioral Finance & Private Wealth',
      '5': 'Alternative Investments',
      '6': 'Capital Market Expectations',
      '7': 'Asset Allocation',
      '8': 'Fixed Income & Derivatives',
      '9': 'Equity & Alternative Strategies',
      '10': 'Portfolio Execution & Monitoring',
      '11': 'Integrated Practice & Revision',
    }

    const frmPart1ModuleNames: Record<string, string> = {
      '1': 'Foundations of Risk Management',
      '2': 'Quantitative Analysis',
      '3': 'Financial Markets & Products',
      '4': 'Valuation & Risk Models',
      '5': 'Market Risk Measurement & Management',
      '6': 'Probability & Statistics Applications',
      '7': 'Integrated FRM Exam Practice',
      '8': 'Final Revision & Exam Strategy',
    }

    const frmPart2ModuleNames: Record<string, string> = {
      '1': 'Market Risk Measurement & Management (Advanced)',
      '2': 'Credit Risk Measurement & Management',
      '3': 'Operational & Liquidity Risk',
      '4': 'Investment & Portfolio Risk Management',
      '5': 'Risk Models & Quantitative Applications',
      '6': 'Current Issues in Financial Risk',
      '7': 'Integrated Risk Management & ERM',
      '8': 'Exam Practice & Mock Tests',
      '9': 'Final Revision & Exam Strategy',
    }

    const usCMAPart1ModuleNames: Record<string, string> = {
      '1': 'External Financial Reporting Decisions',
      '2': 'Planning, Budgeting, and Forecasting',
      '3': 'Performance Management',
      '4': 'Cost Management',
      '5': 'Internal Controls',
      '6': 'Technology and Analytics in Finance',
    }

    const usCMAPart2ModuleNames: Record<string, string> = {
      '1': 'Financial Statement Analysis',
      '2': 'Corporate Finance',
      '3': 'Decision Analysis & Risk Management',
      '4': 'Investment & Portfolio Decisions',
      '5': 'Professional Ethics & Governance',
      '6': 'Strategic Decision-Making & Exam Practice',
    }

    const usCPAModuleNames: Record<string, string> = {
      '1': 'FAR - Financial Accounting & Reporting',
      '2': 'AUD - Auditing & Attestation',
      '3': 'REG - Regulation',
      '4': 'Discipline Section (BAR/ISC/TCP)',
    }

    const accaLevel1ModuleNames: Record<string, string> = {
      '1': 'BT - Business & Technology',
      '2': 'MA - Management Accounting',
      '3': 'FA - Financial Accounting',
    }

    const accaLevel2ModuleNames: Record<string, string> = {
      '1': 'LW - Corporate & Business Law',
      '2': 'PM - Performance Management',
      '3': 'TX - Taxation',
      '4': 'FR - Financial Reporting',
      '5': 'AA - Audit & Assurance',
      '6': 'FM - Financial Management',
    }

    const accaLevel3ModuleNames: Record<string, string> = {
      '1': 'SBL - Strategic Business Leader (Core)',
      '2': 'SBR - Strategic Business Reporting (Core)',
      '3': 'AFM - Advanced Financial Management (Optional)',
      '4': 'AAA - Advanced Audit & Assurance (Optional)',
      '5': 'APM - Advanced Performance Management (Optional)',
      '6': 'ATX - Advanced Taxation (Optional)',
    }

    const schoolPrimary1_5ModuleNames: Record<string, string> = {
      '1': 'Basics of Math',
      '2': 'English Reading & Writing',
      '3': 'EVS (Environmental Studies)',
      '4': 'Hindi / Regional Language',
      '5': 'Concept Building (Foundations)',
    }

    const schoolPrimary6_8ModuleNames: Record<string, string> = {
      '1': 'Mathematics',
      '2': 'Science',
      '3': 'Social Science',
      '4': 'English Grammar',
      '5': 'Hindi / Regional Language',
    }

    const schoolSecondary9_10ModuleNames: Record<string, string> = {
      '1': 'Mathematics',
      '2': 'Science',
      '3': 'Social Science',
      '4': 'English',
      '5': 'Hindi / Regional Language',
      '6': 'Board-Oriented Practice (CBSE / ICSE / State Boards)',
    }

    const schoolSeniorScienceModuleNames: Record<string, string> = {
      '1': 'Physics',
      '2': 'Chemistry',
      '3': 'Mathematics',
      '4': 'Biology',
    }

    const schoolSeniorCommerceModuleNames: Record<string, string> = {
      '1': 'Accountancy',
      '2': 'Business Studies',
      '3': 'Economics',
      '4': 'Mathematics',
    }

    const schoolSeniorArtsModuleNames: Record<string, string> = {
      '1': 'History',
      '2': 'Political Science',
      '3': 'Geography',
      '4': 'Economics',
      '5': 'Sociology',
      '6': 'Psychology',
    }

    const schoolExamPrepModuleNames: Record<string, string> = {
      '1': '30-60 Day Board Strategy',
      '2': 'Important Questions & PYQs',
      '3': 'Revision Notes',
      '4': 'Sample Papers & Mock Tests',
      '5': 'Time Management in Exams',
    }

    const schoolSkillsModuleNames: Record<string, string> = {
      '1': 'English Speaking (School Level)',
      '2': 'Handwriting Improvement',
      '3': 'Mental Math',
      '4': 'Study Techniques',
      '5': 'Memory & Focus Training',
      '6': 'Exam Fear Reduction',
    }

    // College Education Module Names
    const collegeBscPcmModuleNames: Record<string, string> = {
      '1': 'Physics - Semester 1-2',
      '2': 'Physics - Semester 3-4',
      '3': 'Physics - Semester 5-6',
      '4': 'Chemistry - Semester 1-2',
      '5': 'Chemistry - Semester 3-4',
      '6': 'Chemistry - Semester 5-6',
      '7': 'Mathematics - Semester 1-2',
      '8': 'Mathematics - Semester 3-4',
      '9': 'Mathematics - Semester 5-6',
    }

    const collegeBscPcbModuleNames: Record<string, string> = {
      '1': 'Physics - Semester 1-2',
      '2': 'Physics - Semester 3-4',
      '3': 'Physics - Semester 5-6',
      '4': 'Chemistry - Semester 1-2',
      '5': 'Chemistry - Semester 3-4',
      '6': 'Chemistry - Semester 5-6',
      '7': 'Biology - Semester 1-2',
      '8': 'Biology - Semester 3-4',
      '9': 'Biology - Semester 5-6',
    }

    const collegeBscCsModuleNames: Record<string, string> = {
      '1': 'Programming Fundamentals',
      '2': 'Data Structures & Algorithms',
      '3': 'Database Management Systems',
      '4': 'Object-Oriented Programming',
      '5': 'Web Development',
      '6': 'Operating Systems',
      '7': 'Computer Networks',
      '8': 'Software Engineering',
    }

    const collegeBscBioModuleNames: Record<string, string> = {
      '1': 'Cell Biology & Genetics',
      '2': 'Molecular Biology',
      '3': 'Biochemistry',
      '4': 'Microbiology',
      '5': 'Biotechnology',
      '6': 'Bioinformatics',
    }

    const collegeBscStatsModuleNames: Record<string, string> = {
      '1': 'Probability Theory',
      '2': 'Statistical Inference',
      '3': 'Regression Analysis',
      '4': 'Sampling Techniques',
      '5': 'Data Analysis',
    }

    const collegeBcomModuleNames: Record<string, string> = {
      '1': 'Financial Accounting',
      '2': 'Corporate Law',
      '3': 'Income Tax',
      '4': 'Business Economics',
      '5': 'Cost Accounting',
      '6': 'Auditing',
    }

    const collegeBbaModuleNames: Record<string, string> = {
      '1': 'Principles of Management',
      '2': 'Marketing Management',
      '3': 'Financial Management',
      '4': 'Human Resource Management',
      '5': 'Operations Management',
      '6': 'Business Law',
      '7': 'Entrepreneurship',
      '8': 'Strategic Management',
    }

    const collegeBaHistoryModuleNames: Record<string, string> = {
      '1': 'Ancient India',
      '2': 'Medieval India',
      '3': 'Modern India',
      '4': 'World History',
      '5': 'Historiography',
    }

    const collegeBaPolscModuleNames: Record<string, string> = {
      '1': 'Political Theory',
      '2': 'Indian Polity',
      '3': 'International Relations',
      '4': 'Comparative Politics',
      '5': 'Public Administration',
    }

    const collegeBaPsychologyModuleNames: Record<string, string> = {
      '1': 'Developmental Psychology',
      '2': 'Social Psychology',
      '3': 'Cognitive Psychology',
      '4': 'Clinical Psychology',
      '5': 'Research Methods',
    }

    const collegeBtechCsModuleNames: Record<string, string> = {
      '1': 'Programming & Data Structures',
      '2': 'Algorithms & Complexity',
      '3': 'Operating Systems',
      '4': 'Database Systems',
      '5': 'Computer Networks',
      '6': 'Software Engineering',
      '7': 'Web Technologies',
      '8': 'Machine Learning',
    }

    const collegeLlBModuleNames: Record<string, string> = {
      '1': 'Constitutional Law',
      '2': 'Criminal Law',
      '3': 'Civil Law',
      '4': 'Corporate Law',
      '5': 'International Law',
      '6': 'Jurisprudence',
      '7': 'Legal Drafting',
      '8': 'Moot Court Practice',
    }

    const collegeSemesterSupportModuleNames: Record<string, string> = {
      '1': '1st Semester Basics',
      '2': '2nd Semester Core',
      '3': '3rd Semester Advanced',
      '4': '4th Semester Revision',
      '5': '5th Semester Specialization',
      '6': '6th Semester Project & Viva',
    }

    const collegeExamPrepModuleNames: Record<string, string> = {
      '1': 'Important Questions',
      '2': 'Previous Year Papers',
      '3': 'Last-Minute Revision',
      '4': 'Answer Writing',
      '5': 'Passing Strategy',
    }

    const collegeCareerSkillsModuleNames: Record<string, string> = {
      '1': 'Resume & CV Building',
      '2': 'Interview Preparation',
      '3': 'Group Discussion',
      '4': 'Internship Readiness',
      '5': 'Project Guidance',
      '6': 'Corporate Etiquette',
    }

    const actuarialScienceModuleNames: Record<string, string> = {
      '1': 'Mathematical Foundations for Actuaries',
      '2': 'Probability Theory',
      '3': 'Statistics for Actuarial Science',
      '4': 'Financial Mathematics',
      '5': 'Insurance & Risk Management',
      '6': 'Survival Models & Life Contingencies',
      '7': 'Stochastic Models',
      '8': 'Exam Preparation & Actuarial Practice',
    }

    const advancedExcelModuleNames: Record<string, string> = {
      '1': 'Excel Fundamentals & Data Setup',
      '2': 'Data Analysis & Visualization',
      '3': 'Advanced Formulas & Functions',
      '4': 'Pivot Tables & Power Tools',
      '5': 'Automation & VBA Programming',
      '6': 'Practical Projects & Case Studies',
    }

    const stockMarketBasicsModuleNames: Record<string, string> = {
      '1': 'Introduction to Stock Markets',
      '2': 'Market Participants & Instruments',
      '3': 'Trading Basics',
      '4': 'Basics of Technical Analysis',
      '5': 'Basics of Fundamental Analysis',
      '6': 'Risk Management & Beginner Strategies',
    }

    const optionsTradingMasteryModuleNames: Record<string, string> = {
      '1': 'Foundations of Options Trading',
      '2': 'Call and Put Options Deep Dive',
      '3': 'Options Pricing Models & Greeks',
      '4': 'Advanced Options Strategies',
      '5': 'Options Trading Psychology & Risk Management',
      '6': 'Technical Analysis for Options Traders',
      '7': 'Options Trading in Different Market Conditions',
      '8': 'Options Trading Tools, Platforms & Automation',
      '9': 'Live Market Sessions & Practical Trading',
      '10': 'Capstone Project & Career Preparation',
    }

    const technicalAnalysisMasterModuleNames: Record<string, string> = {
      '1': 'Foundations of Technical Analysis',
      '2': 'Candlestick Analysis Deep Dive',
      '3': 'Chart Patterns Mastery',
      '4': 'Support, Resistance & Market Structure',
      '5': 'Technical Indicators Advanced Usage',
      '6': 'Volume & Price Relationship',
      '7': 'Timeframes & Multi-Timeframe Analysis',
      '8': 'Risk Management Using Technicals',
      '9': 'Trading Psychology & Discipline',
      '10': 'Build Your Technical Trading System',
    }

    const priceActionTradingModuleNames: Record<string, string> = {
      '1': 'Price Action Philosophy & Mindset',
      '2': 'Candlestick Psychology Deep Dive',
      '3': 'Market Structure & Trend Analysis',
      '4': 'Support, Resistance & Supply-Demand',
      '5': 'High-Probability Price Action Setups',
      '6': 'Risk Management Using Price Action',
      '7': 'Multi-Timeframe Price Action',
      '8': 'Build Your Price Action Trading System',
    }

    const riskManagementMasterclassModuleNames: Record<string, string> = {
      '1': 'Risk Management Philosophy',
      '2': 'Position Sizing Mastery',
      '3': 'Risk-Reward & Expectancy',
      '4': 'Stop-Loss & Trade Invalidation',
      '5': 'Drawdown & Capital Protection',
      '6': 'Psychological Risk & Discipline',
      '7': 'Build Your Risk Management Plan',
    }

    const noCodeAlgoTradingModuleNames: Record<string, string> = {
      '1': 'Algo Trading Fundamentals',
      '2': 'No-Code Algo Platforms Overview',
      '3': 'Strategy Logic & Rule Design',
      '4': 'Backtesting & Optimization',
      '5': 'Risk Management for Algos',
      '6': 'Live Deployment & Execution',
      '7': 'Algo Monitoring & Improvement',
      '8': 'Build Your No-Code Algo System',
    }

    const mutualFundsSipMasteryModuleNames: Record<string, string> = {
      '1': 'Mutual Fund Basics',
      '2': 'Mutual Fund Categories Explained',
      '3': 'How to Select the Right Mutual Fund',
      '4': 'SIP Mastery (Systematic Investing)',
      '5': 'Risk Management & Asset Allocation',
      '6': 'Taxation, Regulations & Compliance',
      '7': 'Long-Term Wealth Creation Blueprint',
    }

    const upscCivilServicesPrelimsModuleNames: Record<string, string> = {
      '1': 'UPSC Prelims Orientation & Strategy',
      '2': 'History (Ancient, Medieval, Modern)',
      '3': 'Indian & World Geography',
      '4': 'Indian Polity & Governance',
      '5': 'Indian Economy',
      '6': 'Environment, Ecology & Biodiversity',
      '7': 'Current Affairs (Integrated)',
      '8': 'CSAT - Quantitative Aptitude',
      '9': 'CSAT - Reasoning & Comprehension',
      '10': 'Revision, Tests & Exam Readiness',
    }

    const upscCivilServicesMainsModuleNames: Record<string, string> = {
      '1': 'Mains Exam Orientation & Strategy',
      '2': 'General Studies Paper I – History, Culture & Society',
      '3': 'General Studies Paper II – Governance, Polity & International Relations',
      '4': 'General Studies Paper III – Economy, Environment & Technology',
      '5': 'General Studies Paper IV – Ethics, Integrity & Aptitude',
      '6': 'Essay Writing Mastery',
      '7': 'Optional Subject Guidance',
      '8': 'Answer Writing Techniques',
      '9': 'Current Affairs Integration & Case Studies',
      '10': 'Revision, Mock Tests & Pre-Exam Strategy',
    }

    const upscInterviewPersonalityModuleNames: Record<string, string> = {
      '1': 'UPSC Interview Orientation & Strategy',
      '2': 'DAF (Detailed Application Form) Analysis',
      '3': 'Current Affairs Mastery',
      '4': 'Communication & Personality Development',
      '5': 'Mock Interviews & Feedback',
      '6': 'Advanced Interview Strategies & Ethics',
    }

    const advancedAnswerWritingModuleNames: Record<string, string> = {
      '1': 'Orientation & Answer Writing Strategy',
      '2': 'Analytical & Multi-Dimensional Approach',
      '3': 'Current Affairs Integration',
      '4': 'Optional Subject Answer Writing',
      '5': 'Essay & Ethics Answer Mastery',
      '6': 'Mock Tests, Feedback & Improvement',
    }

    const sscCHSLModuleNames: Record<string, string> = {
      '1': 'Quantitative Aptitude',
      '2': 'Reasoning & Logical Ability',
      '3': 'English Language & Comprehension',
      '4': 'General Awareness & Current Affairs',
      '5': 'Mock Tests, Tips & Exam Strategy',
    }

    const sscCGLModuleNames: Record<string, string> = {
      '1': 'Quantitative Aptitude',
      '2': 'Reasoning & Logical Ability',
      '3': 'English Language & Comprehension',
      '4': 'General Awareness & Current Affairs',
      '5': 'Mock Tests, Exam Strategy & Tips',
    }

    const sscMTSModuleNames: Record<string, string> = {
      '1': 'Quantitative Aptitude',
      '2': 'Reasoning & Logical Ability',
      '3': 'English Language & Comprehension',
      '4': 'General Awareness & Current Affairs',
      '5': 'Mock Tests, Exam Strategy & Tips',
    }

    const statePoliceModuleNames: Record<string, string> = {
      '1': 'General Knowledge & Current Affairs',
      '2': 'Mathematics & Numerical Ability',
      '3': 'Reasoning & Logical Ability',
      '4': 'General Science',
      '5': 'Physical Efficiency & Measurement',
      '6': 'Mock Tests & Previous Year Papers',
    }

    const stateTETModuleNames: Record<string, string> = {
      '1': 'TET Exam Orientation & Strategy',
      '2': 'Child Development & Pedagogy (CDP)',
      '3': 'Language I (Hindi / Regional Language)',
      '4': 'Language II (English)',
      '5': 'Mathematics',
      '6': 'Environmental Studies / Social Studies / Science',
      '7': 'Mock Tests, Revision & Final Preparation',
    }

    const moduleLessons: Record<string, typeof course.lessons> = {}
    
    for (const lesson of course.lessons) {
      let moduleNum = '1'
      
      if (isEnglishCourse) {
        // English Communication Mastery: use lesson ID pattern cr_ecm_XXX
        if (lesson.id.startsWith('cr_ecm_')) {
          const numericPart = lesson.id.replace('cr_ecm_', '')
          if (numericPart.length >= 4 && numericPart.startsWith('10')) {
            moduleNum = '10'
          } else if (numericPart.length >= 3 && numericPart.length < 4) {
            const firstDigit = numericPart.charAt(0)
            if (firstDigit !== '0') {
              moduleNum = firstDigit
            }
          } else {
            const match = numericPart.match(/^(\d+)/)
            if (match) {
              const num = parseInt(match[1])
              if (num >= 1000) {
                moduleNum = '10'
              } else if (num >= 100) {
                moduleNum = Math.floor(num / 100).toString()
              }
            }
          }
        }
      } else if (isConstitutionCourse) {
        // Indian Constitution course: use lesson order ranges
        // Module 1: orders 1-5, Module 2: orders 6-10, etc.
        if (lesson.order >= 1 && lesson.order <= 5) {
          moduleNum = '1'
        } else if (lesson.order >= 6 && lesson.order <= 10) {
          moduleNum = '2'
        } else if (lesson.order >= 11 && lesson.order <= 16) {
          moduleNum = '3'
        } else if (lesson.order >= 17 && lesson.order <= 22) {
          moduleNum = '4'
        } else if (lesson.order >= 23 && lesson.order <= 28) {
          moduleNum = '5'
        } else if (lesson.order >= 29 && lesson.order <= 34) {
          moduleNum = '6'
        } else if (lesson.order >= 35 && lesson.order <= 39) {
          moduleNum = '7'
        } else if (lesson.order >= 40 && lesson.order <= 44) {
          moduleNum = '8'
        } else if (lesson.order >= 45 && lesson.order <= 50) {
          moduleNum = '9'
        } else if (lesson.order >= 51) {
          moduleNum = '10'
        }
      } else if (isPublicSpeakingIntermediate) {
        // Public Speaking INTERMEDIATE course: use order ranges (101-105, 201-205, etc.)
        // Only 6 modules: Module 1: orders 101-105, Module 2: orders 201-205, etc.
        if (lesson.order >= 101 && lesson.order <= 105) {
          moduleNum = '1'
        } else if (lesson.order >= 201 && lesson.order <= 205) {
          moduleNum = '2'
        } else if (lesson.order >= 301 && lesson.order <= 305) {
          moduleNum = '3'
        } else if (lesson.order >= 401 && lesson.order <= 405) {
          moduleNum = '4'
        } else if (lesson.order >= 501 && lesson.order <= 505) {
          moduleNum = '5'
        } else if (lesson.order >= 601 && lesson.order <= 605) {
          moduleNum = '6'
        }
      } else if (isPublicSpeakingAdvanced) {
        // Public Speaking ADVANCED course: use order ranges (101-105, 201-205, etc.)
        // 10 modules: Module 1: orders 101-105, Module 2: orders 201-205, etc.
        if (lesson.order >= 101 && lesson.order <= 105) {
          moduleNum = '1'
        } else if (lesson.order >= 201 && lesson.order <= 205) {
          moduleNum = '2'
        } else if (lesson.order >= 301 && lesson.order <= 305) {
          moduleNum = '3'
        } else if (lesson.order >= 401 && lesson.order <= 405) {
          moduleNum = '4'
        } else if (lesson.order >= 501 && lesson.order <= 505) {
          moduleNum = '5'
        } else if (lesson.order >= 601 && lesson.order <= 605) {
          moduleNum = '6'
        } else if (lesson.order >= 701 && lesson.order <= 705) {
          moduleNum = '7'
        } else if (lesson.order >= 801 && lesson.order <= 805) {
          moduleNum = '8'
        } else if (lesson.order >= 901 && lesson.order <= 905) {
          moduleNum = '9'
        } else if (lesson.order >= 1001 && lesson.order <= 1005) {
          moduleNum = '10'
        }
      } else if (isWebDevBootcamp) {
        // Web Development Bootcamp: use order ranges based on hundreds
        // Module 1: orders 1-99 (Intro)
        // Module 2: orders 100-199 (HTML)
        // Module 3: orders 200-299 (CSS)
        // Module 4: orders 300-399 (JavaScript)
        // Module 5: orders 400-499 (JavaScript Advanced)
        // Module 6: orders 500-599 (Git)
        // Module 7: orders 600-699 (UI/UX)
        // Module 8: orders 700-799 (React)
        // Module 9: orders 800-899 (Backend)
        // Module 10: orders 900-999 (Database)
        // Module 11: orders 1000-1099 (Authentication)
        // Module 12: orders 1100-1199 (API Development)
        // Module 13: orders 1200-1299 (Testing)
        // Module 14: orders 1300-1399 (Performance)
        // Module 15: orders 1400-1499 (Deployment)
        // Module 16: orders 1500-1599 (Capstone)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        } else if (lesson.order >= 700 && lesson.order <= 799) {
          moduleNum = '8'
        } else if (lesson.order >= 800 && lesson.order <= 899) {
          moduleNum = '9'
        } else if (lesson.order >= 900 && lesson.order <= 999) {
          moduleNum = '10'
        } else if (lesson.order >= 1000 && lesson.order <= 1099) {
          moduleNum = '11'
        } else if (lesson.order >= 1100 && lesson.order <= 1199) {
          moduleNum = '12'
        } else if (lesson.order >= 1200 && lesson.order <= 1299) {
          moduleNum = '13'
        } else if (lesson.order >= 1300 && lesson.order <= 1399) {
          moduleNum = '14'
        } else if (lesson.order >= 1400 && lesson.order <= 1499) {
          moduleNum = '15'
        } else if (lesson.order >= 1500 && lesson.order <= 1599) {
          moduleNum = '16'
        }
      } else if (isPythonMastery) {
        // Python Programming Mastery: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        }
      } else if (isDataScience) {
        // Data Science Fundamentals: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        } else if (lesson.order >= 700 && lesson.order <= 799) {
          moduleNum = '8'
        } else if (lesson.order >= 800 && lesson.order <= 899) {
          moduleNum = '9'
        } else if (lesson.order >= 900 && lesson.order <= 999) {
          moduleNum = '10'
        } else if (lesson.order >= 1000 && lesson.order <= 1099) {
          moduleNum = '11'
        }
      } else if (isMobileApp) {
        // Mobile App Development: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        } else if (lesson.order >= 700 && lesson.order <= 799) {
          moduleNum = '8'
        }
      } else if (isBusinessStrategy) {
        // Business Strategy Mastery: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        }
      } else if (isEntrepreneurship) {
        // Entrepreneurship Essentials: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        }
      } else if (isFinancialManagement) {
        // Financial Management: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        }
      } else if (isProjectManagement) {
        // Project Management: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        }
      } else if (isUIUXDesign) {
        // UI/UX Design Mastery: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        }
      } else if (isGraphicDesign) {
        // Graphic Design Fundamentals: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        }
      } else if (isContentCreation) {
        // Content Creation & Video Editing: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        }
      } else if (isPhotography) {
        // Photography & Digital Art: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        }
      } else if (isDigitalMarketing) {
        // Digital Marketing Mastery: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        }
      } else if (isSocialMedia) {
        // Social Media Management: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        }
      } else if (isBrandStrategy) {
        // Brand Strategy & Management: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        } else if (lesson.order >= 700 && lesson.order <= 799) {
          moduleNum = '8'
        }
      } else if (isInvestmentWealth) {
        // Investment & Wealth Building: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '2'
        }
      } else if (isTaxInsurance) {
        // Tax Planning & Insurance: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '1'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '2'
        }
      } else if (isNutritionHealth) {
        // Nutrition & Healthy Living: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '1'
        } else if (lesson.order >= 200 && lesson.order <= 219) {
          moduleNum = '2'
        }
      } else if (isFitnessExercise) {
        // Fitness & Exercise: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '1'
        } else if (lesson.order >= 200 && lesson.order <= 239) {
          moduleNum = '2'
        }
      } else if (isMentalHealth) {
        // Mental Health & Mindfulness: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '1'
        }
      } else if (isEnglishG1) {
        // English Grammar Grade 1: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '1'
        }
      } else if (isMathG2) {
        // Mathematics Grade 2: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 139) {
          moduleNum = '2'
        }
      } else if (isScienceG3) {
        // Science Fundamentals Grade 3: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 149) {
          moduleNum = '2'
        }
      } else if (isMathG3) {
        // Mathematics Grade 3: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 159) {
          moduleNum = '2'
        }
      } else if (isEnglishLitG4) {
        // English Literature Grade 4: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 179) {
          moduleNum = '2'
        }
      } else if (isMathG4) {
        // Mathematics Grade 4: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 169) {
          moduleNum = '2'
        }
      } else if (isScienceG5) {
        // Science Grade 5: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 189) {
          moduleNum = '2'
        }
      } else if (isMathG6) {
        // Mathematics Grade 6: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        }
      } else if (isScienceG6) {
        // Science Grade 6: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 209) {
          moduleNum = '3'
        }
      } else if (isEnglishLitG7) {
        // English Literature Grade 7: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 219) {
          moduleNum = '3'
        }
      } else if (isMathG7) {
        // Mathematics Grade 7: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 229) {
          moduleNum = '3'
        }
      } else if (isScienceG8) {
        // Science Grade 8: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 239) {
          moduleNum = '3'
        }
      } else if (isMathG9) {
        // Mathematics Grade 9: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 249) {
          moduleNum = '3'
        }
      } else if (isPhysicsG9) {
        // Physics Grade 9: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 259) {
          moduleNum = '3'
        }
      } else if (isChemistryG10) {
        // Chemistry Grade 10: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 269) {
          moduleNum = '3'
        }
      } else if (isBiologyG10) {
        // Biology Grade 10: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 279) {
          moduleNum = '3'
        }
      } else if (isMathG10) {
        // Mathematics Grade 10: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 289) {
          moduleNum = '3'
        }
      } else if (isMathG11) {
        // Advanced Mathematics Class 11: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        }
      } else if (isPhysicsG11) {
        // Physics Class 11: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 309) {
          moduleNum = '4'
        }
      } else if (isChemistryG11) {
        // Chemistry Class 11: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 319) {
          moduleNum = '4'
        }
      } else if (isBiologyG12) {
        // Biology Class 12: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 329) {
          moduleNum = '4'
        }
      } else if (isProgrammingFundamentals) {
        // Programming Fundamentals: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 349) {
          moduleNum = '3'
        }
      } else if (isEngineeringPhysics) {
        // Engineering Physics: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 359) {
          moduleNum = '3'
        }
      } else if (isDigitalElectronics) {
        // Digital Electronics: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 369) {
          moduleNum = '3'
        }
      } else if (isHumanAnatomy) {
        // Human Anatomy: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 379) {
          moduleNum = '3'
        }
      } else if (isBiochemistry) {
        // Biochemistry: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 389) {
          moduleNum = '3'
        }
      } else if (isPhysiology) {
        // Physiology: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        }
      } else if (isMedicalResearch) {
        // Medical Research Methods: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 409) {
          moduleNum = '4'
        }
      } else if (isBusinessEconomics) {
        // Business Economics: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 419) {
          moduleNum = '4'
        }
      } else if (isAccountingPrinciples) {
        // Accounting Principles: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 429) {
          moduleNum = '4'
        }
      } else if (isBusinessStatistics) {
        // Business Statistics: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 439) {
          moduleNum = '4'
        }
      } else if (isMarketingFundamentals) {
        // Marketing Fundamentals: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 449) {
          moduleNum = '4'
        }
      } else if (isWorldLiterature) {
        // World Literature: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 459) {
          moduleNum = '4'
        }
      } else if (isPhilosophyBasics) {
        // Philosophy Basics: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 469) {
          moduleNum = '4'
        }
      } else if (isHistoryOfArt) {
        // History of Art: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 479) {
          moduleNum = '4'
        }
      } else if (isCommunicationSkills) {
        // Communication Skills: use order ranges
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 489) {
          moduleNum = '4'
        }
      } else if (isCommerceBasics) {
        // Commerce Basics: use order ranges (6 modules × 5 lessons each)
        // Module 1: orders 1-5, Module 2: orders 6-10, etc.
        if (lesson.order >= 1 && lesson.order <= 5) {
          moduleNum = '1'
        } else if (lesson.order >= 6 && lesson.order <= 10) {
          moduleNum = '2'
        } else if (lesson.order >= 11 && lesson.order <= 15) {
          moduleNum = '3'
        } else if (lesson.order >= 16 && lesson.order <= 20) {
          moduleNum = '4'
        } else if (lesson.order >= 21 && lesson.order <= 25) {
          moduleNum = '5'
        } else if (lesson.order >= 26 && lesson.order <= 30) {
          moduleNum = '6'
        }
      } else if (isCAFoundation) {
        // CA Foundation Complete Course: use order ranges (4 papers)
        // Module 1: orders 1-99 (Paper 1 - Accounting)
        // Module 2: orders 100-199 (Paper 2 - Law)
        // Module 3: orders 200-299 (Paper 3 - Quantitative Aptitude)
        // Module 4: orders 300-399 (Paper 4 - Economics & BCK)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        }
      } else if (isCAIntermediate) {
        // CA Intermediate Complete Course: use order ranges (8 papers/modules)
        // Module 1: orders 1-99 (Paper 1 - Advanced Accounting)
        // Module 2: orders 100-199 (Paper 2 - Corporate & Other Laws)
        // Module 3: orders 200-299 (Paper 3 - Taxation)
        // Module 4: orders 300-399 (Paper 4 - Cost Management)
        // Module 5: orders 400-499 (Paper 5 - Auditing & Ethics)
        // Module 6: orders 500-599 (Paper 6A - Financial Management)
        // Module 7: orders 600-699 (Paper 6B - Strategic Management)
        // Module 8: orders 700-799 (Exam Preparation)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        } else if (lesson.order >= 700 && lesson.order <= 799) {
          moduleNum = '8'
        }
      } else if (isCAFinal) {
        // CA Final Complete Course: use order ranges (8 papers/modules)
        // Module 1: orders 1-99 (Paper 1 - Financial Reporting)
        // Module 2: orders 100-199 (Paper 2 - Advanced Auditing)
        // Module 3: orders 200-299 (Paper 3 - Direct Tax)
        // Module 4: orders 300-399 (Paper 4 - Indirect Tax/GST)
        // Module 5: orders 400-499 (Paper 5 - Strategic FM)
        // Module 6: orders 500-599 (Paper 6A - Strategic Cost)
        // Module 7: orders 600-699 (Paper 6B - Corporate Laws)
        // Module 8: orders 700-799 (Exam Mastery)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        } else if (lesson.order >= 700 && lesson.order <= 799) {
          moduleNum = '8'
        }
      } else if (isCSExecutive) {
        // CS Executive Complete Course: use order ranges (8 papers/modules)
        // Module 1: orders 1-99 (Paper 1 - Jurisprudence)
        // Module 2: orders 101-199 (Paper 2 - Company Law)
        // Module 3: orders 201-299 (Paper 3 - Business & Labour Laws)
        // Module 4: orders 301-399 (Paper 4 - Tax Laws)
        // Module 5: orders 401-499 (Paper 5 - Management Accounting)
        // Module 6: orders 501-599 (Paper 6 - Securities Laws)
        // Module 7: orders 601-699 (Paper 7 - Economic Laws)
        // Module 8: orders 701-799 (Exam Preparation)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        } else if (lesson.order >= 700 && lesson.order <= 799) {
          moduleNum = '8'
        }
      } else if (isCSFoundation) {
        // CS Foundation Complete Course: use order ranges (4 papers)
        // Module 1: orders 1-99 (Paper 1 - Business Environment & Law)
        // Module 2: orders 100-199 (Paper 2 - Business Management & Ethics)
        // Module 3: orders 200-299 (Paper 3 - Business Economics)
        // Module 4: orders 300-399 (Paper 4 - Accounting & Auditing)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        }
      } else if (isCSProfessional) {
        // CS Professional Complete Course: use order ranges (9 papers/modules)
        // Module 1: orders 1-99 (Paper 1 - Governance, Risk Management)
        // Module 2: orders 100-199 (Paper 2 - Advanced Tax Laws)
        // Module 3: orders 200-299 (Paper 3 - Drafting & Appearances)
        // Module 4: orders 300-399 (Paper 4 - Secretarial Audit)
        // Module 5: orders 400-499 (Paper 5 - Restructuring & Insolvency)
        // Module 6: orders 500-599 (Paper 6 - Capital Markets)
        // Module 7: orders 600-699 (Paper 7 - Corporate Disputes)
        // Module 8: orders 700-799 (Paper 8 - Advanced Commercial Laws)
        // Module 9: orders 800-899 (Exam Mastery)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        } else if (lesson.order >= 700 && lesson.order <= 799) {
          moduleNum = '8'
        } else if (lesson.order >= 800 && lesson.order <= 899) {
          moduleNum = '9'
        }
      } else if (isCMAFoundation) {
        // CMA Foundation Complete Course: use order ranges (4 papers)
        // Module 1: orders 1-99 (Paper 1 - Business Laws & Ethics)
        // Module 2: orders 100-199 (Paper 2 - Financial & Cost Accounting)
        // Module 3: orders 200-299 (Paper 3 - Business Mathematics & Statistics)
        // Module 4: orders 300-399 (Paper 4 - Business Economics & Management)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        }
      } else if (isCMAIntermediate) {
        // CMA Intermediate Complete Course: use order ranges (8 papers/modules)
        // Module 1: orders 1-99 (Paper 5 - Financial Accounting)
        // Module 2: orders 100-199 (Paper 6 - Corporate Laws & Compliance)
        // Module 3: orders 200-299 (Paper 7 - Direct Taxation)
        // Module 4: orders 300-399 (Paper 8 - Cost Accounting)
        // Module 5: orders 400-499 (Paper 9 - Operations & Strategic Management)
        // Module 6: orders 500-599 (Paper 10 - Corporate Accounting & Auditing)
        // Module 7: orders 600-699 (Paper 11 - Financial Management)
        // Module 8: orders 700-799 (Exam Preparation)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        } else if (lesson.order >= 700 && lesson.order <= 799) {
          moduleNum = '8'
        }
      } else if (isCFALevel1) {
        // CFA Level 1 Complete Course: use order ranges (10 topics)
        // Module 1: orders 1-99 (Ethical and Professional Standards)
        // Module 2: orders 100-199 (Quantitative Methods)
        // Module 3: orders 200-299 (Economics)
        // Module 4: orders 300-399 (Financial Statement Analysis)
        // Module 5: orders 400-499 (Corporate Issuers)
        // Module 6: orders 500-599 (Equity Investments)
        // Module 7: orders 600-699 (Fixed Income)
        // Module 8: orders 700-799 (Derivatives)
        // Module 9: orders 800-899 (Alternative Investments)
        // Module 10: orders 900-999 (Portfolio Management and Wealth Planning)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        } else if (lesson.order >= 700 && lesson.order <= 799) {
          moduleNum = '8'
        } else if (lesson.order >= 800 && lesson.order <= 899) {
          moduleNum = '9'
        } else if (lesson.order >= 900 && lesson.order <= 999) {
          moduleNum = '10'
        }
      } else if (isCFALevel2) {
        // CFA Level 2 Complete Course: use order ranges (11 modules)
        // Module 1: orders 1-99 (Ethical & Professional Standards)
        // Module 2: orders 100-199 (Quantitative Methods)
        // Module 3: orders 200-299 (Economics)
        // Module 4: orders 300-399 (Financial Statement Analysis)
        // Module 5: orders 400-499 (Corporate Issuers)
        // Module 6: orders 500-599 (Equity Investments)
        // Module 7: orders 600-699 (Fixed Income)
        // Module 8: orders 700-799 (Derivatives)
        // Module 9: orders 800-899 (Alternative Investments)
        // Module 10: orders 900-999 (Portfolio Management)
        // Module 11: orders 1000-1099 (Vignette Practice & Revision)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        } else if (lesson.order >= 700 && lesson.order <= 799) {
          moduleNum = '8'
        } else if (lesson.order >= 800 && lesson.order <= 899) {
          moduleNum = '9'
        } else if (lesson.order >= 900 && lesson.order <= 999) {
          moduleNum = '10'
        } else if (lesson.order >= 1000 && lesson.order <= 1099) {
          moduleNum = '11'
        }
      } else if (isCFALevel3) {
        // CFA Level 3 Complete Course: use order ranges (11 modules)
        // Module 1: orders 1-99 (Wealth Management)
        // Module 2: orders 100-199 (Individual Wealth Management)
        // Module 3: orders 200-299 (Institutional Wealth Management)
        // Module 4: orders 300-399 (Behavioral Finance & Private Wealth)
        // Module 5: orders 400-499 (Alternative Investments)
        // Module 6: orders 500-599 (Capital Market Expectations)
        // Module 7: orders 600-699 (Asset Allocation)
        // Module 8: orders 700-799 (Fixed Income & Derivatives)
        // Module 9: orders 800-899 (Equity & Alternative Strategies)
        // Module 10: orders 900-999 (Portfolio Execution & Monitoring)
        // Module 11: orders 1000-1099 (Integrated Practice & Revision)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        } else if (lesson.order >= 700 && lesson.order <= 799) {
          moduleNum = '8'
        } else if (lesson.order >= 800 && lesson.order <= 899) {
          moduleNum = '9'
        } else if (lesson.order >= 900 && lesson.order <= 999) {
          moduleNum = '10'
        } else if (lesson.order >= 1000 && lesson.order <= 1099) {
          moduleNum = '11'
        }
      } else if (isFRMPart1) {
        // FRM Part 1 Complete Course: use order ranges (8 modules)
        // Module 1: orders 1-99 (Foundations of Risk Management)
        // Module 2: orders 100-199 (Quantitative Analysis)
        // Module 3: orders 200-299 (Financial Markets & Products)
        // Module 4: orders 300-399 (Valuation & Risk Models)
        // Module 5: orders 400-499 (Market Risk Measurement & Management)
        // Module 6: orders 500-599 (Probability & Statistics Applications)
        // Module 7: orders 600-699 (Integrated FRM Exam Practice)
        // Module 8: orders 700-799 (Final Revision & Exam Strategy)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        } else if (lesson.order >= 700 && lesson.order <= 799) {
          moduleNum = '8'
        }
      } else if (isFRMPart2) {
        // FRM Part 2 Complete Course: use order ranges (9 modules)
        // Module 1: orders 1-99 (Market Risk Measurement & Management)
        // Module 2: orders 100-199 (Credit Risk Measurement & Management)
        // Module 3: orders 200-299 (Operational & Liquidity Risk)
        // Module 4: orders 300-399 (Investment & Portfolio Risk Management)
        // Module 5: orders 400-499 (Risk Models & Quantitative Applications)
        // Module 6: orders 500-599 (Current Issues in Financial Risk)
        // Module 7: orders 600-699 (Integrated Risk Management & ERM)
        // Module 8: orders 700-799 (Exam Practice & Mock Tests)
        // Module 9: orders 800-899 (Final Revision & Exam Strategy)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        } else if (lesson.order >= 700 && lesson.order <= 799) {
          moduleNum = '8'
        } else if (lesson.order >= 800 && lesson.order <= 899) {
          moduleNum = '9'
        }
      } else if (isUSCMAPart1) {
        // US CMA Part 1 Complete Course: use order ranges (6 modules)
        // Module 1: orders 1-15 (External Financial Reporting Decisions)
        // Module 2: orders 16-41 (Planning, Budgeting, and Forecasting)
        // Module 3: orders 42-65 (Performance Management)
        // Module 4: orders 66-88 (Cost Management)
        // Module 5: orders 89-108 (Internal Controls)
        // Module 6: orders 109-123 (Technology and Analytics in Finance)
        if (lesson.order >= 1 && lesson.order <= 15) {
          moduleNum = '1'
        } else if (lesson.order >= 16 && lesson.order <= 41) {
          moduleNum = '2'
        } else if (lesson.order >= 42 && lesson.order <= 65) {
          moduleNum = '3'
        } else if (lesson.order >= 66 && lesson.order <= 88) {
          moduleNum = '4'
        } else if (lesson.order >= 89 && lesson.order <= 108) {
          moduleNum = '5'
        } else if (lesson.order >= 109 && lesson.order <= 123) {
          moduleNum = '6'
        }
      } else if (isUSCMAPart2) {
        // US CMA Part 2 Complete Course: use order ranges (6 modules)
        // Module 1: orders 1-20 (Financial Statement Analysis)
        // Module 2: orders 21-48 (Corporate Finance)
        // Module 3: orders 49-73 (Decision Analysis & Risk Management)
        // Module 4: orders 74-96 (Investment & Portfolio Decisions)
        // Module 5: orders 97-112 (Professional Ethics & Governance)
        // Module 6: orders 113-125 (Strategic Decision-Making & Exam Practice)
        if (lesson.order >= 1 && lesson.order <= 20) {
          moduleNum = '1'
        } else if (lesson.order >= 21 && lesson.order <= 48) {
          moduleNum = '2'
        } else if (lesson.order >= 49 && lesson.order <= 73) {
          moduleNum = '3'
        } else if (lesson.order >= 74 && lesson.order <= 96) {
          moduleNum = '4'
        } else if (lesson.order >= 97 && lesson.order <= 112) {
          moduleNum = '5'
        } else if (lesson.order >= 113 && lesson.order <= 125) {
          moduleNum = '6'
        }
      } else if (isUSCPA) {
        // US CPA Complete Course: use order ranges (4 sections)
        // Section 1: orders 1-200 (FAR - Financial Accounting & Reporting)
        // Section 2: orders 201-320 (AUD - Auditing & Attestation)
        // Section 3: orders 321-440 (REG - Regulation)
        // Section 4: orders 441-475 (Discipline Section)
        if (lesson.order >= 1 && lesson.order <= 200) {
          moduleNum = '1'
        } else if (lesson.order >= 201 && lesson.order <= 320) {
          moduleNum = '2'
        } else if (lesson.order >= 321 && lesson.order <= 440) {
          moduleNum = '3'
        } else if (lesson.order >= 441) {
          moduleNum = '4'
        }
      } else if (isACCALevel1) {
        // ACCA Level 1 Complete Course: use order ranges (3 papers)
        // Paper 1: orders 1-57 (BT - Business & Technology)
        // Paper 2: orders 58-114 (MA - Management Accounting)
        // Paper 3: orders 115-171 (FA - Financial Accounting)
        if (lesson.order >= 1 && lesson.order <= 57) {
          moduleNum = '1'
        } else if (lesson.order >= 58 && lesson.order <= 114) {
          moduleNum = '2'
        } else if (lesson.order >= 115) {
          moduleNum = '3'
        }
      } else if (isACCALevel2) {
        // ACCA Level 2 Complete Course: use order ranges (6 papers)
        // Paper 1: orders 1-40 (LW - Corporate & Business Law)
        // Paper 2: orders 41-90 (PM - Performance Management)
        // Paper 3: orders 91-145 (TX - Taxation)
        // Paper 4: orders 146-200 (FR - Financial Reporting)
        // Paper 5: orders 201-245 (AA - Audit & Assurance)
        // Paper 6: orders 246-300 (FM - Financial Management)
        if (lesson.order >= 1 && lesson.order <= 40) {
          moduleNum = '1'
        } else if (lesson.order >= 41 && lesson.order <= 90) {
          moduleNum = '2'
        } else if (lesson.order >= 91 && lesson.order <= 145) {
          moduleNum = '3'
        } else if (lesson.order >= 146 && lesson.order <= 200) {
          moduleNum = '4'
        } else if (lesson.order >= 201 && lesson.order <= 245) {
          moduleNum = '5'
        } else if (lesson.order >= 246) {
          moduleNum = '6'
        }
      } else if (isACCALevel3) {
        // ACCA Level 3 Complete Course: use order ranges (6 papers)
        // Module 1: orders 1-90 (SBL - Strategic Business Leader)
        // Module 2: orders 91-170 (SBR - Strategic Business Reporting)
        // Module 3: orders 171-208 (AFM - Advanced Financial Management)
        // Module 4: orders 209-246 (AAA - Advanced Audit & Assurance)
        // Module 5: orders 247-284 (APM - Advanced Performance Management)
        // Module 6: orders 285-322 (ATX - Advanced Taxation)
        if (lesson.order >= 1 && lesson.order <= 90) {
          moduleNum = '1'
        } else if (lesson.order >= 91 && lesson.order <= 170) {
          moduleNum = '2'
        } else if (lesson.order >= 171 && lesson.order <= 208) {
          moduleNum = '3'
        } else if (lesson.order >= 209 && lesson.order <= 246) {
          moduleNum = '4'
        } else if (lesson.order >= 247 && lesson.order <= 284) {
          moduleNum = '5'
        } else if (lesson.order >= 285) {
          moduleNum = '6'
        }
      } else if (isSchoolPrimary1_5) {
        // Primary & Middle School Class 1-5: use order ranges
        // Module 1: orders 1-9 (Basics of Math)
        // Module 2: orders 10-19 (English Reading & Writing)
        // Module 3: orders 20-29 (EVS)
        // Module 4: orders 30-39 (Hindi / Regional Language)
        // Module 5: orders 40-49 (Concept Building)
        if (lesson.order >= 1 && lesson.order <= 9) {
          moduleNum = '1'
        } else if (lesson.order >= 10 && lesson.order <= 19) {
          moduleNum = '2'
        } else if (lesson.order >= 20 && lesson.order <= 29) {
          moduleNum = '3'
        } else if (lesson.order >= 30 && lesson.order <= 39) {
          moduleNum = '4'
        } else if (lesson.order >= 40) {
          moduleNum = '5'
        }
      } else if (isSchoolPrimary6_8) {
        // Primary & Middle School Class 6-8: use order ranges
        // Module 1: orders 1-20 (Mathematics)
        // Module 2: orders 21-40 (Science)
        // Module 3: orders 41-60 (Social Science)
        // Module 4: orders 61-80 (English Grammar)
        // Module 5: orders 81-100 (Hindi / Regional Language)
        if (lesson.order >= 1 && lesson.order <= 20) {
          moduleNum = '1'
        } else if (lesson.order >= 21 && lesson.order <= 40) {
          moduleNum = '2'
        } else if (lesson.order >= 41 && lesson.order <= 60) {
          moduleNum = '3'
        } else if (lesson.order >= 61 && lesson.order <= 80) {
          moduleNum = '4'
        } else if (lesson.order >= 81) {
          moduleNum = '5'
        }
      } else if (isSchoolSecondary9_10) {
        // Secondary School Class 9-10: use order ranges
        // Module 1: orders 1-20 (Mathematics)
        // Module 2: orders 21-50 (Science)
        // Module 3: orders 51-70 (Social Science)
        // Module 4: orders 71-85 (English)
        // Module 5: orders 86-100 (Hindi / Regional Language)
        // Module 6: orders 101-120 (Board-Oriented Practice)
        if (lesson.order >= 1 && lesson.order <= 20) {
          moduleNum = '1'
        } else if (lesson.order >= 21 && lesson.order <= 50) {
          moduleNum = '2'
        } else if (lesson.order >= 51 && lesson.order <= 70) {
          moduleNum = '3'
        } else if (lesson.order >= 71 && lesson.order <= 85) {
          moduleNum = '4'
        } else if (lesson.order >= 86 && lesson.order <= 100) {
          moduleNum = '5'
        } else if (lesson.order >= 101) {
          moduleNum = '6'
        }
      } else if (isSchoolSeniorScience) {
        // Senior Secondary Science Stream Class 11-12: use order ranges
        // Module 1: orders 1-30 (Physics)
        // Module 2: orders 31-60 (Chemistry)
        // Module 3: orders 61-90 (Mathematics)
        // Module 4: orders 91-120 (Biology)
        if (lesson.order >= 1 && lesson.order <= 30) {
          moduleNum = '1'
        } else if (lesson.order >= 31 && lesson.order <= 60) {
          moduleNum = '2'
        } else if (lesson.order >= 61 && lesson.order <= 90) {
          moduleNum = '3'
        } else if (lesson.order >= 91) {
          moduleNum = '4'
        }
      } else if (isSchoolSeniorCommerce) {
        // Senior Secondary Commerce Stream Class 11-12: use order ranges
        // Module 1: orders 1-30 (Accountancy)
        // Module 2: orders 31-60 (Business Studies)
        // Module 3: orders 61-90 (Economics)
        // Module 4: orders 91-120 (Mathematics)
        if (lesson.order >= 1 && lesson.order <= 30) {
          moduleNum = '1'
        } else if (lesson.order >= 31 && lesson.order <= 60) {
          moduleNum = '2'
        } else if (lesson.order >= 61 && lesson.order <= 90) {
          moduleNum = '3'
        } else if (lesson.order >= 91) {
          moduleNum = '4'
        }
      } else if (isSchoolSeniorArts) {
        // Senior Secondary Arts/Humanities Class 11-12: use order ranges
        // Module 1: orders 1-20 (History)
        // Module 2: orders 21-40 (Political Science)
        // Module 3: orders 41-60 (Geography)
        // Module 4: orders 61-80 (Economics)
        // Module 5: orders 81-100 (Sociology)
        // Module 6: orders 101-120 (Psychology)
        if (lesson.order >= 1 && lesson.order <= 20) {
          moduleNum = '1'
        } else if (lesson.order >= 21 && lesson.order <= 40) {
          moduleNum = '2'
        } else if (lesson.order >= 41 && lesson.order <= 60) {
          moduleNum = '3'
        } else if (lesson.order >= 61 && lesson.order <= 80) {
          moduleNum = '4'
        } else if (lesson.order >= 81 && lesson.order <= 100) {
          moduleNum = '5'
        } else if (lesson.order >= 101) {
          moduleNum = '6'
        }
      } else if (isSchoolExamPrep) {
        // Board Exam Crash Prep: use order ranges
        // Module 1: orders 1-10 (30-60 Day Board Strategy)
        // Module 2: orders 11-30 (Important Questions & PYQs)
        // Module 3: orders 31-45 (Revision Notes)
        // Module 4: orders 46-60 (Sample Papers & Mock Tests)
        // Module 5: orders 61-70 (Time Management in Exams)
        if (lesson.order >= 1 && lesson.order <= 10) {
          moduleNum = '1'
        } else if (lesson.order >= 11 && lesson.order <= 30) {
          moduleNum = '2'
        } else if (lesson.order >= 31 && lesson.order <= 45) {
          moduleNum = '3'
        } else if (lesson.order >= 46 && lesson.order <= 60) {
          moduleNum = '4'
        } else if (lesson.order >= 61) {
          moduleNum = '5'
        }
      } else if (isSchoolSkills) {
        // Skill Add-ons for School Students: use order ranges
        // Module 1: orders 1-10 (English Speaking)
        // Module 2: orders 11-20 (Handwriting Improvement)
        // Module 3: orders 21-30 (Mental Math)
        // Module 4: orders 31-40 (Study Techniques)
        // Module 5: orders 41-50 (Memory & Focus Training)
        // Module 6: orders 51-60 (Exam Fear Reduction)
        if (lesson.order >= 1 && lesson.order <= 10) {
          moduleNum = '1'
        } else if (lesson.order >= 11 && lesson.order <= 20) {
          moduleNum = '2'
        } else if (lesson.order >= 21 && lesson.order <= 30) {
          moduleNum = '3'
        } else if (lesson.order >= 31 && lesson.order <= 40) {
          moduleNum = '4'
        } else if (lesson.order >= 41 && lesson.order <= 50) {
          moduleNum = '5'
        } else if (lesson.order >= 51) {
          moduleNum = '6'
        }
      } else if (isCollegeBscPcb) {
        // B.Sc PCB (Physics, Chemistry, Biology): use order ranges
        // Module 1: orders 1-99 (Physics Sem 1-2)
        // Module 2: orders 100-199 (Physics Sem 3-4)
        // Module 3: orders 200-299 (Physics Sem 5-6)
        // Module 4: orders 300-399 (Chemistry Sem 1-2)
        // Module 5: orders 400-499 (Chemistry Sem 3-4)
        // Module 6: orders 500-599 (Chemistry Sem 5-6)
        // Module 7: orders 600-699 (Biology Sem 1-2)
        // Module 8: orders 700-799 (Biology Sem 3-4)
        // Module 9: orders 800-899 (Biology Sem 5-6)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        } else if (lesson.order >= 700 && lesson.order <= 799) {
          moduleNum = '8'
        } else if (lesson.order >= 800) {
          moduleNum = '9'
        }
      } else if (isCollegeBscCs) {
        // B.Sc Computer Science: use order ranges
        // Module 1: orders 1-99 (Programming Fundamentals)
        // Module 2: orders 100-199 (Data Structures & Algorithms)
        // Module 3: orders 200-299 (Database Management Systems)
        // Module 4: orders 300-399 (Object-Oriented Programming)
        // Module 5: orders 400-499 (Web Development)
        // Module 6: orders 500-599 (Operating Systems)
        // Module 7: orders 600-699 (Computer Networks)
        // Module 8: orders 700-799 (Software Engineering)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        } else if (lesson.order >= 700) {
          moduleNum = '8'
        }
      } else if (isCollegeBscBio) {
        // B.Sc Biology/Biological Sciences: use order ranges
        // Module 1: orders 1-99 (Cell Biology & Genetics)
        // Module 2: orders 100-199 (Molecular Biology)
        // Module 3: orders 200-299 (Biochemistry)
        // Module 4: orders 300-399 (Microbiology)
        // Module 5: orders 400-499 (Biotechnology)
        // Module 6: orders 500-599 (Bioinformatics)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500) {
          moduleNum = '6'
        }
      } else if (isCollegeBscStats) {
        // B.Sc Statistics: use order ranges
        // Module 1: orders 1-99 (Probability Theory)
        // Module 2: orders 100-199 (Statistical Inference)
        // Module 3: orders 200-299 (Regression Analysis)
        // Module 4: orders 300-399 (Sampling Techniques)
        // Module 5: orders 400-499 (Data Analysis)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400) {
          moduleNum = '5'
        }
      } else if (isCollegeBcom) {
        // B.Com General: use order ranges
        // Module 1: orders 1-99 (Financial Accounting)
        // Module 2: orders 100-199 (Corporate Law)
        // Module 3: orders 200-299 (Income Tax)
        // Module 4: orders 300-399 (Business Economics)
        // Module 5: orders 400-499 (Cost Accounting)
        // Module 6: orders 500-599 (Auditing)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500) {
          moduleNum = '6'
        }
      } else if (isCollegeBba) {
        // B.B.A. (Business Administration): use order ranges
        // Module 1: orders 1-50 (Principles of Management)
        // Module 2: orders 51-100 (Marketing Management)
        // Module 3: orders 101-150 (Financial Management)
        // Module 4: orders 151-200 (Human Resource Management)
        // Module 5: orders 201-250 (Operations Management)
        // Module 6: orders 251-300 (Business Law)
        // Module 7: orders 301-350 (Entrepreneurship)
        // Module 8: orders 351-400 (Strategic Management)
        if (lesson.order >= 1 && lesson.order <= 50) {
          moduleNum = '1'
        } else if (lesson.order >= 51 && lesson.order <= 100) {
          moduleNum = '2'
        } else if (lesson.order >= 101 && lesson.order <= 150) {
          moduleNum = '3'
        } else if (lesson.order >= 151 && lesson.order <= 200) {
          moduleNum = '4'
        } else if (lesson.order >= 201 && lesson.order <= 250) {
          moduleNum = '5'
        } else if (lesson.order >= 251 && lesson.order <= 300) {
          moduleNum = '6'
        } else if (lesson.order >= 301 && lesson.order <= 350) {
          moduleNum = '7'
        } else if (lesson.order >= 351) {
          moduleNum = '8'
        }
      } else if (isCollegeBaHistory) {
        // B.A. History: use order ranges
        // Module 1: orders 1-99 (Ancient India)
        // Module 2: orders 100-199 (Medieval India)
        // Module 3: orders 200-299 (Modern India)
        // Module 4: orders 300-399 (World History)
        // Module 5: orders 400-499 (Historiography)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400) {
          moduleNum = '5'
        }
      } else if (isCollegeBaPolsc) {
        // B.A. Political Science: use order ranges
        // Module 1: orders 1-99 (Political Theory)
        // Module 2: orders 100-199 (Indian Polity)
        // Module 3: orders 200-299 (International Relations)
        // Module 4: orders 300-399 (Comparative Politics)
        // Module 5: orders 400-499 (Public Administration)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400) {
          moduleNum = '5'
        }
      } else if (isCollegeBaPsychology) {
        // B.A. Psychology: use order ranges
        // Module 1: orders 1-99 (Developmental Psychology)
        // Module 2: orders 100-199 (Social Psychology)
        // Module 3: orders 200-299 (Cognitive Psychology)
        // Module 4: orders 300-399 (Clinical Psychology)
        // Module 5: orders 400-499 (Research Methods)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400) {
          moduleNum = '5'
        }
      } else if (isCollegeBtechCs) {
        // B.Tech Computer Science: use order ranges
        // Module 1: orders 1-50 (Programming & Data Structures)
        // Module 2: orders 51-100 (Algorithms & Complexity)
        // Module 3: orders 101-150 (Operating Systems)
        // Module 4: orders 151-200 (Database Systems)
        // Module 5: orders 201-250 (Computer Networks)
        // Module 6: orders 251-300 (Software Engineering)
        // Module 7: orders 301-350 (Web Technologies)
        // Module 8: orders 351-400 (Machine Learning)
        if (lesson.order >= 1 && lesson.order <= 50) {
          moduleNum = '1'
        } else if (lesson.order >= 51 && lesson.order <= 100) {
          moduleNum = '2'
        } else if (lesson.order >= 101 && lesson.order <= 150) {
          moduleNum = '3'
        } else if (lesson.order >= 151 && lesson.order <= 200) {
          moduleNum = '4'
        } else if (lesson.order >= 201 && lesson.order <= 250) {
          moduleNum = '5'
        } else if (lesson.order >= 251 && lesson.order <= 300) {
          moduleNum = '6'
        } else if (lesson.order >= 301 && lesson.order <= 350) {
          moduleNum = '7'
        } else if (lesson.order >= 351) {
          moduleNum = '8'
        }
      } else if (isCollegeLlB) {
        // LL.B. (Bachelor of Laws): use order ranges
        // Module 1: orders 1-50 (Constitutional Law)
        // Module 2: orders 51-100 (Criminal Law)
        // Module 3: orders 101-150 (Civil Law)
        // Module 4: orders 151-200 (Corporate Law)
        // Module 5: orders 201-250 (International Law)
        // Module 6: orders 251-300 (Jurisprudence)
        // Module 7: orders 301-350 (Legal Drafting)
        // Module 8: orders 351-400 (Moot Court Practice)
        if (lesson.order >= 1 && lesson.order <= 50) {
          moduleNum = '1'
        } else if (lesson.order >= 51 && lesson.order <= 100) {
          moduleNum = '2'
        } else if (lesson.order >= 101 && lesson.order <= 150) {
          moduleNum = '3'
        } else if (lesson.order >= 151 && lesson.order <= 200) {
          moduleNum = '4'
        } else if (lesson.order >= 201 && lesson.order <= 250) {
          moduleNum = '5'
        } else if (lesson.order >= 251 && lesson.order <= 300) {
          moduleNum = '6'
        } else if (lesson.order >= 301 && lesson.order <= 350) {
          moduleNum = '7'
        } else if (lesson.order >= 351) {
          moduleNum = '8'
        }
      } else if (isCollegeSemesterSupport) {
        // College Semester Support: use order ranges
        // Module 1: orders 1-99 (1st Semester Basics)
        // Module 2: orders 100-199 (2nd Semester Core)
        // Module 3: orders 200-299 (3rd Semester Advanced)
        // Module 4: orders 300-399 (4th Semester Revision)
        // Module 5: orders 400-499 (5th Semester Specialization)
        // Module 6: orders 500-599 (6th Semester Project & Viva)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500) {
          moduleNum = '6'
        }
      } else if (isCollegeExamPrep) {
        // College Exam Preparation: use order ranges
        // Module 1: orders 1-50 (Important Questions)
        // Module 2: orders 51-100 (Previous Year Papers)
        // Module 3: orders 101-150 (Last-Minute Revision)
        // Module 4: orders 151-200 (Answer Writing)
        // Module 5: orders 201-250 (Passing Strategy)
        if (lesson.order >= 1 && lesson.order <= 50) {
          moduleNum = '1'
        } else if (lesson.order >= 51 && lesson.order <= 100) {
          moduleNum = '2'
        } else if (lesson.order >= 101 && lesson.order <= 150) {
          moduleNum = '3'
        } else if (lesson.order >= 151 && lesson.order <= 200) {
          moduleNum = '4'
        } else if (lesson.order >= 201) {
          moduleNum = '5'
        }
      } else if (isCollegeCareerSkills) {
        // College Career Skills: use order ranges
        // Module 1: orders 1-50 (Resume & CV Building)
        // Module 2: orders 51-100 (Interview Preparation)
        // Module 3: orders 101-150 (Group Discussion)
        // Module 4: orders 151-200 (Internship Readiness)
        // Module 5: orders 201-250 (Project Guidance)
        // Module 6: orders 251-300 (Corporate Etiquette)
        if (lesson.order >= 1 && lesson.order <= 50) {
          moduleNum = '1'
        } else if (lesson.order >= 51 && lesson.order <= 100) {
          moduleNum = '2'
        } else if (lesson.order >= 101 && lesson.order <= 150) {
          moduleNum = '3'
        } else if (lesson.order >= 151 && lesson.order <= 200) {
          moduleNum = '4'
        } else if (lesson.order >= 201 && lesson.order <= 250) {
          moduleNum = '5'
        } else if (lesson.order >= 251) {
          moduleNum = '6'
        }
      } else if (isActuarialScience) {
        // Actuarial Science Complete Course: use order ranges (8 modules)
        // Module 1: orders 1-99 (Mathematical Foundations)
        // Module 2: orders 100-199 (Probability Theory)
        // Module 3: orders 200-299 (Statistics)
        // Module 4: orders 300-399 (Financial Mathematics)
        // Module 5: orders 400-499 (Insurance & Risk Management)
        // Module 6: orders 500-599 (Survival Models & Life Contingencies)
        // Module 7: orders 600-699 (Stochastic Models)
        // Module 8: orders 700-799 (Exam Preparation)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        } else if (lesson.order >= 700) {
          moduleNum = '8'
        }
      } else if (isAdvancedExcel) {
        // Advanced Excel for Professionals: use order ranges (6 modules)
        // Module 1: orders 1-99 (Excel Fundamentals & Data Setup)
        // Module 2: orders 100-199 (Data Analysis & Visualization)
        // Module 3: orders 200-299 (Advanced Formulas & Functions)
        // Module 4: orders 300-399 (Pivot Tables & Power Tools)
        // Module 5: orders 400-499 (Automation & VBA Programming)
        // Module 6: orders 500-599 (Practical Projects & Case Studies)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500) {
          moduleNum = '6'
        }
      } else if (isStockMarketBasics) {
        // Stock Market Basics: use order ranges (6 modules)
        // Module 1: orders 1-99 (Introduction to Stock Markets)
        // Module 2: orders 100-199 (Market Participants & Instruments)
        // Module 3: orders 200-299 (Trading Basics)
        // Module 4: orders 300-399 (Basics of Technical Analysis)
        // Module 5: orders 400-499 (Basics of Fundamental Analysis)
        // Module 6: orders 500-599 (Risk Management & Beginner Strategies)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500) {
          moduleNum = '6'
        }
      } else if (isOptionsTradingMastery) {
        // Options Trading Mastery: use order ranges (10 modules)
        // Module 1: orders 1-99 (Foundations of Options Trading)
        // Module 2: orders 100-199 (Call and Put Options Deep Dive)
        // Module 3: orders 200-299 (Options Pricing Models & Greeks)
        // Module 4: orders 300-399 (Advanced Options Strategies)
        // Module 5: orders 400-499 (Options Trading Psychology & Risk Management)
        // Module 6: orders 500-599 (Technical Analysis for Options Traders)
        // Module 7: orders 600-699 (Options Trading in Different Market Conditions)
        // Module 8: orders 700-799 (Options Trading Tools, Platforms & Automation)
        // Module 9: orders 800-899 (Live Market Sessions & Practical Trading)
        // Module 10: orders 900-999 (Capstone Project & Career Preparation)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        } else if (lesson.order >= 700 && lesson.order <= 799) {
          moduleNum = '8'
        } else if (lesson.order >= 800 && lesson.order <= 899) {
          moduleNum = '9'
        } else if (lesson.order >= 900) {
          moduleNum = '10'
        }
      } else if (isTechnicalAnalysisMaster) {
        // Technical Analysis Master Course: use order ranges (10 modules)
        // Module 1: orders 1-99 (Foundations of Technical Analysis)
        // Module 2: orders 100-199 (Candlestick Analysis Deep Dive)
        // Module 3: orders 200-299 (Chart Patterns Mastery)
        // Module 4: orders 300-399 (Support, Resistance & Market Structure)
        // Module 5: orders 400-499 (Technical Indicators Advanced Usage)
        // Module 6: orders 500-599 (Volume & Price Relationship)
        // Module 7: orders 600-699 (Timeframes & Multi-Timeframe Analysis)
        // Module 8: orders 700-799 (Risk Management Using Technicals)
        // Module 9: orders 800-899 (Trading Psychology & Discipline)
        // Module 10: orders 900-999 (Build Your Technical Trading System)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        } else if (lesson.order >= 700 && lesson.order <= 799) {
          moduleNum = '8'
        } else if (lesson.order >= 800 && lesson.order <= 899) {
          moduleNum = '9'
        } else if (lesson.order >= 900) {
          moduleNum = '10'
        }
      } else if (isPriceActionTrading) {
        // Price Action Trading Course: use order ranges (8 modules)
        // Module 1: orders 1-99 (Price Action Philosophy & Mindset)
        // Module 2: orders 100-199 (Candlestick Psychology Deep Dive)
        // Module 3: orders 200-299 (Market Structure & Trend Analysis)
        // Module 4: orders 300-399 (Support, Resistance & Supply-Demand)
        // Module 5: orders 400-499 (High-Probability Price Action Setups)
        // Module 6: orders 500-599 (Risk Management Using Price Action)
        // Module 7: orders 600-699 (Multi-Timeframe Price Action)
        // Module 8: orders 800-899 (Build Your Price Action Trading System)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 600 && lesson.order <= 699) {
          moduleNum = '7'
        } else if (lesson.order >= 800) {
          moduleNum = '8'
        }
      } else if (isRiskManagementMasterclass) {
        // Risk Management Masterclass: use order ranges (7 modules)
        // Module 1: orders 1-99 (Risk Management Philosophy)
        // Module 2: orders 100-199 (Position Sizing Mastery)
        // Module 3: orders 200-299 (Risk-Reward & Expectancy)
        // Module 4: orders 300-399 (Stop-Loss & Trade Invalidation)
        // Module 5: orders 400-499 (Drawdown & Capital Protection)
        // Module 6: orders 500-599 (Psychological Risk & Discipline)
        // Module 7: orders 700-799 (Build Your Risk Management Plan)
        if (lesson.order >= 1 && lesson.order <= 99) {
          moduleNum = '1'
        } else if (lesson.order >= 100 && lesson.order <= 199) {
          moduleNum = '2'
        } else if (lesson.order >= 200 && lesson.order <= 299) {
          moduleNum = '3'
        } else if (lesson.order >= 300 && lesson.order <= 399) {
          moduleNum = '4'
        } else if (lesson.order >= 400 && lesson.order <= 499) {
          moduleNum = '5'
        } else if (lesson.order >= 500 && lesson.order <= 599) {
          moduleNum = '6'
        } else if (lesson.order >= 700) {
          moduleNum = '7'
        }
      } else if (isNoCodeAlgoTrading) {
        // No-Code Algo Trading Course: use order ranges (8 modules)
        // Module 1: orders 1-8 (Algo Trading Fundamentals)
        // Module 2: orders 9-16 (No-Code Algo Platforms Overview)
        // Module 3: orders 17-26 (Strategy Logic & Rule Design)
        // Module 4: orders 27-36 (Backtesting & Optimization)
        // Module 5: orders 37-44 (Risk Management for Algos)
        // Module 6: orders 45-52 (Live Deployment & Execution)
        // Module 7: orders 53-56 (Algo Monitoring & Improvement)
        // Module 8: orders 57-60 (Build Your No-Code Algo System)
        if (lesson.order >= 1 && lesson.order <= 8) {
          moduleNum = '1'
        } else if (lesson.order >= 9 && lesson.order <= 16) {
          moduleNum = '2'
        } else if (lesson.order >= 17 && lesson.order <= 26) {
          moduleNum = '3'
        } else if (lesson.order >= 27 && lesson.order <= 36) {
          moduleNum = '4'
        } else if (lesson.order >= 37 && lesson.order <= 44) {
          moduleNum = '5'
        } else if (lesson.order >= 45 && lesson.order <= 52) {
          moduleNum = '6'
        } else if (lesson.order >= 53 && lesson.order <= 56) {
          moduleNum = '7'
        } else if (lesson.order >= 57 && lesson.order <= 60) {
          moduleNum = '8'
        }
      } else if (isMutualFundsSipMastery) {
        // Mutual Funds & SIP Mastery: use order ranges (7 modules)
        // Module 1: orders 1-7 (Mutual Fund Basics)
        // Module 2: orders 8-13 (Mutual Fund Categories Explained)
        // Module 3: orders 14-19 (How to Select the Right Mutual Fund)
        // Module 4: orders 20-27 (SIP Mastery)
        // Module 5: orders 28-33 (Risk Management & Asset Allocation)
        // Module 6: orders 34-38 (Taxation, Regulations & Compliance)
        // Module 7: orders 39-42 (Long-Term Wealth Creation Blueprint)
        if (lesson.order >= 1 && lesson.order <= 7) {
          moduleNum = '1'
        } else if (lesson.order >= 8 && lesson.order <= 13) {
          moduleNum = '2'
        } else if (lesson.order >= 14 && lesson.order <= 19) {
          moduleNum = '3'
        } else if (lesson.order >= 20 && lesson.order <= 27) {
          moduleNum = '4'
        } else if (lesson.order >= 28 && lesson.order <= 33) {
          moduleNum = '5'
        } else if (lesson.order >= 34 && lesson.order <= 38) {
          moduleNum = '6'
        } else if (lesson.order >= 39 && lesson.order <= 42) {
          moduleNum = '7'
        }
      } else if (isUPSCcivilServicesPrelims) {
        // UPSC Civil Services Prelims: use order ranges (10 modules)
        // Module 1: orders 1-8 (Orientation & Strategy)
        // Module 2: orders 9-22 (History)
        // Module 3: orders 23-34 (Geography)
        // Module 4: orders 35-48 (Polity)
        // Module 5: orders 49-60 (Economy)
        // Module 6: orders 61-70 (Environment)
        // Module 7: orders 71-80 (Current Affairs)
        // Module 8: orders 81-90 (CSAT Quantitative)
        // Module 9: orders 91-100 (CSAT Reasoning)
        // Module 10: orders 101-110 (Revision & Tests)
        if (lesson.order >= 1 && lesson.order <= 8) {
          moduleNum = '1'
        } else if (lesson.order >= 9 && lesson.order <= 22) {
          moduleNum = '2'
        } else if (lesson.order >= 23 && lesson.order <= 34) {
          moduleNum = '3'
        } else if (lesson.order >= 35 && lesson.order <= 48) {
          moduleNum = '4'
        } else if (lesson.order >= 49 && lesson.order <= 60) {
          moduleNum = '5'
        } else if (lesson.order >= 61 && lesson.order <= 70) {
          moduleNum = '6'
        } else if (lesson.order >= 71 && lesson.order <= 80) {
          moduleNum = '7'
        } else if (lesson.order >= 81 && lesson.order <= 90) {
          moduleNum = '8'
        } else if (lesson.order >= 91 && lesson.order <= 100) {
          moduleNum = '9'
        } else if (lesson.order >= 101 && lesson.order <= 110) {
          moduleNum = '10'
        }
      } else if (isUPSCcivilServicesMains) {
        // UPSC Civil Services Mains: use order ranges (10 modules)
        // Module 1: orders 1-8 (Mains Exam Orientation & Strategy)
        // Module 2: orders 9-24 (GS Paper I - History, Culture & Society)
        // Module 3: orders 25-40 (GS Paper II - Governance, Polity & IR)
        // Module 4: orders 41-56 (GS Paper III - Economy, Environment & Tech)
        // Module 5: orders 57-68 (GS Paper IV - Ethics)
        // Module 6: orders 69-80 (Essay Writing Mastery)
        // Module 7: orders 81-105 (Optional Subject Guidance)
        // Module 8: orders 106-117 (Answer Writing Techniques)
        // Module 9: orders 118-127 (Current Affairs Integration)
        // Module 10: orders 128-137 (Revision, Mock Tests & Pre-Exam Strategy)
        if (lesson.order >= 1 && lesson.order <= 8) {
          moduleNum = '1'
        } else if (lesson.order >= 9 && lesson.order <= 24) {
          moduleNum = '2'
        } else if (lesson.order >= 25 && lesson.order <= 40) {
          moduleNum = '3'
        } else if (lesson.order >= 41 && lesson.order <= 56) {
          moduleNum = '4'
        } else if (lesson.order >= 57 && lesson.order <= 68) {
          moduleNum = '5'
        } else if (lesson.order >= 69 && lesson.order <= 80) {
          moduleNum = '6'
        } else if (lesson.order >= 81 && lesson.order <= 105) {
          moduleNum = '7'
        } else if (lesson.order >= 106 && lesson.order <= 117) {
          moduleNum = '8'
        } else if (lesson.order >= 118 && lesson.order <= 127) {
          moduleNum = '9'
        } else if (lesson.order >= 128 && lesson.order <= 137) {
          moduleNum = '10'
        }
      } else if (isUPSCinterviewPersonality) {
        // UPSC Interview Personality Test: use order ranges (6 modules)
        // Module 1: orders 1-8 (Orientation & Strategy)
        // Module 2: orders 9-24 (DAF Analysis)
        // Module 3: orders 25-42 (Current Affairs Mastery)
        // Module 4: orders 43-58 (Communication & Personality)
        // Module 5: orders 59-79 (Mock Interviews & Feedback)
        // Module 6: orders 80-97 (Advanced Strategies & Ethics)
        if (lesson.order >= 1 && lesson.order <= 8) {
          moduleNum = '1'
        } else if (lesson.order >= 9 && lesson.order <= 24) {
          moduleNum = '2'
        } else if (lesson.order >= 25 && lesson.order <= 42) {
          moduleNum = '3'
        } else if (lesson.order >= 43 && lesson.order <= 58) {
          moduleNum = '4'
        } else if (lesson.order >= 59 && lesson.order <= 79) {
          moduleNum = '5'
        } else if (lesson.order >= 80 && lesson.order <= 97) {
          moduleNum = '6'
        }
      } else if (isAdvancedAnswerWriting) {
        // Advanced Answer Writing Mastery: use order ranges (6 modules)
        // Module 1: orders 1-10 (Orientation & Strategy)
        // Module 2: orders 11-24 (Analytical & Multi-Dimensional)
        // Module 3: orders 25-36 (Current Affairs Integration)
        // Module 4: orders 37-52 (Optional Subject Answer Writing)
        // Module 5: orders 53-68 (Essay & Ethics Mastery)
        // Module 6: orders 69-83 (Mock Tests & Improvement)
        if (lesson.order >= 1 && lesson.order <= 10) {
          moduleNum = '1'
        } else if (lesson.order >= 11 && lesson.order <= 24) {
          moduleNum = '2'
        } else if (lesson.order >= 25 && lesson.order <= 36) {
          moduleNum = '3'
        } else if (lesson.order >= 37 && lesson.order <= 52) {
          moduleNum = '4'
        } else if (lesson.order >= 53 && lesson.order <= 68) {
          moduleNum = '5'
        } else if (lesson.order >= 69 && lesson.order <= 83) {
          moduleNum = '6'
        }
      } else if (isSSCCHSL) {
        // SSC CHSL (10+2) Complete Preparation: use order ranges (5 modules)
        // Module 1: orders 1-18 (Quantitative Aptitude)
        // Module 2: orders 19-36 (Reasoning & Logical Ability)
        // Module 3: orders 37-56 (English Language & Comprehension)
        // Module 4: orders 57-76 (General Awareness & Current Affairs)
        // Module 5: orders 77-92 (Mock Tests, Tips & Exam Strategy)
        if (lesson.order >= 1 && lesson.order <= 18) {
          moduleNum = '1'
        } else if (lesson.order >= 19 && lesson.order <= 36) {
          moduleNum = '2'
        } else if (lesson.order >= 37 && lesson.order <= 56) {
          moduleNum = '3'
        } else if (lesson.order >= 57 && lesson.order <= 76) {
          moduleNum = '4'
        } else if (lesson.order >= 77) {
          moduleNum = '5'
        }
      } else if (isSSCCGL) {
        // SSC CGL Complete Preparation: use order ranges (5 modules)
        // Module 1: orders 1-40 (Quantitative Aptitude)
        // Module 2: orders 41-76 (Reasoning & Logical Ability)
        // Module 3: orders 77-106 (English Language & Comprehension)
        // Module 4: orders 107-136 (General Awareness & Current Affairs)
        // Module 5: orders 137-167 (Mock Tests, Exam Strategy & Tips)
        if (lesson.order >= 1 && lesson.order <= 40) {
          moduleNum = '1'
        } else if (lesson.order >= 41 && lesson.order <= 76) {
          moduleNum = '2'
        } else if (lesson.order >= 77 && lesson.order <= 106) {
          moduleNum = '3'
        } else if (lesson.order >= 107 && lesson.order <= 136) {
          moduleNum = '4'
        } else if (lesson.order >= 137) {
          moduleNum = '5'
        }
      } else if (isSSCMTS) {
        // SSC MTS (Multi-Tasking Staff) Preparation: use order ranges (5 modules)
        // Module 1: orders 1-20 (Quantitative Aptitude)
        // Module 2: orders 21-36 (Reasoning & Logical Ability)
        // Module 3: orders 37-52 (English Language & Comprehension)
        // Module 4: orders 53-66 (General Awareness & Current Affairs)
        // Module 5: orders 67-83 (Mock Tests, Exam Strategy & Tips)
        if (lesson.order >= 1 && lesson.order <= 20) {
          moduleNum = '1'
        } else if (lesson.order >= 21 && lesson.order <= 36) {
          moduleNum = '2'
        } else if (lesson.order >= 37 && lesson.order <= 52) {
          moduleNum = '3'
        } else if (lesson.order >= 53 && lesson.order <= 66) {
          moduleNum = '4'
        } else if (lesson.order >= 67) {
          moduleNum = '5'
        }
      } else if (isStatePolice) {
        // State Police Constable & SI Preparation: use order ranges (6 modules)
        // Module 1: orders 1-25 (General Knowledge & Current Affairs)
        // Module 2: orders 26-55 (Mathematics & Numerical Ability)
        // Module 3: orders 56-80 (Reasoning & Logical Ability)
        // Module 4: orders 81-100 (General Science)
        // Module 5: orders 101-110 (Physical Efficiency & Measurement)
        // Module 6: orders 111-120 (Mock Tests & Previous Year Papers)
        if (lesson.order >= 1 && lesson.order <= 25) {
          moduleNum = '1'
        } else if (lesson.order >= 26 && lesson.order <= 55) {
          moduleNum = '2'
        } else if (lesson.order >= 56 && lesson.order <= 80) {
          moduleNum = '3'
        } else if (lesson.order >= 81 && lesson.order <= 100) {
          moduleNum = '4'
        } else if (lesson.order >= 101 && lesson.order <= 110) {
          moduleNum = '5'
        } else if (lesson.order >= 111) {
          moduleNum = '6'
        }
      } else if (isStateTET) {
        // TET Complete Preparation: use order ranges (7 modules)
        // Module 1: orders 1-7 (TET Exam Orientation & Strategy)
        // Module 2: orders 8-31 (Child Development & Pedagogy)
        // Module 3: orders 32-48 (Language I - Hindi/Regional)
        // Module 4: orders 49-65 (Language II - English)
        // Module 5: orders 66-86 (Mathematics)
        // Module 6: orders 87-107 (Environmental Studies/Social Studies/Science)
        // Module 7: orders 108-115 (Mock Tests, Revision & Final Preparation)
        if (lesson.order >= 1 && lesson.order <= 7) {
          moduleNum = '1'
        } else if (lesson.order >= 8 && lesson.order <= 31) {
          moduleNum = '2'
        } else if (lesson.order >= 32 && lesson.order <= 48) {
          moduleNum = '3'
        } else if (lesson.order >= 49 && lesson.order <= 65) {
          moduleNum = '4'
        } else if (lesson.order >= 66 && lesson.order <= 86) {
          moduleNum = '5'
        } else if (lesson.order >= 87 && lesson.order <= 107) {
          moduleNum = '6'
        } else if (lesson.order >= 108) {
          moduleNum = '7'
        }
      }
      
      if (!moduleLessons[moduleNum]) {
        moduleLessons[moduleNum] = []
      }
      moduleLessons[moduleNum].push(lesson)
    }
    
    // Build modules array
    const modules = Object.entries(moduleLessons).map(([moduleNum, lessons]) => ({
      id: `module-${moduleNum}`,
      title: `Module ${moduleNum}: ${
        isEnglishCourse ? englishModuleNames[moduleNum] : 
        isConstitutionCourse ? constitutionModuleNames[moduleNum] : 
        isPublicSpeakingIntermediate ? publicSpeakingIntermediateModuleNames[moduleNum] :
        isPublicSpeakingAdvanced ? publicSpeakingAdvancedModuleNames[moduleNum] :
        isWebDevBootcamp ? webDevBootcampModuleNames[moduleNum] :
        isPythonMastery ? pythonMasteryModuleNames[moduleNum] :
        isDataScience ? dataScienceModuleNames[moduleNum] :
        isMobileApp ? mobileAppModuleNames[moduleNum] :
        isBusinessStrategy ? businessStrategyModuleNames[moduleNum] :
        isEntrepreneurship ? entrepreneurshipModuleNames[moduleNum] :
        isFinancialManagement ? financialManagementModuleNames[moduleNum] :
        isProjectManagement ? projectManagementModuleNames[moduleNum] :
        isUIUXDesign ? uiuxDesignModuleNames[moduleNum] :
        isGraphicDesign ? graphicDesignModuleNames[moduleNum] :
        isContentCreation ? contentCreationModuleNames[moduleNum] :
        isPhotography ? photographyModuleNames[moduleNum] :
        isDigitalMarketing ? digitalMarketingModuleNames[moduleNum] :
        isSocialMedia ? socialMediaModuleNames[moduleNum] :
        isBrandStrategy ? brandStrategyModuleNames[moduleNum] :
        isInvestmentWealth ? investmentWealthModuleNames[moduleNum] :
        isTaxInsurance ? taxInsuranceModuleNames[moduleNum] :
        isNutritionHealth ? nutritionHealthModuleNames[moduleNum] :
        isFitnessExercise ? fitnessExerciseModuleNames[moduleNum] :
        isMentalHealth ? mentalHealthModuleNames[moduleNum] :
        isEnglishG1 ? englishG1ModuleNames[moduleNum] :
        isMathG2 ? mathG2ModuleNames[moduleNum] :
        isScienceG3 ? scienceG3ModuleNames[moduleNum] :
        isMathG3 ? mathG3ModuleNames[moduleNum] :
        isEnglishLitG4 ? englishLitG4ModuleNames[moduleNum] :
        isMathG4 ? mathG4ModuleNames[moduleNum] :
        isScienceG5 ? scienceG5ModuleNames[moduleNum] :
        isMathG6 ? mathG6ModuleNames[moduleNum] :
        isScienceG6 ? scienceG6ModuleNames[moduleNum] :
        isEnglishLitG7 ? englishLitG7ModuleNames[moduleNum] :
        isMathG7 ? mathG7ModuleNames[moduleNum] :
        isScienceG8 ? scienceG8ModuleNames[moduleNum] :
        isMathG9 ? mathG9ModuleNames[moduleNum] :
        isPhysicsG9 ? physicsG9ModuleNames[moduleNum] :
        isChemistryG10 ? chemistryG10ModuleNames[moduleNum] :
        isBiologyG10 ? biologyG10ModuleNames[moduleNum] :
        isMathG10 ? mathG10ModuleNames[moduleNum] :
        isMathG11 ? mathG11ModuleNames[moduleNum] :
        isPhysicsG11 ? physicsG11ModuleNames[moduleNum] :
        isChemistryG11 ? chemistryG11ModuleNames[moduleNum] :
        isBiologyG12 ? biologyG12ModuleNames[moduleNum] :
        isProgrammingFundamentals ? programmingFundamentalsModuleNames[moduleNum] :
        isEngineeringPhysics ? engineeringPhysicsModuleNames[moduleNum] :
        isDigitalElectronics ? digitalElectronicsModuleNames[moduleNum] :
        isHumanAnatomy ? humanAnatomyModuleNames[moduleNum] :
        isBiochemistry ? biochemistryModuleNames[moduleNum] :
        isPhysiology ? physiologyModuleNames[moduleNum] :
        isMedicalResearch ? medicalResearchModuleNames[moduleNum] :
        isBusinessEconomics ? businessEconomicsModuleNames[moduleNum] :
        isAccountingPrinciples ? accountingPrinciplesModuleNames[moduleNum] :
        isBusinessStatistics ? businessStatisticsModuleNames[moduleNum] :
        isMarketingFundamentals ? marketingFundamentalsModuleNames[moduleNum] :
        isWorldLiterature ? worldLiteratureModuleNames[moduleNum] :
        isPhilosophyBasics ? philosophyBasicsModuleNames[moduleNum] :
        isHistoryOfArt ? historyOfArtModuleNames[moduleNum] :
        isCommunicationSkills ? communicationSkillsModuleNames[moduleNum] :
        isCommerceBasics ? commerceBasicsModuleNames[moduleNum] :
        isCAFoundation ? caFoundationModuleNames[moduleNum] :
        isCAIntermediate ? caIntermediateModuleNames[moduleNum] :
        isCAFinal ? caFinalModuleNames[moduleNum] :
        isCSExecutive ? csExecutiveModuleNames[moduleNum] :
        isCSFoundation ? csFoundationModuleNames[moduleNum] :
        isCSProfessional ? csProfessionalModuleNames[moduleNum] :
        isCMAFoundation ? cmaFoundationModuleNames[moduleNum] :
        isCMAIntermediate ? cmaIntermediateModuleNames[moduleNum] :
        isCMAFinal ? cmaFinalModuleNames[moduleNum] :
        isCFALevel1 ? cfaLevel1ModuleNames[moduleNum] :
        isCFALevel2 ? cfaLevel2ModuleNames[moduleNum] :
        isCFALevel3 ? cfaLevel3ModuleNames[moduleNum] :
        isFRMPart1 ? frmPart1ModuleNames[moduleNum] :
        isFRMPart2 ? frmPart2ModuleNames[moduleNum] :
        isUSCMAPart1 ? usCMAPart1ModuleNames[moduleNum] :
        isUSCMAPart2 ? usCMAPart2ModuleNames[moduleNum] :
        isUSCPA ? usCPAModuleNames[moduleNum] :
        isACCALevel1 ? accaLevel1ModuleNames[moduleNum] :
        isACCALevel2 ? accaLevel2ModuleNames[moduleNum] :
        isACCALevel3 ? accaLevel3ModuleNames[moduleNum] :
        isSchoolPrimary1_5 ? schoolPrimary1_5ModuleNames[moduleNum] :
        isSchoolPrimary6_8 ? schoolPrimary6_8ModuleNames[moduleNum] :
        isSchoolSecondary9_10 ? schoolSecondary9_10ModuleNames[moduleNum] :
        isSchoolSeniorScience ? schoolSeniorScienceModuleNames[moduleNum] :
        isSchoolSeniorCommerce ? schoolSeniorCommerceModuleNames[moduleNum] :
        isSchoolSeniorArts ? schoolSeniorArtsModuleNames[moduleNum] :
        isSchoolExamPrep ? schoolExamPrepModuleNames[moduleNum] :
        isSchoolSkills ? schoolSkillsModuleNames[moduleNum] :
        isCollegeBscPcm ? collegeBscPcmModuleNames[moduleNum] :
        isCollegeBscPcb ? collegeBscPcbModuleNames[moduleNum] :
        isCollegeBscCs ? collegeBscCsModuleNames[moduleNum] :
        isCollegeBscBio ? collegeBscBioModuleNames[moduleNum] :
        isCollegeBscStats ? collegeBscStatsModuleNames[moduleNum] :
        isCollegeBcom ? collegeBcomModuleNames[moduleNum] :
        isCollegeBba ? collegeBbaModuleNames[moduleNum] :
        isCollegeBaHistory ? collegeBaHistoryModuleNames[moduleNum] :
        isCollegeBaPolsc ? collegeBaPolscModuleNames[moduleNum] :
        isCollegeBaPsychology ? collegeBaPsychologyModuleNames[moduleNum] :
        isCollegeBtechCs ? collegeBtechCsModuleNames[moduleNum] :
        isCollegeLlB ? collegeLlBModuleNames[moduleNum] :
        isCollegeSemesterSupport ? collegeSemesterSupportModuleNames[moduleNum] :
        isCollegeExamPrep ? collegeExamPrepModuleNames[moduleNum] :
        isCollegeCareerSkills ? collegeCareerSkillsModuleNames[moduleNum] :
        isActuarialScience ? actuarialScienceModuleNames[moduleNum] :
        isAdvancedExcel ? advancedExcelModuleNames[moduleNum] :
        isStockMarketBasics ? stockMarketBasicsModuleNames[moduleNum] :
        isOptionsTradingMastery ? optionsTradingMasteryModuleNames[moduleNum] :
        isTechnicalAnalysisMaster ? technicalAnalysisMasterModuleNames[moduleNum] :
        isPriceActionTrading ? priceActionTradingModuleNames[moduleNum] :
        isRiskManagementMasterclass ? riskManagementMasterclassModuleNames[moduleNum] :
        isNoCodeAlgoTrading ? noCodeAlgoTradingModuleNames[moduleNum] :
        isMutualFundsSipMastery ? mutualFundsSipMasteryModuleNames[moduleNum] :
        isUPSCcivilServicesPrelims ? upscCivilServicesPrelimsModuleNames[moduleNum] :
        isUPSCcivilServicesMains ? upscCivilServicesMainsModuleNames[moduleNum] :
        isUPSCinterviewPersonality ? upscInterviewPersonalityModuleNames[moduleNum] :
        isAdvancedAnswerWriting ? advancedAnswerWritingModuleNames[moduleNum] :
        isSSCCHSL ? sscCHSLModuleNames[moduleNum] :
        isSSCCGL ? sscCGLModuleNames[moduleNum] :
        isSSCMTS ? sscMTSModuleNames[moduleNum] :
        isStatePolice ? statePoliceModuleNames[moduleNum] :
        isStateTET ? stateTETModuleNames[moduleNum] :
        'Module ' + moduleNum
      }`,
      order: parseInt(moduleNum),
      lessons: lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        duration: lesson.duration,
        order: lesson.order,
        type: 'video' as const,
        isFree: false,
        videoUrl: lesson.videoUrl,
        content: lesson.content,
      })).sort((a, b) => a.order - b.order),
    })).sort((a, b) => a.order - b.order)

    // Generate assessments based on lessons
    const assessments = course.lessons.length > 0 ? [
      {
        id: `assess-${courseId}-1`,
        title: 'Chapter Quiz',
        type: 'QUIZ',
        lessonId: course.lessons[0]?.id
      },
      {
        id: `assess-${courseId}-2`,
        title: 'Final Assessment',
        type: 'PRACTICE'
      }
    ] : []

    return NextResponse.json({
      success: true,
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        longDescription: course.description, // Using description as longDescription for now
        thumbnail: course.thumbnail,
        difficulty: course.difficulty,
        duration: course.duration,
        pricing: {
          type: 'subscription',
          price: 99,
          currency: 'INR',
          period: 'month',
          description: 'Subscribe at INR 99/month to access all courses',
        },
        rating: 4.5, // Default rating
        reviewCount: 100, // Default review count
        tagline: `Master ${course.title} with our comprehensive course`,
        language: 'Hindi',
        instructor: course.instructor,
        learningPath: course.learningPath,
        modules: modules,
        lessons: course.lessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
          order: lesson.order,
          type: 'video' as const,
          isLocked: true, // All lessons require subscription
          videoUrl: lesson.videoUrl,
          content: lesson.content,
        })),
        lessonCount: course._count.lessons,
        moduleCount: modules.length,
        assessments: assessments,
        totalLessons: course._count.lessons,
        totalAssessments: assessments.length,
        enrollmentCount: course._count.progress || 0,
        outcomes: [
          `Understand ${course.title} fundamentals`,
          `Build real-world projects`,
          `Apply concepts in practical scenarios`,
          `Gain confidence in ${course.title}`,
        ],
        requirements: [
          'Basic understanding of the subject',
          'A computer with internet access',
          'Willingness to learn',
        ],
        createdAt: course.createdAt,
        updatedAt: new Date().toISOString(),
      }
    })

  } catch (error) {
    console.error('Get course error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}