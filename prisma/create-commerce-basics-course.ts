/**
 * Seed Script: Commerce Basics Course
 * A complete intermediate-level course for college students
 * Covers: Accountancy, Business Studies, Economics
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Commerce Basics course creation...')

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
    {
      id: 'sub-commerce-accountancy',
      name: 'Accountancy',
      slug: 'accountancy',
      description: 'Fundamentals of accounting and financial recording',
      icon: '📊',
      color: '#3B82F6',
      sortOrder: 1,
    },
    {
      id: 'sub-commerce-business',
      name: 'Business Studies',
      slug: 'business-studies',
      description: 'Business organization, management, and operations',
      icon: '🏢',
      color: '#10B981',
      sortOrder: 2,
    },
    {
      id: 'sub-commerce-economics',
      name: 'Economics',
      slug: 'economics',
      description: 'Micro and macroeconomics fundamentals',
      icon: '📈',
      color: '#F59E0B',
      sortOrder: 3,
    },
  ]

  for (const sub of subcategories) {
    await prisma.subCategory.upsert({
      where: { id: sub.id },
      update: {},
      create: {
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        description: sub.description,
        icon: sub.icon,
        color: sub.color,
        sortOrder: sub.sortOrder,
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
      subCategoryId: 'sub-commerce-accountancy',
    },
  })

  console.log(`✅ Course created: ${course.title}`)

  // ============================================================================
  // 5. CREATE LESSONS (Directly linked to course, no modules)
  // ============================================================================

  const lessons = [
    // Module 1: Introduction to Commerce (2.5 Hours = 150 min)
    { title: 'Meaning & Scope of Commerce', duration: 30, order: 1 },
    { title: 'Trade, Industry & Aids to Trade', duration: 30, order: 2 },
    { title: 'Commerce vs Business vs Economics', duration: 20, order: 3 },
    { title: 'Evolution of Commerce in India', duration: 20, order: 4 },
    { title: 'Role of Commerce in Economic Development', duration: 20, order: 5 },
    
    // Module 2: Fundamentals of Accountancy (3 Hours = 180 min)
    { title: 'What is Accounting? Objectives & Users', duration: 25, order: 6 },
    { title: 'Basic Accounting Terms & Concepts', duration: 30, order: 7 },
    { title: 'Accounting Principles & Conventions', duration: 25, order: 8 },
    { title: 'Types of Accounts & Golden Rules', duration: 30, order: 9 },
    { title: 'Introduction to Journal Entries', duration: 35, order: 10 },
    { title: 'Trial Balance – Meaning & Purpose', duration: 35, order: 11 },
    
    // Module 3: Business Studies – Business Organization (2.5 Hours = 150 min)
    { title: 'Meaning, Nature & Objectives of Business', duration: 25, order: 12 },
    { title: 'Forms of Business Organization (Sole, Partnership, Company)', duration: 40, order: 13 },
    { title: 'Public vs Private Sector Enterprises', duration: 20, order: 14 },
    { title: 'Business Risk & Risk Management', duration: 20, order: 15 },
    { title: 'Startup & MSME Ecosystem in India', duration: 25, order: 16 },
    
    // Module 4: Business Environment & Management Basics (2.5 Hours = 150 min)
    { title: 'Business Environment – Meaning & Importance', duration: 25, order: 17 },
    { title: 'Economic, Social & Legal Environment', duration: 30, order: 18 },
    { title: 'Introduction to Management & Its Functions', duration: 30, order: 19 },
    { title: 'Planning, Organising & Staffing', duration: 30, order: 20 },
    { title: 'Leadership, Motivation & Control', duration: 25, order: 21 },
    
    // Module 5: Fundamentals of Economics (2.5 Hours = 150 min)
    { title: 'What is Economics? Micro vs Macro', duration: 25, order: 22 },
    { title: 'Basic Economic Problems & Opportunity Cost', duration: 25, order: 23 },
    { title: 'Demand – Meaning, Law & Factors', duration: 30, order: 24 },
    { title: 'Supply – Meaning & Market Equilibrium', duration: 30, order: 25 },
    { title: 'Inflation, GDP & National Income Basics', duration: 30, order: 26 },
    
    // Module 6: Commerce in Real Life & Career Pathways (2 Hours = 120 min)
    { title: 'Commerce in Daily Life', duration: 20, order: 27 },
    { title: 'Banking, Insurance & Financial Markets Basics', duration: 30, order: 28 },
    { title: 'Digital Commerce & E-Business', duration: 25, order: 29 },
    { title: 'Career Options after Commerce (CA, CS, CMA, MBA, Govt Jobs)', duration: 25, order: 30 },
    { title: 'How to Study Commerce Effectively', duration: 20, order: 31 },
  ]

  console.log('\n📚 Creating Lessons...')

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

## Overview
This lesson covers **${lesson.title}**.

## Learning Objectives
By the end of this lesson, you will be able to:
1. Understand the fundamentals of ${lesson.title.toLowerCase()}
2. Apply concepts to real-world scenarios
3. Build a strong foundation for advanced topics

## Key Topics

### Main Concept
- Topic 1 explanation
- Topic 2 explanation
- Topic 3 explanation

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

  console.log('✅ Assessment created: Commerce Basics Final Assessment')

  // ============================================================================
  // SUMMARY
  // ============================================================================

  console.log('\n🎉 Commerce Basics course created successfully!')
  console.log('\n📊 Course Structure:')
  console.log(`   📖 Course: ${course.title}`)
  console.log(`   👨‍🏫 Instructor: ${instructor.name}`)
  console.log(`   📁 Category: ${category.name}`)
  console.log(`   📚 Subcategories: ${subcategories.length} (Accountancy, Business Studies, Economics)`)
  console.log(`   📝 Total Lessons: ${lessons.length}`)
  console.log(`   ⏱️ Total Duration: ${course.duration} minutes (${course.duration / 60} hours)`)
  console.log(`   📊 Difficulty: ${course.difficulty}`)
  console.log(`   🎯 Assessment: Final Quiz (30 minutes)`)
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
