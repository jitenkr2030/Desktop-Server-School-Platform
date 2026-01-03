import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking for Web Development Bootcamp course...\n')

  // Find web development courses
  const courses = await prisma.course.findMany({
    where: {
      OR: [
        { title: { contains: 'Web Development', mode: 'insensitive' } },
        { title: { contains: 'web', mode: 'insensitive' } },
      ],
      isActive: true,
    },
    include: {
      _count: {
        select: { lessons: true }
      },
      instructor: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  console.log(`Found ${courses.length} web development courses:\n`)
  
  courses.forEach((course, index) => {
    console.log(`${index + 1}. ${course.title}`)
    console.log(`   ID: ${course.id}`)
    console.log(`   Difficulty: ${course.difficulty}`)
    console.log(`   Lessons: ${course._count.lessons}`)
    console.log(`   Duration: ${course.duration} minutes`)
    console.log(`   Instructor: ${course.instructor.name}`)
    console.log('')
  })

  if (courses.length === 0) {
    console.log('No web development courses found.')
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
