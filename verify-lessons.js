const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const lessonCount = await prisma.lesson.count()
  const courseCount = await prisma.course.count({ where: { lessons: { some: {} } } })
  
  console.log('📊 Database Verification:')
  console.log('✅ Total lessons in database:', lessonCount)
  console.log('✅ Courses with lessons:', courseCount)
  
  // Show lessons per category
  const categories = await prisma.category.findMany({ 
    include: { 
      courses: { 
        include: { _count: { select: { lessons: true } } } 
      } 
    } 
  })
  
  console.log('\n📚 Lessons by Category:')
  for (const cat of categories) {
    const totalLessons = cat.courses.reduce((sum, c) => sum + c._count.lessons, 0)
    if (totalLessons > 0) {
      console.log('  ' + cat.name + ':', totalLessons, 'lessons across', cat.courses.filter(c => c._count.lessons > 0).length, 'courses')
    }
  }
  
  console.log('\n✅ Verification complete!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
