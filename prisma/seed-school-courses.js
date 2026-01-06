const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📚 Creating Individual School Education Courses...\n');

  // ==================== COURSE 1: PRIMARY & MIDDLE SCHOOL (Class 1-5) ====================
  console.log('📘 Creating Course 1: Primary & Middle School (Class 1-5)');
  const course1 = await prisma.course.upsert({
    where: { id: 'school_primary_1_5' },
    update: {},
    create: {
      id: 'school_primary_1_5',
      title: '📘 Primary & Middle School (Class 1-5)',
      description: 'Complete foundation course for Class 1-5 students covering Mathematics, English, EVS, Hindi, and Concept Building. Perfect for building strong fundamentals!',
      duration: 800,
      difficulty: 'BEGINNER',
      thumbnail: '/assets/courses/school-primary-1-5.svg',
      isActive: true,
      courseType: 'GENERAL',
      instructorId: 'inst-professional-courses',
    },
  });
  console.log('✅ Created:', course1.title);

  // ==================== COURSE 2: PRIMARY & MIDDLE SCHOOL (Class 6-8) ====================
  console.log('\n📘 Creating Course 2: Primary & Middle School (Class 6-8)');
  const course2 = await prisma.course.upsert({
    where: { id: 'school_primary_6_8' },
    update: {},
    create: {
      id: 'school_primary_6_8',
      title: '📘 Primary & Middle School (Class 6-8)',
      description: 'Comprehensive course for Class 6-8 students covering Mathematics, Science, Social Science, English Grammar, and Hindi. Build a strong academic foundation!',
      duration: 1000,
      difficulty: 'BEGINNER',
      thumbnail: '/assets/courses/school-primary-6-8.svg',
      isActive: true,
      courseType: 'GENERAL',
      instructorId: 'inst-professional-courses',
    },
  });
  console.log('✅ Created:', course2.title);

  // ==================== COURSE 3: SECONDARY SCHOOL (Class 9-10) ====================
  console.log('\n📗 Creating Course 3: Secondary School (Class 9-10)');
  const course3 = await prisma.course.upsert({
    where: { id: 'school_secondary_9_10' },
    update: {},
    create: {
      id: 'school_secondary_9_10',
      title: '📗 Secondary School (Class 9-10)',
      description: 'Complete secondary education for Class 9-10 students with Mathematics, Science, Social Science, English, Hindi, and Board-Oriented Practice for CBSE/ICSE/State Boards.',
      duration: 1200,
      difficulty: 'INTERMEDIATE',
      thumbnail: '/assets/courses/school-secondary-9-10.svg',
      isActive: true,
      courseType: 'GENERAL',
      instructorId: 'inst-professional-courses',
    },
  });
  console.log('✅ Created:', course3.title);

  // ==================== COURSE 4: SENIOR SECONDARY - SCIENCE STREAM (Class 11-12) ====================
  console.log('\n🔬 Creating Course 4: Senior Secondary - Science Stream (Class 11-12)');
  const course4 = await prisma.course.upsert({
    where: { id: 'school_senior_science_11_12' },
    update: {},
    create: {
      id: 'school_senior_science_11_12',
      title: '🔬 Senior Secondary - Science Stream (Class 11-12)',
      description: 'Comprehensive Science stream course for Class 11-12 students covering Physics, Chemistry, Mathematics, and Biology. Perfect for JEE, NEET, and board exam preparation!',
      duration: 1500,
      difficulty: 'ADVANCED',
      thumbnail: '/assets/courses/school-senior-science.svg',
      isActive: true,
      courseType: 'GENERAL',
      instructorId: 'inst-professional-courses',
    },
  });
  console.log('✅ Created:', course4.title);

  // ==================== COURSE 5: SENIOR SECONDARY - COMMERCE STREAM (Class 11-12) ====================
  console.log('\n📊 Creating Course 5: Senior Secondary - Commerce Stream (Class 11-12)');
  const course5 = await prisma.course.upsert({
    where: { id: 'school_senior_commerce_11_12' },
    update: {},
    create: {
      id: 'school_senior_commerce_11_12',
      title: '📊 Senior Secondary - Commerce Stream (Class 11-12)',
      description: 'Complete Commerce stream course for Class 11-12 students covering Accountancy, Business Studies, Economics, and Mathematics. Ideal for CA, CS, and commerce careers!',
      duration: 1200,
      difficulty: 'ADVANCED',
      thumbnail: '/assets/courses/school-senior-commerce.svg',
      isActive: true,
      courseType: 'GENERAL',
      instructorId: 'inst-professional-courses',
    },
  });
  console.log('✅ Created:', course5.title);

  // ==================== COURSE 6: SENIOR SECONDARY - ARTS/HUMANITIES (Class 11-12) ====================
  console.log('\n🎭 Creating Course 6: Senior Secondary - Arts/Humanities (Class 11-12)');
  const course6 = await prisma.course.upsert({
    where: { id: 'school_senior_arts_11_12' },
    update: {},
    create: {
      id: 'school_senior_arts_11_12',
      title: '🎭 Senior Secondary - Arts/Humanities (Class 11-12)',
      description: 'Comprehensive Arts/Humanities course for Class 11-12 students covering History, Political Science, Geography, Economics, Sociology, and Psychology.',
      duration: 1000,
      difficulty: 'ADVANCED',
      thumbnail: '/assets/courses/school-senior-arts.svg',
      isActive: true,
      courseType: 'GENERAL',
      instructorId: 'inst-professional-courses',
    },
  });
  console.log('✅ Created:', course6.title);

  // ==================== COURSE 7: BOARD EXAM CRASH PREP ====================
  console.log('\n📝 Creating Course 7: Board Exam Crash Prep');
  const course7 = await prisma.course.upsert({
    where: { id: 'school_exam_prep' },
    update: {},
    create: {
      id: 'school_exam_prep',
      title: '📝 Board Exam Crash Prep',
      description: 'Intensive board exam preparation course with 30-60 day strategies, important questions, PYQs, revision notes, sample papers, time management techniques, and doubt clearing sessions.',
      duration: 600,
      difficulty: 'INTERMEDIATE',
      thumbnail: '/assets/courses/school-exam-prep.svg',
      isActive: true,
      courseType: 'GENERAL',
      instructorId: 'inst-professional-courses',
    },
  });
  console.log('✅ Created:', course7.title);

  // ==================== COURSE 8: SKILL ADD-ONS FOR SCHOOL STUDENTS ====================
  console.log('\n🌟 Creating Course 8: Skill Add-ons for School Students');
  const course8 = await prisma.course.upsert({
    where: { id: 'school_skills' },
    update: {},
    create: {
      id: 'school_skills',
      title: '🌟 Skill Add-ons for School Students',
      description: 'Essential life skills for school students including English Speaking, Handwriting Improvement, Mental Math, Study Techniques, Memory Training, and Exam Fear Reduction.',
      duration: 500,
      difficulty: 'BEGINNER',
      thumbnail: '/assets/courses/school-skills.svg',
      isActive: true,
      courseType: 'GENERAL',
      instructorId: 'inst-professional-courses',
    },
  });
  console.log('✅ Created:', course8.title);

  console.log('\n🎉 All 8 School Education courses created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
