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