const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkCoursesData() {
  try {
    console.log('Checking courses and lessons data...')
    
    const courseCount = await prisma.course.count()
    const lessonCount = await prisma.lesson.count()
    const learningPathCount = await prisma.learningPath.count()
    
    console.log(`Learning Paths: ${learningPathCount}`)
    console.log(`Courses: ${courseCount}`)
    console.log(`Lessons: ${lessonCount}`)
    
    if (courseCount > 0) {
      const courses = await prisma.course.findMany({ 
        take: 5,
        include: {
          instructor: true,
          category: true,
          subCategory: true
        }
      })
      console.log('Sample courses:')
      courses.forEach(course => {
        console.log(`  - ${course.title} (${course.difficulty}) by ${course.instructor.name}`)
        console.log(`    Category: ${course.category.name} > ${course.subCategory.name}`)
        console.log(`    Duration: ${course.duration} minutes`)
        console.log()
      })
    }
    
    if (lessonCount > 0) {
      const lessons = await prisma.lesson.findMany({ 
        take: 3,
        include: {
          course: true
        }
      })
      console.log('Sample lessons:')
      lessons.forEach(lesson => {
        console.log(`  - ${lesson.title} (${lesson.duration} min) from ${lesson.course.title}`)
      })
    }
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error checking courses data:', error)
  }
}

checkCoursesData()