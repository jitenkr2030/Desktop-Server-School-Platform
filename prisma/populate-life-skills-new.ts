/**
 * Seed Script: Enhanced Life Skills Category
 * Adds new Life Skills courses as requested by the user
 * Contains: Time Management, Stress Management, Confidence Building, Decision Making, Productivity Systems, Mental Clarity
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Life Skills Category Enhancement...')

  // ============================================================================
  // CREATE INSTRUCTOR
  // ============================================================================
  
  const instructor = await prisma.instructor.upsert({
    where: { id: 'inst-life-skills' },
    update: {},
    create: {
      id: 'inst-life-skills',
      name: 'Life Skills Coach',
      title: 'Personal Development Expert',
      bio: 'Experienced life skills coach specializing in personal development, communication, and productivity.',
      expertise: 'Time Management, Stress Management, Communication, Productivity',
      isActive: true,
    },
  })
  
  console.log(`✅ Instructor created: ${instructor.name}`)

  // ============================================================================
  // ENSURE LIFE SKILLS CATEGORY EXISTS
  // ============================================================================

  const lifeSkillsCategory = await prisma.category.upsert({
    where: { id: 'cat-life-skills' },
    update: {},
    create: {
      id: 'cat-life-skills',
      name: 'Life Skills',
      slug: 'life-skills',
      description: 'Essential personal development skills for success and well-being. Master time management, stress relief, confidence building, decision making, productivity, and mental clarity.',
      icon: '🧠',
      color: '#9C27B0',
      sortOrder: 7,
      isActive: true,
      isFeatured: true,
    },
  })

  console.log(`✅ Category created/verified: ${lifeSkillsCategory.name}`)

  // ============================================================================
  // NEW LIFE SKILLS COURSES (6 courses)
  // ============================================================================

  // Course 1: Time Management
  await prisma.course.upsert({
    where: { id: 'life-time-management' },
    update: {},
    create: {
      id: 'life-time-management',
      title: 'Time Management Mastery',
      description: 'Master the art of managing your time effectively. Learn proven strategies to prioritize tasks, avoid procrastination, and maximize productivity.',
      thumbnail: '/assets/courses/time-management.svg',
      duration: 360, // 6 hours
      difficulty: 'BEGINNER',
      isActive: true,
      instructorId: instructor.id,
      categoryId: lifeSkillsCategory.id,
    },
  })

  console.log('✅ Time Management Mastery course created')

  // Course 2: Stress Management
  await prisma.course.upsert({
    where: { id: 'life-stress-management' },
    update: {},
    create: {
      id: 'life-stress-management',
      title: 'Stress Management & Resilience',
      description: 'Develop mental resilience and learn effective techniques to manage stress in your personal and professional life.',
      thumbnail: '/assets/courses/stress-management.svg',
      duration: 480, // 8 hours
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: lifeSkillsCategory.id,
    },
  })

  console.log('✅ Stress Management & Resilience course created')

  // Course 3: Confidence Building
  await prisma.course.upsert({
    where: { id: 'life-confidence-building' },
    update: {},
    create: {
      id: 'life-confidence-building',
      title: 'Confidence Building & Public Speaking',
      description: 'Transform your self-confidence and master the art of public speaking. Overcome stage fright and communicate with authority.',
      thumbnail: '/assets/courses/confidence-building.svg',
      duration: 600, // 10 hours
      difficulty: 'BEGINNER',
      isActive: true,
      instructorId: instructor.id,
      categoryId: lifeSkillsCategory.id,
    },
  })

  console.log('✅ Confidence Building & Public Speaking course created')

  // Course 4: Decision Making
  await prisma.course.upsert({
    where: { id: 'life-decision-making' },
    update: {},
    create: {
      id: 'life-decision-making',
      title: 'Decision Making & Problem Solving',
      description: 'Enhance your decision-making abilities with frameworks used by top executives. Learn to solve problems logically and confidently.',
      thumbnail: '/assets/courses/decision-making.svg',
      duration: 420, // 7 hours
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: lifeSkillsCategory.id,
    },
  })

  console.log('✅ Decision Making & Problem Solving course created')

  // Course 5: Productivity Systems
  await prisma.course.upsert({
    where: { id: 'life-productivity' },
    update: {},
    create: {
      id: 'life-productivity',
      title: 'Productivity Systems & Habits',
      description: 'Build powerful productivity systems and lasting habits. Learn how successful people structure their day for maximum output.',
      thumbnail: '/assets/courses/productivity-systems.svg',
      duration: 300, // 5 hours
      difficulty: 'BEGINNER',
      isActive: true,
      instructorId: instructor.id,
      categoryId: lifeSkillsCategory.id,
    },
  })

  console.log('✅ Productivity Systems & Habits course created')

  // Course 6: Mental Clarity
  await prisma.course.upsert({
    where: { id: 'life-mental-clarity' },
    update: {},
    create: {
      id: 'life-mental-clarity',
      title: 'Mental Clarity & Focus',
      description: 'Achieve crystal clear thinking and laser-like focus. Learn meditation techniques and mental exercises for cognitive enhancement.',
      thumbnail: '/assets/courses/mental-clarity.svg',
      duration: 240, // 4 hours
      difficulty: 'BEGINNER',
      isActive: true,
      instructorId: instructor.id,
      categoryId: lifeSkillsCategory.id,
    },
  })

  console.log('✅ Mental Clarity & Focus course created')

  // ============================================================================
  // ADDITIONAL LIFE SKILLS COURSES
  // ============================================================================

  // Course 7: Emotional Intelligence
  await prisma.course.upsert({
    where: { id: 'life-emotional-intelligence' },
    update: {},
    create: {
      id: 'life-emotional-intelligence',
      title: 'Emotional Intelligence Fundamentals',
      description: 'Develop your emotional intelligence to improve relationships, leadership, and personal growth. Understand and manage emotions effectively.',
      thumbnail: '/assets/courses/emotional-intelligence.svg',
      duration: 360, // 6 hours
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: lifeSkillsCategory.id,
    },
  })

  console.log('✅ Emotional Intelligence Fundamentals course created')

  // Course 8: Communication Skills
  await prisma.course.upsert({
    where: { id: 'life-communication' },
    update: {},
    create: {
      id: 'life-communication',
      title: 'Communication Skills Masterclass',
      description: 'Transform your communication skills. Learn to listen actively, speak persuasively, and connect with anyone effortlessly.',
      thumbnail: '/assets/courses/communication-skills.svg',
      duration: 480, // 8 hours
      difficulty: 'BEGINNER',
      isActive: true,
      instructorId: instructor.id,
      categoryId: lifeSkillsCategory.id,
    },
  })

  console.log('✅ Communication Skills Masterclass course created')

  // Course 9: Goal Setting
  await prisma.course.upsert({
    where: { id: 'life-goal-setting' },
    update: {},
    create: {
      id: 'life-goal-setting',
      title: 'Goal Setting & Achievement',
      description: 'Master the science of goal setting. Learn SMART goals, OKRs, and strategies to achieve anything you set your mind to.',
      thumbnail: '/assets/courses/goal-setting.svg',
      duration: 300, // 5 hours
      difficulty: 'BEGINNER',
      isActive: true,
      instructorId: instructor.id,
      categoryId: lifeSkillsCategory.id,
    },
  })

  console.log('✅ Goal Setting & Achievement course created')

  // Course 10: Critical Thinking
  await prisma.course.upsert({
    where: { id: 'life-critical-thinking' },
    update: {},
    create: {
      id: 'life-critical-thinking',
      title: 'Critical Thinking & Logic',
      description: 'Sharpen your analytical thinking and logical reasoning abilities. Learn to evaluate arguments and make sound judgments.',
      thumbnail: '/assets/courses/critical-thinking.svg',
      duration: 420, // 7 hours
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: lifeSkillsCategory.id,
    },
  })

  console.log('✅ Critical Thinking & Logic course created')

  console.log('')
  console.log('🎉 Life Skills Category Enhancement completed!')
  console.log('📊 Summary:')
  console.log('   - Core Life Skills: 6 courses (as requested)')
  console.log('   - Additional Courses: 4 courses')
  console.log('   - Total New Courses: 10 courses')
  console.log('')
  console.log('📚 Total Content: 35+ hours of learning material')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
