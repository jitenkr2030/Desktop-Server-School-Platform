/**
 * Seeder: State Police Constable & Sub-Inspector (SI) Preparation
 * Course ID: state_police
 * Total: 120 lessons across 6 modules
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating State Police Constable & SI Preparation course lessons...')

  const courseId = 'state_police'

  // Verify course exists
  const course = await prisma.course.findUnique({
    where: { id: courseId }
  })

  if (!course) {
    throw new Error(`Course with ID '${courseId}' not found. Please run populate-competitive-2.ts first.`)
  }

  console.log(`✅ Found course: ${course.title}`)

  // ============================================================================
  // MODULE 1: General Knowledge & Current Affairs (Lessons 1-25)
  // ============================================================================
  console.log('Creating Module 1: General Knowledge & Current Affairs...')
  
  const module1Lessons = [
    { order: 1, title: 'Indian Constitution - Overview & Preamble', duration: 35 },
    { order: 2, title: 'Fundamental Rights - Detailed Analysis', duration: 40 },
    { order: 3, title: 'Directive Principles of State Policy', duration: 30 },
    { order: 4, title: 'Fundamental Duties of Citizens', duration: 25 },
    { order: 5, title: 'Indian Polity - President & Powers', duration: 35 },
    { order: 6, title: 'Indian Polity - Prime Minister & Cabinet', duration: 35 },
    { order: 7, title: 'Parliament Structure & Functions', duration: 40 },
    { order: 8, title: 'Judiciary System - Supreme Court & High Courts', duration: 40 },
    { order: 9, title: 'State Government - Governor, CM & Council', duration: 35 },
    { order: 10, title: 'Local Self Government - Panchayati Raj', duration: 30 },
    { order: 11, title: 'Local Self Government - Municipalities', duration: 25 },
    { order: 12, title: 'Indian History - Ancient Civilizations', duration: 35 },
    { order: 13, title: 'Medieval India - Sultanate & Mughal Period', duration: 40 },
    { order: 14, title: 'Modern India - British Raj & Freedom Struggle', duration: 45 },
    { order: 15, title: 'Post-Independence India - Events & Development', duration: 35 },
    { order: 16, title: 'Indian Geography - Physical Features', duration: 40 },
    { order: 17, title: 'Indian Geography - Rivers & Mountains', duration: 35 },
    { order: 18, title: 'Indian Geography - States & Capitals', duration: 30 },
    { order: 19, title: 'Indian Geography - Climate & Vegetation', duration: 30 },
    { order: 20, title: 'Economics - Basic Concepts & Terms', duration: 35 },
    { order: 21, title: 'Indian Economy - Five Year Plans', duration: 35 },
    { order: 22, title: 'Current Affairs - National Events 2024-2025', duration: 40 },
    { order: 23, title: 'Current Affairs - International Relations', duration: 35 },
    { order: 24, title: 'Current Affairs - Sports & Awards', duration: 30 },
    { order: 25, title: 'Important Government Schemes & Missions', duration: 35 },
  ]

  for (const lesson of module1Lessons) {
    await prisma.lesson.upsert({
      where: {
        id: `${courseId}-m1-l${lesson.order}`
      },
      update: {},
      create: {
        id: `${courseId}-m1-l${lesson.order}`,
        title: lesson.title,
        duration: lesson.duration,
        order: lesson.order,
        content: `Complete lesson on ${lesson.title} for State Police Constable & SI Preparation.`,
        videoUrl: 'https://example.com/videos/police-prep/placeholder.mp4',
        courseId: courseId,
      },
    })
  }
  console.log(`✅ Created ${module1Lessons.length} lessons for Module 1`)

  // ============================================================================
  // MODULE 2: Mathematics & Numerical Ability (Lessons 26-55)
  // ============================================================================
  console.log('Creating Module 2: Mathematics & Numerical Ability...')
  
  const module2Lessons = [
    { order: 26, title: 'Number System - Basics & Types', duration: 35 },
    { order: 27, title: 'LCM & HCF - Concepts & Methods', duration: 40 },
    { order: 28, title: 'Simplification - BODMAS Rule', duration: 35 },
    { order: 29, title: 'Square Roots & Cube Roots', duration: 30 },
    { order: 30, title: 'Fractions & Decimals', duration: 35 },
    { order: 31, title: 'Percentage - Basic Calculations', duration: 40 },
    { order: 32, title: 'Percentage - Applications & Tricks', duration: 35 },
    { order: 33, title: 'Profit & Loss - Basic Concepts', duration: 40 },
    { order: 34, title: 'Profit & Loss - Discount & Markup', duration: 35 },
    { order: 35, title: 'Ratio & Proportion - Fundamentals', duration: 35 },
    { order: 36, title: 'Ratio & Proportion - Word Problems', duration: 30 },
    { order: 37, title: 'Partnership - Basic Problems', duration: 30 },
    { order: 38, title: 'Time & Work - Concepts & Formulas', duration: 40 },
    { order: 39, title: 'Time & Work - Efficiency Problems', duration: 35 },
    { order: 40, title: 'Pipes & Cisterns', duration: 30 },
    { order: 41, title: 'Time, Speed & Distance - Basics', duration: 40 },
    { order: 42, title: 'Time, Speed & Distance - Average Speed', duration: 35 },
    { order: 43, title: 'Relative Speed & Boats', duration: 35 },
    { order: 44, title: 'Trains & Platforms', duration: 35 },
    { order: 45, title: 'Simple Interest - Concepts & Problems', duration: 35 },
    { order: 46, title: 'Compound Interest - Basic & Compound', duration: 40 },
    { order: 47, title: 'Average - Calculation Methods', duration: 30 },
    { order: 48, title: 'Mixture & Alligation', duration: 40 },
    { order: 49, title: 'Algebra - Basic Equations', duration: 35 },
    { order: 50, title: 'Linear Equations', duration: 35 },
    { order: 51, title: 'Mensuration - Area & Perimeter (2D)', duration: 45 },
    { order: 52, title: 'Mensuration - Volume & Surface (3D)', duration: 40 },
    { order: 53, title: 'Data Interpretation - Tables & Charts', duration: 35 },
    { order: 54, title: 'Data Interpretation - Bar Graphs & Pie Charts', duration: 35 },
    { order: 55, title: 'Practice Problems & Shortcut Tricks', duration: 40 },
  ]

  for (const lesson of module2Lessons) {
    await prisma.lesson.upsert({
      where: {
        id: `${courseId}-m2-l${lesson.order}`
      },
      update: {},
      create: {
        id: `${courseId}-m2-l${lesson.order}`,
        title: lesson.title,
        duration: lesson.duration,
        order: lesson.order,
        content: `Complete lesson on ${lesson.title} for State Police Constable & SI Preparation.`,
        videoUrl: 'https://example.com/videos/police-prep/placeholder.mp4',
        courseId: courseId,
      },
    })
  }
  console.log(`✅ Created ${module2Lessons.length} lessons for Module 2`)

  // ============================================================================
  // MODULE 3: Reasoning & Logical Ability (Lessons 56-80)
  // ============================================================================
  console.log('Creating Module 3: Reasoning & Logical Ability...')
  
  const module3Lessons = [
    { order: 56, title: 'Analogy - Types & Examples', duration: 35 },
    { order: 57, title: 'Classification - Finding Odd One', duration: 30 },
    { order: 58, title: 'Series Completion - Number Series', duration: 35 },
    { order: 59, title: 'Series Completion - Alphabet Series', duration: 30 },
    { order: 60, title: 'Coding-Decoding - Basic Methods', duration: 40 },
    { order: 61, title: 'Coding-Decoding - Advanced Patterns', duration: 35 },
    { order: 62, title: 'Blood Relations - Family Tree', duration: 35 },
    { order: 63, title: 'Blood Relations - Coded Relations', duration: 30 },
    { order: 64, title: 'Direction & Distance - Basics', duration: 35 },
    { order: 65, title: 'Direction & Distance - Advanced Problems', duration: 30 },
    { order: 66, title: 'Seating Arrangement - Linear', duration: 40 },
    { order: 67, title: 'Seating Arrangement - Circular', duration: 35 },
    { order: 68, title: 'Seating Arrangement - Puzzle Type', duration: 40 },
    { order: 69, title: 'Syllogism - Statements & Conclusions', duration: 40 },
    { order: 70, title: 'Syllogism - Venn Diagrams Method', duration: 35 },
    { order: 71, title: 'Logical Venn Diagrams', duration: 30 },
    { order: 72, title: 'Mathematical Operations', duration: 35 },
    { order: 73, title: 'Arithmetic Reasoning', duration: 35 },
    { order: 74, title: 'Statement & Assumptions', duration: 30 },
    { order: 75, title: 'Statement & Arguments', duration: 30 },
    { order: 76, title: 'Course of Action', duration: 30 },
    { order: 77, title: 'Input-Output Analysis', duration: 35 },
    { order: 78, title: 'Data Sufficiency', duration: 35 },
    { order: 79, title: 'Non-Verbal Reasoning - Mirror Images', duration: 30 },
    { order: 80, title: 'Non-Verbal Reasoning - Paper Cutting & Folding', duration: 35 },
  ]

  for (const lesson of module3Lessons) {
    await prisma.lesson.upsert({
      where: {
        id: `${courseId}-m3-l${lesson.order}`
      },
      update: {},
      create: {
        id: `${courseId}-m3-l${lesson.order}`,
        title: lesson.title,
        duration: lesson.duration,
        order: lesson.order,
        content: `Complete lesson on ${lesson.title} for State Police Constable & SI Preparation.`,
        videoUrl: 'https://example.com/videos/police-prep/placeholder.mp4',
        courseId: courseId,
      },
    })
  }
  console.log(`✅ Created ${module3Lessons.length} lessons for Module 3`)

  // ============================================================================
  // MODULE 4: General Science (Lessons 81-100)
  // ============================================================================
  console.log('Creating Module 4: General Science...')
  
  const module4Lessons = [
    { order: 81, title: 'Physics - Motion & Laws of Motion', duration: 40 },
    { order: 82, title: 'Physics - Work, Energy & Power', duration: 35 },
    { order: 83, title: 'Physics - Gravitation & Gravity', duration: 35 },
    { order: 84, title: 'Physics - Heat & Temperature', duration: 35 },
    { order: 85, title: 'Physics - Light & Optics', duration: 40 },
    { order: 86, title: 'Physics - Sound & Waves', duration: 30 },
    { order: 87, title: 'Physics - Electricity & Magnetism', duration: 40 },
    { order: 88, title: 'Chemistry - Matter & States', duration: 35 },
    { order: 89, title: 'Chemistry - Atomic Structure', duration: 35 },
    { order: 90, title: 'Chemistry - Periodic Table & Elements', duration: 40 },
    { order: 91, title: 'Chemistry - Chemical Reactions & Equations', duration: 35 },
    { order: 92, title: 'Chemistry - Acids, Bases & Salts', duration: 35 },
    { order: 93, title: 'Chemistry - Metals & Non-Metals', duration: 30 },
    { order: 94, title: 'Biology - Cell Structure & Functions', duration: 40 },
    { order: 95, title: 'Biology - Human Digestive System', duration: 35 },
    { order: 96, title: 'Biology - Human Respiratory System', duration: 30 },
    { order: 97, title: 'Biology - Human Circulatory System', duration: 35 },
    { order: 98, title: 'Biology - Nervous System & Brain', duration: 35 },
    { order: 99, title: 'Biology - Plant Kingdom & Photosynthesis', duration: 35 },
    { order: 100, title: 'General Science - Environmental Studies', duration: 35 },
  ]

  for (const lesson of module4Lessons) {
    await prisma.lesson.upsert({
      where: {
        id: `${courseId}-m4-l${lesson.order}`
      },
      update: {},
      create: {
        id: `${courseId}-m4-l${lesson.order}`,
        title: lesson.title,
        duration: lesson.duration,
        order: lesson.order,
        content: `Complete lesson on ${lesson.title} for State Police Constable & SI Preparation.`,
        videoUrl: 'https://example.com/videos/police-prep/placeholder.mp4',
        courseId: courseId,
      },
    })
  }
  console.log(`✅ Created ${module4Lessons.length} lessons for Module 4`)

  // ============================================================================
  // MODULE 5: Physical Efficiency & Measurement (Lessons 101-110)
  // ============================================================================
  console.log('Creating Module 5: Physical Efficiency & Measurement...')
  
  const module5Lessons = [
    { order: 101, title: 'Physical Standards - Height & Weight Requirements', duration: 25 },
    { order: 102, title: 'Physical Efficiency Tests Overview', duration: 30 },
    { order: 103, title: 'Running Events - 100m, 200m, 400m Techniques', duration: 35 },
    { order: 104, title: 'Long Jump - Techniques & Training', duration: 35 },
    { order: 105, title: 'High Jump - Clearing the Bar', duration: 30 },
    { order: 106, title: 'Short Put Throw - Form & Technique', duration: 30 },
    { order: 107, title: 'Swimming Requirements & Techniques', duration: 35 },
    { order: 108, title: 'Endurance Training - Running 1500m/800m', duration: 35 },
    { order: 109, title: 'Pull-ups & Chin-ups Training', duration: 30 },
    { order: 110, title: 'Physical Test Preparation Strategy', duration: 30 },
  ]

  for (const lesson of module5Lessons) {
    await prisma.lesson.upsert({
      where: {
        id: `${courseId}-m5-l${lesson.order}`
      },
      update: {},
      create: {
        id: `${courseId}-m5-l${lesson.order}`,
        title: lesson.title,
        duration: lesson.duration,
        order: lesson.order,
        content: `Complete lesson on ${lesson.title} for State Police Constable & SI Preparation.`,
        videoUrl: 'https://example.com/videos/police-prep/placeholder.mp4',
        courseId: courseId,
      },
    })
  }
  console.log(`✅ Created ${module5Lessons.length} lessons for Module 5`)

  // ============================================================================
  // MODULE 6: Mock Tests & Previous Year Papers (Lessons 111-120)
  // ============================================================================
  console.log('Creating Module 6: Mock Tests & Previous Year Papers...')
  
  const module6Lessons = [
    { order: 111, title: 'Full Mock Test 1 - Constable Level', duration: 120 },
    { order: 112, title: 'Mock Test 1 - Detailed Solutions & Analysis', duration: 90 },
    { order: 113, title: 'Full Mock Test 2 - Constable Level', duration: 120 },
    { order: 114, title: 'Mock Test 2 - Detailed Solutions & Analysis', duration: 90 },
    { order: 115, title: 'Full Mock Test 3 - SI Level', duration: 120 },
    { order: 116, title: 'Mock Test 3 - Detailed Solutions & Analysis', duration: 90 },
    { order: 117, title: 'Previous Year Papers Analysis - Constable', duration: 60 },
    { order: 118, title: 'Previous Year Papers Analysis - SI', duration: 60 },
    { order: 119, title: 'Time Management & Exam Strategy', duration: 40 },
    { order: 120, title: 'Final Revision & Tips for Success', duration: 50 },
  ]

  for (const lesson of module6Lessons) {
    await prisma.lesson.upsert({
      where: {
        id: `${courseId}-m6-l${lesson.order}`
      },
      update: {},
      create: {
        id: `${courseId}-m6-l${lesson.order}`,
        title: lesson.title,
        duration: lesson.duration,
        order: lesson.order,
        content: `Complete lesson on ${lesson.title} for State Police Constable & SI Preparation.`,
        videoUrl: 'https://example.com/videos/police-prep/placeholder.mp4',
        courseId: courseId,
      },
    })
  }
  console.log(`✅ Created ${module6Lessons.length} lessons for Module 6`)

  // ============================================================================
  // Summary
  // ============================================================================
  const totalLessons = module1Lessons.length + module2Lessons.length + 
                       module3Lessons.length + module4Lessons.length + 
                       module5Lessons.length + module6Lessons.length
  
  const totalDuration = [...module1Lessons, ...module2Lessons, ...module3Lessons, 
                         ...module4Lessons, ...module5Lessons, ...module6Lessons]
                         .reduce((sum, l) => sum + l.duration, 0)

  console.log('')
  console.log('🎉 State Police Constable & SI Preparation course created successfully!')
  console.log('')
  console.log('📊 Summary:')
  console.log(`   - Total Lessons: ${totalLessons}`)
  console.log(`   - Total Duration: ${Math.round(totalDuration/60)} hours`)
  console.log('')
  console.log('📚 Module Breakdown:')
  console.log(`   - Module 1: General Knowledge & Current Affairs (${module1Lessons.length} lessons)`)
  console.log(`   - Module 2: Mathematics & Numerical Ability (${module2Lessons.length} lessons)`)
  console.log(`   - Module 3: Reasoning & Logical Ability (${module3Lessons.length} lessons)`)
  console.log(`   - Module 4: General Science (${module4Lessons.length} lessons)`)
  console.log(`   - Module 5: Physical Efficiency & Measurement (${module5Lessons.length} lessons)`)
  console.log(`   - Module 6: Mock Tests & Previous Year Papers (${module6Lessons.length} lessons)`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
