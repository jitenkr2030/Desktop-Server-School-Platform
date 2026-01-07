import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting to seed Advanced Answer Writing Mastery...')

  const courseId = 'advanced-answer-writing-mastery'

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
      title: 'Advanced Answer Writing Mastery',
      description: 'Master answer writing for UPSC Mains, CSAT, and competitive exams with structured frameworks, analytical approaches, current affairs integration, and time management strategies.',
      thumbnail: '/assets/courses/advanced-answer-writing-mastery.svg',
      difficulty: 'ADVANCED',
      duration: 2400, // 40 hours in minutes
      instructorId: instructorId,
    },
  })

  console.log(`✅ Course created: ${course.title}`)

  // Create modules and lessons based on the user's detailed curriculum
  const modules = [
    {
      moduleNum: 1,
      title: 'Orientation & Answer Writing Strategy',
      duration: 300, // 5 hours
      lessons: [
        { title: 'Understanding UPSC Answer Writing Expectations', duration: 30, order: 1 },
        { title: 'Marks Distribution & Evaluation Criteria', duration: 30, order: 2 },
        { title: 'Structuring Introduction Effectively', duration: 30, order: 3 },
        { title: 'Building the Body of Your Answer', duration: 30, order: 4 },
        { title: 'Writing Impactful Conclusions', duration: 30, order: 5 },
        { title: 'Time Management During Exams', duration: 30, order: 6 },
        { title: 'Common Mistakes in Answer Writing', duration: 30, order: 7 },
        { title: 'Pro Tips for High Scoring Answers', duration: 30, order: 8 },
        { title: 'Understanding Word Limit Requirements', duration: 30, order: 9 },
        { title: 'Balancing Theory & Practical Examples', duration: 30, order: 10 },
      ]
    },
    {
      moduleNum: 2,
      title: 'Analytical & Multi-Dimensional Approach',
      duration: 420, // 7 hours
      lessons: [
        { title: 'Answering Multi-Faceted Questions', duration: 30, order: 11 },
        { title: 'Breaking Down Complex Questions', duration: 30, order: 12 },
        { title: 'Using Diagrams in Answers', duration: 30, order: 13 },
        { title: 'Creating Effective Flowcharts', duration: 30, order: 14 },
        { title: 'Tables & Comparative Analysis', duration: 30, order: 15 },
        { title: 'Linking Theory with Real Examples', duration: 30, order: 16 },
        { title: 'Fact-Based Answer Writing', duration: 30, order: 17 },
        { title: 'Opinion-Based vs Balanced Answers', duration: 30, order: 18 },
        { title: 'Integrating Data & Statistics', duration: 30, order: 19 },
        { title: 'Practice with Sample Questions', duration: 30, order: 20 },
        { title: 'Model Answer Analysis', duration: 30, order: 21 },
        { title: 'Self-Evaluation Techniques', duration: 30, order: 22 },
        { title: 'Improving Answer Quality', duration: 30, order: 23 },
        { title: 'Handling Abstract Questions', duration: 30, order: 24 },
      ]
    },
    {
      moduleNum: 3,
      title: 'Current Affairs Integration',
      duration: 360, // 6 hours
      lessons: [
        { title: 'Incorporating National Current Affairs', duration: 30, order: 25 },
        { title: 'International Events in Answers', duration: 30, order: 26 },
        { title: 'Government Schemes & Policies', duration: 30, order: 27 },
        { title: 'Economic Reforms Integration', duration: 30, order: 28 },
        { title: 'Environment Issues & Updates', duration: 30, order: 29 },
        { title: 'Social Sector Developments', duration: 30, order: 30 },
        { title: 'Case Studies & Practical Examples', duration: 30, order: 31 },
        { title: 'Reports & Indices (India & World)', duration: 30, order: 32 },
        { title: 'Practice: Linking Current Affairs', duration: 30, order: 33 },
        { title: 'Static Syllabus + Current Affairs Linkage', duration: 30, order: 34 },
        { title: 'Recent Judgments & Legal Updates', duration: 30, order: 35 },
        { title: 'Science & Technology in Answers', duration: 30, order: 36 },
      ]
    },
    {
      moduleNum: 4,
      title: 'Optional Subject Answer Writing',
      duration: 480, // 8 hours
      lessons: [
        { title: 'Framework for Optional Subjects', duration: 30, order: 37 },
        { title: 'Subject-Specific Techniques', duration: 30, order: 38 },
        { title: 'Science Optional Answer Writing', duration: 30, order: 39 },
        { title: 'Arts/Humanities Optional Answers', duration: 30, order: 40 },
        { title: 'Commerce & Management Answers', duration: 30, order: 41 },
        { title: 'Balancing Analytical vs Descriptive', duration: 30, order: 42 },
        { title: 'Using Diagrams in Optional Papers', duration: 30, order: 43 },
        { title: 'Previous Year Questions Analysis', duration: 30, order: 44 },
        { title: 'PYQ Practice - Subject Specific', duration: 30, order: 45 },
        { title: 'Time Management per Question', duration: 30, order: 46 },
        { title: 'Optional Paper 1 Techniques', duration: 30, order: 47 },
        { title: 'Optional Paper 2 Techniques', duration: 30, order: 48 },
        { title: 'Handling Difficult Questions', duration: 30, order: 49 },
        { title: 'Optional Answer Evaluation', duration: 30, order: 50 },
        { title: 'Improving Optional Paper Score', duration: 30, order: 51 },
        { title: 'Optional Subject Final Tips', duration: 30, order: 52 },
      ]
    },
    {
      moduleNum: 5,
      title: 'Essay & Ethics Answer Mastery',
      duration: 480, // 8 hours
      lessons: [
        { title: 'Structuring Essays Effectively', duration: 30, order: 53 },
        { title: 'Essay Introduction Strategies', duration: 30, order: 54 },
        { title: 'Developing Essay Arguments', duration: 30, order: 55 },
        { title: 'Balanced Essay Perspectives', duration: 30, order: 56 },
        { title: 'Concise Essay Conclusions', duration: 30, order: 57 },
        { title: 'GS-IV Ethics Answer Framework', duration: 30, order: 58 },
        { title: 'Writing Case Study Answers', duration: 30, order: 59 },
        { title: 'Incorporating Examples in Ethics', duration: 30, order: 60 },
        { title: 'Ethical Perspectives in Answers', duration: 30, order: 61 },
        { title: 'Argument-Driven Content', duration: 30, order: 62 },
        { title: 'Time-Bound Essay Practice', duration: 30, order: 63 },
        { title: 'Essay Evaluation Criteria', duration: 30, order: 64 },
        { title: 'Feedback & Improvement', duration: 30, order: 65 },
        { title: 'Model Essay Analysis', duration: 30, order: 66 },
        { title: 'Common Essay Mistakes', duration: 30, order: 67 },
        { title: 'Essay Writing Final Tips', duration: 30, order: 68 },
      ]
    },
    {
      moduleNum: 6,
      title: 'Mock Tests, Feedback & Improvement',
      duration: 360, // 6 hours
      lessons: [
        { title: 'Full-Length Answer Writing Simulation', duration: 30, order: 69 },
        { title: 'Simulating Exam Conditions', duration: 30, order: 70 },
        { title: 'Peer Evaluation Methods', duration: 30, order: 71 },
        { title: 'Expert Feedback Analysis', duration: 30, order: 72 },
        { title: 'Identifying Weak Areas', duration: 30, order: 73 },
        { title: 'Improvement Strategies', duration: 30, order: 74 },
        { title: 'Scoring Analysis Techniques', duration: 30, order: 75 },
        { title: 'Exam Readiness Checklist', duration: 30, order: 76 },
        { title: 'Final Revision Techniques', duration: 30, order: 77 },
        { title: 'Time Management Review', duration: 30, order: 78 },
        { title: 'Mock Test 1 - Discussion', duration: 30, order: 79 },
        { title: 'Mock Test 2 - Discussion', duration: 30, order: 80 },
        { title: 'Performance Tracking', duration: 30, order: 81 },
        { title: 'Continuous Improvement Plan', duration: 30, order: 82 },
        { title: 'Final Exam Tips & Strategies', duration: 30, order: 83 },
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
  console.log('✨ Advanced Answer Writing Mastery seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding course:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
