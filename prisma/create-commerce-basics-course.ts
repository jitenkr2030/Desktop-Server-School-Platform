/**
 * Seed Script: Commerce Basics Course (Clean Version)
 * A complete intermediate-level course for college students
 * Covers: Accountancy, Business Studies, Economics
 * 
 * IMPORTANT: Run this script AFTER deleting existing course data
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Module definitions for organizing lessons
const modules = [
  {
    id: 'mod-commerce-1',
    title: 'Introduction to Commerce',
    purpose: 'Build clarity about what commerce is and why it matters.',
    sortOrder: 1,
  },
  {
    id: 'mod-commerce-2',
    title: 'Fundamentals of Accountancy',
    purpose: 'Remove fear of accounts and build logical understanding.',
    sortOrder: 2,
  },
  {
    id: 'mod-commerce-3',
    title: 'Business Studies – Business Organization',
    purpose: 'Understand how businesses are formed and run.',
    sortOrder: 3,
  },
  {
    id: 'mod-commerce-4',
    title: 'Business Environment & Management Basics',
    purpose: 'Learn how external factors affect business decisions.',
    sortOrder: 4,
  },
  {
    id: 'mod-commerce-5',
    title: 'Fundamentals of Economics',
    purpose: 'Build economic thinking for real-world decision making.',
    sortOrder: 5,
  },
  {
    id: 'mod-commerce-6',
    title: 'Commerce in Real Life & Career Pathways',
    purpose: 'Connect theory with practical applications & careers.',
    sortOrder: 6,
  },
]

async function main() {
  console.log('🌱 Starting Commerce Basics course creation (Clean)...\n')

  // ============================================================================
  // 0. CLEANUP EXISTING DATA
  // ============================================================================
  console.log('🧹 Cleaning up existing data...')
  
  // Delete existing commerce course related data
  await prisma.assessment.deleteMany({ where: { courseId: 'course-commerce-basics' } }).catch(() => {})
  await prisma.lesson.deleteMany({ where: { courseId: 'course-commerce-basics' } }).catch(() => {})
  await prisma.course.delete({ where: { id: 'course-commerce-basics' } }).catch(() => {})
  await prisma.instructor.delete({ where: { id: 'inst-commerce-faculty' } }).catch(() => {})
  
  // Delete old subcategories for this category to avoid unique constraint errors
  await prisma.subCategory.deleteMany({ where: { categoryId: 'cat-college-foundation' } }).catch(() => {})
  
  // Delete old lessons that might have been created before
  const oldLessons = await prisma.lesson.findMany({
    where: {
      OR: [
        { id: { startsWith: 'lesson-commerce-' } },
        { title: { contains: 'Commerce' } }
      ]
    }
  })
  
  for (const lesson of oldLessons) {
    await prisma.lesson.delete({ where: { id: lesson.id } })
    console.log(`  Deleted lesson: ${lesson.title}`)
  }
  
  const oldAssessments = await prisma.assessment.findMany({
    where: { title: { contains: 'Commerce' } }
  })
  
  for (const assessment of oldAssessments) {
    await prisma.assessment.delete({ where: { id: assessment.id } })
    console.log(`  Deleted assessment: ${assessment.title}`)
  }
  
  const oldCourse = await prisma.course.findFirst({
    where: { title: { contains: 'Commerce Basics' } }
  })
  
  if (oldCourse) {
    await prisma.course.delete({ where: { id: oldCourse.id } })
    console.log(`  Deleted old course: ${oldCourse.title}`)
  }
  
  console.log('✅ Cleanup complete\n')

  // ============================================================================
  // 1. CREATE INSTRUCTOR
  // ============================================================================
  
  const instructor = await prisma.instructor.upsert({
    where: { id: 'inst-commerce-faculty' },
    update: {},
    create: {
      id: 'inst-commerce-faculty',
      name: 'INR99 Academy Commerce Faculty',
      title: 'Senior Commerce Educator',
      bio: 'Experienced faculty with expertise in Accountancy, Business Studies, and Economics. Specializes in making complex concepts simple for CA Foundation, B.Com, and commerce students.',
      expertise: 'Accountancy, Business Studies, Economics, CA Foundation, B.Com',
      isActive: true,
    },
  })
  
  console.log(`✅ Instructor created: ${instructor.name}`)

  // ============================================================================
  // 2. GET OR CREATE CATEGORY
  // ============================================================================

  const category = await prisma.category.upsert({
    where: { id: 'cat-college-foundation' },
    update: {},
    create: {
      id: 'cat-college-foundation',
      name: 'College Foundation',
      slug: 'college-foundation',
      description: 'UG degrees - Commerce, Science, Engineering prep',
      icon: '🎓',
      color: '#10B981',
      sortOrder: 2,
      isActive: true,
      isFeatured: true,
    },
  })

  console.log(`✅ Category ready: ${category.name}`)

  // ============================================================================
  // 3. CREATE SUB CATEGORIES
  // ============================================================================

  const subcategories = [
    { id: 'sub-commerce-acc', name: 'Accountancy', slug: 'accountancy' },
    { id: 'sub-commerce-bus', name: 'Business Studies', slug: 'business-studies' },
    { id: 'sub-commerce-eco', name: 'Economics', slug: 'economics' },
  ]

  for (const sub of subcategories) {
    await prisma.subCategory.upsert({
      where: { id: sub.id },
      update: {},
      create: {
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        description: `Fundamentals of ${sub.name}`,
        icon: '📚',
        color: '#3B82F6',
        sortOrder: 1,
        isActive: true,
        categoryId: category.id,
      },
    })
    console.log(`✅ Subcategory created: ${sub.name}`)
  }

  // ============================================================================
  // 4. CREATE COURSE
  // ============================================================================

  const course = await prisma.course.upsert({
    where: { id: 'course-commerce-basics' },
    update: {},
    create: {
      id: 'course-commerce-basics',
      title: 'Commerce Basics – Foundation of Business, Accounts & Economics',
      description: `This course provides a strong conceptual foundation in Commerce, covering Accountancy, Business Studies, and Economics. Perfect for students who want clarity before advanced commerce subjects or competitive exams.

**What you'll learn:**
• Understand the scope and importance of commerce
• Read and interpret basic financial statements
• Understand how businesses operate and are managed
• Grasp core economic concepts used in real life
• Build confidence for B.Com, CA Foundation, CS, CMA & CUET

**Level:** Intermediate | **Duration:** 15 Hours | **Subscription:** INR 99/month`,
      thumbnail: '/assets/courses/commerce-basics.svg',
      duration: 900, // 15 hours = 900 minutes
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: category.id,
      subCategoryId: 'sub-commerce-acc',
    },
  })

  console.log(`✅ Course created: ${course.title}`)

  // ============================================================================
  // 5. CREATE LESSONS BY MODULE (6 Modules × 5 Lessons = 30 Lessons)
  // ============================================================================

  const lessons = [
    // Module 1: Introduction to Commerce
    { title: 'Meaning & Scope of Commerce', duration: 30, order: 1, moduleOrder: 1, moduleTitle: 'Introduction to Commerce' },
    { title: 'Trade, Industry & Aids to Trade', duration: 30, order: 2, moduleOrder: 1, moduleTitle: 'Introduction to Commerce' },
    { title: 'Commerce vs Business vs Economics', duration: 20, order: 3, moduleOrder: 1, moduleTitle: 'Introduction to Commerce' },
    { title: 'Evolution of Commerce in India', duration: 20, order: 4, moduleOrder: 1, moduleTitle: 'Introduction to Commerce' },
    { title: 'Role of Commerce in Economic Development', duration: 20, order: 5, moduleOrder: 1, moduleTitle: 'Introduction to Commerce' },
    
    // Module 2: Fundamentals of Accountancy
    { title: 'What is Accounting? Objectives & Users', duration: 25, order: 6, moduleOrder: 2, moduleTitle: 'Fundamentals of Accountancy' },
    { title: 'Basic Accounting Terms & Concepts', duration: 30, order: 7, moduleOrder: 2, moduleTitle: 'Fundamentals of Accountancy' },
    { title: 'Accounting Principles & Conventions', duration: 25, order: 8, moduleOrder: 2, moduleTitle: 'Fundamentals of Accountancy' },
    { title: 'Types of Accounts & Golden Rules', duration: 30, order: 9, moduleOrder: 2, moduleTitle: 'Fundamentals of Accountancy' },
    { title: 'Introduction to Journal Entries', duration: 35, order: 10, moduleOrder: 2, moduleTitle: 'Fundamentals of Accountancy' },
    
    // Module 3: Business Studies – Business Organization
    { title: 'Meaning, Nature & Objectives of Business', duration: 25, order: 11, moduleOrder: 3, moduleTitle: 'Business Studies – Business Organization' },
    { title: 'Forms of Business Organization', duration: 40, order: 12, moduleOrder: 3, moduleTitle: 'Business Studies – Business Organization' },
    { title: 'Public vs Private Sector Enterprises', duration: 20, order: 13, moduleOrder: 3, moduleTitle: 'Business Studies – Business Organization' },
    { title: 'Business Risk & Risk Management', duration: 20, order: 14, moduleOrder: 3, moduleTitle: 'Business Studies – Business Organization' },
    { title: 'Startup & MSME Ecosystem in India', duration: 25, order: 15, moduleOrder: 3, moduleTitle: 'Business Studies – Business Organization' },
    
    // Module 4: Business Environment & Management Basics
    { title: 'Business Environment – Meaning & Importance', duration: 25, order: 16, moduleOrder: 4, moduleTitle: 'Business Environment & Management Basics' },
    { title: 'Economic, Social & Legal Environment', duration: 30, order: 17, moduleOrder: 4, moduleTitle: 'Business Environment & Management Basics' },
    { title: 'Introduction to Management & Its Functions', duration: 30, order: 18, moduleOrder: 4, moduleTitle: 'Business Environment & Management Basics' },
    { title: 'Planning, Organising & Staffing', duration: 30, order: 19, moduleOrder: 4, moduleTitle: 'Business Environment & Management Basics' },
    { title: 'Leadership, Motivation & Control', duration: 25, order: 20, moduleOrder: 4, moduleTitle: 'Business Environment & Management Basics' },
    
    // Module 5: Fundamentals of Economics
    { title: 'What is Economics? Micro vs Macro', duration: 25, order: 21, moduleOrder: 5, moduleTitle: 'Fundamentals of Economics' },
    { title: 'Basic Economic Problems & Opportunity Cost', duration: 25, order: 22, moduleOrder: 5, moduleTitle: 'Fundamentals of Economics' },
    { title: 'Demand – Meaning, Law & Factors', duration: 30, order: 23, moduleOrder: 5, moduleTitle: 'Fundamentals of Economics' },
    { title: 'Supply – Meaning & Market Equilibrium', duration: 30, order: 24, moduleOrder: 5, moduleTitle: 'Fundamentals of Economics' },
    { title: 'Inflation, GDP & National Income Basics', duration: 30, order: 25, moduleOrder: 5, moduleTitle: 'Fundamentals of Economics' },
    
    // Module 6: Commerce in Real Life & Career Pathways
    { title: 'Commerce in Daily Life', duration: 20, order: 26, moduleOrder: 6, moduleTitle: 'Commerce in Real Life & Career Pathways' },
    { title: 'Banking, Insurance & Financial Markets Basics', duration: 30, order: 27, moduleOrder: 6, moduleTitle: 'Commerce in Real Life & Career Pathways' },
    { title: 'Digital Commerce & E-Business', duration: 25, order: 28, moduleOrder: 6, moduleTitle: 'Commerce in Real Life & Career Pathways' },
    { title: 'Career Options after Commerce', duration: 25, order: 29, moduleOrder: 6, moduleTitle: 'Commerce in Real Life & Career Pathways' },
    { title: 'How to Study Commerce Effectively', duration: 20, order: 30, moduleOrder: 6, moduleTitle: 'Commerce in Real Life & Career Pathways' },
  ]

  console.log('\n📚 Creating 30 Lessons (6 Modules × 5 Lessons)...')

  for (const lesson of lessons) {
    const lessonId = `lesson-commerce-${lesson.order}`
    await prisma.lesson.upsert({
      where: { id: lessonId },
      update: {},
      create: {
        id: lessonId,
        title: lesson.title,
        duration: lesson.duration,
        order: lesson.order,
        isActive: true,
        courseId: course.id,
        content: `# ${lesson.title}

**Module ${lesson.moduleOrder}: ${lesson.moduleTitle}**

---

## Overview
This lesson covers **${lesson.title}**.

## Learning Objectives
By the end of this lesson, you will be able to:
1. Understand the fundamentals of ${lesson.title.toLowerCase()}
2. Apply concepts to real-world scenarios
3. Build a strong foundation for advanced topics

## Key Topics

### Main Concept
- Core concept 1
- Core concept 2
- Core concept 3

### Practical Application
- Real-world examples
- Case studies
- Practice exercises

## Summary
This lesson has covered the key aspects of ${lesson.title}. Make sure to review the practice questions and proceed to the next lesson.

## Resources
- Downloadable PDF notes
- Practice exercises
- Summary sheet`,
      },
    })
    console.log(`✅ Lesson ${lesson.order}: ${lesson.title}`)
  }

  // ============================================================================
  // 6. CREATE ASSESSMENT
  // ============================================================================

  await prisma.assessment.upsert({
    where: { id: 'assessment-commerce-basics' },
    update: {},
    create: {
      id: 'assessment-commerce-basics',
      title: 'Commerce Basics Final Assessment',
      type: 'QUIZ',
      isActive: true,
      courseId: course.id,
    },
  })

  console.log('✅ Assessment created')

  // ============================================================================
  // SUMMARY
  // ============================================================================

  console.log('\n' + '='.repeat(60))
  console.log('🎉 Commerce Basics course created successfully!')
  console.log('='.repeat(60))
  console.log(`\n📖 Course: ${course.title}`)
  console.log(`👨‍🏫 Instructor: ${instructor.name}`)
  console.log(`📁 Category: ${category.name}`)
  console.log(`\n📊 Structure Summary:`)
  console.log(`   📚 Total Modules: ${modules.length}`)
  console.log(`   📝 Total Lessons: ${lessons.length}`)
  console.log(`   ⏱️ Total Duration: ${course.duration} minutes (${course.duration / 60} hours)`)
  console.log(`   📊 Difficulty: ${course.difficulty}`)
  console.log(`\n📚 Modules Breakdown:`)
  
  for (const mod of modules) {
    const modLessons = lessons.filter(l => l.moduleOrder === mod.sortOrder)
    const totalDuration = modLessons.reduce((sum, l) => sum + l.duration, 0)
    console.log(`   ${mod.sortOrder}. ${mod.title} (${modLessons.length} lessons, ${totalDuration} min)`)
  }
  
  console.log('\n✅ Ready to publish!')
}

main()
  .catch((e) => {
    console.error('❌ Error creating course:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
