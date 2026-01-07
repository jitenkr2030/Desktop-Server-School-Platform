import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting to seed UPSC Civil Services Mains Complete Preparation...')

  const courseId = 'upsc_mains'

  // Check if course already exists
  const existingCourse = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        orderBy: { order: 'asc' }
      }
    }
  })

  if (existingCourse) {
    console.log(`⚠️ Course "${courseId}" already exists with ${existingCourse.lessons?.length || 0} lessons.`)
    console.log('🗑️ Deleting old lessons and course to recreate with proper structure...')
    
    // Delete associated lessons first
    await prisma.lesson.deleteMany({
      where: { courseId: courseId },
    })
    
    // Delete the course
    await prisma.course.delete({
      where: { id: courseId },
    })
    
    console.log('🗑️ Old course data deleted.')
  }

  // Find existing instructor
  const instructor = await prisma.instructor.findFirst({
    where: { isActive: true },
  })
  
  const instructorId = instructor?.id || 'inst-competitive-exams'

  // Create the course
  const course = await prisma.course.upsert({
    where: { id: courseId },
    update: {},
    create: {
      id: courseId,
      title: 'UPSC Civil Services Mains Complete Preparation',
      description: 'Master the UPSC Civil Services Mains examination with comprehensive coverage of General Studies I-IV, optional subjects, answer writing practice, essay mastery, and exam strategy.',
      thumbnail: '/assets/courses/upsc_mains.svg',
      difficulty: 'ADVANCED',
      duration: 8000, // 133+ hours in minutes
      instructorId: instructorId,
    },
  })

  console.log(`✅ Course created: ${course.title}`)

  // Create modules and lessons based on the user's detailed curriculum
  const modules = [
    {
      moduleNum: 1,
      title: 'Mains Exam Orientation & Strategy',
      duration: 300, // 5 hours
      lessons: [
        { title: 'UPSC Mains Exam Structure & Scoring', duration: 30, order: 1 },
        { title: 'GS Papers Overview & Marks Allocation', duration: 30, order: 2 },
        { title: 'Optional Subject Selection Strategy', duration: 30, order: 3 },
        { title: 'Time Management for Preparation & Writing', duration: 30, order: 4 },
        { title: 'Common Mistakes & Success Habits', duration: 30, order: 5 },
        { title: 'Understanding the Marking Scheme', duration: 30, order: 6 },
        { title: 'Prelims to Mains Transition', duration: 30, order: 7 },
        { title: 'Creating a Mains Preparation Timeline', duration: 30, order: 8 },
      ]
    },
    {
      moduleNum: 2,
      title: 'General Studies Paper I – History, Culture & Society',
      duration: 1080, // 18 hours
      lessons: [
        { title: 'Ancient India - Key Concepts', duration: 45, order: 9 },
        { title: 'Medieval India - Important Topics', duration: 45, order: 10 },
        { title: 'Modern India - Freedom Struggle', duration: 45, order: 11 },
        { title: 'Post-Independence India', duration: 45, order: 12 },
        { title: 'Art & Culture - Heritage Sites', duration: 45, order: 13 },
        { title: 'Indian Art Forms - Painting & Architecture', duration: 45, order: 14 },
        { title: 'Society - Demographics & Population', duration: 45, order: 15 },
        { title: 'Social Issues - Poverty, Inequality', duration: 45, order: 16 },
        { title: 'Social Justice & Empowerment', duration: 45, order: 17 },
        { title: 'Diversity & Communalism', duration: 45, order: 18 },
        { title: 'Role of Women & Child Welfare', duration: 45, order: 19 },
        { title: 'Globalization & Social Change', duration: 45, order: 20 },
        { title: 'PYQs - History & Culture', duration: 45, order: 21 },
        { title: 'Answer Writing Practice - Paper I', duration: 45, order: 22 },
        { title: 'Model Answers - History Questions', duration: 45, order: 23 },
        { title: 'Model Answers - Society Questions', duration: 45, order: 24 },
      ]
    },
    {
      moduleNum: 3,
      title: 'General Studies Paper II – Governance, Polity & International Relations',
      duration: 1080, // 18 hours
      lessons: [
        { title: 'Indian Constitution - Key Features', duration: 45, order: 25 },
        { title: 'Fundamental Rights & Duties', duration: 45, order: 26 },
        { title: 'Parliament & Legislative Process', duration: 45, order: 27 },
        { title: 'Executive - President, PM & Council', duration: 45, order: 28 },
        { title: 'Judiciary - Supreme Court & High Courts', duration: 45, order: 29 },
        { title: 'State Governments & Federalism', duration: 45, order: 30 },
        { title: 'Local Governance - Panchayats & Municipalities', duration: 45, order: 31 },
        { title: 'Constitutional Bodies & Commissions', duration: 45, order: 32 },
        { title: 'Public Policy & Rights-Based Schemes', duration: 45, order: 33 },
        { title: 'Governance & e-Governance', duration: 45, order: 34 },
        { title: 'International Relations Basics', duration: 45, order: 35 },
        { title: 'India\'s Bilateral Relations', duration: 45, order: 36 },
        { title: 'India\'s Multilateral Engagement', duration: 45, order: 37 },
        { title: 'Current Affairs Integration - Polity', duration: 45, order: 38 },
        { title: 'Case Studies - Governance', duration: 45, order: 39 },
        { title: 'Answer Writing Practice - Paper II', duration: 45, order: 40 },
      ]
    },
    {
      moduleNum: 4,
      title: 'General Studies Paper III – Economy, Environment & Technology',
      duration: 1080, // 18 hours
      lessons: [
        { title: 'Indian Economy - Basic Concepts', duration: 45, order: 41 },
        { title: 'Economic Reforms & Liberalization', duration: 45, order: 42 },
        { title: 'Growth & Development Indicators', duration: 45, order: 43 },
        { title: 'Agriculture - Issues & Policies', duration: 45, order: 44 },
        { title: 'Industry - Make in India', duration: 45, order: 45 },
        { title: 'Infrastructure - Energy, Transport', duration: 45, order: 46 },
        { title: 'Environment - Ecosystem & Biodiversity', duration: 45, order: 47 },
        { title: 'Climate Change & International Agreements', duration: 45, order: 48 },
        { title: 'Environmental Pollution & Conservation', duration: 45, order: 49 },
        { title: 'Science & Technology Basics', duration: 45, order: 50 },
        { title: 'IT, Space & Defense Technology', duration: 45, order: 51 },
        { title: 'Biotechnology & Health Technology', duration: 45, order: 52 },
        { title: 'Government Schemes - Economy', duration: 45, order: 53 },
        { title: 'Current Affairs - Economy & Environment', duration: 45, order: 54 },
        { title: 'Analytical Answer Writing - Paper III', duration: 45, order: 55 },
        { title: 'Model Answers - Economy Questions', duration: 45, order: 56 },
      ]
    },
    {
      moduleNum: 5,
      title: 'General Studies Paper IV – Ethics, Integrity & Aptitude',
      duration: 720, // 12 hours
      lessons: [
        { title: 'Ethics - Philosophical Foundations', duration: 45, order: 57 },
        { title: 'Ethical Theories & Concepts', duration: 45, order: 58 },
        { title: 'Indian Ethics & Moral Thinkers', duration: 45, order: 59 },
        { title: 'Ethics in Governance', duration: 45, order: 60 },
        { title: 'Case Studies - Ethics & Integrity', duration: 45, order: 61 },
        { title: 'Emotional Intelligence', duration: 45, order: 62 },
        { title: 'Leadership & Team Management', duration: 45, order: 63 },
        { title: 'Moral Dilemmas - Analysis', duration: 45, order: 64 },
        { title: 'Value-Based Questions', duration: 45, order: 65 },
        { title: 'Attitude & Aptitude', duration: 45, order: 66 },
        { title: 'Probity in Governance', duration: 45, order: 67 },
        { title: 'Answer Writing - Ethics Paper', duration: 45, order: 68 },
      ]
    },
    {
      moduleNum: 6,
      title: 'Essay Writing Mastery',
      duration: 600, // 10 hours
      lessons: [
        { title: 'Essay Structure & Planning', duration: 45, order: 69 },
        { title: 'Understanding Essay Types', duration: 45, order: 70 },
        { title: 'Issue-Based Essays', duration: 45, order: 71 },
        { title: 'Perspective-Based Essays', duration: 45, order: 72 },
        { title: 'Current Affairs Essay Integration', duration: 45, order: 73 },
        { title: 'Introduction Writing Techniques', duration: 45, order: 74 },
        { title: 'Body Paragraph Development', duration: 45, order: 75 },
        { title: 'Conclusion Writing', duration: 45, order: 76 },
        { title: 'Time-Bound Essay Writing', duration: 45, order: 77 },
        { title: 'Sample Essays - High Scoring', duration: 45, order: 78 },
        { title: 'Essay Evaluation Criteria', duration: 45, order: 79 },
        { title: 'Common Essay Mistakes to Avoid', duration: 45, order: 80 },
      ]
    },
    {
      moduleNum: 7,
      title: 'Optional Subject Guidance',
      duration: 1800, // 30 hours
      lessons: [
        { title: 'Overview of Popular Optional Subjects', duration: 45, order: 81 },
        { title: 'Subject Selection Strategy', duration: 45, order: 82 },
        { title: 'Syllabus Mapping - Optional', duration: 45, order: 83 },
        { title: 'Resource Management - Optional', duration: 45, order: 84 },
        { title: 'Answer Writing Framework - Optional', duration: 45, order: 85 },
        { title: 'PYQs Analysis - Optional', duration: 45, order: 86 },
        { title: 'Trend Analysis - Optional Papers', duration: 45, order: 87 },
        { title: 'Time Allocation for Optional', duration: 45, order: 88 },
        { title: 'Common Mistakes in Optional', duration: 45, order: 89 },
        { title: 'Optional Subject - Subject Specific 1', duration: 45, order: 90 },
        { title: 'Optional Subject - Subject Specific 2', duration: 45, order: 91 },
        { title: 'Optional Subject - Subject Specific 3', duration: 45, order: 92 },
        { title: 'Optional Subject - Subject Specific 4', duration: 45, order: 93 },
        { title: 'Optional Subject - Subject Specific 5', duration: 45, order: 94 },
        { title: 'Optional Subject - Subject Specific 6', duration: 45, order: 95 },
        { title: 'Optional Subject - Subject Specific 7', duration: 45, order: 96 },
        { title: 'Optional Subject - Subject Specific 8', duration: 45, order: 97 },
        { title: 'Optional Subject - Subject Specific 9', duration: 45, order: 98 },
        { title: 'Optional Subject - Subject Specific 10', duration: 45, order: 99 },
        { title: 'Optional Subject - Subject Specific 11', duration: 45, order: 100 },
        { title: 'Optional Subject - Subject Specific 12', duration: 45, order: 101 },
        { title: 'Optional Subject - Subject Specific 13', duration: 45, order: 102 },
        { title: 'Optional Subject - Subject Specific 14', duration: 45, order: 103 },
        { title: 'Optional Subject - Subject Specific 15', duration: 45, order: 104 },
        { title: 'Optional Subject - Subject Specific 16', duration: 45, order: 105 },
      ]
    },
    {
      moduleNum: 8,
      title: 'Answer Writing Techniques',
      duration: 600, // 10 hours
      lessons: [
        { title: 'Structuring Answers for Marks', duration: 45, order: 106 },
        { title: 'Introduction-Body-Conclusion Framework', duration: 45, order: 107 },
        { title: 'Diagrams & Flowcharts Integration', duration: 45, order: 108 },
        { title: 'Data Interpretation in Answers', duration: 45, order: 109 },
        { title: 'Time Management & Writing Speed', duration: 45, order: 110 },
        { title: 'Keywords & Terminology Usage', duration: 45, order: 111 },
        { title: 'Peer Evaluation Methods', duration: 45, order: 112 },
        { title: 'Self-Assessment Techniques', duration: 45, order: 113 },
        { title: 'Answer Length Optimization', duration: 45, order: 114 },
        { title: 'Handling Different Question Types', duration: 45, order: 115 },
        { title: 'Case Study Answer Format', duration: 45, order: 116 },
        { title: 'Map & Diagram Practice', duration: 45, order: 117 },
      ]
    },
    {
      moduleNum: 9,
      title: 'Current Affairs Integration & Case Studies',
      duration: 480, // 8 hours
      lessons: [
        { title: 'Linking Current Affairs to Static Syllabus', duration: 45, order: 118 },
        { title: 'Case Studies for GS Papers', duration: 45, order: 119 },
        { title: 'Policy Evaluation Framework', duration: 45, order: 120 },
        { title: 'Government Schemes Analysis', duration: 45, order: 121 },
        { title: 'International Events & India', duration: 45, order: 122 },
        { title: 'Economic Reforms Current Affairs', duration: 45, order: 123 },
        { title: 'Environmental Current Affairs', duration: 45, order: 124 },
        { title: 'Science & Tech Current Affairs', duration: 45, order: 125 },
        { title: 'Practice Exercises - CA Integration', duration: 45, order: 126 },
        { title: 'Discussion - Recent Events', duration: 45, order: 127 },
      ]
    },
    {
      moduleNum: 10,
      title: 'Revision, Mock Tests & Pre-Exam Strategy',
      duration: 260, // 4h 20m
      lessons: [
        { title: 'Revision Roadmap - 3 Months', duration: 30, order: 128 },
        { title: 'Revision Roadmap - 6 Months', duration: 30, order: 129 },
        { title: 'Full-Length GS Mock Tests', duration: 30, order: 130 },
        { title: 'Mock Test Analysis', duration: 30, order: 131 },
        { title: 'Performance Improvement Plan', duration: 30, order: 132 },
        { title: 'Last-Minute Strategy', duration: 20, order: 133 },
        { title: 'Pre-Exam Checklist', duration: 20, order: 134 },
        { title: 'Confidence Building Techniques', duration: 20, order: 135 },
        { title: 'Managing Exam Stress', duration: 20, order: 136 },
        { title: 'Final Preparation Tips', duration: 20, order: 137 },
      ]
    },
  ]

  // Create all lessons
  let lessonCount = 0
  for (const moduleData of modules) {
    for (const lessonData of moduleData.lessons) {
      await prisma.lesson.create({
        data: {
          title: lessonData.title,
          duration: lessonData.duration,
          order: lessonData.order,
          course: { connect: { id: courseId } },
          content: `Content for ${lessonData.title}`,
          videoUrl: `https://example.com/videos/${courseId}/lesson-${lessonData.order}.mp4`,
        },
      })
      lessonCount++
    }
    console.log(`✅ Created module: ${moduleData.title} (${moduleData.lessons.length} lessons)`)
  }

  console.log(`🎉 Successfully created ${lessonCount} lessons across ${modules.length} modules`)
  console.log('✨ UPSC Civil Services Mains course seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding course:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
