/**
 * Seed Script: Competitive Exams Category - Part 2
 * Contains: Railway (1 course), Defense (3 courses), State Government (4 courses)
 * Total: 8 courses
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Competitive Exams Category - Part 2 (Railway, Defense, State Govt)...')

  // ============================================================================
  // CREATE INSTRUCTOR
  // ============================================================================
  
  const instructor = await prisma.instructor.upsert({
    where: { id: 'inst-competitive-exams-2' },
    update: {},
    create: {
      id: 'inst-competitive-exams-2',
      name: 'Government Exams Specialist',
      title: 'Competitive Exams Mentor',
      bio: 'Specialized faculty with expertise in Railway, Defense, and State Government examinations.',
      expertise: 'Railway, Defense, State PSC, Police, TET',
      isActive: true,
    },
  })
  
  console.log(`✅ Instructor created: ${instructor.name}`)

  // ============================================================================
  // ENSURE COMPETITIVE EXAMS CATEGORY EXISTS
  // ============================================================================

  const competitiveCategory = await prisma.category.upsert({
    where: { id: 'cat-competitive-exams' },
    update: {},
    create: {
      id: 'cat-competitive-exams',
      name: 'Competitive Exams',
      slug: 'competitive-exams',
      description: 'Comprehensive preparation for government jobs and competitive exams',
      icon: '🏛️',
      color: '#E53935',
      sortOrder: 5,
      isActive: true,
      isFeatured: true,
    },
  })

  // ============================================================================
  // CREATE REMAINING SUBCATEGORIES
  // ============================================================================

  const subcategories = [
    { id: 'sub-railway', name: 'Railway', slug: 'railway', description: 'Railway Recruitment Board Exams', categoryId: competitiveCategory.id },
    { id: 'sub-defense', name: 'Defense', slug: 'defense', description: 'Defense Services Examination', categoryId: competitiveCategory.id },
    { id: 'sub-state', name: 'State Government', slug: 'state-government', description: 'State Public Service Commission Exams', categoryId: competitiveCategory.id },
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
        icon: '🚂',
        color: '#FF9800',
        sortOrder: 1,
        isActive: true,
      },
    })
    console.log(`✅ Subcategory created: ${sub.name}`)
  }

  // ============================================================================
  // RAILWAY COURSES (1 course)
  // ============================================================================

  // Course 1: Railway (RRB NTPC, ALP, Group D)
  await prisma.course.upsert({
    where: { id: 'railway_rrb' },
    update: {},
    create: {
      id: 'railway_rrb',
      title: 'Railway Recruitment Board (RRB) Complete Preparation',
      description: 'Complete preparation for RRB NTPC, ALP, and Group D examinations. Covers all subjects including General Intelligence, Reasoning, Mathematics, General Science, and General Awareness.',
      thumbnail: '/assets/courses/railway_rrb.svg',
      duration: 5000, // 83+ hours
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: competitiveCategory.id,
      subCategoryId: 'sub-railway',
    },
  })

  console.log('✅ Railway RRB course created')

  // ============================================================================
  // DEFENSE COURSES (3 courses)
  // ============================================================================

  // Course 2: NDA (National Defense Academy)
  await prisma.course.upsert({
    where: { id: 'defense_nda' },
    update: {},
    create: {
      id: 'defense_nda',
      title: 'NDA (National Defense Academy) Complete Preparation',
      description: 'Complete preparation for National Defence Academy examination covering Mathematics and General Ability Test.',
      thumbnail: '/assets/courses/defense_nda.svg',
      duration: 7000, // 117+ hours
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: competitiveCategory.id,
      subCategoryId: 'sub-defense',
    },
  })

  console.log('✅ NDA course created')

  // Course 3: CDS (Combined Defense Services)
  await prisma.course.upsert({
    where: { id: 'defense_cds' },
    update: {},
    create: {
      id: 'defense_cds',
      title: 'CDS (Combined Defense Services) Examination',
      description: 'Complete preparation for CDS examination for entry into Indian Military Academy, Naval Academy, and Air Force Academy.',
      thumbnail: '/assets/courses/defense_cds.svg',
      duration: 6000, // 100 hours
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: competitiveCategory.id,
      subCategoryId: 'sub-defense',
    },
  })

  console.log('✅ CDS course created')

  // Course 4: AFCAT (Air Force Common Admission Test)
  await prisma.course.upsert({
    where: { id: 'defense_afcat' },
    update: {},
    create: {
      id: 'defense_afcat',
      title: 'AFCAT (Air Force Common Admission Test)',
      description: 'Complete preparation for AFCAT for entry into Indian Air Force as Flying, Ground Duty.',
      thumbnail: '/assets/courses/defense_afcat.svg',
      duration: 5000, // 83+ hours
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: competitiveCategory.id,
      subCategoryId: 'sub-defense',
    },
  })

  console.log('✅ AFCAT course created')

  // ============================================================================
  // STATE GOVERNMENT COURSES (4 courses)
  // ============================================================================

  // Course 5: State PSC
  await prisma.course.upsert({
    where: { id: 'state_psc' },
    update: {},
    create: {
      id: 'state_psc',
      title: 'State Civil Services Examination Preparation',
      description: 'Complete preparation for State Public Service Commission examinations.',
      thumbnail: '/assets/courses/state_psc.svg',
      duration: 5500, // 92 hours
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: competitiveCategory.id,
      subCategoryId: 'sub-state',
    },
  })

  console.log('✅ State PSC course created')

  // Course 6: Police Exams
  await prisma.course.upsert({
    where: { id: 'state_police' },
    update: {},
    create: {
      id: 'state_police',
      title: 'State Police Constable and SI Preparation',
      description: 'Complete preparation for State Police Constable, Sub-Inspector examinations.',
      thumbnail: '/assets/courses/state_police.svg',
      duration: 3500, // 58 hours
      difficulty: 'BEGINNER',
      isActive: true,
      instructorId: instructor.id,
      categoryId: competitiveCategory.id,
      subCategoryId: 'sub-state',
    },
  })

  console.log('✅ Police Exams course created')

  // Course 7: Patwari
  await prisma.course.upsert({
    where: { id: 'state_patwari' },
    update: {},
    create: {
      id: 'state_patwari',
      title: 'Patwari Examination Preparation',
      description: 'Complete preparation for Patwari (Revenue Officer) examination.',
      thumbnail: '/assets/courses/state_patwari.svg',
      duration: 3000, // 50 hours
      difficulty: 'BEGINNER',
      isActive: true,
      instructorId: instructor.id,
      categoryId: competitiveCategory.id,
      subCategoryId: 'sub-state',
    },
  })

  console.log('✅ Patwari course created')

  // Course 8: TET (Teacher Eligibility Test)
  await prisma.course.upsert({
    where: { id: 'state_tet' },
    update: {},
    create: {
      id: 'state_tet',
      title: 'TET (Teacher Eligibility Test) Complete Preparation',
      description: 'Complete preparation for Teacher Eligibility Test for Primary and Elementary levels.',
      thumbnail: '/assets/courses/state_tet.svg',
      duration: 4000, // 67 hours
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: competitiveCategory.id,
      subCategoryId: 'sub-state',
    },
  })

  console.log('✅ TET course created')

  console.log('🎉 All Competitive Exams Part 2 courses created successfully!')
  console.log('📊 Summary:')
  console.log('   - Railway: 1 course (RRB NTPC/ALP/Group D)')
  console.log('   - Defense: 3 courses (NDA, CDS, AFCAT)')
  console.log('   - State Government: 4 courses (PSC, Police, Patwari, TET)')
  console.log('   - Total: 8 courses created')
  console.log('')
  console.log('🏆 TOTAL Competitive Exams Category:')
  console.log('   - Part 1: 10 courses (UPSC, SSC, Banking)')
  console.log('   - Part 2: 8 courses (Railway, Defense, State)')
  console.log('   - Grand Total: 18 courses')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
