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
      isFeatured: true,
      instructorId: instructor.id,
      categoryId: category.id,
      subCategoryId: 'sub-commerce-accountancy',
    },
  })

  console.log(`✅ Course created: ${course.title}`)

  // ============================================================================
  // 5. CREATE MODULES
  // ============================================================================

  const modules = [
    {
      id: 'mod-commerce-intro',
      title: 'Introduction to Commerce',
      description: 'Build clarity about what commerce is and why it matters.',
      sortOrder: 1,
      duration: 150, // 2.5 hours
      lessons: [
        { title: 'Meaning & Scope of Commerce', duration: 30, sortOrder: 1 },
        { title: 'Trade, Industry & Aids to Trade', duration: 30, sortOrder: 2 },
        { title: 'Commerce vs Business vs Economics', duration: 20, sortOrder: 3 },
        { title: 'Evolution of Commerce in India', duration: 20, sortOrder: 4 },
        { title: 'Role of Commerce in Economic Development', duration: 20, sortOrder: 5 },
      ],
    },
    {
      id: 'mod-commerce-accountancy',
      title: 'Fundamentals of Accountancy',
      description: 'Remove fear of accounts and build logical understanding.',
      sortOrder: 2,
      duration: 180, // 3 hours
      lessons: [
        { title: 'What is Accounting? Objectives & Users', duration: 25, sortOrder: 1 },
        { title: 'Basic Accounting Terms & Concepts', duration: 30, sortOrder: 2 },
        { title: 'Accounting Principles & Conventions', duration: 25, sortOrder: 3 },
        { title: 'Types of Accounts & Golden Rules', duration: 30, sortOrder: 4 },
        { title: 'Introduction to Journal Entries', duration: 35, sortOrder: 5 },
        { title: 'Trial Balance – Meaning & Purpose', duration: 35, sortOrder: 6 },
      ],
    },
    {
      id: 'mod-commerce-business-org',
      title: 'Business Studies – Business Organization',
      description: 'Understand how businesses are formed and run.',
      sortOrder: 3,
      duration: 150, // 2.5 hours
      lessons: [
        { title: 'Meaning, Nature & Objectives of Business', duration: 25, sortOrder: 1 },
        { title: 'Forms of Business Organization (Sole, Partnership, Company)', duration: 40, sortOrder: 2 },
        { title: 'Public vs Private Sector Enterprises', duration: 20, sortOrder: 3 },
        { title: 'Business Risk & Risk Management', duration: 20, sortOrder: 4 },
        { title: 'Startup & MSME Ecosystem in India', duration: 25, sortOrder: 5 },
      ],
    },
    {
      id: 'mod-commerce-env',
      title: 'Business Environment & Management Basics',
      description: 'Learn how external factors affect business decisions.',
      sortOrder: 4,
      duration: 150, // 2.5 hours
      lessons: [
        { title: 'Business Environment – Meaning & Importance', duration: 25, sortOrder: 1 },
        { title: 'Economic, Social & Legal Environment', duration: 30, sortOrder: 2 },
        { title: 'Introduction to Management & Its Functions', duration: 30, sortOrder: 3 },
        { title: 'Planning, Organising & Staffing', duration: 30, sortOrder: 4 },
        { title: 'Leadership, Motivation & Control', duration: 25, sortOrder: 5 },
      ],
    },
    {
      id: 'mod-commerce-economics',
      title: 'Fundamentals of Economics',
      description: 'Build economic thinking for real-world decision making.',
      sortOrder: 5,
      duration: 150, // 2.5 hours
      lessons: [
        { title: 'What is Economics? Micro vs Macro', duration: 25, sortOrder: 1 },
        { title: 'Basic Economic Problems & Opportunity Cost', duration: 25, sortOrder: 2 },
        { title: 'Demand – Meaning, Law & Factors', duration: 30, sortOrder: 3 },
        { title: 'Supply – Meaning & Market Equilibrium', duration: 30, sortOrder: 4 },
        { title: 'Inflation, GDP & National Income Basics', duration: 30, sortOrder: 5 },
      ],
    },
    {
      id: 'mod-commerce-real-life',
      title: 'Commerce in Real Life & Career Pathways',
      description: 'Connect theory with practical applications & careers.',
      sortOrder: 6,
      duration: 120, // 2 hours
      lessons: [
        { title: 'Commerce in Daily Life', duration: 20, sortOrder: 1 },
        { title: 'Banking, Insurance & Financial Markets Basics', duration: 30, sortOrder: 2 },
        { title: 'Digital Commerce & E-Business', duration: 25, sortOrder: 3 },
        { title: 'Career Options after Commerce (CA, CS, CMA, MBA, Govt Jobs)', duration: 25, sortOrder: 4 },
        { title: 'How to Study Commerce Effectively', duration: 20, sortOrder: 5 },
      ],
    },
  ]

  console.log('\n📚 Creating Modules and Lessons...')

  for (const mod of modules) {
    // Create module
    const moduleRecord = await prisma.module.upsert({
      where: { id: mod.id },
      update: {},
      create: {
        id: mod.id,
        title: mod.title,
        description: mod.description,
        sortOrder: mod.sortOrder,
        duration: mod.duration,
        courseId: course.id,
      },
    })

    console.log(`✅ Module created: ${mod.title}`)

    // Create lessons for this module
    for (const lesson of mod.lessons) {
      await prisma.lesson.upsert({
        where: { id: `${mod.id}-lesson-${lesson.sortOrder}` },
        update: {},
        create: {
          id: `${mod.id}-lesson-${lesson.sortOrder}`,
          title: lesson.title,
          sortOrder: lesson.sortOrder,
          duration: lesson.duration,
          type: 'VIDEO',
          isFree: lesson.sortOrder === 1, // First lesson of each module is free
          moduleId: moduleRecord.id,
          courseId: course.id,
          content: `# ${lesson.title}

## Overview
This lesson covers ${lesson.title.toLowerCase()}.

## Key Topics
- Topic 1
- Topic 2
- Topic 3

## Learning Objectives
By the end of this lesson, you will be able to:
1. Understand the fundamentals
2. Apply concepts to real scenarios
3. Build a strong foundation for advanced topics

## Resources
- Downloadable PDF notes
- Practice exercises
- Summary sheet`,
        },
      })
      console.log(`  ✅ Lesson: ${lesson.title}`)
    }
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
      description: 'Test your knowledge of commerce fundamentals',
      type: 'QUIZ',
      duration: 30, // 30 minutes
      passingScore: 60,
      maxAttempts: 3,
      isActive: true,
      courseId: course.id,
    },
  })

  console.log('✅ Assessment created: Commerce Basics Final Assessment')

  // ============================================================================
  // 7. CREATE CERTIFICATE TEMPLATE
  // ============================================================================

  await prisma.certificateTemplate.upsert({
    where: { id: 'cert-commerce-basics' },
    update: {},
    create: {
      id: 'cert-commerce-basics',
      name: 'Commerce Basics Certificate',
      description: 'Certificate of Completion for Commerce Basics Course',
      courseId: course.id,
    },
  })

  console.log('✅ Certificate template created')

  // ============================================================================
  // SUMMARY
  // ============================================================================

  console.log('\n🎉 Commerce Basics course created successfully!')
  console.log('\n📊 Course Structure:')
  console.log(`   📖 Course: ${course.title}`)
  console.log(`   👨‍🏫 Instructor: ${instructor.name}`)
  console.log(`   📁 Category: ${category.name}`)
  console.log(`   📚 Modules: ${modules.length}`)
  console.log(`   📝 Total Lessons: ${modules.reduce((sum, mod) => sum + mod.lessons.length, 0)}`)
  console.log(`   ⏱️ Total Duration: ${course.duration} minutes (${course.duration / 60} hours)`)
  console.log(`   📊 Difficulty: ${course.difficulty}`)
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
