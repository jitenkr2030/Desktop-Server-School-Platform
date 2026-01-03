import { db } from '@/lib/db'

async function populateCareerCoursesPart2() {
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

    // Course 7: career10 - Graphic Design Fundamentals (INTERMEDIATE, 680 min)
    const graphicDesignLessons = []
    for (let m = 1; m <= 10; m++) {
      for (let l = 1; l <= 20; l++) {
        const topics = [
          'Design Fundamentals',
          'Typography',
          'Color Theory',
          'Layout & Composition',
          'Photoshop Mastery',
          'Illustrator Mastery',
          'Logo Design',
          'Print Design',
          'Digital Design',
          'Design Portfolio Capstone',
        ]
        graphicDesignLessons.push(createLesson('career10', m, l, topics[m-1], topics[m-1], 34))
      }
    }

    // Course 8: career11 - Content Creation & Video Editing (INTERMEDIATE, 700 min)
    const contentCreationLessons = []
    for (let m = 1; m <= 10; m++) {
      for (let l = 1; l <= 20; l++) {
        const topics = [
          'Content Strategy',
          'Scriptwriting',
          'Videography Basics',
          'Audio Production',
          'Premiere Pro',
          'DaVinci Resolve',
          'Motion Graphics',
          'Visual Effects',
          'Content Distribution',
          'Video Production Capstone',
        ]
        contentCreationLessons.push(createLesson('career11', m, l, topics[m-1], topics[m-1], 35))
      }
    }

    // Course 9: career12 - Photography & Digital Art (INTERMEDIATE, 720 min)
    const photographyLessons = []
    for (let m = 1; m <= 10; m++) {
      for (let l = 1; l <= 20; l++) {
        const topics = [
          'Photography Fundamentals',
          'Exposure & Lighting',
          'Composition',
          'Portrait Photography',
          'Landscape Photography',
          'Lightroom Mastery',
          'Advanced Editing',
          'Studio Photography',
          'Photo Business',
          'Photography Portfolio Capstone',
        ]
        photographyLessons.push(createLesson('career12', m, l, topics[m-1], topics[m-1], 36))
      }
    }

    // Course 10: career13 - Digital Marketing Mastery (INTERMEDIATE, 740 min)
    const digitalMarketingLessons = []
    for (let m = 1; m <= 10; m++) {
      for (let l = 1; l <= 20; l++) {
        const topics = [
          'Digital Marketing Fundamentals',
          'SEO Mastery',
          'PPC Advertising',
          'Social Media Marketing',
          'Email Marketing',
          'Content Marketing',
          'Marketing Analytics',
          'Conversion Optimization',
          'Marketing Automation',
          'Digital Marketing Capstone',
        ]
        digitalMarketingLessons.push(createLesson('career13', m, l, topics[m-1], topics[m-1], 37))
      }
    }

    // Course 11: career15 - Social Media Management (INTERMEDIATE, 780 min)
    const socialMediaLessons = []
    for (let m = 1; m <= 10; m++) {
      for (let l = 1; l <= 20; l++) {
        const topics = [
          'Social Media Strategy',
          'Platform Mastery',
          'Content Creation',
          'Community Management',
          'Influencer Marketing',
          'Social Advertising',
          'Social Analytics',
          'Crisis Management',
          'Social Media Tools',
          'Social Media Capstone',
        ]
        socialMediaLessons.push(createLesson('career15', m, l, topics[m-1], topics[m-1], 39))
      }
    }

    // Course 12: career16 - Brand Strategy & Management (ADVANCED, 800 min)
    const brandStrategyLessons = []
    for (let m = 1; m <= 10; m++) {
      for (let l = 1; l <= 20; l++) {
        const topics = [
          'Brand Fundamentals',
          'Brand Strategy',
          'Brand Identity Design',
          'Brand Messaging',
          'Brand Experience',
          'Digital Branding',
          'Brand Equity Management',
          'Rebranding',
          'Brand Governance',
          'Brand Strategy Capstone',
        ]
        brandStrategyLessons.push(createLesson('career16', m, l, topics[m-1], topics[m-1], 40))
      }
    }

    // Insert all lessons for courses 7-12
    console.log('Creating lessons for career10, career11, career12, career13, career15, career16...')
    console.log(`Graphic Design: ${graphicDesignLessons.length} lessons`)
    console.log(`Content Creation: ${contentCreationLessons.length} lessons`)
    console.log(`Photography: ${photographyLessons.length} lessons`)
    console.log(`Digital Marketing: ${digitalMarketingLessons.length} lessons`)
    console.log(`Social Media: ${socialMediaLessons.length} lessons`)
    console.log(`Brand Strategy: ${brandStrategyLessons.length} lessons`)
    
    // Delete existing lessons for these courses first
    await db.lesson.deleteMany({
      where: {
        courseId: { in: ['career10', 'career11', 'career12', 'career13', 'career15', 'career16'] }
      }
    })
    console.log('Deleted existing lessons')

    // Insert new lessons in batches
    const allCourseLessons = [
      graphicDesignLessons,
      contentCreationLessons,
      photographyLessons,
      digitalMarketingLessons,
      socialMediaLessons,
      brandStrategyLessons,
    ]

    let totalCreated = 0
    for (const courseLessons of allCourseLessons) {
      for (const lesson of courseLessons) {
        await db.lesson.create({ data: lesson })
        totalCreated++
      }
      console.log(`Created ${totalCreated} lessons so far...`)
    }

    console.log(`\n✓ Successfully created ${totalCreated} lessons for courses career10, career11, career12, career13, career15, career16`)

  } catch (error) {
    console.error('Error:', error)
    throw error
  } finally {
    await db.$disconnect()
  }
}

populateCareerCoursesPart2()
