import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating lessons for College Category courses - Part 1...')

  // college2: Programming Fundamentals (INTERMEDIATE, 350 min) - 3 modules: 100 + 100 + 150 lessons
  const college2 = await prisma.course.findUnique({ where: { id: 'college2' } })
  if (college2) {
    console.log('Creating lessons for college2: Programming Fundamentals...')
    await prisma.lesson.deleteMany({ where: { courseId: college2.id } })
    const lessons: any[] = []
    // Module 1: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college2.id,
        title: `Introduction to Programming - Lesson ${i}`,
        content: `Comprehensive lesson introducing fundamental programming concepts. This lesson covers variables, data types, operators, and basic program structure to build a strong foundation in computer programming.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    // Module 2: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college2.id,
        title: `Control Structures & Functions - Lesson ${i}`,
        content: `Detailed lesson covering control structures and functions in programming. This lesson explores loops, conditionals, functions, scope, and parameter passing to develop structured programming skills.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    // Module 3: 150 lessons
    for (let i = 1; i <= 150; i++) {
      lessons.push({
        courseId: college2.id,
        title: `Data Structures & Algorithms - Lesson ${i}`,
        content: `Comprehensive lesson introducing data structures and algorithms. This lesson covers arrays, linked lists, stacks, queues, trees, sorting algorithms, and searching techniques essential for efficient programming.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 350 lessons for Programming Fundamentals')
  }

  // college3: Engineering Physics (ADVANCED, 360 min) - 3 modules: 100 + 100 + 160 lessons
  const college3 = await prisma.course.findUnique({ where: { id: 'college3' } })
  if (college3) {
    console.log('Creating lessons for college3: Engineering Physics...')
    await prisma.lesson.deleteMany({ where: { courseId: college3.id } })
    const lessons: any[] = []
    // Module 1: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college3.id,
        title: `Mechanics & Motion - Lesson ${i}`,
        content: `Detailed lesson covering classical mechanics for engineering students. This lesson explores kinematics, dynamics, Newton's laws, work, energy, power, and momentum with applications to engineering systems.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    // Module 2: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college3.id,
        title: `Waves, Optics & Thermodynamics - Lesson ${i}`,
        content: `Comprehensive lesson covering wave phenomena, optics, and thermodynamic principles. This lesson explores wave properties, light interference, lens systems, heat transfer, and thermodynamic cycles.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    // Module 3: 160 lessons
    for (let i = 1; i <= 160; i++) {
      lessons.push({
        courseId: college3.id,
        title: `Electromagnetism & Modern Physics - Lesson ${i}`,
        content: `Advanced lesson covering electromagnetism and modern physics concepts. This lesson explores electric fields, magnetic fields, electromagnetic waves, quantum mechanics, and relativity principles.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 360 lessons for Engineering Physics')
  }

  // college4: Digital Electronics (ADVANCED, 370 min) - 3 modules: 100 + 100 + 170 lessons
  const college4 = await prisma.course.findUnique({ where: { id: 'college4' } })
  if (college4) {
    console.log('Creating lessons for college4: Digital Electronics...')
    await prisma.lesson.deleteMany({ where: { courseId: college4.id } })
    const lessons: any[] = []
    // Module 1: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college4.id,
        title: `Digital Logic Fundamentals - Lesson ${i}`,
        content: `Comprehensive lesson introducing digital logic and number systems. This lesson covers binary, hexadecimal, octal representations, boolean algebra, logic gates, and fundamental digital circuit principles.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    // Module 2: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college4.id,
        title: `Combinational & Sequential Circuits - Lesson ${i}`,
        content: `Detailed lesson covering combinational and sequential logic circuits. This lesson explores adders, multiplexers, decoders, flip-flops, registers, counters, and finite state machines.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    // Module 3: 170 lessons
    for (let i = 1; i <= 170; i++) {
      lessons.push({
        courseId: college4.id,
        title: `Microprocessors & Digital Systems - Lesson ${i}`,
        content: `Advanced lesson covering microprocessor architecture and digital system design. This lesson explores CPU design, memory systems, I/O interfaces, bus architectures, and embedded system development.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 370 lessons for Digital Electronics')
  }

  // college5: Human Anatomy (ADVANCED, 380 min) - 3 modules: 100 + 100 + 180 lessons
  const college5 = await prisma.course.findUnique({ where: { id: 'college5' } })
  if (college5) {
    console.log('Creating lessons for college5: Human Anatomy...')
    await prisma.lesson.deleteMany({ where: { courseId: college5.id } })
    const lessons: any[] = []
    // Module 1: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college5.id,
        title: `Cell Biology & Tissues - Lesson ${i}`,
        content: `Comprehensive lesson covering cellular and tissue structure in the human body. This lesson explores cell organelles, tissue types, epithelial, connective, muscle, and nervous tissue organization and function.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    // Module 2: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college5.id,
        title: `Skeletal & Muscular Systems - Lesson ${i}`,
        content: `Detailed lesson covering the skeletal and muscular systems. This lesson explores bone structure, joint types, muscle anatomy, contraction mechanisms, and the integration of these systems for movement.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    // Module 3: 180 lessons
    for (let i = 1; i <= 180; i++) {
      lessons.push({
        courseId: college5.id,
        title: `Organ Systems & Integration - Lesson ${i}`,
        content: `Advanced lesson covering human organ systems and their integration. This lesson explores nervous, endocrine, cardiovascular, respiratory, digestive, and urinary systems with emphasis on homeostasis.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 380 lessons for Human Anatomy')
  }

  // college6: Biochemistry (ADVANCED, 390 min) - 3 modules: 100 + 100 + 190 lessons
  const college6 = await prisma.course.findUnique({ where: { id: 'college6' } })
  if (college6) {
    console.log('Creating lessons for college6: Biochemistry...')
    await prisma.lesson.deleteMany({ where: { courseId: college6.id } })
    const lessons: any[] = []
    // Module 1: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college6.id,
        title: `Biomolecules & Enzymes - Lesson ${i}`,
        content: `Comprehensive lesson covering biomolecules and enzyme chemistry. This lesson explores carbohydrates, lipids, proteins, nucleic acids, enzyme kinetics, and the role of cofactors in biochemical reactions.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    // Module 2: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: college6.id,
        title: `Metabolic Pathways - Lesson ${i}`,
        content: `Detailed lesson covering cellular metabolic pathways. This lesson explores glycolysis, Krebs cycle, electron transport chain, photosynthesis, and the regulation of metabolic processes.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    // Module 3: 190 lessons
    for (let i = 1; i <= 190; i++) {
      lessons.push({
        courseId: college6.id,
        title: `Molecular Biology & Genetics - Lesson ${i}`,
        content: `Advanced lesson covering molecular biology and genetic processes. This lesson explores DNA replication, transcription, translation, gene regulation, genetic engineering, and molecular techniques.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 390 lessons for Biochemistry')
  }

  console.log('Part 1 of College Category courses completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
