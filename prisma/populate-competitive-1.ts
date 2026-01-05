/**
 * Seed Script: Competitive Exams Category - Part 1
 * Contains: UPSC (3 courses), SSC (4 courses), Banking (3 courses)
 * Total: 10 courses
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Competitive Exams Category - Part 1 (UPSC, SSC, Banking)...')

  // ============================================================================
  // CREATE INSTRUCTOR
  // ============================================================================
  
  const instructor = await prisma.instructor.upsert({
    where: { id: 'inst-competitive-exams' },
    update: {},
    create: {
      id: 'inst-competitive-exams',
      name: 'Expert Competitive Exams Faculty',
      title: 'Senior Competitive Exams Mentor',
      bio: 'Highly experienced faculty with decade-long expertise in preparing students for UPSC, SSC, Banking, and other government examinations.',
      expertise: 'UPSC, SSC, Banking, Railway, Defense',
      isActive: true,
    },
  })
  
  console.log(`✅ Instructor created: ${instructor.name}`)

  // ============================================================================
  // CATEGORY: COMPETITIVE EXAMS
  // ============================================================================

  const competitiveCategory = await prisma.category.upsert({
    where: { id: 'cat-competitive-exams' },
    update: {},
    create: {
      id: 'cat-competitive-exams',
      name: 'Competitive Exams',
      slug: 'competitive-exams',
      description: 'Comprehensive preparation for government jobs and competitive exams including UPSC, SSC, Banking, Railway, and Defense',
      icon: '🏛️',
      color: '#E53935',
      sortOrder: 5,
      isActive: true,
      isFeatured: true,
    },
  })

  console.log(`✅ Category created: ${competitiveCategory.name}`)

  // Create subcategories separately
  const subcategories = [
    { id: 'sub-upsc', name: 'UPSC', slug: 'upsc', description: 'UPSC Civil Services Examination', categoryId: competitiveCategory.id },
    { id: 'sub-ssc', name: 'SSC', slug: 'ssc', description: 'Staff Selection Commission Exams', categoryId: competitiveCategory.id },
    { id: 'sub-banking', name: 'Banking', slug: 'banking', description: 'Banking Sector Examinations', categoryId: competitiveCategory.id },
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
        icon: '📋',
        color: '#FF5722',
        sortOrder: 1,
        isActive: true,
      },
    })
    console.log(`✅ Subcategory created: ${sub.name}`)
  }

  // ============================================================================
  // UPSC COURSES (3 courses)
  // ============================================================================

  // Course 1: UPSC Civil Services Prelims
  await prisma.course.upsert({
    where: { id: 'upsc_prelims' },
    update: {},
    create: {
      id: 'upsc_prelims',
      title: 'UPSC Civil Services Prelims Complete Guide',
      description: 'Master the UPSC Civil Services Preliminary Examination with comprehensive coverage of General Studies Paper I and Paper II (CSAT). Includes current affairs, history, geography, polity, economy, environment, and aptitude.',
      thumbnail: '/assets/courses/upsc_prelims.svg',
      duration: 6000, // 100 hours
      difficulty: 'ADVANCED',
      isActive: true,
      instructorId: instructor.id,
      categoryId: competitiveCategory.id,
      subCategoryId: 'sub-upsc',
    },
  })

  console.log('✅ UPSC Prelims course created')

  // Course 2: UPSC Civil Services Mains
  await prisma.course.upsert({
    where: { id: 'upsc_mains' },
    update: {},
    create: {
      id: 'upsc_mains',
      title: 'UPSC Civil Services Mains Complete Preparation',
      description: 'Comprehensive preparation for UPSC Mains examination with answer writing practice, essay strategy, and all nine papers coverage including GS I, II, III, IV, Optional Subjects, and compulsory papers.',
      thumbnail: '/assets/courses/upsc_mains.svg',
      duration: 8000, // 133+ hours
      difficulty: 'ADVANCED',
      isActive: true,
      instructorId: instructor.id,
      categoryId: competitiveCategory.id,
      subCategoryId: 'sub-upsc',
    },
  })

  console.log('✅ UPSC Mains course created')

  // Course 3: UPSC Interview Preparation
  await prisma.course.upsert({
    where: { id: 'upsc_interview' },
    update: {},
    create: {
      id: 'upsc_interview',
      title: 'UPSC Interview (Personality Test) Masterclass',
      description: 'Complete preparation for UPSC Civil Services Interview including DAF analysis, current affairs, mock interviews, and personality development.',
      thumbnail: '/assets/courses/upsc_interview.svg',
      duration: 3000, // 50 hours
      difficulty: 'ADVANCED',
      isActive: true,
      instructorId: instructor.id,
      categoryId: competitiveCategory.id,
      subCategoryId: 'sub-upsc',
    },
  })

  console.log('✅ UPSC Interview course created')

  // ============================================================================
  // SSC COURSES (4 courses)
  // ============================================================================

  // Course 4: SSC CGL (Combined Graduate Level)
  await prisma.course.upsert({
    where: { id: 'ssc_cgl' },
    update: {},
    create: {
      id: 'ssc_cgl',
      title: 'SSC CGL Complete Preparation Course',
      description: 'Complete preparation for SSC Combined Graduate Level examination covering Tier I and Tier II.',
      thumbnail: '/assets/courses/ssc_cgl.svg',
      duration: 5000, // 83+ hours
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: competitiveCategory.id,
      subCategoryId: 'sub-ssc',
    },
  })

  console.log('✅ SSC CGL course created')

  // Course 5: SSC CHSL (Combined Higher Secondary Level)
  await prisma.course.upsert({
    where: { id: 'ssc_chsl' },
    update: {},
    create: {
      id: 'ssc_chsl',
      title: 'SSC CHSL (10+2) Complete Preparation',
      description: 'Complete preparation for SSC Combined Higher Secondary Level examination for LDC, PA, SA positions.',
      thumbnail: '/assets/courses/ssc_chsl.svg',
      duration: 3500, // 58+ hours
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: competitiveCategory.id,
      subCategoryId: 'sub-ssc',
    },
  })

  console.log('✅ SSC CHSL course created')

  // Course 6: SSC MTS (Multi-Tasking Staff)
  await prisma.course.upsert({
    where: { id: 'ssc_mts' },
    update: {},
    create: {
      id: 'ssc_mts',
      title: 'SSC MTS (Multi-Tasking Staff) Preparation',
      description: 'Complete preparation for SSC Multi-Tasking Staff examination.',
      thumbnail: '/assets/courses/ssc_mts.svg',
      duration: 2500, // 42 hours
      difficulty: 'BEGINNER',
      isActive: true,
      instructorId: instructor.id,
      categoryId: competitiveCategory.id,
      subCategoryId: 'sub-ssc',
    },
  })

  console.log('✅ SSC MTS course created')

  // Course 7: SSC GD (General Duty)
  await prisma.course.upsert({
    where: { id: 'ssc_gd' },
    update: {},
    create: {
      id: 'ssc_gd',
      title: 'SSC GD Constable Complete Preparation',
      description: 'Complete preparation for SSC GD Constable examination covering all subjects.',
      thumbnail: '/assets/courses/ssc_gd.svg',
      duration: 3000, // 50 hours
      difficulty: 'BEGINNER',
      isActive: true,
      instructorId: instructor.id,
      categoryId: competitiveCategory.id,
      subCategoryId: 'sub-ssc',
    },
  })

  console.log('✅ SSC GD course created')

  // ============================================================================
  // BANKING COURSES (3 courses)
  // ============================================================================

  // Course 8: Banking - SBI PO/Clerk
  await prisma.course.upsert({
    where: { id: 'banking_sbi' },
    update: {},
    create: {
      id: 'banking_sbi',
      title: 'SBI PO & Clerk Complete Preparation',
      description: 'Complete preparation for State Bank of India Probationary Officer and Clerk examination.',
      thumbnail: '/assets/courses/banking_sbi.svg',
      duration: 6000, // 100 hours
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: competitiveCategory.id,
      subCategoryId: 'sub-banking',
    },
  })

  console.log('✅ SBI PO/Clerk course created')

  // Course 9: Banking - IBPS PO/Clerk
  await prisma.course.upsert({
    where: { id: 'banking_ibps' },
    update: {},
    create: {
      id: 'banking_ibps',
      title: 'IBPS PO & Clerk Complete Preparation',
      description: 'Complete preparation for Institute of Banking Personnel Selection PO and Clerk examination.',
      thumbnail: '/assets/courses/banking_ibps.svg',
      duration: 5500, // 92 hours
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: competitiveCategory.id,
      subCategoryId: 'sub-banking',
    },
  })

  console.log('✅ IBPS PO/Clerk course created')

  // Course 10: Banking - RRB (Regional Rural Bank)
  await prisma.course.upsert({
    where: { id: 'banking_rrb' },
    update: {},
    create: {
      id: 'banking_rrb',
      title: 'RRB PO & Clerk (Regional Rural Bank) Preparation',
      description: 'Complete preparation for Regional Rural Bank examination.',
      thumbnail: '/assets/courses/banking_rrb.svg',
      duration: 4500, // 75 hours
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: competitiveCategory.id,
      subCategoryId: 'sub-banking',
    },
  })

  console.log('✅ RRB PO/Clerk course created')

  console.log('🎉 All Competitive Exams Part 1 courses created successfully!')
  console.log('📊 Summary:')
  console.log('   - UPSC: 3 courses (Prelims, Mains, Interview)')
  console.log('   - SSC: 4 courses (CGL, CHSL, MTS, GD)')
  console.log('   - Banking: 3 courses (SBI, IBPS, RRB)')
  console.log('   - Total: 10 courses created')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
