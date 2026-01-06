import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding College Education Lessons...')

  // College B.Sc PCM (Physics, Chemistry, Mathematics)
  console.log('📚 Creating lessons for B.Sc PCM...')
  
  await prisma.lesson.create({
    data: {
      id: 'pcm_phy_101',
      title: 'Introduction to Mechanics',
      content: 'This lesson covers the basic principles of mechanics including kinematics, dynamics, and the laws of motion.',
      duration: 45,
      order: 1,
      videoUrl: 'https://example.com/videos/pcm-phy-101',
      isActive: true,
      courseId: 'college_bsc_pcm',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'pcm_phy_102',
      title: 'Laws of Motion',
      content: 'This lesson explores Newtons three laws of motion with practical examples and applications.',
      duration: 50,
      order: 2,
      videoUrl: 'https://example.com/videos/pcm-phy-102',
      isActive: true,
      courseId: 'college_bsc_pcm',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'pcm_phy_103',
      title: 'Work, Energy and Power',
      content: 'This lesson covers the concepts of work, energy, power, and their interrelationships.',
      duration: 55,
      order: 3,
      videoUrl: 'https://example.com/videos/pcm-phy-103',
      isActive: true,
      courseId: 'college_bsc_pcm',
    }
  })

  await prisma.lesson.create({
    data: {
      id: 'pcm_phy_201',
      title: 'Wave Optics',
      content: 'This lesson introduces wave optics concepts including interference, diffraction, and polarization.',
      duration: 60,
      order: 101,
      videoUrl: 'https://example.com/videos/pcm-phy-201',
      isActive: true,
      courseId: 'college_bsc_pcm',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'pcm_phy_202',
      title: 'Thermodynamics',
      content: 'This lesson covers the laws of thermodynamics, heat transfer, and kinetic theory.',
      duration: 55,
      order: 102,
      videoUrl: 'https://example.com/videos/pcm-phy-202',
      isActive: true,
      courseId: 'college_bsc_pcm',
    }
  })

  await prisma.lesson.create({
    data: {
      id: 'pcm_chem_101',
      title: 'Atomic Structure',
      content: 'This lesson explores atomic structure, quantum mechanics, and electron configuration.',
      duration: 50,
      order: 301,
      videoUrl: 'https://example.com/videos/pcm-chem-101',
      isActive: true,
      courseId: 'college_bsc_pcm',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'pcm_chem_102',
      title: 'Chemical Bonding',
      content: 'This lesson covers ionic, covalent, and metallic bonding with VSEPR theory.',
      duration: 45,
      order: 302,
      videoUrl: 'https://example.com/videos/pcm-chem-102',
      isActive: true,
      courseId: 'college_bsc_pcm',
    }
  })

  await prisma.lesson.create({
    data: {
      id: 'pcm_math_101',
      title: 'Differential Calculus',
      content: 'This lesson covers limits, continuity, derivatives, and their applications.',
      duration: 60,
      order: 601,
      videoUrl: 'https://example.com/videos/pcm-math-101',
      isActive: true,
      courseId: 'college_bsc_pcm',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'pcm_math_102',
      title: 'Integral Calculus',
      content: 'This lesson covers integration techniques, definite and indefinite integrals.',
      duration: 55,
      order: 602,
      videoUrl: 'https://example.com/videos/pcm-math-102',
      isActive: true,
      courseId: 'college_bsc_pcm',
    }
  })

  // College B.Sc PCB (Physics, Chemistry, Biology)
  console.log('📚 Creating lessons for B.Sc PCB...')
  
  await prisma.lesson.create({
    data: {
      id: 'pcb_bio_101',
      title: 'Cell Biology Fundamentals',
      content: 'This lesson covers the structure and function of cell organelles.',
      duration: 50,
      order: 601,
      videoUrl: 'https://example.com/videos/pcb-bio-101',
      isActive: true,
      courseId: 'college_bsc_pcb',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'pcb_bio_102',
      title: 'Genetics and Heredity',
      content: 'This lesson covers Mendelian genetics, DNA structure, and gene expression.',
      duration: 60,
      order: 602,
      videoUrl: 'https://example.com/videos/pcb-bio-102',
      isActive: true,
      courseId: 'college_bsc_pcb',
    }
  })

  // College B.Sc Computer Science
  console.log('📚 Creating lessons for B.Sc Computer Science...')
  
  await prisma.lesson.create({
    data: {
      id: 'bsc_cs_101',
      title: 'Introduction to Programming',
      content: 'This lesson introduces basic programming concepts including variables, data types, and control structures.',
      duration: 60,
      order: 1,
      videoUrl: 'https://example.com/videos/bsc-cs-101',
      isActive: true,
      courseId: 'college_bsc_cs',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'bsc_cs_102',
      title: 'Data Structures Fundamentals',
      content: 'This lesson covers fundamental data structures including arrays, linked lists, stacks, and queues.',
      duration: 75,
      order: 101,
      videoUrl: 'https://example.com/videos/bsc-cs-102',
      isActive: true,
      courseId: 'college_bsc_cs',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'bsc_cs_103',
      title: 'Object-Oriented Programming',
      content: 'This lesson covers OOP concepts including classes, objects, inheritance, and polymorphism.',
      duration: 70,
      order: 301,
      videoUrl: 'https://example.com/videos/bsc-cs-103',
      isActive: true,
      courseId: 'college_bsc_cs',
    }
  })

  // College B.Com
  console.log('📚 Creating lessons for B.Com...')
  
  await prisma.lesson.create({
    data: {
      id: 'bcom_101',
      title: 'Financial Accounting Basics',
      content: 'This lesson introduces accounting principles, journal entries, and ledger posting.',
      duration: 55,
      order: 1,
      videoUrl: 'https://example.com/videos/bcom-101',
      isActive: true,
      courseId: 'college_bcom',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'bcom_102',
      title: 'Corporate Law Fundamentals',
      content: 'This lesson covers the Companies Act, corporate governance, and compliance requirements.',
      duration: 50,
      order: 101,
      videoUrl: 'https://example.com/videos/bcom-102',
      isActive: true,
      courseId: 'college_bcom',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'bcom_103',
      title: 'Income Tax Fundamentals',
      content: 'This lesson covers basic income tax concepts, deductions, and filing procedures.',
      duration: 60,
      order: 201,
      videoUrl: 'https://example.com/videos/bcom-103',
      isActive: true,
      courseId: 'college_bcom',
    }
  })

  // College B.B.A.
  console.log('📚 Creating lessons for B.B.A....')
  
  await prisma.lesson.create({
    data: {
      id: 'bba_101',
      title: 'Principles of Management',
      content: 'This lesson introduces management functions, planning, and organizational structure.',
      duration: 50,
      order: 1,
      videoUrl: 'https://example.com/videos/bba-101',
      isActive: true,
      courseId: 'college_bba',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'bba_102',
      title: 'Marketing Management Basics',
      content: 'This lesson covers the marketing mix, consumer behavior, and market segmentation strategies.',
      duration: 55,
      order: 51,
      videoUrl: 'https://example.com/videos/bba-102',
      isActive: true,
      courseId: 'college_bba',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'bba_103',
      title: 'Financial Management',
      content: 'This lesson covers capital budgeting, working capital management, and financial analysis.',
      duration: 60,
      order: 101,
      videoUrl: 'https://example.com/videos/bba-103',
      isActive: true,
      courseId: 'college_bba',
    }
  })

  // College B.A. History
  console.log('📚 Creating lessons for B.A. History...')
  
  await prisma.lesson.create({
    data: {
      id: 'ba_hist_101',
      title: 'Ancient Indian Civilization',
      content: 'This lesson covers the Indus Valley Civilization, Vedic period, and Mahajanapadas.',
      duration: 55,
      order: 1,
      videoUrl: 'https://example.com/videos/ba-hist-101',
      isActive: true,
      courseId: 'college_ba_history',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'ba_hist_102',
      title: 'Medieval India',
      content: 'This lesson covers the Delhi Sultanate, Mughal Empire, and regional kingdoms.',
      duration: 60,
      order: 101,
      videoUrl: 'https://example.com/videos/ba-hist-102',
      isActive: true,
      courseId: 'college_ba_history',
    }
  })

  // College B.A. Political Science
  console.log('📚 Creating lessons for B.A. Political Science...')
  
  await prisma.lesson.create({
    data: {
      id: 'ba_polsc_101',
      title: 'Political Theory and Thought',
      content: 'This lesson introduces political theory, concepts of state, sovereignty, and citizenship.',
      duration: 50,
      order: 1,
      videoUrl: 'https://example.com/videos/ba-polsc-101',
      isActive: true,
      courseId: 'college_ba_polsc',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'ba_polsc_102',
      title: 'Indian Political System',
      content: 'This lesson covers the constitutional framework, federalism, and democratic institutions.',
      duration: 55,
      order: 101,
      videoUrl: 'https://example.com/videos/ba-polsc-102',
      isActive: true,
      courseId: 'college_ba_polsc',
    }
  })

  // College B.A. Psychology
  console.log('📚 Creating lessons for B.A. Psychology...')
  
  await prisma.lesson.create({
    data: {
      id: 'ba_psych_101',
      title: 'Introduction to Psychology',
      content: 'This lesson covers the history of psychology, major perspectives, and research methods.',
      duration: 50,
      order: 1,
      videoUrl: 'https://example.com/videos/ba-psych-101',
      isActive: true,
      courseId: 'college_ba_psychology',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'ba_psych_102',
      title: 'Developmental Psychology',
      content: 'This lesson covers human development across the lifespan and major developmental theories.',
      duration: 55,
      order: 101,
      videoUrl: 'https://example.com/videos/ba-psych-102',
      isActive: true,
      courseId: 'college_ba_psychology',
    }
  })

  // College B.Tech Computer Science
  console.log('📚 Creating lessons for B.Tech Computer Science...')
  
  await prisma.lesson.create({
    data: {
      id: 'btech_cs_101',
      title: 'Programming with C',
      content: 'This lesson covers C programming fundamentals, pointers, and memory management.',
      duration: 60,
      order: 1,
      videoUrl: 'https://example.com/videos/btech-cs-101',
      isActive: true,
      courseId: 'college_btech_cs',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'btech_cs_102',
      title: 'Data Structures and Algorithms',
      content: 'This lesson covers advanced data structures, algorithm design, and complexity analysis.',
      duration: 75,
      order: 51,
      videoUrl: 'https://example.com/videos/btech-cs-102',
      isActive: true,
      courseId: 'college_btech_cs',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'btech_cs_103',
      title: 'Operating Systems',
      content: 'This lesson covers process management, memory management, and file systems.',
      duration: 70,
      order: 151,
      videoUrl: 'https://example.com/videos/btech-cs-103',
      isActive: true,
      courseId: 'college_btech_cs',
    }
  })

  // College LL.B.
  console.log('📚 Creating lessons for LL.B....')
  
  await prisma.lesson.create({
    data: {
      id: 'llb_101',
      title: 'Constitutional Law of India',
      content: 'This lesson covers fundamental rights, directive principles, and the constitutional structure.',
      duration: 60,
      order: 1,
      videoUrl: 'https://example.com/videos/llb-101',
      isActive: true,
      courseId: 'college_llb',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'llb_102',
      title: 'Criminal Law (IPC)',
      content: 'This lesson covers the Indian Penal Code, offenses against persons and property.',
      duration: 55,
      order: 51,
      videoUrl: 'https://example.com/videos/llb-102',
      isActive: true,
      courseId: 'college_llb',
    }
  })

  // College Semester Support
  console.log('📚 Creating lessons for College Semester Support...')
  
  await prisma.lesson.create({
    data: {
      id: 'sem_support_101',
      title: 'Study Skills and Time Management',
      content: 'This lesson covers effective study techniques and time management strategies.',
      duration: 40,
      order: 1,
      videoUrl: 'https://example.com/videos/sem-support-101',
      isActive: true,
      courseId: 'college_semester_support',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'sem_support_102',
      title: 'Note Taking and Revision',
      content: 'This lesson covers the Cornell method, mind mapping, and effective revision techniques.',
      duration: 35,
      order: 101,
      videoUrl: 'https://example.com/videos/sem-support-102',
      isActive: true,
      courseId: 'college_semester_support',
    }
  })

  // College Exam Prep
  console.log('📚 Creating lessons for College Exam Prep...')
  
  await prisma.lesson.create({
    data: {
      id: 'exam_prep_101',
      title: 'Exam Strategy and Preparation',
      content: 'This lesson covers creating effective study schedules and managing exam stress.',
      duration: 45,
      order: 1,
      videoUrl: 'https://example.com/videos/exam-prep-101',
      isActive: true,
      courseId: 'college_exam_prep',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'exam_prep_102',
      title: 'Previous Year Question Papers',
      content: 'This lesson covers analysis of important questions from past examinations.',
      duration: 50,
      order: 51,
      videoUrl: 'https://example.com/videos/exam-prep-102',
      isActive: true,
      courseId: 'college_exam_prep',
    }
  })

  // College Career Skills
  console.log('📚 Creating lessons for College Career Skills...')
  
  await prisma.lesson.create({
    data: {
      id: 'career_skills_101',
      title: 'Resume Writing',
      content: 'This lesson covers how to create a professional resume and cover letter.',
      duration: 45,
      order: 1,
      videoUrl: 'https://example.com/videos/career-skills-101',
      isActive: true,
      courseId: 'college_career_skills',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'career_skills_102',
      title: 'Interview Preparation',
      content: 'This lesson covers common interview questions, group discussions, and mock interviews.',
      duration: 60,
      order: 51,
      videoUrl: 'https://example.com/videos/career-skills-102',
      isActive: true,
      courseId: 'college_career_skills',
    }
  })

  // College B.Sc Statistics
  console.log('📚 Creating lessons for B.Sc Statistics...')
  
  await prisma.lesson.create({
    data: {
      id: 'bsc_stats_101',
      title: 'Probability Theory',
      content: 'This lesson covers basic probability concepts, conditional probability, and Bayes theorem.',
      duration: 55,
      order: 1,
      videoUrl: 'https://example.com/videos/bsc-stats-101',
      isActive: true,
      courseId: 'college_bsc_stats',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'bsc_stats_102',
      title: 'Statistical Inference',
      content: 'This lesson covers estimation, hypothesis testing, and confidence intervals.',
      duration: 60,
      order: 101,
      videoUrl: 'https://example.com/videos/bsc-stats-102',
      isActive: true,
      courseId: 'college_bsc_stats',
    }
  })

  // College B.Sc Biology/Biotech
  console.log('📚 Creating lessons for B.Sc Biology/Biotech...')
  
  await prisma.lesson.create({
    data: {
      id: 'bsc_bio_101',
      title: 'Cell Biology',
      content: 'This lesson covers cell structure, organelles, and cellular processes.',
      duration: 50,
      order: 1,
      videoUrl: 'https://example.com/videos/bsc-bio-101',
      isActive: true,
      courseId: 'college_bsc_bio',
    }
  })
  
  await prisma.lesson.create({
    data: {
      id: 'bsc_bio_102',
      title: 'Molecular Biology',
      content: 'This lesson covers DNA replication, transcription, translation, and gene regulation.',
      duration: 60,
      order: 101,
      videoUrl: 'https://example.com/videos/bsc-bio-102',
      isActive: true,
      courseId: 'college_bsc_bio',
    }
  })

  console.log('✅ College Education lessons seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding college lessons:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
