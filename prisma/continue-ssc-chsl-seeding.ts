import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Continuing SSC CHSL (10+2) Complete Preparation seeding...')

  const courseId = 'ssc_chsl'

  // Check if course exists
  const existingCourse = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        orderBy: { order: 'asc' }
      }
    }
  })

  if (!existingCourse) {
    console.log(`❌ Course "${courseId}" not found. Please run the main seeder first.`)
    return
  }

  // Get existing lesson count
  const existingLessons = existingCourse.lessons || []
  const maxOrder = existingLessons.length > 0 
    ? Math.max(...existingLessons.map(l => l.order))
    : 0

  console.log(`📊 Course found with ${existingLessons.length} lessons (max order: ${maxOrder})`)

  // Continue from where we left off - add remaining lessons for Module 5
  // Module 5: Mock Tests, Tips & Exam Strategy (lessons 77-92)
  const remainingLessons = [
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

  let addedCount = 0
  for (const lessonData of remainingLessons) {
    // Skip if lesson already exists
    const exists = existingLessons.some(l => l.order === lessonData.order)
    if (exists) {
      console.log(`⏭️  Skipping lesson ${lessonData.order}: ${lessonData.title} (already exists)`)
      continue
    }

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
    addedCount++
    console.log(`✅ Created lesson ${lessonData.order}: ${lessonData.title}`)
  }

  // Get final count
  const finalCourse = await prisma.course.findUnique({
    where: { id: courseId },
    include: { lessons: true }
  })

  const totalLessons = finalCourse?.lessons?.length || 0

  console.log(`\n🎉 SSC CHSL Complete Preparation seeding completed!`)
  console.log(`📊 Total lessons: ${totalLessons}`)
  console.log(`📝 Lessons added in this run: ${addedCount}`)
}

main()
  .catch((e) => {
    console.error('Error seeding course:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
