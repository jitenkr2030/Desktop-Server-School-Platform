import { db } from '@/lib/db'

async function createIndianConstitutionCourse() {
  console.log('Creating Indian Constitution & Civics course...')

  // Check if course already exists
  const existingCourse = await db.course.findUnique({
    where: { id: 'cr_indian_constitution' }
  })

  if (existingCourse) {
    console.log('Course already exists, deleting and recreating...')
    // First delete all lessons associated with the course
    await db.lesson.deleteMany({
      where: { courseId: existingCourse.id }
    })
    // Then delete the course
    await db.course.delete({
      where: { id: 'cr_indian_constitution' }
    })
  }

  // Create instructor Dr. Meera Krishnan
  let instructor = await db.instructor.findFirst({
    where: { name: { contains: 'Meera' } }
  })

  if (!instructor) {
    instructor = await db.instructor.create({
      data: {
        id: 'inst_meera_krishnan',
        name: 'Dr. Meera Krishnan',
        bio: 'Expert in Constitutional Law and Indian Governance with over 15 years of teaching experience.',
        avatar: '/instructors/inst_meera.jpg',
        expertise: 'Constitutional Law, Political Science, Governance, Civics, Indian History',
      }
    })
    console.log(`Created instructor: ${instructor.name}`)
  } else {
    console.log(`Using existing instructor: ${instructor.name}`)
  }

  // Create learning path for Constitution course
  const learningPath = await db.learningPath.upsert({
    where: { id: 'constitution-civics' },
    update: {},
    create: {
      id: 'constitution-civics',
      title: 'Constitution & Civics',
      description: 'Learn about the Indian Constitution and your role as a citizen',
      color: 'bg-saffron-100',
      icon: 'Scale',
    }
  })
  console.log(`Learning path: ${learningPath.title}`)

  // Create the course
  const course = await db.course.create({
    data: {
      id: 'cr_indian_constitution',
      title: 'Indian Constitution & Civics',
      description: 'Learn about the Indian Constitution, fundamental rights, governance, and your role as a citizen. Understand Your Rights & Duties.',
      thumbnail: '/courses/cr_indian_constitution.jpg',
      difficulty: 'BEGINNER',
      duration: 800, // 13h 20m in minutes
      isActive: true,
      instructorId: instructor.id,
      learningPathId: learningPath.id,
    }
  })
  console.log(`Created course: ${course.title} (${course.id})`)

  // Create 10 modules with 55 lessons - lessons are created directly under course
  // Module grouping will be handled by the API based on lesson order
  const lessons = [
    // Module 1: Introduction to Indian Constitution (5 lessons)
    { title: 'What is a Constitution?', duration: 15, order: 1, module: 1 },
    { title: 'Making of Indian Constitution', duration: 25, order: 2, module: 1 },
    { title: 'Salient Features', duration: 22, order: 3, module: 1 },
    { title: 'The Preamble', duration: 18, order: 4, module: 1 },
    { title: 'Module Quiz', duration: 15, order: 5, module: 1 },
    
    // Module 2: Parts and Schedules (5 lessons)
    { title: 'Parts of the Constitution - Overview', duration: 20, order: 6, module: 2 },
    { title: 'Schedules Explained', duration: 25, order: 7, module: 2 },
    { title: 'Articles 1-395 Overview', duration: 22, order: 8, module: 2 },
    { title: 'Amendments Process', duration: 18, order: 9, module: 2 },
    { title: 'Module Quiz', duration: 15, order: 10, module: 2 },
    
    // Module 3: Fundamental Rights (6 lessons)
    { title: 'Introduction to Fundamental Rights', duration: 20, order: 11, module: 3 },
    { title: 'Right to Equality (Articles 14-18)', duration: 25, order: 12, module: 3 },
    { title: 'Right to Freedom (Articles 19-22)', duration: 25, order: 13, module: 3 },
    { title: 'Right against Exploitation (Articles 23-24)', duration: 18, order: 14, module: 3 },
    { title: 'Right to Freedom of Religion (Articles 25-28)', duration: 20, order: 15, module: 3 },
    { title: 'Module Quiz', duration: 15, order: 16, module: 3 },
    
    // Module 4: Directive Principles & Fundamental Duties (6 lessons)
    { title: 'What are Directive Principles?', duration: 20, order: 17, module: 4 },
    { title: 'Socialist Principles', duration: 18, order: 18, module: 4 },
    { title: 'Gandhian Principles', duration: 15, order: 19, module: 4 },
    { title: 'Liberal Principles', duration: 15, order: 20, module: 4 },
    { title: 'Fundamental Duties (Article 51A)', duration: 20, order: 21, module: 4 },
    { title: 'Module Quiz', duration: 15, order: 22, module: 4 },
    
    // Module 5: Union Government (6 lessons)
    { title: 'The President', duration: 25, order: 23, module: 5 },
    { title: 'The Vice-President', duration: 15, order: 24, module: 5 },
    { title: 'Prime Minister & Council of Ministers', duration: 25, order: 25, module: 5 },
    { title: 'The Parliament - Lok Sabha', duration: 22, order: 26, module: 5 },
    { title: 'The Parliament - Rajya Sabha', duration: 20, order: 27, module: 5 },
    { title: 'Module Quiz', duration: 15, order: 28, module: 5 },
    
    // Module 6: State Government (6 lessons)
    { title: 'Governor & Chief Minister', duration: 22, order: 29, module: 6 },
    { title: 'State Legislative Assembly', duration: 20, order: 30, module: 6 },
    { title: 'State Legislative Council', duration: 18, order: 31, module: 6 },
    { title: 'State Council of Ministers', duration: 18, order: 32, module: 6 },
    { title: 'Relations between Union & States', duration: 25, order: 33, module: 6 },
    { title: 'Module Quiz', duration: 15, order: 34, module: 6 },
    
    // Module 7: Local Governance (5 lessons)
    { title: 'Panchayati Raj System', duration: 25, order: 35, module: 7 },
    { title: 'Three-Tier System Explained', duration: 22, order: 36, module: 7 },
    { title: '73rd & 74th Amendments', duration: 25, order: 37, module: 7 },
    { title: 'Powers of Local Bodies', duration: 20, order: 38, module: 7 },
    { title: 'Module Quiz', duration: 15, order: 39, module: 7 },
    
    // Module 8: Elections & Voting (5 lessons)
    { title: 'Election Commission of India', duration: 22, order: 40, module: 8 },
    { title: 'Voting Process Explained', duration: 20, order: 41, module: 8 },
    { title: 'EVM & VVPAT', duration: 18, order: 42, module: 8 },
    { title: 'Electoral Reforms', duration: 18, order: 43, module: 8 },
    { title: 'Module Quiz', duration: 15, order: 44, module: 8 },
    
    // Module 9: Citizenship & Identity (6 lessons)
    { title: 'Indian Citizenship Act', duration: 20, order: 45, module: 9 },
    { title: 'Acquisition of Citizenship', duration: 22, order: 46, module: 9 },
    { title: 'Overseas Citizens of India (OCI)', duration: 15, order: 47, module: 9 },
    { title: 'Aadhaar & Identity Documents', duration: 20, order: 48, module: 9 },
    { title: 'Voter ID & Passport', duration: 18, order: 49, module: 9 },
    { title: 'Module Quiz', duration: 15, order: 50, module: 9 },
    
    // Module 10: Rights, Duties & Civic Engagement (6 lessons)
    { title: 'Knowing Your Rights', duration: 22, order: 51, module: 10 },
    { title: 'Fulfilling Your Duties', duration: 20, order: 52, module: 10 },
    { title: 'How to File RTI', duration: 25, order: 53, module: 10 },
    { title: 'Public Interest Litigation', duration: 20, order: 54, module: 10 },
    { title: 'Role of RTI in Democracy', duration: 18, order: 55, module: 10 },
    { title: 'Final Assessment', duration: 30, order: 56, module: 10 },
  ]

  let totalLessons = 0
  let totalDuration = 0

  for (const lessonData of lessons) {
    await db.lesson.create({
      data: {
        id: `cc_${lessonData.module}_${String(lessonData.order).padStart(2, '0')}`,
        courseId: course.id,
        title: lessonData.title,
        duration: lessonData.duration,
        order: lessonData.order,
        videoUrl: `https://example.com/videos/cc_${lessonData.module}_${lessonData.order}.mp4`,
        content: `Content for ${lessonData.title}`,
        isActive: true,
      }
    })
    totalLessons++
    totalDuration += lessonData.duration
  }

  console.log(`\n✅ Successfully created Indian Constitution & Civics course!`)
  console.log(`   - Course ID: ${course.id}`)
  console.log(`   - Total Modules: 10`)
  console.log(`   - Total Lessons: ${totalLessons}`)
  console.log(`   - Total Duration: ${totalDuration} minutes (${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m)`)
}

createIndianConstitutionCourse()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
