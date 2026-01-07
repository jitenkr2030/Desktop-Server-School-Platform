/**
 * Continuation Seeder: State Police Constable & Sub-Inspector (SI) Preparation
 * Course ID: state_police
 * Continuation - Modules 4, 5, 6 (40 lessons)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Continuing State Police Constable & SI Preparation course lessons...')
  console.log('Creating Modules 4, 5, and 6...')

  const courseId = 'state_police'

  // Verify course exists
  const course = await prisma.course.findUnique({
    where: { id: courseId }
  })

  if (!course) {
    throw new Error(`Course with ID '${courseId}' not found.`)
  }

  // ============================================================================
  // MODULE 4: General Science (Lessons 81-100) - Continuation
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
  const totalLessons = module4Lessons.length + module5Lessons.length + module6Lessons.length
  
  const totalDuration = [...module4Lessons, ...module5Lessons, ...module6Lessons]
                         .reduce((sum, l) => sum + l.duration, 0)

  console.log('')
  console.log('🎉 Continuation completed successfully!')
  console.log('')
  console.log('📊 Summary:')
  console.log(`   - Lessons Created: ${totalLessons}`)
  console.log(`   - Total Duration: ${Math.round(totalDuration/60)} hours`)
  console.log('')
  console.log('✅ State Police Constable & SI Preparation course is now complete!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
