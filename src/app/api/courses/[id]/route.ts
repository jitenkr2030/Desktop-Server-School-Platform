import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id

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