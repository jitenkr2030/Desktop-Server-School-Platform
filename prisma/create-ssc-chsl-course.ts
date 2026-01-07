import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting to seed SSC CHSL (10+2) Complete Preparation...')

  const courseId = 'ssc_chsl'

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
      title: 'SSC CHSL (10+2) Complete Preparation',
      description: 'Master the SSC Combined Higher Secondary Level examination with complete coverage of Quantitative Aptitude, Reasoning, English, and General Awareness for LDC, PA, and SA posts.',
      thumbnail: '/assets/courses/ssc_chsl.svg',
      difficulty: 'INTERMEDIATE',
      duration: 3500, // 58h 20m in minutes
      instructorId: instructorId,
    },
  })

  console.log(`✅ Course created: ${course.title}`)

  // Create modules and lessons based on the user's detailed curriculum
  const modules = [
    {
      moduleNum: 1,
      title: 'Quantitative Aptitude',
      duration: 900, // 15 hours
      lessons: [
        { title: 'Number System Basics', duration: 30, order: 1 },
        { title: 'HCF & LCM Concepts', duration: 30, order: 2 },
        { title: 'Percentages Fundamentals', duration: 30, order: 3 },
        { title: 'Profit & Loss Basics', duration: 30, order: 4 },
        { title: 'Ratio & Proportion', duration: 30, order: 5 },
        { title: 'Simple & Compound Interest', duration: 30, order: 6 },
        { title: 'Algebra - Basic Equations', duration: 30, order: 7 },
        { title: 'Geometry - Lines & Angles', duration: 30, order: 8 },
        { title: 'Geometry - Triangles & Circles', duration: 30, order: 9 },
        { title: 'Trigonometry Basics', duration: 30, order: 10 },
        { title: 'Time & Work Problems', duration: 30, order: 11 },
        { title: 'Time, Speed & Distance', duration: 30, order: 12 },
        { title: 'Averages & Mixtures', duration: 30, order: 13 },
        { title: 'Data Interpretation Introduction', duration: 30, order: 14 },
        { title: 'Shortcut Techniques for Calculations', duration: 30, order: 15 },
        { title: 'Practice Questions - Set 1', duration: 30, order: 16 },
        { title: 'Previous Year Problems Analysis', duration: 30, order: 17 },
        { title: 'Mock Practice - Quantitative Aptitude', duration: 30, order: 18 },
      ]
    },
    {
      moduleNum: 2,
      title: 'Reasoning & Logical Ability',
      duration: 720, // 12 hours
      lessons: [
        { title: 'Verbal Reasoning Basics', duration: 30, order: 19 },
        { title: 'Coding-Decoding Fundamentals', duration: 30, order: 20 },
        { title: 'Syllogisms & Logic', duration: 30, order: 21 },
        { title: 'Inequality Reasoning', duration: 30, order: 22 },
        { title: 'Number Series & Patterns', duration: 30, order: 23 },
        { title: 'Alphabet Series & Sequences', duration: 30, order: 24 },
        { title: 'Analogy & Classification', duration: 30, order: 25 },
        { title: 'Blood Relations', duration: 30, order: 26 },
        { title: 'Direction & Distance', duration: 30, order: 27 },
        { title: 'Seating Arrangements Basics', duration: 30, order: 28 },
        { title: 'Puzzle Solving Techniques', duration: 30, order: 29 },
        { title: 'Non-Verbal Reasoning - Patterns', duration: 30, order: 30 },
        { title: 'Mirror & Water Images', duration: 30, order: 31 },
        { title: 'Cube & Dice Problems', duration: 30, order: 32 },
        { title: 'Calendar & Clock Problems', duration: 30, order: 33 },
        { title: 'Critical Thinking Strategies', duration: 30, order: 34 },
        { title: 'Practice Exercises - Reasoning', duration: 30, order: 35 },
        { title: 'Mock Reasoning Sets', duration: 30, order: 36 },
      ]
    },
    {
      moduleNum: 3,
      title: 'English Language & Comprehension',
      duration: 720, // 12 hours
      lessons: [
        { title: 'Grammar Basics Overview', duration: 30, order: 37 },
        { title: 'Tenses & Their Usage', duration: 30, order: 38 },
        { title: 'Articles & Prepositions', duration: 30, order: 39 },
        { title: 'Subject-Verb Agreement', duration: 30, order: 40 },
        { title: 'Noun, Pronoun & Adjective', duration: 30, order: 41 },
        { title: 'Verb, Adverb & Conjunction', duration: 30, order: 42 },
        { title: 'Sentence Structure & Types', duration: 30, order: 43 },
        { title: 'Active & Passive Voice', duration: 30, order: 44 },
        { title: 'Direct & Indirect Speech', duration: 30, order: 45 },
        { title: 'Vocabulary Enhancement - Word Power', duration: 30, order: 46 },
        { title: 'Idioms & Phrases', duration: 30, order: 47 },
        { title: 'One Word Substitution', duration: 30, order: 48 },
        { title: 'Synonyms & Antonyms', duration: 30, order: 49 },
        { title: 'Reading Comprehension Strategies', duration: 30, order: 50 },
        { title: 'Passage Practice & Analysis', duration: 30, order: 51 },
        { title: 'Error Spotting Techniques', duration: 30, order: 52 },
        { title: 'Sentence Improvement', duration: 30, order: 53 },
        { title: 'Fill in the Blanks', duration: 30, order: 54 },
        { title: 'Para Jumbles', duration: 30, order: 55 },
        { title: 'Spelling Correction', duration: 30, order: 56 },
      ]
    },
    {
      moduleNum: 4,
      title: 'General Awareness & Current Affairs',
      duration: 600, // 10 hours
      lessons: [
        { title: 'Indian History - Ancient', duration: 30, order: 57 },
        { title: 'Indian History - Medieval', duration: 30, order: 58 },
        { title: 'Indian History - Modern', duration: 30, order: 59 },
        { title: 'Indian Freedom Struggle', duration: 30, order: 60 },
        { title: 'Indian Geography - Physical', duration: 30, order: 61 },
        { title: 'Indian Geography - Political', duration: 30, order: 62 },
        { title: 'World Geography', duration: 30, order: 63 },
        { title: 'Indian Polity & Constitution', duration: 30, order: 64 },
        { title: 'Indian Economy Basics', duration: 30, order: 65 },
        { title: 'Science & Technology - Physics', duration: 30, order: 66 },
        { title: 'Science & Technology - Chemistry', duration: 30, order: 67 },
        { title: 'Science & Technology - Biology', duration: 30, order: 68 },
        { title: 'Current Affairs - National', duration: 30, order: 69 },
        { title: 'Current Affairs - International', duration: 30, order: 70 },
        { title: 'Government Schemes & Policies', duration: 30, order: 71 },
        { title: 'Important Organizations & Awards', duration: 30, order: 72 },
        { title: 'Sports & Entertainment', duration: 30, order: 73 },
        { title: 'General Knowledge Quizzes', duration: 30, order: 74 },
        { title: 'Practice MCQs - General Awareness', duration: 30, order: 75 },
        { title: 'Current Affairs Compilation', duration: 30, order: 76 },
      ]
    },
    {
      moduleNum: 5,
      title: 'Mock Tests, Tips & Exam Strategy',
      duration: 560, // 9h 20m
      lessons: [
        { title: 'Full-Length Mock Test 1', duration: 60, order: 77 },
        { title: 'Mock Test 1 - Detailed Discussion', duration: 30, order: 78 },
        { title: 'Full-Length Mock Test 2', duration: 60, order: 79 },
        { title: 'Mock Test 2 - Detailed Discussion', duration: 30, order: 80 },
        { title: 'Full-Length Mock Test 3', duration: 60, order: 81 },
        { title: 'Mock Test 3 - Detailed Discussion', duration: 30, order: 82 },
        { title: 'Section-wise Performance Analysis', duration: 30, order: 83 },
        { title: 'Time Management Strategies', duration: 30, order: 84 },
        { title: 'Attempt Order & Technique', duration: 30, order: 85 },
        { title: 'Common Pitfalls to Avoid', duration: 30, order: 86 },
        { title: 'Negative Marking Strategy', duration: 20, order: 87 },
        { title: 'Quick Revision Tips', duration: 20, order: 88 },
        { title: 'Exam-Day Preparation', duration: 20, order: 89 },
        { title: 'Final Exam Checklist', duration: 20, order: 90 },
        { title: 'Confidence Building Techniques', duration: 20, order: 91 },
        { title: 'Last Minute Preparation Guide', duration: 20, order: 92 },
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
  console.log('✨ SSC CHSL Complete Preparation seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding course:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
