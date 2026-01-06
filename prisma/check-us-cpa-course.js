const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking if US CPA course exists...')
  
  try {
    const existingCourse = await prisma.course.findFirst({
      where: {
        OR: [
          { id: 'us_cpa' },
          { id: 'us_cpa_complete' },
          { title: { contains: 'US CPA', mode: 'insensitive' } }
        ]
      }
    })
    
    if (existingCourse) {
      console.log('❌ Course already exists!')
      console.log('Course ID:', existingCourse.id)
      console.log('Course Title:', existingCourse.title)
      console.log('Duration:', existingCourse.duration)
      console.log('Lessons count:', existingCourse._count?.lessons || 'N/A')
    } else {
      console.log('✅ Course does not exist - safe to create')
    }
    
  } catch (error) {
    console.error('Error checking course:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()