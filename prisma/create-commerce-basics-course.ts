/**
 * Seed Script: Commerce Basics Course
 * A complete intermediate-level course for college students
 * Covers: Accountancy, Business Studies, Economics
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Module definitions for organizing lessons
const modules = [
  {
    id: 'mod-commerce-1',
    title: 'Module 1: Introduction to Commerce',
    description: 'Build clarity about what commerce is and why it matters.',
    purpose: 'Build clarity about what commerce is and why it matters.',
    sortOrder: 1,
    totalDuration: 150, // 2.5 hours
  },
  {
    id: 'mod-commerce-2',
    title: 'Module 2: Fundamentals of Accountancy',
    description: 'Remove fear of accounts and build logical understanding.',
    purpose: 'Remove fear of accounts and build logical understanding.',
    sortOrder: 2,
    totalDuration: 180, // 3 hours
  },
  {
    id: 'mod-commerce-3',
    title: 'Module 3: Business Studies – Business Organization',
    description: 'Understand how businesses are formed and run.',
    purpose: 'Understand how businesses are formed and run.',
    sortOrder: 3,
    totalDuration: 150, // 2.5 hours
  },
  {
    id: 'mod-commerce-4',
    title: 'Module 4: Business Environment & Management Basics',
    description: 'Learn how external factors affect business decisions.',
    purpose: 'Learn how external factors affect business decisions.',
    sortOrder: 4,
    totalDuration: 150, // 2.5 hours
  },
  {
    id: 'mod-commerce-5',
    title: 'Module 5: Fundamentals of Economics',
    description: 'Build economic thinking for real-world decision making.',
    purpose: 'Build economic thinking for real-world decision making.',
    sortOrder: 5,
    totalDuration: 150, // 2.5 hours
  },
  {
    id: 'mod-commerce-6',
    title: 'Module 6: Commerce in Real Life & Career Pathways',
    description: 'Connect theory with practical applications & careers.',
    purpose: 'Connect theory with practical applications & careers.',
    sortOrder: 6,
    totalDuration: 120, // 2 hours
  },
]

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
  // 5. CREATE LESSONS BY MODULE
  // ============================================================================

  const lessons = [
    // 🧩 Module 1: Introduction to Commerce (2.5 Hours = 150 min)
    // Purpose: Build clarity about what commerce is and why it matters.
    {
      moduleTitle: 'Module 1: Introduction to Commerce',
      modulePurpose: 'Purpose: Build clarity about what commerce is and why it matters.',
      title: 'Meaning & Scope of Commerce',
      duration: 30,
      order: 1,
      moduleOrder: 1,
    },
    {
      moduleTitle: 'Module 1: Introduction to Commerce',
      modulePurpose: 'Purpose: Build clarity about what commerce is and why it matters.',
      title: 'Trade, Industry & Aids to Trade',
      duration: 30,
      order: 2,
      moduleOrder: 1,
    },
    {
      moduleTitle: 'Module 1: Introduction to Commerce',
      modulePurpose: 'Purpose: Build clarity about what commerce is and why it matters.',
      title: 'Commerce vs Business vs Economics',
      duration: 20,
      order: 3,
      moduleOrder: 1,
    },
    {
      moduleTitle: 'Module 1: Introduction to Commerce',
      modulePurpose: 'Purpose: Build clarity about what commerce is and why it matters.',
      title: 'Evolution of Commerce in India',
      duration: 20,
      order: 4,
      moduleOrder: 1,
    },
    {
      moduleTitle: 'Module 1: Introduction to Commerce',
      modulePurpose: 'Purpose: Build clarity about what commerce is and why it matters.',
      title: 'Role of Commerce in Economic Development',
      duration: 20,
      order: 5,
      moduleOrder: 1,
    },
    
    // 🧮 Module 2: Fundamentals of Accountancy (3 Hours = 180 min)
    // Purpose: Remove fear of accounts and build logical understanding.
    {
      moduleTitle: 'Module 2: Fundamentals of Accountancy',
      modulePurpose: 'Purpose: Remove fear of accounts and build logical understanding.',
      title: 'What is Accounting? Objectives & Users',
      duration: 25,
      order: 6,
      moduleOrder: 2,
    },
    {
      moduleTitle: 'Module 2: Fundamentals of Accountancy',
      modulePurpose: 'Purpose: Remove fear of accounts and build logical understanding.',
      title: 'Basic Accounting Terms & Concepts',
      duration: 30,
      order: 7,
      moduleOrder: 2,
    },
    {
      moduleTitle: 'Module 2: Fundamentals of Accountancy',
      modulePurpose: 'Purpose: Remove fear of accounts and build logical understanding.',
      title: 'Accounting Principles & Conventions',
      duration: 25,
      order: 8,
      moduleOrder: 2,
    },
    {
      moduleTitle: 'Module 2: Fundamentals of Accountancy',
      modulePurpose: 'Purpose: Remove fear of accounts and build logical understanding.',
      title: 'Types of Accounts & Golden Rules',
      duration: 30,
      order: 9,
      moduleOrder: 2,
    },
    {
      moduleTitle: 'Module 2: Fundamentals of Accountancy',
      modulePurpose: 'Purpose: Remove fear of accounts and build logical understanding.',
      title: 'Introduction to Journal Entries',
      duration: 35,
      order: 10,
      moduleOrder: 2,
    },
    
    // 🏢 Module 3: Business Studies – Business Organization (2.5 Hours = 150 min)
    // Purpose: Understand how businesses are formed and run.
    {
      moduleTitle: 'Module 3: Business Studies – Business Organization',
      modulePurpose: 'Purpose: Understand how businesses are formed and run.',
      title: 'Meaning, Nature & Objectives of Business',
      duration: 25,
      order: 11,
      moduleOrder: 3,
    },
    {
      moduleTitle: 'Module 3: Business Studies – Business Organization',
      modulePurpose: 'Purpose: Understand how businesses are formed and run.',
      title: 'Forms of Business Organization',
      duration: 40,
      order: 12,
      moduleOrder: 3,
    },
    {
      moduleTitle: 'Module 3: Business Studies – Business Organization',
      modulePurpose: 'Purpose: Understand how businesses are formed and run.',
      title: 'Public vs Private Sector Enterprises',
      duration: 20,
      order: 13,
      moduleOrder: 3,
    },
    {
      moduleTitle: 'Module 3: Business Studies – Business Organization',
      modulePurpose: 'Purpose: Understand how businesses are formed and run.',
      title: 'Business Risk & Risk Management',
      duration: 20,
      order: 14,
      moduleOrder: 3,
    },
    {
      moduleTitle: 'Module 3: Business Studies – Business Organization',
      modulePurpose: 'Purpose: Understand how businesses are formed and run.',
      title: 'Startup & MSME Ecosystem in India',
      duration: 25,
      order: 15,
      moduleOrder: 3,
    },
    
    // 📊 Module 4: Business Environment & Management Basics (2.5 Hours = 150 min)
    // Purpose: Learn how external factors affect business decisions.
    {
      moduleTitle: 'Module 4: Business Environment & Management Basics',
      modulePurpose: 'Purpose: Learn how external factors affect business decisions.',
      title: 'Business Environment – Meaning & Importance',
      duration: 25,
      order: 16,
      moduleOrder: 4,
    },
    {
      moduleTitle: 'Module 4: Business Environment & Management Basics',
      modulePurpose: 'Purpose: Learn how external factors affect business decisions.',
      title: 'Economic, Social & Legal Environment',
      duration: 30,
      order: 17,
      moduleOrder: 4,
    },
    {
      moduleTitle: 'Module 4: Business Environment & Management Basics',
      modulePurpose: 'Purpose: Learn how external factors affect business decisions.',
      title: 'Introduction to Management & Its Functions',
      duration: 30,
      order: 18,
      moduleOrder: 4,
    },
    {
      moduleTitle: 'Module 4: Business Environment & Management Basics',
      modulePurpose: 'Purpose: Learn how external factors affect business decisions.',
      title: 'Planning, Organising & Staffing',
      duration: 30,
      order: 19,
      moduleOrder: 4,
    },
    {
      moduleTitle: 'Module 4: Business Environment & Management Basics',
      modulePurpose: 'Purpose: Learn how external factors affect business decisions.',
      title: 'Leadership, Motivation & Control',
      duration: 25,
      order: 20,
      moduleOrder: 4,
    },
    
    // 🌍 Module 5: Fundamentals of Economics (2.5 Hours = 150 min)
    // Purpose: Build economic thinking for real-world decision making.
    {
      moduleTitle: 'Module 5: Fundamentals of Economics',
      modulePurpose: 'Purpose: Build economic thinking for real-world decision making.',
      title: 'What is Economics? Micro vs Macro',
      duration: 25,
      order: 21,
      moduleOrder: 5,
    },
    {
      moduleTitle: 'Module 5: Fundamentals of Economics',
      modulePurpose: 'Purpose: Build economic thinking for real-world decision making.',
      title: 'Basic Economic Problems & Opportunity Cost',
      duration: 25,
      order: 22,
      moduleOrder: 5,
    },
    {
      moduleTitle: 'Module 5: Fundamentals of Economics',
      modulePurpose: 'Purpose: Build economic thinking for real-world decision making.',
      title: 'Demand – Meaning, Law & Factors',
      duration: 30,
      order: 23,
      moduleOrder: 5,
    },
    {
      moduleTitle: 'Module 5: Fundamentals of Economics',
      modulePurpose: 'Purpose: Build economic thinking for real-world decision making.',
      title: 'Supply – Meaning & Market Equilibrium',
      duration: 30,
      order: 24,
      moduleOrder: 5,
    },
    {
      moduleTitle: 'Module 5: Fundamentals of Economics',
      modulePurpose: 'Purpose: Build economic thinking for real-world decision making.',
      title: 'Inflation, GDP & National Income Basics',
      duration: 30,
      order: 25,
      moduleOrder: 5,
    },
    
    // 💼 Module 6: Commerce in Real Life & Career Pathways (2 Hours = 120 min)
    // Purpose: Connect theory with practical applications & careers.
    {
      moduleTitle: 'Module 6: Commerce in Real Life & Career Pathways',
      modulePurpose: 'Purpose: Connect theory with practical applications & careers.',
      title: 'Commerce in Daily Life',
      duration: 20,
      order: 26,
      moduleOrder: 6,
    },
    {
      moduleTitle: 'Module 6: Commerce in Real Life & Career Pathways',
      modulePurpose: 'Purpose: Connect theory with practical applications & careers.',
      title: 'Banking, Insurance & Financial Markets Basics',
      duration: 30,
      order: 27,
      moduleOrder: 6,
    },
    {
      moduleTitle: 'Module 6: Commerce in Real Life & Career Pathways',
      modulePurpose: 'Purpose: Connect theory with practical applications & careers.',
      title: 'Digital Commerce & E-Business',
      duration: 25,
      order: 28,
      moduleOrder: 6,
    },
    {
      moduleTitle: 'Module 6: Commerce in Real Life & Career Pathways',
      modulePurpose: 'Purpose: Connect theory with practical applications & careers.',
      title: 'Career Options after Commerce',
      duration: 25,
      order: 29,
      moduleOrder: 6,
    },
    {
      moduleTitle: 'Module 6: Commerce in Real Life & Career Pathways',
      modulePurpose: 'Purpose: Connect theory with practical applications & careers.',
      title: 'How to Study Commerce Effectively',
      duration: 20,
      order: 30,
      moduleOrder: 6,
    },
  ]

  console.log('\n📚 Creating Lessons by Module...')

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

---

## 🧩 ${lesson.moduleTitle}

${lesson.modulePurpose}

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

  console.log('✅ Assessment created: Commerce Basics Final Assessment')

  // ============================================================================
  // SUMMARY
  // ============================================================================

  console.log('\n🎉 Commerce Basics course created successfully!')
  console.log('\n📊 Course Structure:')
  console.log(`   📖 Course: ${course.title}`)
  console.log(`   👨‍🏫 Instructor: ${instructor.name}`)
  console.log(`   📁 Category: ${category.name}`)
  console.log(`   📚 Subcategories: 3 (Accountancy, Business Studies, Economics)`)
  console.log(`   📚 Total Modules: ${modules.length}`)
  console.log(`   📝 Total Lessons: ${lessons.length}`)
  console.log(`   ⏱️ Total Duration: ${course.duration} minutes (${course.duration / 60} hours)`)
  console.log(`   📊 Difficulty: ${course.difficulty}`)
  console.log(`   🎯 Assessment: Final Quiz`)
  console.log('\n📚 Modules Breakdown:')
  for (const mod of modules) {
    const modLessons = lessons.filter(l => l.moduleOrder === mod.sortOrder)
    const totalDuration = modLessons.reduce((sum, l) => sum + l.duration, 0)
    console.log(`   ${mod.sortOrder}. ${mod.title} - ${modLessons.length} lessons (${totalDuration} min)`)
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
