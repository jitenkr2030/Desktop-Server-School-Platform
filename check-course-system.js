const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkCourseSystem() {
  console.log('🔍 CHECKING COURSE SYSTEM STATUS\n')
  console.log('='.repeat(60))

  try {
    await prisma.$connect()

    // Check Courses
    console.log('\n📚 COURSES')
    console.log('-'.repeat(40))
    const courses = await prisma.course.findMany({
      include: {
        instructor: true,
        category: true,
        _count: { select: { lessons: true } }
      }
    })
    console.log(`Total Courses: ${courses.length}\n`)
    
    if (courses.length > 0) {
      courses.forEach(course => {
        console.log(`  📖 ${course.title}`)
        console.log(`     ID: ${course.id}`)
        console.log(`     Instructor: ${course.instructor?.name || 'None'}`)
        console.log(`     Category: ${course.category?.name || 'None'}`)
        console.log(`     Lessons: ${course._count.lessons}`)
        console.log(`     Duration: ${course.duration} mins`)
        console.log(`     Active: ${course.isActive}`)
        console.log('')
      })
    } else {
      console.log('  ⚠️  No courses found\n')
    }

    // Check Instructors
    console.log('\n👨‍🏫 INSTRUCTORS')
    console.log('-'.repeat(40))
    const instructors = await prisma.instructor.findMany({
      include: { _count: { select: { courses: true } } }
    })
    console.log(`Total Instructors: ${instructors.length}\n`)
    
    if (instructors.length > 0) {
      instructors.forEach(inst => {
        console.log(`  👤 ${inst.name}`)
        console.log(`     ID: ${inst.id}`)
        console.log(`     Courses: ${inst._count.courses}`)
        console.log(`     Active: ${inst.isActive}`)
        console.log('')
      })
    } else {
      console.log('  ⚠️  No instructors found\n')
    }

    // Check Categories
    console.log('\n📁 CATEGORIES')
    console.log('-'.repeat(40))
    const categories = await prisma.category.findMany({
      include: { _count: { select: { courses: true } } }
    })
    console.log(`Total Categories: ${categories.length}\n`)
    
    if (categories.length > 0) {
      categories.forEach(cat => {
        console.log(`  📂 ${cat.name}`)
        console.log(`     Courses: ${cat._count.courses}`)
        console.log(`     Active: ${cat.isActive}`)
        console.log('')
      })
    } else {
      console.log('  ⚠️  No categories found\n')
    }

    // Check Lessons
    console.log('\n📝 LESSONS')
    console.log('-'.repeat(40))
    const lessons = await prisma.lesson.findMany({
      include: { course: true },
      orderBy: { order: 'asc' }
    })
    console.log(`Total Lessons: ${lessons.length}\n`)
    
    if (lessons.length > 0) {
      lessons.forEach(lesson => {
        console.log(`  📄 ${lesson.title}`)
        console.log(`     Course: ${lesson.course?.title || 'None'}`)
        console.log(`     Duration: ${lesson.duration} mins`)
        console.log(`     Order: ${lesson.order}`)
        console.log(`     Has Video: ${lesson.videoUrl ? 'Yes' : 'No'}`)
        console.log(`     Has PDF: ${lesson.pdfUrl ? 'Yes' : 'No'}`)
        console.log('')
      })
    } else {
      console.log('  ⚠️  No lessons found\n')
    }

    // Check Progress
    console.log('\n📊 COURSE PROGRESS')
    console.log('-'.repeat(40))
    const progress = await prisma.courseProgress.findMany({
      include: { user: true, course: true, lesson: true }
    })
    console.log(`Total Progress Records: ${progress.length}\n`)
    
    if (progress.length > 0) {
      progress.forEach(p => {
        console.log(`  📈 ${p.user?.name || 'User'}`)
        console.log(`     Course: ${p.course?.title || 'Course'}`)
        console.log(`     Progress: ${p.progress}%`)
        console.log(`     Completed: ${p.completed ? 'Yes' : 'No'}`)
        console.log('')
      })
    } else {
      console.log('  ⚠️  No progress records found\n')
    }

    console.log('='.repeat(60))
    console.log('✅ Course system check complete!\n')

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkCourseSystem()
