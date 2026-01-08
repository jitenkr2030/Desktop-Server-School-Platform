/**
 * Unified Course Population Script
 * 
 * This script populates lessons for all courses in the database.
 * It can be run independently to add or update lesson content.
 * 
 * Run with: npx tsx prisma/populate-courses.ts
 */

import { PrismaClient } from '@prisma/client'
import { getLessons, getLessonsByCourseId } from '../src/lib/simple-db'

const prisma = new PrismaClient()

interface LessonData {
  id: string
  courseId: string
  title: string
  content: string
  videoUrl?: string | null
  audioUrl?: string | null
  pdfUrl?: string | null
  duration: number
  order: number
  isActive: boolean
}

async function main() {
  console.log('🚀 Starting course population...\n')

  try {
    // Get all courses from database
    const courses = await prisma.course.findMany({
      where: { isActive: true },
      select: { id: true, title: true }
    })

    console.log(`📖 Found ${courses.length} active courses\n`)

    let totalLessonsAdded = 0
    let totalLessonsUpdated = 0

    // Process each course
    for (const course of courses) {
      console.log(`📚 Processing: ${course.title}`)
      
      const result = await populateLessonsForCourse(course.id)
      totalLessonsAdded += result.added
      totalLessonsUpdated += result.updated
      
      console.log(`  ✅ Added: ${result.added}, Updated: ${result.updated}\n`)
    }

    // Print summary
    console.log('='.repeat(60))
    console.log('✅ Course population completed successfully!\n')
    console.log('📊 POPULATION SUMMARY:')
    console.log('='.repeat(60))
    console.log(`📖 Courses processed: ${courses.length}`)
    console.log(`📝 Lessons added: ${totalLessonsAdded}`)
    console.log(`🔄 Lessons updated: ${totalLessonsUpdated}`)
    console.log(`📊 Total lessons: ${totalLessonsAdded + totalLessonsUpdated}`)
    console.log('='.repeat(60))

  } catch (error) {
    console.error('❌ Population error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

async function populateLessonsForCourse(courseId: string): Promise<{ added: number; updated: number }> {
  // Get lessons from mock data
  const mockLessons = getLessonsByCourseId(courseId)
  
  if (mockLessons.length === 0) {
    console.log(`  ⚠️  No lessons found in mock data for course: ${courseId}`)
    return { added: 0, updated: 0 }
  }

  let added = 0
  let updated = 0

  for (const lesson of mockLessons) {
    // Check if lesson already exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id: lesson.id }
    })

    if (existingLesson) {
      // Update existing lesson
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: {
          title: lesson.title,
          content: lesson.content,
          videoUrl: lesson.videoUrl || null,
          audioUrl: lesson.audioUrl || null,
          pdfUrl: lesson.pdfUrl || null,
          duration: lesson.duration,
          order: lesson.order,
          isActive: lesson.isActive,
        }
      })
      updated++
    } else {
      // Create new lesson
      await prisma.lesson.create({
        data: {
          id: lesson.id,
          courseId: lesson.courseId,
          title: lesson.title,
          content: lesson.content,
          videoUrl: lesson.videoUrl || null,
          audioUrl: lesson.audioUrl || null,
          pdfUrl: lesson.pdfUrl || null,
          duration: lesson.duration,
          order: lesson.order,
          isActive: lesson.isActive,
        }
      })
      added++
    }
  }

  return { added, updated }
}

// Alternative function to add lessons to a specific course only
async function populateSpecificCourse(courseId: string): Promise<{ added: number; updated: number }> {
  console.log(`🎯 Populating lessons for specific course: ${courseId}\n`)
  return await populateLessonsForCourse(courseId)
}

// Alternative function to add lessons for multiple courses
async function populateMultipleCourses(courseIds: string[]): Promise<{ totalAdded: number; totalUpdated: number }> {
  console.log(`🎯 Populating lessons for ${courseIds.length} specific courses\n`)
  
  let totalAdded = 0
  let totalUpdated = 0

  for (const courseId of courseIds) {
    const result = await populateLessonsForCourse(courseId)
    totalAdded += result.added
    totalUpdated += result.updated
  }

  return { totalAdded, totalUpdated }
}

// Export functions for external use
export { populateLessonsForCourse, populateSpecificCourse, populateMultipleCourses }

// Execute if run directly
if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
}
