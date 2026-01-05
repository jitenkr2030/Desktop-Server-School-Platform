/**
 * Seed Script: Professional Courses Category
 * Contains: CA (3 courses), CS (2 courses), CMA (3 courses), CFA (3 courses), FRM (2 courses), Actuarial (1 course)
 * Total: 14 courses
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Professional Courses Category...')

  // ============================================================================
  // CREATE INSTRUCTOR
  // ============================================================================
  
  const instructor = await prisma.instructor.upsert({
    where: { id: 'inst-professional-courses' },
    update: {},
    create: {
      id: 'inst-professional-courses',
      name: 'Professional Courses Faculty',
      title: 'CA, CS, CMA & Finance Expert',
      bio: 'Expert faculty specializing in Chartered Accountancy, Company Secretary, Cost Management, CFA, FRM, and Actuarial Science.',
      expertise: 'CA, CS, CMA, CFA, FRM, Actuarial',
      isActive: true,
    },
  })
  
  console.log(`✅ Instructor created: ${instructor.name}`)

  // ============================================================================
  // CATEGORY: PROFESSIONAL COURSES
  // ============================================================================

  const professionalCategory = await prisma.category.upsert({
    where: { id: 'cat-professional-courses' },
    update: {},
    create: {
      id: 'cat-professional-courses',
      name: 'Professional Courses',
      slug: 'professional-courses',
      description: 'Expert preparation for prestigious professional exams including Chartered Accountancy, Company Secretary, Cost Management, CFA, FRM, and Actuarial Science.',
      icon: '📊',
      color: '#7E57C2',
      sortOrder: 6,
      isActive: true,
      isFeatured: true,
    },
  })

  console.log(`✅ Category created: ${professionalCategory.name}`)

  // Create subcategories
  const subcategories = [
    { id: 'prof-ca', name: 'Chartered Accountant', slug: 'chartered-accountant', description: 'CA Foundation, Intermediate, and Final', categoryId: professionalCategory.id },
    { id: 'prof-cs', name: 'Company Secretary', slug: 'company-secretary', description: 'CS Executive and Professional', categoryId: professionalCategory.id },
    { id: 'prof-cma', name: 'CMA', slug: 'cost-management', description: 'Cost and Management Accounting', categoryId: professionalCategory.id },
    { id: 'prof-cfa', name: 'CFA', slug: 'chartered-financial', description: 'Chartered Financial Analyst', categoryId: professionalCategory.id },
    { id: 'prof-frm', name: 'FRM', slug: 'financial-risk', description: 'Financial Risk Manager', categoryId: professionalCategory.id },
    { id: 'prof-actuarial', name: 'Actuarial Science', slug: 'actuarial-science', description: 'Actuarial Science examinations', categoryId: professionalCategory.id },
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
        categoryId: sub.categoryId,
        icon: '📈',
        color: '#26A69A',
        sortOrder: 1,
        isActive: true,
      },
    })
    console.log(`✅ Subcategory created: ${sub.name}`)
  }

  // ============================================================================
  // CHARTERED ACCOUNTANT COURSES (3 courses)
  // ============================================================================

  // Course 1: CA Foundation
  await prisma.course.upsert({
    where: { id: 'ca_foundation' },
    update: {},
    create: {
      id: 'ca_foundation',
      title: 'CA Foundation Complete Course',
      description: 'Complete preparation for Chartered Accountancy Foundation examination covering all four papers.',
      thumbnail: '/assets/courses/ca_foundation.svg',
      duration: 6000, // 100 hours
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: professionalCategory.id,
      subCategoryId: 'prof-ca',
    },
  })

  console.log('✅ CA Foundation course created')

  // Course 2: CA Intermediate
  await prisma.course.upsert({
    where: { id: 'ca_intermediate' },
    update: {},
    create: {
      id: 'ca_intermediate',
      title: 'CA Intermediate Complete Course',
      description: 'Complete preparation for Chartered Accountancy Intermediate examination with advanced accounting, law, taxation.',
      thumbnail: '/assets/courses/ca_intermediate.svg',
      duration: 10000, // 167 hours
      difficulty: 'ADVANCED',
      isActive: true,
      instructorId: instructor.id,
      categoryId: professionalCategory.id,
      subCategoryId: 'prof-ca',
    },
  })

  console.log('✅ CA Intermediate course created')

  // Course 3: CA Final
  await prisma.course.upsert({
    where: { id: 'ca_final' },
    update: {},
    create: {
      id: 'ca_final',
      title: 'CA Final Complete Course',
      description: 'Complete preparation for Chartered Accountancy Final examination with advanced auditing and strategic finance.',
      thumbnail: '/assets/courses/ca_final.svg',
      duration: 15000, // 250 hours
      difficulty: 'ADVANCED',
      isActive: true,
      instructorId: instructor.id,
      categoryId: professionalCategory.id,
      subCategoryId: 'prof-ca',
    },
  })

  console.log('✅ CA Final course created')

  // ============================================================================
  // COMPANY SECRETARY COURSES (2 courses)
  // ============================================================================

  // Course 4: CS Executive
  await prisma.course.upsert({
    where: { id: 'cs_executive' },
    update: {},
    create: {
      id: 'cs_executive',
      title: 'CS Executive Complete Course',
      description: 'Complete preparation for Company Secretary Executive examination covering Company Law and Securities Law.',
      thumbnail: '/assets/courses/cs_executive.svg',
      duration: 7000, // 117 hours
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: professionalCategory.id,
      subCategoryId: 'prof-cs',
    },
  })

  console.log('✅ CS Executive course created')

  // Course 5: CS Professional
  await prisma.course.upsert({
    where: { id: 'cs_professional' },
    update: {},
    create: {
      id: 'cs_professional',
      title: 'CS Professional Complete Course',
      description: 'Complete preparation for Company Secretary Professional examination with advanced corporate governance.',
      thumbnail: '/assets/courses/cs_professional.svg',
      duration: 9000, // 150 hours
      difficulty: 'ADVANCED',
      isActive: true,
      instructorId: instructor.id,
      categoryId: professionalCategory.id,
      subCategoryId: 'prof-cs',
    },
  })

  console.log('✅ CS Professional course created')

  // ============================================================================
  // CMA COURSES (3 courses)
  // ============================================================================

  // Course 6: CMA Foundation
  await prisma.course.upsert({
    where: { id: 'cma_foundation' },
    update: {},
    create: {
      id: 'cma_foundation',
      title: 'CMA Foundation Complete Course',
      description: 'Complete preparation for Cost and Management Accounting Foundation examination.',
      thumbnail: '/assets/courses/cma_foundation.svg',
      duration: 4500, // 75 hours
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: professionalCategory.id,
      subCategoryId: 'prof-cma',
    },
  })

  console.log('✅ CMA Foundation course created')

  // Course 7: CMA Intermediate
  await prisma.course.upsert({
    where: { id: 'cma_intermediate' },
    update: {},
    create: {
      id: 'cma_intermediate',
      title: 'CMA Intermediate Complete Course',
      description: 'Complete preparation for Cost and Management Accounting Intermediate examination.',
      thumbnail: '/assets/courses/cma_intermediate.svg',
      duration: 7000, // 117 hours
      difficulty: 'ADVANCED',
      isActive: true,
      instructorId: instructor.id,
      categoryId: professionalCategory.id,
      subCategoryId: 'prof-cma',
    },
  })

  console.log('✅ CMA Intermediate course created')

  // Course 8: CMA Final
  await prisma.course.upsert({
    where: { id: 'cma_final' },
    update: {},
    create: {
      id: 'cma_final',
      title: 'CMA Final Complete Course',
      description: 'Complete preparation for Cost and Management Accounting Final examination.',
      thumbnail: '/assets/courses/cma_final.svg',
      duration: 10000, // 167 hours
      difficulty: 'ADVANCED',
      isActive: true,
      instructorId: instructor.id,
      categoryId: professionalCategory.id,
      subCategoryId: 'prof-cma',
    },
  })

  console.log('✅ CMA Final course created')

  // ============================================================================
  // CFA COURSES (3 courses)
  // ============================================================================

  // Course 9: CFA Level 1
  await prisma.course.upsert({
    where: { id: 'cfa_level1' },
    update: {},
    create: {
      id: 'cfa_level1',
      title: 'CFA Level 1 Complete Course',
      description: 'Complete preparation for CFA Level I examination covering ethical standards, quantitative methods, and financial analysis.',
      thumbnail: '/assets/courses/cfa_level1.svg',
      duration: 12000, // 200 hours
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: professionalCategory.id,
      subCategoryId: 'prof-cfa',
    },
  })

  console.log('✅ CFA Level 1 course created')

  // Course 10: CFA Level 2
  await prisma.course.upsert({
    where: { id: 'cfa_level2' },
    update: {},
    create: {
      id: 'cfa_level2',
      title: 'CFA Level 2 Complete Course',
      description: 'Complete preparation for CFA Level II examination with advanced valuation methods and case studies.',
      thumbnail: '/assets/courses/cfa_level2.svg',
      duration: 15000, // 250 hours
      difficulty: 'ADVANCED',
      isActive: true,
      instructorId: instructor.id,
      categoryId: professionalCategory.id,
      subCategoryId: 'prof-cfa',
    },
  })

  console.log('✅ CFA Level 2 course created')

  // Course 11: CFA Level 3
  await prisma.course.upsert({
    where: { id: 'cfa_level3' },
    update: {},
    create: {
      id: 'cfa_level3',
      title: 'CFA Level 3 Complete Course',
      description: 'Complete preparation for CFA Level III examination focusing on portfolio management and wealth planning.',
      thumbnail: '/assets/courses/cfa_level3.svg',
      duration: 18000, // 300 hours
      difficulty: 'ADVANCED',
      isActive: true,
      instructorId: instructor.id,
      categoryId: professionalCategory.id,
      subCategoryId: 'prof-cfa',
    },
  })

  console.log('✅ CFA Level 3 course created')

  // ============================================================================
  // FRM COURSES (2 courses)
  // ============================================================================

  // Course 12: FRM Part 1
  await prisma.course.upsert({
    where: { id: 'frm_part1' },
    update: {},
    create: {
      id: 'frm_part1',
      title: 'FRM Part 1 Complete Course',
      description: 'Complete preparation for Financial Risk Manager Part I examination covering foundations of risk management.',
      thumbnail: '/assets/courses/frm_part1.svg',
      duration: 9000, // 150 hours
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: professionalCategory.id,
      subCategoryId: 'prof-frm',
    },
  })

  console.log('✅ FRM Part 1 course created')

  // Course 13: FRM Part 2
  await prisma.course.upsert({
    where: { id: 'frm_part2' },
    update: {},
    create: {
      id: 'frm_part2',
      title: 'FRM Part 2 Complete Course',
      description: 'Complete preparation for Financial Risk Manager Part II examination with advanced risk analysis.',
      thumbnail: '/assets/courses/frm_part2.svg',
      duration: 12000, // 200 hours
      difficulty: 'ADVANCED',
      isActive: true,
      instructorId: instructor.id,
      categoryId: professionalCategory.id,
      subCategoryId: 'prof-frm',
    },
  })

  console.log('✅ FRM Part 2 course created')

  // ============================================================================
  // ACTUARIAL SCIENCE (1 course)
  // ============================================================================

  // Course 14: Actuarial Science
  await prisma.course.upsert({
    where: { id: 'actuarial_science' },
    update: {},
    create: {
      id: 'actuarial_science',
      title: 'Actuarial Science Complete Course',
      description: 'Complete preparation for Actuarial Science examinations covering mathematics, statistics, and financial mathematics.',
      thumbnail: '/assets/courses/actuarial_science.svg',
      duration: 15000, // 250 hours
      difficulty: 'ADVANCED',
      isActive: true,
      instructorId: instructor.id,
      categoryId: professionalCategory.id,
      subCategoryId: 'prof-actuarial',
    },
  })

  console.log('✅ Actuarial Science course created')

  console.log('🎉 All Professional Courses created successfully!')
  console.log('📊 Summary:')
  console.log('   - Chartered Accountant: 3 courses (Foundation, Intermediate, Final)')
  console.log('   - Company Secretary: 2 courses (Executive, Professional)')
  console.log('   - CMA: 3 courses (Foundation, Intermediate, Final)')
  console.log('   - CFA: 3 courses (Level 1, Level 2, Level 3)')
  console.log('   - FRM: 2 courses (Part 1, Part 2)')
  console.log('   - Actuarial Science: 1 course')
  console.log('   - Total: 14 courses created')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
