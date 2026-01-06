const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Cleaning up existing US CPA lessons and assessments...')
  const courseId = 'us_cpa'
  
  try {
    // Delete existing lessons for this course
    const deletedLessons = await prisma.lesson.deleteMany({
      where: { courseId: courseId }
    })
    console.log(`✅ Deleted ${deletedLessons.count} existing lessons`)
    
    // Delete existing assessments for this course
    const deletedAssessments = await prisma.assessment.deleteMany({
      where: { courseId: courseId }
    })
    console.log(`✅ Deleted ${deletedAssessments.count} existing assessments`)
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()