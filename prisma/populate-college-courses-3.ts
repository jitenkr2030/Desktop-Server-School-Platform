import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating lessons for College Category courses - Part 3...')

  // college12: Marketing Fundamentals (INTERMEDIATE, 450 min) - 4 modules: 100 + 100 + 100 + 150 lessons
  const college12 = await prisma.course.findUnique({ where: { id: 'college12' } })
  if (college12) {
    console.log('Creating lessons for college12: Marketing Fundamentals...')
    await prisma.lesson.deleteMany({ where: { courseId: college12.id } })
    const lessons: any[] = []
    // Module 1: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college12.id,
        title: `Marketing Strategy & Planning - Lesson ${i}`,
        content: `Comprehensive lesson covering marketing strategy and planning fundamentals. This lesson explores marketing environment analysis, segmentation, targeting, positioning, and strategic marketing planning processes.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    // Module 2: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college12.id,
        title: `Consumer Behavior & Research - Lesson ${i}`,
        content: `Detailed lesson covering consumer behavior and marketing research. This lesson explores consumer decision-making process, psychological factors, research methods, and market intelligence gathering.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    // Module 3: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college12.id,
        title: `Product, Price & Distribution Strategy - Lesson ${i}`,
        content: `Comprehensive lesson covering product, price, and distribution strategies. This lesson explores product development lifecycle, pricing methods, channels of distribution, and logistics management.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    // Module 4: 150 lessons
    for (let i = 1; i <= 150; i++) {
      lessons.push({
        courseId: college12.id,
        title: `Promotion, Digital Marketing & Integrated Communications - Lesson ${i}`,
        content: `Advanced lesson covering promotion, digital marketing, and integrated marketing communications. This lesson explores advertising, personal selling, sales promotion, digital platforms, social media marketing, and IMC strategies.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 300 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 450 lessons for Marketing Fundamentals')
  }

  // college13: World Literature (INTERMEDIATE, 460 min) - 4 modules: 100 + 100 + 100 + 160 lessons
  const college13 = await prisma.course.findUnique({ where: { id: 'college13' } })
  if (college13) {
    console.log('Creating lessons for college13: World Literature...')
    await prisma.lesson.deleteMany({ where: { courseId: college13.id } })
    const lessons: any[] = []
    // Module 1: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college13.id,
        title: `Classical Literature & Ancient Epics - Lesson ${i}`,
        content: `Comprehensive lesson covering classical literature and ancient epics from around the world. This lesson explores Greek tragedy, Roman poetry, Indian epics, Chinese classics, and foundational literary traditions.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    // Module 2: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college13.id,
        title: `Medieval & Renaissance Literature - Lesson ${i}`,
        content: `Detailed lesson covering medieval and Renaissance literature across cultures. This lesson explores Dante, Chaucer, Shakespeare, European renaissance humanism, and the development of vernacular literature.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    // Module 3: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college13.id,
        title: `Enlightenment, Romanticism & Realism - Lesson ${i}`,
        content: `Comprehensive lesson covering Enlightenment, Romantic, and Realist literature movements. This lesson explores Voltaire, Goethe, Romantic poetry, Victorian literature, and the rise of realist and naturalist fiction.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    // Module 4: 160 lessons
    for (let i = 1; i <= 160; i++) {
      lessons.push({
        courseId: college13.id,
        title: `Modern & Contemporary World Literature - Lesson ${i}`,
        content: `Advanced lesson covering modern and contemporary world literature. This lesson explores modernist movements, postcolonial literature, contemporary global fiction, and emerging literary voices from diverse cultures.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 300 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 460 lessons for World Literature')
  }

  // college14: Philosophy Basics (INTERMEDIATE, 470 min) - 4 modules: 100 + 100 + 100 + 170 lessons
  const college14 = await prisma.course.findUnique({ where: { id: 'college14' } })
  if (college14) {
    console.log('Creating lessons for college14: Philosophy Basics...')
    await prisma.lesson.deleteMany({ where: { courseId: college14.id } })
    const lessons: any[] = []
    // Module 1: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college14.id,
        title: `Ancient Greek Philosophy - Lesson ${i}`,
        content: `Comprehensive lesson covering ancient Greek philosophical traditions. This lesson explores Pre-Socratic thinkers, Plato's theory of forms, Aristotle's logic and ethics, and the foundations of Western philosophy.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    // Module 2: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college14.id,
        title: `Medieval & Early Modern Philosophy - Lesson ${i}`,
        content: `Detailed lesson covering medieval and early modern philosophical developments. This lesson explores Augustine, Aquinas, Descartes, Locke, Berkeley, and the Enlightenment philosophers.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    // Module 3: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college14.id,
        title: `Epistemology & Metaphysics - Lesson ${i}`,
        content: `Comprehensive lesson covering epistemology and metaphysics. This lesson explores knowledge theory, skepticism, consciousness, identity, free will, and fundamental questions about reality and existence.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    // Module 4: 170 lessons
    for (let i = 1; i <= 170; i++) {
      lessons.push({
        courseId: college14.id,
        title: `Ethics, Political Philosophy & Contemporary Thought - Lesson ${i}`,
        content: `Advanced lesson covering ethics, political philosophy, and contemporary philosophical thought. This lesson explores virtue ethics, deontology, utilitarianism, social contract theory, and current philosophical debates.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 300 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 470 lessons for Philosophy Basics')
  }

  // college15: History of Art (INTERMEDIATE, 480 min) - 4 modules: 100 + 100 + 100 + 180 lessons
  const college15 = await prisma.course.findUnique({ where: { id: 'college15' } })
  if (college15) {
    console.log('Creating lessons for college15: History of Art...')
    await prisma.lesson.deleteMany({ where: { courseId: college15.id } })
    const lessons: any[] = []
    // Module 1: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college15.id,
        title: `Ancient & Classical Art - Lesson ${i}`,
        content: `Comprehensive lesson covering ancient and classical art traditions. This lesson explores Egyptian, Mesopotamian, Greek, and Roman art and architecture, including sculpture, painting, and monumental structures.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    // Module 2: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college15.id,
        title: `Medieval & Renaissance Art - Lesson ${i}`,
        content: `Detailed lesson covering medieval and Renaissance art movements. This lesson explores Byzantine, Gothic, Islamic art, and the Italian Renaissance with masters like Leonardo, Michelangelo, and Raphael.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    // Module 3: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college15.id,
        title: `Baroque to Modern Art Movements - Lesson ${i}`,
        content: `Comprehensive lesson covering Baroque through modern art movements. This lesson explores Caravaggio, Rembrandt, Impressionism, Post-Impressionism, Cubism, Surrealism, and abstract art movements.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    // Module 4: 180 lessons
    for (let i = 1; i <= 180; i++) {
      lessons.push({
        courseId: college15.id,
        title: `Contemporary Art, Global Perspectives & Art Analysis - Lesson ${i}`,
        content: `Advanced lesson covering contemporary art and global perspectives. This lesson explores Postmodernism, installation art, digital media, non-Western artistic traditions, and methodologies of art historical analysis.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 300 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 480 lessons for History of Art')
  }

  // college16: Communication Skills (INTERMEDIATE, 490 min) - 4 modules: 100 + 100 + 100 + 190 lessons
  const college16 = await prisma.course.findUnique({ where: { id: 'college16' } })
  if (college16) {
    console.log('Creating lessons for college16: Communication Skills...')
    await prisma.lesson.deleteMany({ where: { courseId: college16.id } })
    const lessons: any[] = []
    // Module 1: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college16.id,
        title: `Foundations of Communication - Lesson ${i}`,
        content: `Comprehensive lesson covering foundations of effective communication. This lesson explores communication models, verbal and non-verbal communication, active listening, and the communication process in various contexts.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    // Module 2: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college16.id,
        title: `Written Communication Skills - Lesson ${i}`,
        content: `Detailed lesson covering written communication skills for professional success. This lesson explores business writing, email etiquette, report writing, proposals, and technical documentation.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    // Module 3: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college16.id,
        title: `Oral Presentation & Public Speaking - Lesson ${i}`,
        content: `Comprehensive lesson covering oral presentation and public speaking skills. This lesson explores speech preparation, delivery techniques, audience engagement, visual aids, and overcoming speaking anxiety.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    // Module 4: 190 lessons
    for (let i = 1; i <= 190; i++) {
      lessons.push({
        courseId: college16.id,
        title: `Interpersonal, Group & Professional Communication - Lesson ${i}`,
        content: `Advanced lesson covering interpersonal, group, and professional communication. This lesson explores conflict resolution, negotiation, team collaboration, leadership communication, cross-cultural communication, and professional networking.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 300 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 490 lessons for Communication Skills')
  }

  console.log('Part 3 of College Category courses completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
