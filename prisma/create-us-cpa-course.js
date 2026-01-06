const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Creating US CPA Complete Course...')
  
  try {
    // Check if course already exists
    const existingCourse = await prisma.course.findFirst({
      where: {
        OR: [
          { id: 'us_cpa' },
          { title: { contains: 'US CPA', mode: 'insensitive' } }
        ]
      }
    })
    
    if (existingCourse) {
      console.log('❌ Course already exists with ID:', existingCourse.id)
      return
    }
    
    // Get the Professional Courses instructor
    const instructor = await prisma.instructor.findFirst({
      where: {
        OR: [
          { name: { contains: 'Professional', mode: 'insensitive' } },
          { name: { contains: 'CMA', mode: 'insensitive' } }
        ]
      }
    })
    
    const instructorId = instructor?.id || 'inst_professional'
    
    // Create the US CPA course record
    const course = await prisma.course.create({
      data: {
        id: 'us_cpa',
        title: 'US CPA – Complete Course (All 4 Papers)',
        description: 'Comprehensive preparation for the US Certified Public Accountant (CPA) examination covering all four sections: FAR, AUD, REG, and Discipline. Perfect for Big4, MNC, and global accounting roles.',
        thumbnail: '/assets/courses/us-cpa.svg',
        difficulty: 'ADVANCED',
        duration: 30000, // 500 hours in minutes
        isActive: true,
        instructorId: instructorId,
        courseType: 'GENERAL'
      }
    })
    
    console.log('✅ Created course:', course.title)
    console.log('Course ID:', course.id)
    console.log('Duration:', course.duration, 'minutes')
    
  } catch (error) {
    console.error('❌ Error creating course:', error.message)
    if (error.code === 'P2002') {
      console.log('Course may already exist - checking...')
      const existing = await prisma.course.findUnique({
        where: { id: 'us_cpa' }
      })
      if (existing) {
        console.log('Course already exists:', existing.id)
      }
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()