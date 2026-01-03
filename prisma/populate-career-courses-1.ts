import { db } from '@/lib/db'

async function populateCareerCourses() {
  try {
    const instructorId = 'inst_1' // Default instructor
    
    // Helper function to create lesson data
    const createLesson = (courseId: string, moduleNum: number, lessonNum: number, topic: string, description: string, duration: number) => ({
      courseId,
      title: `${topic} Lesson ${lessonNum}`,
      content: `Comprehensive lesson covering ${description.toLowerCase()}. This lesson provides in-depth knowledge with practical examples, real-world applications, hands-on exercises, and expert insights to help learners master the subject matter effectively.`,
      duration,
      order: moduleNum * 100 + lessonNum,
      videoUrl: 'https://example.com/video',
      isActive: true,
    })

    // Course 1: career3 - Data Science Fundamentals (ADVANCED, 540 min)
    const dataScienceLessons = []
    for (let m = 1; m <= 10; m++) {
      for (let l = 1; l <= 20; l++) {
        const topics = [
          'Statistics & Probability',
          'Python for Data Science',
          'Data Wrangling',
          'Exploratory Data Analysis',
          'Machine Learning Basics',
          'Supervised Learning',
          'Unsupervised Learning',
          'Deep Learning',
          'Natural Language Processing',
          'Data Science Capstone',
        ]
        dataScienceLessons.push(createLesson('career3', m, l, topics[m-1], topics[m-1], 27))
      }
    }

    // Course 2: career4 - Mobile App Development (ADVANCED, 560 min)
    const mobileAppLessons = []
    for (let m = 1; m <= 10; m++) {
      for (let l = 1; l <= 20; l++) {
        const topics = [
          'Mobile Development Fundamentals',
          'iOS Development',
          'Android Development',
          'Cross-Platform Development',
          'Mobile UI/UX',
          'Mobile Data Storage',
          'Mobile Testing',
          'App Deployment',
          'Mobile Optimization',
          'Mobile App Capstone',
        ]
        mobileAppLessons.push(createLesson('career4', m, l, topics[m-1], topics[m-1], 28))
      }
    }

    // Course 3: career5 - Business Strategy Mastery (INTERMEDIATE, 580 min)
    const businessStrategyLessons = []
    for (let m = 1; m <= 10; m++) {
      for (let l = 1; l <= 20; l++) {
        const topics = [
          'Strategic Thinking',
          'Competitive Analysis',
          'Business Models',
          'Market Entry Strategies',
          'Growth Strategies',
          'Strategic Partnerships',
          'Innovation Strategy',
          'Corporate Strategy',
          'Strategy Execution',
          'Strategy Capstone',
        ]
        businessStrategyLessons.push(createLesson('career5', m, l, topics[m-1], topics[m-1], 29))
      }
    }

    // Course 4: career6 - Entrepreneurship Essentials (INTERMEDIATE, 600 min)
    const entrepreneurshipLessons = []
    for (let m = 1; m <= 10; m++) {
      for (let l = 1; l <= 20; l++) {
        const topics = [
          'Entrepreneurial Mindset',
          'Opportunity Identification',
          'Business Planning',
          'Startup Funding',
          'Team Building',
          'Product Development',
          'Startup Marketing',
          'Startup Legal',
          'Scaling Business',
          'Startup Capstone',
        ]
        entrepreneurshipLessons.push(createLesson('career6', m, l, topics[m-1], topics[m-1], 30))
      }
    }

    // Course 5: career7 - Financial Management (ADVANCED, 620 min)
    const financialManagementLessons = []
    for (let m = 1; m <= 10; m++) {
      for (let l = 1; l <= 20; l++) {
        const topics = [
          'Financial Fundamentals',
          'Financial Analysis',
          'Budgeting & Forecasting',
          'Investment Analysis',
          'Risk Management',
          'Corporate Finance',
          'Working Capital Management',
          'Mergers & Acquisitions',
          'International Finance',
          'Finance Capstone',
        ]
        financialManagementLessons.push(createLesson('career7', m, l, topics[m-1], topics[m-1], 31))
      }
    }

    // Course 6: career8 - Project Management (INTERMEDIATE, 640 min)
    const projectManagementLessons = []
    for (let m = 1; m <= 10; m++) {
      for (let l = 1; l <= 20; l++) {
        const topics = [
          'PM Fundamentals',
          'Project Planning',
          'Agile Methodologies',
          'Risk & Quality Management',
          'Team Leadership',
          'Stakeholder Management',
          'Project Execution',
          'PM Tools & Software',
          'PMO & Governance',
          'PM Capstone',
        ]
        projectManagementLessons.push(createLesson('career8', m, l, topics[m-1], topics[m-1], 32))
      }
    }

    // Insert all lessons for courses 1-6
    console.log('Creating lessons for career3-8...')
    console.log(`Data Science: ${dataScienceLessons.length} lessons`)
    console.log(`Mobile App: ${mobileAppLessons.length} lessons`)
    console.log(`Business Strategy: ${businessStrategyLessons.length} lessons`)
    console.log(`Entrepreneurship: ${entrepreneurshipLessons.length} lessons`)
    console.log(`Financial Management: ${financialManagementLessons.length} lessons`)
    console.log(`Project Management: ${projectManagementLessons.length} lessons`)
    
    // Delete existing lessons for these courses first
    await db.lesson.deleteMany({
      where: {
        courseId: { in: ['career3', 'career4', 'career5', 'career6', 'career7', 'career8'] }
      }
    })
    console.log('Deleted existing lessons')

    // Insert new lessons in batches
    const allCourseLessons = [
      dataScienceLessons,
      mobileAppLessons,
      businessStrategyLessons,
      entrepreneurshipLessons,
      financialManagementLessons,
      projectManagementLessons,
    ]

    let totalCreated = 0
    for (const courseLessons of allCourseLessons) {
      for (const lesson of courseLessons) {
        await db.lesson.create({ data: lesson })
        totalCreated++
      }
      console.log(`Created ${totalCreated} lessons so far...`)
    }

    console.log(`\n✓ Successfully created ${totalCreated} lessons for courses career3-8`)

  } catch (error) {
    console.error('Error:', error)
    throw error
  } finally {
    await db.$disconnect()
  }
}

populateCareerCourses()
