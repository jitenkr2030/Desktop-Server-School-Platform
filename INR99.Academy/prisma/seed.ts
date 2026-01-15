/**
 * INR99 Academy - Comprehensive Database Seed Script
 * 
 * This script seeds the database with all courses, lessons, instructors,
 * learning paths, and categories from the mock data files.
 * 
 * Run with: npx prisma db seed
 * Or directly: npx tsx prisma/seed.ts
 */

import { PrismaClient } from '@prisma/client'
import {
  getCourses,
  getInstructors,
  getLearningPaths,
  getLearningPathCategories,
  getLessons
} from '../src/lib/simple-db'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting comprehensive database seed...\n')

  try {
    // Clean existing data in correct order (respecting foreign key constraints)
    console.log('🧹 Cleaning existing data...')
    await cleanDatabase()
    console.log('✅ Database cleaned\n')

    // Seed data in dependency order
    console.log('📦 Seeding data...\n')

    // 1. Seed Instructors
    const instructors = await seedInstructors()
    
    // 2. Seed Categories (Learning Path Categories)
    const categories = await seedCategories()
    
    // 3. Seed Learning Paths
    const learningPaths = await seedLearningPaths(categories)
    
    // 4. Seed Courses
    const courses = await seedCourses(instructors, learningPaths)
    
    // 5. Seed Lessons
    const lessonCount = await seedLessons(courses)

    // Print summary
    console.log('='.repeat(60))
    console.log('✅ Database seeding completed successfully!\n')
    console.log('📊 SEEDING SUMMARY:')
    console.log('='.repeat(60))
    console.log(`👨‍🏫 Instructors: ${instructors.length}`)
    console.log(`📚 Categories: ${categories.length}`)
    console.log(`🛤️ Learning Paths: ${learningPaths.length}`)
    console.log(`📖 Courses: ${courses.length}`)
    console.log(`📝 Lessons: ${lessonCount}`)
    console.log('='.repeat(60))

  } catch (error) {
    console.error('❌ Seed error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

async function cleanDatabase() {
  // Delete in reverse order of dependencies
  await prisma.discussionReply.deleteMany()
  await prisma.discussion.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.courseProgress.deleteMany()
  await prisma.assessmentQuestion.deleteMany()
  await prisma.assessment.deleteMany()
  await prisma.course.deleteMany()
  await prisma.instructor.deleteMany()
  await prisma.learningPath.deleteMany()
  await prisma.learningPathCategory.deleteMany()
  await prisma.subCategory.deleteMany()
  await prisma.category.deleteMany()
  await prisma.schoolSubject.deleteMany()
  await prisma.schoolClass.deleteMany()
  await prisma.collegeSubject.deleteMany()
  await prisma.collegeDegree.deleteMany()
  await prisma.curriculumBoard.deleteMany()
}

async function seedInstructors() {
  console.log('👨‍🏫 Seeding instructors...')
  const instructors = []
  const mockInstructors = getInstructors()

  for (const instructor of mockInstructors) {
    const record = await prisma.instructor.create({
      data: {
        id: instructor.id,
        name: instructor.name,
        bio: generateInstructorBio(instructor),
        avatar: `/instructors/${instructor.id}.jpg`,
        expertise: instructor.expertise,
        isActive: true,
      }
    })
    instructors.push(record)
    console.log(`  ✅ Created instructor: ${instructor.name}`)
  }

  console.log(`  📊 Total instructors: ${instructors.length}\n`)
  return instructors
}

async function seedCategories() {
  console.log('📁 Seeding learning path categories...')
  const categories = []
  const mockCategories = getLearningPathCategories()

  for (const category of mockCategories) {
    const record = await prisma.learningPathCategory.create({
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description || null,
        icon: category.icon || null,
        color: category.color || null,
        sortOrder: category.sortOrder,
        isActive: category.isActive,
        isFeatured: category.isFeatured,
      }
    })
    categories.push(record)
    console.log(`  ✅ Created category: ${category.name}`)
  }

  console.log(`  📊 Total categories: ${categories.length}\n`)
  return categories
}

async function seedLearningPaths(categories: any[]) {
  console.log('🛤️ Seeding learning paths...')
  const categoryMap = new Map(categories.map(c => [c.id, c]))
  const learningPaths = []
  const mockPaths = getLearningPaths()

  for (const path of mockPaths) {
    const category = path.categoryId ? categoryMap.get(path.categoryId) : null

    const record = await prisma.learningPath.create({
      data: {
        id: path.id,
        title: path.title,
        description: path.description,
        icon: path.icon || null,
        color: path.color || null,
        isActive: path.isActive,
        sortOrder: path.sortOrder || 0,
        categoryId: path.categoryId || null,
      }
    })
    learningPaths.push(record)
    console.log(`  ✅ Created learning path: ${path.title} ${category ? `(${category.name})` : ''}`)
  }

  console.log(`  📊 Total learning paths: ${learningPaths.length}\n`)
  return learningPaths
}

async function seedCourses(instructors: any[], learningPaths: any[]) {
  console.log('📖 Seeding courses...')
  
  const instructorMap = new Map(instructors.map(i => [i.id, i]))
  const learningPathMap = new Map(learningPaths.map(lp => [lp.id, lp]))
  const mockCourses = getCourses()
  
  const courses = []

  for (const course of mockCourses) {
    const instructor = instructorMap.get(course.instructorId)
    const learningPath = course.learningPathId ? learningPathMap.get(course.learningPathId) : null

    const record = await prisma.course.create({
      data: {
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: `/courses/${course.id}.jpg`,
        difficulty: mapDifficulty(course.difficulty),
        duration: course.duration,
        isActive: course.isActive,
        instructorId: course.instructorId,
        learningPathId: course.learningPathId || null,
      }
    })
    courses.push(record)
    console.log(`  ✅ Created course: ${course.title}`)
  }

  console.log(`  📊 Total courses: ${courses.length}\n`)
  return courses
}

async function seedLessons(courses: any[]) {
  console.log('📝 Seeding lessons...')
  
  const courseMap = new Map(courses.map(c => [c.id, c]))
  const mockLessons = getLessons()
  let lessonCount = 0

  for (const lesson of mockLessons) {
    // Only seed lessons that have a valid course
    if (courseMap.has(lesson.courseId)) {
      await prisma.lesson.create({
        data: {
          id: lesson.id,
          courseId: lesson.courseId,
          title: lesson.title,
          content: lesson.content || '',
          videoUrl: lesson.videoUrl || null,
          audioUrl: lesson.audioUrl || null,
          pdfUrl: lesson.pdfUrl || null,
          duration: lesson.duration,
          order: lesson.order,
          isActive: lesson.isActive,
        }
      })
      lessonCount++
    }
  }

  console.log(`  ✅ Created ${lessonCount} lessons\n`)
  return lessonCount
}

// Helper function to generate instructor bio
function generateInstructorBio(instructor: any): string {
  const expertiseList = Array.isArray(instructor.expertise) 
    ? instructor.expertise 
    : JSON.parse(instructor.expertise || '[]')
  
  return `${instructor.name} is an experienced instructor specializing in ${expertiseList.slice(0, 3).join(', ')}. ` +
    `With expertise in multiple domains, they bring practical knowledge and real-world examples to help students succeed.`
}

// Helper function to map difficulty strings to Prisma enum
function mapDifficulty(difficulty: string): 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' {
  switch (difficulty) {
    case 'BEGINNER':
      return 'BEGINNER'
    case 'INTERMEDIATE':
      return 'INTERMEDIATE'
    case 'ADVANCED':
      return 'ADVANCED'
    default:
      return 'BEGINNER'
  }
}

// Execute seed
main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
