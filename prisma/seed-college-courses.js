const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Creating College Education courses...')

  // B.Sc Physics, Chemistry, Mathematics (PCM)
  await prisma.course.create({
    data: {
      id: 'college_bsc_pcm',
      title: '🎓 B.Sc Physics, Chemistry, Mathematics (PCM)',
      description: 'Comprehensive B.Sc PCM program covering Physics, Chemistry, and Mathematics for undergraduate students. Includes semester-wise content, exam preparation, and career guidance.',
      difficulty: 'INTERMEDIATE',
      duration: 3000,
      thumbnail: '/assets/courses/college-bsc-pcm.svg',
      instructorId: 'instructor-main',
      isActive: true,
    }
  })
  console.log('Created: B.Sc PCM')

  // B.Sc Physics, Chemistry, Biology (PCB)
  await prisma.course.create({
    data: {
      id: 'college_bsc_pcb',
      title: '🎓 B.Sc Physics, Chemistry, Biology (PCB)',
      description: 'Complete B.Sc PCB program for students interested in life sciences, medical fields, and research. Covers Physics, Chemistry, and Biology with practical applications.',
      difficulty: 'INTERMEDIATE',
      duration: 3000,
      thumbnail: '/assets/courses/college-bsc-pcb.svg',
      instructorId: 'instructor-main',
      isActive: true,
    }
  })
  console.log('Created: B.Sc PCB')

  // B.Sc Computer Science / IT
  await prisma.course.create({
    data: {
      id: 'college_bsc_cs',
      title: '🎓 B.Sc Computer Science / IT',
      description: 'Industry-ready B.Sc CS/IT program covering programming, data structures, algorithms, databases, web development, and software engineering principles.',
      difficulty: 'INTERMEDIATE',
      duration: 3500,
      thumbnail: '/assets/courses/college-bsc-cs.svg',
      instructorId: 'instructor-main',
      isActive: true,
    }
  })
  console.log('Created: B.Sc CS/IT')

  // B.Sc Biotechnology
  await prisma.course.create({
    data: {
      id: 'college_bsc_bio',
      title: '🎓 B.Sc Biotechnology',
      description: 'Modern biotechnology program covering molecular biology, genetic engineering, bioinformatics, industrial microbiology, and bioprocess technology.',
      difficulty: 'INTERMEDIATE',
      duration: 2800,
      thumbnail: '/assets/courses/college-bsc-biotech.svg',
      instructorId: 'instructor-main',
      isActive: true,
    }
  })
  console.log('Created: B.Sc Biotechnology')

  // B.Sc Statistics
  await prisma.course.create({
    data: {
      id: 'college_bsc_stats',
      title: '🎓 B.Sc Statistics',
      description: 'Comprehensive statistics program covering probability theory, statistical inference, regression analysis, sampling techniques, and data analysis.',
      difficulty: 'INTERMEDIATE',
      duration: 2600,
      thumbnail: '/assets/courses/college-bsc-stats.svg',
      instructorId: 'instructor-main',
      isActive: true,
    }
  })
  console.log('Created: B.Sc Statistics')

  // B.Com (General / Honours)
  await prisma.course.create({
    data: {
      id: 'college_bcom',
      title: '🎓 B.Com (General / Honours)',
      description: 'Complete B.Com program covering financial accounting, corporate law, income tax, business economics, and commercial practices.',
      difficulty: 'INTERMEDIATE',
      duration: 3000,
      thumbnail: '/assets/courses/college-bcom.svg',
      instructorId: 'instructor-main',
      isActive: true,
    }
  })
  console.log('Created: B.Com')

  // BBA / BMS
  await prisma.course.create({
    data: {
      id: 'college_bba',
      title: '🎓 BBA / BMS (Bachelor of Business Administration)',
      description: 'Business administration program covering management principles, marketing, finance, operations, human resources, and entrepreneurship.',
      difficulty: 'INTERMEDIATE',
      duration: 3200,
      thumbnail: '/assets/courses/college-bba.svg',
      instructorId: 'instructor-main',
      isActive: true,
    }
  })
  console.log('Created: BBA/BMS')

  // BA History
  await prisma.course.create({
    data: {
      id: 'college_ba_history',
      title: '🎓 BA History',
      description: 'Comprehensive history program covering ancient, medieval, and modern Indian history as well as world history, historiography, and research methodology.',
      difficulty: 'BEGINNER',
      duration: 2400,
      thumbnail: '/assets/courses/college-ba-history.svg',
      instructorId: 'instructor-main',
      isActive: true,
    }
  })
  console.log('Created: BA History')

  // BA Political Science
  await prisma.course.create({
    data: {
      id: 'college_ba_polsc',
      title: '🎓 BA Political Science',
      description: 'Political science program covering political theory, Indian polity, international relations, comparative politics, and public administration.',
      difficulty: 'BEGINNER',
      duration: 2400,
      thumbnail: '/assets/courses/college-ba-polsc.svg',
      instructorId: 'instructor-main',
      isActive: true,
    }
  })
  console.log('Created: BA Political Science')

  // BA Psychology
  await prisma.course.create({
    data: {
      id: 'college_ba_psychology',
      title: '🎓 BA Psychology',
      description: 'Psychology program covering developmental psychology, social psychology, cognitive psychology, clinical psychology, and research methods.',
      difficulty: 'BEGINNER',
      duration: 2600,
      thumbnail: '/assets/courses/college-ba-psychology.svg',
      instructorId: 'instructor-main',
      isActive: true,
    }
  })
  console.log('Created: BA Psychology')

  // B.Tech Computer Science
  await prisma.course.create({
    data: {
      id: 'college_btech_cs',
      title: '🎓 B.Tech Computer Science / IT',
      description: 'Engineering-level Computer Science program covering programming, data structures, algorithms, computer networks, operating systems, and software engineering.',
      difficulty: 'ADVANCED',
      duration: 4000,
      thumbnail: '/assets/courses/college-btech-cs.svg',
      instructorId: 'instructor-main',
      isActive: true,
    }
  })
  console.log('Created: B.Tech CS')

  // LLB (3 Year / 5 Year)
  await prisma.course.create({
    data: {
      id: 'college_llb',
      title: '🎓 LLB (3 Year / 5 Year Integrated)',
      description: 'Complete law program covering constitutional law, criminal law, civil law, corporate law, international law, and legal drafting.',
      difficulty: 'ADVANCED',
      duration: 3500,
      thumbnail: '/assets/courses/college-llb.svg',
      instructorId: 'instructor-main',
      isActive: true,
    }
  })
  console.log('Created: LLB')

  // Semester Support Course
  await prisma.course.create({
    data: {
      id: 'college_semester_support',
      title: '📚 College Semester Support (1st-6th Semester)',
      description: 'Academic support for all semesters including basics, core subjects, numerical help, assignment prep, internal exam strategy, and university exam preparation.',
      difficulty: 'BEGINNER',
      duration: 2000,
      thumbnail: '/assets/courses/college-semester-support.svg',
      instructorId: 'instructor-main',
      isActive: true,
    }
  })
  console.log('Created: Semester Support')

  // University Exam Prep
  await prisma.course.create({
    data: {
      id: 'college_exam_prep',
      title: '📝 University Exam Crash Prep',
      description: 'Exam-focused preparation including important questions, previous year papers, last-minute revision techniques, answer writing, and passing strategies.',
      difficulty: 'INTERMEDIATE',
      duration: 1500,
      thumbnail: '/assets/courses/college-exam-prep.svg',
      instructorId: 'instructor-main',
      isActive: true,
    }
  })
  console.log('Created: Exam Prep')

  // Career & Skills
  await prisma.course.create({
    data: {
      id: 'college_career_skills',
      title: '💼 Career & Skills Development',
      description: 'Career-oriented skills including internship readiness, project guidance, research basics, interview prep, resume building, GD skills, and corporate etiquette.',
      difficulty: 'BEGINNER',
      duration: 1200,
      thumbnail: '/assets/courses/college-career-skills.svg',
      instructorId: 'instructor-main',
      isActive: true,
    }
  })
  console.log('Created: Career Skills')

  console.log('\n✅ All College Education courses created successfully!')
  console.log('\nCreated 15 courses:')
  console.log('- 12 Degree courses (B.Sc, B.Com, BBA, BA, B.Tech, LLB)')
  console.log('- 3 Add-on courses (Semester Support, Exam Prep, Career Skills)')
}

main()
  .catch((e) => {
    console.error('Error creating courses:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
